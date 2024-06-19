module.exports = ({ answers }) => `
const amqp = require('amqplib');
const { APIError } = require("${answers.project_base}/utilities");

/**
 * Initializes a connection to the RabbitMQ broker and returns a channel.
 *
 * @param {Object} params - The parameters for initializing the queue.
 * @param {Object} params.config - The configuration object for the RabbitMQ connection.
 * @param {string} params.config.broker - The broker URL for the RabbitMQ connection.
 *
 * @returns {Promise<Object>} A promise that resolves to the RabbitMQ channel.
 *
 * @throws {APIError} Throws an APIError if the broker fails to initialize.
 *
 * @example
 * const config = { broker: 'amqp://localhost' };
 *
 * amqpInitializeQueue({ config })
 *   .then(channel => {
 *     console.log('Channel initialized successfully');
 *   })
 *   .catch(err => {
 *     console.error('Failed to initialize channel', err);
 *   });
 */
const amqpInitializeQueue = async ({ config }) => {
    try {
        const connection = await amqp.connect(config.broker);
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error({error})
        throw new APIError(500, \`broker failed to initialize: \${error.message}\`);
    }
};


/**
 * Sends a message to a specified queue.
 *
 * @param {Object} params - The parameters for sending the message to the queue.
 * @param {Object} params.data - The data to be sent to the queue.
 * @param {string} params.queue - The name of the queue to send the message to.
 * @param {Object} params.config - The configuration object for the RabbitMQ connection.
 * @param {string} params.config.broker - The broker URL for the RabbitMQ connection.
 * @param {boolean} [params.durable=true] - Indicates whether the queue should be durable.
 * @param {boolean} [params.persistent=true] - Indicates whether the message should be persistent.
 *
 * @returns {Promise<void>} A promise that resolves when the message is successfully sent to the queue.
 *
 * @example
 * const data = { text: 'Hello, World!' };
 * const queue = 'myQueue';
 * const config = { broker: 'amqp://localhost' };
 *
 * sendToQueue({ data, queue, config })
 *   .then(() => {
 *     console.log('Message sent successfully');
 *   })
 *   .catch(err => {
 *     console.error('Failed to send message', err);
 *   });
 */
const sendToQueue = async ({ data, queue, config, durable = true, persistent = true }) => {
    const msg = JSON.stringify(data);
    const connection = await amqp.connect(config.broker);
    const channel = await connection.createChannel();
    channel.assertQueue(queue, {
        durable
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
        persistent
    });
    console.log("Message Sent '%s': '%s'", queue, msg);
};

/**
 * Consumes messages from a specified queue and processes them using the provided subscriber handler.
 *
 * @param {Object} params - The parameters for consuming from the queue.
 * @param {Object} params.channel - The RabbitMQ channel to use for consuming messages.
 * @param {string} params.queue - The name of the queue to consume messages from.
 * @param {Function} params.subscriberHandler - The handler function to process each consumed message.
 * @param {Object} params.subscriberHandler.channel - The RabbitMQ channel passed to the subscriber handler.
 * @param {Object} params.subscriberHandler.msg - The message consumed from the queue.
 * @param {string} params.subscriberHandler.service - The routing key service for the message.
 *
 * @returns {Promise<void>} A promise that resolves when the queue consumption setup is complete.
 *
 * @example
 * const channel = // initialize your RabbitMQ channel
 * const queue = 'myQueue';
 * const subscriberHandler = async ({ channel, msg, service }) => {
 *   // Process the message
 * };
 * 
 * consumeFromQueue({ channel, queue, subscriberHandler })
 *   .then(() => {
 *     console.log('Queue consumption setup complete');
 *   })
 *   .catch(err => {
 *     console.error('Failed to set up queue consumption', err);
 *   });
 */
const consumeFromQueue = async ({ channel, queue, subscriberHandler }) => {
    channel.assertQueue(queue, {
        durable: true
    });
    console.log(\`⚡️ \${queue}: successfully connected to queue: \${queue}\`);
    channel.prefetch(1); // Load balance
    channel.consume(queue, async (msg) => {
        const service = msg.fields.routingKey;
        console.log("Message received [x] %s: '%s'", service, msg.content.toString());
        await subscriberHandler({ channel, msg, service });
        channel.ack(msg); // Idempotence
    }, {
        noAck: false
    });
};

module.exports = {
    sendToQueue,
    amqpInitializeQueue,
    consumeFromQueue
}
`;