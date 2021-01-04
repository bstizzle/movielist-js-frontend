// Global Variables
const BASE_URL = "http://localhost:3000"
const MOVIES_URL = `${BASE_URL}/movies`

let allMovies = []

// DOM Elements
const main = document.querySelector("main")

//******  Functions  ******//

const renderMovieCard = (movieObj) => {
    console.log(movieObj)
    let cardDiv = document.createElement("div")
        cardDiv.classList.add("card")
        cardDiv.dataset.movieId = movieObj.id
        cardDiv.dataset.userId = 1 //will be set by cookie when user logs in
    let img = document.createElement("img")
        img.className = 'poster'
        img.src = movieObj.image
    let head = document.createElement('h3')
        head.textContent = movieObj.title
    let genreDiv = document.createElement("div")
        genreDiv.textContent = movieObj.genre
    let yearDiv = document.createElement("div")
        yearDiv.textContent = movieObj.year

    cardDiv.append(img, head, genreDiv, yearDiv)
    main.append(cardDiv)
}

const renderSelectedMovie = (movieId) => {
    console.log(movieId)
    let movie = allMovies.find(movie => movie.id === parseInt(movieId, 10))

    console.log(movie)

    let movieDiv = document.createElement("div")
        movieDiv.className = ("selectedMov")
    let header = document.createElement("h1")
        header.textContent = movie.title
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
        backButton.textContent = "Back"

    ul.append(liDesc, liYear, liGenre)
    movieDiv.append(backButton, header, img, ul)
    main.append(movieDiv)
}


//******  Event Listeners  ******//

main.addEventListener('click', event => {
    let target = event.target
    if(target.className === 'card'){
        console.log(target.dataset.movieId)
        let movieId = target.dataset.movieId
        main.innerHTML = ''
        renderSelectedMovie(movieId)

    } else if(target.className === 'back-button') {
        console.log(target)
        main.innerHTML = ''
        fetchMovies();
    }
    
    
})




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

fetchMovies();

//IF statement
//if clicking on a movie from index, overwright with just the selected movie
//if clicking on enlarged movie, overwright with whole movie index