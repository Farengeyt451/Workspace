"use strict";

const hamburger = $(".burger-menu"),
			popupTrigger = $("#popupSearch"),
			popupSearh = $(".popup-text"),
			popupSearhWrapper = $(".popup-search"),
			body = $("body");

// Open popup search bar
popupTrigger.on("click", function(){
	popupSearh.toggleClass("show");
	closeHamburger();
});

// Close popup when click outside search bar
$(document).on("click", function(event) {
	if ((!$(event.target).closest(popupTrigger).length)) {
		if (!$(event.target).closest(popupSearhWrapper).length) {
				popupSearh.removeClass("show");
		}
	}
});

// Trigger hamburger meu
hamburger.on("click", function(){
	triggerHamburger();
});

function triggerHamburger() {
	hamburger.toggleClass("hamburger-active");
	body.toggleClass("nav-is-toggled");
}

function closeHamburger() {
	hamburger.removeClass("hamburger-active");
	body.removeClass("nav-is-toggled");
}
