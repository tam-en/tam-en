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



// The offsetTop property returns the top position (in pixels) relative to the top of the offsetParent element.

// The returned value includes:

// the top position, and margin of the element
// the top padding, scrollbar and border of the offsetParent element
// Note: The offsetParent element is the nearest ancestor that has a position other than static.

// Tip: To return the left position of an element, use the offsetLeft property.

