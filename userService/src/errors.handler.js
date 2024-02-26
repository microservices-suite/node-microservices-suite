const catchAsync = (fn) =>(req,res,next) =>{
    return Promise.resolve(fn(req,res,next)).catch((err)=>{
        next(err)
    })
}
    
const errorHandler = (err,req,res,next) => {
// TODO: create the global error handler
}

module.exports = {
    catchAsync,
    errorHandler
}