const Redis = require("ioredis");
const db = new Redis("redis://default:8ddb7554a3974eb98a2636383355b9cc@clean-porpoise-38761.upstash.io:38761");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const timestamp = require("time-stamp");
const ejs = require("ejs");
const rateLimit = require("express-rate-limit");
const sha256 = require('js-sha256');

const regex = /^[\.a-zA-Z0-9,!? ]*$/;
const imgRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

module.exports = function(app) {
	app.post("/save_settings", function(req, res) {
		(async () => {
			if(regex.test(req.body.bio) == false || imgRegex.test(req.body.profile) == false){
				res.render("404");
			}else{
				let token = req.cookies.name;
				let user = [];
				if(req.cookies.name != undefined || req.cookies.password != undefined){
					eval(await db.get(String(token)));
				}
				if(token == undefined || req.cookies.password == undefined || req.cookies.password != user.password){
					res.render("404");
				}else{
					eval(await db.get(token));
					await db.set(token, `user = {name:"${user.name}", token:"${user.token}", password:"${user.password}", profile:"${req.body.profile}", bio:"${req.body.bio}", page:"${req.body.page}"}`);
					res.redirect("/settings");
					console.log(`${user.name} updated their page`);
				}
			}
		})();
	});
}