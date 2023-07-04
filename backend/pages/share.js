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

const apiLimiter = rateLimit({
	windowMs: 45 * 60 * 1000, // 45 minute window
	max: 15, // 15 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"bro stop reloading the pages so much :)",
});

module.exports = function(app) {
	// page where you post stuff
	app.get("/share", apiLimiter, function(req, res) {
		let official = "";
		(async () => {
			let token = req.cookies.name;
			let user = await db.get(token);
			eval(user);
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