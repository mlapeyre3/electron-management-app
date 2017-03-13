import Auth from './auth.js'

// URL and endpoint constants
//const API_URL = 'https://mathieulapeyre.atlassian.net/wiki/rest/api';
const API_URL = 'https://mediaconnect.atlassian.net/wiki/rest/api';
const CONTENT_CREATE = API_URL + '/content';
const CONTENT_SEARCH = API_URL + '/content/search';

export default {
  // Parameters
  /*
  projectList: [
    {
      title: 'FUSIO',
      id: '461003'
    },
    {
      title: 'DPS',
      id: '461083'
    }
  ],
  */
  projectList: [
    {
      title: 'FUSIO',
      id: '123568187'
    },
    {
      title: 'DPS',
      id: '116817936'
    },
    {
      title: 'SDK',
      id: '117309757'
    },
    {
      title: 'SSP',
      id: '155730716'
    }
  ],

  searchContent(context, searchConfig) {
    let searchRequest = {
      cql: searchConfig.cql + ' order by created desc',
      expand: "body.storage"
    };

    let options = {
      url: CONTENT_SEARCH,
      method: 'GET',
      params: searchRequest,
      headers: {
        Authorization: 'Basic ' + Auth.getAuthBasic()
      }
    };

    return context.$http(options)
  },

  createContent(context, createConfig){
    let createRequest = {
      type: "page",
      space: {
        key: "SSM"
      },
      title: createConfig.title,
      ancestors: [{"id":createConfig.parent}],
      body: {
        storage: {
          value: createConfig.content,
          representation: "storage"
        }
      }
    };

    let options = {
      url: CONTENT_CREATE,
      method: 'POST',
      body: createRequest,
      headers: {
        Authorization: 'Basic ' + Auth.getAuthBasic()
      }
    };

    return context.$http(options)
  }
}