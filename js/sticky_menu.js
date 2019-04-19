// Sticky menus turn on for non-landing pages for media with viewports >= 951px

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM loaded and parsed for sticky_menu");

	if(window.innerWidth >= 951) {
		window.onscroll = function() {stickMenu()};

		var sidenav = document.getElementById("page-menu-links");
		var sticky = sidenav.offsetTop;

		function stickMenu() {
		  if (window.pageYOffset >= sticky) {
		    sidenav.classList.add("sticky");
		  } else {
		    sidenav.classList.remove("sticky");
		  }
		}
	};

});	