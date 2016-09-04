'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  if (state.popup.text) {
    var lines = []
    state.popup.text.split('\n').forEach((line) => {
      lines.push(html`${line}`)
      lines.push(html`<br>`)
    })
    return html`
      <div class="popup">${lines}</div>
    `
  }

  return null
}
