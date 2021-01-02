// Global Variables
const BASE_URL = "http://localhost:3000"
const MOVIES_URL = `${BASE_URL}/movies`

let allMovies = []

// Initial fetch for all movies
const fetchMovies = () => {
    fetch(MOVIES_URL)
        .then(response => response.json())
        .then(moviesArray => {
            allMovies = moviesArray
            console.log(moviesArray)
        })
}
