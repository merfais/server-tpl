const body = require('koa-body')
const logger = require('../utils/logger').genLogger('router/api')
const {
  user,
  mock,
} = require('../controller')

class Api {
  constructor() {
    this.prefix = '/api/v1'
  }

  init(router, conf) {
    router.use(body({
      textLimit: '1mb',
      formLimit: '1mb',
      jsonLimit: '1mb',
      multipart: true,
      jsonStrict: false,
      formidable: {
        uploadDir: conf.get('tmpdir'),
        maxFieldsSize: 10 * 1024 * 1024, // 10mb
        keepExtensions: true,
      },
      onError(error) {
        logger.error('koa-body解析出现错误', error)
      }
    }))

    // user
    router.get('/user', user.get.bind(user))
    router.get('/user/:name', user.get.bind(user))
    router.post('/user', user.post.bind(user))
    router.post('/login', (ctx, next) => user.login(ctx, conf, next))

    router.get('/mock', mock.get.bind(mock))
    router.all('/', mock.all.bind(mock))

    return this
  }

}

const api = new Api()
module.exports = api
