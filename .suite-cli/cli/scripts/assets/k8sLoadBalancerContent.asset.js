module.exports = ({ service, ports }) => `
apiVersion: v1
kind: Service
metadata:
  name: ${service}
spec:
  type: LoadBalancer
  selector:
    app: ${service}
  ports:
${ports.map(({ name, port, targetPort, nodePort }) => `    - name: ${name}
      port: ${port}
      targetPort: ${targetPort || port}
      ${nodePort ? `nodePort: ${nodePort}` : ''}`).join('\n')}
`;
