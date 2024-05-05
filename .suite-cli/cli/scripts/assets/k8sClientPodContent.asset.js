module.exports = () => `
apiVersion: v1
kind: Pod
metadata:
  name: supplier-service-pod
  labels:
    component: supplier
spec:
  containers:
    - name: supplier-service
      image: gandie/ecommerce-supplier-service
      resources:
        limits:
          memory: "128Mi"
          cpu: "500m"
      ports:
        - containerPort: 9001
`;