/**
 * Created by islamhassan on 1/15/17.
 */

'use strict'

let Category = require('../domain/category')

let CategoriesRepository = {
  createCategory: (db, cateogry) => {
    return new Promise((resolve, reject) => {
      db.Categories.insertOne({
        _id: cateogry.id,
        name: cateogry.name,
        slug: cateogry.slug,
        parentCategory: cateogry.parentCategory,
        isVisible: cateogry.isVisible
      }).then((res) => {
        let category = res.ops[0]
        resolve(new Category({
          id: category._id,
          name: category.name,
          slug: category.slug,
          parentCategory: category.parentCategory,
          isVisible: category.isVisible
        }))
      }).catch((err) => {
        reject(err)
      })
    })
  },
  findCategoryByIdOrSlug: (db, id) => {
    return new Promise((resolve, reject) => {
      db.Categories.findOne({$or: [{_id: id}, {slug: id}]}).then((doc) => {
        if (doc) {
          resolve(new Category({
            id: doc._id,
            name: doc.name,
            slug: doc.slug,
            parentCategory: doc.parentCategory,
            isVisible: doc.isVisible
          }))
        } else {
          resolve()
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

module.exports = CategoriesRepository
