'use strict'

const SavingsRepo = module.exports

SavingsRepo.save = async function ({ pg }, saving) {
    const sql = `INSERT INTO savings (id, user_id, balance, status) VALUES ($1, $2, $3, $4)`
    const params = [saving.id, saving.user_id, saving.balance, saving.status]
    await pg.query(sql, params)
}

SavingsRepo.update = async function ({pg}, saving) {
    const sql = `update savings set user_id=$2, balance=$3, status=$4 where id = $1`
    const params = [saving.id, saving.user_id, saving.balance, saving.status]
    await pg.query(sql, params)
}

SavingsRepo.byId = async function({pg}, saving_id) {
    const sql = `select id, user_id, balance, status from savings where id=$1 limit 1;`
    const params = [saving_id]
    const { rows } = await pg.query(sql, params)
    return rows[0]
}

SavingsRepo.saveEvent = async function ({ pg }, event) {
    const sql = `INSERT INTO savings_log (id, type, saving_id, payload) VALUES ($1, $2, $3, $4)`
    const params = [event.id, event.type, event.saving_id, event.payload]
    await pg.query(sql, params)
}

SavingsRepo.saveSnapshot = async function ({ pg }, { last_id, payload }) {
    const sql = `INSERT INTO savings_snapshot (last_id, payload) VALUES ($1, $2)`
    const params = [last_id, payload]
    await pg.query(sql, params)
}

SavingsRepo.allEvent = async function ({ pg }, saving_id, last_id) {
    const sql = `select id, type, saving_id, payload, created_at from savings_log where saving_id = $1 and id > $2`
    const params = [saving_id, last_id ?? '0']
    const { rows } = await pg.query(sql, params)
    return rows
}

SavingsRepo.snapshotById = async function ({ pg }, saving_id) {
    const sql = `select last_id, payload from savings_snapshot ss where ss.payload ->> 'id' = $1 order by last_id desc limit 1;`
    const params = [saving_id]
    const { rows } = await pg.query(sql, params)
    return rows[0]
}