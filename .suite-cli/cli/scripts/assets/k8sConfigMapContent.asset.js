module.exports = ({ service, port, project_base, env, namespace, app }) => `
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${service}
data:
  PORT: '${port}'
  DATABASE_URL: mongodb://mongodb:27017/${project_base}_${service}_${env}_db
  EXCHANGE: '${project_base}/k8s/${namespace}/${app}'
  AMQP_HOST: amqp://rabbitmq:5672
`;