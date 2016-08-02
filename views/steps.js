'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const plan = state.plan

  const selected = plan.selected
  const last = plan.last

  return html`
    <div class="monuments">
      ${selected.map(monument, { last, send })}
    </div>
  `
}

function monument (monument) {
  let removable = null

  if (!this.last || monument.id === this.last.id) {
    removable = remove(monument, this.send)
  }

  return html`
    <div class="monument">
    <h2>${monument.name}${removable}</h2>
      <ul>
        <li>Latitude: ${monument.latitude}</li>
        <li>Longitude: ${monument.longitude}</li>
      </ul>
    </div>
  `
}

function remove (monument, send) {
  return html`
    <a href="#" onclick=${pop}>(X)</a>
  `

  function pop () {
    send('plan:popAndFetch')
  }
}
