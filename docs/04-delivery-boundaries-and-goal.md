# Delivery Boundaries And Goal

## Goal

Finish the BNI invitation microsite so it can be pushed to Vercel and shared publicly.

## In Scope

- Public invitation page with a tactile invite-opening experience.
- Poster reveal using `public/assets/bni-invitation-poster-2026-07-09.png`.
- LinkedIn and `meetnuva.com` side information/link area.
- Registration form with server-side validation.
- Data retention path for submitted registrations.
- Organizer email notification path.
- Attendee confirmation path if attendee email is collected.
- UI coupon after successful registration.
- Admin page at `/admin`, protected by prototype password `123456` or `INVITATION_ADMIN_PASSWORD`.
- Admin editing for invitation content and key links.
- Responsive desktop/mobile UI verification.
- Lint and production build verification.
- Vercel deployment readiness notes.

## Out Of Scope Unless Explicitly Requested

- Payment collection for the event fee.
- Full CRM/member management.
- Complex analytics dashboard.
- Permanent production-grade authentication beyond the requested simple admin password.
- Heavy 3D scenes unless needed for the core invite interaction.
- Guessing an unconfirmed LinkedIn URL.

## Must Confirm Or Resolve Before Final Deployment

- Organizer email address.
- Whether attendee email should be required so attendee confirmation email can be sent.
- Final LinkedIn URL: https://www.linkedin.com/in/olivertai/
- Gmail sender account, Gmail App Password, and organizer recipient email.
- Vercel project/environment variable setup, including Upstash Redis or Vercel KV if admin edits should persist in production.

## Done Criteria

- `npm run lint` passes.
- `npm run build` passes.
- Browser verification confirms the invitation, poster, registration, coupon, and admin flows work on desktop and mobile.
- Missing production secrets are documented in deployment notes.
- The app is ready to push to GitHub/Vercel without unfinished local-only assumptions, except for explicitly documented environment variables.
- Gmail SMTP sending works locally or the exact Gmail/Vercel environment variables are documented for deployment.
- Persistent production admin edits require the documented Upstash Redis or Vercel KV variables.
