'use strict'

const start = require('./lib/startChoo')
const httpQueries = require('./lib/httpQueries')
start(require('./models/plan')(httpQueries), require('./models/routes')(httpQueries))
