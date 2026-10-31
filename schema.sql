-- GSC Business Center : plateforme e-commerce sur Supabase
-- À exécuter une fois dans Supabase > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nom text not null,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.shops (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint shops_data_valide check (
    jsonb_typeof(data) = 'object'
    and jsonb_typeof(data->'p') = 'array' and jsonb_typeof(data->'k') = 'array'
    and jsonb_array_length(data->'p') <= 500 and jsonb_array_length(data->'k') <= 500
    and pg_column_size(data) < 600000)
);
create table if not exists public.settings (k text primary key, v text not null);

-- Création automatique du profil à l'inscription (le rôle est toujours "client").
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, email, nom)
  values (new.id, new.email, coalesce(nullif(left(trim(new.raw_user_meta_data->>'nom'), 100), ''), 'Client'));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profils des comptes déjà existants (sans effet sur un projet neuf).
insert into public.profiles(id, email, nom)
  select id, email, 'Client' from auth.users on conflict (id) do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

-- Suppression d'un compte client par l'administrateur.
create or replace function public.admin_delete_client(uid uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Réservé à l’administrateur'; end if;
  delete from auth.users where id = uid
    and exists (select 1 from public.profiles p where p.id = uid and p.role = 'client');
end $$;
revoke all on function public.admin_delete_client(uuid) from public, anon;
grant execute on function public.admin_delete_client(uuid) to authenticated;

-- Sécurité au niveau des lignes : chaque client ne voit que ses données, l'admin voit tout.
alter table public.profiles enable row level security;
alter table public.shops    enable row level security;
alter table public.settings enable row level security;

drop policy if exists "profil lecture" on public.profiles;
create policy "profil lecture" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "boutique lecture" on public.shops;
create policy "boutique lecture" on public.shops for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "boutique ajout" on public.shops;
create policy "boutique ajout" on public.shops for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "boutique modif" on public.shops;
create policy "boutique modif" on public.shops for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "annonce lecture" on public.settings;
create policy "annonce lecture" on public.settings for select to authenticated using (true);
drop policy if exists "annonce admin" on public.settings;
create policy "annonce admin" on public.settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- PREMIER ADMINISTRATEUR : après avoir créé votre compte sur le site (et confirmé l'e-mail),
-- exécutez cette ligne en remplaçant l'adresse :
-- update public.profiles set role = 'admin' where email = 'admin@votre-domaine.com';
