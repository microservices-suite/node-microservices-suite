# Microservices Suite CLI

## Kubernetes Orchestration and Application Scaffolding

The **suiteCLI** tool streamlines the development workflow by automatically generating Kubernetes configurations for new applications. With the `suite generate app` command, developers can scaffold microservices and their required configurations effortlessly, accelerating setup and deployment in Kubernetes environments.

### Overview

The `suite generate app` command creates essential configurations in a structured, scalable way. It injects all necessary components within the folder structure, making it easier to manage configurations across different microservices. The CLI follows a modular approach, organizing Kubernetes and service files to support the entire development lifecycle.

### Folder Structure

After running `suite generate app`, your project will be structured as follows:
```sequence
k8s
├── README.md
├── broker
│   ├── clusterIp.yaml
│   ├── deployment.yaml
│   ├── loadBalancer.yaml
│   └── nodePort.yaml
├── ingress
│   └── ingress.yaml
└── ns
    └── default
        └── <your_app>
            ├── combo.yaml
            └── <app_service>
                ├── configMap.yaml
                ├── db
                │   ├── clusterIp.yaml
                │   ├── deployment.yaml
                │   ├── loadBalancer.yaml
                │   └── nodePort.yaml
                ├── secret.yaml
                └── server
                    ├── clusterIp.yaml
                    ├── deployment.yaml
                    ├── loadBalancer.yaml
                    └── nodePort.yaml

```


### Directory and File Descriptions

- **`k8s/`**: Contains all Kubernetes configurations for deploying your application.
  
  - **`broker/`**: Houses service configurations, allowing various access methods (ClusterIP, LoadBalancer, NodePort) for internal and external communication.
  
  - **`ingress/`**: Includes Ingress configurations for routing external traffic to your services.

  - **`ns/default/<your_app>/`**: Contains namespace-specific configurations for your application.

    - **`combo.yaml`**: Central configuration that ties together all components for deployment.

    - **`<app_service>/`**: Directory for a specific application service, including:

        - **`configMap.yaml`**: Configuration data for the application service.

        - **`db/`**: Contains database service configurations with various access methods.

            - **`clusterIp.yaml`**: Configuration for accessing the database via ClusterIP.

            - **`deployment.yaml`**: Deployment configuration for the database service.

            - **`loadBalancer.yaml`**: Configuration for exposing the database service via LoadBalancer.

            - **`nodePort.yaml`**: Configuration for exposing the database service via NodePort.

        - **`secret.yaml`**: Contains sensitive data (e.g., passwords) required by the application service.

        - **`server/`**: Contains server-related configurations.

            - **`clusterIp.yaml`**: Configuration for accessing the server via ClusterIP.

            - **`deployment.yaml`**: Deployment configuration for the server service.

            - **`loadBalancer.yaml`**: Configuration for exposing the server service via LoadBalancer.

            - **`nodePort.yaml`**: Configuration for exposing the server service via NodePort.

### Usage

To scaffold a new application with the necessary Kubernetes configurations, run:

```bash
suiteCLI generate app --name <your_app>
