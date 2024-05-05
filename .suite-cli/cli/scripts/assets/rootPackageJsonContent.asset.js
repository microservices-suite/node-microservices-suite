module.exports = ({ answers, os, sep }) => ({
    name: `${answers.project_base}${sep}${answers.repo_name}`,
    version: "1.0.0",
    description: "This is a microservices project",
    main: "index.js",
    scripts: {
        "test": "jest",
        "dev": "NODE_ENV=dev nodemon -q index.js",
        "start": "pm2-runtime start ecosystem.config.js --env production",
        "stop:prod": "pm2 stop ecosystem.config.js",
        "delete:prod": "pm2 delete ecosystem.config.js"
    },
    "author": os.userInfo().username,
    "license": answers.license,
    "private": answers.private,
    "scripts": {
        "repo:reset": `find ..${sep}${answers.repo_name} -type d -name 'node_modules' -exec rm -rf {} + && find ..${sep}${answers.repo_name} -type f -name 'package-lock.json' -delete && find ..${sep}${answers.repo_name} -type f -name 'yarn.lock' -delete && find ..${sep}${answers.repo_name} -type d -name 'yarn-*' -exec rm -rf {} +`,
        "repo:reset:1": "rm -rf node_modules",
        "generate:release": "npx changelogen@latest --release",
        "release:config": `yarn workspace ${answers.project_base}/config run release`,
        "release:errors": `yarn workspace ${answers.project_base}/errors run release`,
        "release:middlewares": `yarn workspace ${answers.project_base}/middlewares run release`,
        "release:utilities": `yarn workspace ${answers.project_base}/utilities run release`,
        "test": "jest"
    },
    "workspaces": {
        "packages": [
            `microservices${sep}*`,
            `shared${sep}*`,
        ],
        "nohoist": [
            `**${sep}${answers.project_base}${sep}utilities`,
            `**${sep}${answers.project_base}${sep}errors`,
            `**${sep}${answers.project_base}${sep}config`,
            `**${sep}${answers.project_base}${sep}middleware`
        ]
    },
})