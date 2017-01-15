/**
 * Created by islamhassan on 1/14/17.
 */

'use strict'

let Router = require('express').Router
let Category = require('../../../../domain/category')
let CategoriesController = require('../../../../controllers/categories_controller')

let categoriesApi = Router()

categoriesApi.post('/categories', (req, res) => {
  let body = req.body

  let c
  try {
    c = new Category({
      name: body.name,
      parentCategory: body.parentCategory,
      isVisible: body.isVisible
    })
  } catch (err) {
    res.status(400).end(err.message)
  }

  CategoriesController.createCategory(req.app.db, c).then((category) => {
    res.status(201).json(category)
  }).catch((err) => {
    if (err.message.startsWith('E11000')) {
      res.status(409).end(err.message)
    } else {
      res.status(500).end(err.message)
    }
  })
})

categoriesApi.get('/categories/:categoryId', (req, res) => {
  let id = req.params.categoryId

  CategoriesController.findCategoryByIdOrSlug(req.app.db, id).then((category) => {
    if (category) {
      res.status(200).json(category)
    } else {
      res.status(404).end()
    }
  }).catch((err) => {
    res.status(500).end(err.message)
  })
})

module.exports = categoriesApi
