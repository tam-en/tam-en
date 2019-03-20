document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM loaded and parsed for front page");


	// GLOBAL VARIABLES
	const sectionsForListening = [
		["about-contact", "about-bubble", "about.html"],
		["writing-editing", "writing-bubble", "editorial.html"],
		["web-dev", "web-dev-bubble", "web_dev.html"],
		["print-design", "print-bubble", "print_design.html"]
	];

	function listenAndDo(section) {
		document.getElementById(section[0]).addEventListener('mouseover', function() {
			document.getElementById(section[0]).style.color = "#5C3877";
			document.getElementById(section[1]).style.opacity = "0.5";
		});
		document.getElementById(section[0]).addEventListener('mouseout', function() {
			document.getElementById(section[0]).style.color = "black";
			document.getElementById(section[1]).style.opacity = "1";
		});
		document.getElementById(section[0]).addEventListener('click', function() {
			window.location.href = section[2];
		});
		document.getElementById(section[1]).addEventListener('click', function() {
			window.location.href = section[2];
		});		
		document.getElementById(section[1]).addEventListener('mouseover', function() {
			document.getElementById(section[0]).style.color = "#5C3877";
			document.getElementById(section[1]).style.opacity = "0.5";
		});
		document.getElementById(section[1]).addEventListener('mouseout', function() {
			document.getElementById(section[0]).style.color = "black";
			document.getElementById(section[1]).style.opacity = "1";
		});
	};

	sectionsForListening.forEach(listenAndDo);

	// window.onscroll = function() { stickMenu() };

	// var mainnav = document.getElementById("nav-wrapper");
	// var extraSticky = mainnav.offsetTop;

	// function stickMenu() {
	//   if (window.pageYOffset >= extraSticky) {
	//     sidenav.classList.add("extraSticky");
	//     console.log("add extra sticky");
	//   } else {
	//     sidenav.classList.remove("extraSticky");
	//     console.log("remove extra sticky")
	//   }
	// }


});

