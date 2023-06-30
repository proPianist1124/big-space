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
	// a post's unique page
	app.get("/posts/:id", function(req, res) {
		(async () => {
			let user = [];
			let post = req.params.id;
			let postString = [];
			if(await db.get(post) == null){
				res.render("404");
			}else{
				eval(await db.get(post));
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