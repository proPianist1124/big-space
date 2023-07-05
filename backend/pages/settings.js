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
const sha256 = require('js-sha256');

const apiLimiter = rateLimit({
	windowMs: 45 * 60 * 1000, // 45 minute window
	max: 15, // 15 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"bro stop reloading the pages so much :)",
});

module.exports = function(app) {
	// user settings
	app.get("/settings", apiLimiter, function(req, res) {
		(async () => {
			let token = req.cookies.name;
			let user = await db.get(token);
			let password = await db.get(`${token}_password`);
			let bio = [];
			let page = [];
			let profile = await db.get(`${token}_profile`);
			eval(user);
			if(token == undefined || req.cookies.password == undefined || req.cookies.password != user.password){ // prevent spamming in accounts checking if cookies exist
				res.render("404");
			}else{
				if(await db.get(`${token}_bio`) == null){
					bio = "";
				}else{
					bio = await db.get(`${token}_bio`);
				}
				if(await db.get(`${token}_page`) == null){
					page = "";
				}else{
					page = await db.get(`${token}_page`);
				}
				eval(await db.get(token));
				res.render("settings", {
					user: user.name,
					password: user.password,
					token: user.token,
					bio: user.bio,
					page: user.page,
					profile: user.profile,
				});
			}
		})();
	});
}