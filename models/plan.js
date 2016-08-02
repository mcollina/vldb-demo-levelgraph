'use strict'

const queries = require('./httpQueries')

module.exports = {
  namespace: 'plan',
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
    monumentsFromplan: (data, state) => {
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
      if (data && data.id) {
        queries.nearby(data.id, result)
      } else {
        queries.monuments(result)
      }

      function result (err, body) {
        if (err) {
          return done(err)
        }

        send('plan:monumentsFromplan', body, done)
      }
    },
    selectWithDetails: (data, state, send, done) => {
      queries.details(data.id, (err, body) => {
        if (err) {
          return done(err)
        }

        const monument = body.reduce((obj, triple) => {
          const property = triple.predicate.replace(/^.*(#|\/)/,'')
          obj[property] = triple.object.replace(/^"/, '').replace(/"$/, '')
          return obj
        }, {})

        monument.id = data.id

        send('plan:select', monument, (err) => {
          if (err) {
            return done(err)
          }

          send('plan:fetchMonuments', monument, done)
        })
      })
    },
    popAndFetch: (data, state, send, done) => {
      send('plan:pop', function (err) {
        if (err) {
          return done(err)
        }

        send('plan:fetchMonuments', state.selected[state.selected.length - 2], done)
      })
    }
  }
}
