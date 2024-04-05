# Microservices Suite

## API-GATEWAY Package

The API-GATEWAY serves as the front-facing layer of our Microservices Suite, designed to efficiently route client requests to the appropriate internal service. By abstracting the internal services network from the client, it exposes a singular endpoint that consolidates and manages access to your suite of APIs.

### Key Features

- **Unified Endpoint**: Offers a single endpoint for all client-side applications to interact with, simplifying API consumption and integration.
- **Request Routing**: Dynamically routes client requests to the appropriate microservice based on the request path, method, and other criteria.
- **Response Aggregation**: Collects responses from various microservices and consolidates them into a single response for the client, facilitating smoother interaction patterns.
- **Security and Abstraction**: Enhances security by hiding the internal structure of the microservices network from the clients.

## Getting Started

### Prerequisites

Before setting up the API-GATEWAY, ensure that you have the following:
- A current version of Node.js installed (preferably version 12.x or newer).
- Basic knowledge of how microservices architecture operates.
- Access to the microservices that the gateway will route requests to.

### Installation

To install the API-GATEWAY, follow these steps:

<!-- TODO: document usage here -->

### Configuration

<!-- TODO: build on this -->
Configure the gateway by setting up environment variables or editing a `.env` file in the root directory of the API-GATEWAY project. Key configurations include the gateway's port, microservices endpoints, and any security credentials like API keys.

### Running the Gateway

<!-- TODO: build on this but ideally is supposed to be run just like any other service in our ms-suite -->


<!-- Handling client requests -->

<!-- Microfrontend client request -->

<!-- Monolithic client request -->

### Handling client requests

#### Microfrontend client
- Microservices 

#### Monolithic client
- Monolith client apps which are the traditional frontend applications
- They make requests to the server by making a http request to one `base_url/<endpoint>`
- In microservices architecture they will make a call to this service(`the gateway`) which sits in front of all her services
- On getting the request the `API-Gateway` then `decomposes` the request into different `api calls` that are routed internally to different services.
- On completion the gateway aggregates/consolidates the response into one and returns back to the monolithic application
