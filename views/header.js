'use strict'

const html = require('choo/html')

function header () {
  return html`
    <header class="main-header">
      <img src="/levelgraph.png">
      <h2 class="title">Explore New Delhi using</h2><h2 class="system-name">LevelGraph</h2>
<span style="display:inline-block; width: 2em;"></span>
<img align="right" src="/VLDB-2016-140x140.jpeg">

      <p class="description">


      </div>
    </header>
  `
}

module.exports = header
