const Database = require("@replit/database");
const db = new Database();
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const port = 3000;
const http = require("http");
const bp = require("body-parser");
const { createHash } = require("node:crypto");
const timestamp = require("time-stamp");

const regex = new RegExp("^[\.a-zA-Z0-9,!? ]*$");
let accounts = [];
module.exports = function(app) {
	app.post("/new_account", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const newUser = req.body.newAccount;
		const newPass = req.body.newPassword;
		const location = sha256(req.header("x-forwarded-for"));
		start();
		function start() {
			(async () => {
				// custom ratelimit:
				if(await db.get("requestsSent") >= 50){
					await db.set("requestsSent", 50);
					res.send(`${process.env['invalid_message']} - please wait 30 minutes (don't close this page)`);
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
				async function newAccount(){ // async function for creating an account after ratelimit is completely gone
					if(regex.test(newUser) == false){
						res.send(process.env["invalid_message"]);
					}else{
						if (await db.get(newUser) != null) {
							res.send(`this username has already been taken. <a href = "/">go back</a>`);
						} else {
							function urlCombo(length){
								let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
									retVal = "";
								for (let i = 0, n = charset.length; i < length; ++i) {
									retVal += charset.charAt(Math.floor(Math.random() * n));
								}
								return retVal;
							}
							let userId = urlCombo(15);
							if(await db.get(userId) == null){
								await db.set(userId, newUser);
								await db.set(newUser, userId);
								await db.set(newUser.toLowerCase(), true);
								await db.set(`${userId}_password`, newPass);
								await db.set(`${userId}_address`, location);
								res.send(`<script>window.location.replace("/"); document.cookie = "name=${userId}; SameSite=None; Secure";</script>`);
								console.log("");
								console.log(`new account ${newUser} was created`.blue);
								console.log("");
							}else{
								res.send(process.env["invalid_message"]);
							}
						}
					}
				}
			})();
		}
	});
}