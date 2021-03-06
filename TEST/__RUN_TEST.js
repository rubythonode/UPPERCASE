var
// PORT
PORT = 8810;

// 모듈 로드
require('../UPPERCASE-CORE/NODE.js');
require('../UPPERCASE-ROOM/NODE.js');
require('../UPPERCASE-DB/NODE.js');
require('../UPPERCASE-MODEL/NODE.js');
require('../UPPERCASE-BOOT/NODE.js');

RUN(function() {
	'use strict';
	
	// 리소스 캐싱을 수행하지 않습니다.
	CONFIG.isDevMode = true;
	
	BOX('UPPERCASE');
	
	BOX('TestBox');
	
	INIT_OBJECTS();
	
	// Node.js 환경에서의 테스트 실행
	require('./UPPERCASE-CORE/__TEST_NODE.js');
	//require('./UPPERCASE-ROOM/__TEST_NODE.js');
	//require('./UPPERCASE-DB/__TEST_NODE.js');
	/*require('./UPPERCASE-MODEL/__TEST_NODE.js');
	require('./UPPERCASE-BOOT/__TEST_NODE.js');*/
	
	WEB_SERVER({
		port : PORT,
		rootPath : __dirname
	}, function(requestInfo, response, replaceRootPath, next) {
		
		var
		// uri
		uri = requestInfo.uri,

		// method
		method = requestInfo.method,

		// params
		params = requestInfo.params;
		
		if (uri.substring(0, 10) === 'UPPERCASE/') {
			requestInfo.uri = uri.substring(10);
			replaceRootPath(__dirname + '/..');
		}
		
		if (uri === 'request_test') {
	
			console.log(method, params);
			
			response({
				content : 'Request DONE!',
				headers : {
					'Access-Control-Allow-Origin' : '*'
				}
			});
		
		} else if (uri === 'request_test_json') {
	
			console.log(method, params);
	
			response({
				content : '{ "thisis" : "JSON" }',
				headers : {
					'Access-Control-Allow-Origin' : '*'
				}
			});
		}
	});
	
	console.log(CONSOLE_GREEN('UPPERCASE 테스트 콘솔을 실행하였습니다. 웹 브라우저에서 [http://localhost:' + PORT + ']로 접속해주시기 바랍니다.'));
});