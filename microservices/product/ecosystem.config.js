
module.exports = {
    apps : [{
      name   : product,
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL="mongodb://mongodb:27017/microservices-suite_product_proddb",
        EXCHANGE="@monorepo",
        AMQP_HOST="amqp://rabbitmq:5672",
        PORT:9016
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL="mongodb://mongodb:27017/microservices-suite_product_devdb",
      EXCHANGE="@monorepo",
      AMQP_HOST="amqp://rabbitmq:5672",
      PORT:9016
   }
    }]
  }

