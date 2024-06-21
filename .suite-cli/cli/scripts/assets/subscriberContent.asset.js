module.exports = ({ answers }) => `
const ${answers.service_name}Service = require('../services/services');
const ${answers.default_broker} = require('${answers.project_base}/broker/${answers.default_broker}');

const subscribe = async ({ channel, config, routing_key }) => {
    try {
        const q = await channel.assertQueue('', { exclusive: true });
        console.log(\`⚡️ \${routing_key}: successfully subscribed to exchange: \${config.exchange}\`);
        await channel.bindQueue(q.queue, config.exchange, routing_key);
        await channel.consume(q.queue, async(msg) => {
            if (msg !== null) {
                const service = msg.fields.routingKey;
                console.log("Message received [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                await subscriberHandler({ channel, msg, service, config });
            }
        }, { noAck: false });
    } catch (error) {
        throw new APIError(500, \`Failed to set up subscriber \${error.message}\`);
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
                await ${answers.service_name}Service.create${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}({ body })
            } catch (error) {
                //TODO: handle this case. Eg do we roll back or what next..
                console.log(\`${answers.service_name}: subscriber-failed to create ${answers.service_name}: \${error.message}\`);

                console.log({ error });
            }
            break;
        // TODO: use rpc for read operations
        case 'read':
            const { ${answers.service_name}s } = await ${answers.service_name}Service.get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}s();
            data = ${answers.service_name}s;
            await ${answers.default_broker}.workerQueue.sendToQueue({ data, queue: service, config });
            break;
        case 'read:id':
            ${answers.service_name} = await ${answers.service_name}Service.get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}ById({ id: body.id });
            ${answers.service_name} = ${answers.service_name}.${answers.service_name};
            await ${answers.default_broker}.workerQueue.sendToQueue({ data, queue: service, config });
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
`