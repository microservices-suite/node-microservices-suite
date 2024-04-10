const express = require('express')
const app = express()
const routes = require('./routes')
const {createRMQChannel, subscribeMessage} = require('./utlis')
const {rabbitMQMiddleware} = require('./middlewares/rabbitmq')


app.use(express.json())


async function startServer() {
    try {
        const channel = await createRMQChannel()
        subscribeMessage(channel,"")
        app.use(rabbitMQMiddleware(channel))
        app.use('/', routes)
        app.listen(9001, () => {
            console.log('Server listening on port: 9001')
        })
    } catch (error) {
        console.error('Error starting server:', error)
    }
}

startServer()
