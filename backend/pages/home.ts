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
				repeatAndCheck();
				function repeatAndCheck(){
					let badge = [];
					(async () => {
						count+=1;
						let postId = `p${count}`;
						if(await db.get(postId) != null){ // if post exists, repeat function
							// post ui (change as needed)
							eval(await db.get(postId));
							eval(await db.get(postString.author));
							if(user.badge){
								if(user.badge == "pro"){
									badge = process.env["pro_badge"];
								}
							}
							let structure = `<a href = "/posts/${postId}"><div class = "postcard" onclick = "document.cookie = 'post=${postId}'"><h2><span style = "color:var(--primary)"><u>${postString.topic}</u>&nbsp;&nbsp;${postString.date}</span>&nbsp;&nbsp;<span style = "color:var(--secondary)">${postString.title}</span></h2><span>${postString.content}</span><br>${postString.image}<p style = "color:var(--tertiary)"><i><img src = "${user.profile}" class = "pfp"/>&nbsp;&nbsp;${user.name}</i>&nbsp;&nbsp;${badge}</p></div></a> ${posts}`;
							posts = structure; // adds newly evaluated post to continuing string
							repeatAndCheck();
						}	else	{
							if(await db.get("p1") == null){
								posts = `<br><center><h2 style = "color:#D9544D">no posts available</h2></center>`;
							}
							eval(await db.get(token));
							res.render("home", {
								posts: posts,
								user: user.name,
								profile: user.profile,
							});
						}
					})();
				}
			}
		})();
	});
}