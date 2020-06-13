const Base = require('./base')
const {
  user,
} = require('../service')
const { CODE } = require('../constants')

class UserController extends Base {
  constructor() {
    super()
    this.init({
      loggerPrefix: 'controller/user'
    })
  }

  get(ctx) {
    const data = this.pickIfFull(ctx, [
      '_id',
      'name',
      'name_like',
    ])
    const ext = this.pickIfExist(ctx, [
      'page',
      'size',
      'sort',
      'order',
    ])
    return user.validate({ ...data, ...ext }).then(invalidMsg => {
      if (invalidMsg) {
        return this.fail(ctx, invalidMsg)
      }
      return user.get(data, ext).then(res => {
        this.success(ctx, res)
      }).catch(err => {
        this.fail(ctx, err)
      })
    })
  }

  post(ctx) {
    const data = this.pickRequiredAll(ctx, ['name'])
    if (data === false) {
      return
    }
    return user.validate(data).then(invalidMsg => {
      if (invalidMsg) {
        return this.fail(ctx, invalidMsg)
      }
      return user.post(data).then(res => {
        this.success(ctx, res)
      }).catch(err => {
        this.fail(ctx, err)
      })
    })
  }

  login(ctx, conf) {
    const superAdmin = conf.get('superAdmin', ['coffeebi'])
    return this.success(ctx, { superAdmin })
  }

}

module.exports = new UserController()
