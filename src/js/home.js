"use strict";

const hamburger = $(".burger-menu"),
			popupTrigger = $("#popupSearch"),
			popupSearh = $(".popup-text"),
			popupSearhWrapper = $(".popup-search");

// Open popup search bar
popupTrigger.on("click", function(){
	popupSearh.toggleClass("show");
});

// Close popup when click outside search bar
$(document).on("click", function(event) {
	if ((!$(event.target).closest(popupTrigger).length)) {
		if (!$(event.target).closest(popupSearhWrapper).length) {
				popupSearh.removeClass("show");
		}
	}
});

// Trigger hamburger menu icon animation
hamburger.on("click", function(){
	hamburger.toggleClass("hamburger-active");
});

