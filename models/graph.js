'use strict'

const http = require('choo/http')

module.exports = {
  namespace: 'graph',
  state: {
    monuments: [],
    selected: [],
    last: null
  },
  reducers: {
    select: (data, state) => {
      state.selected.push(data)
      return {
        monuments: state.monuments,
        selected: state.selected,
        last: data
      }
    },
    pop: (data, state) => {
      state.selected.pop()
      return {
        monuments: state.monuments,
        selected: state.selected,
        last: state.selected.last
      }
    },
    monumentsFromGraph: (data, state) => {
      data.forEach((monument) => {
        monument.name = monument.name.replace(/"/g, '')
        monument.id = monument.id.replace('http://vldb2016.persistent.com/locations#', '')
      })

      return {
        monuments: data,
        selected: state.selected,
        last: state.last
      }
    }
  },
  effects: {
    fetchMonuments: (data, state, send, done) => {
      var url = '/monuments'
      if (data && data.id) {
        url += `/${data.id}/nearby`
      }

      http(url, { json: true }, function (err, res, body) {
        if (err) {
          return done(err)
        }

        send('graph:monumentsFromGraph', body, done)
      })
    },
    selectWithDetails: (data, state, send, done) => {
      var url = `/monuments/${data.id}`

      http(url, { json: true }, function (err, res, body) {
        if (err) {
          return done(err)
        }

        const monument = body.reduce((obj, triple) => {
          const property = triple.predicate.replace('http://vldb2016.persistent.com/schema#','')
          obj[property] = triple.object.replace(/^"/, '').replace(/"$/, '')
          return obj
        }, {})

        monument.id = data.id

        send('graph:select', monument, (err) => {
          if (err) {
            return done(err)
          }

          send('graph:fetchMonuments', monument, done)
        })
      })
    },
    popAndFetch: (data, state, send, done) => {
      send('graph:pop', function (err) {
        if (err) {
          return done(err)
        }

        send('graph:fetchMonuments', state.selected[state.selected.length - 2], done)
      })
    }
  }
}
