OVERRIDE(EVENT_LOW,function(n){"use strict";global.EVENT_LOW=EVENT_LOW=CLASS({preset:function(){return n},init:function(n,o,a,t){var e,i,c,h=a.node,l=a.name;"hashchange"===l&&void 0===global.onhashchange&&(e=location.hash,i=setInterval(function(){location.hash!==e&&(e=location.hash,t(void 0,h))},100),OVERRIDE(o.remove,function(){o.remove=c=function(){clearInterval(i)}}))}})});