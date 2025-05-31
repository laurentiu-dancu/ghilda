import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://ghilda.ro',
  integrations: [mdx(), tailwind(), react()],
  output: 'server',
  adapter: netlify(),
});