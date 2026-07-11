# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
npm run icons    # Regenerate brand icons in public/icons from the source logo (sharp)
```

There is no test suite. Both `package-lock.json` and `pnpm-lock.yaml` are committed; prefer `npm` unless the working tree already uses pnpm.

## Environment

Copy `.env.example` to `.env.local`. Every integration degrades gracefully when its keys are missing, so the site runs without them:

- `ANTHROPIC_API_KEY` — powers all AI features (chat, estimator, case-study, greeting, sentiment). `ANTHROPIC_MODEL` overrides the model (default `claude-sonnet-4-6`).
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` — contact form email delivery. `CONTACT_FROM_EMAIL` is optional.

## Architecture

Next.js 14 **App Router** site (single marketing/agency site for "Umvix"), TypeScript strict mode, Tailwind, heavy client-side motion (Framer Motion, GSAP, react-three-fiber). Import alias `@/*` maps to the repo root.

### Layout & global chrome

`app/layout.tsx` is a **server component** that only wires fonts, metadata, `<Navbar>`, `<main>`, and `<Footer>`. All client-side global chrome is isolated in `components/SiteChrome.tsx` (`"use client"`) so the layout itself stays a server component. `SiteChrome` mounts the providers and every floating/overlay widget (ambient background, custom cursor, loading screen, scroll progress, easter egg, sentiment + sound toggles, chat widget, hash-scroll handler). Add new site-wide client chrome here, not in the layout.

Routes live under `app/(routes)/` (a route group, so no `/routes` URL segment). `app/(routes)/template.tsx` wraps every page in a Framer Motion fade/scale transition that re-runs on navigation.

### Theming: the accent/mood system

`components/providers/AccentProvider.tsx` is the central theming context (`useAccent()`). A `Mood` (`neutral | excited | unsure | urgent | calm`) maps to intensity/speed values that are written to CSS custom properties (`--accent-intensity`, `--accent-speed`) on `documentElement`. CSS across the site (see `app/globals.css`) reads these vars, so mood changes ripple through animations without React re-renders. It also owns the optional Web Audio click sound (`soundEnabled`, `playClick`). The sentiment feature sets the mood based on user text, which visually re-tints the whole site.

Brand design tokens are CSS variables in `app/globals.css` (`:root`) — `--brand-red`, `--brand-black`, `--brand-gradient`, `--nav-height`, etc. — surfaced to Tailwind via `tailwind.config.ts` (`colors.brand.*`, `bg-brand-gradient`). Use these tokens rather than hardcoding colors.

### AI features (Anthropic)

`lib/anthropic.ts` is the single integration point: a lazy singleton client via `getAnthropicClient()` (throws a named `MissingApiKeyError` when the key is absent), the shared `CLAUDE_MODEL`, and `UMVIX_CONTEXT` — a system-prompt string of company facts (services, pricing ranges, contact) prepended to most AI prompts. Update company details in `UMVIX_CONTEXT`.

Each AI feature is a `route.ts` under `app/api/` (all `runtime = "nodejs"`) paired with a client component in `components/ai/` or `components/effects/`:

- `chat` — streams a `ReadableStream` of plain-text deltas (`ChatWidget`).
- `estimate` / `case-study` — prompt Claude for **strict JSON** and parse with an `extractJson` helper that strips code fences before `JSON.parse`.
- `greeting` / `sentiment` — return small JSON; both ship keyword/string **fallbacks** so the feature works even with no API key.

Route handlers catch `MissingApiKeyError` and return a friendly `503` rather than leaking errors.

### Contact form

`lib/contact/` holds the flow: `types.ts` (payload shape), `submitContact.ts` (client `fetch` wrapper to `/api/contact`), `sendContactEmail.ts` (`validateContactPayload` + Resend send). `app/api/contact/route.ts` validates then sends, returning `503` for config errors (missing `RESEND_API_KEY`/`CONTACT_TO_EMAIL`) and `400` for bad input.

### Component organization

`components/` is grouped by role: `home/`, `about/`, `contact/`, `portfolio/`, `services/` (page sections); `effects/` (global overlays/widgets); `motion/` (reusable animation primitives like `Reveal`, `CountUp`, `MagneticButton`, `TiltCard`); `three/` (react-three-fiber scenes); `ai/` (AI-backed widgets); `providers/`. Shared reactive hooks (e.g. `useReducedMotion`) live in `lib/hooks.ts`.

Animations should respect `useReducedMotion()` from `lib/hooks.ts`. In-page anchor navigation uses the GSAP-based smooth-scroll in `lib/hashScroll.ts` (offsets by `--nav-height`), mounted via `components/HashScroll.tsx`.
