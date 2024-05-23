module.exports = ({ answers }) => `
PORT=${answers.port}
DATABASE_URL=mongodb://localhost:27017
`;