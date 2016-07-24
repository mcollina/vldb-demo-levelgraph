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

const memdb = require('memdb')
const levelgraph = require('levelgraph')
const levelgraphN3 = require('levelgraph-n3')

const PORT = 3000
const router = createRouter()
const server = http.createServer(handle)

const graph = levelgraphN3(levelgraph(memdb()))

pump(fs.createReadStream('./all_tripleList.n3'), graph.n3.putStream())

function createRouter () {
  const files = serveStatic(p.join(__dirname, 'static'))
  const router = serverRouter('/FILES')

  const js = bankai.js(browserify, require.resolve('./client.js'))
  router.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  router.on('/monuments', (req, res) => {
    graph.search([{
      subject: graph.v('id'),
      predicate: 'http://vldb2016.persistent.com/schema#name',
      object: graph.v('name'),
    }, {
      subject: graph.v('id'),
      predicate: 'http://vldb2016.persistent.com/schema#type',
      object: 'http://vldb2016.persistent.com/schema#monument'
    }], {}, (err, results) => {
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
