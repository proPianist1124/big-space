const Database = require("@replit/database");
const db = new Database();
const colors = require('colors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const port = 3000;
const http = require('http');
const bp = require('body-parser');
const { createHash } = require("node:crypto");

module.exports = function(app) {
	app.post('/new_account', function(req, res) {
		function sha256(input) {
			return createHash("sha256").update(input).digest("hex");
		}
		const newUser = req.body.newAccount;
		const newPass = req.body.newPassword;
		const location = sha256(req.header('x-forwarded-for'));
		accounts();
		function accounts() {
			(async () => {
				if (await db.get(newUser) != null) {
					res.send(`this username has already been taken. <a href = '${process.env['url']}'></a>`);
				} else {
					function urlCombo(length){
						let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
							retVal = "";
						for (let i = 0, n = charset.length; i < length; ++i) {
							retVal += charset.charAt(Math.floor(Math.random() * n));
						}
						return retVal;
					}
					let userId = urlCombo(15);
					if(await db.get(userId) == null){
						await db.set(userId, newUser);
						await db.set(newUser, userId);
						await db.set(`${newUser}_password`, newPass);
						await db.set(`${newUser}_address`, location);
						res.send(`<script>window.location.replace('${process.env['url']}'); document.cookie = "name=${userId}; SameSite=None; Secure";</script>`);
						console.log("");
						console.log(`new account ${newUser} was created`.blue);
						console.log("");
					}else{
						res.send(`<h1>an error occured. please try signing up again! <a style = "color:red" href = "/">Go back</a></h1>`);
					}
				}
			})();
		}
	});
}