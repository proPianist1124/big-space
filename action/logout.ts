const Redis = require("ioredis")
const db = new Redis(process.env["token"]);
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const timestamp = require("time-stamp");
const ejs = require("ejs");
const rateLimit = require("express-rate-limit");
const { createHash } = require("node:crypto");

module.exports = function(app) {
	app.get("/logout", function(req, res) {
		(async () => {
			res.clearCookie("name");
			res.redirect("/");
		})();
	});
}