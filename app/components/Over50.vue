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
      if(!this.getCurrentFilter()){
        this.getCurrentFilter()
      }
    },
    methods: {
      getCurrentFilter: function () {
        var email = "mathieu.lapeyre@outlook.fr"
        var pwd = 'IloveS4M$'

        var base64Auth = btoa(email + ':' + pwd)

        var options = {
          //url: 'https://mediaconnect.atlassian.net/wiki/rest/api/user/current',
          url: 'https://mathieulapeyre.atlassian.net/rest/api/2/filter/my',
          method: 'GET',
          headers:
            {
              Authorization: 'Basic ' + base64Auth
            }
        }
        this.$http(options).then((response) => {

          // get body data
          this.over50issues = response.body
          return true

        }, response => {
          console.log('NOK')
          return false
        });
      }
    }
  }
</script>