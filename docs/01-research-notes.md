# Research Notes

## Local Technical Research

The repository uses Next `16.2.10`, React `19.2.4`, TypeScript, CSS Modules/global CSS, `framer-motion`, `lucide-react`, and Radix Slot.

Relevant Next local docs reviewed from `node_modules/next/dist/docs/`:

- `page.md`: App Router pages are Server Components by default. In this Next version, `params` and `searchParams` are promises.
- `layout.md`: the root layout owns `<html>` and `<body>`, and metadata should use the Metadata API rather than manual `<head>` tags.
- `public-folder.md`: files in `public` are served from the site root, so the poster can be referenced as `/assets/bni-invitation-poster-2026-07-09.png`.
- `image.md`: `next/image` requires meaningful `alt`; use intrinsic `width`/`height` or `fill` with a positioned parent and `sizes`.
- `form.md`: `next/form` is helpful for search/navigation forms. For mutations and email submission, use a Server Action or a normal form/fetch to a Route Handler.
- `route.md`: Route Handlers support `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`, using standard Web `Request`/`Response`.
- `use-client.md`: client components are needed for event handling, local UI state, poster reveal, modals, and interactive admin editing.
- `use-server.md`: server functions must validate input and protect sensitive operations.
- `serverActions.md`: Server Actions are enabled by default in modern Next, with same-origin protections and body size limits.

## External Context

- `meetnuva.com` is the official Nuva website and links to pages such as home/about plus social/LINE entry points.
- The Nuva about page presents Brad 林上哲 as Founder & CEO and frames Nuva around conscious, thoughtful AI use.
- Search results for 圓展教育科技 indicate a public site at `yzedtech.com`; this may be relevant because the poster names 圓展教育科技有限公司, but the user's explicit requested side link is `meetnuva.com`.
- LinkedIn URL supplied by user: https://www.linkedin.com/in/olivertai/

External sources checked:

- https://meetnuva.com/
- https://meetnuva.com/aboutus/
- https://yzedtech.com/

## UX Implications

- The audience is professional: 專業人士、企業主、AI 決策者. The page should feel direct, credible, and efficient.
- The poster is already visually strong. The web UI should frame it clearly and avoid adding decorative clutter.
- The invitation reveal can be an envelope/card interaction, but the poster must be readable and easy to zoom/inspect.
- Registration should stay short. If email confirmation is mandatory, add email as a required field and explain it through the form label, not long instructional text.
- The coupon should appear as a tangible voucher after submission, with a clear service choice and validity year.

## Content Risks

- Email-to-attendee cannot work without attendee email.
- LINE ID is personal data; store minimally and avoid showing it in admin tables beyond what is needed.
- The admin password `123456` is weak and should only be treated as a prototype default unless the user insists on production use.
