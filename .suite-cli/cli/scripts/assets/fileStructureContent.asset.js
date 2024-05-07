module.exports = ({ sep, answers }) => (
    [
        `shared${sep}config`,
        `shared${sep}errors`,
        `shared${sep}utilities`,
        `shared${sep}middlewares`,
        `tests${sep}${answers.service_name}${sep}e2e`,
        `tests${sep}${answers.service_name}${sep}integration`,
        `tests${sep}${answers.service_name}${sep}unit`,
        `tests${sep}${answers.service_name}${sep}snapshot`,
        `microservices`,
        `k8s${sep}${answers.service_name}`,
        `gateways${sep}apps${sep}app1${sep}${answers.webserver}`,
        ...(answers.apis.map((api) => `${api}${sep}app1`)),
    ]
)