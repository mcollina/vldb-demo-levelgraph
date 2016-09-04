'use strict'

var lastTimer = null
var next = null

module.exports = function track (text) {
  if (lastTimer) {
    clearTimeout(lastTimer)
  }
  lastTimer = setTimeout(() => {
    next = ''
  }, 5000)
  next = text
}

module.exports.next = function () {
  const result = next
  next = null
  return result
}
