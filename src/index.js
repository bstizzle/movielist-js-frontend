// Global Variables
// const BASE_URL = "http://localhost:3000"
// const HOST_URL = "https://movielist-js-backend.herokuapp.com"
// const MOVIES_URL = `${BASE_URL}/movies`
let userId = 0;

let allMovies = []
let allUsers = []
let allUserMovies = []

// DOM Elements
const main = document.querySelector("main")
const login = document.querySelector(".login")
const watchlist = document.querySelector(".watchlist")
const unwatched = document.querySelector(".unwatched")
const watched = document.querySelector(".watched")
const searchForm = document.querySelector("#movie-search-input")


//******  Functions  ******//
const boolSwitch = (event) => {
    console.log(event.target)
    let id = event.target.parentElement.dataset.userMovieId
    fetch(`${HOST_URL}/user_movies/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
            watched: true
        })
    })
        .then(resp => resp.json())
        .then(newUserMovieObj => {
            renderWatchlist(userId)
        })
}

const removeMovie = (event) => {
    let id = event.target.parentElement.dataset.userMovieId
    fetch(`${HOST_URL}/user_movies/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            }
    })
        .then(resp => resp.json())
        .then(json => {
            counter = 0
            allUserMovies.forEach(userMovie => {
                if(userMovie.id === json.id){
                    // console.log(userMovie.id)
                    // console.log(json.id)
                    let index = allUserMovies.indexOf(userMovie)
                    allUserMovies.splice(index)
                }
            })
            renderWatchlist(userId)
        })
}

const addMovie = (event) => {
    if(event.target.matches('button')){
        let movieId = event.target.closest(".selectedMov").dataset.movieId
        let filter = allUserMovies.filter(user_movie => user_movie.user_id === userId)
        let secondFilter = filter.find(user_movie => user_movie.movie_id === parseInt(movieId))
        if(secondFilter !== undefined) {
            console.log(secondFilter)
            console.log("found match")
            alert("This movie is already on your list!")
        } else {
            if(event.target.className === 'watched-button'){
                console.log("watched")
                postUserMovie(userId, movieId, true)
            } else if(event.target.className === 'want-button'){
                console.log("want to watch")
                postUserMovie(userId, movieId, false)
            }
        }
        
    }
}

const postUserMovie = (userId, movieId, boolean) => {
    fetch(`${HOST_URL}/user_movies`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            movie_id: movieId,
            watched: boolean
        })
    })
        .then(resp => resp.json())
        .then(json => {
            allUserMovies.push(json)
            renderWatchlist(userId)
        })
}

const patchReview = (userMovieId, reviewText, reviewRating) => {
    fetch(`${HOST_URL}/user_movies/${userMovieId}`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            review: reviewText,
            rating: reviewRating
        })
    })
        .then(resp => resp.json())
        .then(data => {
            fetchUserMovies()
        }).then(data => {
            renderReviews()
        })
}

//******  Event Listeners  ******//
searchForm.addEventListener('keyup', event => {
    event.preventDefault()
    main.innerHTML = ''
    let searchString = event.target.value.toLowerCase()
    //console.log(searchString)
    let movieArray = allMovies.filter(movie => movie.title.toLowerCase().includes(searchString))
    console.log(movieArray)
    movieArray.forEach(movie => {
        renderMovieCard(movie)
    })
    
})

main.addEventListener('click', event => {
    let target = event.target
    if(target.parentElement) {
        if(target.parentElement.className === 'card'){
            console.log(target.dataset.movieId)
            let movieId = target.parentElement.dataset.movieId
            setTimeout(function(){
                main.innerHTML = ''
                renderSelectedMovie(movieId)
            }, 50)

        } else if(target.className === 'back-button') {
            console.log(target)
            main.innerHTML = ''
            allMovies.forEach(movie => renderMovieCard(movie))
        }
    }
})

login.addEventListener("submit", event => {
    event.preventDefault()
    let lgnBtn = document.querySelector(".login-button")
    if(lgnBtn.value === "Login") {
        console.log(event.target)
        let user = event.target.username.value
        allUsers.forEach(element => {
            if(element.username === user){
                console.log(element.id)
                userId = element.id
                alert("Logged In!")
                renderWatchlist(userId)
            }
        })
        if(userId === 0){
            fetch(`${HOST_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify({
                    username: event.target.username.value
                })
            })
                .then(resp => resp.json())
                .then(newUser => {
                    userId = newUser.id
                    alert("No user with that name, created new account for you :)")
                    renderWatchlist(userId)
                })
        }
        login.innerHTML = `
            <label>Welcome, ${login.username.value}</label><br>
            <input class="login-button" type="submit" value="Logout">
        `
        // lgnBtn.value = "Logout"
    } else if(lgnBtn.value === "Logout") {
        userId = 0
        alert("Logged Out!")
        unwatched.innerHTML = ''
        watched.innerHTML = ''
        login.innerHTML = `
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username"><br>
            <input class="login-button" type="submit" value="Login">
        `
    }
})

watched.addEventListener("click", event => {
    let userMovieId = event.target.parentElement.dataset.userMovieId
    if (event.target.matches("button")) {
        renderReviewForm(userMovieId)
    }
})



// Initial fetch for all movies
const fetchMovies = () => {
    fetch(`${HOST_URL}/movies`)
        .then(response => response.json())
        .then(moviesArray => {
            allMovies = moviesArray
            // console.log(moviesArray)
            moviesArray.forEach(movie => renderMovieCard(movie))
        })
}

const fetchUsers = () => {
    fetch(`${HOST_URL}/users`)
        .then(response => response.json())
        .then(usersArray => {
            //console.log(usersArray)
            allUsers = usersArray
        })
}

const fetchUserMovies = () => {
    fetch(`${HOST_URL}/user_movies`)
        .then(response => response.json())
        .then(userMoviesArray => {
            //console.log(userMoviesArray)
            allUserMovies = userMoviesArray
        })
}

fetchMovies();
fetchUsers();
fetchUserMovies();
