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
	app.get("/", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const location = sha256(req.header('x-forwarded-for'));
		(async () => {
			let user = await db.get(req.cookies.name);
			if (await db.get("totalPosts") == null) {
				totalPosts = `<br><center><h2 style = "color:#D9544D">NO POSTS AVAILABLE</h2></center>`;
			} else {
				totalPosts = await db.get("totalPosts");
			}
			if (req.cookies.name == "" || req.cookies.name == null || req.cookies.name == undefined || user == null) {
				// login page if the user's cookies are unavailable
				res.send(`<title>Big Space | Login</title><meta name="description" content="Share Content Together Easily"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="style.css"><script src = "/script.js"></script><script src="https://kit.fontawesome.com/09556a902e.js" crossorigin="anonymous"></script><script src="https://replit.com/public/js/repl-auth-v2.js"></script><center><br><h1 style = "color:var(--quatenary)">Big Space&nbsp;<span style = "font-size:17px; color:var(--tertiary)">Share Content</span></h1><br><br><h2 style = "color:var(--primary)">Login</h2><form action = "/login" method = "POST"><input name = "username" placeholder='Enter username…' autocomplete = 'off' autocorrect = 'off' spellcheck="false" pattern = "^[a-zA-Z0-9_]*$" required><br><input name = 'password' placeholder = 'Enter password…' autocomplete = 'off' type = 'password' required><br><br><button type = 'submit' class = "login">Login</button></form><h2 style = "color:var(--primary)">Sign Up </h2><form action = "/new_account" method = "POST"><input name = "newAccount" placeholder='New username…' autocomplete = 'off' autocorrect = 'off' spellcheck="false" required><br><input name = "newPassword" placeholder='New password…' autocomplete = 'off' type = "password" required><br><br><button type = "submit" class = "login">Sign Up</button></form><br><h2>Not Trusting? Login with Replit instead!</h2><button onclick="alert('replit auth is not available yet')" class = "replit"><img src = "/replit.png" style = "width:25px; height:25px; vertical-align:middle;"> Auth with Replit</button></center>`);
			} else {
				if (location != await db.get(`${user}_address`) || await db.get(`${user}_address`) == null) { // layer to check if the user's address is the same address as the one when the account was first created or if the address is not valid (meaning the cookie is fake)
					res.send(`<h1>invalid request</h1>`);
					console.log("");
					console.log("ALERT! suspicious login has been avoided".red);
					console.log("");
				} else {
					res.send(`<title>Big Space | Share Content</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="style.css"><script src = "/script.js"></script><script src="https://kit.fontawesome.com/09556a902e.js" crossorigin="anonymous"></script><h3>&nbsp;&nbsp;<i class="fa-solid fa-user"></i> <span style = 'color:var(--primary)'>&nbsp;${user}</span><a href = "/logout" class = "logout">Logout <i class="fa-solid fa-circle-xmark"></i></a><a href = "/settings" style = "float:right; color:var(--primary)" class="fa-solid fa-gear"></a></h3><center><h1 style = "color:var(--quatenary)">Big Space&nbsp;<span style = "font-size:17px; color:var(--tertiary)">Share Content</span></h1></center>${totalPosts}<br><br><br><br><div class = "footer"><form action = "/post_page" method = "POST"><button class = "post" type = "submit"><i class="fa-solid fa-pencil" style = "font-size:18px;"></i></button></form></div>`);
				}
			}
		})();
	});
}