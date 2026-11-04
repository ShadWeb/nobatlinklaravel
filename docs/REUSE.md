# docs/REUSE.md — Reuse decisions

- Login UI → copied from docs/reference/components/nail-app.tsx `Login()` (lines 685-809) and docs/reference/app/login/page.tsx; adapted to React + Inertia `useForm`/router. Reason: reference is the design source of truth (AGENTS.md line 105).
- Start UI → copied from docs/reference/app/start/page.tsx; adapted form submission to real endpoint. Reason: reference is the design source of truth.
- Icons → @phosphor-icons/react (already in package.json). Reason: package already installed, reference uses Phosphor (ASSETS.md line 13).
- CSS classes → copied from docs/reference/app/globals.css; appended missing rose/nail-app and start sections to resources/css/app.css under a marker comment. Reason: keep reference class names, do not rewrite to Tailwind (AGENTS.md line 105).
- JSON OTP endpoints (/api/auth/otp/request, /api/auth/otp/verify) → called with `fetch` + XSRF header instead of Inertia `useForm`. Documented exception: endpoints return JSON, not Inertia responses. After verify, `router.visit(target)` is used for shared props. Handoff: backend should make OTP endpoints Inertia-friendly later.
