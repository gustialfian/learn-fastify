'use strict'
const S = require('fluent-json-schema')
const Savings = require('./savings.service')
const SavingsRepo = require('./savings.repo')

module.exports = async function (fastify, opts) {
    fastify.post('/create', savingsCreate.opt, savingsCreate.handler(fastify))
    fastify.post('/activate', savingsActivate.opt, savingsActivate.handler(fastify))
    fastify.post('/deposit', savingsDeposit.opt, savingsDeposit.handler(fastify))
    fastify.post('/withdraw', savingsWithdraw.opt, savingsWithdraw.handler(fastify))
    fastify.get('/:saving_id', savingsById.opt, savingsById.handler(fastify))
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
                    .prop('data', S.object()
                        .prop('id', S.string())
                        .prop('user_id', S.string())
                        .prop('balance', S.number())
                        .prop('status', S.string())
                    )
            }
        }
    },
    handler: (fastify) => async (req, reply) => {
        const { user_id, balance } = req.body

        const event = Savings.create({ user_id, balance })
        const saving = Savings.on({}, event)

        await SavingsRepo.save(fastify, saving)
        await SavingsRepo.saveEvent(fastify, event)

        return {
            message: 'ok',
            data: saving,
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
                    .prop('data', S.object()
                        .prop('id', S.string())
                        .prop('user_id', S.string())
                        .prop('balance', S.number())
                        .prop('status', S.string())
                    )
            }
        }
    },
    handler: (fastify) => async (req, reply) => {
        const { saving_id } = req.body
        const savingCur = await SavingsRepo.byId(fastify, saving_id)

        if (savingCur.status !== Savings.STATUS.APPROVAL.ACTIVATE) {
            return reply.badRequest(`status is not ${Savings.STATUS.APPROVAL.ACTIVATE}`)
        }
        const event = Savings.activate(saving_id)
        const saving = Savings.on(savingCur, event)

        await SavingsRepo.update(fastify, saving)
        await SavingsRepo.saveEvent(fastify, event)

        return {
            message: 'ok',
            data: saving,
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

const savingsById = {
    opt: {
        schema: {
            tags: ['savings'],
            params: S.object()
                .prop('saving_id', S.string()),
            response: {
                200: S.object()
                    .prop('message', S.string())
                    .prop('data', S.object()
                        .prop('id', S.string())
                        .prop('user_id', S.number())
                        .prop('balance', S.number())
                        .prop('status', S.string())
                    )
            }
        }
    },
    handler: (fastify) => async (req, reply) => {
        const { saving_id } = req.params
        
        const e = await SavingsRepo.allEvent(fastify, saving_id)
        const result = e.reduce(Savings.on, {})

        return {
            message: 'ok',
            data: result
        }
    }
}