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

module.exports = function(app) {
	app.get("/logout", function(req, res) {
		(async () => {
			let user = [];
			let token = await db.get(req.cookies.name);
			console.log("");
			console.log(`${user.name} has logged out`.red);
			console.log("");
			res.clearCookie("name");
			res.redirect("/");
		})();
	});
}