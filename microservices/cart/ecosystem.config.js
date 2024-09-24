
module.exports = {
    apps : [{
      name   : cart,
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL="mongodb://mongodb:27017/microservices-suite_cart_proddb",
        EXCHANGE="@monorepo",
        AMQP_HOST="amqp://rabbitmq:5672",
        PORT:9010
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL="mongodb://mongodb:27017/microservices-suite_cart_devdb",
      EXCHANGE="@monorepo",
      AMQP_HOST="amqp://rabbitmq:5672",
      PORT:9010
   }
    }]
  }

