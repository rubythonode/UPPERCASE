global.BOOT=BOOT=function(params){"use strict";var path=require("path"),cluster=require("cluster"),version,UPPERCASE_IO_PATH=__dirname+"/..",rootPath=process.cwd(),browserScriptContentInfos=[],browserScript="",indexPageContent="",boxNamesInBOXFolder=[],loadJSForNode=function(e){require(e)},addContentToBrowserScript=function(e){browserScript+=e,browserScriptContentInfos.push({type:"content",content:e})},loadJSForBrowser=function(e,o){browserScript+=READ_FILE({path:e,isSync:!0}).toString()+"\n",o!==!0&&browserScriptContentInfos.push({type:"js",path:e})},loadJSForClient=function(e){loadJSForBrowser(e)},loadJSForCommon=function(e){loadJSForNode(e),loadJSForBrowser(e)},loadCoffeeForNode=function(e){RUN_COFFEE({code:READ_FILE({path:e,isSync:!0}).toString(),fileName:e})},loadCoffeeForBrowser=function(e,o){browserScript+=COMPILE_COFFEE_TO_JS({code:READ_FILE({path:e,isSync:!0}).toString(),fileName:e})+"\n",o!==!0&&browserScriptContentInfos.push({type:"coffee",path:e})},loadCoffeeForClient=function(e){loadCoffeeForBrowser(e)},loadCoffeeForCommon=function(e){loadCoffeeForNode(e),loadCoffeeForBrowser(e)},loadLiterateCoffeeForNode=function(e){RUN_LITCOFFEE({code:READ_FILE({path:e,isSync:!0}).toString(),fileName:e})},loadLiterateCoffeeForBrowser=function(e,o){browserScript+=COMPILE_LITCOFFEE_TO_JS({code:READ_FILE({path:e,isSync:!0}).toString(),fileName:e})+"\n",o!==!0&&browserScriptContentInfos.push({type:"litcoffee",path:e})},loadLiterateCoffeeForClient=function(e){loadLiterateCoffeeForBrowser(e)},loadLiterateCoffeeForCommon=function(e){loadLiterateCoffeeForNode(e),loadLiterateCoffeeForBrowser(e)},reloadBrowserScript=function(){browserScript="",EACH(browserScriptContentInfos,function(e){"content"===e.type?browserScript+=e.content:"js"===e.type?loadJSForBrowser(e.path,!0):"coffee"===e.type?loadCoffeeForBrowser(e.path,!0):"litcoffee"===e.type&&loadLiterateCoffeeForBrowser(e.path,!0)})},checkIsAllowedFolderName=function(e){return"BOX"!==e&&"node_modules"!==e&&"not_load"!==e&&"deprecated"!==e&&"_"!==e[0]},loadUJS,configuration,initBoxes,clustering,initDatabase,initModelSystem,loadAllScripts,generateIndexPage,run;addContentToBrowserScript("global = window;\n"),loadUJS=function(){loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.JS-COMMON.js"),loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.JS-NODE.js"),loadJSForBrowser(UPPERCASE_IO_PATH+"/UPPERCASE.JS-COMMON.js"),loadJSForBrowser(UPPERCASE_IO_PATH+"/UPPERCASE.JS-BROWSER.js")},configuration=function(){var _CONFIG,_NODE_CONFIG,_BROWSER_CONFIG,stringifyJSONWithFunction=function(data){return JSON.stringify(data,function(e,o){return"function"==typeof o?"__THIS_IS_FUNCTION_START__"+o.toString()+"__THIS_IS_FUNCTION_END__":o},"	").replace(/("__THIS_IS_FUNCTION_START__(.*)__THIS_IS_FUNCTION_END__")/g,function(match,content){return eval("("+eval('"'+content.substring('"__THIS_IS_FUNCTION_START__'.length,content.length-'__THIS_IS_FUNCTION_END__"'.length)+'"')+")").toString()})};NODE_CONFIG.rootPath=rootPath,void 0!==params&&(_CONFIG=params.CONFIG,_NODE_CONFIG=params.NODE_CONFIG,_BROWSER_CONFIG=params.BROWSER_CONFIG),void 0!==_CONFIG&&(EXTEND({origin:CONFIG,extend:_CONFIG}),addContentToBrowserScript("EXTEND({ origin : CONFIG, extend : "+stringifyJSONWithFunction(_CONFIG)+" });\n")),CONFIG.isDevMode===!0&&cluster.isMaster===!0&&(version="V"+Date.now(),WRITE_FILE({path:rootPath+"/V",content:version,isSync:!0})),READ_FILE({path:rootPath+"/V",isSync:!0},{notExists:function(){console.log(CONSOLE_RED("[UPPERCASE.IO] NOT EXISTS `V` VERSION FILE!")),version="V__NOT_EXISTS"},success:function(e){version=e.toString()}}),CONFIG.version=version,addContentToBrowserScript("CONFIG.version = '"+version+"'\n"),void 0!==_NODE_CONFIG&&EXTEND({origin:NODE_CONFIG,extend:_NODE_CONFIG}),void 0!==_BROWSER_CONFIG&&addContentToBrowserScript("EXTEND({ origin : BROWSER_CONFIG, extend : "+stringifyJSONWithFunction(_BROWSER_CONFIG)+" });\n"),addContentToBrowserScript("BROWSER_CONFIG.fixScriptsFolderPath = '/UPPERCASE.JS-BROWSER-FIX';\n"),addContentToBrowserScript("BROWSER_CONFIG.fixTransportScriptsFolderPath = '/UPPERCASE.IO-TRANSPORT';\n"),VALID.addIgnoreAttr("$inc"),addContentToBrowserScript("VALID.addIgnoreAttr('$inc');\n")},initBoxes=function(){loadJSForCommon(UPPERCASE_IO_PATH+"/UPPERCASE.IO-BOX/CORE.js"),FIND_FOLDER_NAMES({path:rootPath,isSync:!0},function(e){EACH(e,function(e){checkIsAllowedFolderName(e)===!0&&(BOX(e),addContentToBrowserScript("BOX('"+e+"');\n"))})}),CHECK_IS_EXISTS_FILE({path:rootPath+"/BOX",isSync:!0})===!0&&FIND_FOLDER_NAMES({path:rootPath+"/BOX",isSync:!0},function(e){EACH(e,function(e){checkIsAllowedFolderName(e)===!0&&(BOX(e),addContentToBrowserScript("BOX('"+e+"');\n"),boxNamesInBOXFolder.push(e))})}),loadJSForBrowser(UPPERCASE_IO_PATH+"/UPPERCASE.IO-BOX/CLIENT.js"),loadJSForBrowser(UPPERCASE_IO_PATH+"/UPPERCASE.IO-BOX/BROWSER.js")},clustering=function(e){CPU_CLUSTERING(function(){void 0!==NODE_CONFIG.clusteringServers&&void 0!==NODE_CONFIG.thisServerName&&void 0!==NODE_CONFIG.clusteringPort?SERVER_CLUSTERING({servers:NODE_CONFIG.clusteringServers,thisServerName:NODE_CONFIG.thisServerName,port:NODE_CONFIG.clusteringPort},e):e()})},initDatabase=function(){loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.IO-DB/NODE.js"),void 0!==NODE_CONFIG.dbName&&CONNECT_TO_DB_SERVER({name:NODE_CONFIG.dbName,host:NODE_CONFIG.dbHost,port:NODE_CONFIG.dbPort,username:NODE_CONFIG.dbUsername,password:NODE_CONFIG.dbPassword})},initModelSystem=function(){loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.IO-TRANSPORT/NODE.js"),loadJSForBrowser(UPPERCASE_IO_PATH+"/UPPERCASE.IO-TRANSPORT/BROWSER.js"),loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.IO-ROOM/NODE.js"),loadJSForClient(UPPERCASE_IO_PATH+"/UPPERCASE.IO-ROOM/CLIENT.js"),loadJSForBrowser(UPPERCASE_IO_PATH+"/UPPERCASE.IO-ROOM/BROWSER.js"),loadJSForCommon(UPPERCASE_IO_PATH+"/UPPERCASE.IO-MODEL/COMMON.js"),loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.IO-MODEL/NODE.js"),loadJSForClient(UPPERCASE_IO_PATH+"/UPPERCASE.IO-MODEL/CLIENT.js")},loadAllScripts=function(){var e=function(e,o,t,n){var r=function(e){FIND_FILE_NAMES({path:e,isSync:!0},{notExists:function(){},success:function(r){EACH(r,function(r){var i=e+"/"+r,a=path.extname(r).toLowerCase();".js"===a?o(i):".coffee"===a?t(i):".litcoffee"===a&&n(i)})}}),FIND_FOLDER_NAMES({path:e,isSync:!0},{notExists:function(){},success:function(o){EACH(o,function(o){checkIsAllowedFolderName(o)===!0&&r(e+"/"+o)})}})};FOR_BOX(function(i){var a=CHECK_IS_IN({array:boxNamesInBOXFolder,value:i.boxName})===!0?rootPath+"/BOX":rootPath;r(a+"/"+i.boxName+"/"+e),FIND_FILE_NAMES({path:a+"/"+i.boxName,isSync:!0},{notExists:function(){},success:function(r){EACH(r,function(r){var s=a+"/"+i.boxName+"/"+r,O=path.extname(r).toLowerCase();r===e+O&&(".js"===O?o(s):".coffee"===O?t(s):".litcoffee"===O&&n(s))})}})})};e("COMMON",loadJSForCommon,loadCoffeeForCommon,loadLiterateCoffeeForCommon),e("NODE",loadJSForNode,loadCoffeeForNode,loadLiterateCoffeeForNode),e("BROWSER",loadJSForBrowser,loadCoffeeForBrowser,loadLiterateCoffeeForBrowser),e("CLIENT",loadJSForClient,loadCoffeeForClient,loadLiterateCoffeeForClient)},generateIndexPage=function(){indexPageContent+="<!DOCTYPE html>",indexPageContent+="<html>",indexPageContent+="<head>",indexPageContent+='<meta charset="utf-8">',indexPageContent+='<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'+(CONFIG.isMobileFullScreen===!0?", minimal-ui":"")+'">',indexPageContent+='<meta name="google" value="notranslate">',void 0!==CONFIG.googleSiteVerificationKey&&(indexPageContent+='<meta name="google-site-verification" content="'+CONFIG.googleSiteVerificationKey+'" />'),indexPageContent+='<meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1">',void 0!==CONFIG.description&&(indexPageContent+='<meta name="description" content="'+CONFIG.description+'">'),indexPageContent+='<link href="/favicon.ico" rel="shortcut icon">',indexPageContent+="<title>"+CONFIG.title+"</title>",indexPageContent+='<link rel="stylesheet" type="text/css" href="/__CSS?'+CONFIG.version+'" />',indexPageContent+="</head>",indexPageContent+="<body>",indexPageContent+="<noscript>",indexPageContent+='<p style="padding:15px;">',indexPageContent+="JavaScript is disabled. Please enable JavaScript in your browser.",indexPageContent+="</p>",indexPageContent+="</noscript>",indexPageContent+='<script type="text/javascript" src="/__SCRIPT?'+CONFIG.version+'"></script>',indexPageContent+="</body>",indexPageContent+="</html>"},run=function(){var e,o,t,n,r,i,a,s,O,C={},E=CALENDAR();void 0!==NODE_CONFIG.uploadServers&&(e=[],n=0,EACH(NODE_CONFIG.uploadServers,function(o){e.push(o)})),void 0!==NODE_CONFIG.socketServers&&(o=[],r=0,EACH(NODE_CONFIG.socketServers,function(e){o.push(e)})),void 0!==NODE_CONFIG.webSocketServers&&(t=[],i=0,EACH(NODE_CONFIG.webSocketServers,function(e){t.push(e)})),INIT_OBJECTS(),FOR_BOX(function(e){void 0!==e.MAIN&&e.MAIN(function(o){C[e.boxName]=o})}),(void 0!==CONFIG.webServerPort||void 0!==CONFIG.sercuredWebServerPort)&&(loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.IO-UPLOAD/NODE.js"),s=RESOURCE_SERVER({port:CONFIG.webServerPort,securedPort:CONFIG.sercuredWebServerPort,securedKeyFilePath:rootPath+"/"+NODE_CONFIG.securedKeyFilePath,securedCertFilePath:rootPath+"/"+NODE_CONFIG.securedCertFilePath,noParsingParamsURI:"__UPLOAD",rootPath:rootPath,version:version},{requestListener:function(s,E,S,c,d){var _,l,P,I=s.uri,N=(s.method,s.headers),F=s.params,f=function(e){return void 0!==F.callback?F.callback+"('"+e+"')":e};if("__CHECK_ALIVE"===I)return E({content:"",headers:{"Access-Control-Allow-Origin":"*"}}),!1;if("__SCRIPT"===I)return CONFIG.isDevMode===!0?(reloadBrowserScript(),E({contentType:"text/javascript",content:browserScript})):E(N["if-none-match"]===version?{statusCode:304}:F.version!==version?{statusCode:302,headers:{Location:"/__SCRIPT?version="+version}}:{contentType:"text/javascript",content:browserScript,version:version}),!1;if("__CSS"===I)c(UPPERCASE_IO_PATH),s.uri="UPPERCASE.IO-IO/R/BASE_STYLE.css";else{if("__UPLOAD_SERVER_HOST"===I)return void 0===e?E({content:f(F.defaultHost),headers:{"Access-Control-Allow-Origin":"*"}}):(E({content:f(e[n]),headers:{"Access-Control-Allow-Origin":"*"}}),n+=1,n===e.length&&(n=0)),!1;if("__UPLOAD"===I)return UPLOAD_REQUEST({requestInfo:s,uploadPath:rootPath+"/__RF/__TEMP"},{overFileSize:function(){E({statusCode:302,headers:{Location:F.callbackURL+"?maxUploadFileMB="+NODE_CONFIG.maxUploadFileMB}})},success:function(e){var o,t=F.boxName,n=BOX.getBoxes()[void 0===t?CONFIG.defaultBoxName:t];void 0!==n&&(o=n.DB("__UPLOAD_FILE"),NEXT(e,[function(e,n){var r=e.path;delete e.path,e.serverName=NODE_CONFIG.thisServerName,e.downloadCount=0,o.create(e,function(e){MOVE_FILE({from:r,to:rootPath+"/__RF/"+t+"/"+e.id},n)})},function(){return function(){var o=STRINGIFY(e);E(void 0===F.callbackURL?o:{statusCode:302,headers:{Location:F.callbackURL+"?fileDataSetStr="+encodeURIComponent(o)}})}}]))}}),!1;if("__RF/"===I.substring(0,5))return I=I.substring(5),P=I.indexOf("/"),-1!==P&&(_=I.substring(0,P),"UPPERCASE.IO"===_||void 0!==BOX.getBoxes()[_]?I=I.substring(P+1):_=CONFIG.defaultBoxName,l=BOX.getBoxes()[_].DB("__UPLOAD_FILE"),l.get(-1===I.lastIndexOf("/")?I:I.substring(I.lastIndexOf("/")+1),{error:function(){d({isFinal:!0})},notExists:function(){d({isFinal:!0})},success:function(e){e.serverName===NODE_CONFIG.thisServerName?(d({contentType:e.type,headers:{"Content-Disposition":'attachment; filename="'+e.name+'"',"Access-Control-Allow-Origin":"*"},isFinal:!0}),l.update({id:e.id,$inc:{downloadCount:1}})):E({statusCode:302,headers:{Location:"http://"+NODE_CONFIG.uploadServers[e.serverName]+":"+CONFIG.webServerPort+"/__RF/"+_+"/"+I}})}})),!1;if("__UPLOAD_CALLBACK"===I)c(UPPERCASE_IO_PATH+"/UPPERCASE.IO-UPLOAD/R"),s.uri="UPLOAD_CALLBACK.html";else{if("__SOCKET_SERVER_HOST"===I)return void 0===o?E({content:f(F.defaultHost)}):(E({content:f(o[r])}),r+=1,r===o.length&&(r=0)),!1;if("__WEB_SOCKET_SERVER_HOST"===I)return void 0===t?E({content:f(F.defaultHost),headers:{"Access-Control-Allow-Origin":"*"}}):(E({content:f(t[i]),headers:{"Access-Control-Allow-Origin":"*"}}),i+=1,i===t.length&&(i=0)),!1;if("__WEB_SOCKET_FIX"===I)return O(s,{response:E,onDisconnected:S}),!1;if(P=I.indexOf("/"),-1===P?_=CONFIG.defaultBoxName:(_=I.substring(0,P),void 0!==BOX.getBoxes()[_]||"UPPERCASE.IO-TRANSPORT"===_||"UPPERCASE.JS-BROWSER-FIX"===_?I=I.substring(P+1):_=CONFIG.defaultBoxName),"UPPERCASE.IO-TRANSPORT"===_)c(UPPERCASE_IO_PATH+"/UPPERCASE.IO-TRANSPORT/R"),s.uri=I;else if("UPPERCASE.JS-BROWSER-FIX"===_)c(UPPERCASE_IO_PATH+"/UPPERCASE.JS-BROWSER-FIX"),s.uri=I;else{if(void 0!==C[_]&&(a=C[_](s,E,S,c,d)),a===!1)return a;s.uri=CHECK_IS_IN({array:boxNamesInBOXFolder,value:_})===!0?"BOX/"+_+"/R"+(""===I?"":"/"+I):_+"/R"+(""===I?"":"/"+I)}}}},notExistsResource:function(e,o,t){(o.uri===CONFIG.defaultBoxName+"/R"||o.uri==="BOX/"+CONFIG.defaultBoxName+"/R")&&t({contentType:"text/html",content:indexPageContent})}}),O=LAUNCH_ROOM_SERVER({socketServerPort:CONFIG.socketServerPort,webServer:s,isCreateWebSocketFixRequestManager:!0}).getWebSocketFixRequest()),console.log("[UPPERCASE.IO] <"+E.getYear()+"-"+E.getMonth()+"-"+E.getDate()+" "+E.getHour()+":"+E.getMinute()+":"+E.getSecond()+"> `"+CONFIG.title+"` WORKER #"+CPU_CLUSTERING.getWorkerId()+" BOOTed!"+(void 0===CONFIG.webServerPort?"":" => http://localhost:"+CONFIG.webServerPort)+(void 0===CONFIG.securedWebServerPort?"":" => https://localhost:"+CONFIG.securedWebServerPort))},loadUJS(),configuration(),initBoxes(),loadJSForNode(UPPERCASE_IO_PATH+"/UPPERCASE.IO-UTIL/NODE.js"),loadJSForCommon(UPPERCASE_IO_PATH+"/UPPERCASE.IO-IO/COMMON.js"),loadJSForClient(UPPERCASE_IO_PATH+"/UPPERCASE.IO-IO/CLIENT.js"),loadJSForClient(UPPERCASE_IO_PATH+"/UPPERCASE.IO-IO/BROWSER.js"),loadJSForClient(UPPERCASE_IO_PATH+"/UPPERCASE.IO-IO/BROWSER_INIT.js"),clustering(function(){initDatabase(),initModelSystem(),loadAllScripts(),CONFIG.isDevMode!==!0&&(browserScript=MINIFY_JS(browserScript)),generateIndexPage(),run()})};