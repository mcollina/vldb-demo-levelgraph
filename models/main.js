
module.exports = {
  namespace: 'main',
  state: {
    mode: 'planning'
  },
  reducers: {
    toPlanning: (data, state) => {
      return {
        mode: 'planning'
      }
    },
    toRoutes: (data, state) => {
      return {
        mode: 'routes'
      }
    }
  }
}
