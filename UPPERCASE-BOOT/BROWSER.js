/*

Welcome to UPPERCASE-BOOT! (http://uppercase.io)

*/

/**
 * Configuration
 */
OVERRIDE(CONFIG, function(origin) {
	'use strict';

	global.CONFIG = COMBINE([{
		
		defaultBoxName : 'UPPERCASE',
		
		title : 'UPPERCASE PROJECT',
		
		baseBackgroundColor : '#000',
		baseColor : '#fff',
		
		// maxThumbWidth
		// or
		// maxThumbHeight
		
		isMobileFullScreen : false,
		isUsingHTMLSnapshot : false
		
	}, origin]);
});

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

FOR_BOX(function(box) {
	'use strict';

	/**
	 * get resource's real path with version.
	 */
	box.R = METHOD(function(m) {
		
		var
		// base path
		basePath,
		
		// set base path.
		setBasePath;
		
		m.setBasePath = setBasePath = function(_basePath) {
			basePath = _basePath;
		};
		
		return {

			run : function(path, callback) {
				//REQUIRED: path
				//OPTIONAL: callback
	
				var
				// uri
				uri = box.boxName + '/R/' + path;
	
				if (CONFIG.version !== undefined) {
					uri += '?version=' + CONFIG.version;
				}
					
				if (basePath !== undefined) {
					uri = basePath + '/' + uri;
				}
				
				if (location.protocol !== 'file:') {
					uri = '/' + uri;
				}
	
				if (callback !== undefined) {
					GET(uri, callback);
				}
	
				return uri;
			}
		};
	});
});

FOR_BOX(function(box) {
	'use strict';

	/**
	 * get final resource's real path.
	 */
	box.RF = METHOD({

		run : function(path) {
			//REQUIRED: path
			
			return '/__RF/' + box.boxName + '/' + path;
		}
	});
});

/**
 * Get server time.
 */
global.SERVER_TIME = METHOD(function(m) {
	'use strict';

	var
	// diff
	diff = 0,

	// set diff.
	setDiff;

	m.setDiff = setDiff = function(_diff) {
		diff = _diff;
	};

	return {

		run : function(date) {
			//REQUIRED: date

			return new Date(date.getTime() - diff);
		}
	};
});

/**
 * Sync time. (Client-side)
 */
global.SYNC_TIME = METHOD({

	run : function() {
		'use strict';

		var
		// time sync room
		timeSyncRoom = UPPERCASE.ROOM('timeSyncRoom'),

		// now time
		now = new Date();

		timeSyncRoom.send({
			methodName : 'sync',
			data : now
		},

		function(diff) {
			
			// The local time = The server time + diff (diff: client time - server time)
			TIME.setDiff(diff);
			
			// The server time = The local time - diff (diff: client time - server time)
			SERVER_TIME.setDiff(diff);
		});
	}
});

/**
 * Get time.
 */
global.TIME = METHOD(function(m) {
	'use strict';

	var
	// diff
	diff = 0,

	// set diff.
	setDiff;

	m.setDiff = setDiff = function(_diff) {
		diff = _diff;
	};

	return {

		run : function(date) {
			//REQUIRED: date

			return new Date(date.getTime() + diff);
		}
	};
});
