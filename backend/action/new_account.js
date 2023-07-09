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

const apiLimiter = rateLimit({
	windowMs: 240 * 60 * 1000, // window is 120 minutes
	max: 1,
	standardHeaders: true,
	legacyHeaders: false,
	message: "don't spam account smh",
});

const regex = /^[A-Za-z0-9_-]*$/;

module.exports = function(app) {
	app.post("/new_account", apiLimiter, function(req, res) {
		const newUser = String(req.body.newAccount);
		const newPass = String(req.body.newPassword);

		start();
		function start() {
			(async () => {
				newAccount();
				async function newAccount(){ // async function for creating an account after ratelimit
					if(regex.test(newUser) == true || newUser.length < 4 || newUser.length > 20){
						if(regex.test(newUser) == true){
							res.send("please don't use special characters");
						}
						if(newUser.length < 4){
							res.send("username must be more than 4 letters");
						}
						if(newUser.length > 20){
							res.send("username can't be more than 20 letters");
						}
					}else{
						if (await db.get(newUser) != null) {
							res.send(`this username has already been taken. <a href = "/">go back</a>`);
						} else {
							/*function urlCombo(length){
								let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
									retVal = "";
								for (let i = 0, n = charset.length; i < length; ++i) {
									retVal += charset.charAt(Math.floor(Math.random() * n));
								}
								return retVal;
							}
							let token = urlCombo(15);*/
							let token = sha256(newUser);
							if(await db.get(token) == null){
								await db.set(token, `user = {name: "${newUser}", token: "${token}", password: "${newPass}", profile: "https://big-space.onrender.com/default_user.png", bio: "", page: "", badge: "", followers:[]}`);
								res.render("partials/redirect", {
									token:token,
									password:newPass,
								});
								console.log(`\nnew account ${newUser} was created\n`);
							}else{
								res.render("404");
							}
						}
					}
				}
			})();
		}
	});
}