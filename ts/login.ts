const Database = require("@replit/database");
const db = new Database();
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const port = 3000;
const http = require("http");
const bp = require("body-parser");
const { createHash } = require("node:crypto");
const timestamp = require("time-stamp");
const fs = require("fs");
const ejs = require("ejs");

app.use(cookieParser());
module.exports = function(app) {
	app.post("/login", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		(async () => {
			let newUser = req.body.username;
			let newPass = req.body.password;

			const token = await db.get(newUser);
			// if the new user exists and the password is the same as the saved password for that specific username
			eval(await db.get(token));
			if (token != null && newPass == user.password) {
				res.render("partials/redirect", {
					cookie:token,
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