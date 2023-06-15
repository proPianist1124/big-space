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
const ejs = require("ejs");

const regex = new RegExp("^[\.a-zA-Z0-9,!? ]*$");
const imgRegex = new RegExp("^https://[^/]+/[^/?]+$");
let mods = {
	mod1: process.env["mod1"],
	mod2: process.env["mod2"],
}

module.exports = function(app) {
	app.post("/post", function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const location = sha256(req.header("x-forwarded-for"));
		(async () => {
			let user = await db.get(req.cookies.name);
			if (user == null || user == "") {
				res.send(process.env["invalid_message"]);
			} else {
				let postNum = 0;
				let image = [];
				let user = await db.get(req.cookies.name);
				let userTitle = req.body.postTitle;
				let userContent = req.body.postContent;
				let userTopic = req.body.postTopic;
				let userImage = req.body.postImage;
				if(regex.test(userTitle) == false || regex.test(userContent) == false){ //regex pattern checking if title/content
					res.send(process.env["invalid_message"]);
				}else{
					counting(); // start checking if post exists, then replace it if it doesnt
				}
				function counting() {
					(async () => {
						postNum += 1;
						let postName = `p${postNum}`;
						if (await db.get(postName) != null) {
							counting(); // if post exists, repeat the entire process
						} else {
							let fullDate = timestamp("MM/DD");

							// let the server know that someone has posted (for security purposes)
							console.log(`${user.name}: ${userTitle.green} - ${userContent.green}`);

							if (userImage != "") { // to check if image url box is filled
								if(imgRegex.test(userImage) == false){
									image = "";
								}else{
									image = `<center><img src = "${userImage}" style = "width:50%; height:50%;"></center>`;
								}
							}else{
								image = "";
							}
							// set a database object for the post that DOESN'T exist
							await db.set(postName, `postString = {title: "${userTitle}", content: "${userContent}", date: "${fullDate}", topic: "${userTopic}", image: "${image}", author: "${req.cookies.name}"}`);
							res.redirect("/"); // send the client back to the og url
						}
					})();
				}
			}
		})();
	});
}