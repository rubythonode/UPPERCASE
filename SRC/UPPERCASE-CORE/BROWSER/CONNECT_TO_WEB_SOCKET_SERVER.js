/*
 * WEB_SOCKET_SERVER로 생성한 웹 소켓 서버에 연결합니다.
 */
global.CONNECT_TO_WEB_SOCKET_SERVER = METHOD({

	run : function(portOrParams, connectionListenerOrListeners) {
		'use strict';
		//REQUIRED: portOrParams
		//OPTIONAL: portOrParams.isSecure
		//OPTIONAL: portOrParams.host
		//REQUIRED: portOrParams.port
		//REQUIRED: connectionListenerOrListeners
		//REQUIRED: connectionListenerOrListeners.success
		//OPTIONAL: connectionListenerOrListeners.error

		var
		// is secure
		isSecure,
		
		// host
		host,

		// port
		port,

		// connection listener
		connectionListener,

		// error listener
		errorListener,

		// connection
		conn,

		// is connected
		isConnected,

		// method map
		methodMap = {},

		// send key
		sendKey = 0,

		// on.
		on,

		// off.
		off,

		// send.
		send,

		// run methods.
		runMethods;

		if (CHECK_IS_DATA(portOrParams) !== true) {
			port = portOrParams;
		} else {
			isSecure = portOrParams.isSecure;
			host = portOrParams.host;
			port = portOrParams.port;
		}
		
		if (isSecure === undefined) {
			isSecure = BROWSER_CONFIG.isSecure;
		}
		
		if (host === undefined) {
			host = BROWSER_CONFIG.host;
		}

		if (CHECK_IS_DATA(connectionListenerOrListeners) !== true) {
			connectionListener = connectionListenerOrListeners;
		} else {
			connectionListener = connectionListenerOrListeners.success;
			errorListener = connectionListenerOrListeners.error;
		}

		runMethods = function(methodName, data, sendKey) {

			var
			// methods
			methods = methodMap[methodName];

			if (methods !== undefined) {

				EACH(methods, function(method) {

					// run method.
					method(data,

					// ret.
					function(retData) {

						if (send !== undefined && sendKey !== undefined) {

							send({
								methodName : '__CALLBACK_' + sendKey,
								data : retData
							});
						}
					});
				});
			}
		};

		conn = new WebSocket((isSecure === true ? 'wss://': 'ws://') + host + ':' + port);

		conn.onopen = function() {

			isConnected = true;

			connectionListener(

			// on.
			on = function(methodName, method) {
				//REQUIRED: methodName
				//REQUIRED: method

				var
				// methods
				methods = methodMap[methodName];

				if (methods === undefined) {
					methods = methodMap[methodName] = [];
				}

				methods.push(method);
			},

			// off.
			off = function(methodName, method) {
				//REQUIRED: methodName
				//OPTIONAL: method

				var
				// methods
				methods = methodMap[methodName];

				if (methods !== undefined) {

					if (method !== undefined) {

						REMOVE({
							array : methods,
							value : method
						});

					} else {
						delete methodMap[methodName];
					}
				}
			},

			// send to server.
			send = function(methodNameOrParams, callback) {
				//REQUIRED: methodNameOrParams
				//REQUIRED: methodNameOrParams.methodName
				//OPTIONAL: methodNameOrParams.data
				//OPTIONAL: callback
				
				var
				// method name
				methodName,
				
				// data
				data,
				
				// callback name
				callbackName;
				
				if (CHECK_IS_DATA(methodNameOrParams) !== true) {
					methodName = methodNameOrParams;
				} else {
					methodName = methodNameOrParams.methodName;
					data = methodNameOrParams.data;
				}
				
				if (conn !== undefined) {
					
					conn.send(STRINGIFY({
						methodName : methodName,
						data : data,
						sendKey : sendKey
					}));
	
					if (callback !== undefined) {
						
						callbackName = '__CALLBACK_' + sendKey;
	
						// on callback.
						on(callbackName, function(data) {
	
							// run callback.
							callback(data);
	
							// off callback.
							off(callbackName);
						});
					}
	
					sendKey += 1;
				}
			},

			// disconnect.
			function() {
				if (conn !== undefined) {
					conn.close();
					conn = undefined;
				}
			});
		};

		// receive data.
		conn.onmessage = function(e) {

			var
			// params
			params = PARSE_STR(e.data);

			if (params !== undefined) {
				runMethods(params.methodName, params.data, params.sendKey);
			}
		};

		// when disconnected
		conn.onclose = function() {
			runMethods('__DISCONNECTED');
		};

		// when error
		conn.onerror = function(error) {

			var
			// error msg
			errorMsg = error.toString();

			if (isConnected !== true) {

				if (errorListener !== undefined) {
					errorListener(errorMsg);
				} else {
					SHOW_ERROR('CONNECT_TO_WEB_SOCKET_SERVER', errorMsg);
				}

			} else {
				runMethods('__ERROR', errorMsg);
			}
		};
	}
});
