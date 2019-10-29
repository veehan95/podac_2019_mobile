import Vue from 'vue';
import VueRouter from 'vue-router'
import Router from 'vue-router'
import Home from '@/view/home/index'
import Rate from '@/view/rate/index'
import Login from '@/view/login/index'
import PostRate from '@/view/post_rate/index'
import Rewards from '@/view/rewards/index'
import RewardDetail from '@/view/reward_detail/index'
import Claimed from '@/view/claim/index'
import Search from '@/view/search/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/rate',
    name: 'Rate',
    component: Rate,
  }, {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { isPublic: true },
  }, {
    path: '/post_rate/:tags?',
    name: 'PostRate',
    component: PostRate,
  }, {
    path: '/rewards',
    name: 'Rewards',
    component: Rewards,
  }, {
    path: '/reward_detail/:id',
    name: 'RewardDetail',
    component: RewardDetail,
  }, {
    path: '/claim_history',
    name: 'Claimed',
    component: Claimed,
  }, {
    path: '/search',
    name: 'Search',
    component: Search,
  }
]

const router = new VueRouter({routes})

router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic){
    if (!router.app.$session.exists("loggined"))
      next("/login")
  }
  next()
})

export default router
