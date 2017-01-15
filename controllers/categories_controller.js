/**
 * Created by islamhassan on 1/14/17.
 */

'use strict'

let CategoriesRepo = require('../repositories/categories_repo')

let CategoriesController = {
  createCategory: (db, category) => {
    return CategoriesRepo.createCategory(db, category)
  },
  findRootCategories: (db, isVisible) => {
    return CategoriesRepo.findRootCategories(db, isVisible)
  },
  findCategoryByIdOrSlug: (db, id) => {
    return CategoriesRepo.findCategoryByIdOrSlug(db, id)
  }
}

module.exports = CategoriesController
