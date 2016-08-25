'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const plan = state.plan

  const monuments = plan.monuments || []

  let phrase

  if (!state.plan.last) {
    phrase = 'Select your first stop'
  } else {
    phrase = 'Select nearby attractions'
  }

  return html`
    <div class="select-stop">
      ${phrase}:
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
    <option value="${monument.id}">${monument.name || '..' }</option>
  `
}
