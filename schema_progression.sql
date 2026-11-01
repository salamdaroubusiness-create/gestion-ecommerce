-- GSC Business Center : suivi de progression (contenus terminés par chaque client).
-- À exécuter une fois dans Supabase > SQL Editor, APRÈS schema_contenus.sql. Peut être relancé sans risque.

create table if not exists public.progression (
  user_id uuid not null references auth.users(id) on delete cascade,
  contenu_id uuid not null references public.contenus(id) on delete cascade,
  fait_le timestamptz not null default now(),
  primary key (user_id, contenu_id)
);
alter table public.progression enable row level security;

-- Un client lit, coche et décoche seulement ses propres contenus (et seulement ceux qu'il a le droit de voir).
-- L'administrateur lit la progression de tous les clients.
drop policy if exists "progression lecture" on public.progression;
create policy "progression lecture" on public.progression for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "progression ajout" on public.progression;
create policy "progression ajout" on public.progression for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.contenus c where c.id = contenu_id));
drop policy if exists "progression modif" on public.progression;
create policy "progression modif" on public.progression for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "progression suppression" on public.progression;
create policy "progression suppression" on public.progression for delete to authenticated
  using (user_id = auth.uid());
