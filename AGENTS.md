<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: BNI Invitation Microsite

## Product Context

- Build a polished Traditional Chinese invitation microsite for the 2026/7/9 BNI event poster in `public/assets/bni-invitation-poster-2026-07-09.png`.
- The first screen should be the actual invitation experience, not a marketing landing page. The invitation should reveal the poster on click, with adjacent profile/link information for LinkedIn and `meetnuva.com`.
- The registration form must capture at least attendee name and LINE ID. If the attendee must receive an email, add/require an attendee email field because LINE ID alone cannot be emailed.
- After registration, show a UI coupon for both the attendee and referrer: either any paid online workshop in 2026 or a one-hour AI consulting service.
- Admin editing lives behind `/admin`; the requested prototype password is `123456`. Prefer an environment variable for deployed environments and keep this default documented as local/prototype only.

## Implementation Notes

- This repo uses Next `16.2.10`, React `19.2.4`, TypeScript, CSS Modules/global CSS, `framer-motion`, `lucide-react`, and Radix Slot.
- Before changing Next app code, read the specific local docs needed from `node_modules/next/dist/docs/`. For this feature, the relevant docs already reviewed include:
  - `01-app/03-api-reference/03-file-conventions/page.md`
  - `01-app/03-api-reference/03-file-conventions/layout.md`
  - `01-app/03-api-reference/03-file-conventions/public-folder.md`
  - `01-app/03-api-reference/02-components/image.md`
  - `01-app/03-api-reference/02-components/form.md`
  - `01-app/03-api-reference/03-file-conventions/route.md`
  - `01-app/03-api-reference/01-directives/use-client.md`
  - `01-app/03-api-reference/01-directives/use-server.md`
  - `01-app/03-api-reference/05-config/01-next-config-js/serverActions.md`
- Use `next/image` for the poster with intrinsic dimensions `1076 x 1522` or a `fill` parent that preserves the portrait aspect ratio.
- Route Handlers or Server Actions may be used for registration and admin saves; validate all submitted fields server-side.
- Do not rely on local filesystem writes for production persistence unless deployment is known to support it. Prefer a database or managed storage for registrations/admin content.
- This project supports Upstash Redis / Vercel KV through `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `KV_REST_API_URL`, or `KV_REST_API_TOKEN`; use it for Vercel-persistent admin edits and registrations.
- Email delivery should use Gmail SMTP with a Gmail App Password and `nodemailer`, configured through environment variables. Never hard-code SMTP secrets.

## Design Direction

- Use the poster's business-event tone: red, white, charcoal, and restrained neutral accents. Avoid the default purple/blue gradient feel currently in the starter CSS.
- Keep the UI focused and operational: invitation reveal, poster, profile links, registration, coupon, and admin editor.
- Use lucide icons for link/action buttons where appropriate, with accessible text or tooltips.
- Make the poster inspectable on mobile and desktop; avoid cropping essential poster text.
- Use `docs/03-design-benchmarks.md` as the design benchmark reference. The recommended direction is Luma/Partiful for RSVP flow, Linear/Raycast/Vercel/Framer for minimal premium interaction craft.
- Use `docs/06-third-party-ux-resources.md` for third-party motion/UI resource decisions.
- Prefer `framer-motion` first for animation because it is already installed. Add `canvas-confetti`, `gsap`, `lenis`, `vaul`, or `three` only when the intended interaction clearly needs them.
- `sonner` is installed for polished toast feedback; use it for form, copy, and admin status feedback instead of adding another notification library.

## Verification

- Run `npm run lint` and `npm run build` after implementation changes.
- For UI work, start the dev server and use the in-app Browser skill to verify desktop and mobile layouts, poster reveal, form states, coupon state, and admin access.
