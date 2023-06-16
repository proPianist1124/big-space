const Database = require("@replit/database");
const db = new Database();
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const timestamp = require("time-stamp");
const ejs = require("ejs");
const { createHash } = require("node:crypto");

module.exports = function(app) {
	app.get("/logout", function(req, res) {
		(async () => {
			let user = [];
			let token = await db.get(req.cookies.name);
			console.log("");
			console.log(`${user.name} has logged out`.red);
			console.log("");
			res.clearCookie("name");
			res.redirect("/");
		})();
	});
}