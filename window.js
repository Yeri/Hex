chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('display.html', {
		'width': 1000,
		'height': 700
	});
});
