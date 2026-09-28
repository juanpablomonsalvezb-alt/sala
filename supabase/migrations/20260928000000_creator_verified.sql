-- Sello «Sin IA»: solo creadores verificados a mano por Nebbuler
-- (identidad + compromiso de no publicar texto generado con IA, ver /sin-ia).
alter table public.sala_creators
  add column if not exists verified boolean not null default false;
