'use strict'

const html = require('choo/html')
const planning = require('./planning')
const routes = require('./routes')

module.exports = function (state, prev, send) {
  const mode = state.main.mode
  const toRender = mode === 'planning' ?
    planning(state, prev, send) :
    routes(state, prev, send)

  return html`
    <div class="row">
      <div>
        <a href="#" onclick=${toPlanning} class=${mode !== 'planning' ? '' : 'disabled' }>Planning</a>
        <a href="#" onclick=${toRoutes} class=${mode !== 'routes' ? '' : 'disabled' }>Possible Routes</a>
      </div>
      ${toRender}
    </div>
  `

  function toPlanning () {
    send('main:toPlanning')
    return false
  }

  function toRoutes () {
    send('main:toRoutes')
    return false
  }
}

function noop () {
  return false
}
