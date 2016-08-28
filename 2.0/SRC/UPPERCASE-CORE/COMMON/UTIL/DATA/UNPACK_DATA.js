/**
 * PACK_DATA가 적용된 데이터의 값들 중 정수형태로 변환된 Date형과 문자열 형태로 변환된 RegExp형을 원래대로 되돌린 데이터를 반환합니다.
 */
global.UNPACK_DATA = METHOD({

	run : function(data) {
		'use strict';
		//REQUIRED: data	PACK_DATA가 적용된 데이터

		var
		// result
		result = COPY(data);

		// when date property names exists
		if (result.__DATE_NAMES !== undefined) {

			// change timestamp integer to Date type.
			EACH(result.__DATE_NAMES, function(dateName, i) {
				result[dateName] = new Date(result[dateName]);
			});
			
			delete result.__DATE_NAMES;
		}
		
		// when regex property names exists
		if (result.__REGEX_NAMES !== undefined) {

			// change string to RegExp type.
			EACH(result.__REGEX_NAMES, function(regexName, i) {
				
				var
				// pattern
				pattern = result[regexName],
				
				// flags
				flags,
				
				// j
				j;
				
				for (j = pattern.length - 1; j >= 0; j -= 1) {
					if (pattern[j] === '/') {
						flags = pattern.substring(j + 1);
						pattern = pattern.substring(1, j);
						break;
					}
				}
				
				result[regexName] = new RegExp(pattern, flags);
			});
			
			delete result.__REGEX_NAMES;
		}

		EACH(result, function(value, name) {

			if (CHECK_IS_DATA(value) === true) {
				result[name] = UNPACK_DATA(value);
			}

			else if (CHECK_IS_ARRAY(value) === true) {

				EACH(value, function(v, i) {

					if (CHECK_IS_DATA(v) === true) {
						value[i] = UNPACK_DATA(v);
					}
				});
			}
		});

		return result;
	}
});