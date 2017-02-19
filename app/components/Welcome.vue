<template>
    <div class="welcome">
        <div class="ui centered grid">
            <div class="row">
                <p>This is where the S4M logo should be</p>
            </div>
            <div class="row">
                <div class="four wide column">
                    <p class="ui card">Hello 1</p>
                </div>
                <div class="four wide column">
                    <p>Hello 2</p>
                </div>
            </div>
            <div class="row">
                <div class="four wide column">
                    <p>Hello 4</p>
                </div>
                <div class="four wide column">
                    <p>Hello 5</p>
                </div>
            </div>
        </div>
        <div>
            {{ users }}
        </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        users: []
      }
    },
    mounted () {
      this.$http.get('http://jsonplaceholder.typicode.com/users').then(response => {

        // get body data
        this.users = response.body;
        console.log(response)

      }, response => {
        // error callback
      });
    }
  }
</script>