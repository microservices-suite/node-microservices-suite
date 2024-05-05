module.exports = () => `
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

app.listen({ port: 4000 }, () =>
  console.log(\`🚀 Server ready at http://localhost:\${config.port}\${server.graphqlPath}\`)
);
`;