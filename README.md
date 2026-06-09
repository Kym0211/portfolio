# Kavyam — Portfolio

A personal portfolio built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, featuring an animated 3D node-network hero (react-three-fiber) and a persistent guestbook. Deployable on Vercel.

## Stack

- **Next.js 15** (App Router, React 19) + **TypeScript**
- **Tailwind CSS v4** — design tokens live in [`app/globals.css`](app/globals.css) (`@theme`)
- **react-three-fiber** + **three** — the hero network graph
- **Upstash Redis** (via Vercel Marketplace) — guestbook persistence + IP rate limiting
- Fonts: **Bricolage Grotesque** (display) + **Sora** (body) via `next/font/google`

## Project structure

```
app/
  layout.tsx            # fonts, SEO metadata, <html>/<body>
  page.tsx              # composes the sections
  globals.css           # design tokens + ported component styles
  icon.svg              # favicon
  api/guestbook/route.ts# GET (list) + POST (add) handlers
components/
  Nav, Hero, About, Experience, Work, SayHi, Contact, Reveal
  ProjectCard.tsx       # 3D tilt + cursor glow cards
  Guestbook.tsx         # optimistic UI + honeypot
  hero/
    HeroBackground.tsx  # WebGL detection + dynamic import wrapper
    NetworkCanvas.tsx   # <Canvas>, dpr cap, visibility/reduced-motion gating
    NetworkScene.tsx    # the nodes / edges / pulses graph + animation loop
data/                   # typed content arrays — edit these to change the site
  site.ts, skills.ts, experience.ts, projects.ts
lib/
  guestbook.ts          # store, validation, rate limiting (server-only)
```

**Editing content:** everything is in `data/`. Update your links/coffee URL in
`data/site.ts`, fill in the Chainflow dates in `data/experience.ts`, and adjust
projects/skills as needed.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

The guestbook works out of the box in dev using an **in-memory store** (seeded
with two sample notes). Data resets on restart and is per-instance — fine for
local development. Configure Upstash (below) for real persistence.

```bash
npm run build    # production build
npm start        # serve the production build
```

## Guestbook persistence (Upstash Redis)

The route handler in `app/api/guestbook/route.ts` reads/writes through
`lib/guestbook.ts`, which uses Upstash Redis when credentials are present and
falls back to an in-memory store otherwise.

It validates input (length caps, control-char stripping, non-empty), escapes on
render (React renders messages as text — no HTML injection), and adds spam
protection via a **honeypot** field plus **per-IP rate limiting** (5 posts / 60s).

### Set it up

1. In the Vercel dashboard: **Storage → Marketplace → Upstash → Redis**, create a
   database, and connect it to this project. Vercel injects the credentials as
   environment variables automatically.
2. Or create a database at <https://console.upstash.com> and copy its REST URL
   and token.

The code accepts either naming convention:

| Variable | Notes |
| --- | --- |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | injected by the Vercel Marketplace integration |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | standalone Upstash naming |

For local testing against a real database, copy `.env.example` to `.env.local`
and fill in the values:

```bash
cp .env.example .env.local
# then edit .env.local
```

No secrets are referenced in client code — all storage access is `server-only`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new> (framework auto-detected as Next.js).
3. Add the **Upstash Redis** integration from the Marketplace and link it to the
   project (this provisions the env vars). Without it, the site still deploys —
   the guestbook just won't persist across requests.
4. Deploy. Subsequent pushes to `main` deploy automatically.

Or from the CLI:

```bash
npm i -g vercel
vercel            # preview deployment
vercel --prod     # production
```

## Performance & accessibility

- The 3D canvas is **client-only and lazy-loaded** (`next/dynamic`, `ssr:false`),
  so three.js stays out of the initial bundle.
- `dpr` is capped at `[1, 2]`; the render loop **pauses** when the tab is hidden
  or the hero scrolls offscreen (IntersectionObserver).
- **`prefers-reduced-motion`** renders a single static frame instead of animating.
- A **CSS-gradient fallback** is shown while the canvas loads and on devices
  without WebGL, keeping mobile fast.
- Section content is server-rendered (good SEO), with scroll-reveal layered on top.

## License

Personal project © 2026 Kavyam Singh.
