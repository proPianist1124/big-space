const Database = require("@replit/database");
const db = new Database();
const colors = require('colors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const port = 3000;
const http = require('http');
const bp = require('body-parser');

let mods = {
	mod1: process.env['mod1'],
	mod2: process.env['mod2'],
}

module.exports = function(app) {
	app.get("/posts/:id", function(req, res) {
		(async () => {
			let post = req.params.id;
			if(await db.get(post) == null){
				res.send(`<h1>invalid request</h1>`);
			}else{
				let user = await db.get(req.cookies.name);
				let userOptions = `<a href = "/logout" class = "logout">Logout <i class="fa-solid fa-circle-xmark"></i></a><a href = "/settings" style = "float:right; color:var(--primary)" class="fa-solid fa-gear"></a></h3>`;
				let pulledPost = await db.get(post);
				if(user == "" || user == undefined){
					user = "no user available";
					userOptions = [];
				}
				let postUrl = `https://big-space.propianist1124.repl.co/posts/${post}`;
				res.send(`<title>Big Space | ${await db.get(`${post}_title`)}</title><meta name="description" content="${await db.get(`${post}_author`)}'s new post: ${await db.get(`${post}_title`)} - Click to View!'"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="/style.css"><script src = "/script.js"></script><script src="https://kit.fontawesome.com/09556a902e.js" crossorigin="anonymous"></script><h3>&nbsp;&nbsp;<i class="fa-solid fa-user"></i> <span style = 'color:var(--primary)'>&nbsp;${user}</span>${userOptions}<center><h1 style = "color:var(--quatenary)">Big Space&nbsp;<span style = "font-size:17px; color:var(--tertiary)">Share Content</span></h1></center><main><h1 style = "text-align:center">"${await db.get(`${post}_title`)}" - <span style = "color:var(--secondary)">Expanded View</span></h2></main><h3>${pulledPost}</h3><br><center><h2>Impressed? <a href = "/@${await db.get(`${post}_author`)}" class = "user">Follow ${await db.get(`${post}_author`)}!</a>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-share" onclick = "copy()"></i></h2><a href = "/"><button class = "login"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Go back</button></a></center>`);
			}
		})();
	});
}