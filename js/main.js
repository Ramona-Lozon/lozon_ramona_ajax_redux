(() => {

// variables list
//Grabs HTML elements
// characters - where the character list will appear
// darthMaul - HTML template for character details
// Profile - character details will be displayed
// BaseUrl - stores API Address

    window.addEventListener('load', function() {
        starWars();  // Waits for everything
    });

console.log('Script started');
console.log('Document ready state:', document.readyState);
console.log('Stylesheets loaded:', document.styleSheets.length);

    const starWarsContainer = document.querySelector("#characters");
    const darthMaul = document.querySelector("#character-template");
    const Profile = document.querySelector("#profile");
    const baseUrl = `https://swapi.info/api/`;

    // // Wait for EVERYTHING to load (HTML, CSS, images)
    // window.addEventListener('load', function() {
    //     starWars();  // Now call your main function    
    //      });

//runs a function and names it createSpinner
    function createSpinner() {
        //the function creates a div within the document
        const spinner = document.createElement('div');
        //gives the div the 'spinner' class
        spinner.className = 'spinner';
        //injects HTML elements into the div 
        spinner.innerHTML = `
            <div class="spinner-border"></div>
            <p>Loading...</p>
        `;
        //this returns the result of the function to the website's memory, not the dom
        return spinner;
    }

// the getMovies() function is triggered at the bottom of the document
    function starWars() {

// fetch() - JavaScript's way of requesting data from the internet
// template literals (backticks `) let you insert variables into strings
// the URL becomes: https://swapi.infoapi/people
        fetch(`${baseUrl}people`)

// .then(results => results.json())
// the data comes back in a raw format
//.json() converts it to a JavaScript object you can work with.
        .then(results => results.json())

// the .then() pattern: This is a Promise
// Fetching data takes time
// so .then() says "when the data arrives, then do this
        .then(function(results){

//results contains the info from the API
            console.log(results);
            const people = results;
// treates a <ul> (unordered list) element For each person
            const ul = document.createElement("ul");

            people.forEach (person => {
                // Creates <li> and <a> elements
                const li = document.createElement("li");
                const a = document.createElement("a");
                //const img = document.createElement("img");
                // Fills them with the name, height
                a.textContent = person.name;
                // dataset.ewok stores the character's ID in the link (for later clicking)
                li.dataset.ewok = person.url;
                // Nests them: a goes inside <li>
                // <li> goes inside <ul>
                li.appendChild(a);
                ul.appendChild(li);
                })
            // Adds the complete list on your page
            starWarsContainer.appendChild(ul);})

        // After the character is displayed, this grabs all the list items to them and adds click listeners to them.
        .then(function(){
            const listItems = document.querySelectorAll("#characters li");
            console.log(listItems);
            // When someone clicks a list item, the imYourFather function runs.
            listItems.forEach(function(item){
                item.addEventListener("click", imYourFather);
                item.style.cursor = "pointer";
            })})

 
        // this catches function erros
        .catch(function(err){
            console.log(err);});}

    // the imYourFather() Function runs when someone clicks a characters name
    // .dataset.ewok retrieves the character
    // e is the click event
    // e.currentTarget is the link that was clicked
    function imYourFather(e) {
        console.log(e.currentTarget.dataset.ewok);
        const personUrl = e.currentTarget.dataset.ewok;

        //this targets the profile template and replaces its html with nothing, wiping it clean
        Profile.innerHTML = "";
        // this declares a constant called profileSpinner and defines it as the function 'createSpinner'
        //this function has been resolved higher up in the code and its result was handed back to the site's memory
        //the result of 'createSpinner' is then declared as the constant 'profileSpinner'
        const profileSpinner = createSpinner();
        //this targets the profile template and appends the constant profileSpinner to it
        //so the result of the createSpinner function shows up on the page as an element 
        Profile.appendChild(profileSpinner);


        // Fetches detailed info for that specific person
        fetch(personUrl)
        .then(response => response.json())

        // Clears previous person details to allow for more details (innerHTML = "")
        // Clones the list (darthMaul)
        // Finds the specific elements inside the clone
        .then(function(response){
        // profile.iinerHTML = "" Clears out any old character info with an empty string
            Profile.innerHTML = "";
            console.log(response);
        // cloneNode(true) makes oa copy of "character-template" (darthMaul) 
            const clone = darthMaul.content.cloneNode(true);

        // clone.querySelector(".stats"); searches the cloned template for thw "<p class="stats"></p>" element in index.html
            const theseArentTheDroidsYoureLookingFor = clone.querySelector(".stats");

        //lightsaber reaches into the clone and finds the name element for use later
            const lightsaber = clone.querySelector(".name");

        //fetch requests data from the url, since homeworld is listed as a URL on the character stats
        //homeworldPromise stores the fetched response
            const homeworldPromise = fetch(response.homeworld)
            .then(results => results.json());

        // films are stored as an array of urls
        // response.films.map(filmUrl) targets "films" item fron the character json data 
        // and defines it as filmUrl
        // => fetch(filmUrl) grabs the film urls
        //.then function turns it into a json
            const filmPromises = response.films.map(filmUrl => 
                fetch(filmUrl)
                .then(results => results.json()));

        //same thing for vehicles, starships and species, they are all grabbed and turned into json
        //they are arrays so we need to grab them
            const vehiclePromises = response.vehicles.map(vehicleUrl => 
                fetch(vehicleUrl)
                .then(results => results.json())); 

            const starshipPromises = response.starships.map(starshipUrl => 
                fetch(starshipUrl)
                .then(results => results.json())); 
                
            const speciesPromises = response.species.map(speciesUrl => 
                fetch(speciesUrl)
                .then(results => results.json())); 

        //the above functions have sent multiple requests to the api
        //they might complete at different times
        //Promise.all makes everything wait until all data is grabbed
            Promise.all([
                homeworldPromise,
        //promise.all is used here because films,vehicles,starships and species 
        // are all arrays with links to other pages
                Promise.all(filmPromises),
                Promise.all(vehiclePromises),
                Promise.all(starshipPromises),
                Promise.all(speciesPromises)])

        //.then uses the name of the all the arrays
        //and uses them for a function
                .then(([planet, films, vehicles, starships, species]) => {

        // films, vehicles etc these variables reach into the arrays that were fetched earlier
        // and assigns the resulting variable as somethingNames
        // .map(f) defines objects in the films array as "f"
        // then f.title defines "f" as being the title from each element in the films array
        // .join takes the array if film titles and combines it into a single string
        //'<br>' put a page break between each item in the string
        // the two vertical lines are an OR operator
        // if the left side is false, or empty it will use what is on the other side of the OR operator
        // human is written in the species OR function, because the api has ampty arrays for humans
        // because humans are the default i guess? kinda speciesist but w/e
            const filmNames = films.map(f => f.title).join('<br>');
            const vehicleNames = vehicles.map(v => v.name).join('<br>') || 'None';
            const starshipNames = starships.map(s => s.name).join('<br>') || 'None';
            const speciesNames = species.map(s => s.name).join('<br>') || 'Human';

        //lightsaber grabbed the name earlier
        //innerHTML = response takes the result of lightsaber and injects it into the HTML in index
        // the obi-wan quote does the same thing
        //the ${something} inserts the results grabbed earlier into the HTML injection 
        //since we are injecting html, we can style it in the same injection
            lightsaber.innerHTML = response.name;
            theseArentTheDroidsYoureLookingFor.innerHTML = `
            <section id="stat-list">
            <p>homeworld: ${planet.name}</p>
            <p>Birth Year: ${response.birth_year}</p>
            <p>Height: ${response.height}cm</p>
            <p>Mass: ${response.mass}kg</p>
            <p>Hair Color: ${response.hair_color}</p>
            <p>Eye Color: ${response.eye_color}</p>
            <p>Gender: ${response.gender}</p>
            <p>Species: ${speciesNames}</p>
        </section>
            
        <section>
            <div class="nested-list">
                <p  id="film-titles">Films:</p>
                    <div>
                        ${filmNames}
                    </div>
                </div>
            <br>            
            <div class="nested-list">
                <p>Vehicles Driven:</p>
                    <div>
                        ${vehicleNames}
                    </div>
                </div>
            <br>
            <div class="nested-list">
                <p>Starships Flown:</p>
                    <div>
                        ${starshipNames}
                    </div>    
                </div>
            </section>

            `;

        // const spinner = Profile.querySelector('.spinner');
        // if (spinner) {
        //     spinner.replaceWith(clone);
        // } else {
        //     Profile.innerHTML = "";
        //     Profile.appendChild(clone);
        // }

             Profile.innerHTML = "";
        // // Adds the filled template (darthMaul)to the page
             Profile.appendChild(clone);

        }).catch(function(error){console.log(error)});

        })
    }
    
// This starts everything    
starWars();

})();

(() => {

//   const hotspots = document.querySelectorAll(".Hotspot");
//   const materialTemplate = document.querySelector("#material-template");
//   const materialList = document.querySelector("#material-list");
//   const hotspotA = document.querySelector(".HotspotAnnotation");
//   const matLoader = document.querySelector("#mat-loader");

//   //functions
//   function loadInfoBoxes() {
//     //boxLoader.classList.toggle("hidden");
//     //make AJAX call here
//     fetch("https://swiftpixel.com/earbud/api/infoboxes")
//     .then(response => response.json())
//     .then(infoBoxes =>{
//       console.log(infoBoxes);

//       infoBoxes.forEach((infoBox, index) => {
//         let selected = document.querySelector(`#hotspot-${index + 1}`);
  
//         const titleElement = document.createElement('h2');
//         titleElement.textContent = infoBox.heading;
  
//         const textElement = document.createElement('p');
//         textElement.textContent = infoBox.description;
  
//         selected.appendChild(titleElement);
//         selected.appendChild(textElement);
//       });

      //boxLoader.classList.toggle("hidden");
      //hotspotA.innerHTML = "";
      

//     })
//     .catch(error => {
//       console.log(error);
//       const errorMessage = document.createElement("p");
//       errorMessage.textContent = "Error loading Hotspots";
//       hotspotA.appendChild(errorMessage);
//     })

//   }
//   loadInfoBoxes();

// function loadMaterialInfo() {
//   matLoader.classList.toggle("hidden");
//   materials.forEach(material => {
//     //clone the template
//     const clone = materialTemplate.content.cloneNode(true);
//     //populate with data
//     const materialHeading = clone.querySelector(".material-heading");
//     materialHeading.textContent = material.heading;
  
//     const materialDescription = clone.querySelector(".material-description");
//     materialDescription.textContent = material.description;
  
//     materialList.appendChild(clone);
//     })


//     matLoader.classList.toggle("hidden"); //toggle the hidden class for the loading indicator
    
// })

//put something in here that is considered proper error handling
// .catch(error => {
//   console.log(error); //console log the error
//   const errorMessage = document.createElement("p"); //create a p element
//   errorMessage.textContent = "Error loading materials"; //populate that element with content
//   materialList.appendChild(errorMessage); //append that message to the #people-con div
// })

// }
// loadMaterialInfo();

//   function showInfo() {
//     let selected = document.querySelector(`#${this.slot}`);
//     gsap.to(selected, 1, { autoAlpha: 1 });
//   }

//   function hideInfo() {
//     let selected = document.querySelector(`#${this.slot}`);
//     gsap.to(selected, 1, { autoAlpha: 0 });
//   }

//   //Event listeners

//   hotspots.forEach(function (hotspot) {
//     hotspot.addEventListener("mouseenter", showInfo);
//     hotspot.addEventListener("mouseleave", hideInfo);
//   });

})();