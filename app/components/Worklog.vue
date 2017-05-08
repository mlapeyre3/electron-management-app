<template>
    <div class="ui container">
        <div v-for="user in userSelected">
        </div>
        <form class="ui form">
            <h4 class="ui dividing header">Worklog selection</h4>
            <div class="field">
                <div class="two fields">
                    <div class="six wide field">
                        <label>Date Range:</label>
                        <multiselect v-model="dateRangeSelected" :options="dateRangeList" track-by="name" label="name"
                                     placeholder="Select one" :searchable="false"></multiselect>
                    </div>
                    <div class="field">
                        <label>Check worklog for:</label>
                        <multiselect v-model="userSelected" :options="userList" track-by="key" label="displayName"
                                     placeholder="Pick some" :multiple="true" :close-on-select="false"
                                     :clear-on-select="false" :hide-selected="true" :searchable="false"></multiselect>
                    </div>
                </div>
            </div>
            <div class="ui primary button" tabindex="0" @click="fetchWorklog(dateRangeSelected,userSelected)" v-bind:class="{ loading: isLoading }">
                Compute Worklog
            </div>
        </form>
        <table class="ui very basic collapsing celled table">
            <thead>
            <tr>
                <th>User</th>
                <th>WorklogTimeline</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in userSelected">
                <td>
                    {{user.displayName}}
                </td>
                <td>
                    <div v-for="worklog in user.worklogTimeline">
                        {{worklog.started}} - {{worklog.timeSpentSeconds/60/60}}
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <svg id="chart_worklog" width="960" height="500"></svg>
    </div>
</template>

<script>
  import Jira from '../services/jiraRequest.js'
  import * as d3 from "d3";
  import Multiselect from 'vue-multiselect'
  import User from '../models/User.js'
  import utils from '../services/utils.js'

  export default {
    components: {Multiselect},

    data () {
      return {
        userList: [],
        userSelected: [
            /*{
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=benoitjolly",
             "key": "benoitjolly",
             "name": "benoitjolly",
             "emailAddress": "benoit.jolly@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=benoitjolly&avatarId=13500",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=benoitjolly&avatarId=13500",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=benoitjolly&avatarId=13500",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=benoitjolly&avatarId=13500"
             },
             "displayName": "Benoit Jolly",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_US"
             },
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=brunocatrix",
             "key": "brunocatrix",
             "name": "brunocatrix",
             "emailAddress": "bruno.catrix@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=brunocatrix&avatarId=12400",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=brunocatrix&avatarId=12400",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=brunocatrix&avatarId=12400",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=brunocatrix&avatarId=12400"
             },
             "displayName": "Bruno Catrix",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_US"
             },
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=cassandrabrooks",
             "key": "cassandrabrooks",
             "name": "cassandrabrooks",
             "emailAddress": "cassandra.brooks@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&avatarId=10122",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?avatarId=10122"
             },
             "displayName": "Cassandra Brooks",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_UK"
             },
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=christiandegri",
             "key": "christiandegri",
             "name": "christiandegri",
             "emailAddress": "cdegri@sam4mobile.com",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=christiandegri&avatarId=11302",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=christiandegri&avatarId=11302",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=christiandegri&avatarId=11302",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=christiandegri&avatarId=11302"
             },
             "displayName": "Christian Degri",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_US"
             },
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=cirodecaro",
             "key": "cirodecaro",
             "name": "cirodecaro",
             "emailAddress": "ciro.decaro@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=cirodecaro&avatarId=13401",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=cirodecaro&avatarId=13401",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=cirodecaro&avatarId=13401",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=cirodecaro&avatarId=13401"
             },
             "displayName": "Ciro Decaro",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_UK"
             },
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=damienchaillou",
             "key": "damienchaillou",
             "name": "damienchaillou",
             "emailAddress": "damien.chaillou@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=damienchaillou&avatarId=13700",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=damienchaillou&avatarId=13700",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=damienchaillou&avatarId=13700",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=damienchaillou&avatarId=13700"
             },
             "displayName": "Damien Chaillou",
             "active": true,
             "timeZone": "America/Sao_Paulo",
             "locale": "en_US"
             },
             */
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=mathieulapeyre",
             "key": "mathieulapeyre",
             "name": "mathieulapeyre",
             "emailAddress": "mathieu.lapeyre@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=mathieulapeyre&avatarId=15001",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=mathieulapeyre&avatarId=15001",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=mathieulapeyre&avatarId=15001",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=mathieulapeyre&avatarId=15001"
             },
             "displayName": "Mathieu Lapeyre",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_US"
             },
            /*
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=pierreyveschristmann",
             "key": "pierreyveschristmann",
             "name": "pierreyveschristmann",
             "emailAddress": "pierre-yves.christmann@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=pierreyveschristmann&avatarId=15700",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=pierreyveschristmann&avatarId=15700",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=pierreyveschristmann&avatarId=15700",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=pierreyveschristmann&avatarId=15700"
             },
             "displayName": "pierre-yves christmann",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "fr_FR"
             },
             {
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=sereirithin",
             "key": "sereirithin",
             "name": "sereirithin",
             "emailAddress": "sin@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&avatarId=10122",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?avatarId=10122"
             },
             "displayName": "Sereirith In",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_US"
             },
             {
            "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=simongabet",
            "key": "simongabet",
            "name": "simongabet",
            "emailAddress": "simon.gabet@s4m.io",
            "avatarUrls": {
              "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
              "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&avatarId=10122",
              "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
              "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?avatarId=10122"
            },
            "displayName": "Simon Gabet",
            "active": true,
            "timeZone": "Europe/Paris",
            "locale": "en_US"
          },
            /*{
             "self": "https://mediaconnect.atlassian.net/rest/api/2/user?username=valentinmathieu",
             "key": "valentinmathieu",
             "name": "valentinmathieu",
             "emailAddress": "valentin.mathieu@s4m.io",
             "avatarUrls": {
             "16x16": "https://mediaconnect.atlassian.net/secure/useravatar?size=xsmall&ownerId=valentinmathieu&avatarId=15600",
             "24x24": "https://mediaconnect.atlassian.net/secure/useravatar?size=small&ownerId=valentinmathieu&avatarId=15600",
             "32x32": "https://mediaconnect.atlassian.net/secure/useravatar?size=medium&ownerId=valentinmathieu&avatarId=15600",
             "48x48": "https://mediaconnect.atlassian.net/secure/useravatar?ownerId=valentinmathieu&avatarId=15600"
             },
             "displayName": "valentin mathieu",
             "active": true,
             "timeZone": "Europe/Paris",
             "locale": "en_UK"
             }*/
        ],
        dateRangeList: [
          {
            "name": "yesterday",
            "value": "-1d"
          },
          {
            "name": "last 7 days",
            "value": "-7d"
          },
          {
            "name": "last 14 days",
            "value": "-14d"
          }
        ],
        dateRangeSelected: {
          "name": "last 7 days",
          "value": "-7d"
        },
        isLoading: false
      }
    },

    mounted () {
      this.fetchUser();
    },

    methods: {
      fetchUser: function (username) {
        this.isLoading = true;
        Jira.getUser(this, username).then((response) => {
          this.userList = response.body;
          this.isLoading = false;
        })
      },

      fetchWorklog: function (dateRange, worklogAuthor) {
        this.isLoading = true;
        dateRange["dates"] = utils.getDates(new Date(), null, parseFloat(dateRange.value.replace(/[^-0-9]/g, '')));
        dateRange["targetDate"] = dateRange["dates"][0];

        var worklogAuthorList = [];
        for (var i = 0; i < worklogAuthor.length; i++) {
          worklogAuthorList.push(worklogAuthor[i].key);
        }

        Jira.getWorklog(this, dateRange.value, worklogAuthorList).then((response) => {
          if (response.body.total > response.body.maxResults) {
            console.log("There are more items than maxResults");
          }

          this.fetchIssueWorklog(dateRange, worklogAuthor, response.body.issues);
          //worklogAuthor = this.sumUserWorklogTimeline(worklogAuthor,"started","timeSpentSeconds");
          //this.prepareWorklogChart(dateRange,worklogAuthor);

          this.isLoading = false;
        })
      },

      fetchIssueWorklog: function(dateRange, userList, issueList) {
        var promises = [];
        var userNameList = userList.map(function (data) {return data.key});

        for(var i=0;i<issueList.length;i++) {
          promises.push(Jira.getIssueWorklog(this, issueList[i].key).then((response) => {
            return response.body;
          }));
        }

        Promise.all(promises)
          .then((results) => {
            for(let j=0;j<results.length;j++) {
              let result = results[j];

              if (result.total > result.maxResults) {
                console.log("There are more items than maxResults");
              }

              for (let k=result.worklogs.length-1;k>=0;k--) {
                if ((new Date(result.worklogs[k].started) > new Date(dateRange.targetDate))
                  && (userNameList.some(function(data) {return data === result.worklogs[k].author.key}))) {
                  for (let m=0;m<userList.length;m++){
                    if (userList[m].key === result.worklogs[k].author.key) {
                      this.addUserWorklog(userList[m],result.worklogs[k]);
                    }
                  }
                } else {
                  result.worklogs.splice(k,1);
                }
              }
            }

            userList = this.worklogToTimeline(userList,"started","timeSpentSeconds");
            console.log(userList[0].worklogTimeline);
            this.prepareWorklogChart(dateRange,userList);
          })
          .catch((e) => {console.log("Huh, there is an error",e);});

      },

      addUserWorklog: function(user,worklog) {
        if(!user.hasOwnProperty('worklogs')){
          user["worklogs"] = [];
        }
        worklog.started = new Date(worklog.started).toDateString();
        user.worklogs.push(worklog);
      },

      worklogToTimeline: function(userList,key,value) {
        for (var i=0; i<userList.length; i++) {
          let counts = userList[i].worklogs.reduce((prev, curr) => {
            let count = prev.get(curr[key]) || 0;
            prev.set(curr[key], curr[value] + count);
            return prev;
          }, new Map());

          let reducedObjArr = [...counts].map(([started, timeSpentSeconds]) => {
            return {started, timeSpentSeconds}
          })

          userList[i]["worklogTimeline"] = reducedObjArr;
        }
        //this.$forceUpdate();
        return userList;
      },

      prepareWorklogChart: function (dateRange,userList) {

        //var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
        var parseTime = d3.timeParse("%a %b %d %Y");
/*
        var tmp = [];

        for (var i=0;i<userList.length;i++) {
          for (var k=0;k<userList[i].worklogTimeline.length;k++) {
            console.log(k);
            if (new Date(userList[i].worklogTimeline[k].started) > new Date(dateRange.dates[k])) {
              userList[i].worklogTimeline.splice(k, 0, {date: dateRange.dates[k].toDateString(), timeSpentSeconds: 0});
              tmp.push({started: dateRange.dates[k].toDateString(), timeSpentSeconds: null});
            } else {
              tmp.push(userList[i].worklogTimeline[k])
            }
          }

          userList[i].worklogTimeline = tmp.slice(0);
        }
*/
        var chartData = userList.map(function (data) {
          return {
            id: data.displayName,
            values: data.worklogTimeline.map(function (d) {
              return {
                date: parseTime(d.started),
                //date: new Date(d.started).toDateString(),
                timeSpent: d.timeSpentSeconds ? d.timeSpentSeconds/60/60 : 0
              }
            })
          }
        });

        this.drawChart(chartData);
      },

      drawChart: function (data) {
        var svg = d3.select("#chart_worklog"),
            margin = {top: 20, right: 80, bottom: 30, left: 50},
            width = svg.attr("width") - margin.left - margin.right,
            height = svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3.timeParse("%Y%m%d");

        var x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        var line = d3.line()
            //.defined(function(d) { return d.timeSpent != 0; })
            .curve(d3.curveBasis)
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return y(d.timeSpent);
            });

        x.domain([
          d3.min(data, function (d) {
            return d3.min(d.values, function (v) {
              return v.date;
            });
          }),
          d3.max(data, function (d) {
            return d3.max(d.values, function (v) {
              return v.date;
            });
          })
        ]);

        y.domain([
          d3.min(data, function (d) {
            return d3.min(d.values, function (v) {
              return v.timeSpent;
            });
          }),
          d3.max(data, function (d) {
            return d3.max(d.values, function (v) {
              return v.timeSpent;
            });
          })
        ]);

        z.domain(data.map(function (d) {
          return d.id;
        }));

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Time Spent (h)");

        var singleData = g.selectAll(".singleData")
            .data(data)
            .enter().append("g")
            .attr("class", "singleData");

        singleData.append("path")
            .attr("class", "line")
            .attr("d", function (d) {
              return line(d.values);
            })
            .style("stroke", function (d) {
              return z(d.id);
            });

/*
        singleData.selectAll("g.dot")
            .data(data)
            .enter().append("g")
            .attr("class", "dot")
            .selectAll("circle")
            .data(function(d) { return d.values; })
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.timeSpent); })
*/

        singleData.append("text")
            .datum(function (d) {
              return {id: d.id, value: d.values[d.values.length - 1]};
            })
            .attr("transform", function (d) {
              return "translate(" + x(d.value.date) + "," + y(d.value.timeSpent) + ")";
            })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function (d) {
              return d.id;
            });
      }
    }
  }
</script>


<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
    .axis--x path {
        display: none;
    }

    .line {
        fill: none;
        stroke: steelblue;
        stroke-width: 1.5px;
    }

    .dot {
        fill: none;
        stroke: steelblue;
        stroke-width: 1.5px;
    }
</style>