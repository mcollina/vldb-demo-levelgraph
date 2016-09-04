'use strict'

const track = require('./track')

module.exports =  {
  namespace: 'popup',
  state: {
    text: ''
  },
  subscriptions: [
    function fromQueries (send) {
      setInterval(function () {
        const next = track.next()
        if (next !== null) {
          send('popup:set', next, noop)
        }
      }, 200)
    }
  ],
  reducers: {
    set: (text, state) => {
      return { text }
    }
  }
}

function noop () {}
