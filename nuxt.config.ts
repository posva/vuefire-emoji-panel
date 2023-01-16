// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: 'Emoji Panel - %s',
      link: [
        {
          href: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
          rel: 'stylesheet',
        },
      ],
    },
  },

  css: ['~/assets/styles.css'],
})
