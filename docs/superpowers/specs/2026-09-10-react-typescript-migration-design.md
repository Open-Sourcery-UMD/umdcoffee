# Design: Migrate umdcoffee from static HTML/CSS/JS to React + TypeScript

**Date:** 2026-09-10
**Status:** Approved — ready for implementation planning
**Scope:** Migration only. No new features, no redesign, no content changes.

## Goal

Convert the existing static site in `public/` into a Vite + React + TypeScript
application that renders the same markup, loads the same stylesheet, and behaves
identically in the browser.

Success is visual and behavioral parity. If a reviewer cannot tell the old page
from the new one at any viewport width, the migration succeeded.

## Non-Goals

These are explicitly out of scope. Raising any of them mid-implementation means
stopping and asking, not proceeding.

- Adding features, sections, pages, or content.
- Redesigning, refactoring, or reorganizing the CSS.
- Fixing the pre-existing defects catalogued under "Known Issues Preserved".
- Adding routing, state management, a data layer, or a test framework.
- Rewriting the partner scroller as a CSS animation.

## Current State

One real page, `public/index.html` (294 lines), containing six sections:

| Section | Markup | Behavior |
|---|---|---|
| Navbar | inline in `index.html` | pure-CSS hamburger (checkbox hack) |
| Hero | inline | none |
| Events | 3 hand-duplicated `.card` blocks | none |
| FAQ | 5 tabs + 4 accordion cards | inline `onclick` class toggle |
| Partner scroller | 5 images in a track | rAF loop + IntersectionObserver |
| Footer | inline, outside `<main>` | none |

Supporting files:

- `public/style.css` — 682 lines. Global stylesheet, CSS custom properties for
  colors and a minor-third type scale.
- `public/layout.html` / `public/layout.js` — define `<site-header>` and
  `<site-footer>` custom elements. **Dead code for the real site**: `index.html`
  uses its own inline navbar and footer. Their only consumer is `public/demo/`.
  `layout.js` also carries the partner-scroller logic, appended at the bottom.
- `public/demo/index.html` — typography demo page. The README already marks it
  `# TODELETE`.

Tooling: ESLint flat config + Prettier with `prettier-plugin-css-order`. CI runs
`npm run lint` on every push. Vercel deploys with `outputDirectory: "public"`.
There is no build step and no test suite.

## Decisions

Each decision below was settled during brainstorming. The rationale is recorded
so implementation does not relitigate them.

### D1. Toolchain: Vite + React + TypeScript

A plain SPA. `vite build` emits static files to `dist/`.

Rejected: **Next.js** — SSR, file-based routing, and server/client component
rules are a large surface area for a site that is currently one static page;
adopting it would be a re-platform, not a migration. Rejected: **React Router**
— the four nav links (Home, About, Resources, Community) all have empty
`href=""` today, so there is nothing to route between.

### D2. CSS: `style.css` moves verbatim

The stylesheet is moved to `src/style.css` with **zero content edits** and
imported once from `src/main.tsx`. Class names stay global.

Rejected: **CSS Modules** and **per-component stylesheets**. Both would rewrite
every class name or reshuffle the cascade, and the hamburger menu depends on
general-sibling selectors (`#hamburger:checked ~ .nav-links`) that deliberately
cross what would become component boundaries. Keeping the CSS untouched makes
the diff purely about HTML-to-JSX and reduces visual-regression risk to near
zero. It also keeps the existing `prettier-plugin-css-order` setup meaningful.

### D3. Repeated markup becomes components with props, not data arrays

The three event cards and four FAQ cards collapse into single components invoked
multiple times. Content is passed as props **inline at the call site**. No
`src/data/` directory, no `Event[]` / `FaqItem[]` arrays.

Rationale: the club has no real event or FAQ data yet — it is all lorem ipsum
placeholder. A data layer would be scaffolding for content that does not exist.
Components with typed props capture the deduplication benefit without inventing
a content model.

### D4. `demo/` and the web components are deleted

Delete `public/demo/`, `public/layout.html`, and `public/layout.js`. Remove the
"Shared Layout System" section from the README.

Rationale: `demo/` is already flagged for deletion in the README. The
`<site-header>` / `<site-footer>` components exist only to serve `demo/` — the
homepage never used them. Their `links` JSON attribute and `{{BASE}}` token
substitution solve problems that React props and Vite's base handling solve
natively; porting them would mean reimplementing a system for a single dead
consumer.

The partner-scroller logic currently living at the bottom of `layout.js` is not
deleted — it moves into the `PartnerScroller` component (see B3).

### D5. Verification is manual side-by-side

No test framework is added.

Rationale: adding Vitest and Testing Library is new infrastructure this repo has
never had, which is a feature, not a migration. The parity check is inherently
visual, and the page is placeholder content.

## Target Structure

```text
umdcoffee/
├── index.html                   # Vite entry shell — meta, fonts, <div id="root">
├── public/                      # static assets, served from /
│   ├── assets/icons/*.svg
│   ├── card-image-placeholder.png
│   └── partner.svg
├── src/
│   ├── main.tsx                 # createRoot, imports style.css
│   ├── App.tsx                  # composes the six sections
│   ├── style.css                # moved verbatim from public/style.css
│   ├── vite-env.d.ts
│   └── components/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── Events.tsx           # section wrapper, renders 3x EventCard
│       ├── EventCard.tsx
│       ├── Faq.tsx              # section wrapper, renders FaqTab + FaqCard
│       ├── FaqTab.tsx
│       ├── FaqCard.tsx
│       ├── PartnerScroller.tsx
│       ├── Footer.tsx
│       └── FooterLinkColumn.tsx
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── eslint.config.mjs            # extended for TS + React hooks
├── package.json
└── vercel.json                  # outputDirectory: "dist"
```

Asset paths change from relative (`assets/icons/logo.svg`) to root-absolute
(`/assets/icons/logo.svg`), which is how Vite serves the `public/` directory.

## Component Contracts

Every component is a function component with an explicit props interface. None
of them accept `children` unless noted.

| Component | Props | Notes |
|---|---|---|
| `App` | — | Reproduces the outer structure exactly, including the two quirks below. |
| `Navbar` | — | Sibling order is load-bearing. See B1. |
| `Hero` | — | Static. |
| `Events` | — | Renders the section header and three `EventCard`s with inline placeholder props. |
| `EventCard` | `imageSrc, imageAlt, label, date, title, body, ctaLabel` — all `string` | |
| `Faq` | — | Renders the heading, five `FaqTab`s, four `FaqCard`s. |
| `FaqTab` | `icon: string, label: string` | Non-interactive. See K2. |
| `FaqCard` | `question: string, answer: string` | Owns its own open/closed state. See B2. |
| `PartnerScroller` | — | Owns the rAF loop and observer. See B3. |
| `Footer` | — | Renders the logo block, blurb, icon list, and three `FooterLinkColumn`s. |
| `FooterLinkColumn` | `title: string, items: string[]` | Replaces the three duplicated `.links` divs. See the note below. |

`FooterLinkColumn` is named after the existing `.links` class, but nothing in it
is currently an anchor. Each column today is an `<h1>` followed by a variable
number of `<p>` elements (4, 5, and 3 respectively), all reading "Lorem ipsum".
Render `items` as `<p>` elements, not `<a>`, and keep the heading as `<h1>` even
though that means several `<h1>`s on the page — `.links h1` is styled against it.

### Two structural quirks that must be preserved

The current DOM has two oddities that the CSS depends on. `App` must reproduce
both, however strange they look:

1. **The navbar is inside `<main class="layout">`**, not above it.
2. **The footer is outside `<main>`**, a direct child of `<body>`.

The `.layout` and bare `section` selectors in `style.css` are written against
this arrangement. Changing it will shift spacing across the page.

## Behavior Ports

### B1. Hamburger menu — stays pure CSS, zero JavaScript

The menu works today with no JS at all: a hidden checkbox `<input
type="checkbox" id="hamburger">` plus `#hamburger:checked ~ ...`
general-sibling rules inside a `@media (max-width: 768px)` block.

Because the CSS is unchanged (D2), those selectors keep working **only if the
sibling order inside `.navbar` is preserved exactly**:

```text
<input type="checkbox" id="hamburger">
<div class="nav-logo">...</div>
<label for="hamburger" class="hamburger-bars">...</label>
<div class="divider"></div>
<nav class="nav-links">...</nav>
```

Do not introduce `useState` for this. The only changes are JSX syntax:
`class` to `className`, `for` to `htmlFor`, self-closing `<img />`, and the
inline `style="color: oklch(...)"` on the logo span becoming
`style={{ color: 'oklch(...)' }}`.

Note that `#hamburger:checked ~ .navbar` in the existing CSS can never match —
`.navbar` is the checkbox's parent, not its sibling. That rule is inert today
and stays inert. Do not "fix" it.

### B2. FAQ accordion — inline handler becomes local state

Today each card carries
`onclick="this.parentElement.classList.toggle('open')"` on its `.faq-plus` span.

In React, `FaqCard` holds `const [open, setOpen] = useState(false)` and renders
`className={open ? 'faq-card open' : 'faq-card'}`. The click handler goes on the
same `.faq-plus` span it is on today — not on the whole card — so the clickable
area does not change.

### B3. Partner scroller — faithful port into an effect

This is the highest-risk item in the migration.

The existing logic (bottom of `layout.js`) translates the track in pixels with
`requestAnimationFrame`, reparenting the first image to the end of the track
once it has scrolled fully out of view, and starting/stopping the loop with an
`IntersectionObserver` on `.partner-scrolling`.

Port it into `PartnerScroller` using a `useRef` on the track element and a single
`useEffect` with an empty dependency array. Keep the same algorithm: the same
`position -= 0.5` step, the same `offsetWidth + 10rem` wrap threshold computed
from the document root font size, the same `appendChild` reparenting, the same
`threshold: 0` observer.

**The cleanup function is mandatory and must do both things:**

```ts
return () => {
  cancelAnimationFrame(animationId);
  observer.disconnect();
};
```

React StrictMode mounts effects twice in development. Without complete cleanup
the component ends up running two concurrent rAF loops and the marquee scrolls at
double speed — a bug that appears only in dev and is easy to misdiagnose.

The original code also queries the DOM at module scope with
`document.querySelector`, which would throw if the element were absent. Refs
remove that failure mode; that is a consequence of using React correctly, not a
scope expansion.

Do not replace this with a CSS keyframes marquee. That is a rewrite.

## Tooling Changes

| File | Change |
|---|---|
| `package.json` | Add `react`, `react-dom`; dev-add `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `typescript`, `vite`, `typescript-eslint`, `eslint-plugin-react-hooks`. Add `dev`, `build`, `preview` scripts. Flip `"type"` from `"commonjs"` to `"module"`. Keep `lint`, `format`, `format:check` as they are. |
| `eslint.config.mjs` | Extend for TypeScript and React hooks. Keep the existing `plugin:prettier/recommended` integration and the browser globals. |
| `vercel.json` | `outputDirectory`: `"public"` to `"dist"`. |
| `.gitignore` | Add `dist/`. |
| `.github/workflows/ci.yml` | Add `npm run build` after the lint step. `vite build` runs `tsc`, so this type-checks CI as a side effect. |
| `.vscode/settings.json` | Remove the Live Server root override — superseded by `npm run dev`. |
| `README.md` | Rewrite Development, Assets, and File Structure sections. Delete the "Shared Layout System" section. |

`npm run lint` currently runs `npm run format && eslint --fix`, which mutates
files during CI. That is pre-existing behavior and is left alone.

## Known Issues Preserved

These are defects in the current site. The migration **carries them across
unchanged** — fixing them would make parity unverifiable and mix two kinds of
change in one diff. They are recorded here so they are tracked rather than
silently inherited, and should become follow-up issues.

- **K1.** The hero references `coffee-cup.png`, which does not exist in `public/`.
  The image is broken today and stays broken.
- **K2.** `.faq-tab.active` is styled in `style.css` but nothing ever applies the
  class. The five FAQ tabs are non-interactive decoration.
- **K3.** All four primary nav links have empty `href=""`, as do the `Join`
  call-to-action and the hero's `Get Involved` button.
- **K4.** The page `<title>` is "My Club", not "Coffee @ UMD".
- **K5.** Two footer social icons (Discord, LinkedIn) link to `/`.
- **K6.** The `#hamburger:checked ~ .navbar` CSS rule can never match. See B1.

## Verification Plan

Run both versions concurrently and compare:

```bash
# original
cd public && python3 -m http.server 5500

# migrated
npm run dev
```

Check each of the six sections at a desktop width and at 768px or below:

1. Navbar — logo, link styling, `current-page` highlight on Home.
2. Hamburger at 768px or below — opens, closes, the divider appears, the bars
   recolor.
3. Hero — type scale, highlight spans, CTA button. K1 means the image is broken
   in **both**; confirm it is equally broken, not differently broken.
4. Events — three cards, identical spacing and card borders.
5. FAQ — all four cards open and close independently; the plus sign rotates.
6. Partner scroller — scrolls at the same speed, wraps seamlessly, pauses when
   scrolled out of view. Verify in a production build (`npm run build` then
   `npm run preview`) as well as dev, to rule out the StrictMode double-loop
   described in B3.
7. Footer — three link columns, five social icons, correct external URLs.

Finally, confirm `npm run build` succeeds with no TypeScript errors and
`npm run format:check` passes.

## Risks

| Risk | Mitigation |
|---|---|
| Sibling-selector breakage collapses the mobile menu | B1 pins the required DOM order; verify at 768px and below explicitly. |
| StrictMode double-invokes the scroller effect | B3 mandates complete cleanup; verify in dev *and* preview. |
| Asset paths silently 404 after the `public/` move | Verification step checks every image renders (except the already-broken K1). |
| Vercel keeps deploying the old `public/` output | The `vercel.json` change is part of the cutover; confirm the first preview deploy. |
