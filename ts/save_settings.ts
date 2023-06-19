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

const regex = /^[\.a-zA-Z0-9,!? ]*$/;
const imgRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
module.exports = function(app) {
	app.post("/save_settings", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		(async () => {
			if(regex.test(req.body.bio) == false || imgRegex.test(req.body.profile) == false){
				res.render("404");
				console.log(`bio: ${req.body.bio} & profile: ${req.body.profile}`)
			}else{
				let token = req.cookies.name;
				let user = await db.get(token);
				eval(user);
				if(user == null || token == "" || req.cookies.password != user.password){
					res.render("404");
				}else{
					eval(await db.get(token));
					await db.set(token, `user = {name:"${user.name}", token:"${user.token}", password:"${user.password}", profile:"${req.body.profile}", bio:"${req.body.bio}", page:"${req.body.page}"}`);
					res.redirect("/settings");
					console.log(`${user.name} updated their page`.blue);
				}
			}
		})();
	});
}