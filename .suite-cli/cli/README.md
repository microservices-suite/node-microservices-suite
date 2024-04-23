# Microservices Suite

## suite-cli: Monorepo CLI Tool (The mono-repo Manager 🦧)

### Installation

To install `suite-cli` and save it in your `devDependencies`, run the following command:

```bash
yarn add -D @microservices-suite/cli
```

### Usage
- Install dependencies
```bash
suite install
```
- Install dependencies at workspace
```bash
suite add <workspace> express axios
```
- Check if docker is running
```bash
suite do, docker:check 
```
- Start docker daemon
```bash
suite docker:start
```
