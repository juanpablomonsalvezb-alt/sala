-- ─────────────────────────────────────────────────────────────────────────────
-- Sala — Schema SQL (compatible con PostgreSQL 14+, prefijo sala_)
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- Enums
do $$ begin
  create type sala_creator_plan as enum ('free', 'creator', 'pro');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type sala_subscription_status as enum ('active', 'cancelled', 'past_due');
exception when duplicate_object then null;
end $$;

-- sala_profiles
create table if not exists public.sala_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  is_creator  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists sala_profiles_email_idx on public.sala_profiles (email);

-- sala_creators
create table if not exists public.sala_creators (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.sala_profiles (id) on delete cascade,
  name              text not null,
  slug              text not null unique,
  specialty         text not null,
  bio               text not null,
  bio_long          text,
  linkedin_url      text,
  price_clp         integer not null default 0 check (price_clp >= 0),
  plan              sala_creator_plan not null default 'free',
  publish_frequency text not null default 'semanal',
  subscriber_count  integer not null default 0 check (subscriber_count >= 0),
  stripe_account_id text,
  created_at        timestamptz not null default now()
);
create index if not exists sala_creators_slug_idx    on public.sala_creators (slug);
create index if not exists sala_creators_user_id_idx on public.sala_creators (user_id);

-- sala_posts
create table if not exists public.sala_posts (
  id                uuid primary key default uuid_generate_v4(),
  creator_id        uuid not null references public.sala_creators (id) on delete cascade,
  title             text not null,
  slug              text not null,
  excerpt           text,
  content           text not null default '',
  is_free           boolean not null default false,
  published_at      timestamptz,
  read_time_minutes integer not null default 1,
  created_at        timestamptz not null default now(),
  unique (creator_id, slug)
);
create index if not exists sala_posts_creator_id_idx on public.sala_posts (creator_id);
create index if not exists sala_posts_published_idx  on public.sala_posts (published_at desc nulls last);
create index if not exists sala_posts_is_free_idx    on public.sala_posts (is_free);

-- sala_subscriptions
create table if not exists public.sala_subscriptions (
  id                     uuid primary key default uuid_generate_v4(),
  subscriber_id          uuid not null references public.sala_profiles (id) on delete cascade,
  creator_id             uuid not null references public.sala_creators (id) on delete cascade,
  status                 sala_subscription_status not null default 'active',
  stripe_subscription_id text unique,
  price_clp              integer not null check (price_clp >= 0),
  created_at             timestamptz not null default now(),
  cancelled_at           timestamptz,
  unique (subscriber_id, creator_id)
);
create index if not exists sala_subscriptions_subscriber_idx on public.sala_subscriptions (subscriber_id);
create index if not exists sala_subscriptions_creator_idx    on public.sala_subscriptions (creator_id);
create index if not exists sala_subscriptions_status_idx     on public.sala_subscriptions (status);

-- Trigger: auto-crear sala_profile
create or replace function public.sala_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.sala_profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists sala_on_auth_user_created on auth.users;
create trigger sala_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.sala_handle_new_user();

-- Trigger: subscriber_count
create or replace function public.sala_update_subscriber_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT' and new.status = 'active') then
    update public.sala_creators set subscriber_count = subscriber_count + 1 where id = new.creator_id;
  elsif (tg_op = 'UPDATE') then
    if (old.status != 'active' and new.status = 'active') then
      update public.sala_creators set subscriber_count = subscriber_count + 1 where id = new.creator_id;
    elsif (old.status = 'active' and new.status != 'active') then
      update public.sala_creators set subscriber_count = greatest(subscriber_count - 1, 0) where id = new.creator_id;
    end if;
  elsif (tg_op = 'DELETE' and old.status = 'active') then
    update public.sala_creators set subscriber_count = greatest(subscriber_count - 1, 0) where id = old.creator_id;
  end if;
  return coalesce(new, old);
end;
$$;
drop trigger if exists sala_on_subscription_change on public.sala_subscriptions;
create trigger sala_on_subscription_change
  after insert or update or delete on public.sala_subscriptions
  for each row execute procedure public.sala_update_subscriber_count();

-- RLS
alter table public.sala_profiles      enable row level security;
alter table public.sala_creators      enable row level security;
alter table public.sala_posts         enable row level security;
alter table public.sala_subscriptions enable row level security;

-- Policies: sala_profiles
drop policy if exists "sala_profiles: select own"  on public.sala_profiles;
drop policy if exists "sala_profiles: insert own"  on public.sala_profiles;
drop policy if exists "sala_profiles: update own"  on public.sala_profiles;
create policy "sala_profiles: select own" on public.sala_profiles for select using (auth.uid() = id);
create policy "sala_profiles: insert own" on public.sala_profiles for insert with check (auth.uid() = id);
create policy "sala_profiles: update own" on public.sala_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policies: sala_creators
drop policy if exists "sala_creators: select public" on public.sala_creators;
drop policy if exists "sala_creators: insert own"    on public.sala_creators;
drop policy if exists "sala_creators: update own"    on public.sala_creators;
drop policy if exists "sala_creators: delete own"    on public.sala_creators;
create policy "sala_creators: select public" on public.sala_creators for select using (true);
create policy "sala_creators: insert own"    on public.sala_creators for insert with check (auth.uid() = user_id);
create policy "sala_creators: update own"    on public.sala_creators for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sala_creators: delete own"    on public.sala_creators for delete using (auth.uid() = user_id);

-- sala_post_quotes (Citas extraídas para OG sharing)
create table if not exists public.sala_post_quotes (
  id                uuid primary key default uuid_generate_v4(),
  post_id           uuid not null references public.sala_posts (id) on delete cascade,
  text              text not null,
  position          integer not null,
  og_image_url      text,
  created_at        timestamptz not null default now()
);
create index if not exists sala_post_quotes_post_id_idx on public.sala_post_quotes (post_id);

-- Policies: sala_posts
drop policy if exists "sala_posts: select free"               on public.sala_posts;
drop policy if exists "sala_posts: select subscribed or owner" on public.sala_posts;
drop policy if exists "sala_posts: select drafts owner"       on public.sala_posts;
drop policy if exists "sala_posts: insert own"                on public.sala_posts;
drop policy if exists "sala_posts: update own"                on public.sala_posts;
drop policy if exists "sala_posts: delete own"                on public.sala_posts;
create policy "sala_posts: select free" on public.sala_posts for select
  using (is_free = true and published_at is not null and published_at <= now());
create policy "sala_posts: select subscribed or owner" on public.sala_posts for select
  using (
    published_at is not null and published_at <= now() and (
      exists (select 1 from public.sala_creators c where c.id = sala_posts.creator_id and c.user_id = auth.uid())
      or
      exists (select 1 from public.sala_subscriptions s where s.creator_id = sala_posts.creator_id and s.subscriber_id = auth.uid() and s.status = 'active')
    )
  );
create policy "sala_posts: select drafts owner" on public.sala_posts for select
  using (published_at is null and exists (select 1 from public.sala_creators c where c.id = sala_posts.creator_id and c.user_id = auth.uid()));
create policy "sala_posts: insert own" on public.sala_posts for insert
  with check (exists (select 1 from public.sala_creators c where c.id = sala_posts.creator_id and c.user_id = auth.uid()));
create policy "sala_posts: update own" on public.sala_posts for update
  using (exists (select 1 from public.sala_creators c where c.id = sala_posts.creator_id and c.user_id = auth.uid()));
create policy "sala_posts: delete own" on public.sala_posts for delete
  using (exists (select 1 from public.sala_creators c where c.id = sala_posts.creator_id and c.user_id = auth.uid()));

-- Policies: sala_subscriptions
-- Solo lectura desde clientes. Las suscripciones se escriben únicamente via
-- service_role (webhooks MP/Stripe). INSERT/UPDATE/DELETE bloqueados a
-- anon/authenticated tras auditoría 2026-05-21 (acceso gratis al contenido pagado).
drop policy if exists "sala_subscriptions: select own"        on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: select as creator" on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: insert own"        on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: update own"        on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: delete own"        on public.sala_subscriptions;
create policy "sala_subscriptions: select own"        on public.sala_subscriptions for select using (auth.uid() = subscriber_id);
create policy "sala_subscriptions: select as creator" on public.sala_subscriptions for select
  using (exists (select 1 from public.sala_creators c where c.id = sala_subscriptions.creator_id and c.user_id = auth.uid()));
revoke insert, update, delete on public.sala_subscriptions from anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- sala_disciplines — FK normalizada (DECISIÓN IRREVERSIBLE)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.sala_disciplines (
  id          text primary key,
  name_es     text not null,
  name_en     text not null,
  icon        text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

insert into public.sala_disciplines (id, name_es, name_en, icon, sort_order) values
  ('economia',        'Economía',          'Economics',        '📈', 1),
  ('derecho',         'Derecho',           'Law',              '⚖️', 2),
  ('medicina',        'Medicina',          'Medicine',         '🩺', 3),
  ('finanzas',        'Finanzas',          'Finance',          '💼', 4),
  ('arquitectura',    'Arquitectura',      'Architecture',     '🏛️', 5),
  ('ingenieria',      'Ingeniería',        'Engineering',      '⚙️', 6),
  ('psicologia',      'Psicología',        'Psychology',       '🧠', 7),
  ('negocios',        'Negocios',          'Business',         '📊', 8),
  ('tecnologia',      'Tecnología',        'Technology',       '💻', 9),
  ('educacion',       'Educación',         'Education',        '📚', 10),
  ('salud-publica',   'Salud Pública',     'Public Health',    '🏥', 11),
  ('contabilidad',    'Contabilidad',      'Accounting',       '🔢', 12),
  ('marketing',       'Marketing',         'Marketing',        '📣', 13),
  ('recursos-humanos','Recursos Humanos',  'Human Resources',  '👥', 14),
  ('medioambiente',   'Medioambiente',     'Environment',      '🌿', 15),
  ('politica',        'Ciencia Política',  'Political Science','🏛', 16),
  ('sociologia',      'Sociología',        'Sociology',        '🤝', 17),
  ('comunicaciones',  'Comunicaciones',    'Communications',   '📡', 18)
on conflict (id) do nothing;

-- Agregar discipline_id a sala_creators (con retrocompatibilidad)
alter table public.sala_creators
  add column if not exists discipline_id text references public.sala_disciplines(id);

-- Agregar verified a sala_creators (con retrocompatibilidad)
alter table public.sala_creators
  add column if not exists verified boolean not null default false;
alter table public.sala_creators
  add column if not exists verified_at timestamptz;

-- Index para directorio público
create index if not exists sala_creators_discipline_idx on public.sala_creators (discipline_id);
create index if not exists sala_creators_verified_idx   on public.sala_creators (verified) where verified = true;

-- sala_creator_directory — Vista materializada para el directorio público
create materialized view if not exists public.sala_creator_directory as
  select
    c.id,
    c.slug,
    c.name,
    c.specialty,
    c.bio,
    c.price_clp,
    c.plan,
    c.subscriber_count,
    c.publish_frequency,
    c.discipline_id,
    d.name_es  as discipline_name_es,
    d.name_en  as discipline_name_en,
    d.icon     as discipline_icon,
    c.verified,
    c.created_at
  from public.sala_creators c
  left join public.sala_disciplines d on d.id = c.discipline_id
  where c.plan in ('creator', 'pro')
  order by d.sort_order, c.subscriber_count desc;

create unique index if not exists sala_creator_directory_id_idx on public.sala_creator_directory (id);

-- Función para refrescar la vista
create or replace function public.sala_refresh_creator_directory()
returns void language plpgsql security definer as $$
begin
  refresh materialized view concurrently public.sala_creator_directory;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- sala_reading_events — Grafo de Curiosidad (particionado por mes)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.sala_reading_events (
  id              uuid default gen_random_uuid(),
  reader_id       uuid not null references auth.users(id) on delete cascade,
  article_id      uuid not null references public.sala_posts(id) on delete cascade,
  event_type      text not null check (event_type in ('started','reading','completed','abandoned','revisited')),
  scroll_depth_pct numeric(5,2),
  reading_time_s  integer,
  visible_pct     numeric(5,2),
  occurred_at     timestamptz not null default now(),
  primary key (id, occurred_at)
) partition by range (occurred_at);

create table if not exists public.sala_reading_events_2026_05
  partition of public.sala_reading_events
  for values from ('2026-05-01') to ('2026-06-01');

create table if not exists public.sala_reading_events_2026_06
  partition of public.sala_reading_events
  for values from ('2026-06-01') to ('2026-07-01');

create index if not exists sala_reading_events_reader_idx on public.sala_reading_events (reader_id, occurred_at desc);
create index if not exists sala_reading_events_article_idx on public.sala_reading_events (article_id);
create index if not exists sala_reading_events_completed_idx on public.sala_reading_events (event_type) where event_type = 'completed';

-- ─────────────────────────────────────────────────────────────────────────────
-- sala_curiosity_graph — Un row por lector × tema
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.sala_curiosity_graph (
  reader_id         uuid not null references auth.users(id) on delete cascade,
  discipline_id     text not null references public.sala_disciplines(id),
  affinity_score    numeric(5,4) default 0 check (affinity_score >= 0 and affinity_score <= 1),
  articles_completed integer default 0,
  total_reading_s   integer default 0,
  trend             text check (trend in ('rising','stable','declining')),
  last_read_at      timestamptz,
  primary key (reader_id, discipline_id)
);

create index if not exists sala_curiosity_graph_reader_idx on public.sala_curiosity_graph (reader_id, affinity_score desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- sala_fx_rates — Tipos de cambio multi-moneda (actualizado vía cron)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.sala_fx_rates (
  from_currency text not null default 'USD',
  to_currency   text not null,
  rate          numeric(15,6) not null,
  updated_at    timestamptz default now(),
  primary key (from_currency, to_currency)
);

insert into public.sala_fx_rates (from_currency, to_currency, rate) values
  ('USD', 'CLP', 920.00),
  ('USD', 'COP', 3950.00),
  ('USD', 'MXN', 17.20),
  ('USD', 'PEN', 3.72),
  ('USD', 'ARS', 1050.00),
  ('USD', 'USD', 1.00)
on conflict (from_currency, to_currency) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Superadmin
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.sala_profiles
  add column if not exists is_superadmin boolean not null default false;

-- Asignar superadmin al fundador
update public.sala_profiles
  set is_superadmin = true
  where email = 'juanpablo.monsalvezb@gmail.com';

-- RLS helper: verifica si el usuario actual es superadmin
create or replace function public.is_superadmin()
returns boolean language sql security definer stable as $$
  select coalesce(
    (select is_superadmin from public.sala_profiles where id = auth.uid()),
    false
  )
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.sala_creators enable row level security;
alter table public.sala_profiles enable row level security;
alter table public.sala_posts enable row level security;
alter table public.sala_subscriptions enable row level security;

-- sala_profiles
create policy if not exists "Perfil propio visible para todos"
  on public.sala_profiles for select using (true);

create policy if not exists "Usuario actualiza su propio perfil"
  on public.sala_profiles for update using (auth.uid() = id);

-- sala_creators: lectura pública, escritura solo propia
create policy if not exists "Creadores visibles para todos"
  on public.sala_creators for select using (true);

create policy if not exists "Usuario crea su propio perfil de creador"
  on public.sala_creators for insert with check (auth.uid() = user_id);

create policy if not exists "Creador actualiza su propio perfil"
  on public.sala_creators for update using (auth.uid() = user_id);

-- sala_posts: libres visibles para todos, de pago solo para suscriptores
create policy if not exists "Posts libres visibles para todos"
  on public.sala_posts for select
  using (
    is_free = true
    or auth.uid() in (
      select subscriber_id from public.sala_subscriptions
      where creator_id = sala_posts.creator_id
        and status = 'active'
    )
    or auth.uid() in (
      select user_id from public.sala_creators
      where id = sala_posts.creator_id
    )
  );

create policy if not exists "Creador gestiona sus propios posts"
  on public.sala_posts for all
  using (
    auth.uid() in (
      select user_id from public.sala_creators where id = creator_id
    )
  );

-- sala_subscriptions
create policy if not exists "Suscriptor ve sus propias suscripciones"
  on public.sala_subscriptions for select
  using (auth.uid() = subscriber_id);

create policy if not exists "Creador ve sus suscriptores"
  on public.sala_subscriptions for select
  using (
    auth.uid() in (
      select user_id from public.sala_creators where id = creator_id
    )
  );

-- ─── Nuevos campos en sala_creators (migración) ───────────────────────────────
alter table public.sala_creators
  add column if not exists publication_name text,
  add column if not exists pull_quote text,
  add column if not exists cover_image_url text;

-- sala_creator_nominations (Nominaciones de nuevos creadores por usuarios)
create table if not exists public.sala_creator_nominations (
  id                uuid primary key default uuid_generate_v4(),
  nominator_id      uuid,
  nominator_email   text not null,
  creator_name      text not null,
  creator_specialty text not null,
  creator_bio       text,
  creator_linkedin  text,
  why_nominate      text not null,
  discipline_id     text references public.sala_disciplines(id),
  status            text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists sala_creator_nominations_status_idx on public.sala_creator_nominations (status);
create index if not exists sala_creator_nominations_discipline_idx on public.sala_creator_nominations (discipline_id);
create index if not exists sala_creator_nominations_created_idx on public.sala_creator_nominations (created_at desc);

-- RLS para nominations
alter table public.sala_creator_nominations enable row level security;
create policy "Anyone can create a nomination" on public.sala_creator_nominations for insert with check (true);
create policy "Admin views all nominations" on public.sala_creator_nominations for select using (
  exists(select 1 from public.sala_profiles where id = auth.uid() and is_superadmin = true)
);
create policy "Nominator sees own" on public.sala_creator_nominations for select using (
  nominator_id = auth.uid() or nominator_email = (select email from public.sala_profiles where id = auth.uid())
);

-- sala_newsletter_subscriptions (Suscripciones al newsletter del fundador)
create table if not exists public.sala_newsletter_subscriptions (
  id                uuid primary key default uuid_generate_v4(),
  email             text not null unique,
  name              text,
  newsletter_type   text not null default 'construyendo' check (newsletter_type in ('construyendo')),
  subscribed        boolean not null default true,
  unsubscribed_at   timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists sala_newsletter_subscriptions_email_idx on public.sala_newsletter_subscriptions (email);
create index if not exists sala_newsletter_subscriptions_type_idx on public.sala_newsletter_subscriptions (newsletter_type);
create index if not exists sala_newsletter_subscriptions_subscribed_idx on public.sala_newsletter_subscriptions (subscribed);

-- RLS para newsletter subscriptions
alter table public.sala_newsletter_subscriptions enable row level security;
create policy "Anyone can subscribe to newsletter" on public.sala_newsletter_subscriptions for insert with check (true);
create policy "Subscribers see only their own" on public.sala_newsletter_subscriptions for select using (
  auth.jwt() ->> 'email' = email
);
