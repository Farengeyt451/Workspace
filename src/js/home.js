"use strict";

const popupBar = $("#popupSearch");

popupBar.on("click", function(){
	console.log("s");
	$(".popuptext").toggleClass("show");
});
