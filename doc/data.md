# asyncData
## 多次请求数据
  1. 参考这里[How to send multiple requests in asyncData](https://github.com/nuxt/nuxt.js/issues/978)
写法参考下面的示例

## SSR引发的问题
### ReferenceError: window is not defined
使用**asyncData**会使用**SSR** 服务端代码,而服务端nodejs是没有window对象的。这里就会报错，
所以这个项目
1. 要么使用axios等服务端和客户端都可以使用的框架，不要用fetch.[具体代码](https://github.com/mingliao/nuxt_elm/commit/abb78d3bbaa5e28e5d0f0dd5628161241c5fa272),配置如下:
 * 安装axios,
 * 使用**env**配置，看[这里](https://nuxtjs.org/api/configuration-env)，要在```nuxt.```config.js引入插件。
   * 最后在page中要使用自己的插件:> import axios from '~plugins/axios'
   * 页面上使用
   ```
       async asyncData () {
         let { data } = await axios.get(`/v1/cities`, {
           params: {
             type: 'guess'
           }
         })
         return { guessCity: data.name }
       },
   ```
   多重请求，使用:
   ```
       async asyncData () {
         let [{data}, hotcityRes] = await Promise.all([
           axios.get(`/v1/cities`, {params: {type: 'guess'}}),
           axios.get(`/v1/cities`, {params: {type: 'hot'}})
         ])
         return {guessCity: data.name, guessCityid: data.id, hotcity: hotcityRes.data}
       },
   ```
   > 注意es6的同构解析.
2. 只在客户端使用fetch，如何配置这个代理，参考[configuration](./configuration.md)不要使用asyncData请求数据，使用mounted来处理。
 * 使用方式同vue2-elm里面的源代码，如```home/home.vue```
   ```
       mounted () {
        cityGuess().then(res => {
           this.guessCity = res.name
           this.guessCityid = res.id
         })
       },
       },
   ```
