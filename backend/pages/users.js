const Redis = require("ioredis");
const db = new Redis("redis://default:8ddb7554a3974eb98a2636383355b9cc@clean-porpoise-38761.upstash.io:38761");
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
					page = user.page;
				}
				if(user.badge == "pro"){
					badge = `<span class = "badge">Pro Subscriber</span>`;
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
					followers: user.followers.length,
				});
			}
		})();
	});
}