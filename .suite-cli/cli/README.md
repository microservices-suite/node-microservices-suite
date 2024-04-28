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

- Install dependencies
```bash
suite --help
```

### UsageBasic workflow#

- Once installed, you can invoke CLI commands directly from your OS command line through the `suite` executable. See the available `suite` commands by entering the following:
```bash
suite install
```

- Get help on an individual command using the following construct. Substitute any command, like `host`, `docker:start`, etc., where you see `start` in the example below to get detailed help on that command:
```bash
suite start --help
```
- Install dependencies at workspace
```bash
suite add <@microservices-suite/<workspace_name>> express axios
```
- Check if docker is running
```bash
suite do, docker:check 
```
- Start docker daemon
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