// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // React is only used for interactive "islands" (e.g. the FAQ cards and
  // partner scroller). Everything else renders to static HTML at build time.
  integrations: [react()],
});
