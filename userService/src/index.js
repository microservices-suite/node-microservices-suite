const mongoose = require('mongoose');
const {config} = require('./src/config.config');
const {logger} = require('./config/logger');
const http =  require('http')
const app = require('./src/app')

mongoose.connect(config.db).then(()=>{
    logger.info(`successfully connected to mongoDB: ${config.db}`);
}).catch((err)=>{
    throw new Error(err)
})
const server = http.createServer(app);
server.listen(config.port, ()=>{
    logger.info(`server listening on port: ${config.port}`)
})
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.error('Address in use, retrying...');
      setTimeout(() => {
        server.close();
        server.listen(config.port, '127.0.0.1');
      }, 1000);
    }
  });


