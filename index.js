const { ApolloServer, gql } = require("apollo-server");

const books = [
    {
      title: 'The Awakening',
      author: {
          name: 'Kate Chopin',
      }
    },
    {
      title: 'City of Glass',
      author: {
          name: 'Paul Auster',
      }
    },
];

const typeDefs = gql`
    type Book {
        title: String!,
        author: Author!
    }

    type Author {
        name: String!
        books: [Book]
    }

    type Query {
        authors: [Author]
        books: [Book]
    }
    
`;

const resolvers = {
    Query: {
        books: () => books
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen()
    .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    })