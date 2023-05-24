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

let adminSelect = [];
module.exports = function(app) {
	app.post('/post_page', function(req, res) {
		(async () => {
			let user = req.cookies.name;
			if(user == "" || user == undefined || await db.get(user) == null){
				res.send(`<h1>invalid request</h1>`);
			}else{
				if (req.cookies.name == process.env['mod1']) {
					adminSelect = `<option value="#official">#official</option>`;
				} else {
					adminSelect = "";
				}
				res.send(`<title>Big Space | New Post</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="style.css"><script src = "/script.js"></script><script src="https://kit.fontawesome.com/09556a902e.js" crossorigin="anonymous"></script><center><h1 style = "color:var(--quatenary)">Big Space&nbsp;<span style = "font-size:17px; color:var(--tertiary)">Share Content</span></h1></center><br><div style = "color:var(--primary)"><h2>New Post&nbsp;&nbsp;<a href = "/"><button class = "normal"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Go back</button></a></h2><form action = '/post' method = 'POST'><br>&nbsp;<input placeholder = 'title' name = 'postTitle' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' maxlength = "25" pattern = "^[\.a-zA-Z0-9,!? ]*$" required><br>&nbsp;<input placeholder = 'content' name = 'postContent' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' maxlength = "100" pattern = "^[\.a-zA-Z0-9,!? ]*$" required><br><span style = "padding:2px;"></span><select name="postTopic"><option value="#random">#random</option><option value="#programming">#programming</option><option value="#comedy">#comedy</option><option value="#business">#business</option><option value="#politics">#politics</option>${adminSelect}</select><br>&nbsp;<input placeholder = 'photo [url]' name = 'postImage' id = 'userPost' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' type = "url"><br><br><button type = 'submit' class = "login">Post <i class="fa-solid fa-folder-plus"></i></button></form></div>`);
			}
		})();
	});
}