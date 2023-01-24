'use strict'
const fp = require('fastify-plugin')

module.exports = fp(async (fastify) => {
    fastify.register(require('@fastify/swagger'), {
        swagger: {
            info: {
                title: 'Test swagger',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0'
            },
        }
    })
    fastify.register(require('@fastify/swagger-ui'), {
        routePrefix: fastify.config.SWAGGER_URL,
    })
}, {
    name: 'swagger',
    dependencies: ['config']
})