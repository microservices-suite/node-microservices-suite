// Middleware function that accepts RabbitMQ channel
function rabbitMQMiddleware(channel) {
    return function(req, res, next) {
      // Here you can use the RabbitMQ channel in your middleware logic
      req.rabbitMQChannel = channel;
      next();
    };
  }

module.exports = {
    rabbitMQMiddleware
}
  
