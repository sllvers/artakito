import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';

export default defineConfig({
  site: 'https://artakito.com',
  trailingSlash: 'always',
  integrations: [sanity({
    projectId: 'mwymllh6',
    dataset: 'production',
    apiVersion: '2025-02-19',
    useCdn: false,
    perspective: 'published',
  })],
});
