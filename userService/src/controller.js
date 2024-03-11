const { catchAsync } = require('../../libraries/utilities/catchAsync')
const services = require('./service')

const createUser = catchAsync(async (req,res)=>{
    const {user} = await services.createUser(req.body)
    res.status(201).json({data:user})
})

const getUsers = catchAsync(async(req,res)=>{
    const {users} = await services.getUsers()
    res.status(200).json({data:users})
})

const getUser = catchAsync(async (req,res)=>{
    const {user} = await services.getUserById(req.params.id)
    if(!user){
        throw new APIError(404,'user not found')
    } 
    res.status(200).json({data:user})
})

module.exports = {
    createUser,
    getUsers,
    getUser
}