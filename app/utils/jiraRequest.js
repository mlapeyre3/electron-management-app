import Auth from './auth.js'

// URL and endpoint constants
const API_URL = 'https://mathieulapeyre.atlassian.net'
const CURRENT_USER = API_URL + '/rest/api/2/myself'
const OVER_50 = ''

export default {
  getCurrentUser(context){
    var options = {
      url: CURRENT_USER,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + Auth.getAuthBasic()
        }
    }
    context.$http(options).then((response) => {
      console.log(response.body)
      return response.body
    }, response => {
      return {}
    })
  }
}