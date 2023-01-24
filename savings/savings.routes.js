'use strict'
const S = require('fluent-json-schema')
const Savings = require('./savings.service')
const SavingsRepo = require('./savings.repo')

module.exports = async function (fastify, opts) {
    fastify.post('/create', savingsCreate.opt, savingsCreate.handler(fastify))
    fastify.post('/activate', savingsActivate.opt, savingsActivate.handler(fastify))
    fastify.post('/deposit', savingsDeposit.opt, savingsDeposit.handler(fastify))
    fastify.post('/withdraw', savingsWithdraw.opt, savingsWithdraw.handler(fastify))
    
}

const savingsCreate = {
    opt: {
        schema: {
            tags: ['savings'],
            body: S.object()
                .prop('user_id', S.string()).required()
                .prop('balance', S.number()).required(),
            response: {
                200: S.object()
                    .prop('message', S.string())
                    .prop('data', S.object())
            }
        }
    },
    handler: (fastify) => async (req, reply) => {
        const { user_id, balance } = req.body
        const event = Savings.create({ user_id, balance })
        await SavingsRepo.saveEvent(fastify, event)

        return {
            message: 'ok',
            data: {},
        }
    },
}

const savingsActivate = {
    opt: {
        schema: {
            tags: ['savings'],
            body: S.object()
                .prop('saving_id', S.string()).required(),
            response: {
                200: S.object()
                    .prop('message', S.string())
                    .prop('data', S.object())
            }
        }
    },
    handler: (fastify) => async (req, reply) => {
        const { saving_id } = req.body
        const event = Savings.activate(saving_id)
        await SavingsRepo.saveEvent(fastify, event)

        return {
            message: 'ok',
            data: {},
        }
    },
}

const savingsDeposit = {
    opt: {
        schema: {
            tags: ['savings'],
            body: S.object()
            .prop('saving_id', S.string()).required()
            .prop('amount', S.number()).required(),
            response: {
                200: S.object()
                    .prop('message', S.string())
                    .prop('data', S.object())
            }
        }
    },
    handler: (fastify) => async (req, reply) => {
        const { saving_id, amount } = req.body
        const event = Savings.deposit(saving_id, amount)
        await SavingsRepo.saveEvent(fastify, event)

        return {
            message: 'ok',
            data: {},
        }
    },
}

const savingsWithdraw = {
    opt: {
        schema: {
            tags: ['savings'],
            body: S.object()
            .prop('saving_id', S.string()).required()
            .prop('amount', S.number()).required(),
            response: {
                200: S.object()
                    .prop('message', S.string())
                    .prop('data', S.object())
            }
        }
    },
    handler: (fastify) => async (req, reply) => {
        const { saving_id, amount } = req.body
        const event = Savings.withdraw(saving_id, amount)
        await SavingsRepo.saveEvent(fastify, event)

        return {
            message: 'ok',
            data: {},
        }
    },
}