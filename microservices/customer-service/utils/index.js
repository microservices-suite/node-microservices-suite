const amqplib = require('amqplib')
const {RMQ_URL, RMQ_EXCHANGE_NAME, RMQ_QUEUE_NAME} = require('../config/index')
const { CUSTOMER_BINDING_KEY} = require('../config/index')

const createRMQChannel = async() => {
    try {
        // create the conenction
        const connection = await amqplib.connect(RMQ_URL)
        // create the channel
        const channel = await connection.createChannel()
        // declare the exchange
        channel.assertExchange(RMQ_EXCHANGE_NAME, 'direct', { durable : false})
    
        return channel
    } catch (error) {
        console.log(error)
    }
}

const publishMessage = async( channel, binding_key, message) => {
    try {
        await channel.publish(RMQ_EXCHANGE_NAME, binding_key, Buffer.from(message))
        console.log("MEssage Sent")
    } catch (error) {
        console.log(error)
    }
}

const subscribeMessage = async(channel, service) => {
    try {
        const appQueue = await channel.assertQueue(RMQ_QUEUE_NAME)
        console.log(` Waiting for messages in queue: ${appQueue.queue}`);
        channel.bindQueue( appQueue.queue, RMQ_EXCHANGE_NAME, CUSTOMER_BINDING_KEY)
        channel.consume(appQueue.queue, data => {
            console.log("Data Received")
            
            data && (
                console.log("This is the data" ,data.content.toString()),
                channel.ack(data)
                )
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createRMQChannel,
    publishMessage,
    subscribeMessage
}