const catchAsync = (fn) =>(req,res,next) =>{
    return Promise.resolve(fn(req,res,next)).catch((err)=>{
        next(err)
    })
}
    
const errorHandler = (err,req,res,next) => {
// TODO: create the global error handler
let message;
let statutsCode;
    switch(err.code){
        case 11000:
        message = `A user with existing email exists: ${req.body.email}`
        statutsCode = 400
    }
    console.log(err)
    res.status(statutsCode).json({error:message})
}

module.exports = {
    catchAsync,
    errorHandler
}