'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const plan = state.plan

  const monuments = plan.monuments || []

  return html`
    <div class="select-stop">
      Select your ${ state.plan.last ? "next" : "first" } stop:
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
    send('plan:selectWithDetails', selected)
    return false
  }
}

function monument (monument) {
  return html`
    <option value="${monument.id}">${monument.name}</option>
  `
}
