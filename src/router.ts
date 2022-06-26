import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import store from './store'
import axios from 'axios'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredlogin: true }
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 此前的验证
  // if (to.meta.requiredlogin && !store.state.user.isLogin) {
  //   next({ name: 'login' })
  // }
  // else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
  //   next('/')
  // }
  // else {
  //   next()
  // }
  
  // 改进的验证
  const { user, token } = store.state
  const { redirectAlreadyLogin, requiredlogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.log(e)
        store.commit('logout')
        next('login')
        
      })
    } else {
      if (requiredlogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router