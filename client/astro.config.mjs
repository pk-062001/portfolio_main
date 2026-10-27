import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pk062001-portfolio.vercel.app',
  build: { inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [sitemap()],
  vite: {
    // VITE_* keeps the EmailJS variables already configured on Vercel working.
    envPrefix: ['PUBLIC_', 'VITE_'],
  },
});
