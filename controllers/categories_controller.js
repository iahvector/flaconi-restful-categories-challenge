/**
 * Created by islamhassan on 1/14/17.
 */

'use strict'

let CategoriesRepo = require('../repositories/categories_repo')

let CategoriesController = {
  createCategory: (db, category) => {
    return CategoriesRepo.createCategory(db, category)
  },
  findCategoryByIdOrSlug: (db, id) => {
    return CategoriesRepo.findCategoryByIdOrSlug(db, id)
  }
}

module.exports = CategoriesController
