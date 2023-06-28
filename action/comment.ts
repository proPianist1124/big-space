const Redis = require("ioredis")
const db = new Redis(process.env["token"]);
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

const regex = /^[\.a-zA-Z0-9,!? ]*$/;
const apiLimiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minute window
	max: 10, // 10 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"made too many comments, take a break! :)",
});

module.exports = function(app) {
	app.post("/comment", apiLimiter, function(req, res) {
		(async () => {
			let token = req.cookies.name;
			let user = await db.get(token);
			let comments = [];
			eval(user);
			if(token == undefined || req.cookies.password == undefined || req.cookies.password != user.password){
				res.render("404");
			}else{
				if(regex.test(req.body.comment) == false){
					res.render("404");
				}else{
					let postString = [];
					let postId = req.cookies.post;
					eval(await db.get(postId));
					if(postString.comments == "" || postString.comments == undefined){
						comments = "";
					}else{
						comments = postString.comments;
					}
					let comment = `<a href = '/@${user.name}' class = 'default'>${user.name}</a>: ${req.body.comment}<br>${comments}`;
					let structure = `postString = {title: "${postString.title}", content: "${postString.content}", date: "${postString.date}", topic: "${postString.topic}", image: "${postString.image}", likes: "${postString.likes}", dislikes: "${postString.dislikes}", comments: "${comment}", author: "${postString.author}"}`;
					await db.set(postId, structure);
					res.redirect(`/posts/${postId}`);
				}
			}
		})();
	});
}