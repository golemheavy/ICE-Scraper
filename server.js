// Dependencies
const express = require("express");

// Initialize Express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

/*
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
*/


// Set the app to listen on port 3000 or dynamic port set by environment variable
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});