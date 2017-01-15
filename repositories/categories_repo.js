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
  findRootCategories: (db, isVisible) => {
    return new Promise((resolve, reject) => {
      let query = {
        parentCategory: null
      }

      if (typeof isVisible === 'boolean') {
        query.isVisible = isVisible
      }

      db.Categories.find(query).toArray().then((docs) => {
        if (docs.length > 0) {
          let categories = []
          for (let i = 0; i < docs.length; i++) {
            categories.push(new Category({
              id: docs[i].id,
              name: docs[i].name,
              slug: docs[i].slug,
              isVisible: docs[i].isVisible
            }))
          }
          resolve(categories)
        } else {
          resolve(docs)
        }
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
