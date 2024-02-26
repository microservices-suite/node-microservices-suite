const Users = require('../models/model')

const createUser = async ({body})=>{
    const user = await Users.create(body)
    return {user}
}

module.exports = {
    createUser
}