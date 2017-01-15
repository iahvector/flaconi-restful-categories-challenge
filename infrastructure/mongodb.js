/**
 * Created by islamhassan on 1/14/17.
 */

'use strict'

let mongodb = require('mongodb')
let co = require('co')

let MongoClient = mongodb.MongoClient

let initMongo = co.wrap(function*(mongourl) {
  let db = yield MongoClient.connect(mongourl)
  yield db.collection('categories').createIndex({slug: 1}, {unique: true})

  return {
    db: db,
    Categories: db.collection('categories')
  }
})

module.exports = initMongo
