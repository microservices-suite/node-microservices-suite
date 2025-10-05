module.exports = ({ answers }) => `
PORT=${answers.port}
DATABASE_URL=mongodb://127.0.0.1:27017/${answers.project_base.slice(1)}_${answers.service_name}_devdb
#DATABASE_URL=mongodb://mongodb:27017/${answers.project_base.slice(1)}_${answers.service_name}_devdb
EXCHANGE=${answers.project_base}
AMQP_HOST=amqp://127.0.0.1:5672
#AMQP_HOST=amqp://rabbitmq:5672
`;