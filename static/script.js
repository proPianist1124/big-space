const urls = {
	url1: "https://big-space.lto.lol/",
	url2: "https://big-space.repl.co/",
	url3: "https://big-space.lto.lol/settings",
	url4: "https://big-space.repl.co/settings",
	url5: "https://big-space.lto.lol/post_page",
	url6: "https://big-space.repl.co/post_page",
}

function copy(){
	alert(window.location.href);
}

// function to set a given theme/color-scheme
function setTheme(themeName) {
	localStorage.setItem('theme', themeName);
	document.documentElement.className = themeName;
}
// function to toggle between light and dark theme
function toggleTheme() {
  if (localStorage.getItem('theme') === 'theme-light') {
		setTheme('theme-dark');
		if(document.cookie != ""){
			if(window.location.href == urls.url1 || window.location.href == urls.url2 || window.location.href == urls.url3 || window.location.href == urls.url4 || window.location.href == urls.url5 || window.location.href == urls.url6){
				document.getElementById("theme").innerHTML = `<i class="fa-regular fa-sun"></i>`;
			}
		}
  } else {
    setTheme('theme-light');
		if(document.cookie != ""){
			if(window.location.href == urls.url1 || window.location.href == urls.url2 || window.location.href == urls.url3 || window.location.href == urls.url4 || window.location.href == urls.url5 || window.location.href == urls.url6){
				document.getElementById("theme").innerHTML = `<i class="fa-regular fa-moon"></i>`;
			}
		}
  }
}
// Immediately invoked function to set the theme on initial load
function load(){
	if (localStorage.getItem('theme') === 'theme-dark') {
		setTheme('theme-dark');
		if(document.cookie != ""){
			if(window.location.href == urls.url1 || window.location.href == urls.url2 || window.location.href == urls.url3 || window.location.href == urls.url4 || window.location.href == urls.url5 || window.location.href == urls.url6){
				document.getElementById("theme").innerHTML = `<i class="fa-regular fa-sun"></i>`;
			}
		}
		if(window.location.href == "/" || window.location.href == "/settings"){
			console.log(window.location.href);
		}
  } else {
		setTheme('theme-light');
		if(document.cookie != ""){
			if(window.location.href == urls.url1 || window.location.href == urls.url2 || window.location.href == urls.url3 || window.location.href == urls.url4 || window.location.href == urls.url5 || window.location.href == urls.url6){
				document.getElementById("theme").innerHTML = `<i class="fa-regular fa-moon"></i>`;
			}
		}
	}
}

function hideInfo(){
	let passwordLength = String(document.getElementById("userPassword").value).length;
	let tokenLength = String(document.getElementById("userToken").value).length;
	document.getElementById("userPassword").innerHTML = "*".repeat(parseInt(passwordLength));
	document.getElementById("userToken").innerHTML = "*".repeat(parseInt(tokenLength));
}