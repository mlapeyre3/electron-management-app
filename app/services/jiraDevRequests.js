import Auth from './auth.js'

// URL and endpoint constants
//const API_URL = 'https://mathieulapeyre.atlassian.net/rest/dev-status/1.0';
const API_URL = 'https://mediaconnect.atlassian.net/rest/dev-status/1.0';
const GIT_DETAIL = API_URL + '/issue/detail';

export default {
  getGitDetails(context,issue,detailType){
    let gitConfig = {
      issueId: issue.id,
      applicationType: "github",
      dataType: detailType
    };

    let options = {
      url: GIT_DETAIL,
      method: 'GET',
      params: gitConfig,
      headers:
        {
          Authorization: 'Basic ' + Auth.getAuthBasic()
        }
    };
    return context.$http(options)
  }
}