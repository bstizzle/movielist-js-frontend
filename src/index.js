// Global Variables
const BASE_URL = "http://localhost:3000"
const MOVIES_URL = `${BASE_URL}/movies`
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

const renderMovieCard = (movieObj) => {
    console.log(movieObj)
    let cardDiv = document.createElement("div")
        cardDiv.classList.add("card")
        cardDiv.dataset.movieId = movieObj.id
    let img = document.createElement("img")
        img.className = 'poster'
        img.src = movieObj.image

    cardDiv.append(img)
    main.append(cardDiv)
}

const renderSelectedMovie = (movieId) => {
    console.log(movieId)
    let movie = allMovies.find(movie => movie.id === parseInt(movieId, 10))

    console.log(movie)
    let emptyDiv1 = document.createElement("div")
        emptyDiv1.className = "empty"
    let emptyDiv2 = document.createElement("div")
        emptyDiv2.className = "empty"

    let movieDiv = document.createElement("div")
        movieDiv.className = "selectedMov"
        movieDiv.dataset.movieId = movieId
    let img = document.createElement("img")
        img.src = movie.image
        img.className = "big-poster"

    let ul = document.createElement("ul")
        ul.className = 'movie-info'
    let liDesc = document.createElement("li")
        liDesc.textContent = movie.synopsis
    let liYear = document.createElement("li")
        liYear.textContent = movie.year
    let liGenre = document.createElement("li")
        liGenre.textContent = movie.genre
    let backButton = document.createElement("button")
        backButton.className = 'back-button'
        backButton.textContent = "<"
    let buttonDiv = document.createElement("div")
        buttonDiv.className = "button-div"
    let watchedButton = document.createElement("button")
        watchedButton.className = "watched-button"
        watchedButton.textContent = "Watched"
    let wantButton = document.createElement("button")
        wantButton.className = "want-button"
        wantButton.textContent = "Want to Watch"
    buttonDiv.addEventListener("click", addMovie)

    ul.append(liDesc, liYear, liGenre)
    buttonDiv.append(watchedButton, wantButton)
    movieDiv.append(backButton, img, ul, buttonDiv)
    main.append(emptyDiv1, movieDiv, emptyDiv2)
}

const renderWatchlist = (userId) => {
    fetch(`http://localhost:3000/users/${userId}`)
        .then(resp => resp.json())
        .then(user => {
            watched.innerHTML = ''
            unwatched.innerHTML = ''
            user.user_movies.forEach(element => {
                let li = document.createElement("li")
                li.dataset.userMovieId = element.id
                li.innerText = element.movie.title
                li.addEventListener('click', event => {
                    main.innerHTML = ''
                    renderSelectedMovie(element.movie.id)
                })

                if(element.watched === true){
                    watched.append(li)
                } else {
                    let btn = document.createElement("button")
                        btn.innerText = 'Watched'
                        btn.className = 'edit-btn'
                    let removeBtn = document.createElement("button")
                        removeBtn.textContent = "Remove"
                        removeBtn.className = 'delete-btn'
                    li.append(btn, removeBtn)
                    unwatched.append(li)
                    li.addEventListener('click', event => {
                        if(event.target.matches('.edit-btn')){
                            boolSwitch(event)
                        } else if (event.target.matches(".delete-btn")) {
                            removeMovie(event)
                        }
                    })
                }
            })
        })
}

const boolSwitch = (event) => {
    console.log(event.target)
    let id = event.target.parentElement.dataset.userMovieId
    fetch(`http://localhost:3000/user_movies/${id}`, {
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
    fetch(`http://localhost:3000/user_movies/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            }
    })
        .then(resp => resp.json())
        .then(newUserMovieObj => {
            renderWatchlist(userId)
        })
}

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

//******  Event Listeners  ******//

main.addEventListener('click', event => {
    let target = event.target
    console.log(target.parentElement.className)
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
            fetch(`http://localhost:3000/users`, {
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
        lgnBtn.value = "Logout"
    } else if(lgnBtn.value === "Logout") {
        userId = 0
        alert("Logged Out!")
        unwatched.innerHTML = ''
        watched.innerHTML = ''
        lgnBtn.value = "Login"
    }
})

const addMovie = (event) => {
    if(event.target.matches('button')){
        let movieId = event.target.closest(".selectedMov").dataset.movieId
        if(event.target.className === 'watched-button'){
            console.log("watched")
            postUserMovie(userId, movieId, true)
        } else if(event.target.className === 'want-button'){
            console.log("want to watch")
            postUserMovie(userId, movieId, false)
        }
    }
}

const postUserMovie = (userId, movieId, boolean) => {
    fetch(`http://localhost:3000/user_movies`, {
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
        .then(newUserMovieObj => {
            renderWatchlist(userId)
        })
}


// Initial fetch for all movies
const fetchMovies = () => {
    fetch("http://localhost:3000/movies")
        .then(response => response.json())
        .then(moviesArray => {
            allMovies = moviesArray
            console.log(moviesArray)
            moviesArray.forEach(movie => renderMovieCard(movie))
        })
}

const fetchUsers = () => {
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(usersArray => {
            //console.log(usersArray)
            allUsers = usersArray
        })
}

const fetchUserMovies = () => {
    fetch("http://localhost:3000/user_movies")
        .then(response => response.json())
        .then(userMoviesArray => {
            //console.log(userMoviesArray)
            allUserMovies = userMoviesArray
        })
}

fetchMovies();
fetchUsers();
fetchUserMovies();