# Microservices Suite

## suite-cli: Monorepo CLI Tool (The mono-repo Manager 🦧)

### Intro
- Suite-CLI is a cross-platform easy to use command line interface for managing monorepos. 
- Build and ship quickly with code-generator `suite generate` that helps you scaffold resources so you can focus on the core functionality and reduce project setup overhead.
- Suite uses consistent and intuitive syntax for commands both in development and CI.
Example 
  ```bash
  yarn workspace @microservices-suite/utilities run dev
  ```
The same command with suite-CLI
  ```bash
  suite start utilities
  ```
- The CLI uses automation and smart algorithmns to run otherwise repetetive tasks and orchestrate complex workflows with simple commands.
- Streamline building & publishing docker images
- Easily maintain and publish private packages to npm registry using `suite {library_name} release` 
- Streamline containerization with docker and scale with kubernetes both in development and production.

### Installation

In this guide we describe using `npm` to install packages. Other package managers may be used at your discretion. With npm, you have several options available for managing how your OS command line resolves the location of the `suite CLI` binary file. Here, we describe installing the `suite` binary globally using the -g option. This provides a measure of convenience, and is the approach we assume throughout the documentation. Note that installing any `npm` package globally leaves the responsibility of ensuring they're running the correct version up to the user.  It also means that if you have different projects, each will run the same version of the CLI. A reasonable alternative is to use the npx program, built into the npm cli (or similar features with other package managers) to ensure that you run a managed version of the `Suite` CLI. We recommend you consult the npx documentation and/or your DevOps support staff for more information.To install `suite-cli` globally, run the following command:

Install the CLI globally using the `npm install -g` command (see the **Note** above for details about global installs).

  ```bash
  sudo npm install @microservices-suite/cli -g
  ```
**HINT**
Alternatively, you can use this command `npx @microservices-suite/cli@latest` without installing the cli globally.

### Prerequisites(required)
- Starting from version `microservices-suite/cli@2.1.0` suite  introduces *fault tolerance* to its microservices. 
  - As of this release suite uses rabbitmq as the default message broker for *fault tolerance*. 
  - To be able to run your services with the `suite start -v {service}` command you need to have `rabbitmq` installed on your machine.
  - To install rabbitmq follow this instructions 👉 [here ](https://www.rabbitmq.com/docs/download#:~:text=Linux%2C%20BSD%2C%20UNIX,OTP%20for%20RabbitMQ)
- Suite uses `yarn workspaces` to generate and manage your monorepo. You need to install yarn globally to smoothly run our CLI.
  - Install yarn globally(You may need superuser priviledges).
    ```bash
    sudo npm install yarn -g
    ```
  - Using brew on Mac
    ```bash
    brew install yarn
    ```
- In development, suite uses `nodemon`  and `symbolic links(symlinks)` to watch your code changes in target files in vanilla mode as well as dockerized apps with mapped volumes. 
    ```bash
    sudo npm install nodemon -g
    ```
### Prerequisites(optional)
- To be able to containerize your application you will need to install `docker` on your machine, however, it is not required. You can still run your services in `vanilla mode` using `nodemon` in development mode and `PM2` in production.
  - Install docker for Linux 👉 [here ](https://docs.docker.com/desktop/install/linux-install/)
  - Install docker for Mac 👉 [here ](https://docs.docker.com/desktop/install/mac-install/)
  - Install docker for Windows 👉 [here ](https://docs.docker.com/desktop/install/windows-install/)
- To simulate scaling with kubernetes on your local machine you will need to install `minikube,kubectl,virtul machine(virtualBox)`
  - Install your platform's VirtualBox binary 👉 [here ](https://www.virtualbox.org/wiki/Downloads)
  - Install your platform's minikube binary 👉 [here ](https://minikube.sigs.k8s.io/docs/start/)
  - Install `kubectl` the CLI for communicating with kubernetes clusters within the Virtual Machine which simulates one development node configured by `minikube`
    - Linux binary
      ```bash
      https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
      ```
    - Mac(Intel chip) binary
      ```bash
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
      ```
    - Windows binary
      ```bash
      curl.exe -LO "https://dl.k8s.io/release/v1.30.0/bin/windows/amd64/kubectl.exe"
      ```
- Install `PM2` to run your components in prod
      ```bash
      npm install pm2 -g
      ```

### Basic workflow
- Once installed, you can invoke CLI commands directly from your OS command line through the `suite` executable. See the available `suite` commands by entering the following:
  ```bash
  suite --help
  ```

### Scaffold new repo
- Suite-CLI can help you quickly initialize a new monorepo project and save you alot of project setup and devops overhead. The new project comes ready with our standard file structure with version control and workspaces configured to start code sharing and realize the full power of symlinking:
  ```bash
  suite generate 
  ```

- This is an interactive command that progressively builds the project by selecting options for the name, API architecture to work with, webservers of choice and more.
- When done generating your project you can still generate other components piece-wise like microservice, library or workspace. This makes your development work easier as it automatically builds your package.json or better yet generates a valid workspace compatible with the current project.

### Install dependencies at workspace
- This command lets you install dependencies with more control for where to install. This leverages no-hoisting feature to deliver symlinking close to the relevant workspace.
  ```bash
  suite add <@microservices-suite/<workspace_name>> express axios
  ```

### Docker instances management
- Suite has abstracted away the complexity of working with  `docker compose` and `vanilla docker` commands in monorepo environment by using `suite's` concise and consistent syntax
- Run `docker volume|system prune -f`
  ```bash
  suite prune  [-fav]
  ```
- This command works behaves exactly as docker and if `[-v-a]` flags are passed they specify you are targeting `volumes or al(volumes & system)`. 
- This is part of house keeping that suite exposes to clean up your environemnt when its blotted with dangling images or containers and volumes.
  ```bash
  suite docker:start
  ```
- Start all services in vanilla mode
  - If mode is not specified this command spins services in development environment
  - The mode must match the env extension `.env.[mode]` except production `.env` which does not have an extension
  - you can pass services to start separated with spaces eg `suite start -v supplier-service customer-service`
  - If no services are specified suite spins all services in the `@microservices-suite` workspace
  ```bash
  suite start -v <...services>
  ```
- Start services with docker compose
  - If mode is not specified this command spins services in development environment
  - The mode must match the env extension `.env.[mode]` except production `.env` which does not have an extension
  - you can pass services to start separated with spaces eg `suite start -v supplier-service customer-service`
  - If no services are specified suite spins all services in the `@microservices-suite` workspace
  ```bash
  suite start <service-name...>
  ```
### Package management and release 
- To easily release your builds and generate changelogs, suite makes it easy using `suite release` command
- To publish to npm registry any shared libray simply run the `suite release` passing the name of the library
- Suite will automatically figure out what library in your workspace you are targeting and initiate an interactive release workflow where you will specify the semver.
- To run this command succesfully you need to create one `automation & publish` `auth_token` on your private registry and then run `npm or yarn login`
  ```bash
  suite release [package]
  ```