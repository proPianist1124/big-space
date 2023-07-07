const Redis = require("ioredis");
const db = new Redis("redis://default:8ddb7554a3974eb98a2636383355b9cc@clean-porpoise-38761.upstash.io:38761");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const timestamp = require("time-stamp");
const ejs = require("ejs");
const rateLimit = require("express-rate-limit");
const sha256 = require('js-sha256');

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser()); // my delicious cookies
app.use(express.static("static"));
app.use(express.static("uploads"));
app.listen(port, () => { // check if webapp is running properly
	(async () => {
		console.log(`Webserver started @ port ${port}`);
		await db.set("690d212001918a8757579b462ec5f67f37fd2383f40ddae6440f1691a47168e4", `user = {name: "proPianist1124", token: "690d212001918a8757579b462ec5f67f37fd2383f40ddae6440f1691a47168e4", password: "asdf#", profile: "https://res.cloudinary.com/dyemytgtv/image/upload/v1688502842/chicken_man6_nftversion_nsmsrq.png", bio: "im a cool guy!", page: "https://propianist1124.repl.co", badge: "pro", followers:[]}`)
	})();
});

// backend code for public pages
require("./backend/pages/home.js")(app); // home
require("./backend/pages/share.js")(app); // where to post
require("./backend/pages/post_view.js")(app); // default post view
require("./backend/pages/settings.js")(app); // account settings
require("./backend/pages/users.js")(app); // view user profile

// actions
require("./backend/action/login.js")(app); // login
require("./backend/action/new_account.js")(app); // new account
require("./backend/action/logout.js")(app); // logout
require("./backend/action/post.js")(app); // post
require("./backend/action/save_settings.js")(app); // save your bio
require("./backend/action/comment.js")(app); // add a comment to a post
require("./backend/action/follow.js")(app); // follow a user

// Big Space Careers/Jobs
app.get("/jobs", function(req, res) {
	res.render("jobs");
});

// Big Space API and Styling Kit
app.get("/kit", function(req, res) {
	if(req.cookies.name == "" || req.cookies.name == undefined || req.cookies.name != sha256(process.env["mod1"])){
		res.render("404");
	}else{
		res.render("partials/kit");
		console.log(`${req.cookies.name} is viewing the "kit" page`)
	}
});

// Big Space Terms of Service
app.get("/terms", function(req, res) {
	res.render("terms");
});

// custom 404 page
app.use((req, res, next) => {
  res.status(404).render("404");
})