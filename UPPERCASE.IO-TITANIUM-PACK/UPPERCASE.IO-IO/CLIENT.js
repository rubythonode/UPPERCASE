FOR_BOX(function(n){"use strict";n.R=METHOD({run:function(i,o){var r=n.boxName+"/R/"+i;return void 0!==CONFIG.version&&(r+="?version="+CONFIG.version),void 0!==o&&GET(r,o),r}})});FOR_BOX(function(n){"use strict";n.RF=METHOD({run:function(t){return"/__RF/"+n.boxName+"/"+t}})});global.TIME=TIME=METHOD(function(n){"use strict";var t,e=0;return n.setDiff=t=function(n){e=n},{run:function(n){return new Date(n.getTime()+e)}}});global.TIME_SYNC=TIME_SYNC=OBJECT({init:function(){"use strict";var t=UPPERCASE.IO.ROOM("timeSyncRoom"),e=new Date;t.send({methodName:"sync",data:e},TIME.setDiff)}});