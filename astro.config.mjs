// @ts-check
import { defineConfig } from 'astro/config'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } =
  loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

// https://astro.build/config
export default defineConfig({
  site: 'https://rk-nettoyage.fr', // TODO : remplacer par le vrai domaine
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: '2026-03-01',
      useCdn: false,
      studioBasePath: '/admin',
    }),
    react(),
  ],
  vite: { plugins: [tailwindcss()] },
})
