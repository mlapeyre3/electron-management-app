<template>
    <div>
        <h1 class="ui header">
            This section shows you issues that have exceeded 5O% of the initial estimation.
        </h1>
        <div v-html="over50issues"></div>
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
      this.over50issues = Jira.getMyFilter(this)
      console.log("Finished")
    },
    methods: {

    }
  }
</script>