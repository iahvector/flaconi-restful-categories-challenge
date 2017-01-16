/**
 * Created by islamhassan on 1/14/17.
 */

'use strict'

let CategoriesRepo = require('../repositories/categories_repo')

let CategoriesController = {
  createCategory: (db, category) => {
    return CategoriesRepo.createCategory(db, category)
  },
  findRootCategories: (db, isVisible, getChildrenTree) => {
    return CategoriesRepo.findRootCategories(db, isVisible, getChildrenTree)
  },
  findCategoryByIdOrSlug: (db, id, getChildrenTree) => {
    return CategoriesRepo.findCategoryByIdOrSlug(db, id, getChildrenTree)
  }
}

module.exports = CategoriesController
