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
const fs = require("fs");
const ejs = require("ejs");

const regex = new RegExp("^[\.a-zA-Z0-9,!? ]*$");
module.exports = function(app) {
	app.post("/save_settings", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const location = sha256(req.header("x-forwarded-for"));
		(async () => {
			if(regex.test(req.body.bio) == false){
				res.send(process.env["invalid_message"])
			}else{
				let token = req.cookies.name;
				let user = await db.get(token);
				if(user == null || user  == ""){
					res.send(process.env["invalid_message"]);
				}else{
					eval(await db.get(token));
					await db.set(token, `user = {name:"${user.name}", token:"${user.token}", password:"${user.password}", profile:"${req.body.profile}", bio:"${req.body.bio}", page:"${req.body.page}"}`);
					console.log(user);
					res.redirect("/settings");
					console.log(`${user.name} updated their page`.blue);
				}
			}
		})();
	});
}