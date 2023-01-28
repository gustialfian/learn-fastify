'use strict'

const AuthRepo = module.exports

AuthRepo.signin = async function ({ pg, jwt, bcrypt }, { username, password }) {
    const res = await pg.query('select password from users where username = $1', [username])
    const pw = res.rows[0].password
    const isSame = await bcrypt.compare(password, pw)
    if (!isSame) {
        throw new Error('wrong password')
    }
    return jwt.sign({ username })
}