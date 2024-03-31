const { Users } = require('./models/user.model');

const createUser = async(data)=>{
    const user = await Users.create(data)
    return {user}
};

const getUsers = async ()=>{
    const users = await Users.find({})
    return {users}
};

const getUserById = async (id)=>{
    const user = await Users.findById(id)
    return {user}
}

module.exports = {
    createUser,
    getUsers,
    getUserById
}