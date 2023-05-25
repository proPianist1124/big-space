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
const helmet = require("helmet");

let Filter = require("bad-words"),
	filter = new Filter();

module.exports = function(app) {
	app.get("/settings", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const location = sha256(req.header('x-forwarded-for'));
		(async () => {
			let user = await db.get(req.cookies.name);
			let bio = [];
			let page = [];
			if(req.cookies.name == "" || req.cookies.name == null || req.cookies.name == undefined || user == null){ // prevent spamming in accounts checking if cookies exist
				res.send(`<h1>invalid request</h1>`);
			}else{
				if(location != await db.get(`${user}_address`) || await db.get(`${user}_address`) == null){ //check if user cookie matches account creation location
					res.send(`<h1>invalid request</h1>`);
				}else{
					if(await db.get(`${user}_bio`) == null){
						bio = "";
					}else{
						bio = await db.get(`${user}_bio`);
					}
					if(await db.get(`${user}_page`) == null){
						page = "";
					}else{
						page = await db.get(`${user}_page`);
					}
					res.send(`<title>Big Space | Settings</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="style.css"><script src = "/script.js"></script><script src="/fontawesome.js"></script><h3>&nbsp;&nbsp;<i class="fa-solid fa-user"></i> <span style = 'color:var(--primary)'>&nbsp;${user}</span><a href = "/logout" class = "logout">Logout <i class="fa-solid fa-circle-xmark"></i></a><a href = "/settings" style = "float:right; color:var(--primary)" class="fa-solid fa-gear"></a></h3><br><br><main><form action = "/save_settings" method = "POST"><h2 style = "text-align:center">Account: ${user}</h2><p style = "text-align:left; font-size:18px;">Token: <span style = "color:var(--tertiary)">${req.cookies.name}</span><br>Password: <span style = "color:var(--tertiary)">${await db.get(`${user}_password`)}</span><br>Bio: <input name = "bio" class = "bio" value = "${bio}" placeholder = "your bio…" autocomplete = "off"/><br>Page: <input name = "page" class = "bio" value = "${page}" placeholder = "your page…" autocomplete = "off"/></p><br><br><button>Save <i class="fa-solid fa-floppy-disk"></i></button></form></main><br><center><a href = "/"><button class = "login" style = "border-radius:5px 0px 0px 5px;"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Go back</button></a><a href = "/@${user}"><button class = "login" style = "border-radius:0px 5px 5px 0px;"><i class="fa-regular fa-id-card"></i>&nbsp;&nbsp;View Profile</button></a></center>`);
				}
			}
		})();
	});
}