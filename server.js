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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"; // change this

mongoose.connect(MONGODB_URI);

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});