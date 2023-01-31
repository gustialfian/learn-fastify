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

const actionList = {
    [Savings.EVENT_TYPE.CREATE]: (saving, event) => {
        return {
            ...saving,
            id: event.saving_id,
            user_id: event.payload.user_id,
            balance: event.payload.balance,
            status: event.payload.status
        }
    },
    [Savings.EVENT_TYPE.ACTIVATE]: (saving, event) => {
        if (saving.id !== event.saving_id) {
            throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
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
    },
    [Savings.EVENT_TYPE.BLOCK]: (saving, event) => {
        if (saving.id !== event.saving_id) {
            throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
        }
        if (saving.status !== Savings.STATUS.ACTIVE) {
            throw new Error(`saving not ${Savings.STATUS.ACTIVE}`)
        }
        return {
            ...saving,
            status: Savings.STATUS.APPROVAL.BLOCK
        }

    },
    [Savings.EVENT_TYPE.DEPOSIT]: (saving, event) => {
        if (saving.id !== event.saving_id) {
            throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
        }
        if (saving.status !== Savings.STATUS.ACTIVE) {
            throw new Error(`saving not ${Savings.STATUS.ACTIVE}`)
        }
        return {
            ...saving,
            balance: saving.balance + event.payload.amount,
        }

    },
    [Savings.EVENT_TYPE.WITHDRAW]: (saving, event) => {
        if (saving.id !== event.saving_id) {
            throw new Error(`saving id different form event ${saving.id} !== ${event.saving_id}`)
        }
        if (saving.balance < event.payload.amount) {
            throw new Error(`insufficient balance ${saving.balance} < ${event.payload.amount}`)
        }
        if (saving.status !== Savings.STATUS.ACTIVE) {
            throw new Error(`saving not ${Savings.STATUS.ACTIVE}`)
        }
        return {
            ...saving,
            balance: saving.balance - event.payload.amount,
        }
    },
}

Savings.on = function (saving, event) {
    const action = actionList[event.type]
    if (!action) {
        throw new Error(`unknown event type: ${event.type}`)
    }
    return action(saving, event)
}