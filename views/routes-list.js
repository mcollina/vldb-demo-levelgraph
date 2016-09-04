'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const results = []
  const values = state.routes.routes.values()
  for (let val of values) {
    results.push(asPath(val, send))
  }
  return html`
    <div class="routes-list">
      ${results}
    </div>
  `
}

function asPath (path, send) {
  return html`
    <div class="path" style="cursor: pointer;" onclick=${onclick}>
      <ol>
        ${path.map(asList)}
      </ol>
    </div>
  `

  function onclick () {
    send('plan:selectPath', path)
    send('location:setLocation', { location: '/planning' })
  }
}

function asList (elem) {
  return html`
    <li class="stepPath">${elem.name.trim().replace(/^"/, '').replace(/"$/, '')}</li>
  `
}
