export const actions = {
  async store ({ dispatch }, data) {
    return await dispatch(
      'http/post',
      {
        url: '/api/reviews',
        data
      },
      {
        root: true
      }
    ).then((res) => {
      return res.status
    })
  },
}

export default {
  namespaced: true,
  actions
}
