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

1. Create a Redis database at <https://console.upstash.com> (or via the Upstash
   integration in the Cloudflare dashboard) and copy its REST URL and token.

The code accepts either naming convention:

| Variable | Notes |
| --- | --- |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | the names used here / in `.dev.vars` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | standalone Upstash naming |

For local testing against a real database, fill the values into **`.dev.vars`**
(used by `npm run preview`) — it's git-ignored. Plain `npm run dev` reads
`.env.local` if you prefer that for the Next dev server.

No secrets are referenced in client code — all storage access is `server-only`.

## Deploy to Cloudflare Workers (OpenNext)

This app runs on Cloudflare Workers via the [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
adapter. Config lives in `wrangler.jsonc` + `open-next.config.ts`.

```bash
# 1. Build the Worker and preview it locally on the real Workers runtime:
npm run preview            # http://localhost:8787

# 2. Log in to Cloudflare (one-time, opens a browser):
npx wrangler login

# 3. Deploy:
npm run deploy
```

After the first deploy, add your Upstash credentials as **Worker secrets** so the
guestbook persists, then redeploy:

```bash
npx wrangler secret put KV_REST_API_URL
npx wrangler secret put KV_REST_API_TOKEN
npm run deploy
```

(Without the secrets the site still deploys — the guestbook just uses the
in-memory fallback and won't persist.)

### Custom domain

Since the domain's DNS is on Cloudflare: in the dashboard go to
**Workers & Pages → kavyam-portfolio → Settings → Domains & Routes → Add custom
domain**, enter your domain, and Cloudflare wires the DNS + SSL automatically.
Then update `url` in `data/site.ts` to that domain (for correct OG/canonical URLs).

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
