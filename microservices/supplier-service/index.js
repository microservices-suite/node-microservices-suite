const express = require('express')
const app = express()
const routes = require('./routes')
const {createRMQChannel, subscribeMessage} = require('./utlis')
const {rabbitMQMiddleware} = require('./middlewares/rabbitmq')
// const { config, morgan, logger } = require('@microservices-suite/config');


app.use(express.json())


async function startServer() {
    try {
        console.log(process.env.NODE_ENV)
        const channel = await createRMQChannel()
        subscribeMessage(channel,"")
        app.use(rabbitMQMiddleware(channel))
        // app.use(morgan.errorHandler)
        // app.use(morgan.successHandler)
        app.use('/', routes)
        app.listen(9001, () => {
            console.log('Server listening on port: 9001')
        })
    } catch (error) {
        console.error('Error starting server:', error)
    }
}

startServer()
