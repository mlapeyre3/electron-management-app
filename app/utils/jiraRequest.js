import Auth from './auth.js'

// URL and endpoint constants
const API_URL = 'https://mathieulapeyre.atlassian.net'
const CURRENT_USER = API_URL + '/rest/api/2/myself'
const MY_FILTER = API_URL + '/rest/api/2/filter/my'

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
    return context.$http(options)
  },

  getMyFilter(context){
    var options = {
      url: MY_FILTER,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + Auth.getAuthBasic()
        }
    }
    return context.$http(options)
  }
}