// REMEMBER TO ADD THE RATELIMITER BEFORE I SLEEP

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
	windowMs: 60 * 60 * 1000, // 60 minute window
	max: 60, // 3 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"bro stop reloading the pages so much :)",
});

module.exports = function(app) {
	// login page/home page
	app.get("/", function(req, res) {
		let postString = [];
		(async () => {
			let token = req.cookies.name;
			let user = await db.get(token);
			eval(user);
			if (token == undefined || req.cookies.password == undefined || req.cookies.password != user.password) {
				// login page if the user's cookies are unavailable
				res.render("login");
			} else {
				// counting method
				let count = 0;
				let posts = [];

				if(await db.get("postNumber") == null){
					await db.set("postNumber", 0);
					posts = `<br><center><h2 style = "color:#D9544D">no posts available</h2></center>`;
				}else{
					for (let i = 1; i < parseInt(await db.get("postNumber")); i++) {
						let badge = [];
						(async () => {
							let postId = `p${i}`;
							eval(await db.get(postId));
							eval(await db.get(postString.author));
							if(user.badge){
								if(user.badge == "pro"){
									badge = process.env["pro_badge"];
								}
							}
							let structure = `<a href = "/posts/${postId}"><div class = "postcard" onclick = "document.cookie = 'post=${postId}'"><h2><span style = "color:var(--primary)"><u>${postString.topic}</u>&nbsp;&nbsp;${postString.date}</span>&nbsp;&nbsp;<span style = "color:var(--secondary)">${postString.title}</span></h2><span>${postString.content}</span><br>${postString.image}<p style = "color:var(--tertiary)"><i><img src = "${user.profile}" class = "pfp"/>&nbsp;&nbsp;${user.name}</i>&nbsp;&nbsp;${badge}</p></div></a> ${posts}`;
							posts = structure; // adds newly evaluated post to continuing string
						})();
					}
				}
				eval(await db.get(token));
				res.render("home", {
					posts: posts,
					user: user.name,
					profile: user.profile,
				});
			}
		})();
	});
}