'use strict'

const http = require('choo/http')
const hyperquest = require('hyperquest')
const streamHttp = require('stream-http')
const split = require('split2')
const pump = require('pump')
const qs = require('qs')

function monuments (cb, track) {
  const url = '/monuments'

  track(`GET ${url}`)
  http(url, { json: true }, function (err, res, body) {
    if (err) {
      return cb(err)
    }
    track(`GET ${url}.. done`)

    cb(null, body)
  })
}

function nearby (id, cb, track) {
  const url = `/monuments/${id}/nearby`

  track(`GET ${url}`)
  http(url, { json: true }, function (err, res, body) {
    if (err) {
      return cb(err)
    }
    track(`GET ${url}.. done`)

    cb(null, body)
  })
}

function details (id, cb, track) {
  const url = `/monuments/${id}`

  track(`GET ${url}`)
  http(url, { json: true }, function (err, res, body) {
    if (err) {
      return cb(err)
    }
    track(`GET ${url}.. done`)

    cb(null, body)
  })
}

function steps (opts, track) {
  const stream = split(JSON.parse)
  const query = qs.stringify(opts)
  const url = `${location.origin}/plan?${query}`

  track(`Streaming ${url}`)
  pump(hyperquest.get(url), stream)

  return stream
}

module.exports.monuments = monuments
module.exports.nearby = nearby
module.exports.details = details
module.exports.steps = steps
