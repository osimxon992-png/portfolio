import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/data.ts';

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Fills __TOKEN__ placeholders in index.html from src/data.ts, so SEO tags stay static for crawlers.
const meta: Record<string, string> = {
  TITLE: `${site.name} — ${site.role}`,
  DESCRIPTION: site.tagline,
  URL: site.url,
  NAME: site.name,
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'site-meta',
      transformIndexHtml: (html) => html.replace(/__([A-Z]+)__/g, (m, k: string) => (k in meta ? escape(meta[k]) : m)),
    },
  ],
});
