-- ─────────────────────────────────────────────────────────────────────────────
-- Sala — Schema SQL completo
-- Base de datos: Supabase (PostgreSQL 15+)
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensiones necesarias
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type creator_plan as enum ('free', 'creator', 'pro');
create type subscription_status as enum ('active', 'cancelled', 'past_due');

-- ─── Tabla: profiles ─────────────────────────────────────────────────────────
-- Extiende auth.users con datos de perfil público

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  is_creator  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Índice para búsqueda por email
create index if not exists profiles_email_idx on public.profiles (email);

-- ─── Tabla: creators ─────────────────────────────────────────────────────────

create table if not exists public.creators (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  name              text not null,
  slug              text not null unique,
  specialty         text not null,
  bio               text not null,
  bio_long          text,
  linkedin_url      text,
  price_clp         integer not null default 0 check (price_clp >= 0),
  plan              creator_plan not null default 'free',
  publish_frequency text not null default 'semanal',
  subscriber_count  integer not null default 0 check (subscriber_count >= 0),
  stripe_account_id text,
  created_at        timestamptz not null default now()
);

-- Índices
create index if not exists creators_slug_idx    on public.creators (slug);
create index if not exists creators_user_id_idx on public.creators (user_id);
create index if not exists creators_plan_idx    on public.creators (plan);

-- ─── Tabla: posts ────────────────────────────────────────────────────────────

create table if not exists public.posts (
  id                  uuid primary key default uuid_generate_v4(),
  creator_id          uuid not null references public.creators (id) on delete cascade,
  title               text not null,
  slug                text not null,
  excerpt             text,
  content             text not null default '',
  is_free             boolean not null default false,
  published_at        timestamptz,
  read_time_minutes   integer not null default 1 check (read_time_minutes > 0),
  created_at          timestamptz not null default now(),
  unique (creator_id, slug)
);

-- Índices
create index if not exists posts_creator_id_idx   on public.posts (creator_id);
create index if not exists posts_slug_idx         on public.posts (slug);
create index if not exists posts_published_at_idx on public.posts (published_at desc nulls last);
create index if not exists posts_is_free_idx      on public.posts (is_free);

-- ─── Tabla: subscriptions ────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  subscriber_id           uuid not null references public.profiles (id) on delete cascade,
  creator_id              uuid not null references public.creators (id) on delete cascade,
  status                  subscription_status not null default 'active',
  stripe_subscription_id  text unique,
  price_clp               integer not null check (price_clp >= 0),
  created_at              timestamptz not null default now(),
  cancelled_at            timestamptz,
  unique (subscriber_id, creator_id)
);

-- Índices
create index if not exists subscriptions_subscriber_id_idx on public.subscriptions (subscriber_id);
create index if not exists subscriptions_creator_id_idx    on public.subscriptions (creator_id);
create index if not exists subscriptions_status_idx        on public.subscriptions (status);

-- ─── Trigger: auto-crear profile al registrar usuario ────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Trigger: actualizar subscriber_count en creators ────────────────────────

create or replace function public.update_subscriber_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (tg_op = 'INSERT' and new.status = 'active') then
    update public.creators
    set subscriber_count = subscriber_count + 1
    where id = new.creator_id;

  elsif (tg_op = 'UPDATE') then
    if (old.status != 'active' and new.status = 'active') then
      update public.creators
      set subscriber_count = subscriber_count + 1
      where id = new.creator_id;
    elsif (old.status = 'active' and new.status != 'active') then
      update public.creators
      set subscriber_count = greatest(subscriber_count - 1, 0)
      where id = new.creator_id;
    end if;

  elsif (tg_op = 'DELETE' and old.status = 'active') then
    update public.creators
    set subscriber_count = greatest(subscriber_count - 1, 0)
    where id = old.creator_id;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists on_subscription_change on public.subscriptions;
create trigger on_subscription_change
  after insert or update or delete on public.subscriptions
  for each row execute procedure public.update_subscriber_count();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.creators     enable row level security;
alter table public.posts        enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles ────────────────────────────────────────────────────────────────────

-- SELECT: cada usuario ve solo su propio perfil
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

-- INSERT: solo el propio usuario (el trigger lo hace también)
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- UPDATE: solo el propio usuario
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Creators ────────────────────────────────────────────────────────────────────

-- SELECT: público — cualquiera puede ver creators
create policy "creators: select public"
  on public.creators for select
  using (true);

-- INSERT: solo el usuario autenticado puede crear su propio creator
create policy "creators: insert own"
  on public.creators for insert
  with check (auth.uid() = user_id);

-- UPDATE: solo el dueño puede editar su creator
create policy "creators: update own"
  on public.creators for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: solo el dueño
create policy "creators: delete own"
  on public.creators for delete
  using (auth.uid() = user_id);

-- Posts ───────────────────────────────────────────────────────────────────────

-- SELECT posts gratuitos: público
create policy "posts: select free"
  on public.posts for select
  using (
    is_free = true
    and published_at is not null
    and published_at <= now()
  );

-- SELECT posts de pago: solo suscriptores activos o el creador dueño
create policy "posts: select subscribed or owner"
  on public.posts for select
  using (
    published_at is not null
    and published_at <= now()
    and (
      -- El creador dueño siempre puede ver sus posts
      exists (
        select 1 from public.creators c
        where c.id = posts.creator_id
          and c.user_id = auth.uid()
      )
      or
      -- Suscriptor activo
      exists (
        select 1 from public.subscriptions s
        where s.creator_id = posts.creator_id
          and s.subscriber_id = auth.uid()
          and s.status = 'active'
      )
    )
  );

-- SELECT borradores: solo el creador dueño
create policy "posts: select drafts owner"
  on public.posts for select
  using (
    published_at is null
    and exists (
      select 1 from public.creators c
      where c.id = posts.creator_id
        and c.user_id = auth.uid()
    )
  );

-- INSERT: solo el creador dueño
create policy "posts: insert own"
  on public.posts for insert
  with check (
    exists (
      select 1 from public.creators c
      where c.id = posts.creator_id
        and c.user_id = auth.uid()
    )
  );

-- UPDATE: solo el creador dueño
create policy "posts: update own"
  on public.posts for update
  using (
    exists (
      select 1 from public.creators c
      where c.id = posts.creator_id
        and c.user_id = auth.uid()
    )
  );

-- DELETE: solo el creador dueño
create policy "posts: delete own"
  on public.posts for delete
  using (
    exists (
      select 1 from public.creators c
      where c.id = posts.creator_id
        and c.user_id = auth.uid()
    )
  );

-- Subscriptions ───────────────────────────────────────────────────────────────

-- SELECT: cada usuario ve sus propias suscripciones
create policy "subscriptions: select own"
  on public.subscriptions for select
  using (auth.uid() = subscriber_id);

-- SELECT: el creador puede ver quiénes lo siguen
create policy "subscriptions: select as creator"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.creators c
      where c.id = subscriptions.creator_id
        and c.user_id = auth.uid()
    )
  );

-- INSERT: usuario autenticado puede suscribirse
create policy "subscriptions: insert own"
  on public.subscriptions for insert
  with check (auth.uid() = subscriber_id);

-- UPDATE: el usuario puede cancelar/actualizar su suscripción
create policy "subscriptions: update own"
  on public.subscriptions for update
  using (auth.uid() = subscriber_id)
  with check (auth.uid() = subscriber_id);

-- DELETE: el usuario puede eliminar su suscripción
create policy "subscriptions: delete own"
  on public.subscriptions for delete
  using (auth.uid() = subscriber_id);
