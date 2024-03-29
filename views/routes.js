
'use strict'

const html = require('choo/html')
const getSelected = require('./getSelected')
const routesCount = require('./routes-count')
const routesList = require('./routes-list')
const popup = require('./popup')

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
      ${popup(state, prev, send)}
      <br>
      <div>
         <a href="#planning" ><button type="button" class="myButton">Explore Places Nearby</button></a>
         <span style="display:inline-block; width: 3em;"></span>
        <a href="#routes" class="disabled"><button type="button" class="button-disable">Find Your Itinerary</button></a>
        <br><br>
      </div>
      <main class="content">
          <div id="multicolumn">
            <div id="onecolumn">
                <img src="/chain_query.png" align="left" height="120px"  border="3" style="border-color: #6495ED;">
              </div>
            <div id="onecolumn">
                <div class="select-stop">
                          <form align="left">
                            <h3 class="message" >Current Position:</h3>
                            <select id="startIdSelector" class="ciao">
                              ${monuments.map(monument)}
                            </select>
                            <br>
                            <h3 class="message" >Number of hops:</h3>
                            <select id="stepsSelector">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3" selected>3</option>
                            </select>
                             <br>
                            <h3 class="message" align="left">Destination:</h3>
                            <select id="endIdSelector">
                              ${monuments.map(monument)}
                            </select>
                            <br>
                            <span style="display:inline-block; width: 1em;"></span>
                            <button onclick=${act} align="center" class="buttonSmallLong" style="display:inline-block;">Calculate</button>
                          </form>
                        </div>
              </div>
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
