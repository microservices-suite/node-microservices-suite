
module.exports = {
    apps : [{
      name   : th,
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL:"mongodb://mongodb:27017/microservices-suite_th_proddb",
        EXCHANGE:@microservices-suite,
        AMQP_HOST:"amqp://rabbitmq:5672",
        PORT:9020
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL:"mongodb://mongodb:27017/microservices-suite_th_devdb",
      EXCHANGE:@microservices-suite,
      AMQP_HOST:"amqp://rabbitmq:5672",
      PORT:9020
   }
    }]
  }

