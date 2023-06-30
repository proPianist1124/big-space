const Redis = require("ioredis")
const db = new Redis(process.env["redis_key"]);
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
	app.post("/login", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		(async () => {
			let user = [];
			let newUser = req.body.username;
			let newPass = req.body.password;

			const token = await db.get(sha256(newUser));
			// if the new user exists and the password is the same as the saved password for that specific username
			eval(token);
			if (token != null && newPass == user.password) {
				res.render("partials/redirect", {
					token:sha256(newUser),
					password: newPass,
				});
				console.log("");
				console.log(`${user.name} has signed in`.yellow);
				console.log("");
			} else {
				// if the user does not exist or the password entered was incorrect
				res.render("404");
			}
		})();
	});
}