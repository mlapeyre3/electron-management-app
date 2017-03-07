import {router} from '../main.js'

// URL and endpoint constants
const API_URL = 'https://mathieulapeyre.atlassian.net'
const LOGIN_URL = API_URL + '/rest/api/2/myself'

export default {

  // User object will let us check authentication status
  user: {
    //authenticated: false
    authenticated: false
  },

  isLogged(){
    return this.user.authenticated
  },

  login(context,credentials,redirect){
    var options = {
      url: LOGIN_URL,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + this.getAuthBasic(credentials)
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

  // The object to be passed as a header for authenticated requests
  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    }
  },

  getAuthBasic(credentials) {
    if (credentials){
      return btoa(credentials.username + ':' + credentials.password)
    } else if(localStorage.getItem('credentials')){
      credentials = JSON.parse(localStorage.getItem('credentials'))
    }
    return btoa(credentials.username + ':' + credentials.password)
  }
}