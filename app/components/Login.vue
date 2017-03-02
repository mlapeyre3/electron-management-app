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
                    <button class="ui fluid large teal submit button" @click="submit()" v-bind:class="{ loading: isLoading }">Login</button>
                </div>
            </div>
            <div class="ui error message" v-show="error">
                Sorry, the member name and password you entered do not match. Please try again.
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
        error: false,
        isLoading: false
      }
    },
    mounted () {
      this.error = false
      this.isLoading = false
      console.log("Mounted")
      if(localStorage.getItem('credentials')){
        let tmpCredentials = JSON.parse(localStorage.getItem('credentials'))
        this.credentials.username = tmpCredentials.username
        this.credentials.password = tmpCredentials.password
      }
    },
    methods: {
      submit() {
        this.isLoading = true
        Auth.login(this, this.credentials, 'welcome')
      }
    }

  }
</script>