# umdcoffee

We're one of the largest social clubs on campus, and we want a frontend website to showcase who we are, what we do, and our biggest events and collaborations to get people interested in joining our community or working with us.

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
├── README.md                       # Project overview, setup notes, and structure reference
└── docs/                           # Local notes and plans (gitignored)
```
