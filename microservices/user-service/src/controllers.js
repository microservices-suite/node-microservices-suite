const services = require('./services')
const { catchAsync, APIError } = require('@microservices-suite/utilities')

const createUser = catchAsync(async (req, res) => {
    const { body } = req
    const { user: data } = await services.createUser({ body })
    res.status(201).json({ data })
})
const getUsers = catchAsync(async (req, res) => {
    const { users: data } = await services.getUsers()
    res.status(200).json({ data })
})
const getUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { user: data } = await services.getUserById({ id })
    if (!data) {
        throw new APIError(404, 'user not found')
    }
    res.status(200).json({ data })
})

const updateProfile = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { user } = await services.getUserById({ id })
    if (!user) {
        throw new APIError(404, 'user not found')
    }
    const { upserted_user: data } = await services.updateUserProfile({ id, body });
    res.status(200).json({ data })
})

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateProfile
}