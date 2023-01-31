'use strict'
const tap = require('tap')
const SavingsService = require('./savings.service')

tap.test('SavingsService.create success', async (t) => {
    const got = SavingsService.create({
        user_id: 1,
        balance: 1,
    })

    t.ok(got.id)
    t.ok(got.saving_id)
    t.has(got, {
        type: 'CREATE',
        payload: { status: 'APPROVAL.ACTIVATE', user_id: 1, balance: 1 }
    })
})

tap.test('SavingsService.activate success', async (t) => {
    const got = SavingsService.activate(99)

    t.ok(got.id)
    t.has(got, {
        type: 'ACTIVATE',
        saving_id: 99
    })
})

tap.test('SavingsService.block success', async (t) => {
    const got = SavingsService.block(99)

    t.ok(got.id)
    t.has(got, {
        type: 'BLOCK',
        saving_id: 99
    })
})

tap.test('SavingsService.deposit success', async (t) => {
    const got = SavingsService.deposit(99, 10)

    t.ok(got.id)
    t.has(got, {
        type: 'DEPOSIT',
        saving_id: 99,
        payload: {
            amount: 10,
        }
    })
})

tap.test('SavingsService.withdraw success', async (t) => {
    const got = SavingsService.withdraw(99, 10)

    t.ok(got.id)
    t.has(got, {
        type: 'WITHDRAW',
        saving_id: 99,
        payload: {
            amount: 10,
        }
    })
})

tap.test('Savings.on unknown event', async (t) => {
    t.throws(() => SavingsService.on({}, {
        type: 'unknown-event',
    }))
})

tap.test('Savings.on create', async (t) => {
    const got = SavingsService.on({}, {
        id: 'test-id',
        type: 'CREATE',
        saving_id: 'test-sid',
        payload: {
            status: 'APPROVAL.ACTIVATE',
            user_id: 99,
            balance: 10,
        }
    })

    t.has(got, {
        id: 'test-sid',
        user_id: 99,
        balance: 10,
        status: 'APPROVAL.ACTIVATE'
    })
})

tap.test('Savings.on ACTIVATE', async (t) => {
    const s = {
        id: 'test-sid',
        user_id: 99,
        balance: 10,
        status: 'APPROVAL.ACTIVATE'
    }
    const e = {
        type: 'ACTIVATE',
        saving_id: 'test-sid'
    }
    const got = SavingsService.on(s, e)

    t.has(got, {
        id: 'test-sid',
        user_id: 99,
        balance: 10,
        status: 'ACTIVE'
    })
})

tap.test('Savings.on BLOCK', async (t) => {
    const s = {
        id: 'test-sid',
        user_id: 99,
        balance: 10,
        status: 'ACTIVE'
    }
    const e = {
        type: 'BLOCK',
        saving_id: 'test-sid'
    }
    const got = SavingsService.on(s, e)

    t.has(got, {
        id: 'test-sid',
        user_id: 99,
        balance: 10,
        status: 'APPROVAL.BLOCK'
    })
})

tap.test('Savings.on DEPOSIT', async (t) => {
    const s = {
        id: 'test-sid',
        user_id: 99,
        balance: 10,
        status: 'ACTIVE'
    }
    const e = {
        type: 'DEPOSIT',
        saving_id: 'test-sid',
        payload: {
            amount: 10,
        }
    }
    const got = SavingsService.on(s, e)

    t.has(got, {
        id: 'test-sid',
        user_id: 99,
        balance: 20,
        status: 'ACTIVE'
    })
})

tap.test('Savings.on WITHDRAW', async (t) => {
    const s = {
        id: 'test-sid',
        user_id: 99,
        balance: 10,
        status: 'ACTIVE'
    }
    const e = {
        type: 'WITHDRAW',
        saving_id: 'test-sid',
        payload: {
            amount: 5,
        }
    }
    const got = SavingsService.on(s, e)

    t.has(got, {
        id: 'test-sid',
        user_id: 99,
        balance: 5,
        status: 'ACTIVE'
    })
})