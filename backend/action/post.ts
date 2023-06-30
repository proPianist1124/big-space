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
const cloudinary = require('cloudinary').v2;
const { createHash } = require("node:crypto");

const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minute window
	max: 3, // 3 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"chill out on the posts smh :)",
});

const regex = /^[\.a-zA-Z0-9,!? ]*$/;
const imgRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const topicRegex = /#[a-z0-9_]+/;

module.exports = function(app) {
	app.post("/post", apiLimiter, function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const location = sha256(req.header("x-forwarded-for"));
		(async () => {
			let token = req.cookies.name;
			let user = await db.get(token);
			eval(user);
			if (token == undefined || req.cookies.password == undefined || req.cookies.password != user.password) {
				res.render("404");
			} else {
				let postNum = 0;
				let image = [];
				let userTitle = req.body.postTitle;
				let userContent = req.body.postContent;
				let userTopic = req.body.postTopic;
				let userImage = req.body.postImage;

				if(userContent.includes(`"`) || userContent.includes(`<`) || userContent.includes(`>`)){
					if(userContent.includes(`"`)){
						userContent = userContent.replace(/"/g, "'"); // quotations break the entire "postString"
					}
					if(userContent.includes(`<`)){
						userContent = userContent.replace(/</g, "&lt;"); // prevent XSS attacks
					}
					if(userContent.includes(`>`)){
						userContent = userContent.replace(/>/g, "&gt;"); // prevent XSS attacks
					}
				}
				if(regex.test(userTitle) == false || topicRegex.test(userTopic) == false || userTitle.length > 40 || userContent.length > 250){ //regex pattern checking if title/content
					res.render("404");
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
							console.log(`New Post: ${userTitle.green} - ${userContent.green}`);

							if (userImage != "") { // to check if image url box is filled
								if(imgRegex.test(userImage) == false){ // confirm "userImage" is not an xss attack
									image = "";
								}else{
									image = `<center><img src = '${userImage}' style = 'width:50%; height:50%;'></center>`;
								}
							}else{
								image = "";
							}
							// set a database object for the post that DOESN'T exist
							console.log(userContent)
							await db.set(postName, `postString = {title: "${userTitle}", content: "${userContent}", date: "${fullDate}", topic: "${userTopic}", image: "${image}", likes: "0", dislikes: "0", author: "${req.cookies.name}"}`);
							console.log(await db.get(postName))
							res.redirect("/"); // send the client back to the og url
							
							let postNumber = parseInt(await db.get("postNumber")) + 1;
							await db.set("postNumber", postNumber)
						}
					})();
				}
			}
		})();
	});
}