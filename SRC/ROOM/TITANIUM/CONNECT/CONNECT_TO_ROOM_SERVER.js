/*
 * connect to room server.
 */
global.CONNECT_TO_ROOM_SERVER = CONNECT_TO_ROOM_SERVER = METHOD(function(m) {
	'use strict';

	var
	// waiting enter room names
	waitingEnterRoomNames = [],

	// waiting on infos
	waitingOnInfos = [],

	// waiting send infos
	waitingSendInfos = [],

	// is connected
	isConnected,

	// inner on.
	innerOn,

	// inner off.
	innerOff,

	// inner send.
	innerSend,

	// enter room.
	enterRoom,

	// on.
	on,

	// off.
	off,

	// send.
	send,

	// exit room.
	exitRoom;

	m.enterRoom = enterRoom = function(roomName) {
		//REQUIRED: roomName

		if (innerSend === undefined) {

			waitingEnterRoomNames.push(roomName);

		} else {

			innerSend({
				methodName : '__ENTER_ROOM',
				data : roomName
			});
		}
	};

	m.on = on = function(methodName, method) {

		if (innerOn === undefined) {

			waitingOnInfos.push({
				methodName : methodName,
				method : method
			});

		} else {

			innerOn(methodName, method);
		}
	};

	m.off = off = function(methodName, method) {

		if (waitingOnInfos !== undefined) {

			if (method !== undefined) {

				REMOVE(waitingOnInfos, function(waitingOnInfo) {
					return waitingOnInfo.methodName === methodName && waitingOnInfo.method === method;
				});

			} else {

				REMOVE(waitingOnInfos, function(waitingOnInfo) {
					return waitingOnInfo.methodName === methodName;
				});
			}

		} else {

			innerOff(methodName, method);
		}
	};

	m.send = send = function(params, callback) {

		if (innerSend === undefined) {

			waitingSendInfos.push({
				params : params,
				callback : callback
			});

		} else {

			innerSend(params, callback);
		}
	};

	m.exitRoom = exitRoom = function(roomName) {

		if (waitingEnterRoomNames !== undefined) {

			REMOVE({
				array : waitingEnterRoomNames,
				value : roomName
			});

		} else {

			innerSend({
				methodName : '__EXIT_ROOM',
				data : roomName
			});
		}
	};

	return {

		run : function(params, connectionListenerOrListeners) {
			//REQUIRED: params
			//REQUIRED: params.host
			//REQUIRED: params.socketServerPort
			//REQUIRED: params.webSocketServerPort
			//REQUIRED: connectionListenerOrListeners

			var
			// connection listener.
			connectionListener,

			// error listener.
			errorListener,

			// success.
			success;

			if (CHECK_IS_DATA(connectionListenerOrListeners) !== true) {
				connectionListener = connectionListenerOrListeners;
			} else {
				connectionListener = connectionListenerOrListeners.success;
				errorListener = connectionListenerOrListeners.error;
			}

			success = function(on, off, send) {

				innerOn = on;
				innerOff = off;
				innerSend = send;

				EACH(waitingEnterRoomNames, function(roomName) {

					innerSend({
						methodName : '__ENTER_ROOM',
						data : roomName
					});
				});

				waitingEnterRoomNames = undefined;

				EACH(waitingOnInfos, function(onInfo) {
					innerOn(onInfo.methodName, onInfo.method);
				});

				waitingOnInfos = undefined;

				EACH(waitingSendInfos, function(sendInfo) {
					innerSend(sendInfo.params, sendInfo.callback);
				});

				waitingSendInfos = undefined;

				innerOn('__DISCONNECTED', function() {

					innerOn = undefined;
					innerOff = undefined;
					innerSend = undefined;
				});

				if (connectionListener !== undefined) {
					connectionListener(on, off, send);
				}
			};

			// when mobile web
			if (Ti.Platform.name === 'mobileweb') {

				CONNECT_TO_WEB_SOCKET_SERVER({
					host : params.host,
					port : params.webSocketServerPort
				}, {
					error : errorListener,
					success : success
				});
			}

			// when native app
			else {

				CONNECT_TO_SOCKET_SERVER({
					host : params.host,
					port : params.socketServerPort
				}, {
					error : errorListener,
					success : success
				});
			}
		}
	};
});