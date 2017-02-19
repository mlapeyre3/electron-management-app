import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

import App from './App.vue'
import Welcome from './components/Welcome.vue'
import PageA from './components/PageA.vue'
import PageB from './components/PageB.vue'

export const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'root', components: {default: Welcome}},
    { path: '/pageA', name: 'pageA', components: {default: PageA}},
    { path: '/pageB', name: 'pageB', component: PageB},
    { path: '*', redirect: '/'}
  ]
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})