/**
 * 세로 스크롤의 현재 위치를 픽셀 단위로 가져옵니다.
 */
global.SCROLL_TOP = METHOD({

	run : function() {
		'use strict';

		return global.pageYOffset;
	}
});
