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

categoriesApi.get('/categories', (req, res) => {
  let isVisible = req.query.isVisible
  let children = req.query.children
  if (isVisible) {
    try {
      isVisible = parseBoolean(isVisible)
    } catch (e) {
      res.status(400).end('isVisible should be either true or false')
    }
  }
  if (children) {
    try {
      children = parseBoolean(children)
    } catch (e) {
      res.status(400).end('children should be either true or false')
    }
  }

  CategoriesController.findRootCategories(req.app.db, isVisible, children).then((categories) => {
    res.status(200).json(categories)
  }).catch((err) => {
    res.status(500).end(err.message)
  })
})

categoriesApi.get('/categories/:categoryId', (req, res) => {
  let id = req.params.categoryId
  let children = req.query.children
  if (children) {
    try {
      children = parseBoolean(children)
    } catch (e) {
      res.status(400).end('children should be either true or false')
    }
  }

  CategoriesController.findCategoryByIdOrSlug(req.app.db, id, children).then((category) => {
    if (category) {
      res.status(200).json(category)
    } else {
      res.status(404).end()
    }
  }).catch((err) => {
    res.status(500).end(err.message)
  })
})

categoriesApi.patch('/categories/:categoryId/set-visibility', (req, res) => {
  let id = req.params.categoryId
  let isVisible = req.body.isVisible

  if (typeof isVisible !== 'boolean') {
    res.status(400).end('isVisible should be either true or false')
  }

  CategoriesController.setCategoryVisibility(req.app.db, id, isVisible).then((category) => {
    if (category) {
      res.status(200).json(category)
    } else {
      res.status(404).end()
    }
  }).catch((err) => {
    res.status(500).end(err.message)
  })
})

let parseBoolean = (boolString) => {
  boolString = boolString.trim()
  if (boolString === 'true') {
    return true
  } else if (boolString === 'false') {
    return false
  } else {
    throw new Error(`Cannot parse boolean from ${boolString}`)
  }
}

module.exports = categoriesApi
