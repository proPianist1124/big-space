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
		document.getElementById("theme").innerHTML = `<i class="fa-regular fa-sun"></i>`;
		document.getElementById("snackbar").innerHTML = `Configured Dark Mode`;
  } else {
    setTheme('theme-light');
		document.getElementById("theme").innerHTML = `<i class="fa-regular fa-moon"></i>`;
		document.getElementById("snackbar").innerHTML = `Configured Light Mode`;
  }
	let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 2000);
}
// Immediately invoked function to set the theme on initial load
function load(){
	if (localStorage.getItem('theme') === 'theme-dark') {
		setTheme('theme-dark');
		document.getElementById("theme").innerHTML = `<i class="fa-regular fa-sun"></i>`;
  } else {
		setTheme('theme-light');
		document.getElementById("theme").innerHTML = `<i class="fa-regular fa-moon"></i>`;
	}
}

function hideInfo(){
	let passwordLength = String(document.getElementById("userPassword").value).length;
	let tokenLength = String(document.getElementById("userToken").value).length;
	document.getElementById("userPassword").innerHTML = "*".repeat(parseInt(passwordLength));
	document.getElementById("userToken").innerHTML = "*".repeat(parseInt(tokenLength));
}