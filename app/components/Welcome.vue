<template>
    <div class="welcome">
        <div class="ui centered grid">
            <div class="four column row">
                <div class="right floated column">
                    <div class="ui card">
                        <div class="content">
                            <img class="ui avatar image" :src="currentUser.avatar"> {{ currentUser.displayName }}
                        </div>
                    </div>
                </div>
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
        currentUser: {
          active: false,
          avatar: '',
          displayName: 'toto',
          emailAddress: '',
          key: '',
          self: '',
          timezone: ''
        }
      }
    },
    mounted () {
      Jira.getCurrentUser(this).then((response) => {
        this.fetchCurrentUser(response.body)
      })
    },
    methods: {
      fetchCurrentUser: function (data) {
        this.currentUser.active = data.active
        this.currentUser.avatar = data.avatarUrls["16x16"]
        this.currentUser.displayName = data.displayName
        this.currentUser.emailAddress = data.emailAddress
      }
    }
  }
</script>