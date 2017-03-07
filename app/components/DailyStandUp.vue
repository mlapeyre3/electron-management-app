<template>
    <div>
        <h3 class="ui header">
            This section helps you to retrieve a Daily Stand Up page from yesterday and create the today's one.
        </h3>

        <form class="ui form" v-bind:class="{ error: !isFound }">
            <div class="two fields">
                <div class="field">
                    <label>Space</label>
                    <input placeholder="PM" name="spaceKey" type="text" v-model="contentSearch.spaceKey">
                </div>
                <div class="field">
                    <label>Title</label>
                    <input placeholder="FUSIO - 2017-03-07" name="title" type="text" v-model="contentSearch.title">
                </div>
            </div>
            <div class="ui error message">
                <div class="header">Not found</div>
                <p>We found no pages which match your request.</p>
            </div>
            <div class="ui teal submit button" @click="submit()" v-bind:class="{ loading: isLoading }">Search</div>
        </form>

        <br>

        <div v-show="nbContents > 0">
            <div class="ui success message">
                <div class="header">
                    Your search is successful.
                </div>
                <p>You may now create a new Daily Stand Up report by selecting an existing report as template</p>
            </div>

            <table v-show="nbContents > 0" class="ui very basic collapsing celled table">
                <thead>
                <tr>
                    <th class="nine wide">Page</th>
                    <th>Space Key</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="pageContent in pageContents">
                    <td>
                        {{pageContent.title}}
                    </td>
                    <td>
                        {{contentSearch.spaceKey}}
                    </td>
                    <td>
                        <button class="ui fluid mini teal submit button" @click="createDailyContent(pageContent)" v-bind:class="{ loading: isLoading }">Create Daily</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="ui message">
            <div class="header">
                The selected page template
            </div>
            <div v-html="rawHtml" id="toto"></div>
        </div>

        <div class="ui message">
            <div class="header">
                The targeted page template
            </div>
            <div v-html="rawHtmlTarget" id="target"></div>
        </div>
    </div>
</template>

<script>
  import Wiki from '../utils/confluenceRequest.js'

  export default {
    data () {
      return {
        contentSearch: {
          spaceKey: 'PM',
          title: 'FUSIO - 2017-03-06',
          type: 'page'
        },
        pageContents: [],
        nbContents: 0,
        isLoading: false,
        isFound: true,
        rawHtml: '',
        rawHtmlTarget: '',
      }
    },

    methods: {
      submit() {
        this.isLoading = true
        this.isFound = true
        this.nbContents = 0
        Wiki.searchContent(this, this.contentSearch).then((response) => {
          this.fetchDailyContent(response.body)
        })
      },

      fetchDailyContent(data){
        if(data.size == 0){
          this.isFound = false
          return
        }

        this.nbContents = data.size
        this.pageContents = data.results
        this.isLoading = false
      },

      createDailyContent(templateContent) {
        this.rawHtml = templateContent.body.storage.value

        console.log(document.getElementById("toto"))

        var rawHtml = document.getElementById("toto")

        var tableList = rawHtml.getElementsByTagName("table")

        console.log(tableList)
        console.log(tableList.length)


      }
    }
  }
</script>