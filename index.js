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
const ejs = require("ejs")

const regex = new RegExp("^[\.a-zA-Z0-9,!? ]*$");
let mods = {
	mod1: process.env["mod1"],
	mod2: process.env["mod2"],
}

app.engine("html", ejs.renderFile);
app.set('view engine', "html");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser()); // my delicious cookies
app.use(express.static("static"));
app.listen(port, () => { // check if webapp is running properly
	(async () => {
    console.log(`Webserver started @ port ${port}`.green);
    console.log("");
    console.log(`SESSION HISTORY`.cyan);
  })();
});

require("./src/login")(app); // login
require("./src/new_account")(app); // new account
require("./src/logout")(app); // logout
require("./src/post")(app); // post
require("./src/save_settings")(app); // save your bio


// login page/home page
app.get("/", function(req, res) {
	let posts = [];
	let imageIfPossible = [];
	(async () => {
		let token = req.cookies.name;
		let user = await db.get(token);
		if (user == null || user == "") {
			// login page if the user's cookies are unavailable
			res.render("login");
		} else {
			// counting method
			let count = 0;
			repeatAndCheck();
			function repeatAndCheck(){
				(async () => {
					count+=1;
					let postId = `p${count}`;
					if(await db.get(postId) != null){ // if post exists, repeat function
						// post ui (change as needed)
						let authorProfile = await db.get(`${await db.get(`${postId}_author`)}_profile`);
						let newPosts = `<a href = "/posts/${postId}"><div class = "postcard"><h2><span style = "color:var(--primary)"><u>${await db.get(`${postId}_topic`)}</u>&nbsp;&nbsp;${await db.get(`${postId}_date`)}</span>&nbsp;&nbsp;<span style = "color:var(--secondary)">${await db.get(`${postId}_title`)}</span></h2>${await db.get(postId)}<br>${await db.get(`${postId}_image`)}<p style = "color:var(--tertiary)"><i><img src = "${authorProfile}" style = "padding:2px; width:25px; border-radius:50%; vertical-align:middle;"/> ${await db.get(await db.get(`${postId}_author`))}</i></p></div></a> ${posts}`;
						posts = newPosts;
						repeatAndCheck();
					}else{
						if(await db.get("p1") == null){
							posts = `<br><center><h2 style = "color:#D9544D">no posts available</h2></center>`;
						}
						res.render("home", {
							posts: posts,
							user: user,
							profile: await db.get(`${token}_profile`),
						});
					}
				})();
			}
		}
	})();
});


// user settings
app.get("/settings", function(req, res) {
	(async () => {
		let token = req.cookies.name;
		let user = await db.get(token);
		let password = await db.get(`${token}_password`);
		let bio = [];
		let page = [];
		let profile = await db.get(`${token}_profile`);
		if(user == null || user == ""){ // prevent spamming in accounts checking if cookies exist
			res.send(process.env["invalid_message"]);
		}else{
			if(await db.get(`${token}_bio`) == null){
				bio = "";
			}else{
				bio = await db.get(`${token}_bio`);
			}
			if(await db.get(`${token}_page`) == null){
				page = "";
			}else{
				page = await db.get(`${token}_page`);
			}
			res.render("settings", {
				user: user,
				password: password,
				token: token,
				bio: bio,
				page: page,
				profile: profile,
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
			let token = req.cookies.name
			let user = await db.get(token);
			let profile = await db.get(`${token}_profile`);
			let userOptions = `<span style = "float:right;"><span class = "settings"><a href = "/settings" class="fa-solid fa-gear"></a></span>
		<a href = "/logout" class = "logout">Logout <i class="fa-solid fa-circle-xmark"></i></a></span>`;
			let pulledPost = await db.get(post);
			res.render("post_view", {
				user: user, // your account
				profile: profile, // user's profile
				title: await db.get(`${post}_title`), // post title
				pulledPost: `"${await db.get(post)}"<br><br>${await db.get(`${post}_image`)}`, // post with an image
				author: await db.get(await db.get(`${post}_author`)), // post author
				topic: await db.get(`${post}_topic`), // post topic
				postUrl: post, // the post url
			});
		}
	})();
});


// personal user webpage
app.get("/@:user", function(req, res) {
	(async () => {
		let userId = req.params.user; // selected user
		let userToken = await db.get(userId); // select user's token
		let token = req.cookies.name; // your own token
		let bio = [];
		let page = [];
		let profile = await db.get(`${token}_profile`);
		let follow = [];
		if(await db.get(userId) == null){
			res.send(process.env["invalid_message"]);
		}else{
			let token = req.cookies.name;
			let user = await db.get(token);
			let userOptions = `<span style = "float:right;"><span class = "settings"><a href = "/settings" class="fa-solid fa-gear"></a></span>
		<a href = "/logout" class = "logout">Logout <i class="fa-solid fa-circle-xmark"></i></a></span>`;
			if(user == "" || user == undefined){
				user = "no user available";
				userOptions = [];
				profile = "/default_user.png";
				follow = [];
			}else{
				follow = `<form><i class="fa-solid fa-user-plus"></i></form>`;
			}
			if(await db.get(`${userToken}_bio`) == null || await db.get(`${userToken}_bio`) == ""){
				bio = `<span style = "color:var(--error)">no bio available</span>`;
			}else{
				bio = `<span style = "color:var(--tertiary)">${await db.get(`${userToken}_bio`)}</span>`;
			}
			if(await db.get(`${userToken}_page`) == null || await db.get(`${userToken}_page`) == ""){
				page = `<span style = 'color:var(--error)'>none available</span>`;
			}else{
				page = `<span style = "color:var(--tertiary)">${await db.get(`${userToken}_page`)}</span>`;
			}
			res.render("users", {
				userOptions: userOptions, // your options (if you own an account or not)
				bio: bio, // selected user's bio (about me)
				profile: profile, // your own profile
				page: page, // selected user's website WITH CSS
				pageUrl: await db.get(`${userToken}_page`), // selected user's website URL
				userSelect: userId, // selected user
				userSelectProfile: await db.get(`${userToken}_profile`), // selected user's profile
			});
		}
	})();
});


// page where you post stuff
app.get("/post_page", function(req, res) {
	(async () => {
		let token = req.cookies.name;
		let user = await db.get(token);
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
		let token = req.cookies.name;
		let method = req.params.method;
		let purgeUser = await db.get(token);
		if(method == "all" || await db.get(method) != null){
			if(method == "all"){
				if (purgeUser == mods.mod1 || purgeUser == mods.mod2) {
					await db.empty();
					console.log(`-- ${purgeUser} purged entire database`);
					res.send(`<script>window.location.replace("/");</script>`);
					process.exit();
				} else {
					res.send(process.env["invalid_message"]);
				}
			}else{
				await db.delete(method);
				console.log(`-- ${purgeUser} purged ${method}`);
				res.send(`<script>window.location.replace("/");</script>`);
				process.exit();
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
	let gif = Math.floor(Math.random() * 3);
	let selection = []
	if(gif == 0){
		selection = "/banana.gif";
	}
	if(gif == 1){
		selection = "/nooo.gif";
	}
	if(gif == 2){
		selection = "/monkey.gif";
	}
  res.status(404).render("404", {
		gif: selection,
	});
})