/**
 * Created by islamhassan on 1/13/17.
 */

'use strict'

let express = require('express')
let restApi = require('./adapters/rest/index')
let initMongo = require('./infrastructure/mongodb')

let PORT = process.env.PORT
let MONGO_URL = process.env.MONGO_URL

if (!PORT) {
  throw new Error('PORT environment variable is not defined')
}

if (!MONGO_URL) {
  throw new Error('MONGO_URL environment variable is not defined')
}

let app = express()

app.use((req, res, next) => {
  initMongo(MONGO_URL).then((db) => {
    req.app.db = db
    next()
  }).catch((err) => {
    console.log(err)
    throw err
  })
})

app.use('/api', restApi)

let server = app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
  server.on('close', () => {
    app.db.db.close().then(() => {
      console.log('Server closed')
    })
  })
})

module.exports = server
