<template>
    <div>
        <h3 class="ui header">
            Here you can manage project releases and related Git status
        </h3>
        <form class="ui form">
            <div class="three fields">
                <div class="field">
                    <label>Project</label>
                    <select class="ui fluid search dropdown" v-model="projectSelected" @change="fetchProjectVersions(projectSelected)">
                        <option v-for="project in projectList" :value="project.key">{{project.key}}</option>
                    </select>
                </div>
                <div class="field">
                    <label>Version</label>
                    <select class="ui fluid search dropdown" v-model="versionSelected">
                        <option v-for="version in versionList" :value="version.id">{{version.name}}</option>
                    </select>
                </div>
                <div class="field">
                    <label>Git branch</label>
                    <input v-model="branchSelected">
                </div>
            </div>
            <div class="ui teal submit button" @click="fetchReleaseIssues(projectSelected,versionSelected)" v-bind:class="{ loading: isLoading }">
                Search
            </div>
        </form>
        <table v-if="isFound" class="ui very basic collapsing celled table">
            <thead>
            <tr>
                <th class="nine wide">Issue</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Commit</th>
                <th>Branch status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="issue in issueList">
                <td>
                    <img :src="issue.fields.issuetype.iconUrl" class="ui mini rounded left floated image">
                    {{issue.key}} {{issue.fields.summary}}
                </td>
                <td>
                    {{issue.fields.status.name}}
                </td>
                <td>
                    {{issue.fields.assignee.displayName}}
                </td>
                <td>
                    <div v-if="issue.git">
                        <div v-for="repository in issue.git">
                            <p>{{repository.name}}</p>
                            <div class="ui list" style="height: 60px; overflow: scroll;">
                                <div v-for="commit in repository.commits" class="item">{{commit.id}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <i class="notched circle loading icon"></i>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import Jira from '../services/jiraRequest.js'
  import JiraDev from '../services/jiraDevRequests.js'
  import Git from '../services/githubRequest.js'

  export default {
    data () {
      return {
        currentUser: [],
        projectList: [],
        projectSelected: {},
        versionList: [],
        versionSelected: {},
        branchSelected: '',
        issueList: [],
        isLoading: false,
        isFound: false
      }
    },
    mounted () {
      this.retrieveProject();
    },
    methods: {
      retrieveProject: function() {
        this.isLoading = true;
        Jira.getProjects(this).then((response) => {
          this.projectList = response.body;
          this.projectSelected = this.projectList[0];
          this.isLoading = false;
        })
      },

      fetchProjectVersions: function(project) {
        if(project != null){this.isLoading = true;
        Jira.getProjectVersions(this,project,true,true).then((response) => {
          this.versionList = response.body;
          this.isLoading = false;

          this.removeVersion(this.versionList,true,true);

        }).catch((response) => {
          this.isLoading = false;
        })}
      },

      removeVersion: function(versionList,archived,released) {
        for(var i=0; i<versionList.length; i++) {
          if((versionList[i].archived==true && archived==true) || (versionList[i].released==true && released==true)){
            versionList.splice(i,1);
          }
        }
      },

      fetchReleaseIssues: function(project,version) {
        this.isLoading = true;
        Jira.getReleaseIssues(this,project,version).then((response) => {
          this.issueList = response.body.issues;
          this.issueList["git"] = null;
          this.fetchIssueGit(this.issueList);
          this.isLoading = false;
          this.isFound = true;
        })
      },

      fetchIssueGit(issueList){
        for (let i=0;i<issueList.length; i++) {
          JiraDev.getGitDetails(this,issueList[i],"repository").then((response) => {
            let newValue = this.issueList[i];
            newValue["git"] = [];

            if(response.body.detail[0].repositories.length > 0) {
              for (let j=0; j<response.body.detail[0].repositories.length; j++) {
                newValue["git"][j] = response.body.detail[0].repositories[j]

                for (let k=0; k<response.body.detail[0].repositories[j].commits.length; k++) {
                  let currentRepo = newValue["git"][j].name;
                  //ERORR WITH THIS let currentCommit = currentRepo.commits[k];
                  /*console.log(currentRepo + '' + currentCommit);
                  Git.compareBranchHead(this,currentRepo,this.branchSelected,currentCommit).then((response) => {

                  })*/
                }

              }
            }

            this.$set(issueList, i, newValue)
          });
        }
      }
    }
  }
</script>