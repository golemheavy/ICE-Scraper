const mongoose = require('mongoose');
const axios = require("axios");
const cheerio = require("cheerio");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
	
	// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to MongoDB.");
  // we're connected!
});
	
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    headline:  String,
    url: String
});

const Article = mongoose.model("Article", articleSchema);

const noteSchema = new Schema({
	_headlineId: String,
	noteText: String
});

const Note = mongoose.model("Note", noteSchema);

const siteUrl = "https://www.quantamagazine.org/";

const searchDivs = [
	["div.hero-title","h1.h0"],
	["div.two--large","h2.card__title"]
];

const headlines = {
	unsaved : [] 
};

app.get("/api/fetch", function(req, res) {
	axios.get(siteUrl).then(function(response) {
		// Load the HTML into cheerio and save it to a variable
		// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		const $ = cheerio.load(response.data);
		
		// An empty array to save the data that we'll scrape
		let results = [];
		
		searchDivs.map(async function(item) {
			console.log("searching " + item);
			await $(`${item[0]}`).each(function(i, element) {
			
				let title = $(element).find(`${item[1]}`).text();
				console.log(title);
				let link = $(element).find("a").attr("href");
				console.log(link);
			
				Article.find({ url: link }).then(function (mongoArticle) {	
					if(mongoArticle.length > 0) {
						console.log("This article already exists in MongoDB"); // so we will not add it to unsaved
						console.log(mongoArticle);
					}
					else if (mongoArticle.length === 0){
						// Save these results in an object that we'll push into the results array we defined earlier
						console.log("saving result")
						results.push(new Article({headline: title, url: link}));
					}
				});
			});
		});
		
		headlines.unsaved = results;
		
	}).then(function(results) {
		console.log("results:\t");
		console.log(results);
		res.send(results).status(200);
	});
});

app.put("/api/headlines/*", function(req, res) {
	console.log("PUT route hit");
	let id = req.params[0];
	if (id) { 
		headlines.unsaved.map( x => {
			if (x._id == id) {
				let article = new Article({headline: x.headline, url: x.url});
				Article.find({ url: article.url }).then(function (mongoArticle) {
					
					if(mongoArticle.length > 0) {
						console.log("Article already saved.");
					}
					else {
						console.log("Saving article.");
						article.save();
					}
					
				}).then(function(){ //remove x from headlines.unsaved
					headlines.unsaved.splice(x+1,1);
				});
			}
		});
	}
});

app.get("/api/headlines", function(req, res) {
	
	if (req.query.saved === "true") { 
		Article.find({}).then(function (articles) {console.log(articles);res.send(articles).status(200);});
	}
	else if (req.query.saved === "false") {
		console.log("unsaved (stored in server memory):");
		console.log(headlines.unsaved);
		res.send(headlines.unsaved).status(200);
	}
	else res.end();
	
});
	
app.get("/api/clear", async function(req, res) {  
	headlines.unsaved = [];
	
	Note.deleteMany({}).then(function(response, err){
		if (err) return console.log(err);
		console.log("notes deleted");
		console.log("MongoDB Notes deleted.");
		console.log(response);
	}).then(function(){
		Article.deleteMany({}).then(function(response, err){
			if (err) return console.log(err);
			console.log("MongoDB Articles deleted.");
			console.log("all stored stories and notes cleared.");
			console.log(response);
			res.send("All saved and unsaved headlines / notes cleared from server.").status(200);
		});
	});
});

app.delete("/api/notes/*", function(req, res) {
	// delete the note with the id passed
	Note.findById(req.params[0], function (err, note) {
		if (err) return console.log(err);
		if (note) note.remove().then(res.end().status(200));
	});
});

app.get("/api/notes/*", function(req, res) {
	if (req.params[0]) {
		Note.find({ _headlineId: req.params[0]}, function (err, note) {
			if (err) return console.log(err);
			res.send(note).status(200);
		});
	}
});


app.post("/api/notes", function(req, res) {
	new Note(req.body).save().then(function(){
		res.send("note saved").status(200);
	});
});

app.put("/api/notes/*", function(req, res) {
	if (req.params[0]) {
		Article.findById(req.params[0], function (err, article) {
			if (err) return console.log(err);
			if(article) {
				console.log(article);
					res.send(article)
			}
				
		});
	}
});

app.delete("/api/headlines/*", function(req, res) {
	Article.findById(req.params[0], function (err, article) { if(article) article.remove();});
});

};