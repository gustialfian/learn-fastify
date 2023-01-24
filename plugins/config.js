'use strict'
const fp = require('fastify-plugin')

const options = {
    schema: {
        type: 'object',
        required: ['PORT'],
        properties: {
            PORT: {
                type: 'integer',
                default: 3000
            },
            DATABASE_CON: {
                type: 'string',
                default: 'postgresql://sandbox:sandbox@localhost:5432/learn_fastify?sslmode=disable'
            },
            JWT_SECRET_KEY: {
                type: 'string',
                default: 'supersecretkey'
            },
            SWAGGER_URL:{
                type: 'string',
                default: '/docs'
            }
        }
    },
}

module.exports = fp(async (fastify) => {
    fastify.register(require('@fastify/env'), options)
}, {
    name: 'config'
})