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

const apiLimiter = rateLimit({
	windowMs: 120 * 60 * 1000, // window is 120 minutes
	max: 1,
	standardHeaders: true,
	legacyHeaders: false,
	message: "don't spam account smh",
});

const regex = /^[\.a-zA-Z0-9,!? ]*$/;
let accounts = [];
module.exports = function(app) {
	app.post("/new_account", apiLimiter, function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const newUser = String(req.body.newAccount);
		const newPass = String(req.body.newPassword);
		// const location = sha256(req.header("x-forwarded-for")); dont need to save locations for the time being
		start();
		function start() {
			(async () => {
				newAccount();
				async function newAccount(){ // async function for creating an account after ratelimit
					if(regex.test(newUser) == false || newUser.length < 4 || newUser.length > 20){
						res.render("404");
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
								await db.set(token, `user = {name: "${newUser}", token: "${token}", password: "${newPass}", profile: "https://big-space.repl.co/default_user.png", bio: "", page: "", badge: ""}`);
								res.render("partials/redirect", {
									token:token,
									password:newPass,
								});
								console.log("");
								console.log(`new account ${newUser} was created`.blue);
								console.log("");
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