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
 2. ```fetch.js``` 里面做
     ```
     let baseUrl = process.env.baseUrl
       if (process.env.NODE_ENV === 'development') {
         baseUrl = process.env.proxyUrl
       }
     ```
通过以上配置，就可以使所有使用**fetch**的方法，访问的是代理的地址了.
> dev的NODE_ENV 就是*development*
如何请求数据看[data.md](./data.md)

## 重新安装module找不到
有时候重新安装代码，会发现程序报错*This dependency was not found: ~components/header/head in .*
这时候主要是路径找不到了。只要把路径补充完整就可以了。```import headTop from '~/components/header/head'```
