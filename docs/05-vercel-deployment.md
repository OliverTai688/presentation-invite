# Vercel Deployment Notes

## Required Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `GMAIL_USER`: Gmail address used to send mail.
- `GMAIL_APP_PASSWORD`: Gmail App Password. The Gmail account must have 2-Step Verification enabled.
- `MAIL_FROM`: sender name/address, for example `BNI AI 商務力 <name@gmail.com>`.
- `ORGANIZER_EMAIL`: default recipient for registration records.
- `INVITATION_ADMIN_PASSWORD`: admin password for `/admin`; prototype default is `123456`.
- `SITE_URL`: deployed site URL.

## Optional Persistent Storage

For Vercel persistence, configure Upstash Redis or Vercel KV:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Vercel KV aliases also work:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Without these, the app falls back to local `data/` JSON files. That is useful for local development, but serverless deployments should use KV so admin edits and registration lists persist.

## Gmail App Password Setup

1. Enable 2-Step Verification on the Gmail sender account.
2. Open Google Account security settings.
3. Create an App Password for Mail.
4. Put the generated password in `GMAIL_APP_PASSWORD`.
5. Do not commit `.env.local`.

## Local Verification

```bash
npm run lint
npm run build
npm run dev
```

Then verify:

- `/` opens the invite card.
- Clicking the invitation reveals the poster, links, registration form, and coupon flow.
- `/admin` accepts the configured password.
- Admin saves invitation content.
- Admin `Deployment` panel shows required/recommended setup status without exposing secrets.
- Registration sends Gmail messages when Gmail env vars are configured.

## Admin Deployment Panel

The admin page calls `/api/admin/system` after login. It returns boolean readiness checks only; it does not expose secret values.

Required checks:

- Gmail SMTP is configured with `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
- Organizer recipient exists through `ORGANIZER_EMAIL` or the admin content field.
- `SITE_URL` is configured.

Recommended checks:

- LinkedIn URL has been filled in.
- `INVITATION_ADMIN_PASSWORD` overrides the prototype default.
- Upstash Redis / Vercel KV variables are configured for persistent production storage.

## Deploy

Push the project to GitHub, import it into Vercel, add the environment variables above, and deploy. If KV is configured, admin edits and registration history persist across deployments and serverless invocations.
