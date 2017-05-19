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
        <table class="ui very basic collapsing celled table">
            <thead>
            <tr>
                <th>Reporter</th>
                <th>Issues</th>
                <th>Total Issues</th>
                <th>Total Reopened Transitions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in changeLogByReporter">
                <td>
                    {{item.reporter.displayName}}
                </td>
                <td>
                    <div v-for="issue in item.issues">
                        {{issue.key}} - {{issue.summary}}
                    </div>
                </td>
                <td>
                    {{item.issues.length}}
                </td>
                <td>
                    {{item.changelog.transitions.reopened}}
                </td>
            </tr>
            </tbody>
        </table>
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
        this.changeLogByReporter = [];
        Jira.getIssueChangelog(this,projectSelected.key,null,dateRangeSelected.value).then((response) => {
          this.fetchIssueChangelog(response.body);
          this.isLoading = false
        })
      },

      fetchIssueChangelog: function (data) {
        var issues = data.issues;

        for(let i=0;i<issues.length;i++) {
          let issue = issues[i];
          let index = this.changeLogByReporter.findIndex(function(d) {
            return d.reporter.key === issue.fields.reporter.key
          });

          if (index == -1) {
            let reopenedTransitions = this.findReopenedTransitions(issue.changelog.histories);
            let entry = {reporter: issue.fields.reporter, totalIssues: 1,
              issues: [{key: issue.key, summary: issue.fields.summary}], changelog: {transitions: {reopened: reopenedTransitions}}};
            this.changeLogByReporter.push(entry);
          } else {
            let reopenedTransitions = this.findReopenedTransitions(issue.changelog.histories);
            this.changeLogByReporter[index].changelog.transitions.reopened += reopenedTransitions;

            let entry = {key: issue.key, summary: issue.fields.summary};
            this.changeLogByReporter[index].totalIssues += 1;
            this.changeLogByReporter[index].issues.push(entry);

          }
        }

        console.log(this.changeLogByReporter);
      },

      findReopenedTransitions: function (histories) {
        var reopenedTransitions = 0;

        for(let i=0;i<histories.length;i++) {
          let history = histories[i];
          for(let j=0;j<history.items.length;j++) {
            let item = history.items[j];
            if(item.toString === "Reopened" || item.toString === "Re-opened") {
              reopenedTransitions ++;
            }
          }
        }

        return reopenedTransitions;
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>