# 路由篇
1. *redirect* 的解决思路
  * nuxt 无法实现路由的redirect，这里可以参考[extendRoutes doesn't work?](https://github.com/nuxt/nuxt.js/issues/1132)
  * 主要是在被跳转页面，比如从A---》B ，那么在A页面配置如下:
  ```
   fetch ({ route, redirect }) {
      if (route.name === 'index') {
        redirect('/home')
      }
    }
  ```
