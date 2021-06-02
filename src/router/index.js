import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

const routes = [
  {
    path: '/',
    redirect: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * 挂载路由导航守卫
 * @param to 将要访问的路径
 * @param from 代表从哪个路径跳转而来
 * @param next 是一个函数，代表放行
 */

//
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
