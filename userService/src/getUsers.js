const {catchAsync} =  require('../utils/errors.handler')
const {ObjectId} =  require('mongodb')
const services = require('../services')
const getUsers = catchAsync(async(req,res)=>{
    const id = new ObjectId(req.params.id)
    const {user} = await services.getUsers({id});
    res.status(200).json({user})
})

module.exports = {
    getUsers
}