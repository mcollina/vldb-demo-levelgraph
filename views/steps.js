'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const plan = state.plan

  const selected = plan.selected
  const last = plan.last

  return html`
    <div class="monuments">
      ${selected.reverse().map(monument, { send })}
    </div>
  `
}

function monument (monument, i) {
  let removable = null

  if (i === 0) {
    removable = remove(monument, this.send)
  }

  return html`
    <div class="monument">
    <h3>${monument.name}${removable}</h3>
      <ul>
        <li><h4 class="attribute">Latitude: </h4> <h4 class="value">${monument.latitude}</h4></li>
        <li><h4 class="attribute">Longitude: </h4> <h4 class="value">${monument.longitude}</h4></li>
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
    <li><h4 class="attribute">Description: </h4> <h4 class="value">${monument.description}</h4></li>
  `
}

function remove (monument, send) {
  return html`
    <span> <a href="#" onclick=${pop} class="buttonSmall" style="display:inline-block;"> > Go Back</a></span>
  `

  function pop () {
    send('plan:popAndFetch')
  }
}
