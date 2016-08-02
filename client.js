'use strict'

const start = require('./lib/startChoo')
start(require('./models/plan')(require('./lib/httpQueries')))
