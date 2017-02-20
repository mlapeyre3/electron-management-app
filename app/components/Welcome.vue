<template>
    <div class="welcome">
        <div class="ui card">
            <div class="ui image">
                <img :src="userAvatarUrl">
            </div>
            <div class="content">
                <a class="header">Mathieu Lapeyre</a>
                <div class="meta">
                    <span class="date">Joined in 2016</span>
                </div>
                <div class="description">
                    Mathieu Lapeyre is a Project Manager.
                </div>
            </div>
            <div class="extra content">
                <a>
                    <i class="user icon"></i>
                    22 Friends
                </a>
            </div>
        </div>
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
    </div>
</template>

<script>
  export default {
    data () {
      return {
        userAvatarUrl: ""
      }
    },
    mounted () {
      var email = "mathieu.lapeyre@s4m.io"
      var pwd = 'Rendsmoimesinfos0'

      var base64Auth = btoa(email + ':' + pwd)

      var options = {
        url: 'https://mediaconnect.atlassian.net/wiki/rest/api/user/current',
        method: 'GET',
        headers:
          {
            Authorization: 'Basic ' + base64Auth
          }
      }
      this.$http(options).then((response) => {
        console.log(response)
        // get body data
        this.userAvatarUrl = "https://mediaconnect.atlassian.net"+ response.body.profilePicture.path
        //this.userAvatarUrl = 'https://mediaconnect.atlassian.net' + '/wiki/download/attachments/114851976/user-avatar'
      }, response => {
        console.log(response)
      });
    }
  }
</script>