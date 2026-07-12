-- ═══════════════════════════════════════════════════════════════════════
-- Umvix PostPilot — seed data
-- Run AFTER 0001_schema.sql.
--
-- Creates the organization and the five starting platforms. The first user
-- who signs in becomes the admin automatically (see handle_new_user trigger).
-- ═══════════════════════════════════════════════════════════════════════

with org as (
  insert into public.organizations (name, default_timezone, eod_cutoff_time, reminder_time)
  values ('Umvix', 'Asia/Karachi', '21:00', '15:00')
  returning id
)
insert into public.platforms (org_id, name, description, brand_color, url_template, sort_order)
select org.id, p.name, p.description, p.brand_color, p.url_template, p.sort_order
from org,
(values
  ('Instagram', 'Photos, reels and stories',            '#E1306C', 'https://instagram.com',   0),
  ('Facebook',  'Page posts and community updates',     '#1877F2', 'https://facebook.com',    1),
  ('X (Twitter)', 'Short-form posts and threads',       '#111111', 'https://x.com',           2),
  ('Medium',    'Long-form articles and blogs',         '#00AB6C', 'https://medium.com',      3),
  ('LinkedIn',  'Professional updates and articles',    '#0A66C2', 'https://linkedin.com',    4)
) as p(name, description, brand_color, url_template, sort_order);
