module.exports = ({ answers }) => `
const { APIError } = require("${answers.project_base}/utilities");

/**
 * Publishes a message to a specified exchange with a given routing key.
 *
 * @param {Object} params - The parameters for publishing the message.
 * @param {string} params.action - The action to perform on publishing to target service.
 * @param {Object} params.channel - The RabbitMQ channel to use for publishing the message.
 * @param {string} params.service - The service (routing key) to use for publishing the message.
 * @param {string} params.msg - The message to be published.
 * @param {Object} params.config - The configuration object for the RabbitMQ exchange.
 * @param {string} params.config.exchange - The name of the exchange to publish the message to.
 *
 * @returns {Promise<void>} A promise that resolves when the message is successfully published.
 *
 * @throws {APIError} Throws an APIError if the message fails to be published.
 *
 * @example
 * const channel = // initialize your RabbitMQ channel
 * const service = 'myRoutingKey';
 * const msg = 'Hello, World!';
 * const config = { exchange: 'myExchange' };
 *
 * publish({ action, channel, service, msg, config })
 *   .then(() => {
 *     console.log('Message published successfully');
 *   })
 *   .catch(err => {
 *     console.error('Failed to publish message', err);
 *   });
 */
const publish = async ({ action, channel, service, data, config }) => {
    try {
        const msg = JSON.stringify({
            action,
            body: data
        });
        const routing_key = service;
        await channel.publish(config.exchange, routing_key, Buffer.from(msg));
        console.log(\`Message published to \${config.exchange}\`);
    } catch (err) {
        console.error(err);
        throw new APIError(500, \`Failed to publish message: \${err.message}\`);
    }
};


module.exports = {
    publish,
}
`;