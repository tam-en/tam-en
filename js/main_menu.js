// This JS file includes functions for the main menu/hamburger menu.

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM loaded and parsed for menu.js");

	let fileName = location.href.split("/").slice(-1); // take the last chunk of filename after the last slash
	fileName = (fileName.toString()).split('.'); // convert resultant array back to string and split again on period
	fileName = (fileName[0]).toString(); // save only the characters before period in order to discard extensions, hashtags, etc.

	let menuItems = [ // index 0 = menu text we want; index 1 = portion of filename that will match fileName variable
		["home", "index"],
		["about | contact", "about"],
		["web dev", "web_dev"],
		["writing | editing", "editorial"],
		["print design", "print_design"]
	];

	let menuText = [];

	let makeMenuItems = function(item) {	
		if(fileName != item[1]) {
			menuText.push(`<a href="${item[1]}.html">${item[0]}</a>`);
		} else if (fileName = ""){
			menuText.push(`<a href="${item[1]}.html" class="activeLink">${item[0]}</a>`);
		} else {
			menuText.push(`<a href="${item[1]}.html" class="activeLink">${item[0]}</a>`);
		}
	};

	menuItems.forEach(makeMenuItems);

	// If the window width is < 951px, you get a hamburger menu
	if(window.innerWidth < 951) {
		console.log("hamburger activated!")
		document.getElementById('ham_ico').addEventListener('click', function() {
			let ham_closed = document.getElementById('ham_closed');
			let ham_menu = document.getElementById('ham_menu_div');
			// let page_guts = document.getElementById('other-page-content');
			ham_open.classList.toggle("ham_menu_off");
			ham_closed.classList.toggle("ham_menu_off");
			ham_menu.classList.toggle("ham_menu_off");
			ham_menu.classList.toggle("ham_menu_items");
			// page_guts.classList.toggle("transparent")
		});	

		document.getElementById("ham_menu_div").innerHTML = menuText.join('<br><br>');
		console.log(menuText.join('<br>'));

	// If the window is > 950, you get a regular menu.
	} else {

		document.getElementById("nav-bar-links").innerHTML = menuText.join(' ');
	}



});