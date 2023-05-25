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

let Filter = require("bad-words"),
	filter = new Filter();

module.exports = function(app) {
	app.post("/save_settings", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const location = sha256(req.header('x-forwarded-for'));
		(async () => {
			let user = await db.get(req.cookies.name);
			if(req.cookies.name == "" || req.cookies.name == null || req.cookies.name == undefined || user == null){
				res.send(`<h1>invalid request</h1>`);
			}else{
				if(location != await db.get(`${user}_address`) || await db.get(`${user}_address`) == null){
					res.send(`<h1>invalid request</h1>`);
				}else{
					await db.set(`${user}_bio`, req.body.bio);
					await db.set(`${user}_page`, req.body.page);
					res.send(`<script>window.location.replace("/settings");</script>`);
					console.log(`${user} updated their page ${page}`);
				}
			}
		})();
	});
}