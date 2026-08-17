# Vexez — Architecture & Build Plan

This document is the source of truth for how Vexez goes from a marketing
landing page to a working CRM / inventory management product. Read this
before adding a feature — it tells you where it belongs and why.

---

## 1. What Vexez actually is

Vexez is two connected things:

1. **Marketing site** (done) — the public `Home.tsx` page: hero, features,
   pricing, testimonials, FAQ. Its only job is to convert a visitor into a
   signup.
2. **Product** (next) — the authenticated CRM/inventory dashboard a
   customer lands in after signup: orders, products, profit tracking,
   customers, team management, billing.

These are **two separate apps that share a design system**, not one app
with a login wall bolted on. The marketing site stays fast, static-ish,
and SEO-friendly. The dashboard is a heavier, auth-gated, real-time SPA.
Splitting them means the marketing bundle never carries dashboard weight,
and the dashboard never has to worry about SEO or public caching.

---

## 2. Two ways to structure this — and which one we're using

**Option A — Monorepo, two apps (chosen).**
```
vexez/
  apps/
    web/          <- marketing site (current Home.tsx work)
    dashboard/    <- CRM app (new)
  packages/
    ui/           <- shared shadcn components, design tokens
    config/       <- shared eslint/tailwind/tsconfig
  server/         <- Express API
```
Pros: one repo, one PR history, shared UI kit, independent deploys.
Cons: needs a workspace tool (npm workspaces / Turborepo).

**Option B — Single app, `/dashboard` as a route inside the existing
Vite app**, gated by an auth check.
Pros: zero extra tooling, fastest to start.
Cons: marketing and dashboard bundles ship together forever; harder to
give the dashboard its own deploy cadence, caching rules, or eventually
a different framework (e.g. Next.js for the dashboard if SSR data-heavy
pages are needed later).

**Decision: Option A**, using **npm workspaces** (no need for Turborepo
yet — add it later only if build times actually hurt). This is the
standard shape for a SaaS with a public site + authenticated product,
and it's what lets us swap Clerk, add Socket.io, and scale the API
independently of the landing page.

---

## 3. Full tech stack and why each piece was picked

| Layer | Choice | Why |
|---|---|---|
| Marketing frontend | React + TS + Tailwind + shadcn + Vite | Already built. Fast, static-hostable. |
| Dashboard frontend | React + TS + Tailwind + shadcn + Vite | Same design language, SPA is fine since it's behind auth (no SEO need). |
| Routing | react-router-dom | Already in use; nested routes fit a dashboard shell (`/dashboard/orders`, `/dashboard/products`, ...). |
| Animation | framer-motion (+ GSAP only for complex scroll/timeline sequences if ever needed) | framer-motion covers 95% of dashboard micro-interactions; don't add GSAP until there's a concrete need. |
| API server | Node.js + Express | Matches your existing POS/inventory backend conventions (RBAC middleware, permission_code system). |
| ORM / DB access | Prisma | Type-safe queries, migrations, and a schema file that doubles as documentation of the data model. |
| Database (dev) | PostgreSQL, local | Matches production engine exactly — no SQLite drift. |
| Database (prod) | Neon (serverless Postgres) | Branching per PR/preview environment, scales to zero, works well with serverless/edge deploys. |
| Cache / queues / pub-sub | Redis | Session/rate-limit storage, Socket.io adapter for multi-instance scaling, BullMQ job queues (email sending, report generation). |
| Real-time | Socket.io | Live order status, live dashboard numbers, notifications — matches the "updates live, always" promise on the marketing page. |
| Auth | Clerk | Handles signup/login/org (multi-tenant) out of the box, issues JWTs Express can verify, saves building password reset / MFA / session management from scratch. |
| Payments | Stripe | Subscription billing for the pricing tiers (Starter/Standard/Enterprise), usage metering later if needed. |
| Email | **Resend** (primary), Nodemailer kept as an SMTP fallback | See §4. |
| File/image storage | (to decide when needed — Cloudflare R2 or S3) | Not needed yet; product photos will need it eventually. |
| Deployment | Vercel (web + dashboard), Railway/Render (Express API + Redis), Neon (DB) | Standard, low-ops split; Express can move to a container later if it outgrows PaaS. |

---

## 4. Email: Resend vs Nodemailer — decision

**Use Resend as the default.** Reasons:
- It's an actual email API (like Stripe is to payments) — you get
  delivery/open tracking, retries, and domain reputation handled for you.
- It pairs with **React Email**, so transactional templates (welcome,
  invoice, password reset via Clerk webhook, low-stock alert) are written
  as React components — consistent with the rest of the stack.
- Nodemailer is a *transport library*, not a service — it still needs an
  SMTP provider behind it (SES, Postmark, Gmail). It only makes sense if
  you already have SES credentials or want to self-host sending.

**Keep Nodemailer as a fallback interface**, not a second thing to
maintain: build one `sendEmail()` function in `server/src/email/` that
calls Resend, and structure it so swapping the provider means changing
one file, not every call site.

---

## 5. System architecture — the actual flow

```
                         ┌─────────────────────┐
                         │   apps/web (public)  │
                         │  marketing + signup   │
                         └──────────┬───────────┘
                                    │ redirects to Clerk-hosted
                                    │ signup/login
                                    ▼
┌───────────────────────────────────────────────────────────────┐
│                         Clerk (Auth)                           │
│  handles signup, login, session, org/team membership           │
└──────────────────────────┬──────────────────────────────────┬──┘
                            │ issues JWT                       │ webhooks
                            ▼                                   ▼
                 ┌────────────────────┐                 ┌───────────────┐
                 │ apps/dashboard      │                 │ server/       │
                 │ (authenticated SPA) │◄──REST/JSON────►│ Express API   │
                 └─────────┬───────────┘   (axios)       └──────┬────────┘
                           │                                     │
                           │ websocket                           │
                           ▼                                     ▼
                 ┌────────────────────┐                 ┌───────────────┐
                 │   Socket.io client  │◄───live events──│ Socket.io srv │
                 └────────────────────┘                 └──────┬────────┘
                                                                 │
                              ┌──────────────────────────────────┼───────────────┐
                              ▼                                  ▼               ▼
                        ┌───────────┐                     ┌───────────┐  ┌─────────────┐
                        │  Prisma    │                     │   Redis    │  │   Stripe     │
                        │  → Postgres│                     │ cache/queue│  │  webhooks    │
                        │(local/Neon)│                     │ + sockets  │  │  (billing)   │
                        └───────────┘                     └───────────┘  └─────────────┘
                                                                 │
                                                                 ▼
                                                          ┌───────────────┐
                                                          │ Resend (email)│
                                                          │ via BullMQ job│
                                                          └───────────────┘
```

**Request flow, concretely:**
1. Visitor hits `apps/web`, clicks "Get started" → Clerk-hosted signup.
2. Clerk creates the user + org, redirects into `apps/dashboard`.
3. Dashboard's Clerk provider gives it a session JWT on every request.
4. Every API call from the dashboard goes through one `axios` instance
   (`lib/api.ts`) that attaches the Clerk JWT automatically.
5. Express verifies the JWT (Clerk middleware), then runs your existing
   `authenticate` → `authorize` (permission_code) middleware pair before
   touching Prisma — this is the same RBAC pattern from the POS system,
   reused here.
6. Prisma reads/writes Postgres. Hot/frequently-read data (dashboard
   summary stats, session data) goes through Redis first.
7. Anything that should update live (new order, stock change, profit
   number ticking) is emitted over Socket.io from the API after the DB
   write commits — the dashboard just listens, it never polls.
8. Background jobs (sending a welcome email, generating a CSV export,
   nightly report) go on a Redis-backed BullMQ queue instead of blocking
   the request — a worker process picks them up and calls Resend or
   writes the export file.
9. Stripe webhooks land on the Express API, update subscription state in
   Postgres, and (via the same permission system) instantly change what
   plan-gated features the org can see.

---

## 6. Folder structure (target)

```
vexez/
├── apps/
│   ├── web/                       # marketing site — current work
│   │   └── src/
│   │       ├── components/home/   # Navbar, Hero, Features, Pricing, ...
│   │       ├── pages/Home.tsx
│   │       └── lib/utils.ts
│   │
│   └── dashboard/                 # CRM app — new
│       └── src/
│           ├── app/
│           │   ├── routes.tsx             # react-router route tree
│           │   └── providers.tsx          # Clerk, QueryClient, SocketProvider
│           ├── layouts/
│           │   └── DashboardLayout.tsx    # sidebar + topbar shell
│           ├── features/                  # one folder per domain, not per file-type
│           │   ├── orders/
│           │   │   ├── components/
│           │   │   ├── hooks/useOrders.ts
│           │   │   └── api.ts
│           │   ├── products/
│           │   ├── customers/
│           │   ├── billing/               # Stripe UI (plan, invoices)
│           │   ├── team/                  # org members, roles/permissions
│           │   └── analytics/             # profit/sales charts
│           ├── lib/
│           │   ├── api.ts                 # axios instance + Clerk token interceptor
│           │   ├── socket.ts              # Socket.io client singleton
│           │   └── query-client.ts        # TanStack Query setup
│           ├── components/ui/             # shadcn primitives (shared w/ web via packages/ui later)
│           └── main.tsx
│
├── packages/
│   └── ui/                         # extract shared design tokens/components once dashboard exists
│
├── server/
│   ├── src/
│   │   ├── index.ts                # Express app + Socket.io attach
│   │   ├── routes/
│   │   │   ├── orders.routes.ts
│   │   │   ├── products.routes.ts
│   │   │   ├── customers.routes.ts
│   │   │   ├── billing.routes.ts   # Stripe webhook + checkout session
│   │   │   └── team.routes.ts
│   │   ├── middleware/
│   │   │   ├── authenticate.ts     # verifies Clerk JWT
│   │   │   └── authorize.ts        # permission_code check (RBAC, reused from POS system)
│   │   ├── sockets/
│   │   │   └── index.ts            # namespaces/rooms per org, emits on DB writes
│   │   ├── jobs/                   # BullMQ queues + workers
│   │   │   ├── email.queue.ts
│   │   │   └── export.queue.ts
│   │   ├── email/
│   │   │   ├── sendEmail.ts        # single entrypoint (Resend, Nodemailer-fallback ready)
│   │   │   └── templates/          # React Email templates
│   │   ├── lib/
│   │   │   ├── prisma.ts           # Prisma client singleton
│   │   │   ├── redis.ts            # Redis client singleton
│   │   │   └── stripe.ts           # Stripe client singleton
│   │   └── webhooks/
│   │       ├── clerk.webhook.ts
│   │       └── stripe.webhook.ts
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── package.json                    # npm workspaces root
└── ARCHITECTURE.md                 # this file
```

**Rule of thumb:** inside `apps/dashboard/src/features/`, group by
**domain** (orders, products, billing), not by file type. A feature
folder owns its own components, hooks, and API calls — this is what
lets a permission-gated module (e.g. billing) be added or removed
without touching unrelated code, and it mirrors the `ac_modules →
ac_resources → ac_actions` permission structure already in use.

---

## 7. Build order (what actually happens next)

1. **Workspace setup** — convert repo to npm workspaces, move current
   `Home.tsx` app into `apps/web`, scaffold `apps/dashboard` and `server/`.
2. **Auth** — wire Clerk into both apps; protect `apps/dashboard` routes
   with a `RequireAuth` wrapper; verify JWT in Express.
3. **Database** — write `schema.prisma` (Org, User, Product, Order,
   Customer, Subscription, and the existing permission_code RBAC tables),
   run first migration against local Postgres, then against Neon.
4. **Dashboard shell** — layout, sidebar nav, empty route pages for each
   feature domain.
5. **Core CRUD** — Products and Orders first (they're what the marketing
   page's mockups already promise), wired to Prisma via Express routes.
6. **Real-time** — Socket.io server + client, live order status and
   dashboard numbers.
7. **Redis** — session/rate-limit cache, then BullMQ for background jobs.
8. **Email** — Resend + React Email templates, sent via the job queue.
9. **Billing** — Stripe checkout for the three pricing tiers, webhook
   syncing subscription status, plan-gated feature checks reusing the
   permission system.
10. **Polish** — analytics/reporting exports, team management UI.

Each step should land as its own PR against this structure — nothing
here is built until it appears in a numbered step above.
