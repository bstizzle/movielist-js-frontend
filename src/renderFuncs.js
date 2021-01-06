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
        liYear.className = 'info'
        liYear.textContent = movie.year
    let liGenre = document.createElement("li")
        liGenre.className = 'info'
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
    let reviewButton = document.createElement("button")
        reviewButton.className = "review-button"
        reviewButton.textContent = "See Reviews"
    buttonDiv.addEventListener("click", addMovie)
    reviewButton.addEventListener("click", renderReviews)

    ul.append(liDesc, liYear, liGenre)
    buttonDiv.append(watchedButton, wantButton)
    movieDiv.append(backButton, reviewButton, img, ul, buttonDiv)
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

const renderReviewForm = (userMovieId) => {
    let userMovieObj = allUserMovies.find(user_movie => user_movie.id === parseInt(userMovieId))
    let movie = document.querySelector(".selectedMov")
    let ul = document.querySelector(".movie-info")
    let div = document.querySelector(".button-div")
    movie.removeChild(ul)
    movie.removeChild(div)

    console.log(userMovieId)
    let form = document.createElement("form")
    form.className = 'review-form'
    form.innerHTML = `
        <br>
        <label for="review">Review:</label><br>
        <textarea id="review" name="review">${userMovieObj.review}</textarea>
        <br>
        <input class="login-button" type="submit" value="Submit">
    `
    movie.append(form)

    form.addEventListener("submit", event => {
        event.preventDefault()
        let text = event.target.review.value
        console.log(text)
        patchReview(userMovieId, text)
    })
}

const renderReviews = () => {
    let movie = document.querySelector(".selectedMov")

    if(document.querySelector(".movie-info")) {
        let ul = document.querySelector(".movie-info")
        let div = document.querySelector(".button-div")
        let revBtn = document.querySelector(".review-button")
        movie.removeChild(ul)
        movie.removeChild(div)
        movie.removeChild(revBtn)
    } else {
        let form = document.querySelector(".review-form")
        let revBtn = document.querySelector(".review-button")
        movie.removeChild(form)
        movie.removeChild(revBtn)
    }

    let movieId = movie.dataset.movieId
    fetch(`http://localhost:3000/user_movies`)
        .then(resp => resp.json())
        .then(userMovies => {
            let matchedUserMovies = userMovies.filter(userMovie => userMovie.movie_id === parseInt(movieId, 10))
            console.log(matchedUserMovies)
            let reviewUl = document.createElement("ul")
            matchedUserMovies.forEach(userMovie => renderRev(userMovie, reviewUl))
            movie.append(reviewUl)
        })
}

const renderRev = (userMovie, reviewUl) => {
    if(userMovie.watched === true) {
        let reviewLi = document.createElement("li")
        reviewLi.innerText = userMovie.review
        reviewUl.append(reviewLi)
    }
}