'use strict'

const html = require('choo/html')
const header = require('./header')
const plan = require('./plan')
const steps = require('./steps')
const footer = require('./footer')

module.exports = function (state, prev, send) {
  // fetch the monuments'
  if (state.plan.monuments.length === 0) {
    console.log('FETCHING monuments')
    send('plan:fetchMonuments')
    return html`
      <div class="row">
        <main class="content">
        </main>
      </div>
    `
  }

  return html`
    <div class="row">
      <main class="content">
        <h1>Trip planning in New Delhi</h1>
        ${steps(state, prev, send)}
        ${plan(state, prev, send)}
      </main>
    </div>
  `
}
