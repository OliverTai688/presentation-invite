# Technical Plan

## Proposed Routes

- `/`: public invitation, poster reveal, side links, registration form, coupon success state.
- `/api/register`: registration endpoint for saving data and sending emails.
- `/admin`: password-protected editor for invitation content.
- `/api/admin/session`: optional login/logout endpoint if using cookie-based admin session.
- `/api/admin/invitation`: optional read/write endpoint for editable invitation content.

## Data Model Draft

Invitation content:

- `eventTitle`
- `chapterName`
- `eventDate`
- `eventTime`
- `speakerName`
- `speakerCompany`
- `speakerRoles`
- `topic`
- `description`
- `locationName`
- `locationAddress`
- `fee`
- `notes`
- `referralAudience`
- `posterImagePath`
- `linkedinUrl`
- `meetNuvaUrl`
- `couponTitle`
- `couponDescription`
- `organizerEmail`

Registration:

- `id`
- `createdAt`
- `name`
- `lineId`
- `email` if attendee confirmation email is required
- `referrerName` optional
- `referrer` is accepted as an API alias for third-party form integrations
- `couponCode`
- `source`

## Email Behavior

Organizer email:

- Subject: new registration for BNI invitation
- Include name, LINE ID, email if present, referrer if present, timestamp, coupon code.

Attendee email:

- Requires attendee email.
- Subject: BNI 活動報名確認與 2026 兌換券
- Include event summary, coupon offer, and next steps.

Recommended providers:

- Gmail SMTP with a Gmail App Password.
- Use `nodemailer` for the server-side email transport.

Environment variables to plan for:

- `ORGANIZER_EMAIL`
- `MAIL_FROM`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `INVITATION_ADMIN_PASSWORD`
- `SITE_URL`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_URL` / `KV_REST_API_TOKEN` for Vercel-persistent admin edits and registrations

Gmail SMTP notes:

- The Gmail account must have 2-Step Verification enabled.
- Generate an App Password from the Google Account security settings.
- Never commit the App Password. Store it in `.env.local` locally and in Vercel environment variables for deployment.
- Use SMTP host `smtp.gmail.com`, port `465`, secure `true`.

## Admin Editing

Prototype:

- Use `/admin` with password `123456`.
- Store editable content in local JSON when no KV variables are configured.

Production:

- Use Upstash Redis or Vercel KV for persistent admin edits and registration history.
- Use an environment-backed password at minimum.
- Add rate limiting or lockout for login attempts.

## Implementation Sequence

1. Replace starter page with the invitation UI.
2. Add content configuration and poster asset usage.
3. Build reveal interaction, side link panel, and responsive poster layout.
4. Build registration form with validation.
5. Implement API endpoint or Server Action for registration.
6. Wire email provider using env vars.
7. Add coupon success UI.
8. Build `/admin` editor and session handling.
9. Verify desktop/mobile with the in-app Browser skill.
10. Run `npm run lint` and `npm run build`.

## Acceptance Criteria

- Poster opens after invitation click and is readable on desktop and mobile.
- LinkedIn and `meetnuva.com` links are visible beside or near the poster.
- Registration accepts valid name and LINE ID.
- If attendee email is part of the implemented form, attendee confirmation email can be sent.
- Organizer receives registration details by email when email provider is configured.
- Coupon UI is shown after successful registration.
- `/admin` requires the password and can update editable content.
- Build and lint pass.
