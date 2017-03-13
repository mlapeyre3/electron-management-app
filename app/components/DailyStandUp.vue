<template>
    <div>
        <h3 class="ui header">
            This section helps you to create a Daily Stand Up page based on an existing template.
        </h3>

        <form class="ui form" v-bind:class="{ error: !isFound, loading: isLoading}">
            <div class="two fields">
                <div class="field">
                    <label>Project</label>
                    <select class="ui fluid search dropdown" v-model="projectSelected" @change="searchProjectSprint()">
                        <option v-for="project in projectList" :value="{ project }">{{project.title}}</option>
                    </select>
                </div>
                <div class="field">
                    <label>Sprint</label>
                    <select class="ui fluid search dropdown" v-model="sprintId" @change="searchSprintContent()">
                        <option v-for="sprint in sprintList" :value="sprint.id">{{sprint.title}}</option>
                    </select>
                </div>
            </div>
            <div class="ui error message">
                <div class="header">Not found</div>
                <p>We found no pages which match your request.</p>
            </div>
            <div class="ui teal submit button" @click="searchSprintContent()" v-bind:class="{ loading: isLoading }">
                Search
            </div>
        </form>

        <br>

        <div v-show="nbContents > 0">
            <div class="ui success message">
                <div class="header">
                    Your search is successful.
                </div>
                <p>You may now create a new Daily Stand Up report by selecting an existing report as template</p>
            </div>

            <table class="ui very basic collapsing celled table">
                <thead>
                <tr>
                    <th class="nine wide">Page</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="content in contentList">
                    <td>
                        {{content.title}}
                    </td>
                    <td>
                        <button class="ui fluid mini teal submit button" @click="setDailyTemplate(content)"
                                v-bind:class="{ loading: isLoading }">Set as template
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-show="isSelectedTemplate">
            <div class="ui message">
                <div class="header">
                    The selected page template
                </div>
                <div v-html="contentTemplate" id="contentTemplate"></div>
            </div>

            <br>

            <form class="ui form" v-bind:class="{ loading: isLoading}">
                <div class="field">
                    <label>Name</label>
                    <input type="text" name="targetName" v-model="targetConfig.title" :placeholder="targetConfig.title">
                </div>
                <div class="ui teal submit button" @click="createDailyContent()"
                     v-bind:class="{ loading: isLoading }">Create
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  import Wiki from '../services/confluenceRequest.js'

  export default {
    data () {
      return {
        projectList: Wiki.projectList,
        projectSelected: Wiki.projectList[0],

        sprintList: [],
        sprintId: '',

        targetName: '',
        targetConfig: {
          title: '',
          parent: '',
          content: ''
        },

        contentList: [],
        nbContents: 0,
        isLoading: false,
        isFound: true,
        isSelectedTemplate: false,

        contentTemplate: ''
      }
    },

    created () {
      this.searchProjectSprint();
    },

    methods: {
      searchProjectSprint () {
        this.isLoading = true;
        this.nbContents = 0;
        this.isSelectedTemplate = false;
        var searchConfig = {};
        var cqlTitle = 'title ~ Sprint';
        var cqlParent = 'parent = ' + this.projectSelected.id;

        searchConfig.cql = cqlTitle + ' and ' + cqlParent;
        Wiki.searchContent(this, searchConfig).then((response) => {
          this.fetchSprintList(response.body);
          this.isLoading = false
        })
      },

      searchSprintContent () {
        this.isLoading = true;
        this.nbContents = 0;
        this.isSelectedTemplate = false;
        var searchConfig = {};
        var cqlParent = 'parent = ' + this.sprintId;

        searchConfig.cql = cqlParent;
        Wiki.searchContent(this, searchConfig).then((response) => {
          this.fetchDailyContent(response.body);
          this.isLoading = false
        })
      },

      fetchSprintList (data) {
        if (data.size == 0) {
          this.isFound = false
        } else {
          this.sprintList = data.results;
          this.sprintId = this.sprintList[0].id
        }
      },

      fetchDailyContent(data) {
        if (data.size == 0) {
          this.isFound = false;
          this.nbContents = 0;
          return
        }
        this.nbContents = data.size;
        this.contentList = data.results;
        this.isLoading = false
      },

      setDailyTemplate(templateContent) {
        this.contentTemplate = templateContent.body.storage.value;
        this.isSelectedTemplate = true;

        var todayDate = new Date();
        this.targetConfig.title = this.projectSelected.title + ' - ' + todayDate.toISOString().slice(0,10);
        this.targetConfig.parent = this.sprintId;

        var dailyTableList = document.getElementById("contentTemplate").getElementsByTagName("table");
        var _this = this;

        //Trick to let wait for the DOM to be loaded
        setTimeout(function () {
          if (dailyTableList.length != 1) {
            console.log("We did not found the daily table in your template");
            return
          }
          _this.switchDailyTable(dailyTableList[0]);
          _this.targetConfig.content = document.getElementById("contentTemplate").innerHTML;
        }, 0);
      },

      switchDailyTable(dailyTable) {
        for (var i = 1; i < dailyTable.rows.length; i++) {
          dailyTable.rows.item(i).cells.item(1).innerHTML = dailyTable.rows.item(i).cells.item(2).innerHTML;
          dailyTable.rows.item(i).cells.item(2).innerHTML = ""
        }
      },

      createDailyContent(){
        this.cleanDailyContent();
        Wiki.createContent(this, this.targetConfig).then((response) => {
          console.log("Success");
          console.log(response);
        })
      },

      cleanDailyContent() {
        var str1 = this.targetConfig.content.replace(/0.0px;">/g, "0.0px;\"/>");
        var str2 = str1.replace(/<br>/g, "<br/>")
        this.targetConfig.content = str2;
      }
    }
  }
</script>