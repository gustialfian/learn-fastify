'use strict'
const S = require('fluent-json-schema')
const AuthRepo = require('./auth.repo')

module.exports = async function (fastify, opts) {
    fastify.post('/sign-in', signIn.opt, signIn.handler(fastify))
    fastify.get('/guarded', guarded.opt(fastify), guarded.handler(fastify))
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
        const access_token = await AuthRepo.signin(fastify, {
            username: req.body.username,
            password: req.body.password,
        })
        return { access_token }
    }
}

const guarded = {
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