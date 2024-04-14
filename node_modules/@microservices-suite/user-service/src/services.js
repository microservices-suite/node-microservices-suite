const { Users } = require('./models/user.model');

const createUser = async ({ body }) => {
    const user = await Users.create(body)
    return { user }
};

const getUsers = async () => {
    const users = await Users.find({})
    return { users }
};

const getUserById = async ({ id }) => {
    const user = await Users.findById(id)
    return { user }
}

const updateUserProfile = async ({ id, body }) => {
    const upserted_user = await Users.updateOne({ _id: Object(id) }, { ...body }, { upsert: false })
    return { upserted_user }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUserProfile
}