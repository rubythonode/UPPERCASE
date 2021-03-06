/**
 * 웹 브라우저 정보를 담고 있는 객체
 */
global.INFO = OBJECT({

	init : function(inner, self) {
		'use strict';

		var
		// is touch mode
		isTouchMode = global.ontouchstart !== undefined,
		
		// is touching
		isTouching,
		
		// browser info
		browserInfo,

		// get lang.
		getLang,

		// change lang.
		changeLang,

		// check is touch mode.
		checkIsTouchMode,

		// get browser info.
		getBrowserInfo;

		self.getLang = getLang = function() {

			var
			// language
			lang = STORE('__INFO').get('lang');

			if (lang === undefined) {

				lang = navigator.language;

				if (lang.length > 2) {
					lang = lang.substring(0, 2);
				}

				lang = lang.toLowerCase();
			}

			return lang;
		};

		self.changeLang = changeLang = function(lang) {
			//REQUIRED: lang

			STORE('__INFO').save({
				name : 'lang',
				value : lang
			});

			location.reload();
		};

		self.checkIsTouchMode = checkIsTouchMode = function() {
			return isTouchMode;
		};

		self.getBrowserInfo = getBrowserInfo = function() {
			// using bowser. (https://github.com/ded/bowser)
			return {
				name : bowser.name,
				version : REAL(bowser.version)
			};
		};
		
		EVENT_LOW('mousemove', function() {
			if (isTouching !== true) {
				isTouchMode = false;
			}
		});
		
		EVENT_LOW('touchstart', function() {
			isTouchMode = true;
			isTouching = true;
		});
		
		EVENT_LOW('touchend', function() {
			DELAY(function() {
				isTouching = false;
			});
		});
	}
});
