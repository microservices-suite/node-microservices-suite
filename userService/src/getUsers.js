const {Users} = require('./model')
const { catchAsync } = require('./utilities/catchAsync')

const getUsers = catchAsync(async(req,res)=>{
    const user = await Users.find({})
    res.status(200).json({data:user})
})

module.exports = {
    getUsers
}