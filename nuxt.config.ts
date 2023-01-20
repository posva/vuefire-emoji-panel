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

  modules: ['nuxt-vuefire'],
  css: ['~/assets/styles.css'],

  vuefire: {
    auth: true,
    config: {
      apiKey: 'AIzaSyBwmo761a-X3AV-2foLGWCpg2vTbrB7NjE',
      authDomain: 'emoji-panel-test-1.firebaseapp.com',
      projectId: 'emoji-panel-test-1',
      storageBucket: 'emoji-panel-test-1.appspot.com',
      messagingSenderId: '743661406627',
      appId: '1:743661406627:web:cd491cf645094383b33216',
    },
  },
})
