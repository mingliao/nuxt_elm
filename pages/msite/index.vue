<template>
    <div>
      <head-top signin-up='msite'>
        <router-link :to="'/search/' + geohash" class="link_search" slot="search">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
            <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
          </svg>
        </router-link>
        <router-link to="/home" slot="msite-title" class="msite_title">
          <span class="title_text ellipsis">{{msietTitle}}</span>
        </router-link>
      </head-top>
      <nav class="msite_nav">
        <div class="swiper-container" v-if="foodTypes.length">
          <div class="swiper-wrapper">
            <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
              <router-link :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}" v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
                <figure>
                  <img :src="imgBaseUrl + foodItem.image_url">
                  <figcaption>{{foodItem.title}}</figcaption>
                </figure>
              </router-link>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </nav>
    </div>
</template>


<script>
  import headTop from '~/components/header/head'
//  import axios from '~/plugins/axios/axios'
  import {cityGuess, msiteFoodTypes} from '~/service/getData'

  export default {
    asyncData ({env}) {
      return {
        imgBaseUrl: env.imgBaseUrl
      }
    },
    head: {
      script: [
        { src: '/swiper/swiper.min.js' }
      ],
      link: [
        { rel: 'stylesheet', href: '/swiper/swiper.min.css' }
      ]
    },
    data () {
      return {
        geoHash: '',
        foodTypes: [],
        msietTitle: '请选择地址...'
      }
    },
    methods: {
      getCategoryId (url) {
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''))
        if (/restaurant_category_id/gi.test(urlData)) {
          return JSON.parse(urlData).restaurant_category_id.id
        } else {
          return ''
        }
      }
    },
    mounted () {
      // 获取导航食品类型列表
      msiteFoodTypes(this.geohash).then(res => {
        let resLength = res.length
        let resArr = [...res] // 返回一个新的数组
        let foodArr = []
        for (let i = 0, j = 0; i < resLength; i += 8, j++) {
          foodArr[j] = resArr.splice(0, 8)
        }
        this.foodTypes = foodArr
      }).then(() => {
        // 初始化swiper
        window.Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          loop: true
        })
      })
    },
    async beforeMount () {
      console.log('this.$route.query.geohash', this.$route.query.geohash)
      if (!this.$route.query.geohash) {
        const address = await cityGuess()
        this.geohash = address.latitude + ',' + address.longitude
      } else {
        this.geohash = this.$route.query.geohash
      }
    },

    components: {
      headTop
    }
  }
</script>

<style lang="scss" scoped>
  @import '~assets/style/mixin';
  .link_search{
    left: .8rem;
    @include wh(.9rem, .9rem);
    @include ct;
  }
  .msite_title{
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    margin-left: -0.5rem;
    .title_text{
      @include sc(0.8rem, #fff);
      text-align: center;
      display: block;
    }
  }
  .msite_nav{
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    height: 10.6rem;
    .swiper-container{
      @include wh(100%, auto);
      padding-bottom: 0.6rem;
      .swiper-pagination{
        bottom: 0.2rem;
      }
    }
    .fl_back{
      @include wh(100%, 100%);
    }
  }
  .food_types_container{
    display:flex;
    flex-wrap: wrap;
    .link_to_food{
      width: 25%;
      padding: 0.3rem 0rem;
      @include fj(center);
      figure{
        img{
          margin-bottom: 0.3rem;
          @include wh(1.8rem, 1.8rem);
        }
        figcaption{
          text-align: center;
          @include sc(0.55rem, #666);
        }
      }
    }
  }
  .shop_list_container{
    margin-top: .4rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
    .shop_header{
      .shop_icon{
        fill: #999;
        margin-left: 0.6rem;
        vertical-align: middle;
        @include wh(0.6rem, 0.6rem);
      }
      .shop_header_title{
        color: #999;
        @include font(0.55rem, 1.6rem);
      }
    }
  }

</style>

