const {Users} = require('./model')
const {catchAsync}=require('./errors/errors.handler')

const createUser = catchAsync(async (req,res)=>{
    const user = await Users.create(req.body)
    res.status(201).json({user})
})

module.exports = {
    createUser
}