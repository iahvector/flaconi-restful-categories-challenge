/**
 * Created by islamhassan on 1/13/17.
 */

'use strict'

let chai = require('chai')
let superagent = require('superagent')
let Category = require('../domain/category')
let initdDB = require('../infrastructure/mongodb')

let expect = chai.expect

let validateCategory = (category, hasParent) => {
  expect(category).to.be.an('object')
  expect(category.name).to.be.a('String')
  if (hasParent) {
    expect(category.parentCategory).to.be.a('String')
  }
  expect(category.isVisible).to.be.a('Boolean')
  expect(category.id).to.be.a('String')
  expect(category.slug).to.be.a('String')
}

describe('Categories', () => {
  describe('Domain object', () => {
    it('Should return a new category object with all properties filled', () => {
      let c = new Category({
        name: 'New category',
        parentCategory: 'parent-id',
        isVisible: true
      })

      validateCategory(c, true)
    })

    it('Should throw an error if a required property is missing or of a wrong type', () => {
      expect(() => {
        let c = new Category()
      }).to.throw(Error)

      expect(() => {
        let c = new Category({})
      }).to.throw(Error)

      expect(() => {
        let c = new Category({
          name: 123,
          parentCategory: 'parent-id',
          isVisible: true
        })
      }).to.throw(Error)

      expect(() => {
        let c = new Category({
          name: 'new category',
          parentCategory: 123,
          isVisible: true
        })
      }).to.throw(Error)

      expect(() => {
        let c = new Category({
          name: 'new category',
          isVisible: 'true'
        })
      }).to.throw(Error)
    })
  })

  describe('Categories REST API', () => {
    let app
    let db

    before((done) => {
      let MONGO_URL = process.env.MONGO_URL
      initdDB(MONGO_URL).then((_db) => {
        db = _db
        db.db.dropDatabase().then(() => {
          done()
        })
      })

      app = require('../app')
    })

    after((done) => {
      db.db.dropDatabase().then(() => {
        app.close()
        done()
      })
    })

    describe('Create category', () => {
      it('Should create a category and return the newly created object', (done) => {
        superagent.post('http://localhost:3000/api/v1/categories').send({
          name: 'new category 1',
          parentCategory: 'parent-id',
          isVisible: true
        }).end((err, res) => {
          expect(err).to.not.exist
          expect(res.status).to.equal(201)
          validateCategory(res.body, true)
          done()
        })
      })

      it('Should return error 400 when a required parameter is missing', (done) => {
        superagent.post('http://localhost:3000/api/v1/categories').send({
          name: 'new category 2',
          parentCategory: 'parent-id'
        }).end((err, res) => {
          expect(err).to.exist
          expect(res.status).to.equal(400)
          done()
        })
      })

      it('Should return error 409 when trying to create a category that already exists', (done) => {
        superagent.post('http://localhost:3000/api/v1/categories').send({
          name: 'new category 1',
          parentCategory: 'parent-id',
          isVisible: true
        }).end((err, res) => {
          expect(err).to.exist
          expect(res.status).to.equal(409)
          done()
        })
      })
    })

    describe('Find category by id or slug', () => {
      let cat2Id
      let cat2Slug

      before((done) => {
        superagent.post('http://localhost:3000/api/v1/categories').send({
          name: 'new category 2',
          isVisible: true
        }).end((err, res) => {
          cat2Id = res.body.id
          cat2Slug = res.body.slug
          done()
        })
      })

      it('Should return the category associated with an id', (done) => {
        superagent.get(`http://localhost:3000/api/v1/categories/${cat2Id}`).end((err, res) => {
          expect(err).to.not.exist
          expect(res.status).to.equal(200)
          validateCategory(res.body)
          expect(res.body.id).to.equal(cat2Id)
          done()
        })
      })

      it('Should return the category associated with a slug', (done) => {
        superagent.get(`http://localhost:3000/api/v1/categories/${cat2Slug}`).end((err, res) => {
          expect(err).to.not.exist
          expect(res.status).to.equal(200)
          validateCategory(res.body)
          expect(res.body.slug).to.equal(cat2Slug)
          done()
        })
      })

      it('Should return error 404 when the id or slug does not exist in the db', (done) => {
        superagent.get('http://localhost:3000/api/v1/categories/not-exist').end((err, res) => {
          expect(err).to.exist
          expect(res.status).to.equal(404)
          done()
        })
      })
    })
  })
})