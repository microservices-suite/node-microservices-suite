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

server.listen(config.port,()=>{
  logger.info(`http server connected: ${config.port}`)
})

server.on('error',(err)=>{
  if(err.code === 'EADDRINUSE'){
    logger.error('Address already in use, retrying...');
    setTimeout(()=>{
      server.close();
      server.listen(config.port,'localhost')
    },1000)
  }  
})
// app.get('/',(req,res)=>{
//   console.log('req triggered --------->')
//   res.status(200).json({message:`hello from microservice ${process.env.NODE_ENV} -- environment`})
// })
// app.listen(config.port,()=>{
//   console.log(`server listening on port: ${config.port}`)
// })
// const server = http.createServer(app);
// server.listen(config.port, ()=>{
//     logger.info(`server listening on port: ${config.port}`)
// })
// server.on('error', (e) => {
//     if (e.code === 'EADDRINUSE') {v
//       console.error('Address in use, retrying...');
//       setTimeout(() => {
//         server.close();c
//         server.listen(config.port, '127.0.0.1');
//       }, 1000);
//     }
//   });


