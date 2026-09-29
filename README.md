# umdcoffee

We're one of the largest social clubs on campus, and we want a frontend website to showcase who we are, what we do, and our biggest events and collaborations to get people interested in joining our community or working with us.

## Development

This is an [Astro](https://docs.astro.build/) site written in TypeScript. Pages
render to static HTML at build time; React is only used for interactive
components ("islands"). It requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Then open the URL Astro prints (default `http://localhost:4321`).

Other scripts:

- `npm run build` — type-checks with `astro check` and builds to `dist/`
- `npm run preview` — serves the production build locally
- `npm run lint` — formats with Prettier, then runs ESLint with `--fix`
- `npm run format:check` — checks formatting without writing

Vercel's framework, build command, and output directory (`dist`) are set in
`vercel.json`.

## Components

- Pages live in `src/pages/`; each file becomes a route (`index.astro` is `/`).
- Shared page chrome (head, navbar, footer) lives in `src/layouts/BaseLayout.astro`.
- Write components as `.astro` files by default. They render to plain HTML and
  ship no JavaScript.
- Only use a React component (`.tsx`) when it needs browser interactivity
  (state, effects, event handlers), and render it with a `client:*` directive,
  e.g. `<PartnerScroller client:visible />`. Without a directive it renders as
  static HTML and will not be interactive.

## Where Assets Should Go

Static assets live in `public/` and are served from the site root. Reference
them with root-absolute paths.

- Icons: `public/assets/icons/`
- Images: `public/assets/images/`
- Fonts: `public/assets/fonts/`

Example usage in a component:

```astro
<img src="/assets/images/fall-social-banner.jpg" alt="Fall Social Event Banner" />
```

## Project File Structure

```text
umdcoffee/
├── public/                         # Static assets, served from /
│   ├── assets/icons/               # Logo and social icons
│   ├── card-image-placeholder.png
│   └── partner.svg
├── src/
│   ├── pages/                      # File-based routes (index.astro → /)
│   ├── layouts/                    # Page shells (BaseLayout.astro: head, navbar, footer)
│   ├── components/                 # One file per component (.astro, or .tsx for islands)
│   └── styles/global.css           # Global styles, variables, typography, layout
├── astro.config.mjs                # Astro config (React integration)
├── tsconfig.json                   # TypeScript config (extends Astro's strict preset)
├── package.json                    # Project metadata and npm scripts/dependencies
├── package-lock.json               # Exact dependency lockfile
├── eslint.config.mjs               # ESLint configuration
├── .prettierrc.json                # Prettier configuration
├── vercel.json                     # Vercel deployment configuration
├── LICENSE                         # License terms for this repository
├── README.md                       # Project overview, setup notes, and structure reference
└── docs/                           # Local notes and plans (gitignored)
```
