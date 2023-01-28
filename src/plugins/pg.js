'use strict'
const fp = require('fastify-plugin')

module.exports = fp(async (fastify) => {
    fastify.register(require('@fastify/postgres'), {
        connectionString: fastify.config.DATABASE_CON
    })
}, {
    name: 'pg',
    dependencies: ['config']
})