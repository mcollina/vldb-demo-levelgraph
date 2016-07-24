'use strict'

const http = require('choo/http')

module.exports = {
  namespace: 'graph',
  state: {
    monuments: []
  },
  reducers: {
    monumentsFromGraph: (data, state) => {
      data.forEach((monument) => {
        monument.name = monument.name.replace(/"/g, '')
      })
      return {
        monuments: data
      }
    }
  },
  effects: {
    fetchMonuments: (data, state, send, done) => {
      http('/monuments', { json: true }, function (err, res, body) {
        if (err) {
          return done(err)
        }

        console.log('received', body)

        send('graph:monumentsFromGraph', body, done)
      })
    }
  }
}
