# Microservices Suite

## suite-cli: Monorepo CLI Tool (The mono-repo Manager 🦧)

### Installation

In this guide we describe using `npm` to install packages. Other package managers may be used at your discretion. With npm, you have several options available for managing how your OS command line resolves the location of the `suite CLI` binary file. Here, we describe installing the `suite` binary globally using the -g option. This provides a measure of convenience, and is the approach we assume throughout the documentation. Note that installing any `npm` package globally leaves the responsibility of ensuring they're running the correct version up to the user.  It also means that if you have different projects, each will run the same version of the CLI. A reasonable alternative is to use the npx program, built into the npm cli (or similar features with other package managers) to ensure that you run a managed version of the `Suite` CLI. We recommend you consult the npx documentation and/or your DevOps support staff for more information.To install `suite-cli` globally, run the following command:

Install the CLI globally using the `npm install -g` command (see the **Note** above for details about global installs).

```bash
npm install -g @microservices-suite/cli
```
**HINT**
Alternatively, you can use this command `npx @microservices-suite/cli@latest` without installing the cli globally.

### Basic workflow
- Once installed, you can invoke CLI commands directly from your OS command line through the `suite` executable. See the available `suite` commands by entering the following:
```bash
suite --help
```

- Get help on an individual command using the following construct. Substitute any command, like `host`, `docker:start`, etc., where you see `start` in the example below to get detailed help on that command:
```bash
suite start --help
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
