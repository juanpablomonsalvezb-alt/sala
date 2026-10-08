-- Insignia "Oficial": cuentas de marca operadas por el propio equipo Nebbuler
-- (ej. el creador "nebbuler" que publica noticias/contenido generado por los
-- bots internos). Deliberadamente distinta de `verified`, que promete a los
-- lectores "Sin IA" — ver 20260928000000_creator_verified.sql y /sin-ia.
alter table public.sala_creators
  add column if not exists is_official boolean not null default false;
