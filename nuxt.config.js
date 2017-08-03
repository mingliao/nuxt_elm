module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'elm',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui' },
      { name: 'screen-orientation', content: 'portrait' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'full-screen', content: 'yes' },
      { name: 'x5-fullscreen', content: 'true' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  env: {
    baseUrl: '',
    routerMode: 'history',
    imgBaseUrl: 'http://images.cangdu.org/',
    proxyUrl: 'http://cangdu.org:8001'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['~/plugins/rem/rem', '~/plugins/fetch/fetch', '~/plugins/axios/axios']
    // proxy: {
    //   '/api': { target: 'http://cangdu.org:8001', ws: false }
    // }
  }
}
