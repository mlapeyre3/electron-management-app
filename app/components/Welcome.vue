<template>
    <div class="welcome">
        <br>
        <div class="ui centered grid">
            <div class="four column row">
                <div class="right floated column">
                    <div class="ui card">
                        <div class="content">
                            <img class="ui avatar image" :src="currentUser.avatar"> {{ currentUser.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="four column row">
                <div class="nine wide column">
                    <h1 class="ui header">
                        <p>Welcome. Please choose a category.</p>
                    </h1>
                </div>
            </div>
            <div class="four column row">
                <div class="column">
                    <router-link :to="{name: 'warningIssues'}" class="item" >
                        <i class="massive grey alarm outline icon"></i>
                    </router-link>
                </div>
                <div class="column">
                    <router-link :to="{name: 'dailyStandUp'}" class="item" >
                        <i class="massive grey checked calendar icon"></i>
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div class="column">
                    <router-link :to="{name: 'release'}" class="item" >
                    </router-link>
                </div>
                <div class="column">
                    <p>Hello 4</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import User from '../models/User.js'
  import Auth from '../services/auth.js'
  import Jira from '../services/jiraRequest.js'

  export default {
    data () {
      return {
        currentUser: new User(false)
      }
    },
    mounted () {
      Jira.getCurrentUser(this).then((response) => {
        this.fetchCurrentUser(response.body)
      })
    },
    methods: {
      fetchCurrentUser: function (data) {
        this.currentUser.active = data.active;
        this.currentUser.avatar = data.avatarUrls["48x48"];
        this.currentUser.name = data.displayName;
        this.currentUser.emailAddress = data.emailAddress;
      }
    }
  }
</script>