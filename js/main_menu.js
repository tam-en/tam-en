document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM loaded and parsed for menu.js");

	let fileName = location.href.split("/").slice(-1); // take the last chunk of filename after the last slash
	fileName = (fileName.toString()).split('.'); // convert resultant array back to string and split again on period
	fileName = (fileName[0]).toString(); // save only the characters before period in order to discard extensions, hashtags, etc.

	let menuItems = [ // index 0 = menu text we want; index 1 = portion of filename that will match fileName variable
		["about | contact", "about"],
		["web dev projects", "web_dev"],
		["writing | editing", "editorial"],
		["print design", "print_design"]
	];


	// If the window width is < 951, you get a hamburger menu
	if(window.innerWidth < 951) {
		console.log("hamburger activated!")
		document.getElementById('ham_ico').addEventListener('click', function() {
			let ham_open = document.getElementById('ham_open');
			let ham_closed = document.getElementById('ham_closed');
			let ham_menu = document.getElementById('ham_menu_div');
			ham_open.classList.toggle("ham_menu_off");
			ham_closed.classList.toggle("ham_menu_off");
			ham_menu.classList.toggle("ham_menu_off");
			ham_menu.classList.toggle("ham_menu_items");
		});	


// If the window is > 950, you get a regular menu.
	} else {
		console.log("you need the desktop menu");

		let menuText = function(item) {
			if(fileName != item[1]) {
				console.log(`<a href="${item[1]}.html">${item[0]}</a>`);
			} else {
				console.log(`<a href="${item[1]}.html" class="activeLink">${item[0]}</a>`);
			}
			};

		menuItems.forEach(menuText);

	}
});