'use strict'

const html = require('choo/html')

module.exports = function (state, prev, send) {
  const plan = state.plan

  const monuments = plan.monuments || []

  let phrase

  if (!state.plan.last) {
    phrase = 'Where are you now?'
  } else {
    phrase = 'Where would you like to move?'
  }

  return html`
    <div class="select-stop">
      <h3 class="message">
        <img src="/star_query.png"  width="200px"   border="3" style="border-color: #6495ED;"> ${phrase}
      </h3>
      <form>
        <select>
          ${monuments.map(monument)}
        </select>
        <button onclick=${act} class="buttonSmall">select</button>
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
