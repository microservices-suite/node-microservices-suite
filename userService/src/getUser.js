const {Users} = require('./model')
const {catchAsync} = require('./errors/errors.handler')

const getUser = catchAsync(async (req,res)=>{
    const user = await Users.findById(req.params.id)
    if(!user) throw new Error('not found user')
    res.status(200).json({user}) 
})

module.exports = {
    getUser,
}