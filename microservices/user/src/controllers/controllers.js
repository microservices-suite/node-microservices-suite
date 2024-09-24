
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createUser = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { user: data } = await services.createUser({ body });
    res.status(201).json({ data });
});

const getUsers = asyncErrorHandler(async (req, res) => {
    const { users: data } = await services.getUsers();
    res.status(200).json({ data });
});

const getUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { user: data } = await services.getUserById({ id });
    if (!data) {
        throw new APIError(404, 'user not found');
    }
    res.status(200).json({ data });
});

const updateUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { user } = await services.getUserById({ id });
    if (!user) {
        throw new APIError(404, 'user not found');
    }
    const { upserted_user: data } = await services.updateUserProfile({ id, body });
    res.status(200).json({ data });
});

const deleteUser = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { user } = await services.getUserById({ id });
    if (!user) {
        throw new APIError(404, 'user not found');
    }
    await services.deleteUser({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};

