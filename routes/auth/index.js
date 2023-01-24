'use strict'
const S = require('fluent-json-schema')
const Users = require('../../users')


module.exports = async function (fastify, opts) {
    fastify.post('/sign-in', signIn.opt, signIn.handler(fastify))
}

const signIn = {
    opt: {
        schema: {
            tags: ['auth'],
            body: S.object()
                .prop('username', S.string())
                .prop('password', S.string()),
            response: {
                200: S.object()
                    .prop('access_token', S.string())
            }
        },
    },
    handler: (fastify) => async (req, reply) => {
        const access_token = await Users.signin(fastify, {
            username: req.body.username,
            password: req.body.password,
        })
        return { access_token }
    }
}