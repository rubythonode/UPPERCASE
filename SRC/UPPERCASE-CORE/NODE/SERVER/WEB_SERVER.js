/**
 * 웹 서버를 생성하는 클래스
 */
global.WEB_SERVER = CLASS(function(cls) {
	'use strict';

	var
	// DEFAULT_MAX_UPLOAD_FILE_MB
	DEFAULT_MAX_UPLOAD_FILE_MB = 10,
	
	//IMPORT: http
	http = require('http'),
	
	//IMPORT: https
	https = require('https'),
	
	//IMPORT: fs
	fs = require('fs'),
	
	//IMPORT: path
	path = require('path'),

	//IMPORT: querystring
	querystring = require('querystring'),

	//IMPORT: zlib
	zlib = require('zlib'),
	
	//IMPORT: IncomingForm
	IncomingForm = require('formidable').IncomingForm,

	// get content type from extension.
	getContentTypeFromExtension = function(extension) {
		
		// png image
		if (extension === 'png') {
			return 'image/png';
		}

		// jpeg image
		if (extension === 'jpeg' || extension === 'jpg') {
			return 'image/jpeg';
		}

		// gif image
		if (extension === 'gif') {
			return 'image/gif';
		}

		// svg
		if (extension === 'svg') {
			return 'image/svg+xml';
		}

		// javascript
		if (extension === 'js') {
			return 'application/javascript';
		}

		// json document
		if (extension === 'json') {
			return 'application/json';
		}

		// css
		if (extension === 'css') {
			return 'text/css';
		}

		// text
		if (extension === 'text' || extension === 'txt') {
			return 'text/plain';
		}

		// markdown
		if (extension === 'markdown' || extension === 'md') {
			return 'text/x-markdown';
		}

		// html document
		if (extension === 'html') {
			return 'text/html';
		}

		// swf
		if (extension === 'swf') {
			return 'application/x-shockwave-flash';
		}

		// mp3
		if (extension === 'mp3') {
			return 'audio/mpeg';
		}

		// ogg
		if (extension === 'ogg') {
			return 'audio/ogg';
		}

		// ogv
		if (extension === 'ogv') {
			return 'video/ogg';
		}

		// mp4
		if (extension === 'mp4') {
			return 'video/mp4';
		}

		// webm
		if (extension === 'webm') {
			return 'video/webm';
		}

		return 'application/octet-stream';
	},

	// get encoding from content type.
	getEncodingFromContentType = function(contentType) {

		if (contentType === 'application/javascript') {
			return 'utf-8';
		}

		if (contentType === 'application/json') {
			return 'utf-8';
		}

		if (contentType === 'text/css') {
			return 'utf-8';
		}

		if (contentType === 'text/plain') {
			return 'utf-8';
		}
		
		if (contentType === 'text/x-markdown') {
			return 'utf-8';
		}

		if (contentType === 'text/html') {
			return 'utf-8';
		}

		if (contentType === 'image/png') {
			return 'binary';
		}

		if (contentType === 'image/jpeg') {
			return 'binary';
		}

		if (contentType === 'image/gif') {
			return 'binary';
		}

		if (contentType === 'image/svg+xml') {
			return 'utf-8';
		}

		if (contentType === 'audio/mpeg') {
			return 'binary';
		}

		if (contentType === 'audio/ogg') {
			return 'binary';
		}

		if (contentType === 'video/ogv') {
			return 'binary';
		}

		if (contentType === 'video/mp4') {
			return 'binary';
		}

		if (contentType === 'video/webm') {
			return 'binary';
		}

		return 'binary';
	},
	
	// create cookie str array.
	createCookieStrArray = function(data) {
		
		var
		// strs
		strs = [];

		EACH(data, function(value, name) {
			if (CHECK_IS_DATA(value) === true) {
				strs.push(name + '=' + encodeURIComponent(value.value)
					+ (value.expireSeconds === undefined ? '' : '; expires=' + new Date(Date.now() + value.expireSeconds * 1000).toGMTString())
					+ (value.path === undefined ? '' : '; path=' + value.path)
					+ (value.domain === undefined ? '' : '; domain=' + value.domain));
			} else {
				strs.push(name + '=' + encodeURIComponent(value));
			}
		});

		return strs;
	},
	
	// parse cookie str.
	parseCookieStr = function(cookieStr) {
		
		var
		// splits
		splits,

		// data
		data = {};

		if (cookieStr !== undefined) {

			splits = cookieStr.split(';');

			EACH(splits, function(cookie) {

				var
				// parts
				parts = cookie.split('=');

				data[parts[0].trim()] = decodeURIComponent(parts[1]);
			});
		}

		return data;
	};
	
	return {

		init : function(inner, self, portOrParams, requestListenerOrHandlers) {
			//REQUIRED: portOrParams
			//OPTIONAL: portOrParams.port					HTTP 서버 포트
			//OPTIONAL: portOrParams.securedPort			HTTPS 서버 포트
			//OPTIONAL: portOrParams.securedKeyFilePath		SSL인증 .key 파일 경로
			//OPTIONAL: portOrParams.securedCertFilePath	SSL인증 .cert 파일 경로
			//OPTIONAL: portOrParams.rootPath				리소스 루트 폴더
			//OPTIONAL: portOrParams.version				캐싱을 위한 버전. 입력하지 않으면 캐싱 기능이 작동하지 않습니다.
			//OPTIONAL: portOrParams.preprocessors			프리프로세서들. 뷰 템플릿 등과 같이, 특정 확장자의 리소스를 응답하기 전에 내용을 변경하는 경우 사용합니다.
			//OPTIONAL: portOrParams.uploadURI				업로드를 처리할 URI. URI 문자열 혹은 URI 문자열 배열로 입력합니다.
			//OPTIONAL: portOrParams.uploadPath				업로드한 파일을 저장할 경로
			//OPTIONAL: portOrParams.maxUploadFileMB		최대 업로드 파일 크기 (MB). 입력하지 않으면 10MB로 지정됩니다.
			//OPTIONAL: requestListenerOrHandlers
			//OPTIONAL: requestListenerOrHandlers.notExistsResource		리소스가 존재하지 않는 경우
			//OPTIONAL: requestListenerOrHandlers.error					오류가 발생한 경우
			//OPTIONAL: requestListenerOrHandlers.requestListener		요청 리스너
			//OPTIONAL: requestListenerOrHandlers.uploadProgress		업로드 진행중
			//OPTIONAL: requestListenerOrHandlers.uploadOverFileSize	업로드 하는 파일의 크기가 maxUploadFileMB보다 클 경우
			//OPTIONAL: requestListenerOrHandlers.uploadSuccess			업로드가 정상적으로 완료된 경우

			var
			// port
			port,

			// secured port
			securedPort,

			// secured key file path
			securedKeyFilePath,

			// secured cert file path
			securedCertFilePath,
			
			// origin root path
			originRootPath,

			// version
			version,
			
			// preprocessors
			preprocessors,
			
			// upload uri
			uploadURI,
			
			// upload path
			uploadPath,
			
			// max upload file mb
			maxUploadFileMB,

			// not exists resource handler.
			notExistsResourceHandler,
			
			// error handler.
			errorHandler,
			
			// request listener.
			requestListener,
			
			// upload progress handler.
			uploadProgressHandler,
			
			// upload over file size handler.
			uploadOverFileSizeHandler,
			
			// upload success handler.
			uploadSuccessHandler,

			// resource caches
			resourceCaches = {},
			
			// native server
			nativeServer,

			// serve.
			serve,
			
			// get native server.
			getNativeServer,
			
			// add preprocessor.
			addPreprocessor;

			// init params.
			if (CHECK_IS_DATA(portOrParams) !== true) {
				port = portOrParams;
			} else {
				port = portOrParams.port;
				securedPort = portOrParams.securedPort;
				securedKeyFilePath = portOrParams.securedKeyFilePath;
				securedCertFilePath = portOrParams.securedCertFilePath;
				
				originRootPath = portOrParams.rootPath;
				version = String(portOrParams.version);
				
				preprocessors = portOrParams.preprocessors;
				
				uploadURI = portOrParams.uploadURI;
				uploadPath = portOrParams.uploadPath;
				maxUploadFileMB = portOrParams.maxUploadFileMB;
			}
			
			if (maxUploadFileMB === undefined) {
				maxUploadFileMB = DEFAULT_MAX_UPLOAD_FILE_MB;
			}

			if (requestListenerOrHandlers !== undefined) {
				if (CHECK_IS_DATA(requestListenerOrHandlers) !== true) {
					requestListener = requestListenerOrHandlers;
				} else {
					notExistsResourceHandler = requestListenerOrHandlers.notExistsResource;
					errorHandler = requestListenerOrHandlers.error;
					requestListener = requestListenerOrHandlers.requestListener;
					
					uploadProgressHandler = requestListenerOrHandlers.uploadProgress;
					uploadOverFileSizeHandler = requestListenerOrHandlers.uploadOverFileSize;
					uploadSuccessHandler = requestListenerOrHandlers.uploadSuccess;
				}
			}

			serve = function(nativeReq, nativeRes, isSecure) {

				var
				// headers
				headers = nativeReq.headers,

				// uri
				uri = nativeReq.url,
				
				// is upload uri
				isUploadURI,

				// method
				method = nativeReq.method.toUpperCase(),

				// ip
				ip = headers['x-forwarded-for'],

				// accept encoding
				acceptEncoding = headers['accept-encoding'],

				// param str
				paramStr;
				
				if (ip === undefined) {
					ip = nativeReq.connection.remoteAddress;
				}

				if (acceptEncoding === undefined) {
					acceptEncoding = '';
				}

				if (uri.indexOf('?') != -1) {
					paramStr = uri.substring(uri.indexOf('?') + 1);
					uri = uri.substring(0, uri.indexOf('?'));
				}

				uri = uri.substring(1);
				
				isUploadURI = CHECK_IS_ARRAY(uploadURI) === true ? CHECK_IS_IN({
					array : uploadURI,
					value : uri
				}) === true : uploadURI === uri;

				NEXT([
				function(next) {
					
					var
					// is appended param string
					isAppendedParamStr;
					
					if (method === 'GET' || isUploadURI === true) {
						next();
					} else {
						
						nativeReq.on('data', function(data) {
							
							if (isAppendedParamStr !== true) {
								if (paramStr === undefined) {
									paramStr = '';
								} else {
									paramStr += '&';
								}
								isAppendedParamStr = true;
							}
							
							paramStr += data;
						});

						nativeReq.on('end', function() {
							next();
						});
					}
				},

				function() {
					return function() {
						
						var
						// params
						params = querystring.parse(paramStr),
						
						// data
						data,
						
						// request info
						requestInfo,
						
						// root path
						rootPath = originRootPath,
						
						// is going on
						isGoingOn,
						
						// original uri
						originalURI = uri,
						
						// overriding response info
						overrideResponseInfo = {},
						
						// response.
						response,
						
						// response error.
						responseError;
						
						EACH(params, function(param, name) {
							if (CHECK_IS_ARRAY(param) === true) {
								params[name] = param[param.length - 1];
							}
						});
						
						data = params.__DATA;
						
						if (data !== undefined) {
							data = PARSE_STR(data);
							delete params.__DATA;
						}
						
						requestInfo = {
							headers : headers,
							cookies : parseCookieStr(headers.cookie),							
							isSecure : isSecure,
							uri : uri,
							method : method,
							params : params,
							data : data,
							ip : ip
						};
						
						response = function(contentOrParams) {
							//REQUIRED: contentOrParams
							//OPTIONAL: contentOrParams.statusCode		HTTP 응답 상태
							//OPTIONAL: contentOrParams.headers			응답 헤더
							//OPTIONAL: contentOrParams.cookies			클라이언트에 전달할 HTTP 쿠키
							//OPTIONAL: contentOrParams.contentType		응답하는 컨텐츠의 종류
							//OPTIONAL: contentOrParams.buffer			응답 내용을 Buffer형으로 전달
							//OPTIONAL: contentOrParams.content			응답 내용을 문자열로 전달
							//OPTIONAL: contentOrParams.stream			fs.createReadStream와 같은 함수로 스트림을 생성한 경우, 스트림을 응답으로 전달할 수 있습니다.
							//OPTIONAL: contentOrParams.totalSize		stream으로 응답을 전달하는 경우 스트림의 전체 길이
							//OPTIONAL: contentOrParams.startPosition	stream으로 응답을 전달하는 경우 전달할 시작 위치
							//OPTIONAL: contentOrParams.endPosition		stream으로 응답을 전달하는 경우 전달할 끝 위치
							//OPTIONAL: contentOrParams.encoding		응답 인코딩
							//OPTIONAL: contentOrParams.version			지정된 버전으로 웹 브라우저에 리소스를 캐싱합니다.
							//OPTIONAL: contentOrParams.isFinal			리소스가 결코 변경되지 않는 경우 true로 지정합니다. 그러면 version과 상관 없이 캐싱을 수행합니다.

							var
							// status code
							statusCode,

							// cookies
							cookies,

							// headers
							headers,

							// content type
							contentType,

							// content
							content,

							// buffer
							buffer,
							
							// stream
							stream,
							
							// total size
							totalSize,
							
							// start position
							startPosition,
							
							// end position
							endPosition,

							// encoding
							encoding,

							// version
							version,

							// is final
							isFinal;

							if (requestInfo.isResponsed !== true) {

								if (CHECK_IS_DATA(contentOrParams) !== true) {
									content = contentOrParams;
								} else {
									
									statusCode = contentOrParams.statusCode;
									cookies = contentOrParams.cookies;
									headers = contentOrParams.headers;
									contentType = contentOrParams.contentType;
									content = contentOrParams.content;
									buffer = contentOrParams.buffer;
									
									stream = contentOrParams.stream;
									totalSize = contentOrParams.totalSize;
									startPosition = contentOrParams.startPosition;
									endPosition = contentOrParams.endPosition;
									
									encoding = contentOrParams.encoding;
									version = contentOrParams.version;
									isFinal = contentOrParams.isFinal;
								}

								if (headers === undefined) {
									headers = {};
								}
								
								if (cookies !== undefined) {
									headers['Set-Cookie'] = createCookieStrArray(cookies);
								}

								if (contentType !== undefined) {

									if (encoding === undefined) {
										encoding = getEncodingFromContentType(contentType);
									}

									headers['Content-Type'] = contentType + '; charset=' + encoding;
								}

								if (stream !== undefined) {
									
									headers['Content-Range'] = 'bytes ' + startPosition + '-' + endPosition + '/' + totalSize;
									headers['Accept-Ranges'] = 'bytes';
									headers['Content-Length'] = endPosition - startPosition + 1;
									
									nativeRes.writeHead(206, headers);
									
									stream.pipe(nativeRes);
								}
								
								else {
									
									if (content === undefined) {
										content = '';
									}
									
									if (statusCode === undefined) {
										statusCode = 200;
									}
									
									if (CONFIG.isDevMode !== true) {
										if (isFinal === true) {
											headers['ETag'] = 'FINAL';
										} else if (version !== undefined) {
											headers['ETag'] = version;
										}
									}
									
									// when gzip encoding
									if (acceptEncoding.match(/\bgzip\b/) !== TO_DELETE) {
	
										headers['Content-Encoding'] = 'gzip';
	
										zlib.gzip(buffer !== undefined ? buffer : String(content), function(error, buffer) {
											nativeRes.writeHead(statusCode, headers);
											nativeRes.end(buffer, encoding);
										});
									}
	
									// when not encoding
									else {
										nativeRes.writeHead(statusCode, headers);
										nativeRes.end(buffer !== undefined ? buffer : String(content), encoding);
									}
								}

								requestInfo.isResponsed = true;
							}
						};
						
						responseError = function(errorMsg) {
							
							if (errorHandler !== undefined) {
								isGoingOn = errorHandler(errorMsg, requestInfo, response);
							} else {
								SHOW_ERROR('WEB_SERVER', errorMsg);
							}

							if (isGoingOn !== false && requestInfo.isResponsed !== true) {

								response(EXTEND({
									origin : {
										statusCode : 500
									},
									extend : overrideResponseInfo
								}));
							}
						};
						
						// when upload request
						if (isUploadURI === true) {
							
							CREATE_FOLDER(uploadPath, function() {
				
								var
								// form
								form,
				
								// file data set
								fileDataSet;
				
								// serve upload.
								if (method === 'POST') {
				
									form = new IncomingForm();
									fileDataSet = [];
									
									form.uploadDir = uploadPath;
									
									form.on('progress', function(bytesRecieved, bytesExpected) {
										
										if (uploadProgressHandler !== undefined) {
											uploadProgressHandler(params, bytesRecieved, bytesExpected, requestInfo);
										}
										
									}).on('field', function(name, value) {
				
										params[name] = value;
				
									}).on('file', function(name, fileInfo) {
				
										fileDataSet.push({
											path : fileInfo.path,
											size : fileInfo.size,
											name : fileInfo.name,
											type : fileInfo.type,
											lastModifiedTime : fileInfo.lastModifiedDate
										});
				
									}).on('end', function() {
										
										NEXT(fileDataSet, [
										function(fileData, next) {
											
											var
											// path
											path = fileData.path,
											
											// file size
											fileSize = fileData.size,
											
											// file type
											fileType = fileData.type;
											
											fileData.ip = ip;
											
											if (fileSize > maxUploadFileMB * 1024 * 1024) {
				
												NEXT(fileDataSet, [
												function(fileData, next) {
													REMOVE_FILE(fileData.path, next);
												},
				
												function() {
													return function() {
														if (uploadOverFileSizeHandler !== undefined) {
															uploadOverFileSizeHandler(params, maxUploadFileMB, requestInfo, response);
														}
													};
												}]);
				
												return false;
											}
											
											if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/gif') {
				
												IMAGEMAGICK_READ_METADATA(path, {
													error : function() {
														next(fileData);
													},
													success : function(metadata) {
				
														if (metadata.exif !== undefined) {
				
															fileData.exif = metadata.exif;
				
															IMAGEMAGICK_CONVERT([path, '-auto-orient', path], {
																error : errorHandler,
																success : next
															});
				
														} else {
															next();
														}
													}
												});
				
											} else {
												next();
											}
										},
				
										function() {
											return function() {
												uploadSuccessHandler(params, fileDataSet, requestInfo, response);
											};
										}]);
										
									}).on('error', function(error) {
										responseError(error.toString());
									});
				
									form.parse(nativeReq);
								}
							});
						}
						
						// when non-upload request
						else {
							
							NEXT([
							function(next) {
			
								if (requestListener !== undefined) {
									
									isGoingOn = requestListener(requestInfo, response, function(newRootPath) {
										rootPath = newRootPath;
									}, function(_overrideResponseInfo) {
			
										if (_overrideResponseInfo !== undefined) {
											overrideResponseInfo = _overrideResponseInfo;
										}
			
										DELAY(next);
									});
			
									// init properties again.
									uri = requestInfo.uri;
									method = requestInfo.method;
									params = requestInfo.params;
									headers = requestInfo.headers;
								}
			
								if (isGoingOn !== false && requestInfo.isResponsed !== true) {
									next();
								}
							},
			
							function() {
								return function() {
									
									// stream audio or video.
									if (headers.range !== undefined) {
										
										GET_FILE_INFO(rootPath + '/' + uri, {
											
											notExists : function() {
											
												response(EXTEND({
													origin : {
														statusCode : 404
													},
													extend : overrideResponseInfo
												}));
											},
											
											success : function(fileInfo) {
												
												var
												// positions
												positions = headers.range.replace(/bytes=/, '').split('-'),
												
												// total size
												totalSize = fileInfo.size,
												
												// start position
												startPosition = INTEGER(positions[0]),
												
												// end position
												endPosition = positions[1] === undefined || positions[1] === '' ? totalSize - 1 : INTEGER(positions[1]),
												
												// stream
												stream = fs.createReadStream(rootPath + '/' + uri, {
													start : startPosition,
													end : endPosition
												}).on('open', function() {
													
													response(EXTEND({
														origin : {
															contentType : getContentTypeFromExtension(path.extname(uri).substring(1)),
															totalSize : totalSize,
															startPosition : startPosition,
															endPosition : endPosition,
															stream : stream
														},
														extend : overrideResponseInfo
													}));
													
												}).on('error', function(error) {
													
													response(EXTEND({
														origin : {
															contentType : getContentTypeFromExtension(path.extname(uri).substring(1)),
															totalSize : totalSize,
															startPosition : startPosition,
															endPosition : endPosition,
															content : error.toString()
														},
														extend : overrideResponseInfo
													}));
												});
											}
										});
									}
									
									// check ETag.
									else if (CONFIG.isDevMode !== true && (overrideResponseInfo.isFinal !== true ?
			
									// check version.
									(version !== undefined && headers['if-none-match'] === version) :
			
									// check exists.
									headers['if-none-match'] !== undefined)) {
			
										// response cached.
										response(EXTEND({
											origin : {
												statusCode : 304
											},
											extend : overrideResponseInfo
										}));
									}
			
									// redirect correct version uri.
									else if (CONFIG.isDevMode !== true && overrideResponseInfo.isFinal !== true && version !== undefined && originalURI !== '' && params.version !== version) {
			
										response(EXTEND({
											origin : {
												statusCode : 302,
												headers : {
													'Location' : '/' + originalURI + '?' + querystring.stringify(COMBINE([params, {
														version : version
													}]))
												}
											},
											extend : overrideResponseInfo
										}));
									}
			
									// response resource file.
									else if (rootPath !== undefined && method === 'GET') {
										
										NEXT([
										function(next) {
			
											var
											// resource cache
											resourceCache = resourceCaches[originalURI];
			
											if (resourceCache !== undefined) {
												next(resourceCache.buffer, resourceCache.contentType);
											} else {
												
												// serve file.
												READ_FILE(rootPath + '/' + uri, {
			
													notExists : function() {
			
														// not found file, so serve index.
														READ_FILE(rootPath + (uri === '' ? '' : ('/' + uri)) + '/index.html', {
			
															notExists : function() {
																
																if (notExistsResourceHandler !== undefined) {
																	isGoingOn = notExistsResourceHandler(rootPath + '/' + uri, requestInfo, response);
																}
																
																if (isGoingOn !== false && requestInfo.isResponsed !== true) {
								
																	response(EXTEND({
																		origin : {
																			statusCode : 404
																		},
																		extend : overrideResponseInfo
																	}));
																}
															},
															
															error : responseError,
															success : function(buffer) {
																next(buffer, 'text/html');
															}
														});
													},
			
													error : responseError,
													success : next
												});
											}
										},
			
										function() {
											return function(buffer, contentType) {
												
												var
												// extension
												extension = path.extname(uri).substring(1);
												
												if (preprocessors !== undefined && preprocessors[extension] !== undefined) {
													preprocessors[extension](buffer.toString(), response);
												} else {
													
													if (contentType === undefined) {
														contentType = getContentTypeFromExtension(extension);
													}
				
													if (CONFIG.isDevMode !== true && overrideResponseInfo.isFinal !== true && resourceCaches[originalURI] === undefined) {
														resourceCaches[originalURI] = {
															buffer : buffer,
															contentType : contentType
														};
													}
				
													response(EXTEND({
														origin : {
															buffer : buffer,
															contentType : contentType,
															version : version
														},
														extend : overrideResponseInfo
													}));
												}
											};
										}]);
			
									} else {
										response(EXTEND({
											origin : {
												statusCode : 404
											},
											extend : overrideResponseInfo
										}));
									}
								};
							}]);
						}
					};
				}]);
			};

			// init sever.
			if (port !== undefined) {
				nativeServer = http.createServer(function(nativeReq, nativeRes) {
					serve(nativeReq, nativeRes, false);
				}).listen(port);
			}

			// init secured sever.
			if (securedPort !== undefined) {
				nativeServer = https.createServer({
					key : fs.readFileSync(securedKeyFilePath),
					cert : fs.readFileSync(securedCertFilePath)
				}, function(nativeReq, nativeRes) {
					serve(nativeReq, nativeRes, true);
				}).listen(securedPort);
			}
			
			self.getNativeServer = getNativeServer = function() {
				return nativeServer;
			};
			
			self.addPreprocessor = addPreprocessor = function(params) {
				//REQUIRED: params
				//REQUIRED: params.extension
				//REQUIRED: params.preprocessor
				
				var
				// extension
				extension = params.extension,
				
				// preprocessor
				preprocessor = params.preprocessor;
				
				if (preprocessors === undefined) {
					preprocessors = {};
				}
				
				preprocessors[extension] = preprocessor;
			};
			
			console.log('[WEB_SERVER] 웹 서버가 실행중입니다.' + (port === undefined ? '' : (' (HTTP 서버 포트:' + port + ')')) + (securedPort === undefined ? '' : (' (HTTPS 서버 포트:' + securedPort + ')')));
		}
	};
});
