module.exports = ({ sep, answers }) => (
    [
        `shared${sep}config`,
        `shared${sep}errors`,
        `shared${sep}utilities`,
        `shared${sep}middlewares`,
        `tests${sep}microservice1${sep}e2e`,
        `tests${sep}microservice1${sep}integration`,
        `tests${sep}microservice1${sep}unit`,
        `tests${sep}microservice1${sep}snapshot`,
        `microservices`,
        `k8s${sep}microservice1`,
        `gateways${sep}apps${sep}app1${sep}${answers.webserver}`,
        ...(answers.apis.map((api) => `${api}${sep}app1`)),
    ]
)