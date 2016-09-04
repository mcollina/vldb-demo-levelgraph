'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const results = []
  const values = state.routes.routes.values()
  for (let val of values) {
    results.push(asPath(val))
  }
  return html`
    <div class="routes-list">
      ${results}
    </div>
  `
}

function asPath (path) {
  return html`
    <div class="path">
      <ol>
        ${path.map(asList)}
      </ol>
    </div>
  `
}

function asList (elem) {
  return html`
    <li>${elem.name}</li>
  `
}
