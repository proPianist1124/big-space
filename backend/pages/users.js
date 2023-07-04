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

function sha256(input) {
	return createHash("sha256").update(input).digest("hex");
}

const apiLimiter = rateLimit({
	windowMs: 45 * 60 * 1000, // 45 minute window
	max: 15, // 15 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"bro stop reloading the pages so much :)",
});

module.exports = function(app) {
	// personal user webpage
	app.get("/@:user", apiLimiter, function(req, res) {
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
				let userPosts = [];
				for (let i = 1; i < parseInt(await db.get("postNumber")); i++) {
					let postString = [];
					let postId = `p${i}`;
					eval(await db.get(postId));
					if(postString.author == sha256(userId)){
						userPosts = `<a href = "/${postId}/${postString.title.replace(/\s+/g, '-').toLowerCase()}"><div class = "usercard"><span style = "color:var(--secondary")>${postString.date}</span>&nbsp;&nbsp;${postString.title}</div></a>${userPosts}`;
					}
				}
				
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
					if(user.badge == "pro"){112
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
					posts: userPosts,
				});
			}
		})();
	});
}