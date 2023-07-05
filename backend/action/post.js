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
const sha256 = require('js-sha256');

const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minute window
	max: 3, // 3 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message:"chill out on the posts smh :)",
});

const xssRegex = /^[^<>;]+$/;
const quoRegex = /^[^"]*$/;
const imgRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const topicRegex = /#[a-z0-9_]+/;

module.exports = function(app) {
	app.post("/post", apiLimiter, function(req, res) {
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

				if(xssRegex.test(userTitle) == false || xssRegex.test(userContent) == false || quoRegex.test(userTitle) || quoRegex.test(userContent) || topicRegex.test(userTopic) == false || userTitle.length > 40 || userContent.length > 250){ //regex pattern checking if title/content
					// custom messages to let user know what they're doing wrong
					if(xssRegex.test(userTitle) == false || xssRegex.test(userContent) == false){
						res.send(`our system thinks that you're making an XSS attack on our site. dont't use "<" or ">" symbols`);
					}
					if(quoRegex.test(userTitle) == false || quoRegex.test(userContent) == false){
						res.send(`don't use double quotation marks ("") - instead, use single quotation marks ('')`);
					}
					if(topicRegex.test(userTopic) == false){
						res.send(`please don't try to make your own topics`);
					}
					if(userTitle.length > 40 || userContent.length > 250){
						res.send(`max characters for a title is 40 characters\nmax characters content is 250 characters`);
					}
				}else{
					post(); // start checking if post exists, then replace it if it doesnt
				}
				function post() {
					(async () => {
						let postName = `p${await db.get("postNumber")}`;
						let fullDate = timestamp("MM/DD");
						// let the server know that someone has posted (for security purposes)
						console.log(`New Post: ${userTitle} - ${userContent}`);
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
						await db.set(postName, `postString = {title: "${userTitle}", content: "${userContent}", date: "${fullDate}", topic: "${userTopic}", image: "${image}", likes: "0", dislikes: "0", author: "${req.cookies.name}"}`);
						res.redirect("/"); // send the client back to the og url
							
						let postNumber = parseInt(await db.get("postNumber")) + 1;
						await db.set("postNumber", postNumber)
					})();
				}
			}
		})();
	});
}