/**
 * Created by islamhassan on 1/13/17.
 */

'use strict'

let uuid = require('uuid')
let slugify = require('slugify')

class Category {
  constructor(options) {
    if (!options.hasOwnProperty('name') || typeof options.name !== 'string') {
      throw new Error('options.name must be a string')
    }

    options.name = options.name.trim()

    if (options.name.length === 0) {
      throw new Error('options.name must not be empty')
    }

    if (options.parentCategory) {
      if (typeof options.parentCategory !== 'string') {
        throw new Error('options.parentCategory must be a string or undefined')
      } else {
        options.parentCategory = options.parentCategory.trim()
      }
    }

    if (!options.hasOwnProperty('isVisible') || typeof options.isVisible !== 'boolean') {
      throw new Error('options.isVisible must be a boolean')
    }

    if (options.id) {
      if (typeof options.id !== 'string') {
        throw new Error('options.id must be a string or undefined')
      } else {
        options.id = options.id.trim()
      }
    }

    if (options.slug) {
      if (typeof options.slug !== 'string') {
        throw new Error('options.slug must be a string or undefined')
      } else {
        options.slug = options.slug.trim()
      }
    }

    if (options.children) {
      if (!(options.children instanceof Array)) {
        throw new Error('options.slug must be an array')
      }

      if (options.children.length > 0) {
        for (let i = 0; i < options.children.length; i++) {
          if (!(options.children[i] instanceof Category)) {
            throw new Error('options.children must contain only Categories')
          }
        }
      }
    }

    this.name = options.name
    this.parentCategory = options.parentCategory
    this.isVisible = options.isVisible

    if (options.id) {
      this.id = options.id
    } else {
      this.id = uuid.v4()
    }

    if (options.slug) {
      this.slug = options.slug
    } else {
      this.slug = slugify(this.name)
    }
  }
}

module.exports = Category
