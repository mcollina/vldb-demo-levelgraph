'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  send('location:setLocation', { location: '/planning' })

  return html`
    <div></div>
  `
}

function noop () {
  return false
}
