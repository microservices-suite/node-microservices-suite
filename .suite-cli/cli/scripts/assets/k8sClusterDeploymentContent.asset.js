module.exports = ({ service, image, ports }) => `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service}
spec:
  selector:
    matchLabels:
      app: ${service}
  template:
    metadata:
      labels:
        app: ${service}
    spec:
      containers:
      - name: ${service}
        image: ${image}
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
${ports.map(port => `        - containerPort: ${port}`).join('\n')}
`;
