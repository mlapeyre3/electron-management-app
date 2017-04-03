import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);

import App from './App.vue'
import Welcome from './components/Welcome.vue'
import WarningIssues from './components/WarningIssues.vue'
import DailyStandUp from './components/DailyStandUp.vue'
import Release from './components/Release.vue'
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
    { path: '/warningIssues', name: 'warningIssues', components: {default: WarningIssues}, beforeEnter: requireAuth},
    { path: '/dailyStandUp', name: 'dailyStandUp', component: DailyStandUp, beforeEnter: requireAuth},
    { path: '/login', name: 'login', component: Login},
    { path: '/release', name: 'release', component: Release, beforeEnter: requireAuth},
    { path: '*', redirect: '/'}
  ]
});


new Vue({
  el: '#app',
  router,
  render: h => h(App)
});