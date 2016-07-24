'use strict'

const html = require('choo/html')
const header = require('./header')
const footer = require('./footer')

module.exports = function (state, prev, send) {
  const graph = state.graph

  // fetch the monuments'
  if (state.graph.monuments.length === 0) {
    console.log('FETCHING monuments')
    send('graph:fetchMonuments')
    return html`
      <div class="row">
        <main class="content">
        </main>
      </div>
    `
  }

  const monuments = graph.monuments || []

  return html`
    <div class="row">
      <main class="content">
        <h1>Trip planning in New Delhi</h1>
          Select your first stop:
          <form>
            <select name="source">
              ${monuments.map(monument)}
            </select>
          </form>
      </main>
    </div>
  `
}

function monument (monument) {
  return html`
    <option value="${monument.id}">${monument.name}</option>
  `
}
