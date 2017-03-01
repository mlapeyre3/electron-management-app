import {router} from '../main.js'

// Parameters
const email = 'mathieu.lapeyre@outlook.f'
const pwd = 'IloveS4M$'
const base64Auth = btoa(email + ':' + pwd)

// URL and endpoint constants
const API_URL = 'https://mathieulapeyre.atlassian.net'
const LOGIN_URL = API_URL + '/wiki/rest/api/user/current'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  //Check for current user based on Basic Authentication
  /*checkLogin(context){
    var options = {
      url: LOGIN_URL,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + base64Auth
        }
    }
    context.$http(options).then((response) => {
      console.log(response)
      return response
    }, response => {
      console.log(response)
      return false
    });
  },*/

  isLogged(){
    return this.user.authenticated
  },

  // Send a request to the login URL and save the returned JWT
  /*login(context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds, (data) => {
      localStorage.setItem('id_token', data.id_token)

      this.user.authenticated = true

      // Redirect to a specified route
      if(redirect) {
        router.go(redirect)
      }

    }).error((err) => {
      context.error = err
    })
  },*/

  login(context,credentials,redirect){
    var options = {
      url: LOGIN_URL,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
          //this.getAuthHeader()
        }
    }
    context.$http(options).then((response) => {
      this.user.authenticated = true
      localStorage.setItem('credentials',JSON.stringify(credentials))
      if(redirect){
        router.push({ path: '/' })
      }
    }, response => {
      this.user.authenticated = false
      return false
    });
  },

  // To log out, we just need to remove the token
  logout() {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
  },

  checkAuth() {
    var jwt = localStorage.getItem('id_token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    }
  }
}