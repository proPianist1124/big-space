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

// backend code for public pages
require("./backend/pages/home.ts")(app); // home
require("./backend/pages/post_page.ts")(app); // where to post
require("./backend/pages/post_view.ts")(app); // default post view
require("./backend/pages/settings.ts")(app); // account settings
require("./backend/pages/user_view.ts")(app); // view user profile

// actions
require("./backend/action/login.ts")(app); // login
require("./backend/action/new_account.ts")(app); // new account
require("./backend/action/logout.ts")(app); // logout
require("./backend/action/post.ts")(app); // post
require("./backend/action/save_settings.ts")(app); // save your bio
require("./backend/action/comment.ts")(app); // add a comment to a post


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