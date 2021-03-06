/*
 * connect to UPPERCASE server.
 */
global.CONNECT_TO_UPPERCASE_SERVER = METHOD({

	run : function(params, connectionListenerOrListeners) {
		'use strict';
		//OPTIONAL: params
		//OPTIONAL: params.roomServerName
		//OPTIONAL: params.webServerHost
		//OPTIONAL: params.webServerPort
		//OPTIONAL: params.isSecure
		//OPTIONAL: connectionListenerOrListeners
		//OPTIONAL: connectionListenerOrListeners.success
		//OPTIONAL: connectionListenerOrListeners.error

		var
		// room server name
		roomServerName,
		
		// web server host
		webServerHost,
		
		// web server port
		webServerPort,
		
		// is secure
		isSecure,
		
		// connection listener
		connectionListener,

		// error listener
		errorListener;
		
		if (connectionListenerOrListeners === undefined) {
			
			if (params !== undefined) {
				
				if (CHECK_IS_DATA(params) !== true) {
					connectionListener = params;
				} else {
					roomServerName = params.roomServerName;
					webServerHost = params.webServerHost;
					webServerPort = params.webServerPort;
					isSecure = params.isSecure;
					connectionListener = params.success;
					errorListener = params.error;
				}
			}
		}
		
		else {
			
			if (params !== undefined) {
				roomServerName = params.roomServerName;
				webServerHost = params.webServerHost;
				webServerPort = params.webServerPort;
				isSecure = params.isSecure;
			}
			
			if (CHECK_IS_DATA(connectionListenerOrListeners) !== true) {
				connectionListener = connectionListenerOrListeners;
			} else {
				connectionListener = connectionListenerOrListeners.success;
				errorListener = connectionListenerOrListeners.error;
			}
		}
		
		if (webServerHost === undefined) {
			webServerHost = BROWSER_CONFIG.host;
		}
		
		if (webServerPort === undefined) {
			webServerPort = CONFIG.webServerPort;
		}
		
		if (isSecure === undefined) {
			isSecure = BROWSER_CONFIG.isSecure;
		}

		GET({
			isSecure : isSecure,
			host : webServerHost,
			port : webServerPort,
			uri : '__WEB_SOCKET_SERVER_HOST',
			paramStr : 'defaultHost=' + webServerHost
		}, {
			error : errorListener,
			success : function(host) {

				CONNECT_TO_ROOM_SERVER({
					name : roomServerName,
					isSecure : isSecure,
					host : host,
					port : webServerPort
				}, function(on, off, send) {
					
					FOR_BOX(function(box) {
						EACH(box.MODEL.getOnNewInfos(), function(onNewInfo) {
							onNewInfo.findMissingDataSet();
						});
					});
					
					on('__DISCONNECTED', function() {
						FOR_BOX(function(box) {
							EACH(box.MODEL.getOnNewInfos(), function(onNewInfo) {
								onNewInfo.lastCreateTime = SERVER_TIME(new Date());
							});
						});
					});
					
					if (connectionListener !== undefined) {
						connectionListener(on, off, send);
					}
				});
			}
		});
	}
});
