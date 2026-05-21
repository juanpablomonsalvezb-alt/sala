-- ─────────────────────────────────────────────────────────────────────────────
-- AUTO-PRESS RELEASE ENGINE
--
-- 1. sala_press_releases       — drafts generados por IA tras detección de hito
-- 2. sala_media_contacts       — base de medios LATAM tier 2/3
-- 3. sala_press_outreach_log   — auditoría 1×1 de envíos PR → medio
--
-- Acceso: SOLO service_role. UI superadmin pasa por endpoints /api/admin que
-- validan isSuperadmin() y luego usan admin client.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ── sala_press_releases ──────────────────────────────────────────────────────
create table if not exists public.sala_press_releases (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references public.sala_creators (id) on delete cascade,
  milestone_type text check (milestone_type in (
    'first_100','first_500','first_1000',
    'mrr_1k_usd','mrr_5k_usd','mrr_10k_usd',
    'one_year'
  )),
  milestone_value integer,
  milestone_reached_at timestamptz not null default now(),
  pr_title text,
  pr_body_es text,
  pr_quote text,
  ai_generated boolean default true,
  status text not null default 'draft' check (status in (
    'draft','approved','sent','published','rejected'
  )),
  reviewed_by uuid references public.sala_profiles (id) on delete set null,
  reviewed_at timestamptz,
  sent_at timestamptz,
  sent_to_count integer default 0,
  response_count integer default 0,
  published_count integer default 0,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists sala_press_releases_creator_idx
  on public.sala_press_releases (creator_id);
create index if not exists sala_press_releases_status_idx
  on public.sala_press_releases (status);
create index if not exists sala_press_releases_milestone_idx
  on public.sala_press_releases (creator_id, milestone_type);

-- ── sala_media_contacts ──────────────────────────────────────────────────────
create table if not exists public.sala_media_contacts (
  id uuid primary key default uuid_generate_v4(),
  outlet_name text not null,
  country text check (country in (
    'CL','AR','MX','CO','PE','UY','EC','PA','RD','BR','ES','US'
  )),
  tier integer check (tier between 1 and 3),
  sector text default 'general',
  email text not null,
  contact_name text,
  language text default 'es',
  status text default 'active' check (status in (
    'active','paused','bounced','unsubscribed'
  )),
  last_contacted_at timestamptz,
  response_rate numeric(3,2) default 0,
  notes text,
  created_at timestamptz not null default now(),
  unique(email)
);

create index if not exists sala_media_contacts_status_idx
  on public.sala_media_contacts (status);
create index if not exists sala_media_contacts_sector_idx
  on public.sala_media_contacts (sector);
create index if not exists sala_media_contacts_country_idx
  on public.sala_media_contacts (country);

-- ── sala_press_outreach_log ──────────────────────────────────────────────────
create table if not exists public.sala_press_outreach_log (
  id uuid primary key default uuid_generate_v4(),
  press_release_id uuid not null references public.sala_press_releases (id) on delete cascade,
  media_contact_id uuid not null references public.sala_media_contacts (id) on delete cascade,
  sent_at timestamptz default now(),
  response_status text check (response_status in (
    'sent','opened','replied','published','bounced','unsubscribed'
  )),
  response_at timestamptz,
  notes text,
  unique(press_release_id, media_contact_id)
);

create index if not exists sala_press_outreach_log_pr_idx
  on public.sala_press_outreach_log (press_release_id);
create index if not exists sala_press_outreach_log_media_idx
  on public.sala_press_outreach_log (media_contact_id);

-- ── RLS: solo service_role ───────────────────────────────────────────────────
alter table public.sala_press_releases     enable row level security;
alter table public.sala_media_contacts     enable row level security;
alter table public.sala_press_outreach_log enable row level security;

revoke all on public.sala_press_releases     from anon, authenticated;
revoke all on public.sala_media_contacts     from anon, authenticated;
revoke all on public.sala_press_outreach_log from anon, authenticated;

-- ── Seed: ~30 medios LATAM tier 2/3 ──────────────────────────────────────────
insert into public.sala_media_contacts
  (outlet_name, country, tier, sector, email, contact_name)
values
  ('Diario Financiero',       'CL', 2, 'finanzas', 'redaccion@df.cl',                 null),
  ('Pulso La Tercera',        'CL', 2, 'finanzas', 'prensa@latercera.com',            null),
  ('El Mostrador Mercados',   'CL', 2, 'finanzas', 'redaccion@elmostrador.cl',        null),
  ('Emol Economía',           'CL', 2, 'general',  'mesa@emol.com',                   null),
  ('La Tercera Pulso Trader', 'CL', 3, 'finanzas', 'pulsotrader@latercera.com',       null),
  ('El Cronista',             'AR', 2, 'finanzas', 'redaccion@cronista.com',          null),
  ('Apertura',                'AR', 2, 'finanzas', 'redaccion@apertura.com',          null),
  ('iProUP',                  'AR', 3, 'tech',     'redaccion@iproup.com',            null),
  ('Infobae Economía',        'AR', 2, 'general',  'cartas@infobae.com',              null),
  ('La Nación Economía',      'AR', 2, 'general',  'cartaslectores@lanacion.com.ar',  null),
  ('Expansión MX',            'MX', 2, 'finanzas', 'editor@expansion.mx',             null),
  ('El Economista MX',        'MX', 2, 'finanzas', 'cartas@eleconomista.mx',          null),
  ('Forbes México',           'MX', 2, 'general',  'editorial@forbes.com.mx',         null),
  ('Bloomberg Línea',         'MX', 2, 'finanzas', 'redaccion@bloomberglinea.com',    null),
  ('El Financiero MX',        'MX', 2, 'finanzas', 'cartas@elfinanciero.com.mx',      null),
  ('La República CO',         'CO', 2, 'finanzas', 'opinion@larepublica.com.co',      null),
  ('Dinero CO',               'CO', 2, 'finanzas', 'prensa@dinero.com',               null),
  ('Semana Negocios',         'CO', 2, 'general',  'redaccion@semana.com',            null),
  ('Portafolio CO',           'CO', 2, 'finanzas', 'redaccion@portafolio.co',         null),
  ('Semana Económica PE',     'PE', 2, 'finanzas', 'redaccion@semanaeconomica.com',   null),
  ('Gestión PE',              'PE', 2, 'finanzas', 'redaccion@gestion.pe',            null),
  ('El Comercio Negocios',    'PE', 2, 'general',  'redaccion@elcomercio.pe',         null),
  ('El Observador UY',        'UY', 2, 'general',  'redaccion@elobservador.com.uy',   null),
  ('Búsqueda UY',             'UY', 3, 'general',  'redaccion@busqueda.com.uy',       null),
  ('Primicias EC',            'EC', 3, 'general',  'redaccion@primicias.ec',          null),
  ('La Estrella de Panamá',   'PA', 3, 'general',  'redaccion@laestrella.com.pa',     null),
  ('Diario Libre RD',         'RD', 3, 'general',  'redaccion@diariolibre.com',       null),
  ('America Economia',        'CL', 2, 'finanzas', 'redaccion@americaeconomia.com',   null),
  ('LatamList',               'US', 3, 'startups', 'editor@latamlist.com',            null),
  ('Contxto',                 'MX', 3, 'startups', 'hello@contxto.com',               null),
  ('Bloomberg Línea LATAM',   'US', 2, 'finanzas', 'latam@bloomberglinea.com',        null),
  ('TechCrunch en Español',   'US', 2, 'tech',     'tips@techcrunch.com',             null)
on conflict (email) do nothing;
