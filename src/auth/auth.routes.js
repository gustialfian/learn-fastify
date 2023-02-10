'use strict'
const S = require('fluent-json-schema')
const AuthRepo = require('./auth.repo')
const Permission = require('./permission')

module.exports = async function (fastify, opts) {
    fastify.post('/sign-up', signUp.opt, signUp.handler(fastify))
    fastify.post('/sign-in', signIn.opt, signIn.handler(fastify))
    fastify.get('/authentication', authentication.opt(fastify), authentication.handler(fastify))
    fastify.get('/authorization/a/:id', authorization.opt(fastify), authorization.handler(fastify))
    fastify.get('/authorization/b/:id', authorization.opt(fastify), authorization.handler(fastify))
}

const signUp = {
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
        const access_token = await AuthRepo.singUp(fastify, {
            username: req.body.username,
            password: req.body.password,
        })
        return { access_token }
    },
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
        const access_token = await AuthRepo.signIn(fastify, {
            username: req.body.username,
            password: req.body.password,
        })
        return { access_token }
    }
}

const authentication = {
    opt: (fastify) => ({
        schema: {
            tags: ['auth'],
            response: {
                200: S.string()
            }
        },
        preHandler: async (req, reply) => {
            await req.jwtVerify().catch(err => {
                reply.send(err)
            })
        }
    }),
    handler: (fastify) => async (req, reply) => {
        return 'ok'
    }
}

const authorization = {
    opt: (fastify) => ({
        schema: {
            tags: ['auth'],
            response: {
                200: S.string()
            }
        },
        preHandler: async (req, reply) => {
            await req.jwtVerify().catch(err => {
                reply.send(err)
            })
            
            if (!Permission.canAccess(req.user.username, `${req.method} ${req.routerPath}`)) {
                reply.send('you do not have access')
            }
        }
    }),
    handler: (fastify) => async (req, reply) => {
        return 'ok'
    }
}