'use strict'
const fp = require('fastify-plugin')

module.exports = fp(async (fastify) => {
    fastify.register(require('@fastify/jwt'), {
        secret: fastify.config.JWT_SECRET_KEY
    })
}, {
    name: 'jwt',
    dependencies: ['config']
})