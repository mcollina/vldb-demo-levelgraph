'use strict'

const choo = require('choo')
const mainView = require('../views/main')
const main = require('../models/main')

function start (plan, routes) {
  const app = choo({
    onError: function (err, state, createSend) {
      console.groupCollapsed(`Error: ${err.message}`)
      console.error(err)
      console.groupEnd()
    },
    onAction: function (data, state, name, caller, createSend) {
      console.groupCollapsed(`Action: ${caller} -> ${name}`)
      console.log(data)
      console.groupEnd()
    },
    onStateChange: function (data, state, prev, createSend) {
      console.groupCollapsed('State')
      console.log(prev)
      console.log(state)
      console.groupEnd()
    }
  })

  app.model(main)
  app.model(plan)
  app.model(routes)

  app.router((route) => [
    route('/', mainView)
  ])

  const tree = app.start()
  document.body.appendChild(require('../views/header')())
  document.body.appendChild(tree)
  document.body.appendChild(require('../views/footer')())
}

module.exports = start
