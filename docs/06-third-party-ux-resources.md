# Third-Party UX Resources

## Purpose

Use third-party resources selectively to improve the invitation site's visual polish, motion, form feedback, and poster inspection while preserving the professional BNI tone.

## Sources Checked

- Motion Primitives: https://motion-primitives.com/
- Motion documentation: https://motion.dev/
- React Bits: https://reactbits.dev/
- Magic UI: https://magicui.design/
- Aceternity UI: https://ui.aceternity.com/
- Animate UI: https://animate-ui.com/
- Sonner: https://ui.shadcn.com/docs/components/radix/sonner
- Lenis: https://lenis.dev/
- Vaul: https://vaul.emilkowal.ski/
- react-medium-image-zoom: https://www.npmjs.com/package/react-medium-image-zoom

## Recommended Use In This Project

### Already Adopted

- `framer-motion`: invitation reveal, poster hover, coupon entrance.
- `canvas-confetti`: success moment after registration.
- `sonner`: polished toast feedback for registration and coupon code copy.
- `lucide-react`: consistent icon language.

### Good Next Candidates

- Motion Primitives: copy small motion patterns rather than installing a full visual system. Best fit for tabs, disclosure, and enter/exit choreography.
- React Bits: reference sparingly for hover/reveal ideas. Avoid flashy text effects that fight the poster.
- Magic UI: useful as inspiration for subtle animated borders or shine effects, but it assumes Tailwind/shadcn patterns that this repo does not currently use.
- react-medium-image-zoom: consider only if custom poster inspect mode becomes hard to maintain. Current custom modal avoids extra CSS/global import risk.
- Lenis: optional for a longer one-page narrative. Current page is task-focused enough that native scroll is preferable.
- Vaul: useful if the mobile registration or poster details become a bottom sheet; not needed while the mobile flow remains simple.

## Sub-Agent UX Audit Applied

The UX audit recommended:

- Reduce side-panel heading scale relative to the poster headline.
- Add a mobile-friendly RSVP jump.
- Make poster focus mode more useful for mobile inspection.
- Make the coupon moment more actionable with copy-code and attendee/referrer affordances.
- Keep admin deployment readiness visible.

Implemented from this pass:

- Side panel heading hierarchy adjusted.
- RSVP quick action added.
- Poster modal supports larger mobile inspection.
- Coupon code copy added with `sonner` toast feedback.
- Coupon now visually indicates both attendee and referrer eligibility.
- Admin deployment status panel added.
