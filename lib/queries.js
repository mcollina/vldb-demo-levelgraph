'use strict'

function build (graph) {
  return {
    monuments,
    details,
    nearby
  }

  function monuments (cb) {
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
    }], {}, cb)
  }

  function details (id, cb) {
    graph.get({
      subject: 'http://vldb2016.persistent.com/locations#' + id
    }, {}, (err, results) => {
      if (err) {
        return cb(err)
      }

      var address;

      for (var i = 0; i < results.length; i++) {
        if (results[i].predicate === 'http://www.w3.org/ns/locn#address') {
          address = results[i].object
        }
      }

      results = results.filter((triple) => triple.predicate.indexOf('nearby') === -1)

      if (!address) {
        cb(null, results)
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
          return cb(err)
        }

        cb(null, results.concat(results2))
      })
    })
  }

  function nearby (id, cb) {
    const origin = 'http://vldb2016.persistent.com/locations#' + id
    graph.search([{
      subject: origin,
      predicate: 'http://www.geonames.org/ontology#nearby',
      object: graph.v('id'),
    }, {
      subject: graph.v('id'),
      predicate: 'http://schema.org/name',
      object: graph.v('name')
    }], {}, cb)
  }
}

module.exports = build
