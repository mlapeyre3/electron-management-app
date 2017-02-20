<template>
    <div>
        <h1 class="ui header">
            This section shows you issues that have exceeded 5O% of the initial estimation.
        </h1>
        <div v-html="over50issues"></div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        currentUser: [],
        over50issues: []
      }
    },
    mounted () {
      var email = "mathieu.lapeyre@s4m.io"
      var pwd = 'Rendsmoimesinfos0'

      var base64Auth = btoa(email + ':' + pwd)

      var options = {
        //url: 'https://mediaconnect.atlassian.net/wiki/rest/api/user/current',
        url: 'https://mediaconnect.atlassian.net/rest/gadget/1.0/issueTable/filter?num=20&tableContext=jira.table.cols.dashboard&addDefault=false&columnNames=issuetype&columnNames=issuekey&columnNames=status&columnNames=summary&columnNames=priority&columnNames=progress&columnNames=timeoriginalestimate&columnNames=timeestimate&columnNames=timespent&columnNames=workratio&enableSorting=true&paging=true&showActions=true&filterId=15800&sortBy=workratio%3ADESC&startIndex=0&_=1487616044846',
        method: 'GET',
        headers:
          {
            Authorization: 'Basic ' + base64Auth
          }
      }
      this.$http(options).then((response) => {

        // get body data
        this.over50issues = response.body.table
        console.log(response)

      }, response => {
        console.log(response)
      });
    }
  }
</script>