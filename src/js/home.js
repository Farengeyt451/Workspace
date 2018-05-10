"use strict";


const hamburger = $(".burger-menu"),
			popupBar = $("#popupSearch");

popupBar.on("click", function(){
	$(".popuptext").toggleClass("show");
});

hamburger.on("click", function(){
	hamburger.toggleClass("hamburger-active");
});
