
module.exports = {
    apps : [{
      name   : email,
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL="mongodb://mongodb:27017/microservices-suite_email_proddb",
        EXCHANGE="@monorepo",
        AMQP_HOST="amqp://rabbitmq:5672",
        PORT:9013
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL="mongodb://mongodb:27017/microservices-suite_email_devdb",
      EXCHANGE="@monorepo",
      AMQP_HOST="amqp://rabbitmq:5672",
      PORT:9013
   }
    }]
  }

