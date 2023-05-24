// https://replit.com/talk/learn/Replit-DB/43305
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
const { createHash } = require("node:crypto");

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser()); // my delicious cookies
app.use(express.static('static'));
app.listen(port, () => { // check if webapp is running properly
	console.log(`Webserver started @ port ${port}`.green);
	console.log("");
	console.log(`SESSION HISTORY`.cyan);
});

function startApp() {
	(async () => {
		require('./src/home')(app);
	})();
}

startApp(); // start the app

require('./src/login')(app); // login
require('./src/new_account')(app); // new account
require('./src/logout')(app); // logout
require('./src/purge')(app); // empty
require('./src/users')(app); // user page
require('./src/new_post')(app); // post
require('./src/post_page')(app); // post page
require('./src/post_view')(app); // post view
require('./src/settings')(app); // user settings
require('./src/save_settings')(app); // save your bio

app.use((req, res, next) => {
  res.status(404).send(`<title>Big Space | 404</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="stylesheet" href="/style.css"><script src = "/script.js"></script><script src="https://kit.fontawesome.com/09556a902e.js" crossorigin="anonymous"></script><h3><center><h1 style = "color:var(--quatenary)">Big Space&nbsp;<span style = "font-size:17px; color:var(--tertiary)">Share Content</span></h1><h2 style = "color:var(--error)">404 Not Found</h2><img src = "/saturn.png"><br><a href = "/"><button class = "login"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Go back</button></a></center>`);
})