module.exports = () => `
const dotenv = require('dotenv');
const joi = require('joi');
const path = require('path');

if (process.env.NODE_ENV === 'prod') dotenv.config({ path: \`\${path.resolve('./.env')}\` });
else {
    dotenv.config({ path: \`\${path.resolve('./.env')}.\${process.env.NODE_ENV}\` })
}
const envVarsSchema = joi.object().keys({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().uri().required(),
    EXCHANGE: joi.string().required(),
    AMQP_HOST: joi.string().required(),
}).unknown();


const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(\`Config validation error: \${error.message}\`);
}


module.exports = {
    db: envVars.DATABASE_URL,
    port: envVars.PORT,
    env: process.env.NODE_ENV,
    exchange: envVars.EXCHANGE,
    broker: envVars.AMQP_HOST,

}
`;