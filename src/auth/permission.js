'use strict'

const Permission = module.exports

/**
 * acl is maping username to list endpoints that username can access
 */
const acl = {
    lab: ['GET /auth/authorization/a/:id']
}

Permission.canAccess = function (username, endpoint) {
    console.log('===>',endpoint);
    return acl[username].some(v => v === endpoint)
}