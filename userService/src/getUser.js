const {Users} = require('./model')
const { APIError } = require('./utilities/APIError')
const { catchAsync } = require('./utilities/catchAsync')

const getUser = catchAsync(async (req,res,next)=>{
    const user = await Users.findById(req.params.id)
    if(!user){
        const err = new APIError(404,'user not found')
        next(err)
    } 
    res.status(200).json({user})
    next()
})

module.exports = {
    getUser,
}