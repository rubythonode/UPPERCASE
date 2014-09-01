FOR_BOX(function(o){"use strict";OVERRIDE(o.MODEL,function(){o.MODEL=CLASS({init:function(e,t,i){var r,n,s,a,c,d,u,v,E,f,O,l,C,A,N,S,R,D,m,I,g,_,h,L,M,H,x,T,P,p,K,b,U,k,B,V,X,W,Y,y=i.name,F=i.config,G=[],j=[],q=[],w=[],z=[],J=[],Q=[],Z=[],$=[],oe=[],ee=o.DB(y);t.getName=I=function(){return y},void 0!==F&&(r=F.create,n=F.get,s=F.update,a=F.remove,c=F.find,d=F.count,u=F.checkIsExists,void 0!==r&&(v=r.valid,f=r.role,m=r.initData),void 0!==n&&(O=n.role),void 0!==s&&(E=s.valid,l=s.role,R=s.authKey),void 0!==a&&(C=a.role,D=a.authKey),void 0!==c&&(A=c.role),void 0!==d&&(N=d.role),void 0!==u&&(S=u.role)),e.getCreateValid=g=function(){return v},e.getUpdateValid=_=function(){return E},e.initData=h=function(o){return void 0!==m&&m(o),o},t.getDB=L=function(){return ee},e.on=M=function(o,e){"create"===o?(void 0!==e.before&&G.push(e.before),void 0!==e.after&&j.push(e.after)):"get"===o?q.push(e):"update"===o?(void 0!==e.before&&w.push(e.before),void 0!==e.after&&z.push(e.after)):"remove"===o?(void 0!==e.before&&J.push(e.before),void 0!==e.after&&Q.push(e.after)):"find"===o?Z.push(e):"count"===o?$.push(e):"checkIsExists"===o&&oe.push(e)},H=function(e,t,i){var r,n;h(e),void 0!==v&&(r=v.check(e)),void 0!==r&&r.checkHasError()===!0?t({validErrors:r.getErrors()}):NEXT([function(o){EACH(G,function(r){var s=r(e,t,o,i);n!==!0&&s===!1&&(n=!0)}),n!==!0&&o()},function(){return function(){ee.create(e,{error:function(o){t({errorMsg:o})},success:function(e){EACH(j,function(o){o(e,i)}),o.BROADCAST({roomName:y+"/create",methodName:"create",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:y+"/"+i+"/"+t+"/create",methodName:"create",data:e})}),t({savedData:e})}})}}])},x=function(o,e,t){var i,r,n,s,a;CHECK_IS_DATA(o)!==!0?i=o:(i=o.id,r=o.filter,n=o.sort,s=o.isRandom),ee.get({id:i,filter:r,sort:n,isRandom:s},{error:function(o){e({errorMsg:o})},notExists:function(){e()},success:function(o){EACH(q,function(i){var r=i(o,e,t);a!==!0&&r===!1&&(a=!0)}),a!==!0&&e({savedData:o})}})},T=function(e,t,i){var r,n,s=e.id;void 0!==E&&(r=E.checkExceptUndefined(e)),e.id=s,void 0!==r&&r.checkHasError()===!0?t({validErrors:r.getErrors()}):NEXT([function(o){EACH(w,function(r){var s=r(e,t,o,i);n!==!0&&s===!1&&(n=!0)}),n!==!0&&o()},function(){return function(){ee.update(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(e){void 0!==e&&(EACH(z,function(o){o(e,i)}),o.BROADCAST({roomName:y+"/"+e.id,methodName:"update",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:y+"/"+i+"/"+t+"/update",methodName:"update",data:e})})),t({savedData:e})}})}}])},P=function(e,t,i){var r;NEXT([function(o){EACH(J,function(n){var s=n(e,t,o,i);r!==!0&&s===!1&&(r=!0)}),r!==!0&&o()},function(){return function(){ee.remove(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(e){void 0!==e&&(EACH(Q,function(o){o(e,i)}),o.BROADCAST({roomName:y+"/"+e.id,methodName:"remove",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:y+"/"+i+"/"+t+"/remove",methodName:"remove",data:e})})),t({savedData:e})}})}}])},p=function(o,e,t){var i,r,n,s,a,c;void 0!==o&&(i=o.filter,r=o.sort,n=INTEGER(o.start),s=INTEGER(o.count),a=o.isFindAll),ee.find({filter:i,sort:r,start:n,count:s,isFindAll:a},{error:function(o){e({errorMsg:o})},success:function(o){EACH(Z,function(i){var r=i(o,e,t);c!==!0&&r===!1&&(c=!0)}),c!==!0&&e({savedDataSet:o})}})},K=function(o,e,t){var i,r;void 0!==o&&(i=o.filter),ee.count({filter:i},{error:function(o){e({errorMsg:o})},success:function(o){EACH($,function(i){var n=i(o,e,t);r!==!0&&n===!1&&(r=!0)}),r!==!0&&e({count:o})}})},b=function(o,e,t){var i,r;void 0!==o&&(i=o.filter),ee.checkIsExists({filter:i},{error:function(o){e({errorMsg:o})},success:function(o){EACH(oe,function(){var i=oe(o,e,t);r!==!0&&i===!1&&(r=!0)}),r!==!0&&e({isExists:o})}})},r!==!1&&(t.create=U=function(e,t){var i,r,n;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notValid,n=t.error)),H(e,function(e){var t,s,a;void 0!==e?(t=e.errorMsg,s=e.validErrors,a=e.savedData,void 0!==t?void 0!==n?n(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".create` ERROR: "+t)):void 0!==s?void 0!==r?r(s):console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".create` NOT VALID."),s):void 0!==i&&i(a)):void 0!==i&&i()})}),n!==!1&&(t.get=k=function(e,t){var i,r,n;CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.error),x(e,function(t){var s,a;void 0!==t&&(s=t.errorMsg,a=t.savedData),void 0!==s?void 0!==n?n(s):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".get` ERROR: "+s)):void 0===a?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".get` NOT EXISTS."),e):i(a)})}),s!==!1&&(t.update=B=function(e,t){var i,r,n,s;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.notValid,s=t.error)),T(e,function(t){var a,c,d;void 0!==t&&(a=t.errorMsg,c=t.validErrors,d=t.savedData),void 0!==a?void 0!==s?s(a):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".update` ERROR: "+a)):void 0!==c?void 0!==n?n(c):console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".update` NOT VALID."),c):void 0===d?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".update` NOT EXISTS."),e):void 0!==i&&i(d)})}),a!==!1&&(t.remove=V=function(e,t){var i,r,n;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.error)),P(e,function(t){var s,a;void 0!==t&&(s=t.errorMsg,a=t.savedData),void 0!==s?void 0!==n?n(s):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".remove` ERROR: "+s)):void 0===a?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".remove` NOT EXISTS."),e):void 0!==i&&i(a)})}),c!==!1&&(t.find=X=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),p(e,function(e){var t=e.errorMsg,n=e.savedDataSet;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".find` ERROR: "+t)):i(n)})}),d!==!1&&(t.count=W=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),K(e,function(e){var t=e.errorMsg,n=e.count;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".count` ERROR: "+t)):i(n)})}),u!==!1&&(t.checkIsExists=Y=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),b(e,function(e){var t=e.errorMsg,n=e.isExists;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+y+".checkIsExists` ERROR: "+t)):i(n)})}),o.ROOM(y,function(o,e){r!==!1&&e("create",function(e,t){void 0===f||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:f})===!0?H(e,t,o):t({isNotAuthed:!0})}),n!==!1&&e("get",function(e,t){void 0===O||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:O})===!0?x(e,t,o):t({isNotAuthed:!0})}),s!==!1&&e("update",function(e,t){void 0===l||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:l})===!0?void 0!==R?ee.get(e.id,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(i){i[R]===o.authKey?T(e,t,o):t({isNotAuthed:!0})}}):T(e,t,o):t({isNotAuthed:!0})}),a!==!1&&e("remove",function(e,t){void 0===C||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:C})===!0?void 0!==D?ee.get(data.id,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(i){i[D]===o.authKey?P(e,t,o):t({isNotAuthed:!0})}}):P(e,t,o):t({isNotAuthed:!0})}),c!==!1&&e("find",function(e,t){void 0===A||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:A})===!0?(void 0!==e&&delete e.isFindAll,p(e,t,o)):t({isNotAuthed:!0})}),d!==!1&&e("count",function(e,t){void 0===N||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:N})===!0?K(e,t,o):t({isNotAuthed:!0})}),u!==!1&&e("checkIsExists",function(e,t){void 0===S||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:S})===!0?b(e,t,o):t({isNotAuthed:!0})})})}})})});