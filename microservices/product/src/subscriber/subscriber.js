
const productService = require('../services/services');
const rabbitmq = require('@microservices-suite/broker/rabbitmq');

const subscribe = async ({ channel, config, routing_key }) => {
    try {
        const q = await channel.assertQueue('', { exclusive: true });
        console.log(`⚡️ ${routing_key}: successfully subscribed to exchange: ${config.exchange}`);
        await channel.bindQueue(q.queue, config.exchange, routing_key);
        await channel.consume(q.queue, async(msg) => {
            if (msg !== null) {
                const service = msg.fields.routingKey;
                console.log("Message received [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                await subscriberHandler({ channel, msg, service, config });
            }
        }, { noAck: false });
    } catch (error) {
        throw new APIError(500, `Failed to set up subscriber ${error.message}`);
    }
};

const subscriberHandler = async ({ channel, msg, service, config }) => {
    const messageContent = JSON.parse(msg.content.toString()); // Parse the message content
    const { action, body } = messageContent; // Destructure type and body from the parsed content
    let data;
    let auth;
    switch (action) {
        case 'create':
            try {
                await productService.createProduct({ body })
            } catch (error) {
                //TODO: handle this case. Eg do we roll back or what next..
                console.log(`product: subscriber-failed to create product: ${error.message}`);

                console.log({ error });
            }
            break;
        // TODO: use rpc for read operations
        case 'read':
            const { products } = await productService.getProducts();
            data = products;
            await rabbitmq.workerQueue.sendToQueue({ data, queue: service, config });
            break;
        case 'read:id':
            product = await productService.getProductById({ id: body.id });
            product = product.product;
            await rabbitmq.workerQueue.sendToQueue({ data, queue: service, config });
            break;
        case 'update':
            break;
        case 'delete':
            break;
        default:
            channel.ack(msg);
    }
}
module.exports = {
    subscriberHandler,
    subscribe
};
