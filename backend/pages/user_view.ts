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
	// personal user webpage
	app.get("/@:user", function(req, res) {
		(async () => {
			let user = [];
			let userId = req.params.user; // selected user
			let bio = [];
			let bioMeta = [];
			let page = [];
			let badge = [];
			let follow = [];
			eval(await db.get(sha256(userId)));
			if(await db.get(sha256(userId)) == null){
				res.render("404");
			}else{
				if(user.bio == ""){
					bio = `<span style = "color:var(--error)">no bio available</span>`;
					bioMeta = `no bio available`;
				}else{
					bio = `<span style = "color:var(--tertiary)">${user.bio}</span>`;
					bioMeta = user.bio;
				}
				if(user.page == ""){
					page = `<span style = 'color:var(--error)'>no page available</span>`;
				}else{
					page = `<span style = "color:var(--tertiary)">${user.page}</span>`;
				}
				if(user.badge){
					if(user.badge == "pro"){
						badge = process.env["pro_badge"];
					}
				}
				res.render("users", {
					user: userId, // selected user
					bio: bio, // selected user's bio
					bioMeta: bioMeta, // selected user's bio for open graph description
					page: page, // selected user's website WITH CSS
					pageUrl: user.page, // selected user's website URL
					profile: user.profile, // selected user's profile
					badge: badge,
				});
			}
		})();
	});
}