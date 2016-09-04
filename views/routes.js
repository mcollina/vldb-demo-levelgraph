
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
    <br>
      <div>
         <a href="#planning" ><button type="button" class="myButton">Explore Places Nearby</button></a>
         <span style="display:inline-block; width: 3em;"></span>
        <a href="#routes" class="disabled"><button type="button" class="myButton">Find Your Itinerary</button></a>
        <br><br>
      </div>
      <main class="content">
        <div class="select-stop">
          <form>
            <h3>Starting point:</h3>
            <select id="startIdSelector">
              ${monuments.map(monument)}
            </select>
            <h3>Number of hops:</h3>
            <select id="stepsSelector">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3" selected>3</option>
            </select>
            <h3>Destination:</h3>
            <select id="endIdSelector">
              ${monuments.map(monument)}
            </select>
            <button onclick=${act} class="buttonSmall">Calculate</button>
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
