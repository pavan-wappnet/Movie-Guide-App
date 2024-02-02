//Initial References
let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let searchSuggestionsContainer = document.getElementById("search-suggestions");
let watchlistContainer = document.getElementById("watchlist");
let wishlistPopup = document.getElementById("wishlist-popup");
let wishlistMenu = document.getElementById("wishlist-items");
let searchPerformed = false;

let movies =[];
//Function to fetch data from API
let getMovie = () => {
  let movieName = movieNameRef.value;
  let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${key}`;
  //If input field is empty
  if (movieName.length <= 0) {
    result.innerHTML = `<h3 class="msg">Please Enter A Movie Name</h3>`;
  }
  //If input field is NOT empty
  else {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        //If movie exists in database
        if (data.Response == "True") {
          result.innerHTML = `
            <div class="info">
                <img src=${data.Poster} class="poster">
                <div>
                    <h2>${data.Title}</h2>
                    <div class="rating">
                        <img src="star-icon.svg">
                        <h4>${data.imdbRating}</h4>
                    </div>
                    <div class="details">
                        <span>${data.Rated}</span>
                        <span>${data.Year}</span>
                        <span>${data.Runtime}</span>
                    </div>
                    <div class="genre">
                        <div>${data.Genre.split(",").join("</div><div>")}</div>
                    </div>
                </div>
            </div>
            <h3>Plot:</h3>
            <p>${data.Plot}</p>
            <h3>Cast:</h3>
            <p>${data.Actors}</p>
            
        `;
        }
        //If movie does NOT exists in database
        else {
          result.innerHTML = `<h3 class='msg'>${data.Error}</h3>`;
        }
      })
      //If error occurs
      .catch(() => {
        result.innerHTML = `<h3 class="msg">Error Occured</h3>`;
      });
  }
  displayMovies();
};

function displayMovies() {
  // Retrieve the selected sorting and filtering options
  let sortBy = document.getElementById("sort-by").value;
  let filterBy = document.getElementById("filter-by").value;

  // Apply sorting
  if (sortBy === "rating") {
    movies.sort((a, b) => b.rating - a.rating); // Sort by descending rating
  } else if (sortBy === "title") {
    movies.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
  }
  // Add more sorting options as needed

  // Apply filtering
  let filteredMovies = movies; // Assuming 'movies' is your original movie data array
  if (filterBy === "rated-above-8") {
    filteredMovies = movies.filter(movie => movie.rating > 8);
  } else if (filterBy === "all") {
    // Reset the movies array to include all movies
    filteredMovies = [...movies]; // Use 'movies' here
  }
  // Add more filtering options as needed

  // Display the updated movies
  // Replace this part with your code to display movies on the UI
  if (filteredMovies.length > 0) {
    console.log("Sorted and Filtered Movies:", filteredMovies);
  } else {
    result.innerHTML = `<h3 class="msg">There are no movies for the selected filter.</h3>`;
  }
}

// Function to apply sorting when the sorting option changes
function applySorting() {
  displayMovies();
}

// Function to apply filtering when the filtering option changes
function applyFiltering() {
  displayMovies();
}

// Call displayMovies initially to show all movies
displayMovies();

let addToWishlistFlag = false;

function addToWishlist() {
  if (!addToWishlistFlag) {
    addToWishlistFlag = true;
  let movieTitle = document.querySelector('.info h2');
  if (movieTitle) {
    movieTitle = movieTitle.textContent;
    addToWishlist(movieTitle);
    addToWishlistMenu(movieTitle);
    }
    addToWishlistFlag = false;
  }
}

function addToWishlistMenu(movieTitle) {
  if (wishlistMenu) {
    wishlistMenu.style.display = 'block';
    let li = document.createElement('li');
    li.textContent = movieTitle;

    
    // Add remove button
    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = function () {
      removeFromWishlist(movieTitle);
      li.remove();
      // Add any additional logic here if needed
    };
    li.appendChild(removeButton);

    wishlistMenu.appendChild(li);
  }
}


function removeFromWishlist(movieTitle) {
  if (wishlistMenu) {
    let wishlistItems = wishlistMenu.getElementsByTagName("li");
    for (let i = 0; i < wishlistItems.length; i++) {
      if (wishlistItems[i].textContent === movieTitle) {
        wishlistItems[i].remove();
        break;
      }
    }
  }
}

function toggleWishlistMenu() {
  if (wishlistMenu) {
    wishlistMenu.style.display = wishlistMenu.style.display === 'block' ? 'none' : 'block';
  }
}

function showWishlistMenu() {
  if (wishlistMenu) {
    wishlistMenu.style.display = 'block';
  }
}

function hideWishlistMenu() {
  if (wishlistMenu) {
    wishlistMenu.style.display = 'none';
  }
}

function getSearchSuggestions() {
  let query = movieNameRef.value;
  if (query.length >= 3) {
    let suggestionsUrl = `http://www.omdbapi.com/?s=${query}&apikey=${key}`;
    fetch(suggestionsUrl)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.Search) {
          displaySearchSuggestions(data.Search);
        } else {
          clearSearchSuggestions();
        }
      })
      .catch(() => {
        clearSearchSuggestions();
      });

      searchSuggestionsContainer.style.display = 'block';
      
  } else {
    clearSearchSuggestions();
    searchSuggestionsContainer.style.display = 'none';
  }
}



function displaySearchSuggestions(suggestions) {
  searchSuggestionsContainer.innerHTML = '';

  suggestions.slice(0, 5).forEach(suggestion => {
    const suggestionElement = document.createElement('div');
    suggestionElement.classList.add('suggestion');
    suggestionElement.textContent = suggestion.Title;
    suggestionElement.onclick = function() {
      movieNameRef.value = suggestion.Title;
      clearSearchSuggestions();
    };
    searchSuggestionsContainer.appendChild(suggestionElement);
  });
}

function clearSearchSuggestions() {
  searchSuggestionsContainer.innerHTML = '';
}

searchBtn.addEventListener("click", getMovie);
window.addEventListener("load", getMovie);
