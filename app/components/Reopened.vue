<template>
    <div class="ui container">
        <form class="ui form">
            <h4 class="ui dividing header">Configuration</h4>
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>Project:</label>
                        <multiselect v-model="projectSelected" :options="projectList" track-by="key" label="name"
                                     placeholder="Pick some" :searchable="false"></multiselect>
                    </div>
                    <div class="six wide field">
                        <label>Date Range:</label>
                        <multiselect v-model="dateRangeSelected" :options="dateRangeList" track-by="name" label="name"
                                     placeholder="Select one" :searchable="false"></multiselect>
                    </div>
                </div>
            </div>
            <div class="ui primary button" @click="getIssueChangelog(projectSelected,dateRangeSelected)" v-bind:class="{ loading: isLoading }">
                Analyse reopened transitions
            </div>
        </form>
        {{changeLogByReporter}}
    </div>
</template>

<script>
  import Jira from '../services/jiraRequest.js'
  import Multiselect from 'vue-multiselect'
  import User from '../models/User.js'
  import utils from '../services/utils.js'

  export default {
    components: {Multiselect},

    data () {
      return {
        projectList: [],
        projectSelected: null,
        dateRangeList: [
          {
            "name": "yesterday",
            "value": "-1d"
          },
          {
            "name": "last 7 days",
            "value": "-7d"
          },
          {
            "name": "last 14 days",
            "value": "-14d"
          },
          {
            "name": "last 30 days",
            "value": "-30d"
          }
        ],
        dateRangeSelected: {
          "name": "last 14 days",
          "value": "-14d"
        },
        changeLogByReporter: [],
        isLoading: false
      }
    },

    mounted () {
      this.getProjects();
    },

    methods: {
      getProjects: function () {
        this.isLoading = true;
        Jira.getProjects(this).then((response) => {
          this.fetchProjects(response.body);
        })
      },

      fetchProjects (data) {
        if (data.length > 0) {
          this.projectList = data;
        }
        this.isLoading = false;
      },

      getIssueChangelog: function (projectSelected, dateRangeSelected) {
        this.isLoading = true;
        Jira.getIssueChangelog(this,projectSelected.key,null,dateRangeSelected.value).then((response) => {
          this.fetchIssueChangelog(response.body);
          this.isLoading = false
        })
      },

      fetchIssueChangelog: function (data) {
        var issues = data.issues;

        for(let i=0;i<issues.length;i++) {
          let issue = issues[i];
          if(this.changeLogByReporter.length == 0) {
            let entry = {reporter: issue.fields.reporter, totalIssues: 1, changelog: {transitions: {reopened: 0}}};
            this.changeLogByReporter.push(entry);
          } else if (!this.changeLogByReporter.some(function(d) {return d.reporter.key === issue.fields.reporter.key})) {
            console.log(issue);
          }
        }
/*
        for issue in data["issues"]:
	#Search for issues by reporter
        if 'reporter' not in issue["fields"]:
        error = True

        key = issue["fields"]["reporter"]['displayName']
        if key not in jsonIssue:
        jsonIssue[key] = 1
        else:
        jsonIssue[key] += 1

	#Search for reopened by reporter
        for history in issue["changelog"]["histories"]:
        for item in history["items"]:
        if item["field"] == "status" and item["toString"] == "Reopened" or item["toString"] == "Re-opened":
        reopenedNb += 1

        if 'reporter' not in issue["fields"]:
        error = True
        continue

        key = issue["fields"]["reporter"]['displayName']
        if key not in jsonReporter:
        jsonReporter[key] = 1
        else:
        jsonReporter[key] += 1

        this.isLoading = false*/
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>