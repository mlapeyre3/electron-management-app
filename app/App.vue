<template>
    <div id="app">
        <div class="ui thin sidebar left inverted vertical menu visible">
            <router-link to="/welcome" class="item"><i class="home icon"></i>Welcome</router-link>
            <router-link to="/pageA" class="item">PageA</router-link>
            <router-link to="/pageB" class="item">PageB</router-link>
        </div>
        <div class="pusher">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    }
  }

</script>