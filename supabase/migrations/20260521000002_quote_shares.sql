-- ═══════════════════════════════════════════════════════════════════════════
-- Quote-as-Image Viral Engine — 2026-05-21
--
-- Tracking de cada vez que un lector convierte un párrafo seleccionado en
-- imagen compartible (Instagram Stories, WhatsApp Status, X, LinkedIn).
--
-- Objetivo: medir qué creadores producen frases más virales y qué posts
-- generan más sharing externo. Alimenta el dashboard "Quotes virales" del
-- creador y la home de descubrimiento (Most Quoted).
--
-- Flujo:
--   1. Lector selecciona texto en src/app/[creator]/[post]/page.tsx
--   2. <QuoteSelector /> abre <QuoteShareModal />
--   3. Al generar/compartir la imagen → POST /api/track/quote
--   4. Service role inserta fila en sala_quote_shares
--   5. Creator dueño puede SELECT sus propias filas (analytics)
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.sala_quote_shares (
  id              uuid primary key default uuid_generate_v4(),
  creator_id      uuid not null references public.sala_creators (id) on delete cascade,
  post_id         uuid not null references public.sala_posts (id) on delete cascade,
  -- Primeros 100 chars del texto seleccionado (para identificar la frase viral)
  text_preview    text not null check (char_length(text_preview) between 1 and 100),
  -- Largo total de la frase original (para análisis de "longitud óptima viral")
  text_length     integer not null check (text_length between 20 and 280),
  -- Plataforma destino: ig-story, ig-square, whatsapp, twitter, linkedin, copy, download
  channel         text not null check (channel in (
    'ig-story', 'ig-square', 'whatsapp', 'twitter', 'linkedin', 'copy', 'download'
  )),
  -- Formato visual: 1:1 (square) o 9:16 (story)
  aspect_ratio    text not null default '1:1' check (aspect_ratio in ('1:1', '9:16')),
  -- Geo + UA básicos para entender canales virales
  country_code    text,
  user_agent      text,
  -- IP hash (no la IP cruda) para deduplicación sin perder privacidad
  ip_hash         text,
  created_at      timestamptz not null default now()
);

-- Índices para queries del dashboard
create index if not exists sala_quote_shares_creator_idx
  on public.sala_quote_shares (creator_id, created_at desc);
create index if not exists sala_quote_shares_post_idx
  on public.sala_quote_shares (post_id, created_at desc);
create index if not exists sala_quote_shares_channel_idx
  on public.sala_quote_shares (channel, created_at desc);

-- RLS: solo service_role escribe, creator dueño lee sus propias filas
alter table public.sala_quote_shares enable row level security;

drop policy if exists "sala_quote_shares: select own"    on public.sala_quote_shares;
drop policy if exists "sala_quote_shares: insert service" on public.sala_quote_shares;
drop policy if exists "sala_quote_shares: no update"     on public.sala_quote_shares;
drop policy if exists "sala_quote_shares: no delete"     on public.sala_quote_shares;

-- Creator dueño puede ver sus propias quote_shares (analytics viral)
create policy "sala_quote_shares: select own" on public.sala_quote_shares for select
  using (
    exists (
      select 1 from public.sala_creators c
      where c.id = sala_quote_shares.creator_id
        and c.user_id = auth.uid()
    )
  );

-- INSERT solo desde service_role (ninguna policy con WITH CHECK = bloquea clientes)
-- service_role bypassa RLS por diseño, así que no necesita policy explícita.
-- No agregamos UPDATE/DELETE policies → bloqueadas por default con RLS on.

comment on table public.sala_quote_shares is
  'Quote-as-Image Viral Engine: cada conversión de texto seleccionado a imagen compartible. Service role escribe; creator dueño lee.';
