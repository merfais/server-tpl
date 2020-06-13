const Base = require('./base')
const { CODE } = require('../constants')
const {
  user,
} = require('../model')

class UserService extends Base {
  constructor() {
    super()

    this.paramsType = {
      name: String,
      name_like: String,
      _id: {
        type: 'ObjectId',
        regExp: /^[a-fA-F0-9]{24}$/,
      }
    }
    // init最后再执行，有些逻辑是在base中写的
    this.init({
      loggerPrefix: 'service/user'
    })
  }

  get(params = {}, ext) {
    const filter = { ...params }
    if (params.name_like) {
      filter.name = { $regex: new RegExp(params.name_like, 'i') }
      delete filter.name_like
    }
    return user.find(filter, ext)
  }

  post(data) {
    return user.findOneAndCreate(data)
  }

  patch() {}

  del() {}

}

module.exports = new UserService()
