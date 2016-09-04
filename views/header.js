'use strict'

const html = require('choo/html')

function header () {
  return html`
    <header class="main-header">
      <img src="/levelgraph.png" >
      <h2 class="title">Explore New Delhi using</h2><h2 class="system-name" align="middle">LevelGraph</h2>
       <img style="vertical-align: baseline;"  src="/VLDB-2016-140x140.jpeg">

      <p class="description">


      </div>
    </header>
  `
}

module.exports = header
