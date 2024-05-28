module.exports = ({ answers, suffix, isMicroservice, description, os, addDeps }) => ({
    name: `${answers.project_base}/${suffix}`,
    version: "1.0.0",
    description,
    main: "index.js",
    author: `${os.userInfo().username}`,
    license: `${answers.license}`,
    ...(isMicroservice && addDeps && {
        dependencies: {
            [`${answers.project_base}/config`]: "1.0.0",
            [`${answers.project_base}/errors`]: "1.0.0",
            [`${answers.project_base}/utilities`]: "1.0.0",
            [`${answers.project_base}/validations`]: "1.0.0",
            dotenv: "^16.4.5",
            express: "^4.18.3",
            helmet: "^7.1.0",
            mongodb: "^6.5.0",
            mongoose: "^8.2.1",
            morgan: "^1.10.0",
            pm2: "^5.3.1",
            winston: "^3.12.0"
        },
        devDependencies: {
            nodemon: "^3.1.0"
        },
        workspaces: {
            nohoist: [
                `**/${answers.project_base}/utilities/`,
                `**/${answers.project_base}/utilities/**`,
                `**/${answers.project_base}/errors/`,
                `**/${answers.project_base}/errors/**`,
                `**/${answers.project_base}/config/`,
                `**/${answers.project_base}/config/**`
            ]
        },
    }),
    publishConfig: {
        access: "public",
        registry: "http://registry.npmjs.org"
    },
    scripts: {
        release: "npx bumpp-version@latest && npm publish",
        ...(isMicroservice && {
            dev: os.platform() === 'win32' ? 'set NODE_ENV=dev && nodemon --legacy-watch -q index.js' : 'NODE_ENV=dev nodemon --legacy-watch -q index.js',
            start: "pm2-runtime start ecosystem.config.js --env production",
            stoprod: "pm2 stop ecosystem.config.js",
            deletprod: "pm2 delete ecosystem.config.js",
            test: "jest"
        })
    },
    private: isMicroservice
});
