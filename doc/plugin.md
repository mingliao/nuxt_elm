# 插件使用
## 外部引用文件
1. 外部文件引入如（*rem*文件引入）:
  * 使用[Plugins/External Packages](https://nuxtjs.org/guide/plugins)配置
  * 使用插件引入（放入*plugins*）或者使用静态文件（放入*static*）文件夹中
2. 引入*minify js*文件
  * 参考[how to add a local minify js](https://github.com/nuxt/nuxt.js/issues/1250)
3. 引入*swiper*等插件之后，如何使用。
  * 将这些插件挂载到*window*下，使用:
    ```
     window.Swiper('.swiper-container', {
              pagination: '.swiper-pagination',
              loop: true
            })
    ```
  * 参考[这里](https://github.com/nuxt/nuxt.js/issues/1251)
## 结合*element-ui*使用
   *  配置[参考](https://nuxtjs.org/guide/plugins)
   *  具体配置查看```plugins```文件夹，以及```nuxt.config.js```
 * scss等预编译工具使用
   *  [撮这里](https://nuxtjs.org/faq/pre-processors/#how-to-use-pre-processors-) ```npm install --save-dev pug@2.0.0-beta6 pug-loader coffee-script coffee-loader node-sass sass-loader```

## 引入*node_modules*下面的css文件
有一些文件如*normalize.css/normalize.css*需要单独引入，而且要通过*ssr*方式引入，可以将它
放入*plugin*，并且在*nuxt.config.js*配置这样就可以全局导入了。
或者参考利用nuxt.config.js[configuration-css](https://nuxtjs.org/api/configuration-css)

## 导出模块
*plugin*导出的文件如*router-auth.js*文件，导成模块的时候，是会运行的。
