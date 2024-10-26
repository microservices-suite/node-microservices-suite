module.exports = ({ service, ports }) => `
apiVersion: v1
kind: Service
metadata:
  name: ${service}
spec:
  selector:
    app: ${service}
  ports:
${ports.map(({ name, port, targetPort }) => `  - name: ${name}
    port: ${port}
    targetPort: ${targetPort}`).join('\n')}
`;
