'use strict'


module.exports = function getSelected (elem) {
  const options = elem.getElementsByTagName('option')
  let selected = null
  for (let i = 0; i < options.length; i++) {
    let option = options[i]
    if (option.selected) {
      return option.value
    }
  }

  return null
}
