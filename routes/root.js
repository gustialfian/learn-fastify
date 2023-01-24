'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    console.log(fastify.config);

    const { rows } = await fastify.pg.query('select 1 + 1 as num where 2 = $1', [2])
    return { root: true, rows }
  })
}
