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

let mods = {
	mod1: process.env['mod1'],
	mod2: process.env['mod2'],
}

module.exports = function(app) {
	app.get("/purge/:method", function(req, res) {
		(async () => {
			let method = req.params.method;
			let purgeUser = await db.get(req.cookies.name);
			if(method == "posts" || method == "all"){
				if(method == "posts"){
					if (purgeUser == mods.mod1 || purgeUser == mods.mod2) {
						await db.delete("totalPosts");
						console.log(`-- ${purgeUser} purged all posts`.red);
						res.send(`<script>window.location.replace("/");</script>`);
						process.exit();
					} else {
						res.send(`whoops lol u dont got the perms, boi`);
					}
				}
				if(method == "all"){
					if (purgeUser == mods.mod1 || purgeUser == mods.mod2) {
						await db.empty();
						console.log(`-- ${purgeUser} purged entire database`);
						res.send(`<script>window.location.replace("/");</script>`);
						process.exit();
					} else {
						res.send(`whoops lol u dont got the perms, boi`);
					}
				}
			}else{
				res.send("<h1>invalid request</h1>");
			}
		})();
	});
}