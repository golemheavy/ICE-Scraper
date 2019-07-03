// Dependencies
const express = require("express");

// Initialize Express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});