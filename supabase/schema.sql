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
drop policy if exists "sala_subscriptions: select own"        on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: select as creator" on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: insert own"        on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: update own"        on public.sala_subscriptions;
drop policy if exists "sala_subscriptions: delete own"        on public.sala_subscriptions;
create policy "sala_subscriptions: select own"        on public.sala_subscriptions for select using (auth.uid() = subscriber_id);
create policy "sala_subscriptions: select as creator" on public.sala_subscriptions for select
  using (exists (select 1 from public.sala_creators c where c.id = sala_subscriptions.creator_id and c.user_id = auth.uid()));
create policy "sala_subscriptions: insert own"        on public.sala_subscriptions for insert with check (auth.uid() = subscriber_id);
create policy "sala_subscriptions: update own"        on public.sala_subscriptions for update using (auth.uid() = subscriber_id) with check (auth.uid() = subscriber_id);
create policy "sala_subscriptions: delete own"        on public.sala_subscriptions for delete using (auth.uid() = subscriber_id);
