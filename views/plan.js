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
      <div id="multicolumn">
          <div id="onecolumn">
            <img src="/star_query.png"  height="115px"   border="3" style="border-color: #6495ED;">
          </div>
          <div id="onecolumn">
                <h3 class="message" align="left">
                    ${phrase}
                </h3>
                <br>
               <form align="left">
                   <select>
                     ${monuments.map(monument)}
                   </select>
                    <br>
                    <span style="display:inline-block; width: 1em;"></span>
                   <button onclick=${act} class="buttonSmallLong">Select</button>
               </form>
          </div>
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
