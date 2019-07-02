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

// Main route (simple Hello World Message)
app.get("/api/fetch", function(req, res) {
	axios.get(siteUrl).then(function(response) {
		// Load the HTML into cheerio and save it to a variable
		// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		var $ = cheerio.load(response.data);
		
		// An empty array to save the data that we'll scrape
		var results = [];
		
		// Select each element in the HTML body from which you want information.
		// NOTE: Cheerio selectors function similarly to jQuery's selectors,
		// but be sure to visit the package's npm page to see how it works
		$("div.two--large").each(function(i, element) {
			var title = $(element).find("h2.card__title").text();
			var link = $(element).find("a").attr("href");
			
			// Save these results in an object that we'll push into the results array we defined earlier
			results.push({
				title: title,
				link: link
			});
		});
		
		// Log the results once you've looped through each of the elements found with cheerio
		results.forEach(function(element) {
			const article = new Article({title:element.title,link:element.link});
			article.save(function (err, article) {
				if (err) return console.error(err);
				console.log(article);
			});
		})
	});
	res.send("Finished scraping articles").status(200);
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});