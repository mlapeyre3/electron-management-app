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
                    <input v-model="gitBranch">
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
                    <p v-if="issue.git">{{issue.git}}</p>
                    <p v-else>Loading</p>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import Jira from '../services/jiraRequest.js'
  import JiraDev from '../services/jiraDevRequests.js'
  export default {
    data () {
      return {
        currentUser: [],
        projectList: [],
        projectSelected: {},
        versionList: [],
        versionSelected: {},
        gitBranch: '',
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
        if(project != null){
          this.isLoading = true;
          Jira.getProjectVersions(this,project,true,true).then((response) => {
            this.versionList = response.body;
            this.isLoading = false;
            this.removeVersion(this.versionList,true,true);
          }).catch((response) => {
            this.isLoading = false;
          })
        }
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
        for (let i=0, len=issueList.length; i<len; i++) {
          console.log(issueList[i].id)
          JiraDev.getGitDetails(this,issueList[i],"repository").then((response) => {
            //issueList[i]["git"] = "toto"
            //console.log(issueList[i]);
            let newValue = this.issueList[i];
            console.log(response)
            if(response.body.detail[0].repositories.length > 0) {
              newValue["git"] = response.body.detail[0].repositories[0].commits[0].id;
            }

            this.$set(issueList, i, newValue)
          });
        }
      }
    }
  }
</script>