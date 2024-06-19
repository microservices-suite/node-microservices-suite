module.exports = ({ answers }) => `
const amqp = require('amqplib');
const { APIError } = require("${answers.project_base}/utilities");

/**
 * Initializes a connection to the RabbitMQ broker, creates a channel, and asserts an exchange.
 *
 * @param {Object} params - The parameters for initializing the AMQP connection.
 * @param {Object} params.config - The configuration object for the RabbitMQ connection.
 * @param {string} params.config.broker - The broker URL for the RabbitMQ connection.
 * @param {string} params.config.exchange - The name of the exchange to assert.
 * @param {string} [params.type='direct'] - The type of the exchange (default is 'direct').
 * @param {boolean} [params.durable=false] - Indicates whether the exchange should be durable (default is false).
 *
 * @returns {Promise<Object>} A promise that resolves to the RabbitMQ channel.
 *
 * @throws {APIError} Throws an APIError if the broker fails to initialize.
 *
 * @example
 * const config = { broker: 'amqp://localhost', exchange: 'myExchange' };
 *
 * amqpInitialize({ config, type: 'fanout', durable: true })
 *   .then(channel => {
 *     console.log('Exchange and channel initialized successfully');
 *   })
 *   .catch(err => {
 *     console.error('Failed to initialize exchange and channel', err);
 *   });
 */
const amqpInitialize = async ({ config, type = 'direct', durable = false }) => {
    try {
        const connection = await amqp.connect(config.broker);
        const channel = await connection.createChannel();
        await channel.assertExchange(config.exchange, type, { durable });
        return channel;
    } catch (error) {
        throw new APIError(500, \`broker failed to initialize: \${error.message}\`);
    }
};


module.exports = {
    amqpInitialize,
}
`;