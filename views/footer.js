'use strict'

const html = require('choo/html')

function footer () {
  return html`
    <footer class="main-footer">
     <h4>Copyright Matteo Collina and Antonio Maccioni, 2016 </h4>
     <span style="display:inline-block; width: 3em;"></span>
     <h4 style="color: blue;">Visit <i><a href="https://github.com/mcollina/levelgraph">https://github.com/mcollina/levelgraph</i></h4>
    </footer>
  `
}

module.exports = footer
