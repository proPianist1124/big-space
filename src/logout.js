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
			let token = await db.get(req.cookies.name);
			console.log("");
			console.log(`${token} has logged out`.red);
			console.log("");
			res.clearCookie("name");
			res.send(`<script>window.location.replace("/");</script>`);
		})();
	});
}