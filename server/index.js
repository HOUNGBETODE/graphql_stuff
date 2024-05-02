const { ApolloServer } = require("apollo-server")

const { typeDefs } = require("./schema/type-defs")

const { resolvers } = require("./schema/resolvers")

const server = new ApolloServer({
   typeDefs, 
   resolvers,
   context: ({ req }) => {
    return { name: "Pedro" }
   }
})
// typeDefs store our API types definitions for objects
// resolvers contains all mutations handled by that API

server.listen()
      .then(({ url }) => {
        console.log(`YOUR API IS RUNNING AT: ${url} :)`)
      })
