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
      predicate: 'http://schema.org/name',
      object: graph.v('name'),
    }, {
      subject: graph.v('id'),
      predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      object: graph.v('type')
    }, {
      subject: graph.v('type'),
      predicate: 'http://www.w3.org/2000/01/rdf-schema#subClassOf',
      object: 'http://schema.org/TouristAttraction',
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

  router.on('/monuments/:id', (req, res, params) => {
    graph.get({
      subject: 'http://vldb2016.persistent.com/locations#' + params.id
    }, {}, (err, results) => {
      if (err) {
        res.statusCode = 500
        res.end(err.message)
        return
      }

      var address;

      for (var i = 0; i < results.length; i++) {
        if (results[i].predicate === 'http://www.w3.org/ns/locn#address') {
          address = results[i].object
        }
      }

      if (!address) {
        reply(results)
        return
      }

      graph.search([{
        subject: address,
        predicate: 'http://www.w3.org/ns/locn#geometry',
        object: graph.v('blank')
      }, {
        subject: graph.v('blank'),
        predicate: graph.v('predicate'),
        object: graph.v('object')
      }], {}, (err, results2) => {
        if (err) {
          res.statusCode = 500
          res.end(err.message)
          return
        }

        reply(results.concat(results2))
      })
    })

    function reply (results) {
      res.setHeader('content-type', 'application/json')
      results = results.filter((triple) => triple.predicate.indexOf('nearby') === -1)
      res.end(JSON.stringify(results))
    }
  })

  router.on('/monuments/:id/nearby', (req, res, params) => {
    const origin = 'http://vldb2016.persistent.com/locations#' + params.id
    graph.search([{
      subject: origin,
      predicate: 'http://www.geonames.org/ontology#nearby',
      object: graph.v('id'),
    }, {
      subject: graph.v('id'),
      predicate: 'http://schema.org/name',
      object: graph.v('name')
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
