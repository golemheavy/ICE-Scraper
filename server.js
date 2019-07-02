// Dependencies
const express = require("express");
const mongoose = require('mongoose');
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"; // change this because of a deprecation warning. should pass an object with useNewUrlParser value

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("We're connected.");
  // we're connected!
});

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title:  String,
    link: String
});

const Article = mongoose.model("Article", articleSchema);

const siteUrl = "https://www.quantamagazine.org/";

const headlines = {
	saved : [],
	unsaved : []
}

app.get("/api/fetch", function(req, res) {
	axios.get(siteUrl).then(function(response) {
		// Load the HTML into cheerio and save it to a variable
		// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		const $ = cheerio.load(response.data);
		
		// An empty array to save the data that we'll scrape
		let results = [];
		
		$("div.two--large").each(function(i, element) {
			var title = $(element).find("h2.card__title").text();
			var link = $(element).find("a").attr("href");
			
			// Save these results in an object that we'll push into the results array we defined earlier
			results.push({
				"headline": title,
				"url": link
			});
			
		});
		
		results.map(x => {
			let matched = false;
			for (let y in headlines.saved) {
				if (x.url === headlines.saved.url) {
					matched = true;
					break;
				}
			}
			if (matched === false) headlines.unsaved.push(x)
		});
		
		
		return results;
	
	/*	// The code below will write the elements of results to mongoDB
		
		results.forEach(function(element) {
			const article = new Article({title:element.title,link:element.link});
			article.save(function (err, article) {
				if (err) return console.error(err);
				console.log(article);
			});
		})
	*/
	}).then(function(results) {
				//console.log(results);
				res.send(results).status(200);
	});
});


app.put("/api/headlines", function(req, res) {
		if (data.saved === true) headlines.saved.push({url: data.url, headline: data.headline});
		res.send("Article saved.").status(200);
});


app.get("/api/headlines", function(req, res) {
	//console.log(req.query);
	if (req.query.saved === false) res.send(headlines.unsaved).status(200);
	else if (req.query.saved === true) res.send(headlines.saved).status(200);
	
	res.end(); 
});


app.get("/api/clear", function(req, res) {
	headlines.saved = [];
	headlines.unsaved = [];
	res.send("All headlines cleared from server.").status(200);
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});