/**
 * 파일의 위치를 이동시킵니다.
 */
global.MOVE_FILE = METHOD({

	run : function(params, callbackOrHandlers) {
		'use strict';
		//REQUIRED: params
		//REQUIRED: params.from		파일의 원래 위치
		//REQUIRED: params.to		파일을 옮길 위치
		//OPTIONAL: params.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.notExistsHandler
		//OPTIONAL: callbackOrHandlers.error
		//REQUIRED: callbackOrHandlers.success

		var
		// from
		from = params.from,

		// is sync
		isSync = params.isSync,

		// not exists handler.
		notExistsHandler,

		// error handler.
		errorHandler,

		// callback.
		callback;

		if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
			callback = callbackOrHandlers;
		} else {
			notExistsHandler = callbackOrHandlers.notExists;
			errorHandler = callbackOrHandlers.error;
			callback = callbackOrHandlers.success;
		}

		COPY_FILE(params, {
			error : errorHandler,
			notExists : notExistsHandler,
			success : function() {

				REMOVE_FILE({
					path : from,
					isSync : isSync
				}, {
					error : errorHandler,
					notExists : notExistsHandler,
					success : callback
				});
			}
		});
	}
});
