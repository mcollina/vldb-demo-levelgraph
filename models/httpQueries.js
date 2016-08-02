'use strict'

const http = require('choo/http')

function monuments (cb) {
  const url = '/monuments'

  http(url, { json: true }, function (err, res, body) {
    if (err) {
      return cb(err)
    }

    cb(null, body)
  })
}

function nearby (id, cb) {
  const url = `/monuments/${id}/nearby`

  http(url, { json: true }, function (err, res, body) {
    if (err) {
      return cb(err)
    }

    cb(null, body)
  })
}

function details (id, cb) {
  const url = `/monuments/${id}`

  http(url, { json: true }, function (err, res, body) {
    if (err) {
      return cb(err)
    }

    cb(null, body)
  })
}

module.exports.monuments = monuments
module.exports.nearby = nearby
module.exports.details = details
