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

let mods = {
	mod1: process.env['mod1'],
	mod2: process.env['mod2'],
}

let totalPosts = [];
module.exports = function(app) {
	app.post('/post', function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const location = sha256(req.header('x-forwarded-for'));
		if (req.cookies.name == "" || req.cookies.name == undefined) {
			res.send(`<h1>invalid request</h1>`);
		} else {
			(async () => {
				let postNum = 0;
				let user = [];
				let userTitle = filter.clean(req.body.postTitle);
				let userContent = filter.clean(req.body.postContent);
				let userTopic = req.body.postTopic;
				let userImage = req.body.postImage;
				if (await db.get(req.cookies.name) == mods.mod1 || await db.get(req.cookies.name) == mods.mod2) {
					user = `[Admin] ${await db.get(req.cookies.name)}`;
				} else {
					user = await db.get(req.cookies.name);
				}

				let imageIfPossible = `<center><img src = "${userImage}" style = "width:50%; height:50%;"></center>`;
				counting();
				function counting() { // a function to check posts until it finds that one doesn't exist
					(async () => {
						postNum += 1;
						let postName = `post${postNum}`;
						if (await db.get(postName) != null) {
							totalPosts = `${totalPosts} ${await db.get(postName)}`;
							counting(); // if post exists, repeat the entire process to find one that DOES NOT exist
						} else {
							let fullDate = timestamp('MM/DD');

							// let the server know that someone has posted (for security purposes)
							console.log(`${user}: ${userTitle} - ${userContent}`);

							if (userImage == "") { // to check if the user has put anything into the image url box
								imageIfPossible = "";
							}
							// set a database object for the post that DOESN'T exist, filling up that empty slot
							await db.set(postName, `<main id = "${postName}"><h1><span style = "color:var(--primary)"><u>${userTopic}</u>&nbsp;&nbsp;${fullDate}</span>&nbsp;&nbsp;<span style = "color:var(--secondary)">${userTitle}</span></h1><h3>${userContent}</h3>${imageIfPossible}<p style = "color:var(--tertiary)"><i>made by ${user}</i></p></main>`);
							await db.set(`${postName}_title`, userTitle);
							await db.set(`${postName}_author`, await db.get(req.cookies.name));
							if (await db.get("totalPosts") == null) {
								await db.set("totalPosts", `<a href = "/posts/${postName}">${await db.get(postName)}</a>`); // of no other posts exist, set the database item to this post
							} else {
								// otherwise, add the new post to the string of other posts
								let newPostsAdded = `<a href = "/posts/${postName}">${await db.get(postName)}</a>${await db.get("totalPosts")}`;
								await db.set("totalPosts", newPostsAdded);
							}
							res.send(`<script>window.location.replace("/");</script>`); // send the client back to the og url
						}
					})();
				}
			})();
		}
	});
}