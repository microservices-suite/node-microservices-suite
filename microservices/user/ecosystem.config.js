
module.exports = {
    apps : [{
      name   : user,
      autorestart: true,
      watch: true,
      time: true,
      script : "./index.js",
      instances:4,
      env_production: {
        NODE_ENV: "prod",
        DATABASE_URL:"mongodb://mongodb:27017/microservices-suite_user_proddb",
        EXCHANGE:"@microservices-suite",
        AMQP_HOST:"amqp://rabbitmq:5672",
        PORT:9011
     },
     env_development: {
      NODE_ENV: "dev",
      DATABASE_URL:"mongodb://mongodb:27017/microservices-suite_user_devdb",
      EXCHANGE:"@microservices-suite",
      AMQP_HOST:"amqp://rabbitmq:5672",
      PORT:9011
   }
    }]
  }

