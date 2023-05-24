const Database = require("@replit/database");
const db = new Database();
const colors = require('colors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const port = 3000;
const http = require('http');
const bp = require('body-parser');
const { createHash } = require("node:crypto");

module.exports = function(app) {
	app.post('/login', function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		(async () => {
			let newUser = req.body.username;
			let newPass = req.body.password;
			
			// if the new user exists and the password is the same as the saved password for that specific username
			if (await db.get(newUser) != null && newPass == await db.get(`${newUser}_password`)) {
				res.send(`<script>window.location.replace("/"); document.cookie = "name=${await db.get(newUser)}; SameSite=None; Secure";</script>`);
				console.log("");
				console.log(`${newUser} has signed in`.green);
				console.log("");
			} else {
				// if the user does not exist or the password entered was incorrect
				res.send(`Wtf u broke my website……just kidding! you just entered a password incorrectly or the user doesn't exist! <a href = "/" style = "color:red">Go back</a>`);
			}
		})();
	});
}