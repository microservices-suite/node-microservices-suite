module.exports = ({ answers, suffix, isMicroservice, description, os }) => (
    {
        name: `${answers.project_base}/${suffix}`,
        version: "1.0.0",
        description,
        main: "index.js",
        author: `${os.userInfo().username}`,
        license: `${answers.license}`,
        publishConfig: {
            access: "public",
            registry: "http://registry.npmjs.org"
        },
        scripts: {
            release: "npx bumpp-version@latest && npm publish",
            ...(isMicroservice ? {
                dev: "NODE_ENV=dev nodemon -q index.js",
                start: "pm2-runtime start ecosystem.config.js --env production",
                stoprod: "pm2 stop ecosystem.config.js",
                deletprod: "pm2 delete ecosystem.config.js",
                test: "jest",
            } : {}
            )
        },
        private: isMicroservice,
    })
    ;