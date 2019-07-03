// ===============================================================================
// DEPENDENCIES
// ===============================================================================
const path = require("path");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

	app.get("/saved", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/saved.html"));
	});

	app.get("*", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/icescraper.html"));
	});
};
