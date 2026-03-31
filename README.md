# umdcoffee

We're one of the largest social clubs on campus, and we want a frontend website to showcase who we are, what we do, and our biggest events and collaborations to get people interested in joining our community or working with us.

## Development

This is a static site served from the `public/` directory.

- Install Live Server: [ext:ritwickdey.LiveServer](vscode:extension/ritwickdey.LiveServer)
- VS Code Live Server root is configured as `/public` in `.vscode/settings.json`.
- Vercel output directory is set to `public` in `vercel.json`.

Quick local server (without extensions):

```bash
cd public
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## Where Assets Should Go

Place all static assets inside `public/assets/` so paths are predictable and easy to maintain.

- Images: `public/assets/images/` (photos, event banners, hero images)
- Icons: currently inline SVG in `public/layout.html` (use `public/assets/icons/` if you switch to file-based icons)
- Fonts: `public/assets/fonts/` (self-hosted webfonts)

Example usage in HTML:

```html
<img src="assets/images/fall-social-banner.jpg" alt="Fall Social Event Banner" />
```

## Shared Layout System

Header and footer are reusable web components loaded from shared templates.

- `public/layout.html`: template source for `site-header` and `site-footer`
- `public/layout.js`: loads templates, computes base paths, and renders components

Use the header with required links:

```html
<site-header
	links='[{"label":"Demo","href":"{{BASE}}demo/"},{"label":"Contact","href":"#contact"}]'
></site-header>
```

Notes:

- `links` must be valid JSON.
- `{{BASE}}` in each `href` is replaced at runtime so links work from nested pages.
- If `links` is missing or invalid, the component logs a warning and renders no nav links.

Footer usage:

```html
<site-footer id="contact"></site-footer>
```

## Project File Structure

```text
umdcoffee/
├── public/                         # Static site files served to the browser
│   ├── index.html                  # Home page
│   ├── demo/                       # TODELETE
│   │   └── index.html              # Demo page for h1, h2, h3, h4, h5, p, a
│   ├── style.css                   # Global styles, variables, typography, layout
│   ├── layout.html                 # Shared header/footer templates
│   ├── layout.js                   # Shared layout component runtime
│   └── assets/                     # Static media and design assets
│       ├── images/                 # Photos and banners
│       ├── icons/                  # Optional: file-based icons/logos (currently using inline SVG)
│       └── fonts/                  # Self-hosted fonts
├── .vscode/
│   └── settings.json               # Workspace settings (Live Server root, etc.)
├── package.json                    # Project metadata and npm scripts/dependencies
├── package-lock.json               # Exact dependency lockfile for reproducible installs
├── eslint.config.mjs               # ESLint configuration
├── vercel.json                     # Vercel deployment configuration
├── LICENSE                         # License terms for this repository
└── README.md                       # Project overview, setup notes, and structure reference
```
