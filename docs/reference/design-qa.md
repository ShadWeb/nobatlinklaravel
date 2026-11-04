# Design QA — NobatLink frontend

Source visual truth: the two user-supplied image attachments in the implementation request: blue landing page (1024 × 1536) and rose nail-studio screen board (1536 × 1024). The source attachments are visible in the conversation; the environment does not expose original filesystem paths.

Implementation: http://localhost:3000/ and /nazanin routes.

## Evidence and normalization

- qa/landing-desktop.jpg: desktop landing, 1024 CSS px wide, DPR 1, full-page capture. The final page includes an additional footer; its content height is 1639 px. Compared the visual section order, hero placement, relative section sizing, feature grid, typography, CTA and imagery to the supplied 1024 px landing reference.
- qa/landing-mobile.jpg: 390 × 844 CSS viewport, DPR 1, full-page capture; responsive layout has no mobile counterpart in the source.
- qa/nazanin-mobile.jpg: studio home, 390 px wide, DPR 1.
- qa/date-mobile.jpg: actual Persian calendar, 390 × 844 CSS viewport, DPR 1.
- qa/time-mobile.jpg: 15-slot grid, selected 10:30, 90-minute repair service, 390 × 844, DPR 1.
- qa/login-mobile.jpg: phone-entry screen, 390 × 844, DPR 1.
- qa/appointments-mobile.jpg: customer appointments after successful demo-code entry, 390 × 844, DPR 1.
- qa/dashboard-mobile.jpg: populated calendar after pinning bottom navigation, 390 × 844, DPR 1.

The multi-screen source board is treated as separate screen references, not as a single desktop application. Comparison excludes the board’s numbered headings and device/status-bar decoration. App-owned content is responsive web UI. Source attachment pixels and CSS viewport pixels are compared at equivalent content proportions; there is no numerical pixel-diff claim. Focused review covered the service card, calendar selection, time grid, phone input, appointment card and fixed dashboard navigation.

## Comparison history

1. Initial desktop capture: hero copy and product preview were reversed relative to the source, section rhythm was too tall, and one repeated hero asset appeared in the final CTA. Fixed hero grid direction, section sizing at the reference width, and generated a dedicated tablet/dashboard asset. Final evidence: landing-desktop.jpg.
2. Initial mobile calendar dashboard: a tall schedule pushed bottom navigation below the viewport. Fixed app height and made the calendar content scroll internally. Final evidence: dashboard-mobile.jpg, with navigation and add button visible.
3. The initial generated PNG files were unnecessarily heavy. Converted all generated imagery to WebP (approximately 55–101 KB each) and added distinct service thumbnails. Final evidence: nazanin-mobile.jpg and time-mobile.jpg.
4. Initial Next.js date prerender and dropped-segment diagnostics were resolved by initializing browser data after mount while preserving the rendered route child. Final production build passes and fresh console checks contain no errors or warnings.

## Required fidelity surfaces

- Typography: local Vazirmatn variable Persian font, heavy navy display headings, RTL labels, light muted supporting copy, readable Persian numerals. The exact reference font was not supplied, so mathematical font identity is not claimed.
- Spacing/layout: correct left-copy/right-preview landing hero; six business cards; three steps; four current features; two future features; lower CTA. Studio uses four service tabs, compact cards, a real Persian month grid and a 3-column time grid. Mobile overflow checks at 390 px were clear.
- Colors/tokens: navy #0d1944, indigo #4352ff, rose #b34f6a, blush surfaces and pale borders reproduce the source palette. Focus-visible outlines and reduced-motion support are present.
- Assets: photos and device scenes are generated replacements, not exact original embedded assets. Crops and palette follow the source. Generated images use local WebP files; no broken image requests were observed. Icons are from Phosphor, not handcrafted assets.
- Copy: main landing and nail-service labels follow the source. Dates reflect the actual current calendar. Login uses the reference’s send-code affordance, with explicit demo instructions and code 123456.

## Functional checks

- Navigated home → service → Persian day → time → customer form → successful booking.
- Submitted a valid name and mobile number, checked appointment listing and cancellation confirmation.
- Verified time availability respects opening hours, service duration and browser-local conflicting bookings.
- Edited a service price and observed the updated price and success notice; temporary QA records were cleared afterward.
- Tested phone entry → demo verification code → customer appointments.
- Checked admin calendar and customer route, tabs, service edit dialog, visible fixed navigation and modal close behavior.
- Checked image loading, horizontal overflow and fresh browser console output on representative desktop/mobile routes.
- Production build and TypeScript: passed. No live authentication, SMS, payment or server booking is asserted.

## Findings

No remaining P0/P1/P2 functional or responsive issue was observed in the tested frontend flows.

## Follow-up polish / explicit limits

- P3: generated photos, device scenes and icon details differ from the embedded originals; exact pixel-for-pixel identity is not claimed.
- P3: desktop studio sidebar, footer and demo notices extend the static source to a usable web prototype.
- The backend, multi-device synchronization and production authentication are outside this frontend implementation.
- Development screenshots include the Next.js dev indicator; it is not production UI.

## Implementation checklist

- [x] Landing and all ten nail-studio screen types implemented.
- [x] RTL, Persian typography and responsive layouts.
- [x] Core booking, cancellation, demo login and service edit interactions.
- [x] Local optimized assets and font license.
- [x] Browser evidence and production build.

final result: passed
