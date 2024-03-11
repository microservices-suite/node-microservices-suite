const {Users} = require('./model')
const { APIError } = require('../../libraries/utilities/APIError')
const { catchAsync } = require('../../libraries/utilities/catchAsync')

const getUser = catchAsync(async (req,res)=>{
    const user = await Users.findById(req.params.id)
    if(!user){
        throw new APIError(404,'user not found')
    } 
    res.status(200).json({user})
})

module.exports = {
    getUser,
}