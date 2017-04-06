import Auth from './auth.js'

// URL and endpoint constants
const GIT_TOKEN = "017704ccb2ef38526067b0f63b5e5c7283a86120";
//const API_URL = 'https://mathieulapeyre.atlassian.net/rest/api/2';
const API_URL = 'https://api.github.com';
const CURRENT_USER = API_URL + '/myself';
const REPO_BRANCH = API_URL + '/repos/s4mdev/{repository}/branches/{branch}';
const COMPARE_COMMIT = API_URL + '/repos/s4mdev/{repository}/compare/{base}...{head}';

export default {
  compareBranchHead(context,repository,base,head){
    if(!repository || !base || !head) {
      throw new TypeError("Missing element");
    } else {
      let urlConfig = COMPARE_COMMIT.replace("{repository}",repository).replace("{base}",base).replace("{head}",head);
      let options = {
        url: urlConfig,
        method: 'GET',
        headers:
          {
            Authorization: 'Token ' + this.getAuthGit()
          }
      };
      return context.$http(options)
    }
  },

  getAuthGit() {
    return GIT_TOKEN;
  }
}