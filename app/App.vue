<template>
    <div id="app">
        <div class="ui thin sidebar left inverted vertical menu visible">
            <router-link :to="{name: 'welcome'}" class="item"><i class="home icon"></i>Welcome</router-link>
            <router-link :to="{name: 'over50'}" class="item"><i class="alarm icon"></i>Over50% Issues</router-link>
            <router-link :to="{name: 'dailyStandUp'}" class="item"><i class="checked calendar icon"></i>Daily Stand Up</router-link>
            <router-link :to="{name: 'login'}" class="item">Login</router-link>
        </div>
        <div class="pusher">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
  import Auth from './services/auth.js'
  export default {
    data () {
      return {
        loggedIn: Auth.isLogged()
      }
    }
  }

</script>

<style>
    .pusher {
        width: calc(100% - 180px);
    }
</style>