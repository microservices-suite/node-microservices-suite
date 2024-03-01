const mongoose = require('mongoose');
const config = require('./src/config/config');
const {logger} = require('./src/config/logger');
const http =  require('http')
// const app = require('./src/app')
const express = require('express')

mongoose.connect(config.db).then(()=>{
    logger.info(`successfully connected to mongoDB: ${config.db}`);
}).catch(err=>{
  logger.error(`failed to connect to mongo. exiting...${err.message}`)
  process.exit(0)})
const app = express()
app.get('/',(req,res)=>{
  res.json({messae:'hello from microservices_suite'})
})
const server = http.createServer(app)


server.on('error',(err)=>{
  if(err.code === 'EADDRINUSE'){
    logger.error('Address already in use, retrying...');
    setTimeout(()=>{
      server.close();
      server.listen(config.port,'localhost')
    },1000)
  }  
})
server.listen(config.port,()=>{
  logger.info(`http server connected: ${config.port}`)
})
app.get('/users',(req,res)=>{
  res.status(200).json({message:`hello from microservice ${process.env.NODE_ENV} -- environment`})
})



