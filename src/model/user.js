const { Schema, model, Types } = require('mongoose');
const Base = require('./base')

class User extends Base {
  constructor() {
    super()

    this.fields = {
      name: String,
      created_at: Date,
      updated_at: Date,
    }
    this.schema = new Schema(this.fields, {
      collection: 'user',
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    })
    this.model = model('user', this.schema)
  }

  find(filter, ext) {
    const query = this.genFindQuery(filter, ext)
    return Promise.all(_.map(query, item => this.queryPromisify(item))).then(data => {
      const [list, total] = data
      if (filter._id) {
        return list
      } else if (_.isString(filter.name)) {
        return list[0]
      } else {
        return {
          list,
          total,
          page: ext.page,
          size: list.length,
        }
      }
    })
  }
}

module.exports = new User()
