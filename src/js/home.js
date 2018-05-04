$(document).ready(function() {
	$("#mmenu").mmenu({
		"extensions": {
			"all": ["border-none","fx-menu-slide"],
			"(max-width: 400px)": ["fullscreen", "listview-justify"]
		}
	});
});
