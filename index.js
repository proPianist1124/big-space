// https://replit.com/talk/learn/Replit-DB/43305
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

const regex = new RegExp("^[\.a-zA-Z0-9,!? ]*$");
let mods = {
	mod1: process.env["mod1"],
	mod2: process.env["mod2"],
}

app.set("view engine", "ejs");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser()); // my delicious cookies
app.use(express.static("static"));
app.listen(port, () => { // check if webapp is running properly
  console.log(`Webserver started @ port ${port}`.green);
  console.log("");
  console.log(`SESSION HISTORY`.cyan);
});

function sha256(input) {
	return createHash("sha256").update(input).digest("hex");
}

require("./src/login")(app); // login
require("./src/new_account")(app); // new account
require("./src/logout")(app); // logout
require("./src/post")(app); // post
require("./src/save_settings")(app); // save your bio

// login page/home page
app.get("/", function(req, res) {
	const location = sha256(req.header("x-forwarded-for"));
	(async () => {
		let user = await db.get(req.cookies.name);
		if (await db.get("totalPosts") == null) {
			totalPosts = `<br><center><h2 style = "color:#D9544D">NO POSTS AVAILABLE</h2></center>`;
		} else {
			totalPosts = await db.get("totalPosts");
		}
		if (user == null || user == "") {
			// login page if the user's cookies are unavailable
			res.render("login");
		} else {
			res.render("home", {
				totalPosts: totalPosts,
				user: user,
			});
		}
	})();
});

// user settings
app.get("/settings", function(req, res) {
	const location = sha256(req.header("x-forwarded-for"));
	(async () => {
		let user = await db.get(req.cookies.name);
		let password = await db.get(`${req.cookies.name}_password`);
		let bio = [];
		let page = [];
		if(user == null || user == ""){ // prevent spamming in accounts checking if cookies exist
			res.send(process.env["invalid_message"]);
		}else{
			if(await db.get(`${user}_bio`) == null){
				bio = "";
			}else{
				bio = await db.get(`${user}_bio`);
			}
			if(await db.get(`${user}_page`) == null){
				page = "";
			}else{
				page = await db.get(`${user}_page`);
			}
			res.render("settings", {
				user: user,
				password: password,
				token: req.cookies.name,
				bio: bio,
				page: page,
			});
		}
	})();
});

// a post's unique page
app.get("/posts/:id", function(req, res) {
	(async () => {
		let post = req.params.id;
		if(await db.get(post) == null){
			res.send(process.env["invalid_message"]);
		}else{
			let user = await db.get(req.cookies.name);
			let userOptions = `<a href = "/logout" class = "logout">Logout <i class="fa-solid fa-circle-xmark"></i></a><a href = "/settings" style = "float:right; color:var(--primary)" class="fa-solid fa-gear"></a></h3>`;
			let pulledPost = await db.get(post);
			if(user == "" || user == undefined){
				user = "no user available";
				userOptions = [];
			}
			let postUrl = `https://big-space.propianist1124.repl.co/posts/${post}`;
			res.render("post_view", {
				title: await db.get(`${post}_title`),
				user: user,
				userOptions: userOptions,
				pulledPost: pulledPost,
				author: await db.get(`${post}_author`),
				post: post,
			});
		}
	})();
});

// personal user webpage
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
			res.render("users", {
				user: user,
				userOptions: userOptions,
			});
		}
	})();
});

// page where you post stuff
app.get("/post_page", function(req, res) {
	(async () => {
		let user = await db.get(req.cookies.name);
		if(user == null || user == ""){
			res.send(process.env["invalid_message"]);
		}else{
			if (user == process.env["mod1"]) {
				adminSelect = `<option value="#official">#official</option>`;
			} else {
				adminSelect = "";
			}
			res.render("post_page", {
				adminSelect: adminSelect,
			});
		}
	})();
});

// purge feature
app.get("/purge/:method", function(req, res) {
	(async () => {
		let method = req.params.method;
		let purgeUser = await db.get(req.cookies.name);
		if(method == "posts" || method == "all"){
			if(method == "posts"){
				if (purgeUser == mods.mod1 || purgeUser == mods.mod2) {
					await db.delete("totalPosts");
					console.log(`-- ${purgeUser} purged all posts`.red);
					res.send(`<script>window.location.replace("/");</script>`);
					process.exit();
				} else {
					res.send(process.env["invalid_message"]);
				}
			}
			if(method == "all"){
				if (purgeUser == mods.mod1 || purgeUser == mods.mod2) {
					await db.empty();
					console.log(`-- ${purgeUser} purged entire database`);
					res.send(`<script>window.location.replace("/");</script>`);
					process.exit();
				} else {
					res.send(process.env["invalid_message"]);
				}
			}
		}else{
			res.send(process.env["invalid_message"]);
		}
	})();
});

// big space careers!
app.get("/jobs", function(req, res) {
	res.render("jobs");
});

// custom 404 page
app.use((req, res, next) => {
  res.status(404).render(`404`);
})