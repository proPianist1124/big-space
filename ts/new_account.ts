const Database = require("@replit/database");
const db = new Database();
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
	windowMs: 5 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message:"invalid request, try again later :)",
});

const regex = /^[\.a-zA-Z0-9,!? ]*$/;
let accounts = [];
module.exports = function(app) {
	app.post("/new_account", apiLimiter, function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const newUser = req.body.newAccount;
		const newPass = req.body.newPassword;
		// const location = sha256(req.header("x-forwarded-for")); dont need to save locations for the time being
		start();
		function start() {
			(async () => {
				// custom ratelimit:
				if(await db.get("requestsSent") >= 50){
					await db.set("requestsSent", 50);
					res.send(`Please wait 30 minutes before creating a new account`);
					console.log("countdown starting!".red);
					setTimeout(() => { // timeout of 30 minutes for ever fifty new accounts (prevent spammers)
						go();
						async function go() {
							await db.delete("requestsSent");
							console.log("ratelimit gone!".green);
						}
					}, 1800000);
				}else{
					if(await db.get("requestsSent") == null){ // 
						await db.set("requestsSent", 1);
					}else{
						let newRequest = parseInt(await db.get("requestsSent")) + 1
						await db.set("requestsSent", newRequest);
						newAccount();
					}
				}
				async function newAccount(){ // async function for creating an account after ratelimit
					if(regex.test(newUser) == false){
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