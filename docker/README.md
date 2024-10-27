# Docker Application Setup

This directory contains configurations and assets for Docker-based applications, generated interactively through the **suiteCLI**. By default, **Krakend** is configured as the API gateway, and users can choose microservices from the existing `microservices` directory created earlier with the `suite generate service` command.

## Interactive Setup with suiteCLI

The `suite generate app` command prompts users to select configurations for their application, including web servers, API gateways, and available microservices. **Krakend** is the default API gateway, with options to configure Nginx as a reverse proxy.

Users can also select any microservices they have created in the `microservices` directory to integrate with their application.

## Folder Structure

After generating an app, your project folder structure will look like this:

```sequence
docker
├── README.md
└── apps
    └── <your_app>
        ├── data
        ├── docker-compose.dev.yml
        ├── docker-compose.yml
        ├── krakend
        │   └── krakend.json
        └── nginx
            ├── Dockerfile
            ├── Dockerfile.dev
            └── default.conf

```

### Directory and File Descriptions

#### Docker Structure

- **`<your_app>/`**: Directory for a specific application’s Docker configuration files, tailored based on your selections.
  
  - **`data/`**: Holds application data or volumes, set up if persistence is selected.

  - **`docker-compose.dev.yml`**: Development Docker Compose configuration, enabling hot-reloading and other development features.

  - **`docker-compose.yml`**: Production Docker Compose configuration, optimized for deployment.

  - **`krakend/krakend.json`**: Configuration file for the Krakend API Gateway, defining routes and backend integrations with selected microservices.

  - **`nginx/`**: Contains Nginx configurations if Nginx is selected as a reverse proxy.

    - **`Dockerfile`**: Production Dockerfile for Nginx.
    
    - **`Dockerfile.dev`**: Development Dockerfile for Nginx.
    
    - **`default.conf`**: Nginx server configuration for routing and proxying.

## Usage

### Running the Interactive Command

To scaffold a new application with Krakend, selected microservices, and deployment options, run:

```bash
suiteCLI generate app --name <your_app>
