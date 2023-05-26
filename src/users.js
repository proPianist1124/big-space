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
	app.get("/@:user", function(req, res) {
		(async () => {
			let userId = req.params.user;
			let bio = [];
			let page = [];
			let follow = [];
			if(await db.get(userId) == null){
				res.send(process.env["invalid_message"]);
			}else{
				let user = await db.get(req.cookies.name);
				let userOptions = `<a href = "/logout" class = "logout">Logout <i class="fa-solid fa-circle-xmark"></i></a><a href = "/settings" style = "float:right; color:var(--primary)" class="fa-solid fa-gear"></a></h3>`;
				if(user == "" || user == undefined){
					user = "no user available";
					userOptions = [];
					follow = [];
				}else{
					follow = `<form><i class="fa-solid fa-user-plus"></i></form>`;
				}
				if(await db.get(`${userId}_bio`) == null || await db.get(`${userId}_bio`) == ""){
					bio = `<span style = "color:var(--error)">no bio available</span>`;
				}else{
					bio = `<span style = "color:var(--tertiary)">${await db.get(`${user}_bio`)}</span>`;
				}
				if(await db.get(`${userId}_page`) == null || await db.get(`${userId}_page`) == ""){
					page = `<span style = "color:var(--error)">no website available</span>`;
				}else{
					page = `<span style = "color:var(--tertiary)">${await db.get(`${user}_page`)}</span>`;
				}
				res.send(`<title>Big Space | ${userId}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="/style.css"><script src = "/script.js"></script><script src="/fontawesome.js"></script><h3>&nbsp;&nbsp;<i class="fa-solid fa-user"></i> <span style = 'color:var(--primary)'>&nbsp;${user}</span>${userOptions}<center><h1 style = "color:var(--quatenary)">Big Space&nbsp;<span style = "font-size:17px; color:var(--tertiary)">Share Content</span></h1></center><br><main><h2 style = "text-align:center">${userId}</h2><p style = "text-align:left; font-size:18px;"><i class="fa-solid fa-address-card"></i> About me: ${bio}<br><i class="fa-solid fa-globe"></i> Website: <a href = "${await db.get(`${user}_page`)}" class = "bio" target = "_blank">${page}</a></p></main><br><center><a href = "/"><button class = "login"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Go back</button></a></center>`);
			}
		})();
	});
}