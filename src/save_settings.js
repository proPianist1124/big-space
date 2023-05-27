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
				let user = req.cookies.name;
				if(await db.get(user) == null || await db.get(user) == ""){
					res.send(process.env["invalid_message"]);
				}else{
					await db.set(`${await db.get(user)}_bio`, req.body.bio);
					await db.set(`${await db.get(user)}_page`, req.body.page);
					res.send(`<script>window.location.replace("/settings");</script>`);
					console.log(`${await db.get(user)} updated their page`.blue);
				}
			}
		})();
	});
}