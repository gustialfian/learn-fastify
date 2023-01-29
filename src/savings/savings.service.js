'use strict'

const ULID = require('ulid')

const Savings = module.exports

Savings.STATUS = {
    ACTIVE: 'ACTIVE',
    BLOCK: 'BLOCK',
    APPROVAL: {
        ACTIVATE: 'APPROVAL.ACTIVATE',
        BLOCK: 'APPROVAL.BLOCK',
    },
}
Savings.EVENT_TYPE = {
    CREATE: 'CREATE',
    ACTIVATE: 'ACTIVATE',
    DEPOSIT: 'DEPOSIT',
    WITHDRAW: 'WITHDRAW',
    BLOCK: 'BLOCK',
}

Savings.create = function (saving) {
    return {
        id: ULID.ulid(),
        type: Savings.EVENT_TYPE.CREATE,
        saving_id: ULID.ulid(),
        payload: {
            status: Savings.STATUS.APPROVAL.ACTIVATE,
            user_id: saving.user_id,
            balance: saving.balance,
        }
    }
}

Savings.activate = function (saving_id) {
    return {
        id: ULID.ulid(),
        type: Savings.EVENT_TYPE.ACTIVATE,
        saving_id: saving_id
    }
}

Savings.block = function (saving_id) {
    return {
        id: ULID.ulid(),
        type: Savings.EVENT_TYPE.BLOCK,
        saving_id: saving_id
    }
}

Savings.deposit = function (saving_id, amount) {
    return {
        id: ULID.ulid(),
        type: Savings.EVENT_TYPE.DEPOSIT,
        saving_id: saving_id,
        payload: {
            amount: amount,
        }
    }
}

Savings.withdraw = function (saving_id, amount) {
    return {
        id: ULID.ulid(),
        type: Savings.EVENT_TYPE.WITHDRAW,
        saving_id: saving_id,
        payload: {
            amount: amount,
        }
    }
}

Savings.on = function (saving, event) {
    switch (event.type) {
        case Savings.EVENT_TYPE.CREATE:
            return {
                id: event.saving_id,
                user_id: event.payload.user_id,
                balance: event.payload.balance,
                status: event.payload.status
            }

        case Savings.EVENT_TYPE.ACTIVATE:
            if (saving.id !== event.saving_id) {
                throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
            }
            if (saving.status === Savings.STATUS.ACTIVE) {
                return saving
            }
            if (saving.status !== Savings.STATUS.APPROVAL.ACTIVATE) {
                throw new Error(`saving not in ${Savings.STATUS.APPROVAL.ACTIVATE}`)
            }
            return {
                id: saving.id,
                user_id: saving.user_id,
                balance: saving.balance,
                status: Savings.STATUS.ACTIVE,
            }

        case Savings.EVENT_TYPE.BLOCK:
            if (saving.saving !== Savings.STATUS.ACTIVE) {
                throw new Error(`saving not ${Savings.STATUS.ACTIVE}`)
            }
            return {
                ...saving,
                status: Savings.STATUS.APPROVAL.BLOCK
            }

        case Savings.EVENT_TYPE.DEPOSIT:
            if (saving.id !== event.saving_id) {
                throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
            }
            return {
                ...saving,
                balance: saving.balance + event.payload.amount,
            }

        case Savings.EVENT_TYPE.WITHDRAW:
            if (saving.id !== event.saving_id) {
                throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
            }
            if (saving.balance < event.payload.amount) {
                throw new Error(`insufficient balance ${saving.balance} < ${event.payload.amount}`)
            }
            return {
                ...saving,
                balance: saving.balance - event.payload.amount,
            }

        default:
            throw new Error(`unknown event type: ${event.type}`)
    }
}