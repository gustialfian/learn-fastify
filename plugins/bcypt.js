'use strict'
const fp = require('fastify-plugin')
const bcrypt = require('bcryptjs');

module.exports = fp(async (fastify, opts) => {
    const saltWorkFactor = opts.saltWorkFactor || 10

    const hash = async pwd => bcrypt.hash(pwd, saltWorkFactor)
    const compare = async (claim1, claim2) => bcrypt.compare(claim1, claim2)

    fastify.decorate('bcrypt', {
        hash,
        compare,
    })
}, {
    name: 'bcrypt',
})