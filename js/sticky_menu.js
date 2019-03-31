document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM loaded and parsed for sticky_menu");

	if(window.innerWidth >= 951) {
		console.log("loading the sticky menu script!");

		window.onscroll = function() {stickMenu()};

		var sidenav = document.getElementById("page-menu-links");
		var sticky = sidenav.offsetTop;

		function stickMenu() {
		  if (window.pageYOffset >= sticky) {
		    sidenav.classList.add("sticky");
		    console.log("add sticky");
		  } else {
		    sidenav.classList.remove("sticky");
		    console.log("remove sticky")
		  }
		}
	};

});	