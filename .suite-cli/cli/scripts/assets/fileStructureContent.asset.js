module.exports = ({ answers }) => (
    [
        `shared/config`,
        `shared/errors`,
        `shared/utilities`,
        `shared/middlewares`,
        `tests/${answers.service_name}/e2e`,
        `tests/${answers.service_name}/integration`,
        `tests/${answers.service_name}/unit`,
        `tests/${answers.service_name}/snapshot`,
        `microservices`,
        `k8s/${answers.service_name}`,
        `gateways/apps/app1/${answers.webserver}`,
        ...(answers.apis.map((api) => `${api}/app1`)),
    ]
)