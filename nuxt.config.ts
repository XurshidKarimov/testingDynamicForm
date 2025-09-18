import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  app: {
    baseURL: '/',
  },

  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        'customs-remaining-organised-luther.trycloudflare.com',
        'localhost',
      ],
    },
  },

  modules: ['shadcn-nuxt'],
});
