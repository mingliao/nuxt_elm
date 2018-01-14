import { getStyle } from '~/plugins/mUtils'
export const loadMore = {
  directives: {
    'load-more': {
      bind: (el, binding) => {
        let windowHeight = window.screen.height
        let height
        let setTop
        let paddingBottom
        let marginBottom
        let requestFram
        let oldScrollTop
        let scrollEl
        let heightEl
        let scrollType = el.attributes.type && el.attributes.type.value // 取得元素自定义属性
        let scrollReduce = 2
        if (scrollType === 2) {
          scrollEl = el
          heightEl = el.children[0]
        } else {
          scrollEl = document.body
          heightEl = el
        }

        el.addEventListener('touchstart', () => {
          height = heightEl.clientHeight
          setTop = el.offsetTop
          paddingBottom = getStyle(el, 'paddingBottom')
          marginBottom = getStyle(el, 'marginBottom')
        }, false)

        el.addEventListener('touchmove', () => {
          loadMore()
        }, false)

        el.addEventListener('touchend', () => {
          oldScrollTop = scrollEl.scrollTop
          moveEnd()
        }, false)

        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => {
            if (scrollEl.scrollTop !== oldScrollTop) {
              oldScrollTop = scrollEl.scrollTop
              moveEnd()
            } else {
              cancelAnimationFrame(requestFram)
              height = heightEl.clientHeight
              loadMore()
            }
          })
        }

        const loadMore = () => {
          if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
            binding.value()// 这里就是v-load-more="xx"，这里的xx就是对外暴露的接口了，可以调用外部的命令
          }
        }
      }
    }
  }
}

export const getImgPath = {
  methods: {
    // 传递过来的图片地址需要处理后才能正常使用
    getImgPath (path) {
      let suffix
      if (!path) {
        return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
      }
      if (path.indexOf('jpeg') !== -1) {
        suffix = '.jpeg'
      } else {
        suffix = '.png'
      }
      let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix
      return 'https://fuss10.elemecdn.com' + url
    }
  }

}
