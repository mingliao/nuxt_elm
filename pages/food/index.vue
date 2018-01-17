<template>
    <div class="food_container">
      <head-top :head-title="headTitle" goBack="true"></head-top>
      <section class="sort_container">
        <div class="sort_item" :class="{choose_type:sortBy == 'food'}">
          <div class="sort_item_container" @click="chooseType('food')">
            <div class="sort_item_border">
              <span :class="{category_title: sortBy == 'food'}">{{foodTitle}}</span>
              <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                <polygon points="0,3 10,3 5,8"/>
              </svg>
            </div>
          </div>

        </div>
        <div class="sort_item">
          <div class="sort_item_container" >
            <div class="sort_item_border">
              <span :class="{category_title: sortBy == 'sort'}">排序</span>
              <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                <polygon points="0,3 10,3 5,8"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="sort_item">
          <div class="sort_item_container" >
            <div class="sort_item_border">
              <span :class="{category_title: sortBy == 'activity'}">筛选</span>
              <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                <polygon points="0,3 10,3 5,8"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
      <section class="shop_list_container">
        <shop-list v-if="latitude" :geohash="geohash"></shop-list>
      </section>
    </div>
</template>
<script>
import headTop from '~/components/header/head'
import shopList from '~/components/common/shoplist'
import {mapState, mapMutations} from 'vuex'
import {msiteAdress} from '~/service/getData'

export default {
  name: 'food',
  data () {
    return {
      geohash: '', // city页面传递过来的地址geohash
      headTitle: '', // msiet页面头部标题
      foodTitle: '', // 排序左侧头部标题
      sortBy: '', // 筛选的条件
      category: null // category分类左侧数据

    }
  },
  components: {
    headTop,
    shopList
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS'
    ]),
    chooseType (type) {
      if (this.sortBy !== type) {
        this.sortBy = type
        // food选项中头部标题发生改变，需要特殊处理
        if (type === 'food') {
          this.foodTitle = '分类'
        } else {
          // 将foodTitle 和 headTitle 进行同步
          this.foodTitle = this.headTitle
        }
      } else {
        // 再次点击相同选项时收回列表
        this.sortBy = ''
        if (type === 'food') {
          // 将foodTitle 和 headTitle 进行同步
          this.foodTitle = this.headTitle
        }
      }
    },
    async initData () {
      this.headTitle = this.$route.query.title
      this.foodTitle = this.headTitle
      this.geohash = this.$route.query.geohash
      if (!this.latitude) {
        // 获取位置信息
        let res = await msiteAdress(this.geohash)
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(res)
      }
    }
  }

}
</script>
<style lang="scss" scoped>
  @import "~assets/style/mixin";
  .food_container {
    height: 100%;
    position: relative;
    background-color: #fff;
  }
  .sort_container {
    z-index: 13;
    /*padding-top: 1.95rem;*/
    display: flex;
    position: fixed;
    top: 1.95rem;
    width: 100%;
    background-color: #fff;
    border-bottom: .025rem solid #f1f1f1 ;
  }
  .choose_type {}
  .sort_item {
    flex: 1;
    @include sc(0.55rem, #333);
    @include wh(0.33%,1.6rem);
    text-align: center;
    .sort_item_container {
      padding-top: 0.3rem;
    }
    .sort_item_border {
      height: 1rem;
      line-height: 1.1rem;
      /*padding-top: .3rem;*/
      border-right: .025rem solid #e4e4e4;
    }
    .sort_icon {
      transition: all .3s;
    }
    .category_title {

    }

  }
  .shop_list_container {
    position: absolute;
    top:3.6rem;
    width: 100%;
    left:0;
  }
  .choose_type{
    .sort_item_container{

      .category_title{
        color: $blue;
      }
      .sort_icon{

        transform: rotate(180deg);
        fill:$blue;
      }
    }
  }
</style>
