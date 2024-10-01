module.exports = ({ answers }) => `
module.exports = {
    apps : [{
      name   : "${answers.service_name}",
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL:"mongodb://mongodb:27017/${answers.project_base.slice(1)}_${answers.service_name}_proddb",
        EXCHANGE:"${answers.project_base}",
        AMQP_HOST:"amqp://rabbitmq:5672",
        PORT:${answers.port}
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL:"mongodb://mongodb:27017/${answers.project_base.slice(1)}_${answers.service_name}_devdb",
      EXCHANGE:"${answers.project_base}",
      AMQP_HOST:"amqp://rabbitmq:5672",
      PORT:${answers.port}
   }
    }]
  }

`;