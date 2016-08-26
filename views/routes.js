
'use strict'

const html = require('choo/html')
const getSelected = require('./getSelected')
const renderResults = require('./routes-result')

module.exports = function (state, prev, send) {
  if (state.routes.monuments.length === 0) {
    send('routes:fetchMonuments')
    return html`
      <main class="content">
      </main>
    `
  }

  const monuments = state.routes.monuments
  var results = ''

  if (state.routes.count > 0) {
    results = renderResults(state, prev, send)
  }

  return html`
    <main class="content">
      <div class="select-stop">
        <form>
          Select the starting point:
          <select id="startIdSelector">
            ${monuments.map(monument)}
          </select>
          Select the number of steps:
          <select id="stepsSelector">
            ${numStep(state.routes, 1)}
            ${numStep(state.routes, 2)}
            ${numStep(state.routes, 3)}
          </select>
          Select the arriving point:
          <select id="endIdSelector">
            ${monuments.map(monument)}
          </select>
          <button onclick=${act}>Calculate</button>
        </form>
      </div>
      <hr>
      ${results}
    </main>
  `

  function act () {
    const selected = {
      start: getSelected(document.getElementById('startIdSelector')),
      end: getSelected(document.getElementById('endIdSelector')),
      steps: getSelected(document.getElementById('stepsSelector'))
    }
    send('routes:calculate', selected)
    return false
  }
}

function monument (monument) {
  return html`
    <option value="${monument.id}">${monument.name || '..' }</option>
  `
}

function numStep (routes, num) {
  if (routes.steps === num) {
    return html`
      <option value="${num}" selected>${num}</option>
    `
  }

  return html`
  <option value="${num}">${num}</option>
  `
}
