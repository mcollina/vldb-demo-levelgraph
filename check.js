'use strict'

const memdb = require('memdb')
const levelgraph = require('levelgraph')
const levelgraphN3 = require('levelgraph-n3')
const pump = require('pump')
const fs = require('fs')

const graph = levelgraphN3(levelgraph(memdb()))

pump(fs.createReadStream('./all_tripleList.n3'), graph.n3.putStream(), (err) => {
  if (err) { throw err }


  query1(noop)
})

function all (next) {
  graph.get({}, (err, results) => {
    if (err) {
      throw err
    }

    console.log(results)
    next()
  })
}

function query1 (next) {
  graph.search([{
    subject: graph.v('id'),
    predicate: 'http://vldb2016.persistent.com/schema#name',
    object: graph.v('name'),
  }, {
    subject: graph.v('id'),
    predicate: 'http://vldb2016.persistent.com/schema#type',
    object: graph.v('type'),
  }], {}, (err, results) => {
    if (err) {
      throw err
    }

    console.log(results)
    next()
  })
}

function queryNear (next) {
  graph.search([{
    subject: graph.v('x'),
    predicate: 'name',
    object: 'Jai Praksh Yantra'
  }, {
    subject: graph.v('x'),
    predicate: 'near',
    object: graph.v('y'),
  }, {
    subject: graph.v('y'),
    predicate: 'name',
    object: graph.v('z')
  }], {}, (err, results) => {
    if (err) { throw err }
    console.log(results)
    next()
  })
}

function noop () {
}
