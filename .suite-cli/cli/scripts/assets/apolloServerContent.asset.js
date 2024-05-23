module.exports = ({ answers }) => `
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const typeDefs = gql\`
  type Query {
    hello: String
  }
\`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: ${(answers.port + 1000) < 5000 ? 4001 : 8001} }, () =>
  console.log(\`🚀 Server ready at http://localhost:${(answers.port + 1000) < 5000 ? 4001 : 8001}\${server.graphqlPath}\`)
);
`;