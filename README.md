# BNI AI 商務力邀請函

Next.js 16 invitation microsite for the BNI 臺北北區長冠軍分會 2026/7/9 event.

## Features

- Public invitation card with click-to-open poster reveal.
- Poster display and focus mode using `public/assets/bni-invitation-poster-2026-07-09.png`.
- LinkedIn and `meetnuva.com` side links.
- RSVP form with name, LINE ID, email, and optional referrer.
- Gmail SMTP email path through Gmail App Password and `nodemailer`.
- Registration retention through Upstash Redis / Vercel KV, with local JSON fallback for development.
- Voucher UI after registration.
- `/admin` editor protected by `INVITATION_ADMIN_PASSWORD` or prototype password `123456`.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example` and `docs/05-vercel-deployment.md`.

Required for Gmail sending:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `MAIL_FROM`
- `ORGANIZER_EMAIL`

Recommended for Vercel persistence:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Vercel KV aliases also work:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## Verification

```bash
npm run lint
npm run build
```

## Deployment

Push to GitHub, import into Vercel, configure the environment variables, and deploy. Use Upstash Redis or Vercel KV if admin edits and registration history should persist in production.
