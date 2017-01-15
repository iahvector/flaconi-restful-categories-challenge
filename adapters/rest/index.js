/**
 * Created by islamhassan on 1/14/17.
 */

'use strict'

let Router = require('express').Router
var bodyParser = require('body-parser')
let v1Api = require('./v1/index')

let restApi = Router()

// Add middleware to parse the POST data of the body
restApi.use(bodyParser.urlencoded({extended: true}))

// Add middleware to parse application/json
restApi.use(bodyParser.json())

restApi.use('/v1', v1Api)

module.exports = restApi
