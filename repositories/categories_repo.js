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
  findRootCategories: (db, isVisible, getChildrenTree) => {
    return new Promise((resolve, reject) => {
      let query = {
        parentCategory: null
      }

      if (typeof isVisible === 'boolean') {
        query.isVisible = isVisible
      }

      if (getChildrenTree) {
        db.Categories.aggregate([
          {
            $match: query
          },
          {
            $graphLookup: {
              from: 'categories',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentCategory',
              as: 'children'
            }
          }
        ]).toArray().then((res) => {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              res[i] = constructTree(res[i])
            }
          }

          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      } else {
        db.Categories.find(query).toArray().then((docs) => {
          if (docs.length > 0) {
            let categories = []
            for (let i = 0; i < docs.length; i++) {
              categories.push(new Category({
                id: docs[i]._id,
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
      }
    })
  },
  findCategoryByIdOrSlug: (db, id, getChildrenTree) => {
    return new Promise((resolve, reject) => {
      if (getChildrenTree) {
        db.Categories.aggregate([
          {
            $match: {
              $or: [{_id: id}, {slug: id}]
            }
          },
          {
            $graphLookup: {
              from: 'categories',
              startWith: '$slug',
              connectFromField: 'slug',
              connectToField: 'parentCategory',
              as: 'children'
            }
          }
        ]).toArray().then((res) => {
          if (res.length > 0) {
            resolve(constructTree(res[0]))
          } else {
            resolve(res)
          }
        }).catch((err) => {
          reject(err)
        })
      } else {
        db.Categories.findOne({$or: [{_id: id}, {slug: id}]}).then((doc) => {
          if (doc) {
            let category = new Category({
              id: doc._id,
              name: doc.name,
              slug: doc.slug,
              parentCategory: doc.parentCategory,
              isVisible: doc.isVisible
            })
            resolve(category)
          } else {
            resolve()
          }
        }).catch((err) => {
          reject(err)
        })
      }
    })
  },
  setCategoryVisibility: (db, id, isVisible) => {
    return new Promise((resolve, reject) => {
      db.Categories.findOneAndUpdate(
        {$or: [{_id: id}, {slug: id}]},
        {$set: {isVisible: isVisible}},
        {returnOriginal: false}
      ).then((res) => {
        if (res.value) {
          resolve(new Category({
            id: res.value.id,
            name: res.value.name,
            slug: res.value.slug,
            parentCategory: res.value.parentCategory,
            isVisible: res.value.isVisible
          }))
        } else {
          resolve()
        }
      })
    })
  }
}

let constructTree = (category) => {
  let children = category.children
  delete category.children

  let _category = new Category({
    id: category._id,
    name: category.name,
    slug: category.slug,
    parentCategory: category.parentCategory,
    isVisible: category.isVisible
  })

  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      children[i] = new Category({
        id: children[i]._id,
        name: children[i].name,
        slug: children[i].slug,
        parentCategory: children[i].parentCategory,
        isVisible: children[i].isVisible
      })
    }

    _category.children = constructChildrenTree(_category, children)
  } else {
    _category.children = children
  }

  return _category
}

let constructChildrenTree = (parent, children) => {
  let childrenTree = []

  if (!children) {
    return childrenTree
  }

  for (let i = 0; i < children.length; i++) {
    if (children[i].parentCategory === parent.slug) {
      childrenTree.push(children[i])
    }
  }

  if (childrenTree.length === 0) {
    return childrenTree
  }

  for (let i = 0; i < childrenTree.length; i++) {
    childrenTree[i].children = constructChildrenTree(childrenTree[i], children)
  }

  return childrenTree
}

module.exports = CategoriesRepository
