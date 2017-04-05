import Auth from './auth.js'

// URL and endpoint constants
const GIT_TOKEN = "56c5da63d38f4309cd81725c6cdce73a7ce29414";
//const API_URL = 'https://mathieulapeyre.atlassian.net/rest/api/2';
const API_URL = 'https://api.github.com';
const CURRENT_USER = API_URL + '/myself';
const REPO_BRANCH = API_URL + '/repos/s4mdev/{repository}/branches/{branch}';
const COMPARE_COMMIT = API_URL + '/repos/s4mdev/{repository}/compare/{base}...{head}'

export default {
  compareBranchHead(context,repository,base,head){
    let urlConfig = COMPARE_COMMIT.replace("{repository}",repository).replace("{base}",base).replace("{head}",head);
    let options = {
      url: urlConfig,
      method: 'GET',
      headers:
        {
          Authorization: 'Token ' + this.getAuthGit()
        }
    };
    console.log("####")
    console.log(base);
    console.log(head);
    return context.$http(options)
  },

  getAuthGit() {
    return GIT_TOKEN;
  }
}