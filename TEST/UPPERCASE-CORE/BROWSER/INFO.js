TEST('INFO', function(check) {
	'use strict';

	var
	// now lang
	nowLang = INFO.getLang();

	// get browser language.
	console.log(nowLang);
	
	// check is touch mode.
	console.log(INFO.checkIsTouchMode());

	// get browser info.
	console.log(INFO.getBrowserInfo());
});
