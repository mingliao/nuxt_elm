# 配置
## 代理配置
因为nuxt 配置代理的模块没有办法处理一些特殊的跨域请求见

1. [How to set up proxy with nuxt.config.js](https://github.com/nuxt/nuxt.js/issues/762)
2. [nuxt-community/modules](https://github.com/nuxt-community/modules/tree/master/modules/proxy)
  * >Notice: As a limitation currently this module only works with nuxt internal server. For express,... you may have to manually register nuxt.serverMiddleware. (Will be fixed soon)
  
 所以根据本项目的情况，项目使用**fetch**请求api接口，所以，统一在**fetch**里面做数据请求处理，这里还要做**cross-env**来对**NODE_ENV** 做配置。
 1. 在```nuxt.config.js```配置代理地址
    ```
    env: {
        proxyUrl: 'http://cangdu.org:8001'
      },
    ```
 2. ```nuxt.config.js```做配置项目```dev: (process.env.NODE_ENV !== 'production'),```
 3. ```fetch.js``` 里面做
     ```
     let baseUrl = process.env.baseUrl
       if (process.env.NODE_ENV !== 'production') {
         baseUrl = process.env.proxyUrl
       }
     ```
通过以上配置，就可以使所有使用**fetch**的方法，访问的是代理的地址了。
