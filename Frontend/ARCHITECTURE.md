# Vexez — Handoff / Continuation Prompt

Paste this into a new Claude conversation to continue exactly where this one left off.

---

I'm building Vexez — a student academic + productivity SaaS for university students. This is a **pivot**: Vexez was originally scoped as a CRM/e-commerce inventory platform, then briefly as a general CRM, and has now been **fully repositioned** as a student productivity product. All CRM concepts (Leads, Deals, Pipeline, Customers, Quotes, Orders, Companies) are discontinued and removed — do not reference or reintroduce them.

## Stack
React + TypeScript + Tailwind CSS + shadcn (Base UI / Nova preset) + react-router-dom + framer-motion + axios + lucide-react. gsap only if a complex scroll/timeline sequence genuinely needs it.

Backend (planned, not yet built): Node.js + Express, Socket.io (real-time), Clerk (auth), Prisma (ORM), PostgreSQL (local dev, Neon for production), Redis (cache/queues via BullMQ), Stripe (subscription billing), Resend + React Email for transactional email (Nodemailer kept only as a swappable SMTP fallback behind one `sendEmail()` function).

shadcn note: using Base UI (not classic Radix) with the Nova preset. Components import from `"@base-ui-components/react/..."` (NOT `"@base-ui/react/..."` — wrong package, breaks resolution). Custom CSS variable tokens (`--primary`, `--input`, `--foreground`, `--muted-foreground`, `--destructive`, `--ring`, etc.) are mapped onto the teal/ink palette in `index.css` + `tailwind.config.js`.

## Design language (don't drift from this)
Dark theme: ink background (#0A1210), teal accent (#1EC2BC / glow #5CF2E8), clay accent (#E7714A) used sparingly, cream text (#F6F4EE). Space Grotesk for display/headings, Inter for body, JetBrains Mono for small mono/eyebrow labels. Rounded-full buttons/pills, rounded-2xl cards, border-white/8 or /10 for card borders. Motion via framer-motion — fade+slide-up on scroll reveal, staggered delays, nothing gratuitous.

## Product identity
Student Academic + Productivity SaaS. Core workflow the whole app hangs off:

```
Semester → Courses → Classes → Assignments → Exams → Grades
         → Attendance → Tasks → Study → Projects → Progress
```

Sidebar nav structure (already built — see below):
```
Semester selector (e.g. "Fall 2026 ▾")

OVERVIEW
 - Dashboard
 - Calendar

ACADEMICS
 - My Courses
 - Assignments
 - Exams & Quizzes
 - Grades & GPA
 - Attendance

STUDY
 - Tasks
 - Study Planner
 - Notes
 - Projects

CAMPUS
 - Groups & Teams
 - Announcements
 - Messages

INSIGHTS
 - Progress
 - AI Study Assistant

Bottom nav: Notifications, Settings, Profile
```

Routes live under `/app/*` (e.g. `/app/courses`, `/app/assignments`), not `/dashboard/*`.

## What's built so far

- **Marketing landing page** (`Home.tsx`) — Navbar, Hero, LogoStrip, Features, GrowthShowcase, OrderControl, Pricing, Testimonials, FAQ, CTA, Footer in `src/components/home/`. Still reflects old positioning to some degree — copy/messaging pass not yet done for the student pivot, flagged as out of scope until asked.
- **Login.tsx / SignUp.tsx** (`src/pages/`) — split-panel layout, shadcn Button/Input/Label, social login buttons, local-state validation with TODO markers for Clerk's `useSignIn()`/`useSignUp()`.
- **App.tsx** wired with react-router-dom; Navbar/CTA link to `/login` and `/signup` via `<Link>`.
- **DashboardLayout.tsx** (`src/layouts/`) — sidebar + topbar shell, rebuilt for the student nav structure above. Supports collapsed/expanded (icon-only) and mobile drawer states, semester selector dropdown near the top (mock semester list, not wired to real data yet), active-route highlighting via `layoutId` pill animation, bottom nav for Notifications/Settings/Profile pinned above the collapse toggle.
- **Dashboard.tsx** (`src/pages/dashboard/`) — Overview home page. Stat cards (GPA, assignments due, attendance %, study hours), today's schedule list with a "Now" indicator, animated GPA trend sparkline (inline SVG, no chart library), due-soon assignments list, today's tasks checklist. All data is mock/local — no API wiring yet.
- **ARCHITECTURE.md** — fully rewritten for the student-SaaS direction (previous CRM version is superseded, not merged). Covers: system flow diagram (Clerk → dashboard JWT → Express → Prisma/Postgres/Redis → Socket.io → BullMQ → Resend), **semester scoping** as a first-class concept (which entities are semester-bound — Courses/Assignments/Exams/Grades/Attendance — vs. persistent across semesters — Tasks/Notes/Projects/Groups/Messages), target Prisma schema shape (Student, Semester, Course, Assignment, Exam, Grade, AttendanceRecord, Task, StudyBlock, Note, Project, Group, Announcement, Message), a Socket.io event catalog re-scoped to `student:{id}` / `group:{id}` / `course:{id}` rooms, and a 15-step build order.

## Deleted / removed (confirm this happened on your end before continuing)
The following CRM-era files should be deleted, not repurposed: `Orders.tsx`, `Products.tsx`, `Customers.tsx`, `Analytics.tsx`, `Settings.tsx` (old CRM version — will be rebuilt fresh for student settings later), and their routes in `App.tsx`. The old ARCHITECTURE.md content is fully superseded by the new one.

## Working preferences — important
- Hand over **single, self-contained `.tsx` components**, not pre-split into many small files — I break them apart myself.
- Do **NOT** restructure folders/repo shape on your own initiative. Give me the plan or the files; I place them.
- I'm using the actual shadcn CLI (not hand-rolled shadcn-style components) — generate code compatible with `npx shadcn add <component>` for Base UI/Nova, or tell me which primitives to add via the CLI myself.
- Keep responses focused on working code + brief rationale, not lengthy pre-explanation.
- **One component/piece at a time.** Don't batch multiple pages/files in one response unless explicitly told to. Ask before proceeding if the next step is ambiguous.
- **Adjust/reframe existing work before adding new work**, when a pivot or correction is in progress — don't stack new pages on top of an inconsistent base.
- When I say **"create the prompt,"** that means stop building and instead write a handoff summary like this one — don't interpret it as a request for a different kind of deliverable.

## Next up (per ARCHITECTURE.md build order, step 6)

Everything through step 5 (workspace, auth plan, DB plan, dashboard shell, Dashboard page) is either done or scoped. **Step 6 — Semester context/provider — is next and has not been started.** This needs to exist before Courses/Assignments/Grades/Attendance pages can be built, since those are semester-scoped and the sidebar's semester selector is currently just local UI state with no app-wide context behind it.

Concretely, step 6 likely means: a `SemesterProvider` (React context) wrapping the dashboard app alongside wherever Clerk/QueryClient providers will eventually live (`app/providers.tsx` per ARCHITECTURE.md's target folder structure — not yet created), exposing the currently-selected semester to any component that needs to scope its data/API calls to it. The `DashboardLayout.tsx` sidebar's semester dropdown should eventually read/write this context instead of its own local `useState`.

Ask me to confirm scope/approach for the Semester provider before building it — don't assume implementation details (e.g. whether semester list is hardcoded for now vs. fetched, whether it persists to localStorage) without checking.