# Umvix PostPilot

A mobile-first PWA for tracking the team's manual social-media posting. It does **not** auto-publish anything — the team posts manually on each platform, then marks it done here. PostPilot handles the daily checklist, reminders, missed-post accountability, streaks and an admin analytics dashboard.

Every active member is expected to post on every active platform, every day — there is no per-person assignment or schedule to configure.

Built with Next.js 14 (App Router, TypeScript), Tailwind CSS, Supabase (Postgres + Auth + RLS + Storage) and Web Push (VAPID).

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New project**.
   - Name: `umvix-postpilot`, pick a strong DB password, region close to your team (e.g. Mumbai/Singapore for Pakistan).
2. Wait for the project to provision, then open **SQL Editor** and run, in order:
   - `supabase/migrations/0001_schema.sql`  (tables, RLS, triggers, storage buckets)
   - `supabase/migrations/0002_seed.sql`   (Umvix organization + the 5 starting platforms)
   - `supabase/migrations/0003_allow_member_delete.sql` (lets an admin delete a member permanently)
3. **Disable public signup** (the app is invite-only):
   - Authentication → Sign In / Up → turn **off** "Allow new users to sign up".
   - Note: keep it ON just for your very first sign-in (step 5), then turn it off — or create your first user from the dashboard instead (Authentication → Users → Add user → Create new user, with "Auto Confirm").
4. Set the redirect URL: Authentication → URL Configuration →
   - Site URL: your deployed URL (e.g. `https://postpilot.yourdomain.com`)
   - Additional redirect URLs: `http://localhost:3001/auth/callback`, `https://<your-domain>/auth/callback`
5. **First admin:** the first user who signs in automatically becomes the admin (database trigger). Create that user (dashboard "Add user" is easiest), sign in once, done.

Grab your keys from **Settings → API**: Project URL, `anon` key, `service_role` key.

## 2. Generate VAPID keys (Web Push)

```bash
npx web-push generate-vapid-keys
```

Copy the public and private keys into your env vars (below).

## 3. Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Where it comes from |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (server-only — never expose) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | same command |
| `VAPID_SUBJECT` | `mailto:you@yourdomain.com` |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | deployed origin, e.g. `https://postpilot.vercel.app` |

## 4. Local development

```bash
npm install
npm run dev        # http://localhost:3001
npm test           # scheduling / timezone / EOD sweep tests
```

To exercise the cron routes locally:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3001/api/cron/day-roller
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3001/api/cron/midday-reminder
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3001/api/cron/eod-sweep
```

## 5. Deploy to Vercel

This app lives in the `Dashboard/` folder of the `umvix-website` repo, so the
Vercel project must set **Root Directory = `Dashboard`**.

1. [vercel.com/new](https://vercel.com/new) → import the `umvix-website` repo.
2. **Root Directory → Edit → select `Dashboard`.** (Framework auto-detects as Next.js.)
3. Add every env var from the table above (Production + Preview + Development).
   `NEXT_PUBLIC_APP_URL` must be the final public URL, e.g. `https://dashboard.umvix.com`.
4. Deploy. Then Settings → Domains → add your subdomain and point DNS at Vercel.
5. Back in Supabase → Authentication → URL Configuration: set **Site URL** to the
   production URL and add `https://<your-domain>/auth/callback` to the redirect
   allow-list. Sign-in breaks without this.

## 6. Cron jobs (hourly tick)

The app needs an **hourly** tick: each user's local midnight, reminder time and
end-of-day cutoff lands on a different UTC hour.

- **Vercel Hobby (free)** allows only 2 crons at *daily* frequency — not enough.
  Instead, `.github/workflows/postpilot-cron.yml` (in the repo root) runs the
  hourly tick on **GitHub Actions**, for free. Add two repository secrets under
  **Settings → Secrets and variables → Actions**:
  - `POSTPILOT_URL` — e.g. `https://dashboard.umvix.com`
  - `POSTPILOT_CRON_SECRET` — the same value as `CRON_SECRET` on Vercel

  Trigger a first run by hand from the **Actions** tab (`Run workflow`) to verify.

- **Vercel Pro:** you can drop GitHub Actions and add a `vercel.json` instead:

  ```json
  {
    "crons": [
      { "path": "/api/cron/day-roller", "schedule": "0 * * * *" },
      { "path": "/api/cron/midday-reminder", "schedule": "30 * * * *" },
      { "path": "/api/cron/eod-sweep", "schedule": "15 * * * *" }
    ]
  }
  ```

  Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically.

What each route does:

| Route | Job |
| --- | --- |
| `/api/cron/day-roller` | Creates today's `pending` rows when a user's local day starts |
| `/api/cron/midday-reminder` | Nudges users still holding unposted platforms, at their local reminder time |
| `/api/cron/eod-sweep` | After each user's local cutoff: marks misses, notifies them, digests admins |

All three are idempotent — a duplicate, retried or skipped run is harmless. The
Today screen also self-heals: opening it seeds that day's rows if the roller
hasn't yet.

## 7. Timezones — how "today" works

The cron tick fires in **UTC**. Every decision (what "today" is, reminder time, end-of-day cutoff) is computed **per user** in their own IANA timezone (`date-fns-tz`). All timestamps are stored in UTC; `posting_logs.scheduled_date` is the user's local calendar date. The admin digest waits until every member's local day has actually closed.

## 8. iOS push caveat

iOS supports Web Push only on **iOS 16.4+** and **only when the app is installed to the home screen** (Share → Add to Home Screen). The in-app install instructions surface this. Until installed, iOS users still get every reminder in the in-app notification bell.

## 9. Architecture notes

- **Idempotent crons** — `posting_logs` upserts against a unique `(user_id, platform_id, scheduled_date)` key with `ignoreDuplicates`; notifications insert against a unique `(user_id, type, ref_date)` key. Retried/duplicated cron runs are no-ops.
- **Pure planners** — `lib/cron/plan.ts` turns a DB snapshot into actions with zero I/O; `lib/cron/run.ts` executes them. The risky logic is unit-tested in `tests/`.
- **Offline** — the service worker (`public/sw.js`) caches the app shell + GET APIs (stale-while-revalidate); "Mark as Posted" while offline queues into an IndexedDB outbox and syncs on reconnect. A queued post that syncs after the sweep marked it missed **wins** and is flagged `marked_late`.
- **RLS** — employees read/write only their own logs; admins manage everything in their org; cron routes use the service role.
- **Push fallback** — every notification is written to `notifications_log` first (in-app bell); Web Push is best-effort on top. Dead subscriptions (404/410) are pruned automatically.

## Roadmap (not in v1)

- Per-person platform assignments / posting schedules (the `assignments` table and
  `Schedule` type still exist in the schema, unused, if this is ever wanted back)
- Content calendar with drafts/ideas attached to future dates
- Weekly email summary to admins (Resend)
- CSV export of posting history
- Per-platform posting time targets ("Instagram by 6 PM") with earlier reminders
- WhatsApp reminder fallback via Twilio
- Posting-consistency analytics per platform
