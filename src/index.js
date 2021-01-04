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
        cardDiv.dataset.userId = 1 //will be set by cookie when user logs in
    let img = document.createElement("img")
        img.src = movieObj.image
    let head = document.createElement('h3')
        head.textContent = movieObj.title
    let movieInfoDiv = document.createElement("div")
        movieInfoDiv.classList.add("movie-info")
    let pInfo = document.createElement("p")
        pInfo.textContent = movieObj.synopsis

    movieInfoDiv.append(pInfo)
    cardDiv.append(head,movieInfoDiv)
    main.append(cardDiv)
}


//******  Event Listeners  ******//




// Initial fetch for all movies
const fetchMovies = () => {
    fetch(MOVIES_URL)
        .then(response => response.json())
        .then(moviesArray => {
            allMovies = moviesArray
            console.log(moviesArray)
            //moviesArray.forEach(movie => renderMovieCard(movie))
        })
}
