'use strict'

module.exports = function build (queries) {
  return {
    namespace: 'routes',
    state: {
      monuments: [],
      count: 0
    },
    reducers: {
      monumentsFromplan: (data, state) => {
        data.forEach((monument) => {
          monument.name = monument.name.replace(/"/g, '')
          monument.id = monument.id.replace('http://vldb2016.persistent.com/locations#', '')
        })

        data.sort((a, b) => {
          if (a.name > b.name) {
            return 1
          } else if (a.name < b.name) {
            return -1
          } else {
            return 0
          }
        })

        state.monuments = data

        return state
      },
      update: (data, state) => {
        state.count += data.list.length

        data.list.forEach((path) => {
          const id = path.reduce((acc, step) => {
            step.id = step.id.replace('http://vldb2016.persistent.com/locations#', '')
            return acc ^ step.id
          }, 0)

          if (!state.routes.has(id)) {
            state.routes.set(id, path)
          }
        })

        return state
      },
      reset: (data, state) => {
        return {
          monuments: state.monuments,
          steps: state.steps,
          routes: new Map(),
          count: 0
        }
      }
    },
    effects: {
      fetchMonuments: (data, state, send, done) => {
        queries.monuments(result)

        function result (err, body) {
          if (err) {
            return done(err)
          }

          send('routes:monumentsFromplan', body, done)
        }
      },
      calculate: (data, state, send, done) => {
        const stream = queries.steps(data)
        var list = []

        stream.on('end', done)
        stream.on('error', done)

        send('routes:reset', {}, update)

        function read () {
          var chunk
          while((chunk = stream.read()) !== null) {
            list.push(chunk)
          }
        }

        function update () {
          read()
          if (list.length === 0) {
            stream.once('readable', update)
          } else {
            send('routes:update', { list }, function () {
              list = []
              update()
            })
          }
        }
      }
    }
  }
}
