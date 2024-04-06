# Microservices Suite 🦧

## Overview

Welcome to the 📦 [Microservices](https://drive.google.com/file/d/1Noc_6WVe0CmzynnuURexm7MCv75OUAuQ/view?usp=drive_link) Suite project! This suite is a collection of Node.js microservices built using the 🦧 [mono-repo]() strategy and leveraging the [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) concept. Each microservice runs in its isolated Docker `container`, and `Kubernetes` orchestrates the deployment, providing scalability and efficiency.

## Project file structure
```sequence
├─ node-microservices-suite
│  ├─ api-gateways/
|  │  ├─ app-1/
|  │  │  ├─ nginx
|  │  │  ├─ apache
|  │  │  ├─ README.md
│  ├─ graphql/
|  │  ├─ app-1/
|  │  │  ├─ apollo-server # placeholder file atm
|  │  │  ├─ README.md
│  ├─ data-persistence/
|  │  ├─ db-1/
|  │  │  ├─ Dockerfile
|  │  │  ├─ README.md
|  │  ├─ sqlite/ #for in memory or disk db for miniature devices or prototyping
|  │  ├─ ├─ db/
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
|  │  │  ├─ snapshot/ #if it's a micro-frontend service
|  │  │  ├─ unit/
|  │  │  ├─ README.md
|  ├─ .gitignore
|  ├─ .npmrc
|  ├─ .yarnrc.yml
|  ├─ docker-compose.yml
|  ├─ package.json
|  ├─ production.yml
|  ├─ README.md
|  ├─ Taskfile.yml
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
  - Publish and import organization-scoped libraries to the npm registry with 
```bash
    yarn publish 
    yarn add <@microservices-suite/foo> or
    yarn @microservices-suite/<workspace-name> add <@microservices-suite/foo>
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
- **Task Runner Automation Tool:** 
  - For task automation and workflow management.  
  - 👉 [Install task runner here](https://taskfile.dev/installation/).
- **Node.js:** 
  - As the runtime environment for executing the application code.  
  - 👉 [Download LTS version here](https://nodejs.org/en/download)
- At the project <service_root> create `.env`, `.env.dev` and `.env.staging` files and copy `environment variables` from the `.env.example` file

## Running Services

- This project uses [Task Runner](https://taskfile.dev/usage/) Automation Tool to streamline the process of starting services in both development and production. Follow these steps to get your environment up and running:
- You can derive the `service_name` of a service from the workspace name found in the `package.json "name": ` property e.g 
```json
"name": "@microservices-suite/<service_name>"
```
- To run a service in either modes [dev,staging,prod]:
```bash
task run:<mode>:<service_name>
```
- This command uses docker-compose to start your service(s)
- The task runner will handle the setup, ensuring your service is ready.

### Running Services Without Docker
- If you prefer not to use Docker, you can use the `vanilla` task command to start services using node `PM2` engine in production or `nodemon` in any other mode:
```bash
task vanilla:<mode>:<service_name>
```

### Using Docker-Compose Directly
- Should you need to use docker-compose directly for more control over the container orchestration, you can utilize the standard commands provided by Docker:
```bash
docker-compose up
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
4. Commit your changes using the Angular commit message convention:
   - For more details, please refer to the [Angular commit message convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).
5. Push to the branch: 
```bash
git push origin feat/<my-feature>
```
6. Submit a pull request detailing your changes.
7. Please ensure that your pull request adheres to the project's code style and conventions.

## License

- This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this code for any purpose.

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
