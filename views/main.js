'use strict'

const html = require('choo/html')
const planning = require('./planning')
const routes = require('./routes')

module.exports = function (state, prev, send) {
  const toRender = state.main.mode === 'planning' ?
    planning(state, prev, send) :
    routes(state, prev, send)

  return html`
    <div>
      <div class="row">
        <a href="#" onclick=${toPlanning}>Planning</a>
        <a href="#" onclick=${toRoutes}>Possible Routes</a>
      </div>
      <div class="row">
        ${toRender}
      </div>
    </div>
  `

  function toPlanning() {
    send('main:toPlanning')
    return false
  }

  function toRoutes() {
    send('main:toRoutes')
    return false
  }
}
