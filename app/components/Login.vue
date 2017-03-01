<template>
    <div class="ui middle aligned center aligned grid">
        <div class="column six wide">
            <h2 class="ui teal image header">
                <img src="./../assets/S4M_logo.png" class="image">
                <div class="content">
                    Log-in to your account
                </div>
            </h2>
            <div class="ui large form">
                <div class="ui stacked segment">
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="user icon"></i>
                            <input type="text" name="email" placeholder="E-mail address" v-model="credentials.username">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="password" placeholder="Password" v-model="credentials.password">
                        </div>
                    </div>
                    <button class="ui fluid large teal submit button" @click="submit()">Login</button>
                </div>

                <div class="ui error message"></div>

            </div>
        </div>
    </div>
</template>

<script>
  import Auth from '../utils/auth.js'

  export default {

    data() {
      return {
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },
    mounted () {
      if(localStorage.getItem('credentials')){
        let tmpCredentials = JSON.parse(localStorage.getItem('credentials'))
        this.credentials.username = tmpCredentials.username
        this.credentials.password = tmpCredentials.password
      }
    },
    methods: {
      submit() {
        var credentials = {
          username: this.credentials.username,
          password: this.credentials.password
        }
        Auth.login(this, credentials, 'welcome')
      }
    }

  }
</script>