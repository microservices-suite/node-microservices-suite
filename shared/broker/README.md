
# @monorepo

## Broker Library

Welcome to the @monorepo Broker Library! This library is a part of the larger monorepo dedicated to housing reusable components tailored for microservices architecture. Within this library, you'll find a collection of utilities designed to streamline RabbitMQ messaging in your microservices.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Publisher](#publisher)
  - [Exchange](#exchange)
  - [Worker Queue](#worker-queue)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The @monorepo Broker Library provides a set of tools to easily manage RabbitMQ messaging within the @monorepo microservices architecture. It includes reusable logic for publishers, exchanges, and worker queues.

## Installation

Install the package using npm:

```bash
npm install @monorepo/broker
```

## Usage

### Publisher

The Publisher utility allows you to send messages to a specified RabbitMQ exchange with a given routing key. It simplifies the process of message creation and delivery, ensuring consistency and reliability across your microservices.

### Exchange

The Exchange utility helps you declare and manage RabbitMQ exchanges. It supports various exchange types, such as direct, topic, headers, and fanout, enabling flexible message routing based on your application's needs.

### Worker Queue

The Worker Queue utility provides an interface for creating and managing worker queues in RabbitMQ. It handles message consumption, processing, and acknowledgment, making it easier to implement robust and scalable background processing.

## Configuration

Configuration for the @monorepo Broker Library is typically managed through environment variables or configuration files. Key settings include the RabbitMQ server URL, exchange names, queue names, and routing keys. Ensure that your microservices are configured to use these settings for seamless integration with the broker library.

## Contributing


