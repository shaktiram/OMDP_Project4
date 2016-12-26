var httpRequest;

function search() {
    var query = document.getElementById("query").value;
    var url = "http://www.omdbapi.com/?r=json&type=movie&s=" + encodeURI(query);
    console.log(url);
    // Make a new http request. Once the request is finished,
    // JS will call the loadResults() function and pass us the response
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = loadResults;
    httpRequest.open('GET', url);
    httpRequest.send();
}

function loadResults() {
    // This callback will get called multiple times, so we need to check
    // for when the request is complete.
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        var resultsDiv = document.getElementById('results');
        var json = JSON.parse(httpRequest.responseText);
        var results = json["Search"];
        // check if we were successful and we got movie results
        if (httpRequest.status === 200 && results) {
            // we need to empty the results div before add the new results.
            resultsDiv.innerHTML = "";
            // create a new paragraph for each result...
            results.forEach(function(element) {
                    var p = document.createElement("P");
                    p.className = 'result';
                    p.innerHTML = element['Title'];
                    p.dataset.imdbID = element['imdbID'];
                    p.onclick = function() {
                        // set onclick for each paragraph
                        // if we don't wrap this in a function our JS will be called...
                        // ...when we run this code and no on click.
                        getDetails(p);
                    };
                    // ..and append them to the list of results
                    resultsDiv.appendChild(p);
                })
                // otherwise check if the request was good but there are no results
        } else if (httpRequest.status === 200) {
            resultsDiv.innerHTML = "<p>No results. Sorry :( For sure try again, though.</p>";

            // otherwise the request was bad
        } else {
            resultsDiv.innerHTML = "<p>There was an error processing your request. We've dispatched a team of Shakthi to investigate.</p>";

        }
    }
}

function getDetails(element) {
    // we need to hit a different API endpoint to get the results of one movie.
    var url = "http://www.omdbapi.com/?y=&plot=full&r=json&i=" + element.dataset.imdbID;
    // same thing as search() - make a request and set a callback function. It is always to do in this way!
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = showDetails;
    httpRequest.open('GET', url);
    httpRequest.send();
}

function showDetails(element) {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        // when we get back the details, we populate our empty
        // tags above with movie details
        var movie = JSON.parse(httpRequest.responseText);
        document.getElementById("title").innerHTML = movie['Title'];
        document.getElementById("year").innerHTML = movie['Year'];
        document.getElementById("genre").innerHTML = movie['Genre'];
        document.getElementById("starring").innerHTML = movie['Actors'];
        document.getElementById("plot").innerHTML = movie['Plot'];
        $("#poster").attr("src", movie['Poster']);

    }
}
