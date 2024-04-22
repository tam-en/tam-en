// This JS file powers the listener for an about sample popup
// so that the popup disappears after user clicks on the close button

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM loaded and parsed for about_sample.js");

	const popUp = "aboutPopUp";

	function aboutPopUpClose() {
		document.getElementById("aboutPopUp").addEventListener('click', function() {
			document.getElementById(popUp).style.display = "none";
			});
		};
	aboutPopUpClose();
});