(() => {
    //Routes
    //Search for movie
    //https://www.omdbapi.com/?s=speed&apikey=e2f8140f

    //One Movie by ID
    //https://www.omdbapi.com/?i=tt0111257&apikey=e2f8140f

// variables list
// What it does: Grabs HTML elements from your page so you can modify them later.
// movieBox - where the movie list will appear
// reviewTemplate - a reusable HTML template for movie details
// reviewCon - where movie details will be displayed
// BaseUrl - Stores the API Address
// apiKey - stores the unique key for accessing the API

    const movieBox = document.querySelector("#movie-box");
    const reviewTemplate = document.querySelector("#review-template");
    const reviewCon = document.querySelector("#review-con");
    const baseUrl = `https://swapi.info/api/`;
    //const apiKey = `apikey=?`;

// the getMovies() function
    function getMovies() {

// fetch() - JavaScript's way of requesting data from the internet
// Template literals (backticks `) let you insert variables into strings
// The URL becomes: https://www.omdbapi.com/?s=speed&apikey=e2f8140f
        fetch(`${baseUrl}people`)

// .then(results => results.json()) What it does: The data comes back in a raw format,
// so .json() converts it to a JavaScript object you can work with.
        .then(results => results.json())

// The .then() pattern: This is a Promise. Fetching data takes time,
// so .then() says "when the data arrives, THEN do this."
        .then(function(results){

//results.Search contains an array of movie objects
            console.log(results.Search);
            const people = results.Search;

// Creates a <ul> (unordered list) element For each movie
            const ul = document.createElement("ul");

            people.forEach(person => {
                // Creates <li>, <a>, and <img> elements
                const li = document.createElement("li");
                const a = document.createElement("a");
                const img = document.createElement("img");
                // Fills them with the movie's title, ID, and poster
                a.textContent = person.Name;
                // dataset.review stores the movie's ID in the link (for later clicking)
                a.dataset.review = person.imdbID;
                img.src = person.Gender;
                // Nests them: img and link go inside <li>, <li> goes inside <ul>
                li.appendChild(img);
                li.appendChild(a);
                ul.appendChild(li);
            })
            // Adds the complete list to movieBox on your page
            movieBox.appendChild(ul);
        })

        // After movies are displayed, this grabs all the movie links and adds click listeners to them.
        .then(function(){
            const links = document.querySelectorAll("#movie-box li a");
            console.log(links);
            // When someone clicks a link, the getReview function runs.
            links.forEach(function(link){
                link.addEventListener("click", getReview);
            })
        })

        // What it does: If anything goes wrong (no internet, bad API key, etc.), 
        // this catches the error and logs it instead of crashing your app.
        .catch(function(err){
            console.log(err);
        });
    }

    //The getReview() Function runs when someone clicks a movie title.
    // .dataset.review retrieves the movie ID we stored earlier
    // e is the click event
    // e.currentTarget is the link that was clicked
    function getReview(e) {
        console.log(e.currentTarget.dataset.review);
        const reviewID = e.currentTarget.dataset.review;

        // Fetches detailed info for that specific movie
        fetch(`${baseUrl}?i=${reviewID}&plot=full&${apiKey}`)
        .then(response => response.json())

        // Clears previous movie details (innerHTML = "")
        // Clones the review template (makes a copy you can fill in)
        // Finds the specific elements inside the clone
        .then(function(response){
            reviewCon.innerHTML = "";
            console.log(response);
            const clone = reviewTemplate.content.cloneNode(true);
            const reviewDescription = clone.querySelector(".review-description");
            const reviewHeading = clone.querySelector(".review-heading");
            const reviewRating = clone.querySelector(".review-rating");

        // Fills them with the movie's plot, title, and rating
            reviewDescription.innerHTML = response.Plot;
            reviewHeading.innerHTML = response.Title;
            reviewRating.innerHTML = `Rating: ${response.imdbRating}`;

        // Adds the filled template to the page
            reviewCon.appendChild(clone);

        })
        .catch(function(error){
            console.log(error);
        })
    }
    
// This single line at the bottom kicks everything off when the page loads!    
getMovies();
})();

// CommonQuestions

// Q: Why so many .then()s?
// A: Each step depends on the previous one finishing. 
// You can't display movies until you've fetched them, 
// and you can't add click listeners until movies are displayed.

// Q: What's the difference between function() and =>?
// A: They're both ways to write functions. Arrow functions (=>) 
// are shorter and handle this differently (advanced topic for later).

// Q: Why forEach instead of a regular loop?
// A: forEach is cleaner for arrays. It automatically goes 
// through each item without needing index counters.