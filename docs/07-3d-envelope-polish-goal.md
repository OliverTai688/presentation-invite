# 3D Envelope Polish Goal

## Active Objective

Refine the BNI invitation into a tactile 3D letter-opening experience:

- The first screen should feel like receiving a real invitation envelope.
- The user clicks the envelope.
- The envelope flap opens with depth and perspective.
- The poster pulls upward from the envelope.
- The transition leads into the full poster, RSVP form, LinkedIn/meetnuva links, coupon flow, and admin-managed content.

## Automation

The `bni` Codex heartbeat automation is active again and attached to this thread.

- Cadence: every 5 minutes.
- Purpose: continue this 3D envelope polish goal until the experience is refined and still Vercel-ready.
- Completion behavior: pause the automation and mark the goal complete when the criteria below are proven.

## SubAgent Usage

Use subAgents for focused research, UX audit, or verification. The main agent owns integration.

Completed subAgent research:

- Research third-party animation and 3D options for the envelope/poster interaction.
- Compare CSS 3D, Framer Motion, GSAP, Three.js/react-three-fiber, Theatre.js, Lottie, and react-spring.
- Recommend the safest route for Next.js 16, React 19, Vercel, and npm/package-lock.

Research outcome:

- Adopted route: keep Framer Motion + CSS 3D and do not add new runtime dependencies.
- Applied refinements: staged open timing, seal fade, flap opening, poster pull-up, pointer parallax, paper texture, flap back face, and envelope depth.
- Deferred route: GSAP can be considered only if future timeline control becomes difficult.
- Avoided route for this scope: Three.js/react-three-fiber, Theatre.js, Lottie, and react-spring, because their added bundle, SSR, or workflow complexity is not justified for the current interaction.

## Allowed Enhancements

Third-party packages or Codex skills may be added when they clearly improve the real-letter interaction and do not compromise deployment.

Before adopting a package:

- Confirm Next.js 16 and React 19 compatibility.
- Prefer packages that work in Client Components without SSR hazards.
- Keep bundle size and mobile performance reasonable.
- Preserve `npm run lint`, `npm run build`, and `npm audit --omit=dev`.
- Keep package management on npm with `package-lock.json`.

## Done Criteria

- The 3D envelope opening reads visually as an envelope, not a flat card.
- The poster visibly rises from the envelope after click.
- Desktop and mobile have no horizontal overflow.
- Reduced-motion users bypass or minimize the cinematic transition.
- Public invite, RSVP, email path, storage, coupon UI, admin editor, and Vercel deployment instructions remain intact.
- Browser verification covers initial state, opening state, final state, and mobile state.
- `npm run lint`, `npm run build`, and `npm audit --omit=dev` pass.
