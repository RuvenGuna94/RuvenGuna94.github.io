import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Keep the confirmed public origin consistent for canonical links and RSS.
export default defineConfig({
  site: process.env.SITE_URL || 'https://ruvenguna.com',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [mdx()],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
