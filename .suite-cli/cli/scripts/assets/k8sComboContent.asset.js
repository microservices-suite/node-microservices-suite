// module.exports = ({ project_base, app, services = [] }) => {
//   if (!Array.isArray(services)) {
//     throw new Error('Services must be an array');
//   }

//   // Function to generate Deployment for each service
//   const generateDeployment = ({ service, image, port }) => `
// # Deployment for ${service}
// apiVersion: apps/v1
// kind: Deployment
// metadata:
//   name: ${service}
// spec:
//   selector:
//     matchLabels:
//       app: ${service}
//   template:
//     metadata:
//       labels:
//         app: ${service}
//     spec:
//       containers:
//       - name: ${service}
//         image: ${image}
//         resources:
//           limits:
//             memory: "128Mi"
//             cpu: "500m"
//         ports:
//         - containerPort: ${port}
// ---
// `;

//   // Function to generate different types of Services for each service
//   const generateService = ({ service, port, targetPort, type = "ClusterIP", nodePort }) => `
// # Service for ${service} (${type})
// apiVersion: v1
// kind: Service
// metadata:
//   name: ${service}
// spec:
//   type: ${type}
//   selector:
//     app: ${service}
//   ports:
//     - port: ${port}
//       targetPort: ${targetPort || port}
//       ${type === "NodePort" && nodePort ? `nodePort: ${nodePort}` : ""}
// ---
// `;

//   // Function to generate Ingress rules based on services
//   const generateIngress = ({ app, project_base, services }) => {
//     const content = services.map(({ service, port }) => `
//       - pathType: Prefix
//         path: "/${service}/*"
//         backend:
//           service:
//             name: ${service}
//             port:
//               number: ${port}
//     `).join('');

//     return `
// # Ingress for ${app}
// apiVersion: networking.k8s.io/v1
// kind: Ingress
// metadata:
//   name: ${project_base}
//   labels:
//     name: ${project_base}
// spec:
//   rules:
//     - host: ${app}.com
//       http:
//         paths: ${content}
// ---
// `;
//   };

//   // Generate YAML output for each service
//   const servicesYAML = services.map(serviceConfig => {
//     return (
//       generateDeployment(serviceConfig) +
//       generateService({ ...serviceConfig, type: "ClusterIP" }) +
//       generateService({ ...serviceConfig, type: "LoadBalancer" }) +
//       generateService({ ...serviceConfig, type: "NodePort", nodePort: serviceConfig.nodePort })
//     );
//   }).join('\n');

//   // Generate final YAML with all deployments, services, and ingress
//   return `
// # Kubernetes Configuration for ${app}
// ${servicesYAML}
// ${generateIngress({ app, project_base, services })}
// # Add more configurations below if needed
// `;
// };
module.exports = ({ project_base, app, services = [] }) => {
  if (!Array.isArray(services)) {
    throw new Error('Services must be an array');
  }

  // Function to generate Deployment for each service
  const generateDeployment = ({ service, image, port }) => `
# Deployment for ${service}
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
        - containerPort: ${port}
---
`;

  // Function to generate different types of Services for each service
  const generateService = ({ service, port, targetPort, type = "ClusterIP", nodePort }) => `
# Service for ${service} (${type})
apiVersion: v1
kind: Service
metadata:
  name: ${service}
spec:
  type: ${type}
  selector:
    app: ${service}
  ports:
    - port: ${port}
      targetPort: ${targetPort || port}
      ${type === "NodePort" && nodePort ? `nodePort: ${nodePort}` : ""}
---
`;

  // Function to generate Ingress rules based on services
  const generateIngress = ({ app, project_base, services }) => {
    const content = services.map(({ service, port }) => `
          - pathType: Prefix
            path: "/${service}/*"
            backend:
              service:
                name: ${service}
                port:
                  number: ${port}
    `).join('');

    return `
# Ingress for ${app}
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
${content}
---
`;
  };

  // Generate YAML output for each service
  const servicesYAML = services.map(serviceConfig => {
    return (
      generateDeployment(serviceConfig) +
      generateService({ ...serviceConfig, type: "ClusterIP" }) +
      generateService({ ...serviceConfig, type: "LoadBalancer" }) +
      generateService({ ...serviceConfig, type: "NodePort", nodePort: serviceConfig.nodePort })
    );
  }).join('\n');

  // Generate final YAML with all deployments, services, and ingress
  return `
# Kubernetes Configuration for ${app}
${servicesYAML}
${generateIngress({ app, project_base, services })}
# Add more configurations below if needed
`;
};
