const express = require('express')
const app = express()
const routes = require('./routes')
const { config, morgan, logger } = require('@microservices-suite/config');
const { createRMQChannel, subscribeMessage } = require('./utils/index')
const { rabbitMQMiddleware } = require('./middlewares/rabbitmq')

app.use(express.json())

async function startServer() {
    try {
        const channel = await createRMQChannel()
        subscribeMessage(channel, "")
        app.use(rabbitMQMiddleware(channel))
        app.use('/', routes)
        app.listen(9000, () => {
            logger.info(`http server connected: ${config.port}`);
        })
    } catch (error) {
        logger.error(err);
    }
}

startServer()
