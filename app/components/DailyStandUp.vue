<template>
    <div>
        <h3 class="ui header">
            This section helps you to retrieve a Daily Stand Up page from yesterday and create the today's one.
        </h3>

        <form class="ui form" v-bind:class="{ error: !isFound }">
            <div class="two fields">
                <div class="field">
                    <label>Project</label>
                    <select class="ui fluid search dropdown" name="projectId">
                        <option v-for="project in projectList" value="project.id">{{project.name}}</option>
                    </select>
                </div>
                <div class="field">
                    <label>Sprint</label>
                    <input placeholder="Fusio - 2017-03-07" name="title" type="text" v-model="contentSearch.title">
                </div>
            </div>
            <div class="ui error message">
                <div class="header">Not found</div>
                <p>We found no pages which match your request.</p>
            </div>
            <div class="ui teal submit button" @click="searchDailyContent()" v-bind:class="{ loading: isLoading }">Search</div>
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
                        <button class="ui fluid mini teal submit button" @click="setDailyTemplate(pageContent)" v-bind:class="{ loading: isLoading }">Set as template</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-show="isSelectedTemplate" class="ui message">
            <div class="header">
                The selected page template
            </div>
            <div v-html="rawHtmlTemplate" id="rawHtmlTemplate"></div>
        </div>

        <div v-show="isSelectedTemplate" class="ui teal submit button" @click="createDailyContent()" v-bind:class="{ loading: isLoading }">Create</div>
    </div>
</template>

<script>
  import Wiki from '../utils/confluenceRequest.js'

  export default {
    data () {
      return {
        projectList: Wiki.projectList,

        contentSearch: {
          spaceKey: 'PM',
          title: 'FUSIO - 2017-03-06',
          type: 'page'
        },
        contentSet: {
          spaceKey: 'PM',
          title: 'FUSIO - 2017-03-08',
          type: 'page'
        },
        pageContents: [],
        nbContents: 0,
        isLoading: false,
        isFound: true,
        isSelectedTemplate: false,
        rawHtmlTemplate: '',
      }
    },

    methods: {
      searchDailyContent() {
        this.isLoading = true
        this.isFound = true
        this.nbContents = 0
        Wiki.searchContent(this, this.contentSearch).then((response) => {
          this.fetchDailyContent(response.body)
        })
      },

      fetchDailyContent(data) {
        if(data.size == 0){
          this.isFound = false
          return
        }
        this.nbContents = data.size
        this.pageContents = data.results
        this.isLoading = false
      },

      setDailyTemplate(templateContent) {
        this.rawHtmlTemplate = templateContent.body.storage.value
        console.log(this.rawHtmlTemplate)
        this.isSelectedTemplate = true
        var dailyTableList = document.getElementById("rawHtmlTemplate").getElementsByTagName("table")
        var _this = this;

        //Trick to let wait for the DOM to be loaded
        setTimeout(function() {
          if(dailyTableList.length != 1){
            console.log("We found several daily table in your template")
            return
          }
          _this.switchDailyTable(dailyTableList[0])
        }, 0);
      },

      switchDailyTable(dailyTable) {
        for (var i = 1; i < dailyTable.rows.length; i++){
          dailyTable.rows.item(i).cells.item(1).innerHTML = dailyTable.rows.item(i).cells.item(2).innerHTML
          dailyTable.rows.item(i).cells.item(2).innerHTML = ""
        }
      },

      createDailyContent(){
        console.log(this.rawHtmlTemplate)
        Wiki.createContent(this, this.rawHtmlTemplate)
      }
    }
  }
</script>