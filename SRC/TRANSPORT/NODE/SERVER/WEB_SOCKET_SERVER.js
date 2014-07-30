/*
 * create web socket server.
 */
global.WEB_SOCKET_SERVER = WEB_SOCKET_SERVER = METHOD({

	run : function(portOrWebServer, connectionListener) {'use strict';
		//REQUIRED: portOrWebServer
		//REQUIRED: connectionListener

		var
		//IMPORT: WebSocketServer
		WebSocketServer = require('ws').Server,

		// port
		port,

		// web server
		webServer,

		// server
		server;

		if (CHECK_IS_DATA(portOrWebServer) !== true) {
			port = portOrWebServer;
		} else {
			webServer = portOrWebServer;
		}

		server = new WebSocketServer({
			port : port,
			server : webServer === undefined ? undefined : webServer.getNativeHTTPServer()
		});

		server.on('connection', function(conn) {

			var
			// headers
			headers = conn.upgradeReq.headers,

			// method map
			methodMap = {},

			// send key
			sendKey = 0,

			// ip
			ip,

			// is force disconnecting
			isForceDisconnecting,

			// on.
			on,

			// off.
			off,

			// send.
			send,

			// run methods.
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

							if (sendKey !== undefined) {

								send({
									methodName : '__CALLBACK_' + sendKey,
									data : retData
								});
							}
						});
					});
				}
			};

			// when receive data
			conn.on('message', function(str) {

				var
				// params
				params = PARSE_STR(str);

				if (params !== undefined) {
					runMethods(params.methodName, params.data, params.sendKey);
				}
			});

			// when disconnected
			conn.on('close', function() {

				if (isForceDisconnecting !== true) {
					runMethods('__DISCONNECTED');
				}

				// free method map.
				methodMap = undefined;
			});

			// when error
			conn.on('error', function(error) {
				runMethods('__ERROR', error);
			});

			ip = headers['x-forwarded-for'];

			if (ip === undefined) {
				ip = conn.upgradeReq.connection.remoteAddress;
			}

			connectionListener(

			// info
			{
				ip : ip,

				headers : headers
			},

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
							data : methods,
							value : method
						});

					} else {
						delete methodMap[methodName];
					}
				}
			},

			// send to client.
			send = function(params, callback) {
				//REQUIRED: params
				//REQUIRED: params.methodName
				//REQUIRED: params.data
				//OPTIONAL: callback

				var
				// callback name
				callbackName = '__CALLBACK_' + sendKey;

				params.sendKey = sendKey;

				sendKey += 1;

				conn.send(STRINGIFY(params));

				if (callback !== undefined) {

					// on callback.
					on('__CALLBACK_' + sendKey, function(data) {

						// run callback.
						callback(data);

						// off callback.
						off('__CALLBACK_' + sendKey);
					});
				}
			},

			// disconnect.
			function() {

				isForceDisconnecting = true;

				conn.close();
			});
		});

		console.log('[UPPERCASE.IO-WEB_SOCKET_SERVER] RUNNING WEB SOCKET SERVER...' + (port === undefined ? '' : ' (PORT:' + port + ')'));
	}
});
