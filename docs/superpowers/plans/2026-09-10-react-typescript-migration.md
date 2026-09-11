# React + TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static site in `public/` into a Vite + React + TypeScript app that renders equivalent markup, loads the same stylesheet, and behaves identically in the browser.

**Architecture:** A plain Vite SPA. One `index.html` shell at the repo root mounts `src/main.tsx`, which imports `src/style.css` (moved verbatim from `public/style.css`) and renders `App`. `App` composes nine presentational components that reproduce the existing DOM node-for-node. Class names stay global; no CSS Modules, no routing, no state library, no data layer, no test framework.

**Tech Stack:** Vite 7, React 19, TypeScript 5, `@vitejs/plugin-react`, ESLint 10 flat config + `typescript-eslint` + `eslint-plugin-react-hooks`, Prettier 3 with `prettier-plugin-css-order`.

**Spec:** `docs/superpowers/specs/2026-09-10-react-typescript-migration-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Migration only.** No new features, sections, pages, or content. No redesign. No CSS refactor. If a task seems to call for one, stop and ask.
- **`src/style.css` is moved verbatim.** Zero content edits. Zero reordering. Do not run a formatter over it (see the Prettier Hazard below).
- **Known issues K1–K6 are preserved, not fixed.** Broken hero image, inert `.faq-tab.active`, empty `href=""` values, `<title>My Club</title>`, Discord/LinkedIn pointing at `/`, and the unmatchable `#hamburger:checked ~ .navbar` rule all survive the migration unchanged.
- **DOM structure is load-bearing.** The navbar lives *inside* `<main class="layout">`; the footer lives *outside* `<main>`. The five children of `.navbar` keep their exact sibling order. Changing either shifts spacing or breaks the mobile menu.
- **Asset paths become root-absolute.** `assets/icons/logo.svg` → `/assets/icons/logo.svg`, `card-image-placeholder.png` → `/card-image-placeholder.png`, `partner.svg` → `/partner.svg`, `coffee-cup.png` → `/coffee-cup.png`.
- **Node floor:** Vite 7 requires Node `^20.19.0 || >=22.12.0`. CI pins `node-version: 20`, which resolves to 20.19+, so it satisfies the floor. Do not change the CI Node version as part of this migration.
- **No test framework.** Verification is `npm run build` plus a manual side-by-side visual comparison (Task 8).

### The Prettier Hazard (read before Task 1)

`npm run lint` is defined as `npm run format && npx eslint --fix .`, so **linting mutates files**. `public/style.css` is *not* currently Prettier-formatted (e.g. `public/style.css:389` keeps two selectors on one line, which Prettier would split). `prettier-plugin-css-order` additionally **reorders declarations within a rule**, which is more than whitespace.

Therefore:

- Task 1 records a `npm run format:check` baseline **before** any changes.
- Never run `npm run format` or `npm run lint` against `src/style.css`. Use `npx eslint --fix .` directly when you want lint autofix without the formatter.
- If `format:check` fails on `src/style.css` at the end, that is a **pre-existing** failure carried across by the verbatim move. Report it; do not "fix" it by reformatting. Reformatting is a content edit and violates D2.

### The `legacy/` staging directory

The spec's verification plan requires serving the **original** site side by side with the migrated one. But Vite reserves the repo-root `index.html` as its entry shell and copies `public/*` verbatim into `dist/`, so a surviving `public/index.html` would collide with the generated one.

Task 1 therefore moves the whole original site to `legacy/` at the repo root, where Vite never looks, and rebuilds a fresh `public/` holding only static assets. `legacy/` exists purely as the parity reference and is **deleted in Task 8** after verification passes. It must never be referenced from `src/`, `index.html`, or any config.

### Spec correction: footer column paragraph counts

The spec's `FooterLinkColumn` note says the three columns hold "4, 5, and 3" `<p>` elements. That counts the `<h1>` as one of them. The actual source (`public/index.html:273-290`) is:

| Column | `<h1>` | `<p>` count |
|---|---|---|
| 1 | Lorem ipsum | 3 |
| 2 | Lorem ipsum | 4 |
| 3 | Lorem ipsum | 2 |

**Use 3, 4, 2.** Task 6 encodes these. Do not "correct" them upward to match the spec prose.

### JSX whitespace trap

JSX strips whitespace at line boundaries. HTML does not. Where the original has text, a newline, then an inline element — as in the hero description's `Join\n<strong>Coffee @ UMD</strong>` — a naive JSX transcription renders `JoinCoffee @ UMD`. Insert an explicit `{' '}` at every such boundary. After any Prettier run on `.tsx` files, re-read the diff for text/element boundaries that lost a space.

---

### Task 1: Toolchain scaffold, legacy staging, and asset move

Installs the Vite/React/TypeScript toolchain, relocates the original site to `legacy/`, rebuilds `public/` as a pure asset directory, and moves the stylesheet to `src/`. Ends with an empty-but-styled React app that builds clean.

**Files:**
- Create: `index.html` (repo root), `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`
- Create (copied): `src/style.css` (from `public/style.css`, verbatim), `public/assets/icons/*.svg`, `public/card-image-placeholder.png`, `public/partner.svg`
- Move: `public/` → `legacy/` (entire directory, temporary)
- Modify: `package.json`, `eslint.config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `App` — default export, `() => JSX.Element`, from `src/App.tsx`. Tasks 2–6 add children to it. `src/components/` is the home for every component; each is a **default export** function component.

- [ ] **Step 1: Record the pre-existing formatter baseline**

```bash
npm ci
npm run format:check > /tmp/format-baseline.txt 2>&1; echo "exit=$?" >> /tmp/format-baseline.txt
cat /tmp/format-baseline.txt
```

Expected: it may already FAIL, listing `public/style.css` among others. Save this output — Task 8 compares against it. Do **not** fix anything here.

- [ ] **Step 2: Stage the original site as the parity reference**

```bash
git mv public legacy
mkdir -p public/assets
cp -r legacy/assets/icons public/assets/icons
cp legacy/card-image-placeholder.png public/card-image-placeholder.png
cp legacy/partner.svg public/partner.svg
```

`style.css` is **copied** rather than moved in Step 3 — the legacy page needs its own copy to render for comparison.

Verify:

```bash
ls public public/assets/icons
ls legacy
```

Expected: `public/` holds `assets/`, `card-image-placeholder.png`, `partner.svg` and nothing else. `legacy/` holds `index.html`, `style.css`, `layout.html`, `layout.js`, `demo/`, `assets/`, and the two images.

- [ ] **Step 3: Move the stylesheet verbatim**

```bash
mkdir -p src/components
cp legacy/style.css src/style.css
diff legacy/style.css src/style.css && echo "IDENTICAL"
```

Expected: `IDENTICAL`. If `diff` prints anything, the copy is wrong — redo it.

- [ ] **Step 4: Install dependencies**

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom @vitejs/plugin-react typescript vite typescript-eslint eslint-plugin-react-hooks
```

If npm reports a peer-dependency conflict against the installed `eslint@^10`, **stop and report it**. Do not downgrade ESLint and do not pass `--force` or `--legacy-peer-deps` — changing the lint toolchain's major version is outside this migration's scope.

- [ ] **Step 5: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 6: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 7: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 8: Write `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 9: Write the root `index.html` shell**

Note what carries over from `legacy/index.html:1-14` and what does not: the charset, viewport, `<title>My Club</title>` (K4 — do **not** rename it), and the three Google Fonts tags all stay. The `<link rel="stylesheet" href="./style.css">` is dropped because `main.tsx` imports the CSS. The `prefetch`/`modulepreload` hints for `layout.html` and `layout.js` are dropped because those files are being deleted (D4).

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Club</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 11: Write the placeholder `src/App.tsx`**

This is the real outer structure from `legacy/index.html:18` and `:240-244` — `<main class="layout">` wrapping everything, with the footer as a sibling outside it. Tasks 2–6 fill in the children; the two structural quirks are already correct here and must stay.

```tsx
export default function App() {
  return (
    <>
      <main className="layout"></main>
    </>
  );
}
```

- [ ] **Step 12: Update `package.json`**

Flip `"type"` to `"module"`, add the three Vite scripts, and leave `lint`, `lint:fix`, `format`, and `format:check` exactly as they are. The `test` script stays as-is (D5 — no test framework).

```json
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "npm run format && npx eslint --fix .",
    "lint:fix": "npx eslint --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
```

- [ ] **Step 13: Determine the react-hooks flat-config export name**

The export moved between major versions. Check which one the installed copy has before editing the ESLint config:

```bash
node -e "import('eslint-plugin-react-hooks').then(m => console.log(Object.keys(m.default.configs)))"
```

Expected: an array containing either `recommended-latest` (v6+) or `flat` (v5). Use `reactHooks.configs['recommended-latest']` if the former is present, `reactHooks.configs.flat.recommended` if only the latter is.

- [ ] **Step 14: Extend `eslint.config.mjs`**

Keep the existing `FlatCompat` plumbing and browser globals. Add TypeScript and react-hooks, ignore `dist`, and keep `plugin:prettier/recommended` **last** so it wins the rule-disabling race.

```js
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,mjs,ts,tsx}'],

    extends: [
      compat.extends('eslint:recommended'),
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      compat.extends('plugin:prettier/recommended'),
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
]);
```

If Step 13 reported `flat` instead, swap that one line to `reactHooks.configs.flat.recommended`.

- [ ] **Step 15: Verify the build and the lint pass**

```bash
npm run build
npx eslint .
```

Expected: `npm run build` succeeds with no TypeScript errors and writes `dist/index.html` plus `dist/assets/`. `npx eslint .` reports no errors. Note this uses `npx eslint` directly, **not** `npm run lint`, to keep Prettier away from `src/style.css`.

- [ ] **Step 16: Verify the dev server renders a styled blank page**

```bash
npm run dev
```

Open the printed URL. Expected: a blank page whose background is the cream `#F5E7D6` from `src/style.css:6`, confirming the stylesheet import works. Check DevTools → Network: no 404s. Stop the server.

- [ ] **Step 17: Verify the legacy reference still serves**

```bash
cd legacy && python3 -m http.server 5500
```

Open `http://localhost:5500`. Expected: the original site renders exactly as before the migration started — nav, hero (with the K1 broken image), events, FAQ, scrolling partners, footer. Stop the server. This is the baseline every later task compares against.

- [ ] **Step 18: Commit**

```bash
git add -A
git commit -m "build: scaffold Vite + React + TypeScript toolchain

Stage the original static site under legacy/ as the parity reference,
rebuild public/ as an asset-only directory, and move style.css to src/
verbatim. legacy/ is deleted once verification passes."
```

---

### Task 2: App shell, Navbar, and Hero

**Files:**
- Create: `src/components/Navbar.tsx`, `src/components/Hero.tsx`
- Modify: `src/App.tsx`
- Reference: `legacy/index.html:22-70`, `src/style.css:122-270`

**Interfaces:**
- Consumes: `App` from `src/App.tsx` (Task 1).
- Produces: `Navbar` — default export, `() => JSX.Element`, no props. `Hero` — default export, `() => JSX.Element`, no props.

- [ ] **Step 1: Write `src/components/Navbar.tsx`**

The five children of `.navbar` must appear in exactly this order — checkbox, logo, label, divider, nav — because `src/style.css:230-267` targets them with general-sibling combinators (`#hamburger:checked ~ .nav-links`, `~ .divider`, `~ .hamburger-bars svg rect`). Reordering them silently kills the mobile menu.

Do **not** add `useState` here. The menu is pure CSS (B1). The `<input>` is deliberately uncontrolled — it has no `checked` prop, so React will not warn.

```tsx
export default function Navbar() {
  return (
    <div className="navbar">
      <input type="checkbox" id="hamburger" />

      <div className="nav-logo">
        <a href="/" className="logo-link">
          <img src="/assets/icons/logo.svg" alt="Coffee Logo" />
        </a>
        <p className="logo-text">
          Coffee<span style={{ color: 'oklch(73.229% 0.15551 25.739)' }}> @ UMD </span>
        </p>
      </div>

      <label htmlFor="hamburger" className="hamburger-bars">
        <svg viewBox="0 0 100 80" width="40" height="40">
          <rect width="100" height="20" rx="10" fill="oklch(23.433% 0.01913 40.841)"></rect>
          <rect y="30" width="100" height="20" rx="10" fill="oklch(23.433% 0.01913 40.841)"></rect>
          <rect y="60" width="100" height="20" rx="10" fill="oklch(23.433% 0.01913 40.841)"></rect>
        </svg>
      </label>

      <div className="divider"></div>

      <nav className="nav-links">
        <div className="nav-page">
          <a href="" className="current-page">
            Home
          </a>
          <a href="">About</a>
          <a href="">Resources</a>
          <a href="">Community</a>
        </div>
        <div className="nav-action">
          <a href="">Join</a>
        </div>
      </nav>
    </div>
  );
}
```

The four empty `href=""` values and the empty `Join` href are K3. Leave them empty.

- [ ] **Step 2: Write `src/components/Hero.tsx`**

Two whitespace boundaries matter here. `Join{' '}` before `<strong>` is mandatory — without it JSX renders `JoinCoffee @ UMD`. The ` - UMD coolest club!` after `</strong>` must stay on the same source line as the closing tag so its leading space survives.

`/coffee-cup.png` does not exist in `public/` (K1). The image is broken today and stays broken.

```tsx
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="subtitle">University of Maryland</p>
        <h1>
          Dream of <span className="highlight">Coffee</span>
          <br />
          Coffee of <span className="highlight">Dreams</span>
        </h1>
        <p className="description">
          Want unlimited, free specialty coffee (and sometimes Matcha lattes and other goodies) every
          week? Want to kick back, relax or study, make new friends, and learn how to make coffee?
          Join{' '}
          <strong>Coffee @ UMD</strong> - UMD coolest club!
        </p>
        <a href="#" className="cta-button">
          Get Involved
        </a>
      </div>
      <div className="hero-image">
        <img src="/coffee-cup.png" alt="Coffee cup" />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire both into `src/App.tsx`**

```tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
npm run build
npx eslint .
```

Expected: both succeed with no errors.

- [ ] **Step 5: Verify visually against the legacy reference**

Run both servers:

```bash
# terminal 1
cd legacy && python3 -m http.server 5500
# terminal 2
npm run dev
```

At a desktop width (>=1280px), compare:

1. Logo image renders; `Coffee` is dark and ` @ UMD ` is coral, with the spaces around `@ UMD` intact.
2. Nav links read Home / About / Resources / Community, with `Home` carrying the `current-page` styling.
3. `Join` renders in the `.nav-action` pill.
4. Hero subtitle, the two-line `h1` with both `.highlight` spans, the description paragraph (confirm the space between `Join` and the bold `Coffee @ UMD`), and the `Get Involved` button all match.
5. The hero image is broken in **both** — a 404 on `coffee-cup.png` either way, not a differently-broken state.

Now narrow the viewport to 768px or below and compare:

6. The hamburger bars appear and the nav links collapse.
7. Clicking the bars opens the menu, the divider appears, and the bars recolor.
8. Clicking again closes it.

If the menu fails to open, the sibling order inside `.navbar` is wrong. Re-check Step 1 against `legacy/index.html:22-55`.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/Navbar.tsx src/components/Hero.tsx
git commit -m "feat: port navbar and hero to React components"
```

---

### Task 3: Events section

**Files:**
- Create: `src/components/Events.tsx`, `src/components/EventCard.tsx`
- Modify: `src/App.tsx`
- Reference: `legacy/index.html:73-140`

**Interfaces:**
- Consumes: `App` from `src/App.tsx`.
- Produces: `Events` — default export, `() => JSX.Element`, no props. `EventCard` — default export, props interface `EventCardProps { imageSrc: string; imageAlt: string; label: string; date: string; title: string; body: string; ctaLabel: string }`.

- [ ] **Step 1: Write `src/components/EventCard.tsx`**

Note the `<button>` wraps a `<p>`, exactly as in the source — `src/style.css` styles `.card-content-hero-action` against that nesting.

```tsx
interface EventCardProps {
  imageSrc: string;
  imageAlt: string;
  label: string;
  date: string;
  title: string;
  body: string;
  ctaLabel: string;
}

export default function EventCard({
  imageSrc,
  imageAlt,
  label,
  date,
  title,
  body,
  ctaLabel,
}: EventCardProps) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={imageSrc} alt={imageAlt} />
        <div className="card-image-border"></div>
      </div>
      <div className="card-content">
        <div className="card-content-header">
          <div className="card-content-header-label">
            <p>{label}</p>
          </div>
          <p className="card-content-header-date">{date}</p>
        </div>
        <div className="card-content-body">
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
        <button className="card-content-hero-action">
          <p>{ctaLabel}</p>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/Events.tsx`**

Per D3, the placeholder content is passed **inline at each call site**. The three cards are identical in the source, so the repetition below is intentional — do **not** hoist the strings into a module constant or a `src/data/` array. The club has no real event data yet; a data model would be scaffolding for content that does not exist.

```tsx
import EventCard from './EventCard';

export default function Events() {
  return (
    <section className="events-sec">
      <div className="events-sec-text">
        <p>EVENTS</p>
        <h2>Join us in our weekly events!</h2>
      </div>
      <div className="events-sec-cards">
        <EventCard
          imageSrc="/card-image-placeholder.png"
          imageAlt="Barista pouring coffee into a cup"
          label="Lorem"
          date="July 31, 2025"
          title="Lorem Ipsum"
          body="Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat."
          ctaLabel="Get Involved"
        />
        <EventCard
          imageSrc="/card-image-placeholder.png"
          imageAlt="Barista pouring coffee into a cup"
          label="Lorem"
          date="July 31, 2025"
          title="Lorem Ipsum"
          body="Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat."
          ctaLabel="Get Involved"
        />
        <EventCard
          imageSrc="/card-image-placeholder.png"
          imageAlt="Barista pouring coffee into a cup"
          label="Lorem"
          date="July 31, 2025"
          title="Lorem Ipsum"
          body="Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat."
          ctaLabel="Get Involved"
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into `src/App.tsx`**

```tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
        <Events />
      </main>
    </>
  );
}
```

The commented-out duplicate `.card` block at `legacy/index.html:145-163` is dead markup. It is not ported.

- [ ] **Step 4: Verify the build**

```bash
npm run build
npx eslint .
```

Expected: both succeed with no errors.

- [ ] **Step 5: Verify visually against the legacy reference**

With both servers running, compare the events section at desktop width and at 768px:

1. The `EVENTS` eyebrow and `Join us in our weekly events!` heading match.
2. Exactly three cards, each with a rendered placeholder image and its `.card-image-border` overlay.
3. Card spacing, borders, and wrap behavior are identical — the cards should wrap the same way at the same width.
4. Each card shows the `Lorem` label chip, the `July 31, 2025` date, the `Lorem Ipsum` heading, the body paragraph, and the `Get Involved` button.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/Events.tsx src/components/EventCard.tsx
git commit -m "feat: port events section to React components"
```

---

### Task 4: FAQ section

**Files:**
- Create: `src/components/Faq.tsx`, `src/components/FaqTab.tsx`, `src/components/FaqCard.tsx`
- Modify: `src/App.tsx`
- Reference: `legacy/index.html:166-225`, `src/style.css:635-682`

**Interfaces:**
- Consumes: `App` from `src/App.tsx`.
- Produces: `Faq` — default export, `() => JSX.Element`, no props. `FaqTab` — default export, props `{ icon: string; label: string }`. `FaqCard` — default export, props `{ question: string; answer: string }`, owns its own open/closed state.

- [ ] **Step 1: Write `src/components/FaqTab.tsx`**

Non-interactive by design (K2). `.faq-tab.active` is styled in `src/style.css` but nothing applies the class today — do not add a click handler, do not add state, do not wire up tab filtering.

```tsx
interface FaqTabProps {
  icon: string;
  label: string;
}

export default function FaqTab({ icon, label }: FaqTabProps) {
  return (
    <div className="faq-tab">
      <span className="tab-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/FaqCard.tsx`**

B2: the inline `onclick="this.parentElement.classList.toggle('open')"` becomes local state. The handler goes on the `.faq-plus` span — the same element it is on today — so the clickable region does not grow to the whole card.

```tsx
import { useState } from 'react';

interface FaqCardProps {
  question: string;
  answer: string;
}

export default function FaqCard({ question, answer }: FaqCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={open ? 'faq-card open' : 'faq-card'}>
      <span className="faq-plus" onClick={() => setOpen(!open)}>
        +
      </span>
      <h3 className="faq-question">{question}</h3>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}
```

Each card holds its own `open`, so the four cards toggle independently — matching today's per-element `classList.toggle`.

- [ ] **Step 3: Write `src/components/Faq.tsx`**

All four cards share the same answer text in the source. As with Task 3, repeat it inline rather than hoisting it.

```tsx
import FaqTab from './FaqTab';
import FaqCard from './FaqCard';

export default function Faq() {
  return (
    <section className="faq">
      <h2 className="faq-title">Common Questions Answered</h2>
      <p className="faq-subtitle">Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>

      <div className="faq-tabs">
        <FaqTab icon="☕" label="Coffee Secrets" />
        <FaqTab icon="✉️" label="Contact Us" />
        <FaqTab icon="👥" label="Joining the Club" />
        <FaqTab icon="📖" label="Coffee Blogs" />
        <FaqTab icon="📅" label="Hosting Events" />
      </div>

      <div className="faq-cards">
        <FaqCard
          question="What does your club do?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
        <FaqCard
          question="How do I get started?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
        <FaqCard
          question="How often do you meet?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
        <FaqCard
          question="How do I collab with this club?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
      </div>
    </section>
  );
}
```

Confirm the emoji survive the round trip — the five tab icons are ☕ ✉️ 👥 📖 📅, and ✉️ is a two-codepoint sequence (U+2709 U+FE0F). If your editor strips the variation selector the glyph renders monochrome.

- [ ] **Step 4: Wire into `src/App.tsx`**

```tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Faq from './components/Faq';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
        <Events />
        <Faq />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify the build**

```bash
npm run build
npx eslint .
```

Expected: both succeed with no errors.

- [ ] **Step 6: Verify visually against the legacy reference**

1. Title, subtitle, and five tabs render with the correct emoji in the correct order.
2. Hovering a tab applies the `.faq-tab:hover` swap in both versions; clicking does nothing in both (K2).
3. Four cards in a two-per-row grid at desktop width.
4. Clicking a `+` opens that card only — the answer expands with the `max-height` transition and the `+` rotates 45° into an ×.
5. Open two cards at once and confirm both stay open, then close one and confirm the other is unaffected.
6. Clicking the question text or the card body does **not** toggle — only the `+` does.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/Faq.tsx src/components/FaqTab.tsx src/components/FaqCard.tsx
git commit -m "feat: port FAQ section with per-card accordion state"
```

---

### Task 5: Partner scroller

The highest-risk item in the migration (B3). The rAF loop and IntersectionObserver move out of module scope in `legacy/layout.js:152-178` and into a single effect with complete cleanup.

**Files:**
- Create: `src/components/PartnerScroller.tsx`
- Modify: `src/App.tsx`
- Reference: `legacy/layout.js:152-178`, `legacy/index.html:229-239`, `src/style.css:468-500`

**Interfaces:**
- Consumes: `App` from `src/App.tsx`.
- Produces: `PartnerScroller` — default export, `() => JSX.Element`, no props. Owns two refs and one effect; exposes nothing.

- [ ] **Step 1: Write `src/components/PartnerScroller.tsx`**

The algorithm is a faithful port. Same `position -= 0.5` step. Same wrap threshold of `first image offsetWidth + 10rem` computed from the document root font size (the `10rem` matches the `gap: 10rem` at `src/style.css:474-478`). Same `appendChild` reparenting of the first child to the end. Same `{ threshold: 0 }` observer on `.partner-scrolling`.

Two things change, both consequences of using React correctly rather than scope expansion: the module-scope `document.querySelector` calls become refs (removing the crash-if-absent failure mode), and the effect gets a cleanup function.

**The cleanup is mandatory and must do both things.** React StrictMode mounts effects twice in development. Cancel the frame but forget `observer.disconnect()` — or vice versa — and you end up with two concurrent rAF loops driving the same element, so the marquee scrolls at double speed. That symptom appears *only* in dev, which makes it easy to misdiagnose as a CSS problem.

Do **not** replace this with a CSS keyframes marquee. That is a rewrite, not a migration.

```tsx
import { useEffect, useRef } from 'react';

export default function PartnerScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    let position = 0;
    let animationId = 0;

    function scroll() {
      position -= 0.5;

      const firstImage = track.children[0] as HTMLElement;
      const imgWidth =
        firstImage.offsetWidth +
        10 * parseFloat(getComputedStyle(document.documentElement).fontSize);

      if (Math.abs(position) >= imgWidth) {
        position += imgWidth;
        track.appendChild(track.children[0]);
      }

      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(scroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationId = requestAnimationFrame(scroll);
        } else {
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="partner-scrolling" ref={containerRef}>
      <div className="partner-scrolling-partners" ref={trackRef}>
        <img src="/partner.svg" alt="Partner 1" />
        <img src="/partner.svg" alt="Partner 2" />
        <img src="/partner.svg" alt="Partner 3" />
        <img src="/partner.svg" alt="Partner 4" />
        <img src="/partner.svg" alt="Partner 5" />
      </div>
      <div className="partner-scrolling-fade-left"></div>
      <div className="partner-scrolling-fade-right"></div>
    </div>
  );
}
```

`container` and `track` are `const` and narrowed to non-null before `scroll` is declared, so TypeScript keeps the narrowing inside the closure — no `!` assertions are needed. If you find yourself reaching for `!`, you have used `let` somewhere.

The effect's dependency array is empty and must stay empty. `eslint-plugin-react-hooks` should report nothing here; if it flags a missing dependency, you have referenced something from render scope that does not belong in the effect.

- [ ] **Step 2: Wire into `src/App.tsx`**

The scroller is the last child of `<main class="layout">`, matching `legacy/index.html:229-240`.

```tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Faq from './components/Faq';
import PartnerScroller from './components/PartnerScroller';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
        <Events />
        <Faq />
        <PartnerScroller />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
npx eslint .
```

Expected: both succeed with no errors, and no `react-hooks/exhaustive-deps` warning.

- [ ] **Step 4: Verify in the dev server (StrictMode active)**

```bash
npm run dev
```

With the legacy server also running, put the two windows side by side and watch the marquee for at least 30 seconds:

1. **Speed parity.** Both scroll left at visibly the same rate. If the React version is roughly twice as fast, the cleanup is incomplete — go back to Step 1 and confirm both `cancelAnimationFrame` and `observer.disconnect()` are in the returned function.
2. **Seamless wrap.** When the leftmost logo exits, it reappears on the right with no visible jump or gap.
3. **Pause on exit.** Scroll the section out of view for ~10 seconds, scroll back, and confirm the marquee resumed rather than having advanced while hidden.
4. **Fade masks.** The left and right gradient overlays sit above the logos in both versions.

- [ ] **Step 5: Verify in a production build (StrictMode double-mount absent)**

```bash
npm run build && npm run preview
```

Repeat all four checks from Step 4 against the preview URL. Both dev and preview must match the legacy reference — a version that looks right in only one of the two indicates a cleanup bug that the other mode happens to mask.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/PartnerScroller.tsx
git commit -m "feat: port partner scroller into an effect with full cleanup"
```

---

### Task 6: Footer

**Files:**
- Create: `src/components/Footer.tsx`, `src/components/FooterLinkColumn.tsx`
- Modify: `src/App.tsx`
- Reference: `legacy/index.html:244-291`

**Interfaces:**
- Consumes: `App` from `src/App.tsx`.
- Produces: `Footer` — default export, `() => JSX.Element`, no props. `FooterLinkColumn` — default export, props `{ title: string; items: string[] }`.

- [ ] **Step 1: Write `src/components/FooterLinkColumn.tsx`**

Despite the name, nothing in a column is currently an anchor. Render `items` as `<p>` elements, **not** `<a>`. Keep the heading as `<h1>` even though that puts several `<h1>`s on one page — `.links h1` in `src/style.css` is written against it, and changing the tag changes the type scale.

```tsx
interface FooterLinkColumnProps {
  title: string;
  items: string[];
}

export default function FooterLinkColumn({ title, items }: FooterLinkColumnProps) {
  return (
    <div className="links">
      <h1>{title}</h1>
      {items.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}
```

The index key is correct here: the list is static, never reordered, and never filtered.

- [ ] **Step 2: Write `src/components/Footer.tsx`**

Column paragraph counts are **3, 4, 2** — read off `legacy/index.html:273-290`. The spec prose says "4, 5, and 3" because it counted the `<h1>`; do not follow the prose.

The five social links keep their exact current hrefs, including the two placeholder `/` values for Discord and LinkedIn (K5).

```tsx
import FooterLinkColumn from './FooterLinkColumn';

export default function Footer() {
  return (
    <div className="footer-section">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/icons/logo.svg" alt="Coffee Logo" />
          <p className="logo-text">
            Coffee
            <span style={{ color: 'oklch(73.229% 0.15551 25.739)' }}>
              {' '}
              @ University of Maryland{' '}
            </span>
          </p>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
          pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
        <div className="icon-list">
          <a href="https://github.com/Open-Sourcery-UMD/umdcoffee" className="icon">
            <img src="/assets/icons/github-icon.svg" alt="Coffee @ UMD Website Github" />
          </a>
          <a href="https://www.instagram.com/umdcoffee/" className="icon">
            <img src="/assets/icons/instagram-icon.svg" alt="Coffee @ UMD Instagram" />
          </a>
          <a href="/" className="icon">
            <img src="/assets/icons/discord-icon.svg" alt="Coffee @ UMD Discord" />
          </a>
          <a href="/" className="icon">
            <img src="/assets/icons/linkedin-icon.svg" alt="Coffee @ UMD LinkedIn" />
          </a>
          <a href="https://terplink.umd.edu/organization/coffee" className="icon">
            <img src="/assets/icons/terplink-icon.svg" alt="Coffee @ UMD TerpLink" />
          </a>
        </div>
      </div>
      <FooterLinkColumn title="Lorem ipsum" items={['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']} />
      <FooterLinkColumn
        title="Lorem ipsum"
        items={['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']}
      />
      <FooterLinkColumn title="Lorem ipsum" items={['Lorem ipsum', 'Lorem ipsum']} />
    </div>
  );
}
```

The two `{' '}` entries inside the coral span reproduce the leading and trailing spaces in `<span> @ University of Maryland </span>`. Without them the text renders flush against `Coffee`.

- [ ] **Step 3: Wire into `src/App.tsx`**

The footer is a **sibling of `<main>`, not a child.** `src/style.css` writes `.layout` and the bare `section` selectors against that arrangement; nesting the footer inside `<main>` shifts spacing across the page. This is why `App` returns a fragment.

```tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Faq from './components/Faq';
import PartnerScroller from './components/PartnerScroller';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
        <Events />
        <Faq />
        <PartnerScroller />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
npm run build
npx eslint .
```

Expected: both succeed with no errors.

- [ ] **Step 5: Verify visually and structurally**

1. In DevTools, confirm `.footer-section` is a **sibling** of `<main class="layout">` inside `#root`, not a descendant of `<main>`.
2. Footer logo, the coral ` @ University of Maryland ` span (spaces intact), and the blurb paragraph match the legacy version.
3. Five social icons render, in order: GitHub, Instagram, Discord, LinkedIn, TerpLink.
4. Hover each and confirm the status-bar URL matches the legacy page's — including the two `/` placeholders.
5. Three link columns with **3, 4, and 2** paragraphs respectively, under three `Lorem ipsum` headings.
6. Footer background, padding, and column spacing are identical at desktop width and at 768px.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/Footer.tsx src/components/FooterLinkColumn.tsx
git commit -m "feat: port footer to React components"
```

---

### Task 7: Deployment and tooling cutover

Points Vercel, CI, and the docs at the new build. No component changes.

**Files:**
- Modify: `vercel.json`, `.gitignore`, `.github/workflows/ci.yml`, `README.md`
- Modify or delete: `.vscode/settings.json`

**Interfaces:**
- Consumes: the `build` script from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Point Vercel at `dist/`**

`vercel.json` becomes:

```json
{
  "outputDirectory": "dist"
}
```

- [ ] **Step 2: Ignore the build output**

Append to `.gitignore`:

```text
dist/
```

Verify nothing from `dist/` is already staged:

```bash
git status --porcelain | grep '^A.*dist/' && echo "PROBLEM: dist is staged" || echo "clean"
```

Expected: `clean`.

- [ ] **Step 3: Add the build step to CI**

In `.github/workflows/ci.yml`, after the `Run ESLint` step, append:

```yaml
      # vite build runs tsc first, so this type-checks the project as a side effect.
      - name: Build
        run: npm run build
```

Leave `node-version: 20` alone — it resolves to 20.19+, which satisfies Vite 7's floor. Leave the `lint` script alone too; the fact that `npm run lint` mutates files during CI is pre-existing behavior and out of scope.

- [ ] **Step 4: Retire the Live Server override**

`npm run dev` supersedes it. Check whether the file is tracked — `.vscode/` is listed in `.gitignore`, so it may not be:

```bash
git ls-files .vscode/settings.json
```

If it prints the path, remove the `liveServer.settings.root` key. That is the file's only key, so delete the file:

```bash
git rm .vscode/settings.json
```

If it prints nothing, the file is untracked; delete it locally and move on.

- [ ] **Step 5: Rewrite the README**

Four changes, per D4 and the spec's tooling table.

Replace the **Development** section (`README.md:5-20`) with:

````markdown
## Development

This is a Vite + React + TypeScript app.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

Other scripts:

- `npm run build` — type-checks with `tsc` and builds to `dist/`
- `npm run preview` — serves the production build locally
- `npm run lint` — formats with Prettier, then runs ESLint with `--fix`
- `npm run format:check` — checks formatting without writing

Vercel output directory is set to `dist` in `vercel.json`.
````

Replace the **Where Assets Should Go** section (`README.md:22-34`) with:

````markdown
## Where Assets Should Go

Static assets live in `public/` and are served from the site root. Reference
them with root-absolute paths.

- Icons: `public/assets/icons/`
- Images: `public/assets/images/`
- Fonts: `public/assets/fonts/`

Example usage in JSX:

```tsx
<img src="/assets/images/fall-social-banner.jpg" alt="Fall Social Event Banner" />
```
````

**Delete the entire "Shared Layout System" section** (`README.md:36-61`). The `<site-header>` / `<site-footer>` web components it documents are removed in Task 8.

Replace the **Project File Structure** tree (`README.md:63-86`) with:

````markdown
## Project File Structure

```text
umdcoffee/
├── index.html                      # Vite entry shell
├── public/                         # Static assets, served from /
│   ├── assets/icons/               # Logo and social icons
│   ├── card-image-placeholder.png
│   └── partner.svg
├── src/
│   ├── main.tsx                    # createRoot entry; imports style.css
│   ├── App.tsx                     # Composes the page sections
│   ├── style.css                   # Global styles, variables, typography, layout
│   ├── vite-env.d.ts
│   └── components/                 # One file per component
├── vite.config.ts                  # Vite + React plugin config
├── tsconfig.json                   # TypeScript config for src/
├── tsconfig.node.json              # TypeScript config for vite.config.ts
├── package.json                    # Project metadata and npm scripts/dependencies
├── package-lock.json               # Exact dependency lockfile
├── eslint.config.mjs               # ESLint configuration
├── vercel.json                     # Vercel deployment configuration
├── LICENSE                         # License terms for this repository
└── README.md                       # Project overview, setup notes, and structure reference
```
````

- [ ] **Step 6: Verify the build still works and the tree matches the docs**

```bash
npm run build
ls dist dist/assets
```

Expected: `dist/` contains `index.html`, `assets/`, `card-image-placeholder.png`, `partner.svg`, and `assets/icons/`. The generated `dist/index.html` should reference hashed JS and CSS bundles.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "build: cut deployment and CI over to the Vite build"
```

---

### Task 8: Full parity verification and legacy removal

The final gate. Runs the spec's complete verification checklist against both versions, then deletes the staging directory and the dead web-component system.

**Files:**
- Delete: `legacy/` (the entire directory — original `index.html`, `style.css`, `layout.html`, `layout.js`, `demo/`, and the duplicated assets)

**Interfaces:**
- Consumes: everything from Tasks 1–7.
- Produces: nothing.

- [ ] **Step 1: Start both servers**

```bash
# terminal 1 — the original
cd legacy && python3 -m http.server 5500
# terminal 2 — the migrated app
npm run dev
```

- [ ] **Step 2: Walk the full checklist at desktop width (>=1280px)**

Tick each only after a direct side-by-side look:

1. **Navbar** — logo image, link styling, `current-page` highlight on `Home`, `Join` pill.
2. **Hero** — type scale, both `.highlight` spans, the spacing around `<strong>Coffee @ UMD</strong>`, the `Get Involved` CTA. The image is broken in **both** (K1); confirm it is *equally* broken, not differently broken.
3. **Events** — three cards, identical spacing, identical card borders and image overlays.
4. **FAQ** — five tabs with correct emoji; all four cards open and close independently; the plus rotates.
5. **Partner scroller** — same speed, seamless wrap, pauses when out of view.
6. **Footer** — three link columns at 3/4/2 paragraphs, five social icons, correct external URLs.

- [ ] **Step 3: Walk the full checklist at 768px and below**

7. Hamburger bars appear; nav links collapse.
8. Tapping the bars opens the menu; the divider appears; the bars recolor.
9. Tapping again closes it.
10. Events cards, FAQ cards, and the footer columns stack/wrap identically in both versions.
11. Narrow to 352px (the `min-width` on `body` at `src/style.css:29-37`) and confirm neither version scrolls horizontally in a way the other does not.

- [ ] **Step 4: Re-verify the scroller in a production build**

```bash
npm run build && npm run preview
```

Repeat check 5 against the preview URL. Dev and preview must both match the legacy reference — this is the StrictMode double-loop guard from B3.

- [ ] **Step 5: Confirm no asset 404s**

With the app open, check DevTools → Network, filtered to failed requests. Expected: exactly one failure, `coffee-cup.png` (K1). Anything else means an asset path was missed in the `public/` move.

- [ ] **Step 6: Confirm the build and formatter status**

```bash
npm run build
npm run format:check > /tmp/format-final.txt 2>&1; echo "exit=$?" >> /tmp/format-final.txt
diff /tmp/format-baseline.txt /tmp/format-final.txt
```

Expected: `npm run build` succeeds with no TypeScript errors.

For `format:check`: the new `.tsx`, `.ts`, `.json`, and `.md` files should all pass. `src/style.css` may fail exactly as `public/style.css` did in the Task 1 baseline — that is the pre-existing failure carried across by the verbatim move (D2). **Report it; do not reformat.** If `format:check` newly fails on a file *other* than `style.css`, fix that file with `npx prettier --write <that file>` and re-run.

- [ ] **Step 7: Delete the legacy staging directory**

Only after every check above has passed. This removes the original `index.html` and `style.css` (now living in `src/`), plus `layout.html`, `layout.js`, and `demo/` — all dead per D4. The partner-scroller logic that lived at the bottom of `layout.js` now lives in `PartnerScroller.tsx`.

```bash
git rm -r legacy
```

Verify nothing still references it:

```bash
grep -rn "legacy/\|layout\.js\|layout\.html\|site-header\|site-footer" \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=docs --exclude-dir=dist . \
  || echo "no references"
```

Expected: `no references`. (`docs/` is excluded because the spec and this plan both discuss `layout.js` by name.)

- [ ] **Step 8: Final build from a clean tree**

```bash
rm -rf dist node_modules
npm ci
npm run build
npm run preview
```

Open the preview URL and spot-check all six sections one last time. This proves the app builds from the lockfile alone, with no leftover files from the migration.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: remove the legacy static site and dead layout components

Deletes the original public/index.html and style.css (now src/style.css),
along with layout.html, layout.js, and demo/ — all dead once the React app
renders the page. Parity verified side by side before removal."
```

- [ ] **Step 10: Confirm the Vercel preview deploy**

Push the branch and open the Vercel preview URL from the PR. Expected: the preview serves the built app from `dist/`, not the old static site. If it still serves the old markup, `vercel.json` did not take effect — check that Task 7 Step 1 landed and that the project has no dashboard-level output-directory override shadowing the file.

---

## Follow-Up Issues

The six preserved defects should be filed as separate issues once this merges. They are deliberately untouched here so the migration diff stays purely structural.

| ID | Issue |
|---|---|
| K1 | Hero references `coffee-cup.png`, which does not exist in `public/`. |
| K2 | `.faq-tab.active` is styled but never applied; the five tabs are decoration. |
| K3 | All four nav links, the `Join` CTA, and the hero `Get Involved` button have empty/placeholder hrefs. |
| K4 | Page `<title>` is "My Club", not "Coffee @ UMD". |
| K5 | Discord and LinkedIn footer icons link to `/`. |
| K6 | `#hamburger:checked ~ .navbar` can never match — `.navbar` is the checkbox's parent, not its sibling. |

Two additional items surfaced while writing this plan:

- **Formatter drift.** `style.css` is not Prettier-formatted, so `npm run format:check` fails on it both before and after the migration. Running `npm run lint` will reformat it *and* reorder its declarations via `prettier-plugin-css-order`. Worth a deliberate one-time formatting commit, reviewed on its own.
- **`npm run lint` mutates files in CI.** It runs `prettier --write .` before ESLint, so a CI run rewrites the checked-out tree. It should probably be `format:check` in CI and `format` locally.
