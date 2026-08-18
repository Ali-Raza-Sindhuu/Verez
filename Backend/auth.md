# Vexez Auth Backend — Architecture & Flow

Stack: **Node.js (Express) + Clerk + PostgreSQL + Prisma + Redis + Resend (or Nodemailer)**

This document explains how the four pages you already built (`Login`, `SignUp`,
`ForgotPassword`, `ResetPassword`) connect to a real backend, what each piece
is *for*, and the exact request flow for every auth action.

---

## 1. Why each piece exists

| Piece | Job | Why you need it |
|---|---|---|
| **Clerk** | Owns identity: password hashing, session tokens, OAuth (Google/GitHub), MFA | You never touch raw passwords or JWT signing yourself |
| **Node/Express** | Your API — the only thing your frontend talks to | Lets you add app-specific logic Clerk doesn't know about (courses, assignments, roles) |
| **PostgreSQL + Prisma** | Your *own* `User`, `Course`, `Assignment` tables | Clerk stores auth identity, not your product data — you mirror the Clerk user into your DB |
| **Redis** | Short-lived state: rate limiting, OTP/reset-token throttling, session cache | Fast, expiring key-value store — wrong tool would be Postgres for this |
| **Resend / Nodemailer** | Sends the actual reset-password email | Clerk *can* send its own emails, but if you want your own templates/branding, you send them yourself |

**Key decision up front:** Clerk already has a built-in, secure forgot/reset-password
flow (magic link or OTP code). You have two valid architectures — pick one:

- **Option A — Clerk-native reset (recommended, less code):** Clerk handles token
  generation, storage, expiry, and email sending. Your Node backend is barely
  involved in this specific flow.
- **Option B — Custom reset (what you already have UI for, more control):** *You*
  generate the reset token, store it in Redis, send the email via
  Resend/Nodemailer, and verify it yourself, then call Clerk's admin API to
  actually update the password.

Below I document **both**, since your `ForgotPassword.tsx` / `ResetPassword.tsx`
pages were built as a fully custom flow. Option A is simpler to ship; Option B is
what matches the UI you already have pixel-for-pixel (countdown, "resend link", etc).

---

## 2. High-level architecture

```
┌─────────────┐        ┌──────────────────┐        ┌─────────────┐
│   React      │ HTTPS  │  Node/Express API │        │  PostgreSQL  │
│  (Login.tsx, │───────▶│  (your backend)   │◀──────▶│  via Prisma  │
│  SignUp.tsx, │        │                   │        └─────────────┘
│  Forgot/     │        │  - /auth/*        │
│  Reset.tsx)  │        │  - /api/*         │        ┌─────────────┐
└─────────────┘        │                   │◀──────▶│    Redis     │
      │                 │                   │        │ (tokens,     │
      │  Clerk SDK       │                   │        │  rate limit) │
      │  (frontend)      └────────┬──────────┘        └─────────────┘
      ▼                            │
┌─────────────┐                   │ Clerk Backend SDK
│  Clerk       │◀──────────────────┘ (verify session, admin actions)
│  (hosted     │
│   identity)  │──── webhooks ────▶ Node/Express (/webhooks/clerk)
└─────────────┘

Resend / Nodemailer ◀── Node/Express sends reset-password emails
```

Two SDKs, two different jobs:
- **`@clerk/clerk-react`** in your frontend — handles the actual login/signup
  UI logic, session cookie, `useUser()`, `useAuth()`.
- **`@clerk/clerk-sdk-node`** in your backend — verifies incoming requests are
  from a real logged-in user, and lets you do admin actions (force password
  reset, ban user, etc).

---

## 3. Project setup

```bash
# backend
mkdir vexez-api && cd vexez-api
npm init -y
npm install express cors dotenv
npm install @clerk/clerk-sdk-node
npm install prisma @prisma/client --save
npm install ioredis
npm install resend            # or: npm install nodemailer
npm install zod                # request validation, recommended

npx prisma init
```

`.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vexez"
CLERK_SECRET_KEY="sk_test_xxx"
CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_WEBHOOK_SECRET="whsec_xxx"
REDIS_URL="redis://localhost:6379"
RESEND_API_KEY="re_xxx"
FRONTEND_URL="http://localhost:5173"
```

Frontend `.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
VITE_API_URL="http://localhost:4000"
```

---

## 4. Database schema (Prisma)

Clerk is the source of truth for **credentials**. Postgres/Prisma is the source
of truth for **your product data**. You link them with `clerkId`.

`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique          // links to Clerk's user.id
  email     String   @unique
  name      String?
  role      Role     @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  courses     Enrollment[]
  assignments Assignment[]
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

model Course {
  id          String       @id @default(cuid())
  title       String
  description String?
  createdAt   DateTime     @default(now())
  enrollments Enrollment[]
  assignments Assignment[]
}

model Enrollment {
  id       String @id @default(cuid())
  user     User   @relation(fields: [userId], references: [id])
  userId   String
  course   Course @relation(fields: [courseId], references: [id])
  courseId String

  @@unique([userId, courseId])
}

model Assignment {
  id        String   @id @default(cuid())
  title     String
  dueDate   DateTime
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
  user      User?    @relation(fields: [userId], references: [id])
  userId    String?
  createdAt DateTime @default(now())
}

// Only needed if you go with the CUSTOM reset-password flow (Option B).
// If using Clerk-native reset (Option A), you don't need this table —
// Redis alone is enough since tokens are short-lived.
model PasswordResetAudit {
  id        String   @id @default(cuid())
  email     String
  requestedAt DateTime @default(now())
  usedAt      DateTime?
  ip          String?
}
```

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 5. Redis — what it's actually storing

Redis is used for **three** things in this flow, all deliberately *not* in Postgres
because they're short-lived and high-frequency:

1. **Reset-password tokens** (Option B only) — `reset:<token>` → `email`, TTL 15 min
2. **Rate limiting** — `ratelimit:forgot-password:<email>` → count, TTL 60s, so someone
   can't spam the "send reset link" button (your UI already has a "resend" button —
   this is what stops it being abused)
3. **Resend cooldown** — same key pattern, prevents duplicate emails firing

`src/lib/redis.ts`:
```ts
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);
```

---

## 6. Backend routes

`src/index.ts`:
```ts
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/clerk-sdk-node";
import authRoutes from "./routes/auth";
import webhookRoutes from "./routes/webhooks";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Clerk webhooks need the RAW body — mount before express.json()
app.use("/webhooks", webhookRoutes);

app.use(express.json());
app.use(clerkMiddleware()); // attaches req.auth on every request

app.use("/auth", authRoutes);

app.listen(4000, () => console.log("API on :4000"));
```

### 6.1 Clerk webhook — sync Clerk user → your Postgres `User` table

This is the piece that makes Signup "functional": when someone signs up through
Clerk (your `SignUp.tsx` calls Clerk directly), Clerk fires a webhook to your
backend, and *that's* when you create the row in your own database.

`src/routes/webhooks.ts`:
```ts
import { Router } from "express";
import { Webhook } from "svix";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/clerk", express.raw({ type: "application/json" }), async (req, res) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: any;

  try {
    evt = wh.verify(req.body, {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    });
  } catch {
    return res.status(400).send("Invalid webhook signature");
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name } = evt.data;
    await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: first_name ?? undefined,
      },
    });
  }

  if (evt.type === "user.deleted") {
    await prisma.user.delete({ where: { clerkId: evt.data.id } }).catch(() => {});
  }

  res.status(200).send("ok");
});

export default router;
```

Register this URL (`https://your-api.com/webhooks/clerk`) in the Clerk dashboard
under **Webhooks**, subscribed to `user.created` and `user.deleted`.

### 6.2 A protected route — proves Clerk session verification works

`src/routes/auth.ts`:
```ts
import { Router } from "express";
import { requireAuth } from "@clerk/clerk-sdk-node";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/me", requireAuth(), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: req.auth.userId },
  });
  res.json(user);
});

export default router;
```

Your `DashboardLayout.tsx` calls this to hydrate the logged-in user's product
data (name, role, enrolled courses) — Clerk gives you *who* they are, this
route gives you *what they can do*.

---

## 7. Login & SignUp flow (frontend-driven, Clerk-native)

You do **not** POST email/password to your own `/auth/login` route. Clerk's
frontend SDK talks to Clerk directly; your backend only gets involved via the
webhook (step 6.1) and afterward for protected API calls.

Wrap your app:
```tsx
// main.tsx
import { ClerkProvider } from "@clerk/clerk-react";

<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>
```

Update `Login.tsx`'s `handleSubmit`:
```tsx
import { useSignIn } from "@clerk/clerk-react";

const { signIn, setActive } = useSignIn();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setLoading(true);
  try {
    const result = await signIn!.create({ identifier: email, password });
    if (result.status === "complete") {
      await setActive!({ session: result.createdSessionId });
      navigate("/dashboard");
    }
  } catch (err: any) {
    setError(err.errors?.[0]?.message ?? "Couldn't log you in.");
  } finally {
    setLoading(false);
  }
}
```

Update `SignUp.tsx`'s `handleSubmit` the same way with `useSignUp()` →
`signUp.create({ emailAddress: email, password, firstName: name })`. Clerk
sends its own verification email if you've enabled email verification —
or skip that and go straight to session creation.

**Flow, step by step:**
1. User submits `SignUp.tsx` → Clerk frontend SDK creates the user directly
   against Clerk's servers (your Node backend is not in this request path at all).
2. Clerk fires `user.created` webhook → your backend creates the mirrored
   `User` row in Postgres via Prisma.
3. Clerk sets a session cookie/JWT in the browser.
4. `Login.tsx` on a later visit calls `signIn.create()` → Clerk verifies the
   password (it owns the hash, you never see it) → returns a session.
5. Every subsequent request to your Node API includes the Clerk session token;
   `clerkMiddleware()` + `requireAuth()` verify it server-side before touching Postgres.

---

## 8. Forgot / Reset Password — Option A (Clerk-native, least code)

Replace the custom logic in `ForgotPassword.tsx` and `ResetPassword.tsx`:

```tsx
// ForgotPassword.tsx
const { signIn } = useSignIn();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  await signIn!.create({
    strategy: "reset_password_email_code",
    identifier: email,
  });
  setSent(true); // Clerk has now emailed a 6-digit code
}
```

```tsx
// ResetPassword.tsx — collect the code Clerk emailed + the new password
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const result = await signIn!.attemptFirstFactor({
    strategy: "reset_password_email_code",
    code,               // from a new input field
    password,           // the new password
  });
  if (result.status === "complete") {
    await setActive!({ session: result.createdSessionId });
    setDone(true); // countdown → navigate("/login") or straight to /dashboard
  }
}
```

Clerk handles: token generation, expiry, storage, rate limiting, and the email
itself. You still get your countdown/success UI — you just don't run the token
logic yourself. **Redis and Resend are optional here** (Clerk already rate-limits
and emails). This is the flow to ship first if you want something working fast.

---

## 9. Forgot / Reset Password — Option B (fully custom, matches your UI exactly)

This is the flow that matches what you already built: your backend owns the
token, Redis stores it, Resend/Nodemailer sends it, and on submit you verify it
yourself, then push the new password into Clerk via the **Admin API**.

### 9.1 Request reset link

`POST /auth/forgot-password`
```ts
import { Router } from "express";
import { randomBytes } from "crypto";
import { redis } from "../lib/redis";
import { resend } from "../lib/resend";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // 1. rate limit — max 1 request per 60s per email
  const rlKey = `ratelimit:forgot-password:${email}`;
  if (await redis.exists(rlKey)) {
    return res.status(429).json({ error: "Wait a moment before requesting again." });
  }
  await redis.set(rlKey, "1", "EX", 60);

  // 2. don't leak whether the email exists — always respond success
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    await redis.set(`reset:${token}`, email, "EX", 60 * 15); // 15 min TTL

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Vexez <noreply@vexez.app>",
      to: email,
      subject: "Reset your Vexez password",
      html: `
        <p>Click below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });
  }

  res.json({ success: true });
});

export default router;
```

`src/lib/resend.ts`:
```ts
import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY);
```

> **Nodemailer alternative** (if you'd rather use SMTP / Gmail / SES directly
> instead of Resend's API):
> ```ts
> import nodemailer from "nodemailer";
> export const transporter = nodemailer.createTransport({
>   host: "smtp.resend.com", // or your provider
>   port: 465,
>   secure: true,
>   auth: { user: "resend", pass: process.env.RESEND_API_KEY },
> });
> // then: await transporter.sendMail({ from, to, subject, html })
> ```

### 9.2 Submit new password

`POST /auth/reset-password`
```ts
import { clerkClient } from "@clerk/clerk-sdk-node";

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const email = await redis.get(`reset:${token}`);
  if (!email) {
    return res.status(400).json({ error: "This link is invalid or has expired." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Account not found." });

  // update the password in Clerk (Clerk still owns the hash/storage)
  await clerkClient.users.updateUser(user.clerkId, { password });

  // token is single-use — burn it immediately
  await redis.del(`reset:${token}`);

  res.json({ success: true });
});
```

`ResetPassword.tsx` reads `?token=` from the URL (`useSearchParams`) and POSTs
it alongside the new password to `/auth/reset-password`; on success, you already
have the countdown + `navigate("/login")` wired up.

```tsx
const [searchParams] = useSearchParams();
const token = searchParams.get("token");

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  // ...your existing validation...
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    const { error } = await res.json();
    setError(error);
    return;
  }
  setDone(true); // your existing countdown → navigate("/login") logic
}
```

---

## 10. End-to-end flow diagrams

### Sign up
```
SignUp.tsx → Clerk (createUser) → session cookie set
                    │
                    ▼ webhook: user.created
             Node/Express /webhooks/clerk
                    │
                    ▼
         Prisma → INSERT INTO "User" (clerkId, email, name)
```

### Log in
```
Login.tsx → Clerk (signIn.create) → session token
                    │
                    ▼ every future request
        Authorization header / cookie → clerkMiddleware()
                    │
                    ▼
        req.auth.userId → Prisma lookup by clerkId
```

### Forgot / Reset password (Option B, custom)
```
ForgotPassword.tsx
   │  POST /auth/forgot-password { email }
   ▼
Node checks Redis rate limit → Prisma finds user → generates token
   │
   ├─▶ Redis: SET reset:<token> = email  (TTL 15m)
   └─▶ Resend: emails reset link with ?token=<token>

User clicks emailed link → lands on ResetPassword.tsx?token=xxx
   │  POST /auth/reset-password { token, password }
   ▼
Node: Redis GET reset:<token> → email
   │
   ├─▶ Prisma: find User by email
   ├─▶ Clerk Admin API: updateUser(clerkId, { password })
   └─▶ Redis: DEL reset:<token>
   │
   ▼
ResetPassword.tsx shows "Password updated" → countdown → navigate("/login")
```

---

## 11. Checklist to go live

- [ ] Clerk application created, publishable + secret keys in both `.env` files
- [ ] Postgres running, `DATABASE_URL` set, `npx prisma migrate dev` run
- [ ] Redis running locally (`docker run -p 6379:6379 redis`) or hosted (Upstash)
- [ ] Resend domain verified (or Nodemailer SMTP credentials working)
- [ ] Clerk webhook endpoint registered + `CLERK_WEBHOOK_SECRET` set
- [ ] Decide Option A vs Option B for forgot/reset — don't build both
- [ ] `requireAuth()` protecting every `/dashboard`-adjacent API route
- [ ] Rate limiting confirmed on `/auth/forgot-password` (test hammering it)
- [ ] `.env` files gitignored, secrets not committed

---

## 12. Recommendation

Given you already have the polished multi-state UI (countdown, resend link,
audit-style messaging) — **go with Option B**. It's more code, but it's the one
your frontend was actually designed for, and it gives you full control over
email branding via Resend. Use Option A only if you want to ship faster and are
fine with Clerk's default reset-code email template.