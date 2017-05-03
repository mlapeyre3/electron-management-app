import Auth from './auth.js'

// URL and endpoint constants
//const API_URL = 'https://mathieulapeyre.atlassian.net/rest/api/2';
const API_URL = 'https://mediaconnect.atlassian.net/rest/api/2';
const CURRENT_USER = API_URL + '/myself';
const SEARCH_USER = API_URL + '/user/search?username={username}&maxResults=200';
const MY_FILTER = API_URL + '/my';
const JQL_SEARCH = API_URL + '/search';
const PROJECT_LIST = API_URL + '/project';
const PROJECT_VERSIONS = API_URL +  '/project/{projectIdOrKey}/versions';

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

  getUser(context,username) {
    if(!username){
      username = '%';
    }

    let options = {
      url: SEARCH_USER.replace('{username}', username),
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

  getProjects(context) {
    let options = {
      url: PROJECT_LIST,
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + Auth.getAuthBasic()
        }
    };
    return context.$http(options)
  },

  getProjectVersions(context,projectKey,released,archived) {
    let options = {
      url: PROJECT_VERSIONS.replace('{projectIdOrKey}', projectKey),
      method: 'GET',
      headers:
        {
          Authorization: 'Basic ' + Auth.getAuthBasic()
        }
    };
    return context.$http(options)
  },

  getWorklog(context,dateRange,worklogAuthor) {
    let jql = "worklogAuthor IN ({worklogAuthor}) AND worklogDate >= {dateRange}";
    jql = dateRange ? jql.replace('{dateRange}',dateRange) : jql.replace('{dateRange}','-1d');
    jql = worklogAuthor ? jql.replace('{worklogAuthor}',worklogAuthor) : jql.replace('{worklogAuthor}','%');

    let jqlConfig = {
      "jql": jql,
      "startAt": 0,
      "maxResults": 200,
      "fields": [
        "issuetype",
        "priority",
        "summary",
        "status",
        "assignee",
        "workratio",
        "timespent",
        "timeoriginalestimate",
        "fixVersions",
        "worklog"
      ],
      "fieldsByKeys": false
    };

    return this.jqlSearch(context,jqlConfig)
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

  getReleaseIssues(context,project,version) {
    let jql = "project = {projectIdOrKey} AND fixVersion = {versionIdOrKey}";
    jql = jql.replace('{projectIdOrKey}', project);
    jql = jql.replace('{versionIdOrKey}', version);
    let jqlConfig = {
      "jql": jql,
      "startAt": 0,
      "maxResults": 100,
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