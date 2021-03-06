TEST('PUT', function(check) {
	'use strict';

	// test PUT request.
	PUT({
		uri : 'request_test'
	}, function(content) {
		check(content === 'Request DONE!');
	});

	// test PUT request with parameters.
	PUT({
		uri : 'request_test',
		paramStr : 'thisis=parameter'
	}, function(content) {
		check(content === 'Request DONE!');
	});

	// test PUT request with data.
	PUT({
		uri : 'request_test',
		data : {
			thisis : 'data'
		}
	}, function(content) {
		check(content === 'Request DONE!');
	});

	// test PUT request.
	PUT({
		uri : 'request_test_json'
	}, function(content) {
		check(CHECK_ARE_SAME([PARSE_STR(content), {
			thisis : 'JSON'
		}]));
	});

	// test PUT request with parameters.
	PUT({
		uri : 'request_test_json',
		paramStr : 'thisis=parameter'
	}, function(content) {
		check(CHECK_ARE_SAME([PARSE_STR(content), {
			thisis : 'JSON'
		}]));
	});

	// test PUT request with data.
	PUT({
		uri : 'request_test_json',
		data : {
			thisis : 'data'
		}
	}, function(content) {
		check(CHECK_ARE_SAME([PARSE_STR(content), {
			thisis : 'JSON'
		}]));
	});
});
