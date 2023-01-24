'use strict'

const Users = module.exports

Users.create = async function ({ pg, bcrypt }, user) {
    const hash = await bcrypt.hash(user.password)
    const { rows } = await pg.query('insert into users (username, password) values ($1, $2) returning id', [user.username, hash])
    return rows[0].id
}

Users.all = async function ({ pg }) {
    const { rows } = await pg.query('select id, username from users')
    return rows
}

Users.byId = async function ({ pg }, id) {
    const { rows } = await pg.query('select id, username, password, created_at from users where id = $1', [id])
    return rows[0]
}

Users.update = async function ({ pg, bcrypt }, id, user) {
    const hash = await bcrypt.hash(user.password)
    await pg.query('update users set username=$1, password=$2 where id=$3', [user.username, hash, id])
}

Users.delete = async function ({ pg }, id) {
    const res = await pg.query('delete from users where id = $1 returning id, username', [id])
    return res.rows[0]
}

Users.signin = async function ({ pg, jwt, bcrypt }, { username, password }) {
    const res = await pg.query('select password from users where username = $1', [username])
    const pw = res.rows[0].password
    const isSame = await bcrypt.compare(password, pw)
    if (!isSame) {
        throw new Error('wrong password')
    }
    return jwt.sign({ username })
}
