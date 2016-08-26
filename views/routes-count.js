'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
    <h2>There are ${state.routes.count} possible routes, ${state.routes.routes.size} unique ones</h2>
  `
}
