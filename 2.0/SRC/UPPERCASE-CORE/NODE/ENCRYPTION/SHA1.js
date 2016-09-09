/**
 * 비밀번호를 주어진 키를 이용하여 HMAC SHA1 알고리즘으로 암호화 합니다.
 * 
 * 그러나 SHA1 알고리즘의 취약점이 발견되었기 때문에, 암호화가 필요한 기능에는 SHA256을 사용하시는 것을 추천합니다.
 */
global.SHA1 = METHOD({

	run : function(params) {
		'use strict';
		//REQUIRED: params
		//REQUIRED: params.password
		//REQUIRED: params.key

		var
		// password
		password = params.password,

		// key
		key = params.key,

		// crypto
		crypto = require('crypto');

		return crypto.createHmac('sha1', key).update(password).digest('hex');
	}
});
