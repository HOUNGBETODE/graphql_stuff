const { UserList, MovieList } = require("../FakeData")
const _ = require("lodash")

/*
*   parent (we talk about levels here)
*           query => users => favoriteMovies (example)
*
*   args (to access resolvers' parameters)
*
*   context (is useful for authentication and authorization stuff, and passing data every through out every resolvers)
*           context is a function that returns an object
*
*   info (used to get useful informations about the query made)
*
* --------------------------------------------------------------------------------------------------------------------
*
*   Fragment helps write clean code by creating reusable blocks. It's based on a specific type.
*               query GetAllUsers {
*                    users {
*                        ...GetAgeAndUsername
*                    }
*                }
*
*                fragment GetAgeAndUsername on User {
*                    age
*                    username
*                }
*
*   Union helps handle errors
*/

const resolvers = {
    Query: {
        // USER RESOLVERS
        users: () => {
            // return UserList
            if(UserList) return { users: UserList };

            return { message: "Yo, there was an error." }
        },
        user: (parent, args, context, info) => {
            // UserList.filter((user) => (user.id === parseInt(id)))[0]
            const id = args.id
            const user = _.find(UserList, { id: Number(id) })
            return user
        },

        // MOVIE RESOLVERS
        movies: () => {
            return MovieList
        },
        movie: (parent, args) => {
            const name = args.name
            const movie = _.find(MovieList, { name })
            return movie
        },
    },

    User: {
        favoriteMovies: () => {
            return _.filter(
                MovieList, 
                (movie) => movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
            )
        }
    },

    Mutation: {
        createUser: (parent, args) => {
            const user = args.input
            const lastId = UserList[UserList.length - 1].id
            user.id = lastId + 1
            UserList.push(user)
            return user
        },
        updateUsername: (parent, args) => {
            const { id, newUsername } = args.input
            let userUpdated
            UserList.forEach((user) => {
                if(user.id === Number(id)) {
                    user.username = newUsername
                    userUpdated = user
                }
            }) 
            return userUpdated
        },
        deleteUser: (parent, args) => {
            const id = args.id
            _.remove(UserList, (user) => user.id === Number(id))
            return null
        }
    },

    UsersResult: {
        __resolveType(obj) {
            if(obj.users) {
                return "UsersSuccessResult";
            }
            if(obj.message) {
                return "UsersErrorResult";
            }
            return null;
        }
    }
}

module.exports = { resolvers }
