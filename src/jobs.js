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

let mods = {
	mod1: process.env['mod1'],
	mod2: process.env['mod2'],
}

module.exports = function(app) {
	app.get("/jobs", function(req, res) {
		(async () => {
				res.send(`<title>Big Space | Jobs</title><meta name="description" content="Find Big Space jobs here! Join us today!"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="/style.css"><script src = "/script.js"></script><script src="/fontawesome.js"></script><center><h1 style = "color:var(--quatenary)">Big Space&nbsp;<span style = "font-size:17px; color:var(--tertiary)">Share Content</span></h1><main><h2>Big Space Jobs</h2><p>Interested? We're hiring the current roles below!</p></main><main style = "box-shadow:none;"><div class = "card"><h3 style = "color:var(--tertiary)"><i class="fa-solid fa-shield-halved"></i> Security</h3>Experienced with Node.js, Nodemailer, and Express. Should also be familiar with hashing passwords and IP addresses.</div><br><div class = "card"><h3 style = "color:var(--tertiary)"><i class="fa-regular fa-file-code"></i> Backend Dev</h3>Familiar with Node.js Express package, know how to configure a web server, ratelimit, and build a simple IP verification.</div><br><div class = "card"><h3 style = "color:var(--tertiary)"><i class="fa-solid fa-desktop"></i> UX Designer</h3>Should know how to use Figma, create concept designs, and apply them into HTML5 format (using CSS3 as well).</div></main><a href = "/"><button class = "login"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Go back</button></a></center>`);
		})();
	});
}