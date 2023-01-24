'use strict'

const ULID = require('ulid')

const STATUS = {
    ACTIVE: 'ACTIVE',
    BLOCK: 'BLOCK',
    APPROVAL: {
        ACTIVATE: 'APPROVAL.ACTIVATE',
    },
}
const EVENT_TYPE = {
    CREATE: 'CREATE',
    ACTIVATE: 'ACTIVATE',
    DEPOSIT: 'DEPOSIT',
    WITHDRAW: 'WITHDRAW',
}

function create(saving) {
    return {
        id: ULID.ulid(),
        type: EVENT_TYPE.CREATE,
        saving_id: ULID.ulid(),
        payload: {
            status: STATUS.APPROVAL.ACTIVATE,
            user_id: saving.user_id,
            balance: saving.balance,
        }
    }
}

function activate(saving_id) {
    return {
        id: ULID.ulid(),
        type: EVENT_TYPE.ACTIVATE,
        saving_id: saving_id
    }
}

function deposit(saving_id, amount) {
    return {
        id: ULID.ulid(),
        type: EVENT_TYPE.DEPOSIT,
        saving_id: saving_id,
        payload: {
            amount: amount,
        }
    }
}

function withdraw(saving_id, amount) {
    return {
        id: ULID.ulid(),
        type: EVENT_TYPE.WITHDRAW,
        saving_id: saving_id,
        payload: {
            amount: amount,
        }
    }
}

function on(saving, event) {
    // do side evect
    switch (event.type) {
        case EVENT_TYPE.CREATE:
            return {
                id: event.saving_id,
                user_id: event.payload.user_id,
                balance: event.payload.balance,
                status: event.payload.status
            }

        case EVENT_TYPE.ACTIVATE:
            if (saving.id !== event.saving_id) {
                throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
            }
            if (saving.status !== STATUS.APPROVAL.ACTIVATE) {
                throw new Error(`saving not in ${STATUS.APPROVAL.ACTIVATE}`)
            }
            return {
                id: saving.id,
                user_id: saving.user_id,
                balance: saving.balance,
                status: STATUS.ACTIVE,
            }

        case EVENT_TYPE.DEPOSIT:
            if (saving.id !== event.saving_id) {
                throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
            }
            return {
                ...saving,
                balance: saving.balance + event.payload.amount,
            }
        case EVENT_TYPE.WITHDRAW:
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

module.exports = {
    STATUS,
    create,
    activate,
    deposit,
    withdraw,
    on,
}