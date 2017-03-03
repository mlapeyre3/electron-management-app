<template>
    <div class="welcome">
        <a class="ui massive image label">
            <img class="ui image" :src="currentUser.avatarUrls.16x16"
            User
            <p>{{currentUser}}</p>
        </a>


        <div class="ui centered grid">
            <div class="row">
                <p>This is where the logo should be</p>
            </div>
            <div class="row">
                <div class="four wide column">
                    <router-link :to="{name: 'over50'}" class="item">
                        <p class="ui card">Check warning issues</p>
                    </router-link>
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
  import Jira from '../utils/jiraRequest.js'
  export default {
    data () {
      return {
        currentUser: {}
      }
    },
    mounted () {
      Jira.getCurrentUser(this).then((response) => {
        this.currentUser = response.body
      })
    }
  }
</script>