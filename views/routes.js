
'use strict'

const html = require('choo/html')
const getSelected = require('./getSelected')
const routesCount = require('./routes-count')
const routesList = require('./routes-list')

module.exports = function (state, prev, send) {
  if (state.routes.monuments.length === 0) {
    send('routes:fetchMonuments')
    return html`
      <main class="content">
      </main>
    `
  }

  const monuments = state.routes.monuments
  var count = ''
  var list = ''

  if (state.routes.count >= 0) {
    count = routesCount(state, prev, send)
    list = routesList(state, prev, send)
  }

  return html`
    <div class="row">
      <div>
         <a href="#planning" ><button type="button" class="myButton" >Explore Around Button</button></a>
        <a href="#routes" class="disabled"><button type="button" class="myButton" >Find Routes Button</button></a>
      </div>
      <main class="content">
        <div class="select-stop">
          <form>
            Select the starting point:
            <select id="startIdSelector">
              ${monuments.map(monument)}
            </select>
            Select the number of steps:
            <select id="stepsSelector">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3" selected>3</option>
            </select>
            Select the arriving point:
            <select id="endIdSelector">
              ${monuments.map(monument)}
            </select>
            <button onclick=${act}>Calculate</button>
          </form>
        </div>
        <br>
        ${count}
        ${list}
      </main>
    </div>
  `

  function act () {
    const selected = {
      start: getSelected(document.getElementById('startIdSelector')),
      end: getSelected(document.getElementById('endIdSelector')),
      steps: getSelected(document.getElementById('stepsSelector'))
    }
    send('routes:calculate', selected)
    return false
  }
}

function monument (monument) {
  return html`
    <option value="${monument.id}">${monument.name || '..' }</option>
  `
}
