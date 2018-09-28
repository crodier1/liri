var selection = process.argv[2];

//modular spotify search function
function spotify(query){
    var Spotify = require('node-spotify-api');        

    var spotify = new Spotify({
        id: "1dfd8680daeb4d5e88b68dd4d88b34be",
        secret: "ca1a3fe3fa1d4b1880f1c1e741986b36"
    });

    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for(var i=0; i<data.tracks.items.length; i++){
            var artistNameStringify = JSON.stringify(data.tracks.items[i].album.artists[0].name),
            artistName = "Artist Name: " + artistNameStringify.slice(1, artistNameStringify.length - 1),
            albumNameStringify = JSON.stringify(data.tracks.items[i].album.name),
            albumName = "Album Name: " + albumNameStringify.slice(1, albumNameStringify.length - 1),
            songStringify = JSON.stringify(data.tracks.items[i].name),
            songName = "Song Name: " + songStringify.slice(1, songStringify.length - 1),
            previewStringify = JSON.stringify(data.tracks.items[i].preview_url),
            previewUrl = "Preview Link: " + previewStringify.slice(1, previewStringify.length - 1);


        console.log("");    
        artistNameStringify !== "null" ? console.log(artistName) : console.log("Artist not availible");
        songStringify !== "null" ? console.log(songName) : console.log("Song not availible");
        albumNameStringify !== "null" ? console.log(albumName) : console.log("Album not availible");
        previewStringify !== "null" ? console.log(previewUrl) : console.log("No preview link availible");       

        }

    });

}

//spotify search
if (selection === "spotify-this-song") {

    var trackQuery = process.argv.slice(3, process.argv.length).join(" ");

    spotify(trackQuery);    
}

//omdb search
if (selection === "movie-this") {
    var request = require("request"),
        movieName = process.argv.slice(3, process.argv.length).join(" "),
        url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


    request(url, function (error, response, body) {


        if (!error && response.statusCode === 200) {
            
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            JSON.parse(body).Ratings[1] === undefined ? console.log("Rotton Tomatoes Rating: N/A") : console.log("Rotton Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Release Date: " + JSON.parse(body).Year);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Release Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
        }
    });
}

//bands in town search
if (selection === "concert-this") {
    var bandsintown = require('bandsintown')("codingbootcamp"),
        artistName = process.argv.slice(3, process.argv.length).join(" ");

    bandsintown
        .getArtistEventList(artistName)
        .then(function (events) {

            try {
                console.log("");
                console.log("Venue Name: " + events[0].venue.name);
                console.log("Venue Location: " + events[0].formatted_location);
                console.log("Date & Time: " + events[0].formatted_datetime);
                

            } catch (e) {
                if (e instanceof TypeError) console.log("No concerts found");
            }

            for (var i = 1; i < events.length; i++) {
                console.log("");
                console.log("Venue Name: " + events[i].venue.name);
                console.log("Venue Location: " + events[i].formatted_location);
                console.log("Date & Time: " + events[i].formatted_datetime);                
            }

        });
}

//reads random.txt
if(selection === "do-what-it-says"){
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
          }

          data = data.split(",");          

          spotify(data[1]);
    });
}


//in case of error
if (["concert-this", "movie-this", "spotify-this-song", "do-what-it-says"].indexOf(selection) === -1) {
    console.log("");
    console.log("Selection type not found");
    console.log("Type 'concert-this' & then type in the artist you want to find the next concert");
    console.log("Type 'movie-this' & the movie name to find movie information");
    console.log("Type 'spotify-this-song' & the name of the song to find information songs.");
    console.log("Type 'do-what-it-says' to search Spotify for a mystery song.")
}