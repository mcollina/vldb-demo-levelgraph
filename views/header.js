'use strict'

const html = require('choo/html')

function header () {
  return html`

    <header class="main-header">
        <img src="/levelgraph.png"  width="175px" height="100px" align="left" style="padding-right: 5em; ">
        <h2 class="title" style="vertical-align:baseline">Explore New Delhi using</h2><h2 class="system-name" align="middle">LevelGraph</h2>
        <img src="/VLDB-2016-140x140.jpeg" align="right" width="100px" height="100px" style="padding-left: 6em;" >

      <p class="description">


      </div>
    </header>
  `
}

module.exports = header
