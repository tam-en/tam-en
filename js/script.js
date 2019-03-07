document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM fully loaded and parsed");
});

// functions for dimming and brightening elements with links

function dimAbout() {
	document.getElementById("about-bubble").style.opacity = "0.5";
	document.getElementById("about-contact").style.opacity = "0.5";
};

function brightenAbout() {
	document.getElementById("about-bubble").style.opacity = "1";
	document.getElementById("about-contact").style.opacity = "1";	
};

function dimWriting() {
	document.getElementById("writing-editing").style.opacity = "0.5";
	document.getElementById("writing-bubble").style.opacity = "0.5";
};

function brightenWriting() {
	document.getElementById("writing-editing").style.opacity = "1";
	document.getElementById("writing-bubble").style.opacity = "1";
};

function dimWebDev() {

};

function dimDesign() {

};


// turn on listeners for elements

function listenersOn() {
	document.getElementById("about-contact").addEventListener('mouseover', function() {
		dimAbout();
	});
	document.getElementById("about-contact").addEventListener('mouseout', function() {
		brightenAbout();
	});	
	document.getElementById("about-bubble").addEventListener('mouseover', function() {
		dimAbout();
	});
	document.getElementById("about-bubble").addEventListener('mouseout', function() {
		brightenAbout();
	});

	document.getElementsByClassName("writing-editing").addEventListener('mouseover', function(){
		dimWriting();
	});
	document.getElementsByClassName("writing-bubble").addEventListener('mouseout', function(){
		brightenWriting();
	});	

	document.getElementById("web-dev-bubble").addEventListener('click', function(){
		console.log("web dev tickles")
	});
	document.getElementById("web-dev").addEventListener('click', function(){
		console.log("web-dev tickles")
	});	
	document.getElementById("print-design").addEventListener('click', function(){
		console.log("print design tickles")
	});
	document.getElementById("print-bubble").addEventListener('click', function(){
		console.log("print design tickles")
	});						
};

listenersOn();


