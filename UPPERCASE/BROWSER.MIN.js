OVERRIDE(CONFIG,function(o){"use strict";global.CONFIG=COMBINE([{defaultBoxName:"UPPERCASE",title:"UPPERCASE PROJECT",baseBackgroundColor:"#000",baseColor:"#fff",isMobileFullScreen:!1,isUsingHTMLSnapshot:!1},o])});FOR_BOX(function(o){"use strict";o.R=METHOD(function(n){var i,r;return n.setBasePath=r=function(o){i=o},{run:function(n,r){var t=o.boxName+"/R/"+n;return void 0!==CONFIG.version&&(t+="?version="+CONFIG.version),void 0!==i&&(t=i+"/"+t),"file:"!==location.protocol&&(t="/"+t),void 0!==r&&GET(t,r),t}}})});FOR_BOX(function(t){"use strict";t.RF=METHOD({run:function(O){return(BROWSER_CONFIG.isSecure===!0?"https:":"http:")+"//"+BROWSER_CONFIG.host+":"+BROWSER_CONFIG.port+"/__RF/"+t.boxName+"/"+O}})});global.SERVER_TIME=METHOD(function(n){"use strict";var t,e=0;return n.setDiff=t=function(n){e=n},{run:function(n){return new Date(n.getTime()-e)}}});global.SYNC_TIME=METHOD({run:function(){"use strict";var t=UPPERCASE.ROOM("timeSyncRoom"),e=new Date;t.send({methodName:"sync",data:e},function(t){TIME.setDiff(t),SERVER_TIME.setDiff(t)})}});global.TIME=METHOD(function(n){"use strict";var t,e=0;return n.setDiff=t=function(n){e=n},{run:function(n){return new Date(n.getTime()+e)}}});global.CONNECT_TO_IO_SERVER=METHOD({run:function(e,r){"use strict";var o,t,s,E,i,_;void 0===r?void 0!==e&&(CHECK_IS_DATA(e)!==!0?i=e:(o=e.roomServerName,t=e.webServerHost,s=e.webServerPort,E=e.isSecure,i=e.success,_=e.error)):(void 0!==e&&(o=e.roomServerName,t=e.webServerHost,s=e.webServerPort,E=e.isSecure),CHECK_IS_DATA(r)!==!0?i=r:(i=r.success,_=r.error)),void 0===t&&(t=BROWSER_CONFIG.host),void 0===s&&(s=CONFIG.webServerPort),void 0===E&&(E=BROWSER_CONFIG.isSecure),GET({isSecure:E,host:t,port:s,uri:"__WEB_SOCKET_SERVER_HOST",paramStr:"defaultHost="+t},{error:_,success:function(e){CONNECT_TO_ROOM_SERVER({name:o,host:e,port:s,fixRequestURI:"__WEB_SOCKET_FIX"},function(e,r,o){FOR_BOX(function(e){EACH(e.MODEL.getOnNewInfos(),function(e){e.findMissingDataSet()})}),e("__DISCONNECTED",function(){FOR_BOX(function(e){EACH(e.MODEL.getOnNewInfos(),function(e){e.lastCreateTime=SERVER_TIME(new Date)})})}),void 0!==i&&i(e,r,o)})}})}});