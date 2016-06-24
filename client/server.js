/*eslint no-console:0 */
'use strict'
require('core-js/fn/object/assign')
const config = require('./webpack.config')
const express = require('express')
const path = require('path')


const app = express()

app.use(express.static(path.join(__dirname, 'dist')))

app.listen(config.port)

console.log('Server running on http://localhost:'+ config.port)
