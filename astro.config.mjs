import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// SITE / BASE_PATH are injected by the GitHub Actions workflow so the same
// build works locally (/) and on GitHub Pages (/<repo>).
export default defineConfig({
  site: process.env.SITE ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  integrations: [mdx()],
});
