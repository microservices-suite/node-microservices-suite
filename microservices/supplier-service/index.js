const express = require('express')
const app = express()
const routes = require('./routes')
const { createRMQChannel, subscribeMessage } = require('./utlis')
const { rabbitMQMiddleware } = require('./middlewares/rabbitmq')
const { config, morgan, logger } = require('@microservices-suite/config');
const { errorHandler } = require('@microservices-suite/errors');
const { APIError } = require('@microservices-suite/utilities');



app.use(express.json())


async function startServer() {
    try {
        console.log(process.env.NODE_ENV)
        const channel = await createRMQChannel()
        subscribeMessage(channel, "")
        app.use(rabbitMQMiddleware(channel))
        app.use(morgan.errorHandler)
        app.use(morgan.successHandler)
        app.use('/', routes)
        app.listen(9001, () => {
            console.log('Server listening on port: 9001')
        })
        // global error handler should come after all other middlewares
        app.all('*', (req, res, next) => {
            const err = new APIError(404, `requested resource not found on server: ${req.originalUrl}`);
            next(err);
        });
        app.use(errorHandler);

    } catch (error) {
        console.error('Error starting server:', error)
    }
}

startServer()
