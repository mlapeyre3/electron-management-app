import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

import App from './App.vue'
import Welcome from './components/Welcome.vue'
import Over50 from './components/Over50.vue'
import PageB from './components/PageB.vue'

export const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'welcome', components: {default: Welcome}},
    { path: '/over50', name: 'over50', components: {default: Over50}},
    { path: '/pageB', name: 'pageB', component: PageB},
    { path: '*', redirect: '/'}
  ]
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})