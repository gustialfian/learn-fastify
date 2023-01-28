'use strict'
const tap = require('tap')
const Fastify = require('fastify')

function setup(t, { SavingsRepo }) {
    const route = t.mock('./savings.routes', {
        './savings.repo': SavingsRepo
    })
    const fastify = Fastify()
    fastify.register(route)
    t.teardown(() => fastify.close())
    return fastify
}

tap.test('POST /savings/create should ok', async (t) => {
    const fastify = setup(t, {
        SavingsRepo: {
            saveEvent: () => Promise.resolve()
        }
    })

    const res = await fastify.inject({
        method: 'POST',
        url: 'create',
        payload: {
            "user_id": 1,
            "balance": 100
        },
    })

    t.equal(res.statusCode, 200)
})

tap.test('POST /savings/create should error', async (t) => {
    const fastify = setup(t, {
        SavingsRepo: {
            saveEvent: () => Promise.reject('test error')
        }
    })

    const res = await fastify.inject({
        method: 'POST',
        url: 'create',
        payload: {
            "user_id": 1,
            "balance": 100
        },
    })

    t.equal(res.statusCode, 500)
})

tap.test('POST /savings/activate should ok', async (t) => {
    const fastify = setup(t, {
        SavingsRepo: {
            saveEvent: () => Promise.resolve()
        }
    })

    const res = await fastify.inject({
        method: 'POST',
        url: 'activate',
        payload: {
            "saving_id": 1
        },
    })

    t.equal(res.statusCode, 200)
})

tap.test('POST /savings/deposit should ok', async (t) => {
    const fastify = setup(t, {
        SavingsRepo: {
            saveEvent: () => Promise.resolve()
        }
    })

    const res = await fastify.inject({
        method: 'POST',
        url: 'deposit',
        payload: {
            "saving_id": 1,
            "amount": 10,
        },
    })

    t.equal(res.statusCode, 200)
})

tap.test('POST /savings/withdraw should ok', async (t) => {
    const fastify = setup(t, {
        SavingsRepo: {
            saveEvent: () => Promise.resolve()
        }
    })

    const res = await fastify.inject({
        method: 'POST',
        url: 'withdraw',
        payload: {
            "saving_id": 1,
            "amount": 10,
        },
    })

    t.equal(res.statusCode, 200)
})

tap.test('POST /savings/:saving_id should ok', async (t) => {
    const fastify = setup(t, {
        SavingsRepo: {
            allEvent: () => Promise.resolve([
                {
                    id: '01GQVS7Z5N3F0A30EHD6Q8DN7Z',
                    type: 'CREATE',
                    saving_id: '01GQVS7Z5NYY66BZZ309V7QKB6',
                    payload: { status: 'APPROVAL.ACTIVATE', balance: 100, user_id: '1' },
                    created_at: '2023-01-28T01:52:29.077Z',
                },
                {
                    id: '01GQVS86ZCVP9CZ7EYTH7JH8NX',
                    type: 'ACTIVATE',
                    saving_id: '01GQVS7Z5NYY66BZZ309V7QKB6',
                    payload: null,
                    created_at: '2023-01-28T01:52:37.064Z',
                },
            ])
        }
    })

    const res = await fastify.inject({
        method: 'GET',
        url: '01GQVS7Z5NYY66BZZ309V7QKB6',
    })

    t.equal(res.statusCode, 200)
    t.has(res.json(), {
        message: 'ok',
        data: {
            id: '01GQVS7Z5NYY66BZZ309V7QKB6',
            user_id: 1,
            balance: 100,
            status: 'ACTIVE'
        }
    })
})