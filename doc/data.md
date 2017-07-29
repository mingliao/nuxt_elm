# asyncData
## 多次请求数据
  1. 参考这里[How to send multiple requests in asyncData](https://github.com/nuxt/nuxt.js/issues/978)
asyncData这里的写法是：
  ```
  async asyncData () {
        let guessCityRes = await cityGuess()
        return {
          guessCity: guessCityRes.name //这个数据异步塞入data中了。
        }
  }
  ```

## SSR引发的问题
### ReferenceError: window is not defined
使用**asyncData**会使用**SSR** 服务端代码,而服务端nodejs是没有window对象的。这里就会报错，
所以这个项目
1. 要么使用axios等服务端和客户端都可以使用的框架，不要用fetch.配置如下:
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
2. 只在客户端使用fetch，不要使用asyncData请求数据，使用mounted来处理。
 * 使用方式同vue2-elm里面的源代码，如```home/home.vue```
