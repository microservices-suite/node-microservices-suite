# Microservices Suite

## RabbitMQ message broker(based on AMQP protocal)

This project uses RabbitMQ to achieve eventual consistency and for fault tolerant messaging.

RabbitMQ is open source message broker software (sometimes called message-oriented middleware) that implements the Advanced Message Queuing Protocol (AMQP). The RabbitMQ server is written in the Erlang programming language and is built on the Open Telecom Platform framework for clustering and failover. 

If you want to use rabbitmqctl:
On Mac:
- assuming you installed rabbitmq using `brew install rabbitmq`
- In your terminal simply run 
- ```bash export PATH=$PATH:/usr/local/opt/rabbitmq/sbin/```
- Now you should be able to run the CLI tool check the 👉 [docs](https://www.rabbitmq.com/docs/cli)
On Windows:
- Refer to environment specific instructions on how to add the CLI tool to path incase its not yet globally availlable.