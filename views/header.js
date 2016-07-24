'use strict'

const html = require('choo/html')

function header () {
  return html`
    <header class="main-header">
      <img src="/levelgraph.png">
      <h2>LevelGraph</h2>
      <p class="description">
        is a Javascript Graph Database based
        on LevelDB and IndexedDB
      </div>
    </header>
  `
}

module.exports = header
