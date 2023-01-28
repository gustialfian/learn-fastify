'use strict'
const tap = require('tap')
const { Pool } = require('pg')
const Savings = require('./savings.service')
const SavingsRepo = require('./savings.repo')


tap.before(async () => {
    tap.context.pg = new Pool({
        connectionString: 'postgresql://sandbox:sandbox@localhost:5432/learn_fastify?sslmode=disable',
    })
})
tap.teardown(async () => {
    const { pg } = tap.context
    await pg.end()
})
tap.beforeEach(async () => {
    const { pg } = tap.context
    await pg.query('BEGIN')
})
tap.afterEach(async () => {
    const { pg } = tap.context
    await pg.query('ROLLBACK')
})

tap.test('saveEvent', async (t) => {
    const { pg } = tap.context
    const event = Savings.create({
        user_id: 99,
        balance: 100,
    })

    await SavingsRepo.saveEvent({ pg }, event)

    const { rows } = await pg.query('select id, type, saving_id, payload from savings_log where id=$1', [event.id])
    t.has(rows[0], event, 'data inserted')
})

tap.test('saveSnapshot', async (t) => {
    const { pg } = tap.context
    const snapshot = {
        last_id: 1,
        payload: 1,
    }

    await SavingsRepo.saveSnapshot({ pg }, snapshot)

    const { rows } = await pg.query('select * from savings_snapshot where last_id=$1', [snapshot.last_id])
    t.has(rows[0], snapshot, 'data inserted')
})

tap.test('allLogs', async (t) => {
    const { pg } = tap.context
    const e1 = Savings.create({
        user_id: 99,
        balance: 100,
    })
    await SavingsRepo.saveEvent({ pg }, e1)
    const e2 = Savings.activate(e1.saving_id)
    await SavingsRepo.saveEvent({ pg }, e2)

    const got = await SavingsRepo.allEvent({ pg }, e1.saving_id)

    t.has(got, [e1, e2])
})

tap.test('allLogs with last_id', async (t) => {
    const { pg } = tap.context
    const e1 = Savings.create({
        user_id: 99,
        balance: 100,
    })
    await SavingsRepo.saveEvent({ pg }, e1)
    const e2 = Savings.activate(e1.saving_id)
    await SavingsRepo.saveEvent({ pg }, e2)

    const got = await SavingsRepo.allEvent({ pg }, e1.saving_id, e1.id)

    t.has(got, [e2])
})

tap.test('snapshotById', async (t) => {
    const { pg } = tap.context
    const snapshot = {
        last_id: 1,
        payload: { id: 1 },
    }
    await SavingsRepo.saveSnapshot({ pg }, snapshot)

    const got = await SavingsRepo.snapshotById({ pg }, 1)

    t.has(got, snapshot)
})
