'use strict'

function build (graph) {
  return {
    monuments,
    details,
    nearby,
    steps
  }

  function monuments (cb, track) {
    const query = [{
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
    }]

    trackSearch(track, query)

    graph.search(query, {}, cb)
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

  function nearby (id, cb, track) {
    const query = [{
      subject: asId(id),
      predicate: 'http://www.geonames.org/ontology#nearby',
      object: graph.v('id'),
    }, {
      subject: graph.v('id'),
      predicate: 'http://schema.org/name',
      object: graph.v('name')
    }]

    trackSearch(track, query)

    graph.search(query, {}, cb)
  }

  function steps (opts, track) {
    const start = asId(opts.start)
    const end = asId(opts.end)

    const query = [{
      subject: start,
      predicate: 'http://www.geonames.org/ontology#nearby',
      object: graph.v('id1'),
    }, {
      subject: graph.v('id1'),
      predicate: 'http://www.geonames.org/ontology#nearby',
      object: graph.v('id2'),
      filter: noLoop
    }, {
      subject: graph.v('id2'),
      predicate: 'http://www.geonames.org/ontology#nearby',
      object: graph.v('id3'),
      filter: noLoop
    }, {
      subject: graph.v('id3'),
      predicate: 'http://www.geonames.org/ontology#nearby',
      object: end,
      filter: noLoop
    }, {
      subject: graph.v('id1'),
      predicate: 'http://schema.org/name',
      object: graph.v('name1')
    }, {
      subject: graph.v('id2'),
      predicate: 'http://schema.org/name',
      object: graph.v('name2')
    }, {
      subject: graph.v('id3'),
      predicate: 'http://schema.org/name',
      object: graph.v('name3')
    }]

    trackSearch(track, query)

    function noLoop (tuple) {
      return tuple.id2 !== start && tuple.id2 !== end
    }

    return graph.searchStream(query, {
      filter: function (solution, cb) {
        if (solution.id1 === solution.id2 || solution.id1 === solution.id2 || solution.id2 === solution.id3 || solution.id1 === solution.id3) {
          cb(null)
        } else {
          cb(null, [{
            id: solution.id1,
            name: solution.name1
          }, {
            id: solution.id2,
            name: solution.name2
          }, {
            id: solution.id3,
            name: solution.name3
          }])
        }
      }
    })
  }
}

function asId (id) {
  return 'http://vldb2016.persistent.com/locations#' + id
}

module.exports = build

function trackSearch (track, query) {
  if (!track) {
    return
  }

  const toRender = query.map((pattern) => {
    const obj = {}
    Object.keys(pattern).forEach((key) => {
      if (pattern[key].name) {
        obj[key] = '$' + pattern[key].name
      } else {
        obj[key] = pattern[key]
      }
    })
    return obj
  })
  track(`Searching\n${JSON.stringify(toRender, null, 2)}`)
}
