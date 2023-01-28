'use strict'

const UsersRepo = module.exports

UsersRepo.create = async function ({ pg, bcrypt }, user) {
    const hash = await bcrypt.hash(user.password)
    const { rows } = await pg.query('insert into users (username, password) values ($1, $2) returning id', [user.username, hash])
    return rows[0].id
}

UsersRepo.all = async function ({ pg }) {
    const { rows } = await pg.query('select id, username from users')
    return rows
}

UsersRepo.byId = async function ({ pg }, id) {
    const { rows } = await pg.query('select id, username, password, created_at from users where id = $1', [id])
    return rows[0]
}

UsersRepo.update = async function ({ pg, bcrypt }, id, user) {
    const hash = await bcrypt.hash(user.password)
    await pg.query('update users set username=$1, password=$2 where id=$3', [user.username, hash, id])
}

UsersRepo.delete = async function ({ pg }, id) {
    const res = await pg.query('delete from users where id = $1 returning id, username', [id])
    return res.rows[0]
}
