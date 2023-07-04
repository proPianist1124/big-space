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

const icons = {
	ellipse:`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots-vertical" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>`,
	maximize:`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-maximize" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M16 4l4 0l0 4"></path><path d="M14 10l6 -6"></path><path d="M8 20l-4 0l0 -4"></path><path d="M4 20l6 -6"></path><path d="M16 20l4 0l0 -4"></path><path d="M14 14l6 6"></path><path d="M8 4l-4 0l0 4"></path><path d="M4 4l6 6"></path></svg>`,
}

const apiLimiter = rateLimit({
	windowMs: 45 * 60 * 1000, // 45 minute window
	max: 15, // 15 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"bro stop reloading the pages so much :)",
});

module.exports = function(app) {
	// login page/home page
	app.get("/", apiLimiter, function(req, res) {
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
							const menu = `<div class="dropdown">${icons.ellipse}<div class="dropdown-content"><a href = "/${postId}/${postString.title.replace(/\s+/g, '-').toLowerCase()}">Open</a><br><a href = "/@${user.name}">Follow</a></div></div>`;
							
							let structure = `<div class = "postcard" onclick = "document.cookie = 'post=${postId}'"><h2><span style = "color:var(--primary)">${postString.date}</span>&nbsp;<span style = "color:var(--secondary)">${postString.title}</span>${menu}</h2><span>${postString.content}</span><br>${postString.image}<br><span style = "color:var(--secondary)">${postString.topic}</span><br><a href = "/@${user.name}" class = "default"><i><img src = "${user.profile}" class = "pfp"/>&nbsp;&nbsp;${user.name}</i>&nbsp;&nbsp;${badge}</a><br><br></div> ${posts}`;
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