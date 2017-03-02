<template>
    <div id="app">
        <div class="ui thin sidebar left inverted vertical menu visible">
            <router-link v-if='loggedIn' :to="{name: 'welcome'}" class="item"><i class="home icon"></i>Welcome</router-link>
            <router-link v-if='loggedIn' :to="{name: 'over50'}" class="item"><i class="alarm icon"></i>Over50% Issues</router-link>
            <router-link v-if='loggedIn' :to="{name: 'pageB'}" class="item">PageB</router-link>
            <router-link v-else :to="{name: 'login'}" class="item">Login</router-link>
        </div>
        <div class="pusher">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
  import Auth from './utils/auth.js'
  export default {
    data () {
      return {
        loggedIn: Auth.isLogged()
      }
    }
  }

</script>