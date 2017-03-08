import Auth from './auth.js'

// URL and endpoint constants
const API_URL = 'https://mathieulapeyre.atlassian.net/wiki/rest/api'
const CONTENT_SEARCH = API_URL + '/content'
const CONTENT_CREATE = API_URL + '/content'

export default {
  searchContent(context, searchConfig) {
    let searchRequest = {
      spaceKey: searchConfig.spaceKey,
      title: searchConfig.title,
      expand: "body.storage"
    }

    let options = {
      url: CONTENT_SEARCH,
      method: 'GET',
      params: searchRequest,
      headers: {
        Authorization: 'Basic ' + Auth.getAuthBasic()
      }
    }

    return context.$http(options)
  },

  createContent(context, createConfig){
    let createRequest = {
      type: "page",
      space: {
        key: "PM"
      },
      title: "Test Daily API",
      body: {
        storage: {
          value: createConfig,
          representation: "storage"
        }
      }
    }

    let options = {
      url: CONTENT_CREATE,
      method: 'POST',
      body: createRequest,
      headers: {
        Authorization: 'Basic ' + Auth.getAuthBasic()
      }
    }

    return context.$http(options)
  }
}