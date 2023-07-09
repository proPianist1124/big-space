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
	app.post("/follow", function(req, res) {
		(async () => {
            let user = [];
			let newFollower = [];
			let newFollowerArray = [];
			let viewingUser = sha256(req.cookies.viewingUser);
			eval(await db.get(req.cookies.name));
			newFollower = user.name; // fill in the newFollower variable with your own username

			eval(await db.get(viewingUser)); // evaluate the person being followed's personal string
			if(user.followers.includes(newFollower) || req.cookies.name == sha256(req.cookies.viewingUser) || req.cookies.password != user.password){
				res.render("404");
			}else{
				user.followers.push(`"${newFollower}"`);
				for (let i = 0; i <= user.followers.indexOf(`"${newFollower}"`); i++) {
					if(user.followers[i] != user.followers[user.followers.indexOf(`"${newFollower}"`)]){ // if the i's result isn't the same as the new follower, push the other users into the new array
						newFollowerArray.push(`"${user.followers[i]}"`)
					}else{
						newFollowerArray.push(user.followers[i]);
					}
				}
				await db.set(viewingUser, `user = {name: "${user.name}", token: "${user.token}", password: "${user.password}", profile: "${user.profile}", bio: "${user.bio}", page: "${user.page}", badge: "${user.badge}", followers: [${newFollowerArray}]}`);
				res.redirect(`/@${req.cookies.viewingUser}`);
			}
		})();
	});
}