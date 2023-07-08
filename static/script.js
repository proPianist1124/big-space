const icons = {
	dark:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
	light:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
}

// function to set a given theme/color-scheme
function setTheme(themeName) {
	localStorage.setItem('theme', themeName);
	document.documentElement.className = themeName;
}
// function to toggle between light and dark theme
function toggleTheme() {
  if (localStorage.getItem('theme') == 'theme-light') {
		setTheme('theme-dark');
		document.getElementById("snackbar").innerHTML = `Configured Dark Mode`;
		document.getElementById("theme").innerHTML = icons.light;
  } else {
    setTheme('theme-light');
		document.getElementById("snackbar").innerHTML = `Configured Light Mode`;
		document.getElementById("theme").innerHTML = icons.dark;
  }
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 2000);
}
// Immediately invoked function to set the theme on initial load
function load(){
	if (localStorage.getItem('theme') == 'theme-light') {
		setTheme('theme-light');
		document.getElementById("theme").innerHTML = icons.dark;
  } else {
		setTheme('theme-dark');
		document.getElementById("theme").innerHTML = icons.light;
	}
}

function hideInfo(){
	let passwordLength = String(document.getElementById("userPassword").value).length;
	let tokenLength = String(document.getElementById("userToken").value).length;
	document.getElementById("userPassword").innerHTML = "*".repeat(parseInt(passwordLength));
	document.getElementById("userToken").innerHTML = "*".repeat(parseInt(tokenLength));
}

function showPassword() {
	let password = document.getElementById("password");
	if (password.type === "password") {
	  password.type = "text";
	} else {
	  password.type = "password";
	}
  }