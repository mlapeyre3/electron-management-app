<template>
    <div>
        <h1 class="ui header">
            This section shows you issues that have exceeded 5O% of the initial estimation.
        </h1>
        <p>{{over50issues}}</p>
    </div>
</template>

<script>
  import Jira from '../utils/jiraRequest.js'
  export default {
    data () {
      return {
        currentUser: [],
        over50issues: []
      }
    },
    mounted () {
      //this.over50issues = Jira.getMyFilter(this)
      //console.log("Finished")
      Jira.getMyFilter(this).then((response) => {
        this.over50issues = response.body
      })
    },
    methods: {

    }
  }
</script>