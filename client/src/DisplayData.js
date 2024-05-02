import React from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";

const QUERY_ALL_USERS = gql`
    query GetAllUsers { 
        users { 
            ...on UsersSuccessResult {
                users {
                    id 
                    name 
                    username 
                    age 
                    nationality
                }
            }
        } 
    }
`;

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies {
            id
            name
        }
    }
`;

const GET_MOVIE_BY_NAME = gql`
    query Movie($name: String!) {
        movie(name: $name) {
            name
            yearOfPublication
            isInTheaters
        }
    }
`;

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            name
            id
        }
    }
`;

function DisplayData() {
    const [movieSearched, setMovieSearched] = useState("");

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState(0);
    const [nationality, setNationality] = useState("");

    const { data: userData, loading: usersLoading, error: usersError, refetch } = useQuery(QUERY_ALL_USERS);
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES);

    const [
        fetchMovie,
        { data: movieSearchedData, error: movieError }
    ] = useLazyQuery(GET_MOVIE_BY_NAME);

    const [createUser] = useMutation(CREATE_USER_MUTATION);
    
    if(usersLoading) {
        return <div><h1>DATA IS LOADING...</h1></div>
    }

    if(usersError) {
        console.log(usersError)
    }

    if(movieError) {
        console.log(movieError);
    }
    
    return (<div>
                <div>
                    <input 
                            type="text" 
                            placeholder="Name..." 
                            onChange={(event) => {
                                setName(event.target.value);
                            }} 
                    />
                    <input 
                            type="text" 
                            placeholder="Username..."
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }} 
                    />
                    <input 
                            type="number" 
                            placeholder="Age..." 
                            onChange={(event) => {
                                setAge(Number(event.target.value));
                            }}
                    />
                    <input 
                            type="text" 
                            placeholder="Nationality..."
                            onChange={(event) => {
                                setNationality(event.target.value.toUpperCase());
                            }}
                    />
                    <button
                            onClick={() => {
                                createUser({
                                    variables: {
                                        input: { name, username, age, nationality }
                                    }
                                });

                                refetch();
                            }}
                    >
                        Create User
                    </button>
                </div>
                {userData && (<h1>List Of Users</h1>)}
                {userData && 
                        userData.users.users.map((user) => {
                            return (<p key={user.id}>
                                        User <b>
                                                {user.name}
                                            </b> a.k.a <i>
                                                            {user.username}
                                                        </i> is {user.age} years 
                                        old and comes from {user.nationality}.
                                    </p>)
                        })
                }

                {movieData && (<h1>List Of Movies</h1>)}
                {movieData && 
                    movieData.movies.map((movie) => {
                        return (<li key={movie.id}> {movie.name} </li>)
                    })
                }

                <div>
                    <input 
                            type="text" 
                            placeholder="Interstellar..." 
                            onChange={(event) => {
                                setMovieSearched(event.target.value);
                            }} 
                    />
                    <button onClick={() => {
                                fetchMovie({
                                    variables: {
                                        name: movieSearched
                                    }
                                });
                            }}
                    >
                        Fetch Data
                    </button>
                    <div>
                        {movieError && <p>That movie is not recorded in our base.</p>}

                        {movieSearchedData && `${movieSearchedData.movie.name}, published in\
                                                 ${movieSearchedData.movie.yearOfPublication} is \
                                                 ${movieSearchedData.movie.isInTheaters && "not"} in the theaters.`}
                    </div>
                </div>
            </div>);
}

export default DisplayData;

// curl --request POST   --header 'content-type: application/json'   --url http://localhost:4000/graphql   --data '{"query":"query GetAllUsers { users { id, name, username } }"}'
