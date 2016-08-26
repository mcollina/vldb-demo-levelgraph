'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
    <div>
      <h2>There are ${state.routes.count} possible routes</h2>
    </div>
  `
}
