-- ═══════════════════════════════════════════════════════════════════════
-- Umvix PostPilot — schema
-- Run this in the Supabase SQL Editor (or `supabase db push`).
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Tables ────────────────────────────────────────────────────────────────

create table public.organizations (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  default_timezone text not null default 'Asia/Karachi',
  eod_cutoff_time  time not null default '21:00',
  reminder_time    time not null default '15:00',
  -- Whether a late "Mark posted" still counts toward streaks.
  late_counts_for_streaks boolean not null default false,
  -- Whether admins get the positive "all done ✅" digest.
  send_positive_digest    boolean not null default true,
  -- Whether employees may fully disable accountability notifications.
  allow_notification_optout boolean not null default false,
  created_at       timestamptz not null default now()
);

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  org_id       uuid not null references public.organizations(id),
  role         text not null default 'employee' check (role in ('admin', 'employee')),
  full_name    text not null default '',
  avatar_url   text,
  timezone     text not null default 'Asia/Karachi',
  is_active    boolean not null default true,
  -- { reminder_time?: "15:00", midday_enabled?: bool, eod_enabled?: bool }
  notification_prefs jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create table public.platforms (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.organizations(id),
  name         text not null,
  description  text not null default '',
  logo_url     text,
  brand_color  text not null default '#ff1f3d',
  url_template text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  archived_at  timestamptz,
  created_by   uuid references public.profiles(id),
  created_at   timestamptz not null default now(),
  unique (org_id, name)
);

create table public.assignments (
  id          uuid primary key default gen_random_uuid(),
  platform_id uuid not null references public.platforms(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  -- { "type": "daily" } | { "type": "weekdays", "days": [1,3,5] }  (ISO: 1=Mon … 7=Sun)
  -- v2 roadmap: { "type": "weekly_quota", "count": 3 }
  schedule    jsonb not null default '{"type":"daily"}'::jsonb,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (platform_id, user_id)
);

create table public.posting_logs (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references public.organizations(id),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  platform_id    uuid not null references public.platforms(id) on delete cascade,
  scheduled_date date not null,
  status         text not null default 'pending'
                 check (status in ('pending', 'posted', 'missed', 'skipped')),
  posted_at      timestamptz,
  post_url       text,
  note           text,
  marked_late    boolean not null default false,
  created_at     timestamptz not null default now(),
  unique (user_id, platform_id, scheduled_date)
);

create index posting_logs_user_date_idx on public.posting_logs (user_id, scheduled_date);
create index posting_logs_org_date_idx  on public.posting_logs (org_id, scheduled_date);

create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.notifications_log (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  type      text not null check (type in ('midday_reminder', 'eod_missed', 'admin_digest')),
  payload   jsonb not null default '{}'::jsonb,
  -- Local date the notification refers to; used for idempotency checks.
  ref_date  date not null,
  sent_at   timestamptz not null default now(),
  delivered boolean not null default false,
  read_at   timestamptz,
  unique (user_id, type, ref_date)
);

create index notifications_log_user_idx on public.notifications_log (user_id, sent_at desc);

-- ── Helper functions (SECURITY DEFINER so RLS policies don't recurse) ─────

create or replace function public.auth_org_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select org_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ── New-user trigger ───────────────────────────────────────────────────────
-- Every auth user gets a profile in the single seeded organization.
-- The very first user becomes admin; invited users take the role embedded
-- in their invite metadata (set by the invite API route).

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  org uuid;
  member_count integer;
begin
  select id into org from public.organizations order by created_at limit 1;
  select count(*) into member_count from public.profiles;

  insert into public.profiles (id, org_id, role, full_name, timezone)
  values (
    new.id,
    org,
    case
      when member_count = 0 then 'admin'
      else coalesce(new.raw_user_meta_data ->> 'role', 'employee')
    end,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(
      new.raw_user_meta_data ->> 'timezone',
      (select default_timezone from public.organizations where id = org)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Row Level Security ─────────────────────────────────────────────────────

alter table public.organizations      enable row level security;
alter table public.profiles           enable row level security;
alter table public.platforms          enable row level security;
alter table public.assignments        enable row level security;
alter table public.posting_logs       enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notifications_log  enable row level security;

-- organizations: members read; admins update.
create policy org_select on public.organizations
  for select using (id = public.auth_org_id());
create policy org_update on public.organizations
  for update using (id = public.auth_org_id() and public.is_admin());

-- profiles: members can see everyone in their org (needed for the team grid
-- and leaderboard); users update themselves; admins update anyone in org.
create policy profiles_select on public.profiles
  for select using (org_id = public.auth_org_id());
create policy profiles_update_self on public.profiles
  for update using (id = auth.uid());
create policy profiles_update_admin on public.profiles
  for update using (org_id = public.auth_org_id() and public.is_admin());

-- platforms: members read (UI filters archived for employees); admins write.
create policy platforms_select on public.platforms
  for select using (org_id = public.auth_org_id());
create policy platforms_insert on public.platforms
  for insert with check (org_id = public.auth_org_id() and public.is_admin());
create policy platforms_update on public.platforms
  for update using (org_id = public.auth_org_id() and public.is_admin());

-- assignments: employees read their own; admins read/write all in org.
create policy assignments_select_own on public.assignments
  for select using (user_id = auth.uid());
create policy assignments_admin_all on public.assignments
  for all using (
    public.is_admin()
    and exists (select 1 from public.platforms p
                where p.id = platform_id and p.org_id = public.auth_org_id())
  );

-- posting_logs: employees read + update their own (mark posted); inserts and
-- status sweeps happen server-side with the service role. Admins read all.
create policy logs_select_own on public.posting_logs
  for select using (user_id = auth.uid());
create policy logs_update_own on public.posting_logs
  for update using (user_id = auth.uid());
create policy logs_select_admin on public.posting_logs
  for select using (org_id = public.auth_org_id() and public.is_admin());

-- push_subscriptions: strictly own.
create policy push_own on public.push_subscriptions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- notifications_log: users read their own and mark them read.
create policy notif_select_own on public.notifications_log
  for select using (user_id = auth.uid());
create policy notif_update_own on public.notifications_log
  for update using (user_id = auth.uid());

-- ── Storage: logos + avatars ───────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "logos read"  on storage.objects for select using (bucket_id = 'logos');
create policy "logos write" on storage.objects
  for insert with check (bucket_id = 'logos' and public.is_admin());
create policy "logos update" on storage.objects
  for update using (bucket_id = 'logos' and public.is_admin());
create policy "avatars read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars write own" on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars update own" on storage.objects
  for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
