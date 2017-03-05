<template>
    <div>
        <h3 class="ui header">
            This section shows you issues that have exceeded 5O% of the initial estimation.
        </h3>
        <table class="ui very basic collapsing celled table">
            <thead>
                <tr>
                    <th class="nine wide">Issue</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Estimate</th>
                    <th>Spent</th>
                    <th>Workratio</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="over50issue in over50issues">
                    <td>
                        <img :src="over50issue.fields.issuetype.iconUrl" class="ui mini rounded left floated image">
                        {{over50issue.key}} {{over50issue.fields.summary}}
                    </td>
                    <td>
                        {{over50issue.fields.status.name}}
                    </td>
                    <td>
                        {{over50issue.fields.assignee.displayName}}
                    </td>
                    <td>
                        {{over50issue.fields.timeoriginalestimate | formatTimeToDayHour}}
                    </td>
                    <td>
                        {{over50issue.fields.timespent | formatTimeToDayHour}}
                    </td>
                    <td>
                        <i v-if="over50issue.fields.workratio > 50" class="attention icon floated left"></i>
                        <i v-else-if="over50issue.fields.workratio > 100" class="remove circle icon floated left"></i>
                        {{over50issue.fields.workratio}}%
                    </td>
                    <td>
                        <button class="ui fluid mini teal submit button" @click="submit(over50issue)" v-bind:class="{ loading: isLoading }">Send Comment</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="ui message">
            <div class="header">
                This is a sample of the comment that will be sent
            </div>
            <p>
                {{commentTemplate}}
            </p>
        </div>
    </div>
</template>

<script>
  import Jira from '../utils/jiraRequest.js'
  export default {
    data () {
      return {
        currentUser: [],
        over50issues: [],
        commentTemplate: '',
        isLoading: false
      }
    },
    mounted () {
      Jira.getOver50Issues(this).then((response) => {
        this.fetchOver50Issues(response.body)
      })
    },
    methods: {
      fetchOver50Issues: function (data) {
        this.over50issues = data.issues
        if(this.over50issues.length > 0) {
          this.commentTemplate = "Automatic message. Warning, this issue has been estimated to xx days and you have \
          spent xx days. Toto are you still confident with this estimation ?"
        }
      },

      submit(over50issue) {
        this.isLoading = true

        var comment = `Automatic message.
        (!) Warning, this issue has been estimated to ${this.$options.filters.formatTimeToDayHour(over50issue.fields.timeoriginalestimate)} and you have spent ${this.$options.filters.formatTimeToDayHour(over50issue.fields.timespent)}.
        (?) [${over50issue.fields.assignee.key}] are you still confident with this estimation ?`

        Jira.postComment(this, over50issue.id, comment).then((response) => {
          this.isLoading = false
        })
      }
    },

    filters: {
      formatTimeToDayHour: function (value){
        const API_TIME = 60*60
        const JIRA_DAY = 8

        var valueHour = (value/API_TIME).toPrecision(3)

        var day = Math.floor(valueHour/JIRA_DAY)
        var hour = valueHour % JIRA_DAY

        if(hour == 0) {
          return day + ' days'
        }

        return day + ' days and ' + hour + ' hours'
      }
    }
  }
</script>