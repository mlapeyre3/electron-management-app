import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);

import App from './App.vue'
import Welcome from './components/Welcome.vue'
import Over50 from './components/Over50.vue'
import DailyStandUp from './components/DailyStandUp.vue'
import Login from './components/Login.vue'
import Auth from './services/auth.js'

function requireAuth (to, from, next) {
  if (!Auth.isLogged()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'welcome', components: {default: Welcome}, beforeEnter: requireAuth},
    { path: '/over50', name: 'over50', components: {default: Over50}, beforeEnter: requireAuth},
    { path: '/dailyStandUp', name: 'dailyStandUp', component: DailyStandUp, beforeEnter: requireAuth},
    { path: '/login', name: 'login', component: Login},
    { path: '*', redirect: '/'}
  ]
});


new Vue({
  el: '#app',
  router,
  render: h => h(App)
});