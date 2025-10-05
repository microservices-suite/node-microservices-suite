module.exports = ({ app, project_base, services = [] }) => {
  if (!Array.isArray(services)) {
    throw new Error('Services must be an array');
  }

  const paths = services
    .map(({ name, port }) => `          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: ${name}
                port:
                  number: ${port}`)
    .join('\n');

  return `
# ${app}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${project_base}
  labels:
    name: ${project_base}
spec:
  rules:
    - host: ${app}.com
      http:
        paths:
${paths}
`;
};
