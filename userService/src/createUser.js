const {Users} = require('./model')
const { catchAsync } = require('./utilities/catchAsync')

const createUser = catchAsync(async (req,res)=>{
    const user = await Users.create(req.body)
    res.status(201).json({user})
})

module.exports = {
    createUser
}