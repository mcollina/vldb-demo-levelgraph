'use strict'

const html = require('choo/html')

function footer () {
  return html`
    <footer class="main-footer">
        <a href="https://github.com/mcollina/levelgraph" target="_blank">><img src="/github.gif" align="middle" vspace="20" hspace="20" width="50" height="50"></a>
        <h4><a href="https://github.com/mcollina/levelgraph" align="middle" target="_blank">>https://github.com/mcollina/levelgraph</h4>
        <span style="display:inline-block; width: 10em;"></span>
        <h4>Copyright Matteo Collina and Antonio Maccioni, 2016 </h4>

    </footer>
  `
}

module.exports = footer
