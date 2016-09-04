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
    <h3>${monument.name}${removable}</h3>
      <ul>
        <li><h4>Latitude: ${monument.latitude}</h4></li>
        <li><h4>Longitude: ${monument.longitude}</h4></li>
        ${description(monument)}
      </ul>
    </div>
  `
}

function description (monument) {
  if (!monument.description) {
    return null
  }

  return html`
    <li><h4>Description: ${monument.description}</h4></li>
  `
}

function remove (monument, send) {
  return html`
    <a href="#" onclick=${pop} class="buttonSmall">>Go Back</a>

      `

  function pop () {
    send('plan:popAndFetch')
  }
}
