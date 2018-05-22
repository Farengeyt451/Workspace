'use strict';

var 	hamburger = $('.burger-menu'),
			popupTrigger = $('#popupSearch'),
			popupSearh = $('.popup-text'),
			popupSearhWrapper = $('.popup-search'),
			body = $('body');

// Open popup search bar
popupTrigger.on('click', function(){
	popupSearh.toggleClass('show');
	closeHamburger();
});

// Close popup when click outside search bar
$(document).on('click', function(event) {
	if ((!$(event.target).closest(popupTrigger).length)) {
		if (!$(event.target).closest(popupSearhWrapper).length) {
				popupSearh.removeClass('show');
		}
	}
});

// Trigger hamburger menu
hamburger.on('click', function(){
	triggerHamburger();
});

function triggerHamburger() {
	hamburger.toggleClass('hamburger-active');
	body.toggleClass('nav-is-toggled');
}

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
