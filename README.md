# Microservices Suite 🦧

## Overview

Welcome to the 📦 [Microservices](https://drive.google.com/file/d/1Noc_6WVe0CmzynnuURexm7MCv75OUAuQ/view?usp=drive_link) Suite project! This suite is a collection of Node.js microservices built using the 🦧 [mono-repo]() strategy and leveraging the [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) concept. Each microservice runs in its isolated Docker `container`, and `Kubernetes` orchestrates the deployment, providing scalability and efficiency.
To easily work with a `@microservices-suite monorepo` you need to install [Suite CLI](https://www.npmjs.com/package/@microservices-suite/cli). With `Suite` you can easily scaffold,manage and automate your monorepo in development, CI as well as production. Check the installation guidelines in the `README.md` section of the `.suite-cli` root.

## Project file structure
```sequence
├─ node-microservices-suite
│  ├─ .suite-cli/
|  │  ├─ cli/
|  │  │  ├─ scripts/
|  │  │  ├─ cli.js
|  │  │  ├─ package.json
|  │  │  ├─ README.md
│  ├─ gateways/
|  │  ├─ apps/
|  │  |   ├─app-1/
|  │  │   | ├─ data/
|  │  │   | ├─ krakend/
|  │  │   | ├─ webserver/
|  │  │   | |  ├─Dockerfile
|  │  │   | |  ├─Dockerfile.dev
|  │  │   | |  ├─webserver.conf
|  │  │   | ├─ docker-compose.yml
|  │  │   | ├─ docker-compose.dev.yml
|  │  │   | ├─ README.md
│  ├─ graphql/
|  │  ├─ app-1/
|  │  │  ├─ apollo-server
|  │  │  ├─ README.md
│  ├─ k8s/
|  │  ├─ service-1/
|  │  │  ├─ cluster-ip-service.yml
|  │  │  ├─ cluster-deployment.yml
|  │  │  ├─ ingress-service.yml
|  │  │  ├─ README.md
|  ├─ microservices/
|  │  ├─ service-1/
|  │  │  ├─ src
|  │  │  ├─ .env
|  │  │  ├─ .env.dev
|  │  │  ├─ app.js
|  │  │  ├─ Dockerfile
├─ │  │  ├─ Dockerfile.dev
|  │  │  ├─ ecosystem.config.js
|  │  │  ├─ index.js
|  │  │  ├─ package.json
|  │  │  ├─ task.json
|  ├─ shared/
|  │  ├─ library-1/
|  │  │  ├─ APIError.js
|  │  │  ├─ catchAsync.js
|  │  │  ├─ index.js
|  │  │  ├─ package.json
|  │  │  ├─ pick.js
|  │  │  ├─ README.md
|  │  │  ├─ validate
│  ├─ tests/
|  │  ├─ service-1/
|  │  │  ├─ e2e/
|  │  │  ├─ integration/
|  │  │  ├─ snapshot/
|  │  │  ├─ unit/
|  │  │  ├─ README.md
|  ├─ .gitignore
|  ├─ .npmrc
|  ├─ .yarnrc.yml
|  ├─ docker-compose.yml
|  ├─ package.json
|  ├─ production.yml
|  ├─ README.md
|  ├─ yarn.lock
```
## Monorepo strategy benefits for microservices:

- **Enforce [DRY](https://japhethobala.com/posts/technical/single-responsibility/) Principles:**
  - [@Japheth Obala](https://github.com/jobala) the Prophet 😎 has done a sleek job demystifying [👉SOLID & best practice here](https://japhethobala.com/).
  - Collocating code encourages code sharing.
  - Reduce duplication 👉[read about SOLID here](https://japhethobala.com/)
  - Save time by building on existing boilerplate or reusable functionality.

- **Collaboration:** 
  - Working within the same repository facilitates learning from peers.
  - Enables the adoption of good coding practices and the avoidance of bad ones.

- **Centralized Development Chores:** 
  - Manage common files like `.gitignore` centrally from the root directory
  - Reduce unnecessary repetitions in the codebase.

- **Easily Integrate Development Automation:** 
  - Task runner configurations and docker-compose can be managed from the root directory.
  - simplify the automation of repetitive workflows.

- **Code Sharing Anywhere:** 
  - Publish and import organization-scoped libraries from the npm registry with 
```bash
    yarn release 
    yarn add <@microservices-suite/foo>
    yarn workspace @microservices-suite/<workspace-name> add  @microservices-suite/<library> 
```
  - Using `Suite CLI` you could achieve the results with the following commands
```bash
    suite release 
    suite add <@microservices-suite/foo>
    suite -W <workspace-name> add  @microservices-suite/<library> 
```

- **Easily Containerize and Scale:** 
  - Decouple every microservice to scale individually. 
  - Leverage the [no-hoist yarn workspace](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) feature and custom scripts to enable efficient packaging of microservices into isolated containers.

## Technologies Used

- **Yarn Workspaces:** 
  - Simplifies managing multiple packages within a single repository.
  - Encourage code sharing & reduce duplication
  - Make it easier to handle dependencies and scripts.
  
- **Docker Containers:** 
  - Provides lightweight, portable, and self-sufficient containers for packaging and deploying microservices.

### **Alpine** Images

- Alpine images are very minimalistic Linux minidistros that cost you only `~5MB` of real estate. That is why they are used inside your favourite `smart watch ⌚️`. 
- One objective of this project is to `optimize image builds for Continuous Integration (CI)` and `production` environments through the utilization of the slimmest possible images so that you dont bloat ⚠️ your machine in dev and we have a lean server in prod.

#### Key Strategies:

- **Multi-Stage Builds:** 
  - We employ simple Docker constructs like `multi-stage builds` to optimize our image size.

- **Hoisting and Symlinking:**
  - While these practices promote the `DRY` (Don't Repeat Yourself) principle, they pose a threat to our objective of achieving minimized images. To mitigate this, we leverage `no-hoisting and symlinked libraries`
  - selectively copying only the `node_modules` generated by `non-hoisted workspaces`. 
  - These are optimized to consume less disk space, ensuring that only the essential shared libraries required by a specific service are included, thereby maintaining the slim profile of our images.
  - The service itself will build her core node modules normally inside the dockerfile from her `package.json` 

### Docker & Node Best Practices

- For an in-depth guide and best practices on using Docker with Node.js, visit the [Docker & Node Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md) repository.

### Kubernetes (k8s)

- Kubernetes offers automated deployment, scaling, and management of containerized applications, ensuring reliability and scalability.

# Getting Started

Welcome to our project! To ensure a smooth setup and development experience, ensure you have the following tools installed on your machine:


- **Docker:** 
  - For containerization and managing containerized applications.  
  - 👉 [Install docker here](https://docs.docker.com/engine/install/).
  - We love 💚 [alpine images](https://alpinelinux.org/) <small,simple,secure>. 
  - You can read about the specific flavor [here](https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image)
- **Suite CLI:** 
  - For easy project scaffolding task automation and workflow management.
  - Install `suite`: check the installation guidelines below.
- **Node.js:** 
  - As the runtime environment for executing the application code.  
  - 👉 [Download LTS version here](https://nodejs.org/en/download)
- At the project <service_root> create `.env`, `.env.dev` and `.env.staging` files and copy `environment variables` from the `.env.example` file

## Running Components

- A `component` in our `suite` jargon refers to a `service` or `application`. With `@microservices-suite` you can create 1 or more services as well as applications.
- Suite is `component-scoped`, giour strategy that enhances modularity and at the same time makes using the monorepo intuitive. Its is inspired by `Single Responsibility` principle.
- Apps are simply `cohessive` microservices `aggregated` under the `./gateway/apps/` directory to create decoupled services to serve your client. An example is an `Ecommerce app`. This app can have `customer, supplier,orders and products` microservices under the `./microservices/` directory. These microservices are then referenced in `docker-compose` file definitions placed under the `./gateway/apps/ecommerce-app/` directory. Other apps can be added to the `./gateway/apps` directory with their `docker-compose` definitions and `api-gateway configs(nginx/appache)`.
- Suite scales applications with `kubernetes` and app-scoped `k8s` configs are located under the `./k8s/` directory. Therefore the kubernetes configurations for our Ecommerce app will be located at `./k8s/ecommerce-app`
- [Suite CLI](https://github.com/microservices-suite/node-microservices-suite/tree/main/.suite-cli/cli) streamlines the process of starting a service(s) or app(s) in `development` & `production`. Follow these steps to get your environment up and running:
- You can derive the `service_name` or `app-name` from the workspace name found in the `package.json "name": ` property e.g 
```json
"name": "@microservices-suite/<component-name>"
```
- To run an app in either modes [dev,staging,prod]:
- If -k or --kubectl flag is specified `suite` spins your app with `kubectl` . You need to have [minikube](https://minikube.sigs.k8s.io/docs/start/) installed and [kubectl](https://kubernetes.io/docs/tasks/tools/). Otherwise defaults to docker compose
- If -m or --mode is specified you need to have a `docker-compose.<mode>` specified but this is not necessary with kubectl since we only run the development version of kubectl.
```bash
suite start [--kubectl,--mode]|[-km] <mode> <app-name...> 
```
- This command uses docker-compose to start your app(s)
- Suite will handle the setup, ensuring your app is ready.

### Running Services with -v --vanilla
- If you prefer not to use Docker, you can use the `-v,--vanilla`  command to start service(s) using node `PM2` engine in production or `nodemon` in any other mode:
```bash
suite start [--vanilla,--mode]|[-vm] <mode> <service_name...>
```

### Using Docker-Compose Directly
- Should you need to use docker-compose directly for more control over the container orchestration, you can utilize the standard commands provided by Docker:
- You can replace the yml files with your compose file path and production.yml has been used as an overide. There are many ways to kill the cat in dockers world 😎.
```bash
 docker-compose  -f docker-compose.yml -f production.yml up --build -d
 docker-compose down
```

## Contributing

Contributions are welcome! If you'd like to contribute to the Microservices Suite project, please follow these guidelines:

1. Fork the repository and clone it to your local machine.
```bash
git clone https://github.com/microservices-suite/node-microservices-suite.git
```
2. Create a new branch for your feature or bug fix: 
```bash
git checkout -b feat/<my-feature>
```
3. Make your changes and make sure that tests pass.

4. Before committing your changes, make sure it follows the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

   - We recommend you use the [Better Commits CLI](https://github.com/Everduin94/better-commits) tool. It is a CLI for writing better commits, following the conventional commits specification.

5. Push to the branch: 
```bash
git push origin feat/<my-feature>
```
6. Submit a pull request detailing your changes.

7. Please ensure that your pull request adheres to the project's code style and conventions.

## License

- This project is licensed under the [MIT License](./LICENSE). Feel free to use, modify, and distribute this code for any purpose.

## Acknowledgements

We would like to thank the developers and contributors to the following technologies used in this project:

- Yarn
  - [Yarn workspace](https://classic.yarnpkg.com/lang/en/docs/cli/workspace/). 
  - Also checkout [yarn workspaces](https://classic.yarnpkg.com/en/docs/cli/workspaces)
  - [No-hoist](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)
- ⚓️ Docker
  - [⚓️vanilla docker (CLI)](https://docs.docker.com/reference/cli/docker/)
  - [docker-compose (manage a multi-container application)](https://docs.docker.com/compose/)
- 🎡 Kubernetes
  - [minikube (local kubernetes for development only!)](https://minikube.sigs.k8s.io/docs/start/)
  - [k8s](https://kubernetes.io/docs/home/)
  - [k8s in the cloud,GKE,EKS and more...](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/)
- Curated Resouces(by gilbertandanje@gmail.com)
  - 👉 Read [Book by Sam Newman](https://samnewman.io/books/building_microservices/)
  - 🛳️ [containerization, orchestration & CICD](https://drive.google.com/drive/folders/1_GswpJ5jEm27suzglI-wCDomLIuOSvea?usp=drive_link)
  - 📦 [microservices](https://drive.google.com/drive/folders/1ObxIg5qyoIij-l9cUovRmTA3Ds_fSigE?usp=drive_link)
- 🦧 Monorepos
  - 👉 Monorepo is not [code collocation](https://nx.dev/concepts/more-concepts/why-monorepos)
  - 👉 Read [Medium article here](https://medium.com/@avicsebooks/monorepo-2edb5a67517d)
- For design patterns,best practice and DSA checkout this sheet on the [Resources sheet](https://docs.google.com/spreadsheets/d/1aeci3pqPLG2Uwa42SqSrwgJmqM3A_u7DgkmG7IjZ1Ys/edit#gid=643790244)
