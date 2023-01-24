'use strict'
const S = require('fluent-json-schema')
const Users = require('../../users')


module.exports = async function (fastify, opts) {
    fastify.post('', createOpt, create(fastify))
    fastify.get('', allOpt, all(fastify))
    fastify.get('/:id', byIdOpt, byId(fastify))
    fastify.put('/:id', updateOpt, update(fastify))
    fastify.delete('/:id', removeOpt, remove(fastify))
}

const createOpt = {
    schema: {
        tags: ['users'],
        body: S.object()
            .prop('username', S.string())
            .prop('password', S.string()),
        response: {
            200: S.object()
                .prop('id', S.number())
                .prop('username', S.string())
        }
    },
}
const create = (fastify) => async (req, reply) => {
    const id = await Users.create(fastify, {
        username: req.body.username,
        password: req.body.password,
    })
    return {
        id,
        username: req.body.username
    }
}

const allOpt = {
    schema: {
        tags: ['users'],
        response: {
            200: S.array().items(
                S.object()
                    .prop('id', S.number())
                    .prop('username', S.string())
            )
        }
    }
}
const all = (fastify) => async (req, reply) => {
    const data = await Users.all(fastify)
    return data
}

const byIdOpt = {
    schema: {
        tags: ['users'],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'user id'
            }
          }
        },
        response: {
            200: S.object()
                .prop('id', S.number())
                .prop('username', S.string())
                .prop('created_at', S.string())
        }
    }
}
const byId = (fastify) => async (req, reply) => {
    const data = await Users.byId(fastify, req.params.id)
    return data
}

const updateOpt = {
    schema: {
        tags: ['users'],
        body: S.object()
            .prop('username', S.string())
            .prop('password', S.string()),
        response: {
            200: S.object()
                .prop('id', S.number())
                .prop('username', S.string())

        }
    }
}
const update = (fastify) => async (req, reply) => {
    await Users.update(fastify, req.params.id, {
        username: req.body.username,
        password: req.body.password,
    })
    return {
        id: req.params.id,
        username: req.body.username
    }
}

const removeOpt = {
    schema: {
        tags: ['users'],
        response: {
            200: S.object()
                .prop('id', S.number())
                .prop('username', S.string())
        }
    }
}
const remove = (fastify) => async (req, reply) => {
    const data = await Users.delete(fastify, req.params.id)
    return data
}