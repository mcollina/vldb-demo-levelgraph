'use strict'

const http = require('choo/http')
const hyperquest = require('hyperquest')
const streamHttp = require('stream-http')
const split = require('split2')
const pump = require('pump')
const qs = require('qs')

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

function steps (opts) {
  const stream = split(JSON.parse)
  const query = qs.stringify(opts)

  console.log('query', query)
  console.log(location.origin)

  pump(hyperquest.get(`${location.origin}/plan?${query}`),
       stream)

  return stream
}

module.exports.monuments = monuments
module.exports.nearby = nearby
module.exports.details = details
module.exports.steps = steps
