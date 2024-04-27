const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const { config, morgan, logger } = require('@microservices-suite/config');
const { errorHandler } = require('@microservices-suite/errors');
const { getUserValidation, createUserValidation } = require('@microservices-suite/validations');
const { validate, APIError } = require('@microservices-suite/utilities');
const { getUsers, createUser, getUser } = require('./src/services');
const { router } = require('./src/routes');
// const app = require('./src/app');

mongoose.connect(config.db).then(() => {
  logger.info(`successfully connected to db: ${config.db}`);
}).catch(err => {
  logger.error(`failed to connect to db. exiting...${err.message}`);
  process.exit(0);
});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ messae: 'hello from @microservices-suite/user-service' });
});

const server = http.createServer(app);

server.on('error', (err) => {
  logger.error(err);
  if (err.code === 'EADDRINUSE') {
    logger.error('Address already in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(config.port, 'localhost');
    }, 1000);
    errorHandler(err);
  }
})

server.listen(config.port, () => {
  logger.info(`http server connected: ${config.port}`);
});

app.use(morgan.errorHandler);

app.use(morgan.successHandler);

app.use('/api/v1', router);

// global error handler should come after all other middlewares
app.all('*', (req, res, next) => {
  const err = new APIError(404, `requested resource not found on server: ${req.originalUrl}`);
  next(err);
});

app.use(errorHandler);


