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
          <transition name="showlist" v-show="category">
            <section v-show="sortBy == 'food'" class="category_container sort_detail_type">
              <section class="category_left">
                <ul>
                  <li v-for="(item, index) in category" :key="index" class="category_left_li" :class="{category_active:restaurant_category_id == item.id}" @click="selectCategoryName(item.id, index)">
                    <section>
                      <img :src="getImgPath(item.image_url)" v-if="index" class="category_icon">
                      <span>{{item.name}}</span>
                    </section>
                    <section>
                      <span class="category_count">{{item.count}}</span>
                      <svg v-if="index" width="8" height="8" xmlns="http://www.w3.org/2000/svg" version="1.1" class="category_arrow" >
                        <path d="M0 0 L6 4 L0 8"  stroke="#bbb" stroke-width="1" fill="none"/>
                      </svg>
                    </section>
                  </li>
                </ul>
              </section>
              <section class="category_right">
                <ul>
                  <li v-for="(item, index) in categoryDetail" v-if="index" :key="item.id" class="category_right_li" @click="getCategoryIds(item.id, item.name)" :class="{category_right_choosed: restaurant_category_ids == item.id || (!restaurant_category_ids)&&index == 0}">
                    <span>{{item.name}}</span>
                    <span>{{item.count}}</span>
                  </li>
                </ul>
              </section>
            </section>
          </transition>

          <!--<transition name="showlist" v-show="category">

          </transition>-->
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
      <transition name="showcover">
        <div class="back_cover" v-show="sortBy"></div>
      </transition>
      <section class="shop_list_container">
        <shop-list v-if="latitude" :geohash="geohash"></shop-list>
      </section>
    </div>
</template>
<script>
import headTop from '~/components/header/head'
import shopList from '~/components/common/shoplist'
import {mapState, mapMutations} from 'vuex'
import {getImgPath} from '~/components/common/mixin'
import {msiteAdress, foodCategory} from '~/service/getData'

export default {
  name: 'food',
  mixins: [getImgPath],
  data () {
    return {
      geohash: '', // city页面传递过来的地址geohash
      headTitle: '', // msiet页面头部标题
      foodTitle: '', // 排序左侧头部标题
      sortBy: '', // 筛选的条件
      category: null, // category分类左侧数据
      categoryDetail: null,
      restaurant_category_ids: '', // 筛选类型的id
      restaurant_category_id: '' // 食品类型id值

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
    // 选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
    selectCategoryName (id, index) {
      // 第一个选项 -- 全部商家 因为没有自己的列表，所以点击则默认获取选所有数据
      if (index === 0) {
        this.restaurant_category_ids = null
        this.sortBy = ''
        // 不是第一个选项时，右侧展示其子级sub_categories的列表
      } else {
        this.restaurant_category_id = id
        this.categoryDetail = this.category[index].sub_categories
      }
    },
    // 选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
    getCategoryIds (id, name) {
      this.restaurant_category_ids = id
      this.sortBy = ''
      this.foodTitle = this.headTitle = name
    },
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
      this.restaurant_category_id = this.$route.query.restaurant_category_id

      if (!this.latitude) {
        // 获取位置信息
        let res = await msiteAdress(this.geohash)
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(res)
      }
      // 获取category分类左侧数据
      this.category = await foodCategory(this.latitude, this.longitude)
      // 初始化时定位当前category分类左侧默认选择项，在右侧展示出其sub_categories列表
      this.category.forEach(item => {
        if (this.restaurant_category_id === `${item.id}`) {
          this.categoryDetail = item.sub_categories
        }
      })
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
  .sort_detail_type{
    display: flex;
    width: 100%;
    position: absolute;
    display:flex;
    top: 1.6rem;
    left: 0;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
  }
  .category_container{
    .category_left{
      flex: 1;
      height: 16rem;
      overflow-y: auto;
      background-color: #f1f1f1;
      span {
        @include sc(0.5rem,#666);
        line-height: 1.8rem;
      }
      .category_left_li {
        @include fj;
        padding: 0 0.5rem;
        .category_icon {
          @include wh(.8rem,.8rem);
          vertical-align: middle;
          margin-right: .2rem;
        }
        .category_count{
          background-color: #ccc;
          @include sc(.4rem, #fff);
          padding: 0 .1rem;
          border: 0.025rem solid #ccc;
          border-radius: 0.8rem;
          vertical-align: middle;
          margin-right: 0.25rem;
        }
        .category_arrow{
          vertical-align: middle;
        }
        &.category_active{
          background-color: #fff;
        }
      }
    }
    .category_right{
      flex: 1;
      background-color: #fff;
      padding-left: 0.5rem;
      height: 16rem;
      overflow-y: auto;
      .category_right_li{
        @include fj;
        height: 1.8rem;
        line-height: 1.8rem;
        padding-right: 0.5rem;
        border-bottom: 0.025rem solid $bc;
        span{
          color: #666;
        }
      }
      .category_right_choosed{
        span{
          color: $blue;
        }
      }
    }
  }

  .back_cover {
    position: fixed;
    left: 0;
    top: 1.3rem;
    width: 100%;
    height: 100%;
    background-color: rgba(90,90,90,0.5);
    z-index: 11;
  }

  .showlist-enter-active, .showlist-leave-active {
    //中间状态。
    transition: all .5s;
    transform: translateY(0);
  }
  .showlist-enter, .showlist-leave-to {
    opacity: 0;
    transform: translateY(-100%);//最开始和最后的状态
  }
  .showcover-enter, .showcover-leave-to {
    opacity: 0;
  }
  .showcover-enter-active, .showcover-leave-active {
    transition: all .5s;
  }

</style>
