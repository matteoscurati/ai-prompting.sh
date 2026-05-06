import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aiprompting.sh',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
