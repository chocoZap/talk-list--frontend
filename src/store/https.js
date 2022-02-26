import axios from 'axios'

const BASEURL = process.env.VUE_APP_API_URL
console.log(BASEURL)
const actions = {
  async request({}, { method, url, data }) {
    const options = {
      method,
      url: BASEURL + url,
      data
    }
    const res = await axios(options)

    return res
  },

  async post({dispatch}, request) {
    request.method = await 'post'
    return dispatch('request', request)
  },
  async get({dispatch}, request) {
    request.method = await 'get'
    return dispatch('request', request)
  },
  async put({dispatch}, request) {
    request.method = await 'put'
    return dispatch('request', request)
  },
  async delete({dispatch}, request) {
    request.method = await 'delete'
    return dispatch('request', request)
  }
}

export default {
  namespaced: true,
  actions
}
