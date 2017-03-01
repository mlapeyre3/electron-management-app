import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

import App from './App.vue'
import Welcome from './components/Welcome.vue'
import Over50 from './components/Over50.vue'
import PageB from './components/PageB.vue'
import Login from './components/Login.vue'
import Auth from './utils/auth.js'

function requireAuth (to, from, next) {
  if (!Auth.isLogged()) {
    console.log('Auth: user is not logged in')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    console.log('Auth: user is logged in')
    next()
  }
}

export const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'welcome', components: {default: Welcome}, beforeEnter: requireAuth},
    { path: '/over50', name: 'over50', components: {default: Over50}, beforeEnter: requireAuth},
    { path: '/pageB', name: 'pageB', component: PageB, beforeEnter: requireAuth},
    { path: '/login', name: 'login', component: Login},
    { path: '*', redirect: '/'}
  ]
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})