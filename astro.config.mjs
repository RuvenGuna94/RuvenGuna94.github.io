import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Set SITE_URL only after the GitHub account/domain is confirmed.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [mdx()],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
