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
        // {
        //   rel: 'stylesheet',
        //   href: 'https://unpkg.com/@picocss/pico@1.5.6/css/pico.min.css',
        // },
      ],
    },
  },

  css: ['~/assets/styles.css'],

  modules: ['nuxt-vuefire'],

  vuefire: {
    auth: true,
    config: {
      apiKey: 'AIzaSyDZZF0At8wUoO4CbysTQEsWvSiWHayfplA',
      authDomain: 'project-9078095303839077050.firebaseapp.com',
      databaseURL: 'https://project-9078095303839077050.firebaseio.com',
      projectId: 'project-9078095303839077050',
      storageBucket: 'project-9078095303839077050.appspot.com',
      messagingSenderId: '283064469729',
      appId: '1:283064469729:web:f1e771c0fa539901a20fa0',
      measurementId: 'G-LVHS5HP5K7',
    },
  },

  // TODO: maybe not needed for the demo
  typescript: {
    shim: false,
  },
})
