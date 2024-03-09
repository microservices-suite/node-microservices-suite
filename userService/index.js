const mongoose = require('mongoose');
const config = require('./src/config/config');
const {logger} = require('./src/config/logger');
const http =  require('http')
const {getUsers} = require('./src/getUsers')
const {createUser} = require('./src/createUser')
const {getUser} = require('./src/getUser')
const {errorHandler} = require('./src/errors/errors.handler')
const validations = require('./src/validations')
const {validate} = require('./src/utilities/validate')
const {APIError} =  require('./src/utilities/APIError')
// const app = require('./src/app')
const express = require('express')

mongoose.connect(config.db).then(()=>{
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
app.get('/users',getUsers)
app.post('/users',validate(validations.createUser),createUser)
app.get('/users/:id',validate(validations.getUser),getUser)
// global error handler should come after all other middlewares
app.all('*',(req,res,next)=>{
  const err =  new APIError(404,`requested resource not found on server: ${req.originalUrl}`)
  next(err)
})
app.use(errorHandler)



