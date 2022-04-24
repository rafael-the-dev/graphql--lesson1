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

const addBook = ({ authorName, bookTitle}) => {
    books.push({
        title: bookTitle,
        author: {
            name: authorName
        }
    });
};

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

    type Mutation {
        addBook(title: String, author: String): Book
    }
    
`;

const resolvers = {
    Mutation: {
        addBook: (_, { title, author }) => {
            addBook({ authorName: author, bookTitle: title });
            return books[books.length - 1];
        }
    },
    Query: {
        books: () => books
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen()
    .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    })