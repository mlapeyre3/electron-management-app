<template>
    <div class="welcome">
        <a class="ui massive image label">
            <img :src="userAvatarUrl">
            User
        </a>


        <div class="ui centered grid">
            <div class="row">
                <p>This is where the S4M logo should be</p>
            </div>
            <div class="row">
                <div class="four wide column">
                    <p class="ui card">Hello 1</p>
                </div>
                <div class="four wide column">
                    <p>Hello 2</p>
                </div>
            </div>
            <div class="row">
                <div class="four wide column">
                    <p>Hello 4</p>
                </div>
                <div class="four wide column">
                    <p>Hello 5</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Auth from '../utils/auth.js'
  export default {
    data () {
      return {
        userAvatarUrl: null
      }
    },
    mounted () {
      var response
      if(response = Auth.isLogged()){
        this.userAvatarUrl = response
      }
      else {
      }
    }
  }
</script>