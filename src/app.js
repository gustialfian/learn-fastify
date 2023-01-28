'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(require('./auth/auth.routes'), { prefix: '/auth' })
  fastify.register(require('./users/users.routes'), { prefix: '/users' })
  fastify.register(require('./savings/savings.routes'), { prefix: '/savings' })
}
