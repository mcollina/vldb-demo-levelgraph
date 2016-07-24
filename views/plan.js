'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const graph = state.graph

  const monuments = graph.monuments || []

  return html`
    <div>
      Select your ${ state.graph.last ? "next" : "first" } stop:
      <form>
        <select>
          ${monuments.map(monument)}
        </select>
        <button onclick=${act}>select</button>
      </form>
    </div>
  `

  function act () {
    // TODO there might be a better way
    const options = this.parentElement.getElementsByTagName('option')
    let selected = null
    for (let i = 0; i < options.length; i++) {
      let option = options[i]
      if (option.selected) {
        selected = {
          id: option.value
        }
      }
    }
    send('graph:selectWithDetails', selected)
    return false
  }
}

function monument (monument) {
  return html`
    <option value="${monument.id}">${monument.name}</option>
  `
}
