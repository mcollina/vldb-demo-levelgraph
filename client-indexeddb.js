'use strict'

const start = require('./lib/startChoo')
const db = require('level-browserify')('vldb16')
const levelgraph = require('levelgraph')
const levelgraphN3 = require('levelgraph-n3')
const graph = levelgraphN3(levelgraph(db))

const queries = require('./lib/queries')(graph)
const fs = require('fs')
const data = fs.readFileSync('./all_tripleList.n3', 'utf8')

graph.n3.put(data, (err) => {
  if (err) {
    throw err
  }
  console.log('data imported')
  start(require('./models/plan')(queries), require('./modules/routes')(queries))
})

