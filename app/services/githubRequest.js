import Auth from './auth.js'

// URL and endpoint constants
//const API_URL = 'https://mathieulapeyre.atlassian.net/rest/api/2';
const API_URL = 'https://api.github.com';
const CURRENT_USER = API_URL + '/myself';

export default {
  getCurrentUser(context){
    let options = {
      url: CURRENT_USER,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + Auth.getAuthBasic()
        }
    };
    return context.$http(options)
  }
}