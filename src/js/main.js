'use strict';

var 	hamburger = $('.burger-menu'),
			popupTrigger = $('#popupSearch'),
			popupSearh = $('.popup-text'),
			popupSearhWrapper = $('.popup-search'),
			body = $('body'),
			modalSignIn = $('#openModule'),
			modalSignInHamb = $('#openModuleHamb');

// Open sign in module
// Close search popup  & nav menu
modalSignIn.click(function(event) {
	$(this).modal({
		fadeDuration: 400,
		fadeDelay: 0.4,
		showClose: false
	});
	closeSearchPopup();
	closeHamburger();
	return false;
});

modalSignInHamb.click(function(event) {
	$(this).modal({
		fadeDuration: 400,
		fadeDelay: 0.4,
		showClose: false
	});
	closeSearchPopup();
	closeHamburger();
	return false;
});

// Open popup search bar
// Close nav menu
popupTrigger.on('click', function(){
	toggleSearchPopup();
	closeHamburger();
});

// Open popup search bar
function toggleSearchPopup() {
	popupSearh.toggleClass('show');
};

// Close popup search bar
function closeSearchPopup() {
	popupSearh.removeClass('show');
};

// Close popup when click outside search bar
$(document).on('click', function(event) {
	if ((!$(event.target).closest(popupTrigger).length)) {
		if (!$(event.target).closest(popupSearhWrapper).length) {
			closeSearchPopup();
		}
	}
});

// Trigger hamburger menu
hamburger.on('click', function(){
	triggerHamburger();
});

// Open hamburger menu
function triggerHamburger() {
	hamburger.toggleClass('hamburger-active');
	body.toggleClass('nav-is-toggled');
}

// Close hamburger menu
function closeHamburger() {
	hamburger.removeClass('hamburger-active');
	body.removeClass('nav-is-toggled');
}

// Fire owl-carousel
$(document).ready(function(){
	$('.owl-carousel').owlCarousel({
		items: 4,
		loop: true,
		autoplay: true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
		margin: 30,
		nav: true,
		dots: true,
		navContainer: '#owl-nav-outside',
		navText : ['',''],
		responsive:{
			0:{
				items:1,
				dots: true
			},
			480:{
				items:1,
				dots: true
			},
			768:{
				items:3,
				dots: false
			}
		}
	});
});


