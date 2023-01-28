'use strict'
const t = require('tap')
const { Pool } = require('pg')
const Savings = require('./savings.service')
const SavingsRepo = require('./savings.repo')


t.before(async () => {
    t.context.pg = new Pool({
        connectionString: 'postgresql://sandbox:sandbox@localhost:5432/learn_fastify?sslmode=disable',
    })
})
t.teardown(async () => {
    const { pg } = t.context
    await pg.end()
})
t.beforeEach(async () => {
    const { pg } = t.context
    await pg.query('BEGIN')
})
t.afterEach(async () => {
    const { pg } = t.context
    await pg.query('ROLLBACK')
})

t.test('saveEvent', async (ct) => {
    const { pg } = t.context
    const event = Savings.create({
        user_id: 99,
        balance: 100,
    })

    await SavingsRepo.saveEvent({ pg }, event)

    const { rows } = await pg.query('select id, type, saving_id, payload from savings_log where id=$1', [event.id])
    ct.has(rows[0], event, 'data inserted')
})

t.test('saveSnapshot', async (ct) => {
    const { pg } = t.context
    const snapshot = {
        last_id: 1,
        payload: 1,
    }

    await SavingsRepo.saveSnapshot({ pg }, snapshot)

    const { rows } = await pg.query('select * from savings_snapshot where last_id=$1', [snapshot.last_id])
    ct.has(rows[0], snapshot, 'data inserted')
})

t.test('allLogs', async (ct) => {
    const { pg } = t.context
    const e1 = Savings.create({
        user_id: 99,
        balance: 100,
    })
    await SavingsRepo.saveEvent({ pg }, e1)
    const e2 = Savings.activate(e1.saving_id)
    await SavingsRepo.saveEvent({ pg }, e2)

    const got = await SavingsRepo.allEvent({ pg }, e1.saving_id)

    ct.has(got, [e1, e2])
})

t.test('allLogs with last_id', async (ct) => {
    const { pg } = t.context
    const e1 = Savings.create({
        user_id: 99,
        balance: 100,
    })
    await SavingsRepo.saveEvent({ pg }, e1)
    const e2 = Savings.activate(e1.saving_id)
    await SavingsRepo.saveEvent({ pg }, e2)

    const got = await SavingsRepo.allEvent({ pg }, e1.saving_id, e1.id)

    ct.has(got, [e2])
})

t.test('snapshotById', async (ct) => {
    const { pg } = t.context
    const snapshot = {
        last_id: 1,
        payload: { id: 1 },
    }
    await SavingsRepo.saveSnapshot({ pg }, snapshot)

    const got = await SavingsRepo.snapshotById({ pg }, 1)

    ct.has(got, snapshot)
})
