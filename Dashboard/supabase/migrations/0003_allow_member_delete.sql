-- ═══════════════════════════════════════════════════════════════════════
-- Umvix PostPilot — allow permanent member deletion
-- Run in the Supabase SQL Editor (after 0001 + 0002).
--
-- Deleting a member cascades through their history, but platforms they
-- created should survive them — detach the creator reference instead of
-- blocking the delete.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.platforms
  drop constraint if exists platforms_created_by_fkey;

alter table public.platforms
  add constraint platforms_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete set null;
