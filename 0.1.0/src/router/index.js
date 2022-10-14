import { createRouter, createWebHistory } from 'vue-router'
import { 
  save,
  refresh,
  getAccessToken,
  getRefreshToken,
  existCookie,
  isAuth,
  logout
} from '@/modules/auth'
import { authByToken } from '@/modules/kakao'

import MainPage from '../views/MainPage.vue'
import ArtworkPage from '../views/ArtworkPage.vue'
import MyPage from '../views/MyPage.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage
  },
  {
    path: '/artwork',
    name: 'artwork',
    component: ArtworkPage
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MyPage
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginPage.vue')
  },
  {
    path: '/auth',
    name: 'AuthPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/AuthPage.vue')
  },
  {
    path: '/map',
    name: 'MapPage',
    component: () => import('../views/MapPage.vue')
  }
]

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition) {
      return savedPosition
    }
    else {
      // always scroll to top
      return { top: 0 }
    }
  },
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const guard_path = [
  '/mypage'
]

// Global navigation guard
router.beforeEach(async function (to, from, next) {

  // Authorization result
  let result = false

  // No authorization information
  if (!isAuth()) {

    // Auto login with Kakao
    if (existCookie('kakao')) {
      const access_token = getAccessToken('kakao')
      const refresh_token = getRefreshToken('kakao')
      const auth_result = await authByToken(access_token, refresh_token)

      // Authentication success
      if (auth_result) {
        result = await save(
          auth_result.user_id, 
          'kakao', 
          auth_result.access_token, 
          auth_result.profile_image, 
          auth_result.thumbnail_image)
        await refresh(
          'kakao', 
          auth_result.access_token, 
          auth_result.refresh_token, 
          auth_result.expire_time)
      }
      else {
        logout('kakao')
      }
    } 
  }

  // Authorized before
  else {
    result = true
  }

  // Guard before access to mainPage
  if (guard_path.includes(to.path) && !result) {
    next('/login')
  } 
  else {
    next()
  }

})

export default router
