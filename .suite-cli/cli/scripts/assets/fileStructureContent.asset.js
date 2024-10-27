module.exports = ({ answers }) => (
    [
        `shared/config`,
        `shared/errors`,
        `shared/utilities`,
        `shared/middlewares`,
        `shared/broker`,
        `tests/${answers.service_name}/e2e`,
        `tests/${answers.service_name}/integration`,
        `tests/${answers.service_name}/unit`,
        `tests/${answers.service_name}/snapshot`,
        `microservices`,
        `k8s/${answers.service_name}`,
        `docker/apps`,
        ...(answers.apis.map((api) => `${api}/app1`)),
    ]
)