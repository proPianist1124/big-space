const Database = require("@replit/database");
const db = new Database();
const colors = require("colors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const timestamp = require("time-stamp");
const ejs = require("ejs");
const { createHash } = require("node:crypto");

const regex = new RegExp("^[\.a-zA-Z0-9,!? ]*$");
const imgRegex = new RegExp("^https://[^/]+/[^/?]+$");
const topicRegex = new RegExp("#[a-z0-9_]+");
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
				res.render("404");
			} else {
				let postNum = 0;
				let image = [];
				let userTitle = req.body.postTitle;
				let userContent = req.body.postContent;
				let userTopic = req.body.postTopic;
				let userImage = req.body.postImage;
				if(regex.test(userTitle) == false || regex.test(userContent) == false || topicRegex.test(userTopic) == false){ //regex pattern checking if title/content
					res.render("404");
				}else{
					if(userTopic != "#random" || userTopic != "#programming" || userTopic != "#comedy" || userTopic != "#business" || userTopic != "#politics" || userTopic != "#official"){
						res.render("404");
					}else{
						counting(); // start checking if post exists, then replace it if it doesnt
					}
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
							console.log(`New Post: ${userTitle.green} - ${userContent.green}`);

							if (userImage != "") { // to check if image url box is filled
								if(imgRegex.test(userImage) == false){
									image = "";
								}else{
									image = `<center><img src = '${userImage}' style = 'width:50%; height:50%;'></center>`;
								}
							}else{
								image = "";
							}
							// set a database object for the post that DOESN'T exist
							await db.set(postName, `postString = {title: "${userTitle}", content: "${userContent}", date: "${fullDate}", topic: "${userTopic}", image: "${image}", likes: "0", dislikes: "0", author: "${req.cookies.name}"}`);
							res.redirect("/"); // send the client back to the og url
						}
					})();
				}
			}
		})();
	});
}