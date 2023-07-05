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
	// a post's unique page
	app.get("/:id/:title", function(req, res) {
		(async () => {
			let user = [];
			let post = req.params.id;
			let postString = [];
			eval(await db.get(post));
			if(await db.get(post) == null || req.params.title != postString.title.replace(/\s+/g, '-').toLowerCase()){
				res.render("404");
			}else{
				eval(await db.get(postString.author));
				res.render("post_view", {
					post: req.params.id,
					title: postString.title, // post title
					content: postString.content,
					image: postString.image,
					author: user.name, // post author
					authorProfile: user.profile,
					topic: postString.topic, // post topic
					comments: postString.comments,
				});
			}
		})();
	});
}