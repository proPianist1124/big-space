const Redis = require("ioredis");
const db = new Redis("redis://default:8ddb7554a3974eb98a2636383355b9cc@clean-porpoise-38761.upstash.io:38761");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const timestamp = require("time-stamp");
const ejs = require("ejs");
const rateLimit = require("express-rate-limit");
const sha256 = require('js-sha256');

module.exports = function(app) {
	// page where you post stuff
	app.get("/share", function(req, res) {
		let official = "";
		(async () => {
			let token = req.cookies.name;
			let user = [];
			if(req.cookies.name != undefined || req.cookies.password != undefined){
				eval(await db.get(String(token)));
			}
			if(token == undefined || req.cookies.password == undefined || req.cookies.password != user.password){
				res.render("404");
			}else{
				if (user.name == process.env["mod1"]) {
					official = `<option value="#official">#official</option>`;
				}
				res.render("share", {
					user: user.name,
					profile: user.profile,
					adminSelect: official,
				});
			}
		})();
	});
}