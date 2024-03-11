const mongoose = require('mongoose');
const {config} = require('../libraries/config/config');
const http =  require('http')
const {getUsers} = require('./src/services/getUsers')
const {createUser} = require('./src/services/createUser')
const {getUser} = require('./src/services/getUser')
const {errorHandler} = require('../libraries/errors/errors.handler')
const validations = require('../libraries/validations')
const {validate} = require('../libraries/utilities/validate')
const {APIError} =  require('../libraries/utilities/APIError')
const morgan = require('./src/config/morgan')
const {routes} = require('./src/routes')
// const app = require('./src/app')
const express = require('express')

mongoose.connect(`mongodb://mongodb:27017`).then(()=>{
    logger.info(`successfully connected to mongoDB: ${config.db}`);
}).catch(err=>{
  logger.error(`failed to connect to mongo. exiting...${err.message}`)
  process.exit(0)})
const app = express()
app.use(express.json())
app.get('/',(req,res)=>{
  res.json({messae:'hello from microservices_suite'})
})
const server = http.createServer(app)


server.on('error',(err)=>{
  logger.error(err)
  if(err.code === 'EADDRINUSE'){
    logger.error('Address already in use, retrying...');
    setTimeout(()=>{
      server.close();
      server.listen(config.port,'localhost')
    },1000)
    errorHandler(err)
  }  
})
server.listen(config.port,()=>{
  logger.info(`http server connected: ${config.port}`)
})
app.use(morgan.errorHandler)
app.use(morgan.successHandler)
app.use(routes)
// global error handler should come after all other middlewares
app.all('*',(req,res,next)=>{
  const err =  new APIError(404,`requested resource not found on server: ${req.originalUrl}`)
  next(err)
})
app.use(errorHandler)



