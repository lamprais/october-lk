import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const useCloudflareAdapter = Boolean(
  process.env.CF_PAGES || process.env.CLOUDFLARE || process.env.USE_CLOUDFLARE_ADAPTER
);

// https://astro.build/config
export default defineConfig({
  site: 'https://october.lk',
  output: 'static',
  adapter: useCloudflareAdapter ? cloudflare() : undefined,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
