'use strict'

const AuthRepo = module.exports

AuthRepo.signIn = async function ({ pg, jwt, bcrypt }, { username, password }) {
    const res = await pg.query('select password from users where username = $1', [username])
    const pw = res.rows[0].password
    const isSame = await bcrypt.compare(password, pw)
    if (!isSame) {
        throw new Error('wrong password')
    }
    return jwt.sign({ username })
}

AuthRepo.singUp = async function ({ pg, jwt, bcrypt }, { username, password }) {
    const hashPassword = await bcrypt.hash(password)
    const sql = `insert into users (username, password) values ($1, $2)`
    const params = [username, hashPassword]
    await pg.query(sql, params)
    return jwt.sign({ username })
}