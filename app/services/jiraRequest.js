import Auth from './auth.js'

// URL and endpoint constants
//const API_URL = 'https://mathieulapeyre.atlassian.net/rest/api/2';
const API_URL = 'https://mediaconnect.atlassian.net/rest/api/2';
const CURRENT_USER = API_URL + '/myself';
const MY_FILTER = API_URL + '/my';
const JQL_SEARCH = API_URL + '/search';

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
  },

  getMyFilter(context){
    let options = {
      url: MY_FILTER,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + Auth.getAuthBasic()
        }
    };
    return context.$http(options)
  },

  getOver50Issues(context) {
    let jqlConfig = {
      "jql": "project = FUS AND sprint in openSprints() AND workratio >= 50",
      "startAt": 0,
      "maxResults": 15,
      "fields": [
        "issuetype",
        "priority",
        "summary",
        "status",
        "assignee",
        "workratio",
        "timespent",
        "timeoriginalestimate",
        "fixVersions"
      ],
      "fieldsByKeys": false
    };

    return this.jqlSearch(context,jqlConfig)
  },

  postComment(context, issueId, comment) {
    let commentConfig = {
      body: comment
    };

    let options = {
      url: API_URL + '/issue/' + issueId + '/comment',
      body: JSON.stringify(commentConfig),
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Auth.getAuthBasic()
      }
    };

    return context.$http(options)
  },

  jqlSearch(context, jqlConfig) {
    let options = {
      url: JQL_SEARCH,
      body: jqlConfig,
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Auth.getAuthBasic()
      }
    };

    return context.$http(options)
  }
}