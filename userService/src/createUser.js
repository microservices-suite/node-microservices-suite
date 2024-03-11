const {Users} = require('./model')
const { catchAsync } = require('../../libraries/utilities/catchAsync')

const createUser = catchAsync(async (req,res)=>{
    const user = await Users.create(req.body)
    res.status(201).json({user})
})

module.exports = {
    createUser
}