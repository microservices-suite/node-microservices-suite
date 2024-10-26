module.exports = ({ service }) => `
apiVersion: v1
kind: Secret
metadata:
  name: ${service}
type: Opaque
data:
  password: somepassword
`;