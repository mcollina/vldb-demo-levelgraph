'use strict'

const html = require('choo/html')
const plan = require('./plan')
const steps = require('./steps')

module.exports = function (state, prev, send) {
  // fetch the monuments'
  if (state.plan.monuments.length === 0) {
    send('plan:fetchMonuments')
    return html`
      <main class="content">
      </main>
    `
  }

  return html`
    <div class="row">
      <div>
        <a href="#planning" class="disabled">Planning</a>
        <a href="#routes">Possible Routes</a>
      </div>
      <main class="content">
        <h1>Trip planning in New Delhi</h1>
        ${steps(state, prev, send)}
        ${plan(state, prev, send)}
      </main>
    </div>
  `
}
