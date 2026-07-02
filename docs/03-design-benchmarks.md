# Design Benchmarks

## Direction

Build the invitation as a minimal, tactile, premium event experience:

- Use Luma and Partiful for RSVP flow references.
- Use Linear, Raycast, Vercel, and Framer for restrained high-craft interaction references.
- Keep the BNI poster as the visual anchor. The website should reveal, frame, and support the poster rather than compete with it.
- Favor one strong interaction over many decorative effects: invitation click -> poster reveal -> registration -> coupon.

## Benchmark Sites

### Luma

- URL: https://luma.com/
- Why it matters: Minimal event-first framing with a direct event creation/attendance mental model.
- Useful pattern: Clear event hierarchy, simple call to action, trust-building calmness.
- Apply here: Make the invitation path obvious: open invitation, view poster, register.

### Partiful

- URL: https://partiful.com/
- Why it matters: Strong invitation/RSVP product pattern with playful event pages, shareability, reminders, and RSVP tracking.
- Useful pattern: The page feels like an invite, not a generic landing page.
- Apply here: Use a shareable invitation card and a satisfying success/coupon moment after submission.

### Apple Invites

- Reference: https://www.theverge.com/news/606009/apple-invites-app-events-android-iphone-partiful
- Why it matters: A mainstream example of simple event creation, background imagery, sharing links, RSVP, and calendar-like event management.
- Useful pattern: Clean invite presentation, image-led event identity, minimal form friction.
- Apply here: Treat the poster as the image-led identity and keep registration lightweight.

### Linear

- URL: https://linear.app/
- Why it matters: Minimal high-trust product storytelling with polished motion, dense but calm UI mockups, and crisp contrast.
- Useful pattern: Sophisticated dark/neutral surfaces, subtle micro-motion, precise content sections.
- Apply here: Use charcoal, white, and poster red; keep side information compact and professional.

### Raycast

- URL: https://www.raycast.com/
- Why it matters: A simple promise, tactile UI object, and satisfying motion around a command-focused product.
- Useful pattern: Keyboard-like physicality, short copy, focused interaction.
- Apply here: Make the invitation feel clickable and physical, like opening a premium card.

### Vercel

- URL: https://vercel.com/
- Why it matters: Strong monochrome/neutral layout, precise cards, performance-oriented polish, and restrained visual rhythm.
- Useful pattern: Modular sections that feel technical but clean.
- Apply here: Admin and form states can use quiet, utilitarian Vercel-like panels.

### Framer

- URL: https://www.framer.com/
- Why it matters: Canvas-style visual editing, image-heavy previews, and motion-led design tooling.
- Useful pattern: Visual editor affordances and live-preview feeling.
- Apply here: The admin editor can feel like a lightweight content studio with live invitation preview.

### Awwwards Minimal / Interactive / Animation Collections

- Minimal: https://www.awwwards.com/websites/minimal/
- Interactive: https://www.awwwards.com/websites/web-interactive/
- Animation: https://www.awwwards.com/websites/animation/
- Why it matters: Inspiration library for current minimal, interactive, and animated execution.
- Useful pattern: Use as mood-board input only; avoid copying overly experimental navigation that hurts RSVP completion.

## Interaction Ideas For This Project

1. Invitation cover reveal
   - A centered invitation card opens with a short press/click animation.
   - The poster slides or scales into place.
   - Keep timing under one second.

2. Poster focus mode
   - Poster appears large and readable.
   - Add a subtle zoom or inspect mode, especially on mobile.
   - Avoid cropping important poster text.

3. Side information rail
   - LinkedIn and `meetnuva.com` links sit beside the poster on desktop and below it on mobile.
   - Use icon buttons plus short labels.

4. Registration flow
   - Compact fields, immediate validation, clear pending/success/error states.
   - If attendee email is required for confirmation, include email as a field.

5. Coupon moment
   - After submission, show a voucher-like UI with coupon code.
   - A short confetti or shine animation is acceptable, but should feel professional.

6. Admin live preview
   - Admin edits content in a clean panel and sees the invitation preview update.
   - Password remains prototype-only unless replaced by env-backed auth.

## Package Options

Already installed:

- `framer-motion@12.42.2`: primary choice for reveal animation, page transitions, hover/tap feedback, and coupon entrance.
- `lucide-react@1.23.0`: icons for LinkedIn link, website link, mail, ticket, lock, save, edit, and admin actions.
- `@radix-ui/react-slot@1.3.0`: useful if button composition grows.

Recommended optional additions:

- `gsap@3.15.0`: use only if the invite reveal needs a more controlled timeline than Framer Motion.
- `lenis@1.3.25`: smooth scroll for a one-page narrative, only if it does not interfere with accessibility or form usability.
- `canvas-confetti@1.9.4`: small coupon success burst after registration.
- `vaul@1.1.2`: mobile drawer for poster zoom, registration, or coupon details.
- `three@0.185.1`: only if adding a real 3D invitation/card effect. Avoid for this project unless the 3D effect is central.

## Recommended Build Choice

Use `framer-motion` first. It is already installed, React-friendly, and enough for:

- invitation press/open animation
- poster reveal
- link hover/tap states
- form success transition
- coupon entrance

Add `canvas-confetti` for the coupon success moment if the first implementation feels too quiet. Add `gsap` only if the reveal becomes a multi-step timeline that is awkward to express in Framer Motion.

## Visual Mood

- Palette: poster red, white, charcoal, soft warm gray.
- Typography: Traditional Chinese readable sans-serif with strong weight contrast.
- Layout: poster as hero object, side rail as supporting context, registration as a compact action panel.
- Motion: short, deliberate, touch-responsive, respectful of `prefers-reduced-motion`.
- Avoid: excessive gradients, floating decorative blobs, heavy 3D, unreadable cropped poster, or party-app playfulness that weakens the professional BNI tone.
