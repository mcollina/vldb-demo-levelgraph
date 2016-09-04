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
    <div class="row" >
       <br>
      <div>
        <a href="#planning" ><button type="button" class="myButton">Explore Places Nearby</button></a>
        <span style="display:inline-block; width: 3em;"></span>
        <a href="#routes" class="disabled"><button type="button" class="myButton">Find Your Itinerary</button></a>
        <br><br>
      </div>
      <main class="content">
        ${steps(state, prev, send)}
        ${plan(state, prev, send)}
      </main>
    </div>
  `
}
