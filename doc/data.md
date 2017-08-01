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
   或者使用多次请求分阶段请求
   ```
   async asyncData () {
         let guessCityRes = axios.get(`/v1/cities`, {params: {type: 'guess'}})
         let hotCityRes = axios.get(`/v1/cities`, {params: {type: 'hot'}})
         let groupCityRes = axios.get(`/v1/cities`, {params: {type: 'group'}})
         return {guessCity: guessCityRes.data ? guessCityRes.data.name : '',
           guessCityid: guessCityRes.data ? guessCityRes.data.id : '',
           hotcity: hotCityRes.data,
           groupcity: groupCityRes.data
         }
       }
   ```
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

### Unhandled promise rejection: Error: socket hang up

 有时候网页加载的时候，使用*asyncData()*多个请求一起发送```await Promise.all```，有请求没有回来(没有响应)，会出现**Unhandled promise rejection: Error: socket hang up**
 这时候导致所有的请求都无法响应，程序无法加载，这时候应该使用分段请求的方式，避免长时间无响应，程序出错。
 ```
 async asyncData () {
       let guessCityRes = axios.get(`/v1/cities`, {params: {type: 'guess'}})
       let hotCityRes = axios.get(`/v1/cities`, {params: {type: 'hot'}})
       let groupCityRes = axios.get(`/v1/cities`, {params: {type: 'group'}})
       return {guessCity: guessCityRes.data ? guessCityRes.data.name : '',
         guessCityid: guessCityRes.data ? guessCityRes.data.id : '',
         hotcity: hotCityRes.data,
         groupcity: groupCityRes.data
       }
     }
 ```
 不过这种情况，会碰到有的请求先返回，有的没有返回的情况，这时候，返回的数据可能就为*null*了.
 遇到这种情况，有几种解决思路:
 1. **这种情况需要验证一下**建议对**axios**进行封装，超时的请求，错误和正确的请求单独处理。
 2. 使用**mounted**客户端请求数据
 
 ## 请求参数
 *asyncData*请求的参数如果是从url，get方式过来的例如:*xxxx?name=aa&&age=12*
 那么这些参数都是放在*param.query*这种方式同路由*$router.query*一样。可以用下面的方式去获取
 ```
 async asyncData (params) {//这个可以简化成{query}，下面的就是query了。
       console.log('param.geohash', params.query)
 }
 ```
 如果这些参数是放在使用url，restful风格过来的如:*xxxx/_id*那么这些参数是放在params里面了。
 ```
  async asyncData ({params}) {
     let { data } = await axios.get(`/v1/cities/${params.id}`)
   },
 ```
