const { ApolloServer, gql } = require("apollo-server");
const { createConnection } = require("mysql");

const connection = createConnection({
    database: "lesson",
    host: "localhost",
    password: "",
    user: "root"
});

connection.connect(() => {
    console.log("connection created")
});

const dbQuery = ({ query }) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if(error) {
                return reject(error);
            }

            resolve(results);
        });
    });
};

const authors = [
    {
        name: "Kate Chopin"
    }, 
    {
        name: "Paul Auster"
    }
];

const books = [
    {
        title: 'The Awakening',
        author: authors[0]
    },
    {
        title: 'City of Glass',
        author: authors[1]
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

    type Todo {
        ID: Int!
        name: String!
    }

    type Query {
        authors: [Author]
        books: [Book]
        todos: [Todo]
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
        authors: () => authors,
        books: () => books,
        todos: async () => {
            try  {
                const todos = await dbQuery({ query: "SELECT * FROM todos" });
                return todos;
            } catch(err) {
                console.error(err);
                return [];
            }
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen()
    .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    })