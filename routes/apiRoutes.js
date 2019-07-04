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

const headlines = {
	saved : [],  // this should be eliminated in favor of being written to MongoDB
	unsaved : [] //this item should be promoted to its own array rather than a member of an object
};

//headlines.saved.push({"headline":"This is a test","url":"/thisisatest"});

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
			let article = new Article({headline: title, url: link});
			results.push(article);
			//article.save();
			
		});
		console.log("results:\t");
		console.log(results);
		headlines.unsaved = results;
		
		//headlines.unsaved.map( x => console.log(x));
		/*
		results.map(x => {
			let matched = false;
			for (let y in headlines.saved) {
				if (x.url === headlines.saved[y].url) {
					matched = true;
					break;
				}
			}
			if (matched === false) headlines.unsaved.push(x)
		});
	*/
	
	}).then(function(results) {
		//console.log(results);
		//res.send(results).status(200); // see comments above for why this isn't being returned here
		res.send({message:"success"}).status(200);
	});
});

app.put("/api/headlines/*", function(req, res) {
	console.log("PUT route hit");
	let id = req.params[0];
	if (id) { 
		headlines.unsaved.map( x => {
			if (x._id == id) {
				console.log(x);
				let article = new Article({headline: x.headline, url: x.url});
				Article.find({ url: article.url }).then(function (mongoArticle) {
					//if (err) return console.log(err);
					
					console.log("mongoArticle:");
					console.log(mongoArticle);
					
					if(mongoArticle.length > 0) {
						console.log("Article already saved.");
					}
					else {
						console.log("Saving article.");
						article.save();
					}
					
				});
			}
	//Article.findById(req.params[0], function (err, article) {console.log(article); article.save();});
		// save to mongo
	
		});
	}
	//if (data.saved === true) headlines.saved.push({url: data.url, headline: data.headline});
	//res.send("Article saved.").status(200); // saved should be eliminated in favor of being written to MongoDB. Unsaved will be saved in server-side memory
});

app.get("/api/headlines", function(req, res) {
	
	console.log("req.query.saved:");
	console.log(req.query.saved);
		
		
	if (req.query.saved === "true") {  // this function should pull from MongoDB instad of a global variable
		Article.find({}).then(function (articles) {console.log(articles);res.send(articles).status(200);});
		//res.send(headlines.saved).status(200);
	}
	else if (req.query.saved === "false") {
		console.log("unsaved (stored in server memory):");
		console.log(headlines.unsaved);
		res.send(headlines.unsaved).status(200);
	}
	else res.end();
	
});
	
app.get("/api/clear", function(req, res) {  // is this route supposed to: 1) clear all saved, 2) clear all unsaved, or 3) clear both saved and unsaved
	headlines.saved = [];
	headlines.unsaved = [];
	Article.remove({}).exec();
	res.send("All headlines cleared from server.").status(200);
});

app.delete("/api/notes/*", function(req, res) {
	console.log("DELETE route hit");
	console.log(req.params);
	// delete the note with the id passed
	Note.findById(req.params[0], function (err, note) {
		if (err) return console.log(err);
		note.remove();
		res.status(200);
	});
});

app.get("/api/notes/*", function(req, res) {
	console.log('"view current note" route hit');
	console.log(req.params[0]);
	if (req.params[0]) {
		Note.find({ _headlineId: req.params[0]}, function (err, note) {
			if (err) return console.log(err);
			res.send(note).status(200);
		});
	}
});


app.post("/api/notes", function(req, res) {
	console.log('"save  note" POST route hit');
	console.log(req.body);
	// let note = new Note(req.body).save(); // probably dont need let note = 
	new Note(req.body).save();
});

app.put("/api/notes/*", function(req, res) {
	console.log('"make a note or edit current note" route hit');
	console.log(req.params[0]);
	if (req.params[0]) {
		Article.findById(req.params[0], function (err, article) {
			if(article) {
				console.log(article);
				//if (article.note)
					res.send(article)
			}
				
		});
	}
});

app.delete("/api/headlines/*", function(req, res) {
	console.log("DELETE route hit");
	console.log(req.params[0]);
	Article.findById(req.params[0], function (err, article) { if(article) article.remove();});
});

};