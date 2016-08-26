'use strict'

const http = require('http')
const fs = require('fs')
const p = require('path')
const pump = require('pump')
const logger = require('pino-http')()
const serverRouter = require('server-router')
const browserify = require('browserify')
const bankai = require('bankai')
const serveStatic = require('serve-static')
const qs = require('qs')
const through = require('through2')

const db = require('level')('./db')
const levelgraph = require('levelgraph')
const levelgraphN3 = require('levelgraph-n3')

const PORT = 3000
const router = createRouter()
const server = http.createServer(handle)

const graph = levelgraphN3(levelgraph(db))

const queries = require('./lib/queries')(graph)

fs.readFile('./all_tripleList.n3', function (err, data) {
  if (err) {
    throw err
  }

  graph.n3.put(data, function (err) {
    if (err) {
      throw err
    }

    logger.logger.info('data imported')
  })
})

function createRouter () {
  const files = serveStatic(p.join(__dirname, 'static'))
  const router = serverRouter('/FILES')

  const js = bankai.js(browserify, require.resolve('./client.js'))
  router.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  const js2 = bankai.js(browserify, require.resolve('./client-indexeddb.js'), { transform: 'brfs' })
  router.on('/bundle-indexeddb.js', (req, res) => js2(req, res).pipe(res))

  router.on('/monuments', (req, res) => {
    queries.monuments((err, results) => {
      if (err) {
        res.statusCode = 500
        res.end(err.message)
        return
      }

      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(results))
    })
  })

  router.on('/monuments/:id', (req, res, params) => {
    queries.details(params.id, (err, results) => {
      if (err) {
        res.statusCode = 500
        res.end(err.message)
        return
      }

      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(results))
    })
  })

  router.on('/monuments/:id/nearby', (req, res, params) => {
    queries.nearby(params.id, (err, results) => {
      if (err) {
        res.statusCode = 500
        res.end(err.message)
        return
      }

      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(results))
    })
  })

  router.on('/FILES', (req, res) => {
    files(req, res, (err) => {
      if (err) {
        res.statusCode = 500
        res.end('something went wrong')
        return
      }

      res.statusCode = 404
      res.end('{ "message": "the server is confused" }')
    })
  })

  router.on('/plan', (req, res, params) => {
    const query = qs.parse(req.url.slice(req.url.indexOf('?') + 1))
    console.log(query)
    const stream = queries.steps(query.start, query.steps, query.end)

    res.setHeader('content-type', 'application/json')

    pump(stream, through.obj(function (chunk, enc, cb) { cb(null, JSON.stringify(chunk) + '\n') }), res)
  })

  return router
}

function handle (req, res) {
  logger(req, res)
  router(req, res)
}

server.listen(3000, (err) => {
  if (err) { throw err }

  logger.logger.info(`Server listening on port ${PORT}`)
})
