
const { ObjectId } = require('mongodb');
const User  = require('../models/models');

const createUser = async ({ body }) => {
    const user = await User.create(body);
    return { user };
};

const getUsers = async () => {
    const users = await User.find({});
    return { users };
};

const getUserById = async ({ id }) => {
    const user = await User.findById(id);
    return { user };
};

const updateUserProfile = async ({ id, body }) => {
    const upserted_user = await User.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_user };
};

const deleteUser = async ({ id }) => {
    await User.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUserProfile,
    deleteUser
};
