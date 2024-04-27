const amqplib = require('amqplib')
const {RMQ_URL, RMQ_EXCHANGE_NAME, RMQ_QUEUE_NAME} = require('../config')
const { config, morgan, logger } = require('@microservices-suite/config');
const { SUPPLIER_BINDING_KEY} = require('../config/index')

// create channel
module.exports.createRMQChannel = async() => {
    try {
        // create the conenction
        const connection = await amqplib.connect(RMQ_URL)
        // create the channel
        const channel = await connection.createChannel()
        // declare the queue
        channel.assertExchange(RMQ_EXCHANGE_NAME, 'direct', { durable : false})
    
        return channel
    } catch (error) {
        logger.error(error.message)
    }
}

// publish message

module.exports.publishMessage = async(channel, binding_key, message) => {
    try {
        await channel.publish(RMQ_EXCHANGE_NAME, binding_key, Buffer.from(message))
        logger.info("Message sent")
    } catch (error) {
        logger.error(error.message)
    }
}

// subscribe message

module.exports.subscribeMessage = async( channel, binding_key, message) => {
    try {
        const appQueue = await channel.assertQueue(RMQ_QUEUE_NAME)
        logger.info(` Waiting for messages in queue: ${appQueue.queue}`);
        channel.bindQueue( appQueue.queue, RMQ_EXCHANGE_NAME, SUPPLIER_BINDING_KEY)
        channel.consume(appQueue.queue, data => {
            logger.info("Data Received")
            
            data && (
                logger.info("This is the data" ,data.content.toString()),
                channel.ack(data)
                )
        })
    } catch (error) {
        logger.error(error.message)
    }
}
