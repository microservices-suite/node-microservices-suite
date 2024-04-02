# Microservices Suite

## Libraries folder
## DRY lives here 😎

All reusable code should live here. You can use `no-hoist` to symlink this files as packages close to your working directory by adding them to the root package.json or root of your workspace. 
```json
  "workspaces": {
    "nohoist": [
      "**/@microservices-suite/<foo>",   
    ]
  }
```
Checkout:- 
    -  [yarn no-hoist](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)
    -  [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
    -  [yarn workspace](https://classic.yarnpkg.com/lang/en/docs/cli/workspace/)

This means you do not need to rebuild your app in development as your changes are `synchronized` by yarn workspace tool.
When your libraries pass all tests simply `yarn publish | npm publish` to `@microservices-suite` private registry to easily install them in production 🔥