TEST('MINIFY_CSS', function(check) {
	'use strict';

	READ_FILE('UPPERCASE-CORE/NODE/MINIFY/sample.css', function(content) {

		var
		// css code
		cssCode = content.toString();

		console.log(MINIFY_CSS(cssCode));
	});
});
