const Users = require('../models/model')

const getUsers = async ({id})=>{
    const user = await Users.find({_id:id})
    return {user}
}

module.exports = {
    getUsers,
}