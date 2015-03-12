var
// page
page = require('webpage').create(),

// system
system = require('system'),

// check ready interval
checkReadyInterval,

// is ready.
isReady = function() {
	'use strict';
	
	return page.evaluate(function () {
		return window.global !== undefined && global.CONNECT_TO_ROOM_SERVER !== undefined && CONNECT_TO_ROOM_SERVER.checkIsConnected() === true;
	});
},

// print HTML snapshot.
printHTMLSnapshot = function() {
	'use strict';
	
	var
	// html
	html = page.content;
	
	html = html.replace(/<script[^>]+>(.|\n|\r)*?<\/script\s*>/ig, '');
	html = html.replace('<meta name="fragment" content="!">', '');
	
	console.log(html);
};

page.viewportSize = {
	width : 1024,
	height : 768
};

page.open('http://localhost:' + system.args[1] + '/' + (system.args[2] === undefined ? '' : system.args[2]), function(status) {
	'use strict';
	
	if (status === 'fail') {
		phantom.exit();
	}
});

// check is ready per 0.1 seconds.
checkReadyInterval = setInterval(function() {
	'use strict';
	
	if (isReady()) {
		
		// delay 1 second.
		setTimeout(function() {
			
			printHTMLSnapshot();
			
			phantom.exit();
			
		}, 1000);
		
		clearInterval(checkReadyInterval);
	}
}, 100);