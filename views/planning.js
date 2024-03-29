'use strict'

const html = require('choo/html')
const plan = require('./plan')
const steps = require('./steps')
const popup = require('./popup')

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
    <div class="row" >
      ${popup(state, prev, send)}
      <br>
      <div>
        <a href="#planning" class="disabled" ><button type="button" class="button-disable">Explore Places Nearby</button></a>
        <span style="display:inline-block; width: 3em;"></span>
        <a href="#routes" ><button type="button" class="myButton">Find Your Itinerary</button></a>
        <br><br>
      </div>
      <main class="content">

        ${plan(state, prev, send)}
        ${steps(state, prev, send)}
      </main>
    </div>
  `
}
