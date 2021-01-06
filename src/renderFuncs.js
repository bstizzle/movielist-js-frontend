//all html rendering functions go here

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
        backButton.textContent = "⬅"
        backButton.style.fontSize = "x-large"
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
                    let reviewBtn = document.createElement("button")
                        reviewBtn.textContent = "Review"
                        reviewBtn.className = 'review-btn'
                    li.append(reviewBtn)
                    watched.append(li)
                } else {
                    let br = document.createElement("br")
                    let btn = document.createElement("button")
                        btn.innerText = 'Watched'
                        btn.className = 'edit-btn'
                    let removeBtn = document.createElement("button")
                        removeBtn.textContent = "Remove"
                        removeBtn.className = 'delete-btn'
                    li.append(br, btn, removeBtn)
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