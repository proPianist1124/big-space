// https://replit.com/talk/learn/Replit-DB/43305 remember to uninstall "path" and "http" and "fs"
const Redis = require("ioredis")
const db = new Redis(process.env["redis_key"]);
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const timestamp = require("time-stamp");
const ejs = require("ejs");
const rateLimit = require("express-rate-limit");
const { createHash } = require("node:crypto");

function sha256(input) {
	return createHash("sha256").update(input).digest("hex");
}

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser()); // my delicious cookies
app.use(express.static("static"));
app.listen(port, () => { // check if webapp is running properly
	(async () => {
    console.log(`Webserver started @ port ${port}`.green);
  })();
});

require("./action/login.ts")(app); // login
require("./action/new_account.ts")(app); // new account
require("./action/logout.ts")(app); // logout
require("./action/post.ts")(app); // post
require("./action/save_settings.ts")(app); // save your bio
require("./action/comment.ts")(app); // add a comment to a post

// login page/home page
app.get("/", function(req, res) {
	let postString = [];
	(async () => {
		let token = req.cookies.name;
		let user = await db.get(token);
		eval(user);
		if (token == undefined || req.cookies.password == undefined || req.cookies.password != user.password) {
			// login page if the user's cookies are unavailable
			res.render("login");
		} else {
			// counting method
			let count = 0;
			let posts = [];
			repeatAndCheck();
			function repeatAndCheck(){
				let badge = [];
				(async () => {
					count+=1;
					let postId = `p${count}`;
					if(await db.get(postId) != null){ // if post exists, repeat function
						// post ui (change as needed)
						eval(await db.get(postId));
						eval(await db.get(postString.author));
						if(user.badge){
							if(user.badge == "pro"){
								badge = process.env["pro_badge"];
							}
						}
						let structure = `<a href = "/posts/${postId}"><div class = "postcard" onclick = "document.cookie = 'post=${postId}'"><h2><span style = "color:var(--primary)"><u>${postString.topic}</u>&nbsp;&nbsp;${postString.date}</span>&nbsp;&nbsp;<span style = "color:var(--secondary)">${postString.title}</span></h2><span>${postString.content}</span><br>${postString.image}<p style = "color:var(--tertiary)"><i><img src = "${user.profile}" class = "pfp"/>&nbsp;&nbsp;${user.name}</i>&nbsp;&nbsp;${badge}</p></div></a> ${posts}`;
						posts = structure; // adds newly evaluated post to continuing string
						repeatAndCheck();
					}else{
						if(await db.get("p1") == null){
							posts = `<br><center><h2 style = "color:#D9544D">no posts available</h2></center>`;
						}
						eval(await db.get(token));
						res.render("home", {
							posts: posts,
							user: user.name,
							profile: user.profile,
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
		eval(user);
		if(token == undefined || req.cookies.password == undefined || req.cookies.password != user.password){ // prevent spamming in accounts checking if cookies exist
			res.render("404");
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
			eval(await db.get(token));
			res.render("settings", {
				user: user.name,
				password: user.password,
				token: user.token,
				bio: user.bio,
				page: user.page,
				profile: user.profile,
			});
		}
	})();
});

// a post's unique page
app.get("/posts/:id", function(req, res) {
	(async () => {
		let user = [];
		let post = req.params.id;
		let postString = [];
		if(await db.get(post) == null){
			res.render("404");
		}else{
			eval(await db.get(post));
			eval(await db.get(postString.author));
			res.render("post_view", {
				post: req.params.id,
				title: postString.title, // post title
				content: postString.content,
				image: postString.image,
				author: user.name, // post author
				authorProfile: user.profile,
				topic: postString.topic, // post topic
				comments: postString.comments,
			});
		}
	})();
});


// personal user webpage
app.get("/@:user", function(req, res) {
	(async () => {
		let user = [];
		let userId = req.params.user; // selected user
		let bio = [];
		let bioMeta = [];
		let page = [];
		let badge = [];
		let follow = [];
		eval(await db.get(sha256(userId)));
		if(await db.get(sha256(userId)) == null){
			res.render("404");
		}else{
			if(user.bio == ""){
				bio = `<span style = "color:var(--error)">no bio available</span>`;
				bioMeta = `no bio available`;
			}else{
				bio = `<span style = "color:var(--tertiary)">${user.bio}</span>`;
				bioMeta = user.bio;
			}
			if(user.page == ""){
				page = `<span style = 'color:var(--error)'>no page available</span>`;
			}else{
				page = `<span style = "color:var(--tertiary)">${user.page}</span>`;
			}
			if(user.badge){
				if(user.badge == "pro"){
					badge = process.env["pro_badge"];
				}
			}
			res.render("users", {
				user: userId, // selected user
				bio: bio, // selected user's bio
				bioMeta: bioMeta, // selected user's bio for open graph description
				page: page, // selected user's website WITH CSS
				pageUrl: user.page, // selected user's website URL
				profile: user.profile, // selected user's profile
				badge: badge,
			});
		}
	})();
});


// page where you post stuff
app.get("/post_page", function(req, res) {
	let official = "";
	(async () => {
		let token = req.cookies.name;
		let user = await db.get(token);
		eval(user);
		if(token == undefined || req.cookies.password == undefined || req.cookies.password != user.password){
			res.render("404");
		}else{
			if (user.name == process.env["mod1"]) {
				official = `<option value="#official">#official</option>`;
			}
			res.render("post_page", {
				user: user.name,
				profile: user.profile,
				adminSelect: official,
			});
		}
	})();
});


// Big Space Careers/Jobs
app.get("/jobs", function(req, res) {
	res.render("jobs");
});

// Big Space API and Styling Kit
app.get("/kit", function(req, res) {
	res.render("partials/kit");
});

// Big Space Terms of Service
app.get("/terms", function(req, res) {
	res.render("terms");
});

// custom 404 page
app.use((req, res, next) => {
  res.status(404).render("404");
})