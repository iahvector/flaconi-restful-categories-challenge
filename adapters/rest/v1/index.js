/**
 * Created by islamhassan on 1/14/17.
 */

'use strict'

let Router = require('express').Router
let categoriesApi = require('./categories/categories_api')

let v1Api = Router()
v1Api.use(categoriesApi)

module.exports = v1Api

