var aO=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function JA(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var MI={exports:{}},te={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var el=Symbol.for("react.element"),ZA=Symbol.for("react.portal"),eP=Symbol.for("react.fragment"),tP=Symbol.for("react.strict_mode"),nP=Symbol.for("react.profiler"),rP=Symbol.for("react.provider"),iP=Symbol.for("react.context"),sP=Symbol.for("react.forward_ref"),oP=Symbol.for("react.suspense"),aP=Symbol.for("react.memo"),lP=Symbol.for("react.lazy"),Py=Symbol.iterator;function uP(n){return n===null||typeof n!="object"?null:(n=Py&&n[Py]||n["@@iterator"],typeof n=="function"?n:null)}var FI={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},UI=Object.assign,BI={};function Ys(n,e,t){this.props=n,this.context=e,this.refs=BI,this.updater=t||FI}Ys.prototype.isReactComponent={};Ys.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};Ys.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function zI(){}zI.prototype=Ys.prototype;function gp(n,e,t){this.props=n,this.context=e,this.refs=BI,this.updater=t||FI}var yp=gp.prototype=new zI;yp.constructor=gp;UI(yp,Ys.prototype);yp.isPureReactComponent=!0;var Ry=Array.isArray,jI=Object.prototype.hasOwnProperty,_p={current:null},$I={key:!0,ref:!0,__self:!0,__source:!0};function qI(n,e,t){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)jI.call(e,r)&&!$I.hasOwnProperty(r)&&(i[r]=e[r]);var a=arguments.length-2;if(a===1)i.children=t;else if(1<a){for(var u=Array(a),c=0;c<a;c++)u[c]=arguments[c+2];i.children=u}if(n&&n.defaultProps)for(r in a=n.defaultProps,a)i[r]===void 0&&(i[r]=a[r]);return{$$typeof:el,type:n,key:s,ref:o,props:i,_owner:_p.current}}function cP(n,e){return{$$typeof:el,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function vp(n){return typeof n=="object"&&n!==null&&n.$$typeof===el}function hP(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var Cy=/\/+/g;function ed(n,e){return typeof n=="object"&&n!==null&&n.key!=null?hP(""+n.key):e.toString(36)}function uu(n,e,t,r,i){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case el:case ZA:o=!0}}if(o)return o=n,i=i(o),n=r===""?"."+ed(o,0):r,Ry(i)?(t="",n!=null&&(t=n.replace(Cy,"$&/")+"/"),uu(i,e,t,"",function(c){return c})):i!=null&&(vp(i)&&(i=cP(i,t+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(Cy,"$&/")+"/")+n)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Ry(n))for(var a=0;a<n.length;a++){s=n[a];var u=r+ed(s,a);o+=uu(s,e,t,u,i)}else if(u=uP(n),typeof u=="function")for(n=u.call(n),a=0;!(s=n.next()).done;)s=s.value,u=r+ed(s,a++),o+=uu(s,e,t,u,i);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Fl(n,e,t){if(n==null)return n;var r=[],i=0;return uu(n,r,"","",function(s){return e.call(t,s,i++)}),r}function dP(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var vt={current:null},cu={transition:null},fP={ReactCurrentDispatcher:vt,ReactCurrentBatchConfig:cu,ReactCurrentOwner:_p};function WI(){throw Error("act(...) is not supported in production builds of React.")}te.Children={map:Fl,forEach:function(n,e,t){Fl(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return Fl(n,function(){e++}),e},toArray:function(n){return Fl(n,function(e){return e})||[]},only:function(n){if(!vp(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};te.Component=Ys;te.Fragment=eP;te.Profiler=nP;te.PureComponent=gp;te.StrictMode=tP;te.Suspense=oP;te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fP;te.act=WI;te.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var r=UI({},n.props),i=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=_p.current),e.key!==void 0&&(i=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(u in e)jI.call(e,u)&&!$I.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&a!==void 0?a[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=t;else if(1<u){a=Array(u);for(var c=0;c<u;c++)a[c]=arguments[c+2];r.children=a}return{$$typeof:el,type:n.type,key:i,ref:s,props:r,_owner:o}};te.createContext=function(n){return n={$$typeof:iP,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:rP,_context:n},n.Consumer=n};te.createElement=qI;te.createFactory=function(n){var e=qI.bind(null,n);return e.type=n,e};te.createRef=function(){return{current:null}};te.forwardRef=function(n){return{$$typeof:sP,render:n}};te.isValidElement=vp;te.lazy=function(n){return{$$typeof:lP,_payload:{_status:-1,_result:n},_init:dP}};te.memo=function(n,e){return{$$typeof:aP,type:n,compare:e===void 0?null:e}};te.startTransition=function(n){var e=cu.transition;cu.transition={};try{n()}finally{cu.transition=e}};te.unstable_act=WI;te.useCallback=function(n,e){return vt.current.useCallback(n,e)};te.useContext=function(n){return vt.current.useContext(n)};te.useDebugValue=function(){};te.useDeferredValue=function(n){return vt.current.useDeferredValue(n)};te.useEffect=function(n,e){return vt.current.useEffect(n,e)};te.useId=function(){return vt.current.useId()};te.useImperativeHandle=function(n,e,t){return vt.current.useImperativeHandle(n,e,t)};te.useInsertionEffect=function(n,e){return vt.current.useInsertionEffect(n,e)};te.useLayoutEffect=function(n,e){return vt.current.useLayoutEffect(n,e)};te.useMemo=function(n,e){return vt.current.useMemo(n,e)};te.useReducer=function(n,e,t){return vt.current.useReducer(n,e,t)};te.useRef=function(n){return vt.current.useRef(n)};te.useState=function(n){return vt.current.useState(n)};te.useSyncExternalStore=function(n,e,t){return vt.current.useSyncExternalStore(n,e,t)};te.useTransition=function(){return vt.current.useTransition()};te.version="18.3.1";MI.exports=te;var KI=MI.exports;const lO=JA(KI);var HI={exports:{}},Ut={},GI={exports:{}},QI={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(q,Y){var J=q.length;q.push(Y);e:for(;0<J;){var Ee=J-1>>>1,de=q[Ee];if(0<i(de,Y))q[Ee]=Y,q[J]=de,J=Ee;else break e}}function t(q){return q.length===0?null:q[0]}function r(q){if(q.length===0)return null;var Y=q[0],J=q.pop();if(J!==Y){q[0]=J;e:for(var Ee=0,de=q.length,Ve=de>>>1;Ee<Ve;){var wn=2*(Ee+1)-1,Tn=q[wn],Sn=wn+1,An=q[Sn];if(0>i(Tn,J))Sn<de&&0>i(An,Tn)?(q[Ee]=An,q[Sn]=J,Ee=Sn):(q[Ee]=Tn,q[wn]=J,Ee=wn);else if(Sn<de&&0>i(An,J))q[Ee]=An,q[Sn]=J,Ee=Sn;else break e}}return Y}function i(q,Y){var J=q.sortIndex-Y.sortIndex;return J!==0?J:q.id-Y.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var u=[],c=[],d=1,p=null,m=3,E=!1,R=!1,D=!1,O=typeof setTimeout=="function"?setTimeout:null,A=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(q){for(var Y=t(c);Y!==null;){if(Y.callback===null)r(c);else if(Y.startTime<=q)r(c),Y.sortIndex=Y.expirationTime,e(u,Y);else break;Y=t(c)}}function x(q){if(D=!1,w(q),!R)if(t(u)!==null)R=!0,ho(F);else{var Y=t(c);Y!==null&&En(x,Y.startTime-q)}}function F(q,Y){R=!1,D&&(D=!1,A(y),y=-1),E=!0;var J=m;try{for(w(Y),p=t(u);p!==null&&(!(p.expirationTime>Y)||q&&!P());){var Ee=p.callback;if(typeof Ee=="function"){p.callback=null,m=p.priorityLevel;var de=Ee(p.expirationTime<=Y);Y=n.unstable_now(),typeof de=="function"?p.callback=de:p===t(u)&&r(u),w(Y)}else r(u);p=t(u)}if(p!==null)var Ve=!0;else{var wn=t(c);wn!==null&&En(x,wn.startTime-Y),Ve=!1}return Ve}finally{p=null,m=J,E=!1}}var M=!1,v=null,y=-1,I=5,T=-1;function P(){return!(n.unstable_now()-T<I)}function V(){if(v!==null){var q=n.unstable_now();T=q;var Y=!0;try{Y=v(!0,q)}finally{Y?S():(M=!1,v=null)}}else M=!1}var S;if(typeof _=="function")S=function(){_(V)};else if(typeof MessageChannel<"u"){var zt=new MessageChannel,Gr=zt.port2;zt.port1.onmessage=V,S=function(){Gr.postMessage(null)}}else S=function(){O(V,0)};function ho(q){v=q,M||(M=!0,S())}function En(q,Y){y=O(function(){q(n.unstable_now())},Y)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(q){q.callback=null},n.unstable_continueExecution=function(){R||E||(R=!0,ho(F))},n.unstable_forceFrameRate=function(q){0>q||125<q||(I=0<q?Math.floor(1e3/q):5)},n.unstable_getCurrentPriorityLevel=function(){return m},n.unstable_getFirstCallbackNode=function(){return t(u)},n.unstable_next=function(q){switch(m){case 1:case 2:case 3:var Y=3;break;default:Y=m}var J=m;m=Y;try{return q()}finally{m=J}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(q,Y){switch(q){case 1:case 2:case 3:case 4:case 5:break;default:q=3}var J=m;m=q;try{return Y()}finally{m=J}},n.unstable_scheduleCallback=function(q,Y,J){var Ee=n.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?Ee+J:Ee):J=Ee,q){case 1:var de=-1;break;case 2:de=250;break;case 5:de=1073741823;break;case 4:de=1e4;break;default:de=5e3}return de=J+de,q={id:d++,callback:Y,priorityLevel:q,startTime:J,expirationTime:de,sortIndex:-1},J>Ee?(q.sortIndex=J,e(c,q),t(u)===null&&q===t(c)&&(D?(A(y),y=-1):D=!0,En(x,J-Ee))):(q.sortIndex=de,e(u,q),R||E||(R=!0,ho(F))),q},n.unstable_shouldYield=P,n.unstable_wrapCallback=function(q){var Y=m;return function(){var J=m;m=Y;try{return q.apply(this,arguments)}finally{m=J}}}})(QI);GI.exports=QI;var pP=GI.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mP=KI,Mt=pP;function U(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var XI=new Set,Ea={};function Oi(n,e){Ss(n,e),Ss(n+"Capture",e)}function Ss(n,e){for(Ea[n]=e,n=0;n<e.length;n++)XI.add(e[n])}var Ln=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),$d=Object.prototype.hasOwnProperty,gP=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ky={},Vy={};function yP(n){return $d.call(Vy,n)?!0:$d.call(ky,n)?!1:gP.test(n)?Vy[n]=!0:(ky[n]=!0,!1)}function _P(n,e,t,r){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function vP(n,e,t,r){if(e===null||typeof e>"u"||_P(n,e,t,r))return!0;if(r)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function It(n,e,t,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Ze={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Ze[n]=new It(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Ze[e]=new It(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Ze[n]=new It(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Ze[n]=new It(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Ze[n]=new It(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Ze[n]=new It(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Ze[n]=new It(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Ze[n]=new It(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Ze[n]=new It(n,5,!1,n.toLowerCase(),null,!1,!1)});var Ip=/[\-:]([a-z])/g;function Ep(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(Ip,Ep);Ze[e]=new It(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(Ip,Ep);Ze[e]=new It(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(Ip,Ep);Ze[e]=new It(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Ze[n]=new It(n,1,!1,n.toLowerCase(),null,!1,!1)});Ze.xlinkHref=new It("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Ze[n]=new It(n,1,!1,n.toLowerCase(),null,!0,!0)});function wp(n,e,t,r){var i=Ze.hasOwnProperty(e)?Ze[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(vP(e,t,i,r)&&(t=null),r||i===null?yP(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):i.mustUseProperty?n[i.propertyName]=t===null?i.type===3?!1:"":t:(e=i.attributeName,r=i.attributeNamespace,t===null?n.removeAttribute(e):(i=i.type,t=i===3||i===4&&t===!0?"":""+t,r?n.setAttributeNS(r,e,t):n.setAttribute(e,t))))}var Kn=mP.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ul=Symbol.for("react.element"),ts=Symbol.for("react.portal"),ns=Symbol.for("react.fragment"),Tp=Symbol.for("react.strict_mode"),qd=Symbol.for("react.profiler"),YI=Symbol.for("react.provider"),JI=Symbol.for("react.context"),Sp=Symbol.for("react.forward_ref"),Wd=Symbol.for("react.suspense"),Kd=Symbol.for("react.suspense_list"),Ap=Symbol.for("react.memo"),or=Symbol.for("react.lazy"),ZI=Symbol.for("react.offscreen"),Dy=Symbol.iterator;function Po(n){return n===null||typeof n!="object"?null:(n=Dy&&n[Dy]||n["@@iterator"],typeof n=="function"?n:null)}var Ae=Object.assign,td;function Bo(n){if(td===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);td=e&&e[1]||""}return`
`+td+n}var nd=!1;function rd(n,e){if(!n||nd)return"";nd=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var r=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){r=c}n.call(e.prototype)}else{try{throw Error()}catch(c){r=c}n()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,a=s.length-1;1<=o&&0<=a&&i[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(i[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||i[o]!==s[a]){var u=`
`+i[o].replace(" at new "," at ");return n.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",n.displayName)),u}while(1<=o&&0<=a);break}}}finally{nd=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?Bo(n):""}function IP(n){switch(n.tag){case 5:return Bo(n.type);case 16:return Bo("Lazy");case 13:return Bo("Suspense");case 19:return Bo("SuspenseList");case 0:case 2:case 15:return n=rd(n.type,!1),n;case 11:return n=rd(n.type.render,!1),n;case 1:return n=rd(n.type,!0),n;default:return""}}function Hd(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case ns:return"Fragment";case ts:return"Portal";case qd:return"Profiler";case Tp:return"StrictMode";case Wd:return"Suspense";case Kd:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case JI:return(n.displayName||"Context")+".Consumer";case YI:return(n._context.displayName||"Context")+".Provider";case Sp:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Ap:return e=n.displayName||null,e!==null?e:Hd(n.type)||"Memo";case or:e=n._payload,n=n._init;try{return Hd(n(e))}catch{}}return null}function EP(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Hd(e);case 8:return e===Tp?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function br(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function eE(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function wP(n){var e=eE(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),r=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var i=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function Bl(n){n._valueTracker||(n._valueTracker=wP(n))}function tE(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),r="";return n&&(r=eE(n)?n.checked?"true":"false":n.value),n=r,n!==t?(e.setValue(n),!0):!1}function Fu(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Gd(n,e){var t=e.checked;return Ae({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function Ny(n,e){var t=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;t=br(e.value!=null?e.value:t),n._wrapperState={initialChecked:r,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function nE(n,e){e=e.checked,e!=null&&wp(n,"checked",e,!1)}function Qd(n,e){nE(n,e);var t=br(e.value),r=e.type;if(t!=null)r==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(r==="submit"||r==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?Xd(n,e.type,t):e.hasOwnProperty("defaultValue")&&Xd(n,e.type,br(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function xy(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function Xd(n,e,t){(e!=="number"||Fu(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var zo=Array.isArray;function fs(n,e,t,r){if(n=n.options,e){e={};for(var i=0;i<t.length;i++)e["$"+t[i]]=!0;for(t=0;t<n.length;t++)i=e.hasOwnProperty("$"+n[t].value),n[t].selected!==i&&(n[t].selected=i),i&&r&&(n[t].defaultSelected=!0)}else{for(t=""+br(t),e=null,i=0;i<n.length;i++){if(n[i].value===t){n[i].selected=!0,r&&(n[i].defaultSelected=!0);return}e!==null||n[i].disabled||(e=n[i])}e!==null&&(e.selected=!0)}}function Yd(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(U(91));return Ae({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function by(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(U(92));if(zo(t)){if(1<t.length)throw Error(U(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:br(t)}}function rE(n,e){var t=br(e.value),r=br(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),r!=null&&(n.defaultValue=""+r)}function Oy(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function iE(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Jd(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?iE(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var zl,sE=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,r,i){MSApp.execUnsafeLocalFunction(function(){return n(e,t,r,i)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(zl=zl||document.createElement("div"),zl.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=zl.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function wa(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var Jo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},TP=["Webkit","ms","Moz","O"];Object.keys(Jo).forEach(function(n){TP.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),Jo[e]=Jo[n]})});function oE(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||Jo.hasOwnProperty(n)&&Jo[n]?(""+e).trim():e+"px"}function aE(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var r=t.indexOf("--")===0,i=oE(t,e[t],r);t==="float"&&(t="cssFloat"),r?n.setProperty(t,i):n[t]=i}}var SP=Ae({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Zd(n,e){if(e){if(SP[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(U(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(U(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(U(61))}if(e.style!=null&&typeof e.style!="object")throw Error(U(62))}}function ef(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var tf=null;function Pp(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var nf=null,ps=null,ms=null;function Ly(n){if(n=rl(n)){if(typeof nf!="function")throw Error(U(280));var e=n.stateNode;e&&(e=Uc(e),nf(n.stateNode,n.type,e))}}function lE(n){ps?ms?ms.push(n):ms=[n]:ps=n}function uE(){if(ps){var n=ps,e=ms;if(ms=ps=null,Ly(n),e)for(n=0;n<e.length;n++)Ly(e[n])}}function cE(n,e){return n(e)}function hE(){}var id=!1;function dE(n,e,t){if(id)return n(e,t);id=!0;try{return cE(n,e,t)}finally{id=!1,(ps!==null||ms!==null)&&(hE(),uE())}}function Ta(n,e){var t=n.stateNode;if(t===null)return null;var r=Uc(t);if(r===null)return null;t=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(n=n.type,r=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!r;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(U(231,e,typeof t));return t}var rf=!1;if(Ln)try{var Ro={};Object.defineProperty(Ro,"passive",{get:function(){rf=!0}}),window.addEventListener("test",Ro,Ro),window.removeEventListener("test",Ro,Ro)}catch{rf=!1}function AP(n,e,t,r,i,s,o,a,u){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(d){this.onError(d)}}var Zo=!1,Uu=null,Bu=!1,sf=null,PP={onError:function(n){Zo=!0,Uu=n}};function RP(n,e,t,r,i,s,o,a,u){Zo=!1,Uu=null,AP.apply(PP,arguments)}function CP(n,e,t,r,i,s,o,a,u){if(RP.apply(this,arguments),Zo){if(Zo){var c=Uu;Zo=!1,Uu=null}else throw Error(U(198));Bu||(Bu=!0,sf=c)}}function Li(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function fE(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function My(n){if(Li(n)!==n)throw Error(U(188))}function kP(n){var e=n.alternate;if(!e){if(e=Li(n),e===null)throw Error(U(188));return e!==n?null:n}for(var t=n,r=e;;){var i=t.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){t=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===t)return My(i),n;if(s===r)return My(i),e;s=s.sibling}throw Error(U(188))}if(t.return!==r.return)t=i,r=s;else{for(var o=!1,a=i.child;a;){if(a===t){o=!0,t=i,r=s;break}if(a===r){o=!0,r=i,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,r=i;break}if(a===r){o=!0,r=s,t=i;break}a=a.sibling}if(!o)throw Error(U(189))}}if(t.alternate!==r)throw Error(U(190))}if(t.tag!==3)throw Error(U(188));return t.stateNode.current===t?n:e}function pE(n){return n=kP(n),n!==null?mE(n):null}function mE(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=mE(n);if(e!==null)return e;n=n.sibling}return null}var gE=Mt.unstable_scheduleCallback,Fy=Mt.unstable_cancelCallback,VP=Mt.unstable_shouldYield,DP=Mt.unstable_requestPaint,De=Mt.unstable_now,NP=Mt.unstable_getCurrentPriorityLevel,Rp=Mt.unstable_ImmediatePriority,yE=Mt.unstable_UserBlockingPriority,zu=Mt.unstable_NormalPriority,xP=Mt.unstable_LowPriority,_E=Mt.unstable_IdlePriority,Oc=null,pn=null;function bP(n){if(pn&&typeof pn.onCommitFiberRoot=="function")try{pn.onCommitFiberRoot(Oc,n,void 0,(n.current.flags&128)===128)}catch{}}var rn=Math.clz32?Math.clz32:MP,OP=Math.log,LP=Math.LN2;function MP(n){return n>>>=0,n===0?32:31-(OP(n)/LP|0)|0}var jl=64,$l=4194304;function jo(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function ju(n,e){var t=n.pendingLanes;if(t===0)return 0;var r=0,i=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~i;a!==0?r=jo(a):(s&=o,s!==0&&(r=jo(s)))}else o=t&~i,o!==0?r=jo(o):s!==0&&(r=jo(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=r;0<e;)t=31-rn(e),i=1<<t,r|=n[t],e&=~i;return r}function FP(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function UP(n,e){for(var t=n.suspendedLanes,r=n.pingedLanes,i=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-rn(s),a=1<<o,u=i[o];u===-1?(!(a&t)||a&r)&&(i[o]=FP(a,e)):u<=e&&(n.expiredLanes|=a),s&=~a}}function of(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function vE(){var n=jl;return jl<<=1,!(jl&4194240)&&(jl=64),n}function sd(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function tl(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-rn(e),n[e]=t}function BP(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var r=n.eventTimes;for(n=n.expirationTimes;0<t;){var i=31-rn(t),s=1<<i;e[i]=0,r[i]=-1,n[i]=-1,t&=~s}}function Cp(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var r=31-rn(t),i=1<<r;i&e|n[r]&e&&(n[r]|=e),t&=~i}}var ce=0;function IE(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var EE,kp,wE,TE,SE,af=!1,ql=[],vr=null,Ir=null,Er=null,Sa=new Map,Aa=new Map,lr=[],zP="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Uy(n,e){switch(n){case"focusin":case"focusout":vr=null;break;case"dragenter":case"dragleave":Ir=null;break;case"mouseover":case"mouseout":Er=null;break;case"pointerover":case"pointerout":Sa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Aa.delete(e.pointerId)}}function Co(n,e,t,r,i,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=rl(e),e!==null&&kp(e)),n):(n.eventSystemFlags|=r,e=n.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),n)}function jP(n,e,t,r,i){switch(e){case"focusin":return vr=Co(vr,n,e,t,r,i),!0;case"dragenter":return Ir=Co(Ir,n,e,t,r,i),!0;case"mouseover":return Er=Co(Er,n,e,t,r,i),!0;case"pointerover":var s=i.pointerId;return Sa.set(s,Co(Sa.get(s)||null,n,e,t,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Aa.set(s,Co(Aa.get(s)||null,n,e,t,r,i)),!0}return!1}function AE(n){var e=ui(n.target);if(e!==null){var t=Li(e);if(t!==null){if(e=t.tag,e===13){if(e=fE(t),e!==null){n.blockedOn=e,SE(n.priority,function(){wE(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function hu(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=lf(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var r=new t.constructor(t.type,t);tf=r,t.target.dispatchEvent(r),tf=null}else return e=rl(t),e!==null&&kp(e),n.blockedOn=t,!1;e.shift()}return!0}function By(n,e,t){hu(n)&&t.delete(e)}function $P(){af=!1,vr!==null&&hu(vr)&&(vr=null),Ir!==null&&hu(Ir)&&(Ir=null),Er!==null&&hu(Er)&&(Er=null),Sa.forEach(By),Aa.forEach(By)}function ko(n,e){n.blockedOn===e&&(n.blockedOn=null,af||(af=!0,Mt.unstable_scheduleCallback(Mt.unstable_NormalPriority,$P)))}function Pa(n){function e(i){return ko(i,n)}if(0<ql.length){ko(ql[0],n);for(var t=1;t<ql.length;t++){var r=ql[t];r.blockedOn===n&&(r.blockedOn=null)}}for(vr!==null&&ko(vr,n),Ir!==null&&ko(Ir,n),Er!==null&&ko(Er,n),Sa.forEach(e),Aa.forEach(e),t=0;t<lr.length;t++)r=lr[t],r.blockedOn===n&&(r.blockedOn=null);for(;0<lr.length&&(t=lr[0],t.blockedOn===null);)AE(t),t.blockedOn===null&&lr.shift()}var gs=Kn.ReactCurrentBatchConfig,$u=!0;function qP(n,e,t,r){var i=ce,s=gs.transition;gs.transition=null;try{ce=1,Vp(n,e,t,r)}finally{ce=i,gs.transition=s}}function WP(n,e,t,r){var i=ce,s=gs.transition;gs.transition=null;try{ce=4,Vp(n,e,t,r)}finally{ce=i,gs.transition=s}}function Vp(n,e,t,r){if($u){var i=lf(n,e,t,r);if(i===null)md(n,e,r,qu,t),Uy(n,r);else if(jP(i,n,e,t,r))r.stopPropagation();else if(Uy(n,r),e&4&&-1<zP.indexOf(n)){for(;i!==null;){var s=rl(i);if(s!==null&&EE(s),s=lf(n,e,t,r),s===null&&md(n,e,r,qu,t),s===i)break;i=s}i!==null&&r.stopPropagation()}else md(n,e,r,null,t)}}var qu=null;function lf(n,e,t,r){if(qu=null,n=Pp(r),n=ui(n),n!==null)if(e=Li(n),e===null)n=null;else if(t=e.tag,t===13){if(n=fE(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return qu=n,null}function PE(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(NP()){case Rp:return 1;case yE:return 4;case zu:case xP:return 16;case _E:return 536870912;default:return 16}default:return 16}}var mr=null,Dp=null,du=null;function RE(){if(du)return du;var n,e=Dp,t=e.length,r,i="value"in mr?mr.value:mr.textContent,s=i.length;for(n=0;n<t&&e[n]===i[n];n++);var o=t-n;for(r=1;r<=o&&e[t-r]===i[s-r];r++);return du=i.slice(n,1<r?1-r:void 0)}function fu(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function Wl(){return!0}function zy(){return!1}function Bt(n){function e(t,r,i,s,o){this._reactName=t,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Wl:zy,this.isPropagationStopped=zy,this}return Ae(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=Wl)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=Wl)},persist:function(){},isPersistent:Wl}),e}var Js={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Np=Bt(Js),nl=Ae({},Js,{view:0,detail:0}),KP=Bt(nl),od,ad,Vo,Lc=Ae({},nl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:xp,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Vo&&(Vo&&n.type==="mousemove"?(od=n.screenX-Vo.screenX,ad=n.screenY-Vo.screenY):ad=od=0,Vo=n),od)},movementY:function(n){return"movementY"in n?n.movementY:ad}}),jy=Bt(Lc),HP=Ae({},Lc,{dataTransfer:0}),GP=Bt(HP),QP=Ae({},nl,{relatedTarget:0}),ld=Bt(QP),XP=Ae({},Js,{animationName:0,elapsedTime:0,pseudoElement:0}),YP=Bt(XP),JP=Ae({},Js,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),ZP=Bt(JP),eR=Ae({},Js,{data:0}),$y=Bt(eR),tR={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},nR={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},rR={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function iR(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=rR[n])?!!e[n]:!1}function xp(){return iR}var sR=Ae({},nl,{key:function(n){if(n.key){var e=tR[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=fu(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?nR[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:xp,charCode:function(n){return n.type==="keypress"?fu(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?fu(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),oR=Bt(sR),aR=Ae({},Lc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),qy=Bt(aR),lR=Ae({},nl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:xp}),uR=Bt(lR),cR=Ae({},Js,{propertyName:0,elapsedTime:0,pseudoElement:0}),hR=Bt(cR),dR=Ae({},Lc,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),fR=Bt(dR),pR=[9,13,27,32],bp=Ln&&"CompositionEvent"in window,ea=null;Ln&&"documentMode"in document&&(ea=document.documentMode);var mR=Ln&&"TextEvent"in window&&!ea,CE=Ln&&(!bp||ea&&8<ea&&11>=ea),Wy=" ",Ky=!1;function kE(n,e){switch(n){case"keyup":return pR.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function VE(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var rs=!1;function gR(n,e){switch(n){case"compositionend":return VE(e);case"keypress":return e.which!==32?null:(Ky=!0,Wy);case"textInput":return n=e.data,n===Wy&&Ky?null:n;default:return null}}function yR(n,e){if(rs)return n==="compositionend"||!bp&&kE(n,e)?(n=RE(),du=Dp=mr=null,rs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return CE&&e.locale!=="ko"?null:e.data;default:return null}}var _R={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Hy(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!_R[n.type]:e==="textarea"}function DE(n,e,t,r){lE(r),e=Wu(e,"onChange"),0<e.length&&(t=new Np("onChange","change",null,t,r),n.push({event:t,listeners:e}))}var ta=null,Ra=null;function vR(n){jE(n,0)}function Mc(n){var e=os(n);if(tE(e))return n}function IR(n,e){if(n==="change")return e}var NE=!1;if(Ln){var ud;if(Ln){var cd="oninput"in document;if(!cd){var Gy=document.createElement("div");Gy.setAttribute("oninput","return;"),cd=typeof Gy.oninput=="function"}ud=cd}else ud=!1;NE=ud&&(!document.documentMode||9<document.documentMode)}function Qy(){ta&&(ta.detachEvent("onpropertychange",xE),Ra=ta=null)}function xE(n){if(n.propertyName==="value"&&Mc(Ra)){var e=[];DE(e,Ra,n,Pp(n)),dE(vR,e)}}function ER(n,e,t){n==="focusin"?(Qy(),ta=e,Ra=t,ta.attachEvent("onpropertychange",xE)):n==="focusout"&&Qy()}function wR(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Mc(Ra)}function TR(n,e){if(n==="click")return Mc(e)}function SR(n,e){if(n==="input"||n==="change")return Mc(e)}function AR(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var on=typeof Object.is=="function"?Object.is:AR;function Ca(n,e){if(on(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),r=Object.keys(e);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var i=t[r];if(!$d.call(e,i)||!on(n[i],e[i]))return!1}return!0}function Xy(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Yy(n,e){var t=Xy(n);n=0;for(var r;t;){if(t.nodeType===3){if(r=n+t.textContent.length,n<=e&&r>=e)return{node:t,offset:e-n};n=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Xy(t)}}function bE(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?bE(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function OE(){for(var n=window,e=Fu();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=Fu(n.document)}return e}function Op(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function PR(n){var e=OE(),t=n.focusedElem,r=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&bE(t.ownerDocument.documentElement,t)){if(r!==null&&Op(t)){if(e=r.start,n=r.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var i=t.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!n.extend&&s>r&&(i=r,r=s,s=i),i=Yy(t,s);var o=Yy(t,r);i&&o&&(n.rangeCount!==1||n.anchorNode!==i.node||n.anchorOffset!==i.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),n.removeAllRanges(),s>r?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var RR=Ln&&"documentMode"in document&&11>=document.documentMode,is=null,uf=null,na=null,cf=!1;function Jy(n,e,t){var r=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;cf||is==null||is!==Fu(r)||(r=is,"selectionStart"in r&&Op(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),na&&Ca(na,r)||(na=r,r=Wu(uf,"onSelect"),0<r.length&&(e=new Np("onSelect","select",null,e,t),n.push({event:e,listeners:r}),e.target=is)))}function Kl(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var ss={animationend:Kl("Animation","AnimationEnd"),animationiteration:Kl("Animation","AnimationIteration"),animationstart:Kl("Animation","AnimationStart"),transitionend:Kl("Transition","TransitionEnd")},hd={},LE={};Ln&&(LE=document.createElement("div").style,"AnimationEvent"in window||(delete ss.animationend.animation,delete ss.animationiteration.animation,delete ss.animationstart.animation),"TransitionEvent"in window||delete ss.transitionend.transition);function Fc(n){if(hd[n])return hd[n];if(!ss[n])return n;var e=ss[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in LE)return hd[n]=e[t];return n}var ME=Fc("animationend"),FE=Fc("animationiteration"),UE=Fc("animationstart"),BE=Fc("transitionend"),zE=new Map,Zy="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function zr(n,e){zE.set(n,e),Oi(e,[n])}for(var dd=0;dd<Zy.length;dd++){var fd=Zy[dd],CR=fd.toLowerCase(),kR=fd[0].toUpperCase()+fd.slice(1);zr(CR,"on"+kR)}zr(ME,"onAnimationEnd");zr(FE,"onAnimationIteration");zr(UE,"onAnimationStart");zr("dblclick","onDoubleClick");zr("focusin","onFocus");zr("focusout","onBlur");zr(BE,"onTransitionEnd");Ss("onMouseEnter",["mouseout","mouseover"]);Ss("onMouseLeave",["mouseout","mouseover"]);Ss("onPointerEnter",["pointerout","pointerover"]);Ss("onPointerLeave",["pointerout","pointerover"]);Oi("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Oi("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Oi("onBeforeInput",["compositionend","keypress","textInput","paste"]);Oi("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Oi("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Oi("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var $o="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),VR=new Set("cancel close invalid load scroll toggle".split(" ").concat($o));function e_(n,e,t){var r=n.type||"unknown-event";n.currentTarget=t,CP(r,e,void 0,n),n.currentTarget=null}function jE(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var r=n[t],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var a=r[o],u=a.instance,c=a.currentTarget;if(a=a.listener,u!==s&&i.isPropagationStopped())break e;e_(i,a,c),s=u}else for(o=0;o<r.length;o++){if(a=r[o],u=a.instance,c=a.currentTarget,a=a.listener,u!==s&&i.isPropagationStopped())break e;e_(i,a,c),s=u}}}if(Bu)throw n=sf,Bu=!1,sf=null,n}function ye(n,e){var t=e[mf];t===void 0&&(t=e[mf]=new Set);var r=n+"__bubble";t.has(r)||($E(e,n,2,!1),t.add(r))}function pd(n,e,t){var r=0;e&&(r|=4),$E(t,n,r,e)}var Hl="_reactListening"+Math.random().toString(36).slice(2);function ka(n){if(!n[Hl]){n[Hl]=!0,XI.forEach(function(t){t!=="selectionchange"&&(VR.has(t)||pd(t,!1,n),pd(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[Hl]||(e[Hl]=!0,pd("selectionchange",!1,e))}}function $E(n,e,t,r){switch(PE(e)){case 1:var i=qP;break;case 4:i=WP;break;default:i=Vp}t=i.bind(null,e,t,n),i=void 0,!rf||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?n.addEventListener(e,t,{capture:!0,passive:i}):n.addEventListener(e,t,!0):i!==void 0?n.addEventListener(e,t,{passive:i}):n.addEventListener(e,t,!1)}function md(n,e,t,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;a!==null;){if(o=ui(a),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}a=a.parentNode}}r=r.return}dE(function(){var c=s,d=Pp(t),p=[];e:{var m=zE.get(n);if(m!==void 0){var E=Np,R=n;switch(n){case"keypress":if(fu(t)===0)break e;case"keydown":case"keyup":E=oR;break;case"focusin":R="focus",E=ld;break;case"focusout":R="blur",E=ld;break;case"beforeblur":case"afterblur":E=ld;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":E=jy;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":E=GP;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":E=uR;break;case ME:case FE:case UE:E=YP;break;case BE:E=hR;break;case"scroll":E=KP;break;case"wheel":E=fR;break;case"copy":case"cut":case"paste":E=ZP;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":E=qy}var D=(e&4)!==0,O=!D&&n==="scroll",A=D?m!==null?m+"Capture":null:m;D=[];for(var _=c,w;_!==null;){w=_;var x=w.stateNode;if(w.tag===5&&x!==null&&(w=x,A!==null&&(x=Ta(_,A),x!=null&&D.push(Va(_,x,w)))),O)break;_=_.return}0<D.length&&(m=new E(m,R,null,t,d),p.push({event:m,listeners:D}))}}if(!(e&7)){e:{if(m=n==="mouseover"||n==="pointerover",E=n==="mouseout"||n==="pointerout",m&&t!==tf&&(R=t.relatedTarget||t.fromElement)&&(ui(R)||R[Mn]))break e;if((E||m)&&(m=d.window===d?d:(m=d.ownerDocument)?m.defaultView||m.parentWindow:window,E?(R=t.relatedTarget||t.toElement,E=c,R=R?ui(R):null,R!==null&&(O=Li(R),R!==O||R.tag!==5&&R.tag!==6)&&(R=null)):(E=null,R=c),E!==R)){if(D=jy,x="onMouseLeave",A="onMouseEnter",_="mouse",(n==="pointerout"||n==="pointerover")&&(D=qy,x="onPointerLeave",A="onPointerEnter",_="pointer"),O=E==null?m:os(E),w=R==null?m:os(R),m=new D(x,_+"leave",E,t,d),m.target=O,m.relatedTarget=w,x=null,ui(d)===c&&(D=new D(A,_+"enter",R,t,d),D.target=w,D.relatedTarget=O,x=D),O=x,E&&R)t:{for(D=E,A=R,_=0,w=D;w;w=$i(w))_++;for(w=0,x=A;x;x=$i(x))w++;for(;0<_-w;)D=$i(D),_--;for(;0<w-_;)A=$i(A),w--;for(;_--;){if(D===A||A!==null&&D===A.alternate)break t;D=$i(D),A=$i(A)}D=null}else D=null;E!==null&&t_(p,m,E,D,!1),R!==null&&O!==null&&t_(p,O,R,D,!0)}}e:{if(m=c?os(c):window,E=m.nodeName&&m.nodeName.toLowerCase(),E==="select"||E==="input"&&m.type==="file")var F=IR;else if(Hy(m))if(NE)F=SR;else{F=wR;var M=ER}else(E=m.nodeName)&&E.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(F=TR);if(F&&(F=F(n,c))){DE(p,F,t,d);break e}M&&M(n,m,c),n==="focusout"&&(M=m._wrapperState)&&M.controlled&&m.type==="number"&&Xd(m,"number",m.value)}switch(M=c?os(c):window,n){case"focusin":(Hy(M)||M.contentEditable==="true")&&(is=M,uf=c,na=null);break;case"focusout":na=uf=is=null;break;case"mousedown":cf=!0;break;case"contextmenu":case"mouseup":case"dragend":cf=!1,Jy(p,t,d);break;case"selectionchange":if(RR)break;case"keydown":case"keyup":Jy(p,t,d)}var v;if(bp)e:{switch(n){case"compositionstart":var y="onCompositionStart";break e;case"compositionend":y="onCompositionEnd";break e;case"compositionupdate":y="onCompositionUpdate";break e}y=void 0}else rs?kE(n,t)&&(y="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(y="onCompositionStart");y&&(CE&&t.locale!=="ko"&&(rs||y!=="onCompositionStart"?y==="onCompositionEnd"&&rs&&(v=RE()):(mr=d,Dp="value"in mr?mr.value:mr.textContent,rs=!0)),M=Wu(c,y),0<M.length&&(y=new $y(y,n,null,t,d),p.push({event:y,listeners:M}),v?y.data=v:(v=VE(t),v!==null&&(y.data=v)))),(v=mR?gR(n,t):yR(n,t))&&(c=Wu(c,"onBeforeInput"),0<c.length&&(d=new $y("onBeforeInput","beforeinput",null,t,d),p.push({event:d,listeners:c}),d.data=v))}jE(p,e)})}function Va(n,e,t){return{instance:n,listener:e,currentTarget:t}}function Wu(n,e){for(var t=e+"Capture",r=[];n!==null;){var i=n,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Ta(n,t),s!=null&&r.unshift(Va(n,s,i)),s=Ta(n,e),s!=null&&r.push(Va(n,s,i))),n=n.return}return r}function $i(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function t_(n,e,t,r,i){for(var s=e._reactName,o=[];t!==null&&t!==r;){var a=t,u=a.alternate,c=a.stateNode;if(u!==null&&u===r)break;a.tag===5&&c!==null&&(a=c,i?(u=Ta(t,s),u!=null&&o.unshift(Va(t,u,a))):i||(u=Ta(t,s),u!=null&&o.push(Va(t,u,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var DR=/\r\n?/g,NR=/\u0000|\uFFFD/g;function n_(n){return(typeof n=="string"?n:""+n).replace(DR,`
`).replace(NR,"")}function Gl(n,e,t){if(e=n_(e),n_(n)!==e&&t)throw Error(U(425))}function Ku(){}var hf=null,df=null;function ff(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var pf=typeof setTimeout=="function"?setTimeout:void 0,xR=typeof clearTimeout=="function"?clearTimeout:void 0,r_=typeof Promise=="function"?Promise:void 0,bR=typeof queueMicrotask=="function"?queueMicrotask:typeof r_<"u"?function(n){return r_.resolve(null).then(n).catch(OR)}:pf;function OR(n){setTimeout(function(){throw n})}function gd(n,e){var t=e,r=0;do{var i=t.nextSibling;if(n.removeChild(t),i&&i.nodeType===8)if(t=i.data,t==="/$"){if(r===0){n.removeChild(i),Pa(e);return}r--}else t!=="$"&&t!=="$?"&&t!=="$!"||r++;t=i}while(t);Pa(e)}function wr(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function i_(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Zs=Math.random().toString(36).slice(2),hn="__reactFiber$"+Zs,Da="__reactProps$"+Zs,Mn="__reactContainer$"+Zs,mf="__reactEvents$"+Zs,LR="__reactListeners$"+Zs,MR="__reactHandles$"+Zs;function ui(n){var e=n[hn];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Mn]||t[hn]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=i_(n);n!==null;){if(t=n[hn])return t;n=i_(n)}return e}n=t,t=n.parentNode}return null}function rl(n){return n=n[hn]||n[Mn],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function os(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(U(33))}function Uc(n){return n[Da]||null}var gf=[],as=-1;function jr(n){return{current:n}}function _e(n){0>as||(n.current=gf[as],gf[as]=null,as--)}function pe(n,e){as++,gf[as]=n.current,n.current=e}var Or={},dt=jr(Or),At=jr(!1),Ii=Or;function As(n,e){var t=n.type.contextTypes;if(!t)return Or;var r=n.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in t)i[s]=e[s];return r&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=i),i}function Pt(n){return n=n.childContextTypes,n!=null}function Hu(){_e(At),_e(dt)}function s_(n,e,t){if(dt.current!==Or)throw Error(U(168));pe(dt,e),pe(At,t)}function qE(n,e,t){var r=n.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return t;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(U(108,EP(n)||"Unknown",i));return Ae({},t,r)}function Gu(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Or,Ii=dt.current,pe(dt,n),pe(At,At.current),!0}function o_(n,e,t){var r=n.stateNode;if(!r)throw Error(U(169));t?(n=qE(n,e,Ii),r.__reactInternalMemoizedMergedChildContext=n,_e(At),_e(dt),pe(dt,n)):_e(At),pe(At,t)}var kn=null,Bc=!1,yd=!1;function WE(n){kn===null?kn=[n]:kn.push(n)}function FR(n){Bc=!0,WE(n)}function $r(){if(!yd&&kn!==null){yd=!0;var n=0,e=ce;try{var t=kn;for(ce=1;n<t.length;n++){var r=t[n];do r=r(!0);while(r!==null)}kn=null,Bc=!1}catch(i){throw kn!==null&&(kn=kn.slice(n+1)),gE(Rp,$r),i}finally{ce=e,yd=!1}}return null}var ls=[],us=0,Qu=null,Xu=0,jt=[],$t=0,Ei=null,Vn=1,Dn="";function ei(n,e){ls[us++]=Xu,ls[us++]=Qu,Qu=n,Xu=e}function KE(n,e,t){jt[$t++]=Vn,jt[$t++]=Dn,jt[$t++]=Ei,Ei=n;var r=Vn;n=Dn;var i=32-rn(r)-1;r&=~(1<<i),t+=1;var s=32-rn(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Vn=1<<32-rn(e)+i|t<<i|r,Dn=s+n}else Vn=1<<s|t<<i|r,Dn=n}function Lp(n){n.return!==null&&(ei(n,1),KE(n,1,0))}function Mp(n){for(;n===Qu;)Qu=ls[--us],ls[us]=null,Xu=ls[--us],ls[us]=null;for(;n===Ei;)Ei=jt[--$t],jt[$t]=null,Dn=jt[--$t],jt[$t]=null,Vn=jt[--$t],jt[$t]=null}var bt=null,Nt=null,Ie=!1,tn=null;function HE(n,e){var t=Wt(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function a_(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,bt=n,Nt=wr(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,bt=n,Nt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Ei!==null?{id:Vn,overflow:Dn}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Wt(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,bt=n,Nt=null,!0):!1;default:return!1}}function yf(n){return(n.mode&1)!==0&&(n.flags&128)===0}function _f(n){if(Ie){var e=Nt;if(e){var t=e;if(!a_(n,e)){if(yf(n))throw Error(U(418));e=wr(t.nextSibling);var r=bt;e&&a_(n,e)?HE(r,t):(n.flags=n.flags&-4097|2,Ie=!1,bt=n)}}else{if(yf(n))throw Error(U(418));n.flags=n.flags&-4097|2,Ie=!1,bt=n}}}function l_(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;bt=n}function Ql(n){if(n!==bt)return!1;if(!Ie)return l_(n),Ie=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!ff(n.type,n.memoizedProps)),e&&(e=Nt)){if(yf(n))throw GE(),Error(U(418));for(;e;)HE(n,e),e=wr(e.nextSibling)}if(l_(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(U(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){Nt=wr(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}Nt=null}}else Nt=bt?wr(n.stateNode.nextSibling):null;return!0}function GE(){for(var n=Nt;n;)n=wr(n.nextSibling)}function Ps(){Nt=bt=null,Ie=!1}function Fp(n){tn===null?tn=[n]:tn.push(n)}var UR=Kn.ReactCurrentBatchConfig;function Do(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(U(309));var r=t.stateNode}if(!r)throw Error(U(147,n));var i=r,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=i.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(U(284));if(!t._owner)throw Error(U(290,n))}return n}function Xl(n,e){throw n=Object.prototype.toString.call(e),Error(U(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function u_(n){var e=n._init;return e(n._payload)}function QE(n){function e(A,_){if(n){var w=A.deletions;w===null?(A.deletions=[_],A.flags|=16):w.push(_)}}function t(A,_){if(!n)return null;for(;_!==null;)e(A,_),_=_.sibling;return null}function r(A,_){for(A=new Map;_!==null;)_.key!==null?A.set(_.key,_):A.set(_.index,_),_=_.sibling;return A}function i(A,_){return A=Pr(A,_),A.index=0,A.sibling=null,A}function s(A,_,w){return A.index=w,n?(w=A.alternate,w!==null?(w=w.index,w<_?(A.flags|=2,_):w):(A.flags|=2,_)):(A.flags|=1048576,_)}function o(A){return n&&A.alternate===null&&(A.flags|=2),A}function a(A,_,w,x){return _===null||_.tag!==6?(_=Sd(w,A.mode,x),_.return=A,_):(_=i(_,w),_.return=A,_)}function u(A,_,w,x){var F=w.type;return F===ns?d(A,_,w.props.children,x,w.key):_!==null&&(_.elementType===F||typeof F=="object"&&F!==null&&F.$$typeof===or&&u_(F)===_.type)?(x=i(_,w.props),x.ref=Do(A,_,w),x.return=A,x):(x=Iu(w.type,w.key,w.props,null,A.mode,x),x.ref=Do(A,_,w),x.return=A,x)}function c(A,_,w,x){return _===null||_.tag!==4||_.stateNode.containerInfo!==w.containerInfo||_.stateNode.implementation!==w.implementation?(_=Ad(w,A.mode,x),_.return=A,_):(_=i(_,w.children||[]),_.return=A,_)}function d(A,_,w,x,F){return _===null||_.tag!==7?(_=pi(w,A.mode,x,F),_.return=A,_):(_=i(_,w),_.return=A,_)}function p(A,_,w){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Sd(""+_,A.mode,w),_.return=A,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Ul:return w=Iu(_.type,_.key,_.props,null,A.mode,w),w.ref=Do(A,null,_),w.return=A,w;case ts:return _=Ad(_,A.mode,w),_.return=A,_;case or:var x=_._init;return p(A,x(_._payload),w)}if(zo(_)||Po(_))return _=pi(_,A.mode,w,null),_.return=A,_;Xl(A,_)}return null}function m(A,_,w,x){var F=_!==null?_.key:null;if(typeof w=="string"&&w!==""||typeof w=="number")return F!==null?null:a(A,_,""+w,x);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Ul:return w.key===F?u(A,_,w,x):null;case ts:return w.key===F?c(A,_,w,x):null;case or:return F=w._init,m(A,_,F(w._payload),x)}if(zo(w)||Po(w))return F!==null?null:d(A,_,w,x,null);Xl(A,w)}return null}function E(A,_,w,x,F){if(typeof x=="string"&&x!==""||typeof x=="number")return A=A.get(w)||null,a(_,A,""+x,F);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case Ul:return A=A.get(x.key===null?w:x.key)||null,u(_,A,x,F);case ts:return A=A.get(x.key===null?w:x.key)||null,c(_,A,x,F);case or:var M=x._init;return E(A,_,w,M(x._payload),F)}if(zo(x)||Po(x))return A=A.get(w)||null,d(_,A,x,F,null);Xl(_,x)}return null}function R(A,_,w,x){for(var F=null,M=null,v=_,y=_=0,I=null;v!==null&&y<w.length;y++){v.index>y?(I=v,v=null):I=v.sibling;var T=m(A,v,w[y],x);if(T===null){v===null&&(v=I);break}n&&v&&T.alternate===null&&e(A,v),_=s(T,_,y),M===null?F=T:M.sibling=T,M=T,v=I}if(y===w.length)return t(A,v),Ie&&ei(A,y),F;if(v===null){for(;y<w.length;y++)v=p(A,w[y],x),v!==null&&(_=s(v,_,y),M===null?F=v:M.sibling=v,M=v);return Ie&&ei(A,y),F}for(v=r(A,v);y<w.length;y++)I=E(v,A,y,w[y],x),I!==null&&(n&&I.alternate!==null&&v.delete(I.key===null?y:I.key),_=s(I,_,y),M===null?F=I:M.sibling=I,M=I);return n&&v.forEach(function(P){return e(A,P)}),Ie&&ei(A,y),F}function D(A,_,w,x){var F=Po(w);if(typeof F!="function")throw Error(U(150));if(w=F.call(w),w==null)throw Error(U(151));for(var M=F=null,v=_,y=_=0,I=null,T=w.next();v!==null&&!T.done;y++,T=w.next()){v.index>y?(I=v,v=null):I=v.sibling;var P=m(A,v,T.value,x);if(P===null){v===null&&(v=I);break}n&&v&&P.alternate===null&&e(A,v),_=s(P,_,y),M===null?F=P:M.sibling=P,M=P,v=I}if(T.done)return t(A,v),Ie&&ei(A,y),F;if(v===null){for(;!T.done;y++,T=w.next())T=p(A,T.value,x),T!==null&&(_=s(T,_,y),M===null?F=T:M.sibling=T,M=T);return Ie&&ei(A,y),F}for(v=r(A,v);!T.done;y++,T=w.next())T=E(v,A,y,T.value,x),T!==null&&(n&&T.alternate!==null&&v.delete(T.key===null?y:T.key),_=s(T,_,y),M===null?F=T:M.sibling=T,M=T);return n&&v.forEach(function(V){return e(A,V)}),Ie&&ei(A,y),F}function O(A,_,w,x){if(typeof w=="object"&&w!==null&&w.type===ns&&w.key===null&&(w=w.props.children),typeof w=="object"&&w!==null){switch(w.$$typeof){case Ul:e:{for(var F=w.key,M=_;M!==null;){if(M.key===F){if(F=w.type,F===ns){if(M.tag===7){t(A,M.sibling),_=i(M,w.props.children),_.return=A,A=_;break e}}else if(M.elementType===F||typeof F=="object"&&F!==null&&F.$$typeof===or&&u_(F)===M.type){t(A,M.sibling),_=i(M,w.props),_.ref=Do(A,M,w),_.return=A,A=_;break e}t(A,M);break}else e(A,M);M=M.sibling}w.type===ns?(_=pi(w.props.children,A.mode,x,w.key),_.return=A,A=_):(x=Iu(w.type,w.key,w.props,null,A.mode,x),x.ref=Do(A,_,w),x.return=A,A=x)}return o(A);case ts:e:{for(M=w.key;_!==null;){if(_.key===M)if(_.tag===4&&_.stateNode.containerInfo===w.containerInfo&&_.stateNode.implementation===w.implementation){t(A,_.sibling),_=i(_,w.children||[]),_.return=A,A=_;break e}else{t(A,_);break}else e(A,_);_=_.sibling}_=Ad(w,A.mode,x),_.return=A,A=_}return o(A);case or:return M=w._init,O(A,_,M(w._payload),x)}if(zo(w))return R(A,_,w,x);if(Po(w))return D(A,_,w,x);Xl(A,w)}return typeof w=="string"&&w!==""||typeof w=="number"?(w=""+w,_!==null&&_.tag===6?(t(A,_.sibling),_=i(_,w),_.return=A,A=_):(t(A,_),_=Sd(w,A.mode,x),_.return=A,A=_),o(A)):t(A,_)}return O}var Rs=QE(!0),XE=QE(!1),Yu=jr(null),Ju=null,cs=null,Up=null;function Bp(){Up=cs=Ju=null}function zp(n){var e=Yu.current;_e(Yu),n._currentValue=e}function vf(n,e,t){for(;n!==null;){var r=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),n===t)break;n=n.return}}function ys(n,e){Ju=n,Up=cs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(wt=!0),n.firstContext=null)}function Ht(n){var e=n._currentValue;if(Up!==n)if(n={context:n,memoizedValue:e,next:null},cs===null){if(Ju===null)throw Error(U(308));cs=n,Ju.dependencies={lanes:0,firstContext:n}}else cs=cs.next=n;return e}var ci=null;function jp(n){ci===null?ci=[n]:ci.push(n)}function YE(n,e,t,r){var i=e.interleaved;return i===null?(t.next=t,jp(e)):(t.next=i.next,i.next=t),e.interleaved=t,Fn(n,r)}function Fn(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var ar=!1;function $p(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function JE(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function On(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function Tr(n,e,t){var r=n.updateQueue;if(r===null)return null;if(r=r.shared,se&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,Fn(n,t)}return i=r.interleaved,i===null?(e.next=e,jp(r)):(e.next=i.next,i.next=e),r.interleaved=e,Fn(n,t)}function pu(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var r=e.lanes;r&=n.pendingLanes,t|=r,e.lanes=t,Cp(n,t)}}function c_(n,e){var t=n.updateQueue,r=n.alternate;if(r!==null&&(r=r.updateQueue,t===r)){var i=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?i=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?i=s=e:s=s.next=e}else i=s=e;t={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Zu(n,e,t,r){var i=n.updateQueue;ar=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var u=a,c=u.next;u.next=null,o===null?s=c:o.next=c,o=u;var d=n.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=c:a.next=c,d.lastBaseUpdate=u))}if(s!==null){var p=i.baseState;o=0,d=c=u=null,a=s;do{var m=a.lane,E=a.eventTime;if((r&m)===m){d!==null&&(d=d.next={eventTime:E,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var R=n,D=a;switch(m=e,E=t,D.tag){case 1:if(R=D.payload,typeof R=="function"){p=R.call(E,p,m);break e}p=R;break e;case 3:R.flags=R.flags&-65537|128;case 0:if(R=D.payload,m=typeof R=="function"?R.call(E,p,m):R,m==null)break e;p=Ae({},p,m);break e;case 2:ar=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,m=i.effects,m===null?i.effects=[a]:m.push(a))}else E={eventTime:E,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(c=d=E,u=p):d=d.next=E,o|=m;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;m=a,a=m.next,m.next=null,i.lastBaseUpdate=m,i.shared.pending=null}}while(!0);if(d===null&&(u=p),i.baseState=u,i.firstBaseUpdate=c,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);Ti|=o,n.lanes=o,n.memoizedState=p}}function h_(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var r=n[e],i=r.callback;if(i!==null){if(r.callback=null,r=t,typeof i!="function")throw Error(U(191,i));i.call(r)}}}var il={},mn=jr(il),Na=jr(il),xa=jr(il);function hi(n){if(n===il)throw Error(U(174));return n}function qp(n,e){switch(pe(xa,e),pe(Na,n),pe(mn,il),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Jd(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=Jd(e,n)}_e(mn),pe(mn,e)}function Cs(){_e(mn),_e(Na),_e(xa)}function ZE(n){hi(xa.current);var e=hi(mn.current),t=Jd(e,n.type);e!==t&&(pe(Na,n),pe(mn,t))}function Wp(n){Na.current===n&&(_e(mn),_e(Na))}var we=jr(0);function ec(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var _d=[];function Kp(){for(var n=0;n<_d.length;n++)_d[n]._workInProgressVersionPrimary=null;_d.length=0}var mu=Kn.ReactCurrentDispatcher,vd=Kn.ReactCurrentBatchConfig,wi=0,Se=null,Fe=null,Ke=null,tc=!1,ra=!1,ba=0,BR=0;function rt(){throw Error(U(321))}function Hp(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!on(n[t],e[t]))return!1;return!0}function Gp(n,e,t,r,i,s){if(wi=s,Se=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,mu.current=n===null||n.memoizedState===null?qR:WR,n=t(r,i),ra){s=0;do{if(ra=!1,ba=0,25<=s)throw Error(U(301));s+=1,Ke=Fe=null,e.updateQueue=null,mu.current=KR,n=t(r,i)}while(ra)}if(mu.current=nc,e=Fe!==null&&Fe.next!==null,wi=0,Ke=Fe=Se=null,tc=!1,e)throw Error(U(300));return n}function Qp(){var n=ba!==0;return ba=0,n}function ln(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ke===null?Se.memoizedState=Ke=n:Ke=Ke.next=n,Ke}function Gt(){if(Fe===null){var n=Se.alternate;n=n!==null?n.memoizedState:null}else n=Fe.next;var e=Ke===null?Se.memoizedState:Ke.next;if(e!==null)Ke=e,Fe=n;else{if(n===null)throw Error(U(310));Fe=n,n={memoizedState:Fe.memoizedState,baseState:Fe.baseState,baseQueue:Fe.baseQueue,queue:Fe.queue,next:null},Ke===null?Se.memoizedState=Ke=n:Ke=Ke.next=n}return Ke}function Oa(n,e){return typeof e=="function"?e(n):e}function Id(n){var e=Gt(),t=e.queue;if(t===null)throw Error(U(311));t.lastRenderedReducer=n;var r=Fe,i=r.baseQueue,s=t.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,t.pending=null}if(i!==null){s=i.next,r=r.baseState;var a=o=null,u=null,c=s;do{var d=c.lane;if((wi&d)===d)u!==null&&(u=u.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:n(r,c.action);else{var p={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};u===null?(a=u=p,o=r):u=u.next=p,Se.lanes|=d,Ti|=d}c=c.next}while(c!==null&&c!==s);u===null?o=r:u.next=a,on(r,e.memoizedState)||(wt=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,t.lastRenderedState=r}if(n=t.interleaved,n!==null){i=n;do s=i.lane,Se.lanes|=s,Ti|=s,i=i.next;while(i!==n)}else i===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function Ed(n){var e=Gt(),t=e.queue;if(t===null)throw Error(U(311));t.lastRenderedReducer=n;var r=t.dispatch,i=t.pending,s=e.memoizedState;if(i!==null){t.pending=null;var o=i=i.next;do s=n(s,o.action),o=o.next;while(o!==i);on(s,e.memoizedState)||(wt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,r]}function ew(){}function tw(n,e){var t=Se,r=Gt(),i=e(),s=!on(r.memoizedState,i);if(s&&(r.memoizedState=i,wt=!0),r=r.queue,Xp(iw.bind(null,t,r,n),[n]),r.getSnapshot!==e||s||Ke!==null&&Ke.memoizedState.tag&1){if(t.flags|=2048,La(9,rw.bind(null,t,r,i,e),void 0,null),He===null)throw Error(U(349));wi&30||nw(t,e,i)}return i}function nw(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=Se.updateQueue,e===null?(e={lastEffect:null,stores:null},Se.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function rw(n,e,t,r){e.value=t,e.getSnapshot=r,sw(e)&&ow(n)}function iw(n,e,t){return t(function(){sw(e)&&ow(n)})}function sw(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!on(n,t)}catch{return!0}}function ow(n){var e=Fn(n,1);e!==null&&sn(e,n,1,-1)}function d_(n){var e=ln();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Oa,lastRenderedState:n},e.queue=n,n=n.dispatch=$R.bind(null,Se,n),[e.memoizedState,n]}function La(n,e,t,r){return n={tag:n,create:e,destroy:t,deps:r,next:null},e=Se.updateQueue,e===null?(e={lastEffect:null,stores:null},Se.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(r=t.next,t.next=n,n.next=r,e.lastEffect=n)),n}function aw(){return Gt().memoizedState}function gu(n,e,t,r){var i=ln();Se.flags|=n,i.memoizedState=La(1|e,t,void 0,r===void 0?null:r)}function zc(n,e,t,r){var i=Gt();r=r===void 0?null:r;var s=void 0;if(Fe!==null){var o=Fe.memoizedState;if(s=o.destroy,r!==null&&Hp(r,o.deps)){i.memoizedState=La(e,t,s,r);return}}Se.flags|=n,i.memoizedState=La(1|e,t,s,r)}function f_(n,e){return gu(8390656,8,n,e)}function Xp(n,e){return zc(2048,8,n,e)}function lw(n,e){return zc(4,2,n,e)}function uw(n,e){return zc(4,4,n,e)}function cw(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function hw(n,e,t){return t=t!=null?t.concat([n]):null,zc(4,4,cw.bind(null,e,n),t)}function Yp(){}function dw(n,e){var t=Gt();e=e===void 0?null:e;var r=t.memoizedState;return r!==null&&e!==null&&Hp(e,r[1])?r[0]:(t.memoizedState=[n,e],n)}function fw(n,e){var t=Gt();e=e===void 0?null:e;var r=t.memoizedState;return r!==null&&e!==null&&Hp(e,r[1])?r[0]:(n=n(),t.memoizedState=[n,e],n)}function pw(n,e,t){return wi&21?(on(t,e)||(t=vE(),Se.lanes|=t,Ti|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,wt=!0),n.memoizedState=t)}function zR(n,e){var t=ce;ce=t!==0&&4>t?t:4,n(!0);var r=vd.transition;vd.transition={};try{n(!1),e()}finally{ce=t,vd.transition=r}}function mw(){return Gt().memoizedState}function jR(n,e,t){var r=Ar(n);if(t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null},gw(n))yw(e,t);else if(t=YE(n,e,t,r),t!==null){var i=gt();sn(t,n,r,i),_w(t,e,r)}}function $R(n,e,t){var r=Ar(n),i={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(gw(n))yw(e,i);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(i.hasEagerState=!0,i.eagerState=a,on(a,o)){var u=e.interleaved;u===null?(i.next=i,jp(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}t=YE(n,e,i,r),t!==null&&(i=gt(),sn(t,n,r,i),_w(t,e,r))}}function gw(n){var e=n.alternate;return n===Se||e!==null&&e===Se}function yw(n,e){ra=tc=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function _w(n,e,t){if(t&4194240){var r=e.lanes;r&=n.pendingLanes,t|=r,e.lanes=t,Cp(n,t)}}var nc={readContext:Ht,useCallback:rt,useContext:rt,useEffect:rt,useImperativeHandle:rt,useInsertionEffect:rt,useLayoutEffect:rt,useMemo:rt,useReducer:rt,useRef:rt,useState:rt,useDebugValue:rt,useDeferredValue:rt,useTransition:rt,useMutableSource:rt,useSyncExternalStore:rt,useId:rt,unstable_isNewReconciler:!1},qR={readContext:Ht,useCallback:function(n,e){return ln().memoizedState=[n,e===void 0?null:e],n},useContext:Ht,useEffect:f_,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,gu(4194308,4,cw.bind(null,e,n),t)},useLayoutEffect:function(n,e){return gu(4194308,4,n,e)},useInsertionEffect:function(n,e){return gu(4,2,n,e)},useMemo:function(n,e){var t=ln();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var r=ln();return e=t!==void 0?t(e):e,r.memoizedState=r.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},r.queue=n,n=n.dispatch=jR.bind(null,Se,n),[r.memoizedState,n]},useRef:function(n){var e=ln();return n={current:n},e.memoizedState=n},useState:d_,useDebugValue:Yp,useDeferredValue:function(n){return ln().memoizedState=n},useTransition:function(){var n=d_(!1),e=n[0];return n=zR.bind(null,n[1]),ln().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var r=Se,i=ln();if(Ie){if(t===void 0)throw Error(U(407));t=t()}else{if(t=e(),He===null)throw Error(U(349));wi&30||nw(r,e,t)}i.memoizedState=t;var s={value:t,getSnapshot:e};return i.queue=s,f_(iw.bind(null,r,s,n),[n]),r.flags|=2048,La(9,rw.bind(null,r,s,t,e),void 0,null),t},useId:function(){var n=ln(),e=He.identifierPrefix;if(Ie){var t=Dn,r=Vn;t=(r&~(1<<32-rn(r)-1)).toString(32)+t,e=":"+e+"R"+t,t=ba++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=BR++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},WR={readContext:Ht,useCallback:dw,useContext:Ht,useEffect:Xp,useImperativeHandle:hw,useInsertionEffect:lw,useLayoutEffect:uw,useMemo:fw,useReducer:Id,useRef:aw,useState:function(){return Id(Oa)},useDebugValue:Yp,useDeferredValue:function(n){var e=Gt();return pw(e,Fe.memoizedState,n)},useTransition:function(){var n=Id(Oa)[0],e=Gt().memoizedState;return[n,e]},useMutableSource:ew,useSyncExternalStore:tw,useId:mw,unstable_isNewReconciler:!1},KR={readContext:Ht,useCallback:dw,useContext:Ht,useEffect:Xp,useImperativeHandle:hw,useInsertionEffect:lw,useLayoutEffect:uw,useMemo:fw,useReducer:Ed,useRef:aw,useState:function(){return Ed(Oa)},useDebugValue:Yp,useDeferredValue:function(n){var e=Gt();return Fe===null?e.memoizedState=n:pw(e,Fe.memoizedState,n)},useTransition:function(){var n=Ed(Oa)[0],e=Gt().memoizedState;return[n,e]},useMutableSource:ew,useSyncExternalStore:tw,useId:mw,unstable_isNewReconciler:!1};function Jt(n,e){if(n&&n.defaultProps){e=Ae({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function If(n,e,t,r){e=n.memoizedState,t=t(r,e),t=t==null?e:Ae({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var jc={isMounted:function(n){return(n=n._reactInternals)?Li(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var r=gt(),i=Ar(n),s=On(r,i);s.payload=e,t!=null&&(s.callback=t),e=Tr(n,s,i),e!==null&&(sn(e,n,i,r),pu(e,n,i))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var r=gt(),i=Ar(n),s=On(r,i);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=Tr(n,s,i),e!==null&&(sn(e,n,i,r),pu(e,n,i))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=gt(),r=Ar(n),i=On(t,r);i.tag=2,e!=null&&(i.callback=e),e=Tr(n,i,r),e!==null&&(sn(e,n,r,t),pu(e,n,r))}};function p_(n,e,t,r,i,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ca(t,r)||!Ca(i,s):!0}function vw(n,e,t){var r=!1,i=Or,s=e.contextType;return typeof s=="object"&&s!==null?s=Ht(s):(i=Pt(e)?Ii:dt.current,r=e.contextTypes,s=(r=r!=null)?As(n,i):Or),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=jc,n.stateNode=e,e._reactInternals=n,r&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=s),e}function m_(n,e,t,r){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,r),e.state!==n&&jc.enqueueReplaceState(e,e.state,null)}function Ef(n,e,t,r){var i=n.stateNode;i.props=t,i.state=n.memoizedState,i.refs={},$p(n);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Ht(s):(s=Pt(e)?Ii:dt.current,i.context=As(n,s)),i.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(If(n,e,s,t),i.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&jc.enqueueReplaceState(i,i.state,null),Zu(n,t,i,r),i.state=n.memoizedState),typeof i.componentDidMount=="function"&&(n.flags|=4194308)}function ks(n,e){try{var t="",r=e;do t+=IP(r),r=r.return;while(r);var i=t}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:i,digest:null}}function wd(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function wf(n,e){try{}catch(t){setTimeout(function(){throw t})}}var HR=typeof WeakMap=="function"?WeakMap:Map;function Iw(n,e,t){t=On(-1,t),t.tag=3,t.payload={element:null};var r=e.value;return t.callback=function(){ic||(ic=!0,Nf=r),wf(n,e)},t}function Ew(n,e,t){t=On(-1,t),t.tag=3;var r=n.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;t.payload=function(){return r(i)},t.callback=function(){wf(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){wf(n,e),typeof r!="function"&&(Sr===null?Sr=new Set([this]):Sr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function g_(n,e,t){var r=n.pingCache;if(r===null){r=n.pingCache=new HR;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(t)||(i.add(t),n=a1.bind(null,n,e,t),e.then(n,n))}function y_(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function __(n,e,t,r,i){return n.mode&1?(n.flags|=65536,n.lanes=i,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=On(-1,1),e.tag=2,Tr(t,e,1))),t.lanes|=1),n)}var GR=Kn.ReactCurrentOwner,wt=!1;function mt(n,e,t,r){e.child=n===null?XE(e,null,t,r):Rs(e,n.child,t,r)}function v_(n,e,t,r,i){t=t.render;var s=e.ref;return ys(e,i),r=Gp(n,e,t,r,s,i),t=Qp(),n!==null&&!wt?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~i,Un(n,e,i)):(Ie&&t&&Lp(e),e.flags|=1,mt(n,e,r,i),e.child)}function I_(n,e,t,r,i){if(n===null){var s=t.type;return typeof s=="function"&&!sm(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,ww(n,e,s,r,i)):(n=Iu(t.type,null,r,e,e.mode,i),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&i)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:Ca,t(o,r)&&n.ref===e.ref)return Un(n,e,i)}return e.flags|=1,n=Pr(s,r),n.ref=e.ref,n.return=e,e.child=n}function ww(n,e,t,r,i){if(n!==null){var s=n.memoizedProps;if(Ca(s,r)&&n.ref===e.ref)if(wt=!1,e.pendingProps=r=s,(n.lanes&i)!==0)n.flags&131072&&(wt=!0);else return e.lanes=n.lanes,Un(n,e,i)}return Tf(n,e,t,r,i)}function Tw(n,e,t){var r=e.pendingProps,i=r.children,s=n!==null?n.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},pe(ds,Vt),Vt|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,pe(ds,Vt),Vt|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:t,pe(ds,Vt),Vt|=r}else s!==null?(r=s.baseLanes|t,e.memoizedState=null):r=t,pe(ds,Vt),Vt|=r;return mt(n,e,i,t),e.child}function Sw(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function Tf(n,e,t,r,i){var s=Pt(t)?Ii:dt.current;return s=As(e,s),ys(e,i),t=Gp(n,e,t,r,s,i),r=Qp(),n!==null&&!wt?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~i,Un(n,e,i)):(Ie&&r&&Lp(e),e.flags|=1,mt(n,e,t,i),e.child)}function E_(n,e,t,r,i){if(Pt(t)){var s=!0;Gu(e)}else s=!1;if(ys(e,i),e.stateNode===null)yu(n,e),vw(e,t,r),Ef(e,t,r,i),r=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var u=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=Ht(c):(c=Pt(t)?Ii:dt.current,c=As(e,c));var d=t.getDerivedStateFromProps,p=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";p||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||u!==c)&&m_(e,o,r,c),ar=!1;var m=e.memoizedState;o.state=m,Zu(e,r,o,i),u=e.memoizedState,a!==r||m!==u||At.current||ar?(typeof d=="function"&&(If(e,t,d,r),u=e.memoizedState),(a=ar||p_(e,t,a,r,m,u,c))?(p||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=c,r=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,JE(n,e),a=e.memoizedProps,c=e.type===e.elementType?a:Jt(e.type,a),o.props=c,p=e.pendingProps,m=o.context,u=t.contextType,typeof u=="object"&&u!==null?u=Ht(u):(u=Pt(t)?Ii:dt.current,u=As(e,u));var E=t.getDerivedStateFromProps;(d=typeof E=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==p||m!==u)&&m_(e,o,r,u),ar=!1,m=e.memoizedState,o.state=m,Zu(e,r,o,i);var R=e.memoizedState;a!==p||m!==R||At.current||ar?(typeof E=="function"&&(If(e,t,E,r),R=e.memoizedState),(c=ar||p_(e,t,c,r,m,R,u)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,R,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,R,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&m===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&m===n.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=R),o.props=r,o.state=R,o.context=u,r=c):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&m===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&m===n.memoizedState||(e.flags|=1024),r=!1)}return Sf(n,e,t,r,s,i)}function Sf(n,e,t,r,i,s){Sw(n,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&o_(e,t,!1),Un(n,e,s);r=e.stateNode,GR.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,n!==null&&o?(e.child=Rs(e,n.child,null,s),e.child=Rs(e,null,a,s)):mt(n,e,a,s),e.memoizedState=r.state,i&&o_(e,t,!0),e.child}function Aw(n){var e=n.stateNode;e.pendingContext?s_(n,e.pendingContext,e.pendingContext!==e.context):e.context&&s_(n,e.context,!1),qp(n,e.containerInfo)}function w_(n,e,t,r,i){return Ps(),Fp(i),e.flags|=256,mt(n,e,t,r),e.child}var Af={dehydrated:null,treeContext:null,retryLane:0};function Pf(n){return{baseLanes:n,cachePool:null,transitions:null}}function Pw(n,e,t){var r=e.pendingProps,i=we.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(i&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(i|=1),pe(we,i&1),n===null)return _f(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,n=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Wc(o,r,0,null),n=pi(n,r,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=Pf(t),e.memoizedState=Af,n):Jp(e,o));if(i=n.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return QR(n,e,o,r,a,i,t);if(s){s=r.fallback,o=e.mode,i=n.child,a=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=Pr(i,u),r.subtreeFlags=i.subtreeFlags&14680064),a!==null?s=Pr(a,s):(s=pi(s,o,t,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=n.child.memoizedState,o=o===null?Pf(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=Af,r}return s=n.child,n=s.sibling,r=Pr(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=t),r.return=e,r.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=r,e.memoizedState=null,r}function Jp(n,e){return e=Wc({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function Yl(n,e,t,r){return r!==null&&Fp(r),Rs(e,n.child,null,t),n=Jp(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function QR(n,e,t,r,i,s,o){if(t)return e.flags&256?(e.flags&=-257,r=wd(Error(U(422))),Yl(n,e,o,r)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Wc({mode:"visible",children:r.children},i,0,null),s=pi(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&Rs(e,n.child,null,o),e.child.memoizedState=Pf(o),e.memoizedState=Af,s);if(!(e.mode&1))return Yl(n,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var a=r.dgst;return r=a,s=Error(U(419)),r=wd(s,r,void 0),Yl(n,e,o,r)}if(a=(o&n.childLanes)!==0,wt||a){if(r=He,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,Fn(n,i),sn(r,n,i,-1))}return im(),r=wd(Error(U(421))),Yl(n,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=n.child,e=l1.bind(null,n),i._reactRetry=e,null):(n=s.treeContext,Nt=wr(i.nextSibling),bt=e,Ie=!0,tn=null,n!==null&&(jt[$t++]=Vn,jt[$t++]=Dn,jt[$t++]=Ei,Vn=n.id,Dn=n.overflow,Ei=e),e=Jp(e,r.children),e.flags|=4096,e)}function T_(n,e,t){n.lanes|=e;var r=n.alternate;r!==null&&(r.lanes|=e),vf(n.return,e,t)}function Td(n,e,t,r,i){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=t,s.tailMode=i)}function Rw(n,e,t){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(mt(n,e,r.children,t),r=we.current,r&2)r=r&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&T_(n,t,e);else if(n.tag===19)T_(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}r&=1}if(pe(we,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(t=e.child,i=null;t!==null;)n=t.alternate,n!==null&&ec(n)===null&&(i=t),t=t.sibling;t=i,t===null?(i=e.child,e.child=null):(i=t.sibling,t.sibling=null),Td(e,!1,i,t,s);break;case"backwards":for(t=null,i=e.child,e.child=null;i!==null;){if(n=i.alternate,n!==null&&ec(n)===null){e.child=i;break}n=i.sibling,i.sibling=t,t=i,i=n}Td(e,!0,t,null,s);break;case"together":Td(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function yu(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Un(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),Ti|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(U(153));if(e.child!==null){for(n=e.child,t=Pr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=Pr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function XR(n,e,t){switch(e.tag){case 3:Aw(e),Ps();break;case 5:ZE(e);break;case 1:Pt(e.type)&&Gu(e);break;case 4:qp(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;pe(Yu,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(pe(we,we.current&1),e.flags|=128,null):t&e.child.childLanes?Pw(n,e,t):(pe(we,we.current&1),n=Un(n,e,t),n!==null?n.sibling:null);pe(we,we.current&1);break;case 19:if(r=(t&e.childLanes)!==0,n.flags&128){if(r)return Rw(n,e,t);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),pe(we,we.current),r)break;return null;case 22:case 23:return e.lanes=0,Tw(n,e,t)}return Un(n,e,t)}var Cw,Rf,kw,Vw;Cw=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Rf=function(){};kw=function(n,e,t,r){var i=n.memoizedProps;if(i!==r){n=e.stateNode,hi(mn.current);var s=null;switch(t){case"input":i=Gd(n,i),r=Gd(n,r),s=[];break;case"select":i=Ae({},i,{value:void 0}),r=Ae({},r,{value:void 0}),s=[];break;case"textarea":i=Yd(n,i),r=Yd(n,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(n.onclick=Ku)}Zd(t,r);var o;t=null;for(c in i)if(!r.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var a=i[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Ea.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in r){var u=r[c];if(a=i!=null?i[c]:void 0,r.hasOwnProperty(c)&&u!==a&&(u!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in u)u.hasOwnProperty(o)&&a[o]!==u[o]&&(t||(t={}),t[o]=u[o])}else t||(s||(s=[]),s.push(c,t)),t=u;else c==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,a=a?a.__html:void 0,u!=null&&a!==u&&(s=s||[]).push(c,u)):c==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(c,""+u):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Ea.hasOwnProperty(c)?(u!=null&&c==="onScroll"&&ye("scroll",n),s||a===u||(s=[])):(s=s||[]).push(c,u))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};Vw=function(n,e,t,r){t!==r&&(e.flags|=4)};function No(n,e){if(!Ie)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:r.sibling=null}}function it(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,r=0;if(e)for(var i=n.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=n,i=i.sibling;else for(i=n.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=n,i=i.sibling;return n.subtreeFlags|=r,n.childLanes=t,e}function YR(n,e,t){var r=e.pendingProps;switch(Mp(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return it(e),null;case 1:return Pt(e.type)&&Hu(),it(e),null;case 3:return r=e.stateNode,Cs(),_e(At),_e(dt),Kp(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(n===null||n.child===null)&&(Ql(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,tn!==null&&(Of(tn),tn=null))),Rf(n,e),it(e),null;case 5:Wp(e);var i=hi(xa.current);if(t=e.type,n!==null&&e.stateNode!=null)kw(n,e,t,r,i),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(U(166));return it(e),null}if(n=hi(mn.current),Ql(e)){r=e.stateNode,t=e.type;var s=e.memoizedProps;switch(r[hn]=e,r[Da]=s,n=(e.mode&1)!==0,t){case"dialog":ye("cancel",r),ye("close",r);break;case"iframe":case"object":case"embed":ye("load",r);break;case"video":case"audio":for(i=0;i<$o.length;i++)ye($o[i],r);break;case"source":ye("error",r);break;case"img":case"image":case"link":ye("error",r),ye("load",r);break;case"details":ye("toggle",r);break;case"input":Ny(r,s),ye("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},ye("invalid",r);break;case"textarea":by(r,s),ye("invalid",r)}Zd(t,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?r.textContent!==a&&(s.suppressHydrationWarning!==!0&&Gl(r.textContent,a,n),i=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&Gl(r.textContent,a,n),i=["children",""+a]):Ea.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&ye("scroll",r)}switch(t){case"input":Bl(r),xy(r,s,!0);break;case"textarea":Bl(r),Oy(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Ku)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=iE(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof r.is=="string"?n=o.createElement(t,{is:r.is}):(n=o.createElement(t),t==="select"&&(o=n,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):n=o.createElementNS(n,t),n[hn]=e,n[Da]=r,Cw(n,e,!1,!1),e.stateNode=n;e:{switch(o=ef(t,r),t){case"dialog":ye("cancel",n),ye("close",n),i=r;break;case"iframe":case"object":case"embed":ye("load",n),i=r;break;case"video":case"audio":for(i=0;i<$o.length;i++)ye($o[i],n);i=r;break;case"source":ye("error",n),i=r;break;case"img":case"image":case"link":ye("error",n),ye("load",n),i=r;break;case"details":ye("toggle",n),i=r;break;case"input":Ny(n,r),i=Gd(n,r),ye("invalid",n);break;case"option":i=r;break;case"select":n._wrapperState={wasMultiple:!!r.multiple},i=Ae({},r,{value:void 0}),ye("invalid",n);break;case"textarea":by(n,r),i=Yd(n,r),ye("invalid",n);break;default:i=r}Zd(t,i),a=i;for(s in a)if(a.hasOwnProperty(s)){var u=a[s];s==="style"?aE(n,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&sE(n,u)):s==="children"?typeof u=="string"?(t!=="textarea"||u!=="")&&wa(n,u):typeof u=="number"&&wa(n,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ea.hasOwnProperty(s)?u!=null&&s==="onScroll"&&ye("scroll",n):u!=null&&wp(n,s,u,o))}switch(t){case"input":Bl(n),xy(n,r,!1);break;case"textarea":Bl(n),Oy(n);break;case"option":r.value!=null&&n.setAttribute("value",""+br(r.value));break;case"select":n.multiple=!!r.multiple,s=r.value,s!=null?fs(n,!!r.multiple,s,!1):r.defaultValue!=null&&fs(n,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(n.onclick=Ku)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return it(e),null;case 6:if(n&&e.stateNode!=null)Vw(n,e,n.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(U(166));if(t=hi(xa.current),hi(mn.current),Ql(e)){if(r=e.stateNode,t=e.memoizedProps,r[hn]=e,(s=r.nodeValue!==t)&&(n=bt,n!==null))switch(n.tag){case 3:Gl(r.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Gl(r.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else r=(t.nodeType===9?t:t.ownerDocument).createTextNode(r),r[hn]=e,e.stateNode=r}return it(e),null;case 13:if(_e(we),r=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Ie&&Nt!==null&&e.mode&1&&!(e.flags&128))GE(),Ps(),e.flags|=98560,s=!1;else if(s=Ql(e),r!==null&&r.dehydrated!==null){if(n===null){if(!s)throw Error(U(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(U(317));s[hn]=e}else Ps(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;it(e),s=!1}else tn!==null&&(Of(tn),tn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(r=r!==null,r!==(n!==null&&n.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(n===null||we.current&1?Be===0&&(Be=3):im())),e.updateQueue!==null&&(e.flags|=4),it(e),null);case 4:return Cs(),Rf(n,e),n===null&&ka(e.stateNode.containerInfo),it(e),null;case 10:return zp(e.type._context),it(e),null;case 17:return Pt(e.type)&&Hu(),it(e),null;case 19:if(_e(we),s=e.memoizedState,s===null)return it(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)No(s,!1);else{if(Be!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=ec(n),o!==null){for(e.flags|=128,No(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=t,t=e.child;t!==null;)s=t,n=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return pe(we,we.current&1|2),e.child}n=n.sibling}s.tail!==null&&De()>Vs&&(e.flags|=128,r=!0,No(s,!1),e.lanes=4194304)}else{if(!r)if(n=ec(o),n!==null){if(e.flags|=128,r=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),No(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!Ie)return it(e),null}else 2*De()-s.renderingStartTime>Vs&&t!==1073741824&&(e.flags|=128,r=!0,No(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=De(),e.sibling=null,t=we.current,pe(we,r?t&1|2:t&1),e):(it(e),null);case 22:case 23:return rm(),r=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Vt&1073741824&&(it(e),e.subtreeFlags&6&&(e.flags|=8192)):it(e),null;case 24:return null;case 25:return null}throw Error(U(156,e.tag))}function JR(n,e){switch(Mp(e),e.tag){case 1:return Pt(e.type)&&Hu(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Cs(),_e(At),_e(dt),Kp(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return Wp(e),null;case 13:if(_e(we),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(U(340));Ps()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return _e(we),null;case 4:return Cs(),null;case 10:return zp(e.type._context),null;case 22:case 23:return rm(),null;case 24:return null;default:return null}}var Jl=!1,lt=!1,ZR=typeof WeakSet=="function"?WeakSet:Set,W=null;function hs(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(r){Re(n,e,r)}else t.current=null}function Cf(n,e,t){try{t()}catch(r){Re(n,e,r)}}var S_=!1;function e1(n,e){if(hf=$u,n=OE(),Op(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&r.rangeCount!==0){t=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,u=-1,c=0,d=0,p=n,m=null;t:for(;;){for(var E;p!==t||i!==0&&p.nodeType!==3||(a=o+i),p!==s||r!==0&&p.nodeType!==3||(u=o+r),p.nodeType===3&&(o+=p.nodeValue.length),(E=p.firstChild)!==null;)m=p,p=E;for(;;){if(p===n)break t;if(m===t&&++c===i&&(a=o),m===s&&++d===r&&(u=o),(E=p.nextSibling)!==null)break;p=m,m=p.parentNode}p=E}t=a===-1||u===-1?null:{start:a,end:u}}else t=null}t=t||{start:0,end:0}}else t=null;for(df={focusedElem:n,selectionRange:t},$u=!1,W=e;W!==null;)if(e=W,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,W=n;else for(;W!==null;){e=W;try{var R=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(R!==null){var D=R.memoizedProps,O=R.memoizedState,A=e.stateNode,_=A.getSnapshotBeforeUpdate(e.elementType===e.type?D:Jt(e.type,D),O);A.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var w=e.stateNode.containerInfo;w.nodeType===1?w.textContent="":w.nodeType===9&&w.documentElement&&w.removeChild(w.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(U(163))}}catch(x){Re(e,e.return,x)}if(n=e.sibling,n!==null){n.return=e.return,W=n;break}W=e.return}return R=S_,S_=!1,R}function ia(n,e,t){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&n)===n){var s=i.destroy;i.destroy=void 0,s!==void 0&&Cf(e,t,s)}i=i.next}while(i!==r)}}function $c(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var r=t.create;t.destroy=r()}t=t.next}while(t!==e)}}function kf(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function Dw(n){var e=n.alternate;e!==null&&(n.alternate=null,Dw(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[hn],delete e[Da],delete e[mf],delete e[LR],delete e[MR])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Nw(n){return n.tag===5||n.tag===3||n.tag===4}function A_(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Nw(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Vf(n,e,t){var r=n.tag;if(r===5||r===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=Ku));else if(r!==4&&(n=n.child,n!==null))for(Vf(n,e,t),n=n.sibling;n!==null;)Vf(n,e,t),n=n.sibling}function Df(n,e,t){var r=n.tag;if(r===5||r===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(r!==4&&(n=n.child,n!==null))for(Df(n,e,t),n=n.sibling;n!==null;)Df(n,e,t),n=n.sibling}var Xe=null,Zt=!1;function tr(n,e,t){for(t=t.child;t!==null;)xw(n,e,t),t=t.sibling}function xw(n,e,t){if(pn&&typeof pn.onCommitFiberUnmount=="function")try{pn.onCommitFiberUnmount(Oc,t)}catch{}switch(t.tag){case 5:lt||hs(t,e);case 6:var r=Xe,i=Zt;Xe=null,tr(n,e,t),Xe=r,Zt=i,Xe!==null&&(Zt?(n=Xe,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Xe.removeChild(t.stateNode));break;case 18:Xe!==null&&(Zt?(n=Xe,t=t.stateNode,n.nodeType===8?gd(n.parentNode,t):n.nodeType===1&&gd(n,t),Pa(n)):gd(Xe,t.stateNode));break;case 4:r=Xe,i=Zt,Xe=t.stateNode.containerInfo,Zt=!0,tr(n,e,t),Xe=r,Zt=i;break;case 0:case 11:case 14:case 15:if(!lt&&(r=t.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Cf(t,e,o),i=i.next}while(i!==r)}tr(n,e,t);break;case 1:if(!lt&&(hs(t,e),r=t.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(a){Re(t,e,a)}tr(n,e,t);break;case 21:tr(n,e,t);break;case 22:t.mode&1?(lt=(r=lt)||t.memoizedState!==null,tr(n,e,t),lt=r):tr(n,e,t);break;default:tr(n,e,t)}}function P_(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new ZR),e.forEach(function(r){var i=u1.bind(null,n,r);t.has(r)||(t.add(r),r.then(i,i))})}}function Yt(n,e){var t=e.deletions;if(t!==null)for(var r=0;r<t.length;r++){var i=t[r];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Xe=a.stateNode,Zt=!1;break e;case 3:Xe=a.stateNode.containerInfo,Zt=!0;break e;case 4:Xe=a.stateNode.containerInfo,Zt=!0;break e}a=a.return}if(Xe===null)throw Error(U(160));xw(s,o,i),Xe=null,Zt=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(c){Re(i,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)bw(e,n),e=e.sibling}function bw(n,e){var t=n.alternate,r=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Yt(e,n),an(n),r&4){try{ia(3,n,n.return),$c(3,n)}catch(D){Re(n,n.return,D)}try{ia(5,n,n.return)}catch(D){Re(n,n.return,D)}}break;case 1:Yt(e,n),an(n),r&512&&t!==null&&hs(t,t.return);break;case 5:if(Yt(e,n),an(n),r&512&&t!==null&&hs(t,t.return),n.flags&32){var i=n.stateNode;try{wa(i,"")}catch(D){Re(n,n.return,D)}}if(r&4&&(i=n.stateNode,i!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,u=n.updateQueue;if(n.updateQueue=null,u!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&nE(i,s),ef(a,o);var c=ef(a,s);for(o=0;o<u.length;o+=2){var d=u[o],p=u[o+1];d==="style"?aE(i,p):d==="dangerouslySetInnerHTML"?sE(i,p):d==="children"?wa(i,p):wp(i,d,p,c)}switch(a){case"input":Qd(i,s);break;case"textarea":rE(i,s);break;case"select":var m=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var E=s.value;E!=null?fs(i,!!s.multiple,E,!1):m!==!!s.multiple&&(s.defaultValue!=null?fs(i,!!s.multiple,s.defaultValue,!0):fs(i,!!s.multiple,s.multiple?[]:"",!1))}i[Da]=s}catch(D){Re(n,n.return,D)}}break;case 6:if(Yt(e,n),an(n),r&4){if(n.stateNode===null)throw Error(U(162));i=n.stateNode,s=n.memoizedProps;try{i.nodeValue=s}catch(D){Re(n,n.return,D)}}break;case 3:if(Yt(e,n),an(n),r&4&&t!==null&&t.memoizedState.isDehydrated)try{Pa(e.containerInfo)}catch(D){Re(n,n.return,D)}break;case 4:Yt(e,n),an(n);break;case 13:Yt(e,n),an(n),i=n.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(tm=De())),r&4&&P_(n);break;case 22:if(d=t!==null&&t.memoizedState!==null,n.mode&1?(lt=(c=lt)||d,Yt(e,n),lt=c):Yt(e,n),an(n),r&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!d&&n.mode&1)for(W=n,d=n.child;d!==null;){for(p=W=d;W!==null;){switch(m=W,E=m.child,m.tag){case 0:case 11:case 14:case 15:ia(4,m,m.return);break;case 1:hs(m,m.return);var R=m.stateNode;if(typeof R.componentWillUnmount=="function"){r=m,t=m.return;try{e=r,R.props=e.memoizedProps,R.state=e.memoizedState,R.componentWillUnmount()}catch(D){Re(r,t,D)}}break;case 5:hs(m,m.return);break;case 22:if(m.memoizedState!==null){C_(p);continue}}E!==null?(E.return=m,W=E):C_(p)}d=d.sibling}e:for(d=null,p=n;;){if(p.tag===5){if(d===null){d=p;try{i=p.stateNode,c?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=p.stateNode,u=p.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,a.style.display=oE("display",o))}catch(D){Re(n,n.return,D)}}}else if(p.tag===6){if(d===null)try{p.stateNode.nodeValue=c?"":p.memoizedProps}catch(D){Re(n,n.return,D)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===n)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===n)break e;for(;p.sibling===null;){if(p.return===null||p.return===n)break e;d===p&&(d=null),p=p.return}d===p&&(d=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Yt(e,n),an(n),r&4&&P_(n);break;case 21:break;default:Yt(e,n),an(n)}}function an(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(Nw(t)){var r=t;break e}t=t.return}throw Error(U(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(wa(i,""),r.flags&=-33);var s=A_(n);Df(n,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,a=A_(n);Vf(n,a,o);break;default:throw Error(U(161))}}catch(u){Re(n,n.return,u)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function t1(n,e,t){W=n,Ow(n)}function Ow(n,e,t){for(var r=(n.mode&1)!==0;W!==null;){var i=W,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||Jl;if(!o){var a=i.alternate,u=a!==null&&a.memoizedState!==null||lt;a=Jl;var c=lt;if(Jl=o,(lt=u)&&!c)for(W=i;W!==null;)o=W,u=o.child,o.tag===22&&o.memoizedState!==null?k_(i):u!==null?(u.return=o,W=u):k_(i);for(;s!==null;)W=s,Ow(s),s=s.sibling;W=i,Jl=a,lt=c}R_(n)}else i.subtreeFlags&8772&&s!==null?(s.return=i,W=s):R_(n)}}function R_(n){for(;W!==null;){var e=W;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:lt||$c(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!lt)if(t===null)r.componentDidMount();else{var i=e.elementType===e.type?t.memoizedProps:Jt(e.type,t.memoizedProps);r.componentDidUpdate(i,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&h_(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}h_(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&t.focus();break;case"img":u.src&&(t.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var p=d.dehydrated;p!==null&&Pa(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(U(163))}lt||e.flags&512&&kf(e)}catch(m){Re(e,e.return,m)}}if(e===n){W=null;break}if(t=e.sibling,t!==null){t.return=e.return,W=t;break}W=e.return}}function C_(n){for(;W!==null;){var e=W;if(e===n){W=null;break}var t=e.sibling;if(t!==null){t.return=e.return,W=t;break}W=e.return}}function k_(n){for(;W!==null;){var e=W;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{$c(4,e)}catch(u){Re(e,t,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){Re(e,i,u)}}var s=e.return;try{kf(e)}catch(u){Re(e,s,u)}break;case 5:var o=e.return;try{kf(e)}catch(u){Re(e,o,u)}}}catch(u){Re(e,e.return,u)}if(e===n){W=null;break}var a=e.sibling;if(a!==null){a.return=e.return,W=a;break}W=e.return}}var n1=Math.ceil,rc=Kn.ReactCurrentDispatcher,Zp=Kn.ReactCurrentOwner,Kt=Kn.ReactCurrentBatchConfig,se=0,He=null,Le=null,Je=0,Vt=0,ds=jr(0),Be=0,Ma=null,Ti=0,qc=0,em=0,sa=null,Et=null,tm=0,Vs=1/0,Cn=null,ic=!1,Nf=null,Sr=null,Zl=!1,gr=null,sc=0,oa=0,xf=null,_u=-1,vu=0;function gt(){return se&6?De():_u!==-1?_u:_u=De()}function Ar(n){return n.mode&1?se&2&&Je!==0?Je&-Je:UR.transition!==null?(vu===0&&(vu=vE()),vu):(n=ce,n!==0||(n=window.event,n=n===void 0?16:PE(n.type)),n):1}function sn(n,e,t,r){if(50<oa)throw oa=0,xf=null,Error(U(185));tl(n,t,r),(!(se&2)||n!==He)&&(n===He&&(!(se&2)&&(qc|=t),Be===4&&ur(n,Je)),Rt(n,r),t===1&&se===0&&!(e.mode&1)&&(Vs=De()+500,Bc&&$r()))}function Rt(n,e){var t=n.callbackNode;UP(n,e);var r=ju(n,n===He?Je:0);if(r===0)t!==null&&Fy(t),n.callbackNode=null,n.callbackPriority=0;else if(e=r&-r,n.callbackPriority!==e){if(t!=null&&Fy(t),e===1)n.tag===0?FR(V_.bind(null,n)):WE(V_.bind(null,n)),bR(function(){!(se&6)&&$r()}),t=null;else{switch(IE(r)){case 1:t=Rp;break;case 4:t=yE;break;case 16:t=zu;break;case 536870912:t=_E;break;default:t=zu}t=$w(t,Lw.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function Lw(n,e){if(_u=-1,vu=0,se&6)throw Error(U(327));var t=n.callbackNode;if(_s()&&n.callbackNode!==t)return null;var r=ju(n,n===He?Je:0);if(r===0)return null;if(r&30||r&n.expiredLanes||e)e=oc(n,r);else{e=r;var i=se;se|=2;var s=Fw();(He!==n||Je!==e)&&(Cn=null,Vs=De()+500,fi(n,e));do try{s1();break}catch(a){Mw(n,a)}while(!0);Bp(),rc.current=s,se=i,Le!==null?e=0:(He=null,Je=0,e=Be)}if(e!==0){if(e===2&&(i=of(n),i!==0&&(r=i,e=bf(n,i))),e===1)throw t=Ma,fi(n,0),ur(n,r),Rt(n,De()),t;if(e===6)ur(n,r);else{if(i=n.current.alternate,!(r&30)&&!r1(i)&&(e=oc(n,r),e===2&&(s=of(n),s!==0&&(r=s,e=bf(n,s))),e===1))throw t=Ma,fi(n,0),ur(n,r),Rt(n,De()),t;switch(n.finishedWork=i,n.finishedLanes=r,e){case 0:case 1:throw Error(U(345));case 2:ti(n,Et,Cn);break;case 3:if(ur(n,r),(r&130023424)===r&&(e=tm+500-De(),10<e)){if(ju(n,0)!==0)break;if(i=n.suspendedLanes,(i&r)!==r){gt(),n.pingedLanes|=n.suspendedLanes&i;break}n.timeoutHandle=pf(ti.bind(null,n,Et,Cn),e);break}ti(n,Et,Cn);break;case 4:if(ur(n,r),(r&4194240)===r)break;for(e=n.eventTimes,i=-1;0<r;){var o=31-rn(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=De()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*n1(r/1960))-r,10<r){n.timeoutHandle=pf(ti.bind(null,n,Et,Cn),r);break}ti(n,Et,Cn);break;case 5:ti(n,Et,Cn);break;default:throw Error(U(329))}}}return Rt(n,De()),n.callbackNode===t?Lw.bind(null,n):null}function bf(n,e){var t=sa;return n.current.memoizedState.isDehydrated&&(fi(n,e).flags|=256),n=oc(n,e),n!==2&&(e=Et,Et=t,e!==null&&Of(e)),n}function Of(n){Et===null?Et=n:Et.push.apply(Et,n)}function r1(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var r=0;r<t.length;r++){var i=t[r],s=i.getSnapshot;i=i.value;try{if(!on(s(),i))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ur(n,e){for(e&=~em,e&=~qc,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-rn(e),r=1<<t;n[t]=-1,e&=~r}}function V_(n){if(se&6)throw Error(U(327));_s();var e=ju(n,0);if(!(e&1))return Rt(n,De()),null;var t=oc(n,e);if(n.tag!==0&&t===2){var r=of(n);r!==0&&(e=r,t=bf(n,r))}if(t===1)throw t=Ma,fi(n,0),ur(n,e),Rt(n,De()),t;if(t===6)throw Error(U(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,ti(n,Et,Cn),Rt(n,De()),null}function nm(n,e){var t=se;se|=1;try{return n(e)}finally{se=t,se===0&&(Vs=De()+500,Bc&&$r())}}function Si(n){gr!==null&&gr.tag===0&&!(se&6)&&_s();var e=se;se|=1;var t=Kt.transition,r=ce;try{if(Kt.transition=null,ce=1,n)return n()}finally{ce=r,Kt.transition=t,se=e,!(se&6)&&$r()}}function rm(){Vt=ds.current,_e(ds)}function fi(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,xR(t)),Le!==null)for(t=Le.return;t!==null;){var r=t;switch(Mp(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Hu();break;case 3:Cs(),_e(At),_e(dt),Kp();break;case 5:Wp(r);break;case 4:Cs();break;case 13:_e(we);break;case 19:_e(we);break;case 10:zp(r.type._context);break;case 22:case 23:rm()}t=t.return}if(He=n,Le=n=Pr(n.current,null),Je=Vt=e,Be=0,Ma=null,em=qc=Ti=0,Et=sa=null,ci!==null){for(e=0;e<ci.length;e++)if(t=ci[e],r=t.interleaved,r!==null){t.interleaved=null;var i=r.next,s=t.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}t.pending=r}ci=null}return n}function Mw(n,e){do{var t=Le;try{if(Bp(),mu.current=nc,tc){for(var r=Se.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}tc=!1}if(wi=0,Ke=Fe=Se=null,ra=!1,ba=0,Zp.current=null,t===null||t.return===null){Be=1,Ma=e,Le=null;break}e:{var s=n,o=t.return,a=t,u=e;if(e=Je,a.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var c=u,d=a,p=d.tag;if(!(d.mode&1)&&(p===0||p===11||p===15)){var m=d.alternate;m?(d.updateQueue=m.updateQueue,d.memoizedState=m.memoizedState,d.lanes=m.lanes):(d.updateQueue=null,d.memoizedState=null)}var E=y_(o);if(E!==null){E.flags&=-257,__(E,o,a,s,e),E.mode&1&&g_(s,c,e),e=E,u=c;var R=e.updateQueue;if(R===null){var D=new Set;D.add(u),e.updateQueue=D}else R.add(u);break e}else{if(!(e&1)){g_(s,c,e),im();break e}u=Error(U(426))}}else if(Ie&&a.mode&1){var O=y_(o);if(O!==null){!(O.flags&65536)&&(O.flags|=256),__(O,o,a,s,e),Fp(ks(u,a));break e}}s=u=ks(u,a),Be!==4&&(Be=2),sa===null?sa=[s]:sa.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var A=Iw(s,u,e);c_(s,A);break e;case 1:a=u;var _=s.type,w=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||w!==null&&typeof w.componentDidCatch=="function"&&(Sr===null||!Sr.has(w)))){s.flags|=65536,e&=-e,s.lanes|=e;var x=Ew(s,a,e);c_(s,x);break e}}s=s.return}while(s!==null)}Bw(t)}catch(F){e=F,Le===t&&t!==null&&(Le=t=t.return);continue}break}while(!0)}function Fw(){var n=rc.current;return rc.current=nc,n===null?nc:n}function im(){(Be===0||Be===3||Be===2)&&(Be=4),He===null||!(Ti&268435455)&&!(qc&268435455)||ur(He,Je)}function oc(n,e){var t=se;se|=2;var r=Fw();(He!==n||Je!==e)&&(Cn=null,fi(n,e));do try{i1();break}catch(i){Mw(n,i)}while(!0);if(Bp(),se=t,rc.current=r,Le!==null)throw Error(U(261));return He=null,Je=0,Be}function i1(){for(;Le!==null;)Uw(Le)}function s1(){for(;Le!==null&&!VP();)Uw(Le)}function Uw(n){var e=jw(n.alternate,n,Vt);n.memoizedProps=n.pendingProps,e===null?Bw(n):Le=e,Zp.current=null}function Bw(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=JR(t,e),t!==null){t.flags&=32767,Le=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Be=6,Le=null;return}}else if(t=YR(t,e,Vt),t!==null){Le=t;return}if(e=e.sibling,e!==null){Le=e;return}Le=e=n}while(e!==null);Be===0&&(Be=5)}function ti(n,e,t){var r=ce,i=Kt.transition;try{Kt.transition=null,ce=1,o1(n,e,t,r)}finally{Kt.transition=i,ce=r}return null}function o1(n,e,t,r){do _s();while(gr!==null);if(se&6)throw Error(U(327));t=n.finishedWork;var i=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(U(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(BP(n,s),n===He&&(Le=He=null,Je=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||Zl||(Zl=!0,$w(zu,function(){return _s(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=Kt.transition,Kt.transition=null;var o=ce;ce=1;var a=se;se|=4,Zp.current=null,e1(n,t),bw(t,n),PR(df),$u=!!hf,df=hf=null,n.current=t,t1(t),DP(),se=a,ce=o,Kt.transition=s}else n.current=t;if(Zl&&(Zl=!1,gr=n,sc=i),s=n.pendingLanes,s===0&&(Sr=null),bP(t.stateNode),Rt(n,De()),e!==null)for(r=n.onRecoverableError,t=0;t<e.length;t++)i=e[t],r(i.value,{componentStack:i.stack,digest:i.digest});if(ic)throw ic=!1,n=Nf,Nf=null,n;return sc&1&&n.tag!==0&&_s(),s=n.pendingLanes,s&1?n===xf?oa++:(oa=0,xf=n):oa=0,$r(),null}function _s(){if(gr!==null){var n=IE(sc),e=Kt.transition,t=ce;try{if(Kt.transition=null,ce=16>n?16:n,gr===null)var r=!1;else{if(n=gr,gr=null,sc=0,se&6)throw Error(U(331));var i=se;for(se|=4,W=n.current;W!==null;){var s=W,o=s.child;if(W.flags&16){var a=s.deletions;if(a!==null){for(var u=0;u<a.length;u++){var c=a[u];for(W=c;W!==null;){var d=W;switch(d.tag){case 0:case 11:case 15:ia(8,d,s)}var p=d.child;if(p!==null)p.return=d,W=p;else for(;W!==null;){d=W;var m=d.sibling,E=d.return;if(Dw(d),d===c){W=null;break}if(m!==null){m.return=E,W=m;break}W=E}}}var R=s.alternate;if(R!==null){var D=R.child;if(D!==null){R.child=null;do{var O=D.sibling;D.sibling=null,D=O}while(D!==null)}}W=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,W=o;else e:for(;W!==null;){if(s=W,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ia(9,s,s.return)}var A=s.sibling;if(A!==null){A.return=s.return,W=A;break e}W=s.return}}var _=n.current;for(W=_;W!==null;){o=W;var w=o.child;if(o.subtreeFlags&2064&&w!==null)w.return=o,W=w;else e:for(o=_;W!==null;){if(a=W,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:$c(9,a)}}catch(F){Re(a,a.return,F)}if(a===o){W=null;break e}var x=a.sibling;if(x!==null){x.return=a.return,W=x;break e}W=a.return}}if(se=i,$r(),pn&&typeof pn.onPostCommitFiberRoot=="function")try{pn.onPostCommitFiberRoot(Oc,n)}catch{}r=!0}return r}finally{ce=t,Kt.transition=e}}return!1}function D_(n,e,t){e=ks(t,e),e=Iw(n,e,1),n=Tr(n,e,1),e=gt(),n!==null&&(tl(n,1,e),Rt(n,e))}function Re(n,e,t){if(n.tag===3)D_(n,n,t);else for(;e!==null;){if(e.tag===3){D_(e,n,t);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Sr===null||!Sr.has(r))){n=ks(t,n),n=Ew(e,n,1),e=Tr(e,n,1),n=gt(),e!==null&&(tl(e,1,n),Rt(e,n));break}}e=e.return}}function a1(n,e,t){var r=n.pingCache;r!==null&&r.delete(e),e=gt(),n.pingedLanes|=n.suspendedLanes&t,He===n&&(Je&t)===t&&(Be===4||Be===3&&(Je&130023424)===Je&&500>De()-tm?fi(n,0):em|=t),Rt(n,e)}function zw(n,e){e===0&&(n.mode&1?(e=$l,$l<<=1,!($l&130023424)&&($l=4194304)):e=1);var t=gt();n=Fn(n,e),n!==null&&(tl(n,e,t),Rt(n,t))}function l1(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),zw(n,t)}function u1(n,e){var t=0;switch(n.tag){case 13:var r=n.stateNode,i=n.memoizedState;i!==null&&(t=i.retryLane);break;case 19:r=n.stateNode;break;default:throw Error(U(314))}r!==null&&r.delete(e),zw(n,t)}var jw;jw=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||At.current)wt=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return wt=!1,XR(n,e,t);wt=!!(n.flags&131072)}else wt=!1,Ie&&e.flags&1048576&&KE(e,Xu,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;yu(n,e),n=e.pendingProps;var i=As(e,dt.current);ys(e,t),i=Gp(null,e,r,n,i,t);var s=Qp();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Pt(r)?(s=!0,Gu(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,$p(e),i.updater=jc,e.stateNode=i,i._reactInternals=e,Ef(e,r,n,t),e=Sf(null,e,r,!0,s,t)):(e.tag=0,Ie&&s&&Lp(e),mt(null,e,i,t),e=e.child),e;case 16:r=e.elementType;e:{switch(yu(n,e),n=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=h1(r),n=Jt(r,n),i){case 0:e=Tf(null,e,r,n,t);break e;case 1:e=E_(null,e,r,n,t);break e;case 11:e=v_(null,e,r,n,t);break e;case 14:e=I_(null,e,r,Jt(r.type,n),t);break e}throw Error(U(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Jt(r,i),Tf(n,e,r,i,t);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Jt(r,i),E_(n,e,r,i,t);case 3:e:{if(Aw(e),n===null)throw Error(U(387));r=e.pendingProps,s=e.memoizedState,i=s.element,JE(n,e),Zu(e,r,null,t);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=ks(Error(U(423)),e),e=w_(n,e,r,t,i);break e}else if(r!==i){i=ks(Error(U(424)),e),e=w_(n,e,r,t,i);break e}else for(Nt=wr(e.stateNode.containerInfo.firstChild),bt=e,Ie=!0,tn=null,t=XE(e,null,r,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Ps(),r===i){e=Un(n,e,t);break e}mt(n,e,r,t)}e=e.child}return e;case 5:return ZE(e),n===null&&_f(e),r=e.type,i=e.pendingProps,s=n!==null?n.memoizedProps:null,o=i.children,ff(r,i)?o=null:s!==null&&ff(r,s)&&(e.flags|=32),Sw(n,e),mt(n,e,o,t),e.child;case 6:return n===null&&_f(e),null;case 13:return Pw(n,e,t);case 4:return qp(e,e.stateNode.containerInfo),r=e.pendingProps,n===null?e.child=Rs(e,null,r,t):mt(n,e,r,t),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Jt(r,i),v_(n,e,r,i,t);case 7:return mt(n,e,e.pendingProps,t),e.child;case 8:return mt(n,e,e.pendingProps.children,t),e.child;case 12:return mt(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,pe(Yu,r._currentValue),r._currentValue=o,s!==null)if(on(s.value,o)){if(s.children===i.children&&!At.current){e=Un(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var u=a.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=On(-1,t&-t),u.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?u.next=u:(u.next=d.next,d.next=u),c.pending=u}}s.lanes|=t,u=s.alternate,u!==null&&(u.lanes|=t),vf(s.return,t,e),a.lanes|=t;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(U(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),vf(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}mt(n,e,i.children,t),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,ys(e,t),i=Ht(i),r=r(i),e.flags|=1,mt(n,e,r,t),e.child;case 14:return r=e.type,i=Jt(r,e.pendingProps),i=Jt(r.type,i),I_(n,e,r,i,t);case 15:return ww(n,e,e.type,e.pendingProps,t);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Jt(r,i),yu(n,e),e.tag=1,Pt(r)?(n=!0,Gu(e)):n=!1,ys(e,t),vw(e,r,i),Ef(e,r,i,t),Sf(null,e,r,!0,n,t);case 19:return Rw(n,e,t);case 22:return Tw(n,e,t)}throw Error(U(156,e.tag))};function $w(n,e){return gE(n,e)}function c1(n,e,t,r){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Wt(n,e,t,r){return new c1(n,e,t,r)}function sm(n){return n=n.prototype,!(!n||!n.isReactComponent)}function h1(n){if(typeof n=="function")return sm(n)?1:0;if(n!=null){if(n=n.$$typeof,n===Sp)return 11;if(n===Ap)return 14}return 2}function Pr(n,e){var t=n.alternate;return t===null?(t=Wt(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function Iu(n,e,t,r,i,s){var o=2;if(r=n,typeof n=="function")sm(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case ns:return pi(t.children,i,s,e);case Tp:o=8,i|=8;break;case qd:return n=Wt(12,t,e,i|2),n.elementType=qd,n.lanes=s,n;case Wd:return n=Wt(13,t,e,i),n.elementType=Wd,n.lanes=s,n;case Kd:return n=Wt(19,t,e,i),n.elementType=Kd,n.lanes=s,n;case ZI:return Wc(t,i,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case YI:o=10;break e;case JI:o=9;break e;case Sp:o=11;break e;case Ap:o=14;break e;case or:o=16,r=null;break e}throw Error(U(130,n==null?n:typeof n,""))}return e=Wt(o,t,e,i),e.elementType=n,e.type=r,e.lanes=s,e}function pi(n,e,t,r){return n=Wt(7,n,r,e),n.lanes=t,n}function Wc(n,e,t,r){return n=Wt(22,n,r,e),n.elementType=ZI,n.lanes=t,n.stateNode={isHidden:!1},n}function Sd(n,e,t){return n=Wt(6,n,null,e),n.lanes=t,n}function Ad(n,e,t){return e=Wt(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function d1(n,e,t,r,i){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=sd(0),this.expirationTimes=sd(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=sd(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function om(n,e,t,r,i,s,o,a,u){return n=new d1(n,e,t,a,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Wt(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},$p(s),n}function f1(n,e,t){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ts,key:r==null?null:""+r,children:n,containerInfo:e,implementation:t}}function qw(n){if(!n)return Or;n=n._reactInternals;e:{if(Li(n)!==n||n.tag!==1)throw Error(U(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Pt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(U(171))}if(n.tag===1){var t=n.type;if(Pt(t))return qE(n,t,e)}return e}function Ww(n,e,t,r,i,s,o,a,u){return n=om(t,r,!0,n,i,s,o,a,u),n.context=qw(null),t=n.current,r=gt(),i=Ar(t),s=On(r,i),s.callback=e??null,Tr(t,s,i),n.current.lanes=i,tl(n,i,r),Rt(n,r),n}function Kc(n,e,t,r){var i=e.current,s=gt(),o=Ar(i);return t=qw(t),e.context===null?e.context=t:e.pendingContext=t,e=On(s,o),e.payload={element:n},r=r===void 0?null:r,r!==null&&(e.callback=r),n=Tr(i,e,o),n!==null&&(sn(n,i,o,s),pu(n,i,o)),o}function ac(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function N_(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function am(n,e){N_(n,e),(n=n.alternate)&&N_(n,e)}function p1(){return null}var Kw=typeof reportError=="function"?reportError:function(n){};function lm(n){this._internalRoot=n}Hc.prototype.render=lm.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(U(409));Kc(n,e,null,null)};Hc.prototype.unmount=lm.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Si(function(){Kc(null,n,null,null)}),e[Mn]=null}};function Hc(n){this._internalRoot=n}Hc.prototype.unstable_scheduleHydration=function(n){if(n){var e=TE();n={blockedOn:null,target:n,priority:e};for(var t=0;t<lr.length&&e!==0&&e<lr[t].priority;t++);lr.splice(t,0,n),t===0&&AE(n)}};function um(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Gc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function x_(){}function m1(n,e,t,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var c=ac(o);s.call(c)}}var o=Ww(e,r,n,0,null,!1,!1,"",x_);return n._reactRootContainer=o,n[Mn]=o.current,ka(n.nodeType===8?n.parentNode:n),Si(),o}for(;i=n.lastChild;)n.removeChild(i);if(typeof r=="function"){var a=r;r=function(){var c=ac(u);a.call(c)}}var u=om(n,0,!1,null,null,!1,!1,"",x_);return n._reactRootContainer=u,n[Mn]=u.current,ka(n.nodeType===8?n.parentNode:n),Si(function(){Kc(e,u,t,r)}),u}function Qc(n,e,t,r,i){var s=t._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var a=i;i=function(){var u=ac(o);a.call(u)}}Kc(e,o,n,i)}else o=m1(t,e,n,i,r);return ac(o)}EE=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=jo(e.pendingLanes);t!==0&&(Cp(e,t|1),Rt(e,De()),!(se&6)&&(Vs=De()+500,$r()))}break;case 13:Si(function(){var r=Fn(n,1);if(r!==null){var i=gt();sn(r,n,1,i)}}),am(n,1)}};kp=function(n){if(n.tag===13){var e=Fn(n,134217728);if(e!==null){var t=gt();sn(e,n,134217728,t)}am(n,134217728)}};wE=function(n){if(n.tag===13){var e=Ar(n),t=Fn(n,e);if(t!==null){var r=gt();sn(t,n,e,r)}am(n,e)}};TE=function(){return ce};SE=function(n,e){var t=ce;try{return ce=n,e()}finally{ce=t}};nf=function(n,e,t){switch(e){case"input":if(Qd(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var r=t[e];if(r!==n&&r.form===n.form){var i=Uc(r);if(!i)throw Error(U(90));tE(r),Qd(r,i)}}}break;case"textarea":rE(n,t);break;case"select":e=t.value,e!=null&&fs(n,!!t.multiple,e,!1)}};cE=nm;hE=Si;var g1={usingClientEntryPoint:!1,Events:[rl,os,Uc,lE,uE,nm]},xo={findFiberByHostInstance:ui,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},y1={bundleType:xo.bundleType,version:xo.version,rendererPackageName:xo.rendererPackageName,rendererConfig:xo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Kn.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=pE(n),n===null?null:n.stateNode},findFiberByHostInstance:xo.findFiberByHostInstance||p1,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var eu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!eu.isDisabled&&eu.supportsFiber)try{Oc=eu.inject(y1),pn=eu}catch{}}Ut.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=g1;Ut.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!um(e))throw Error(U(200));return f1(n,e,null,t)};Ut.createRoot=function(n,e){if(!um(n))throw Error(U(299));var t=!1,r="",i=Kw;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=om(n,1,!1,null,null,t,!1,r,i),n[Mn]=e.current,ka(n.nodeType===8?n.parentNode:n),new lm(e)};Ut.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(U(188)):(n=Object.keys(n).join(","),Error(U(268,n)));return n=pE(e),n=n===null?null:n.stateNode,n};Ut.flushSync=function(n){return Si(n)};Ut.hydrate=function(n,e,t){if(!Gc(e))throw Error(U(200));return Qc(null,n,e,!0,t)};Ut.hydrateRoot=function(n,e,t){if(!um(n))throw Error(U(405));var r=t!=null&&t.hydratedSources||null,i=!1,s="",o=Kw;if(t!=null&&(t.unstable_strictMode===!0&&(i=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=Ww(e,null,n,1,t??null,i,!1,s,o),n[Mn]=e.current,ka(n),r)for(n=0;n<r.length;n++)t=r[n],i=t._getVersion,i=i(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,i]:e.mutableSourceEagerHydrationData.push(t,i);return new Hc(e)};Ut.render=function(n,e,t){if(!Gc(e))throw Error(U(200));return Qc(null,n,e,!1,t)};Ut.unmountComponentAtNode=function(n){if(!Gc(n))throw Error(U(40));return n._reactRootContainer?(Si(function(){Qc(null,null,n,!1,function(){n._reactRootContainer=null,n[Mn]=null})}),!0):!1};Ut.unstable_batchedUpdates=nm;Ut.unstable_renderSubtreeIntoContainer=function(n,e,t,r){if(!Gc(t))throw Error(U(200));if(n==null||n._reactInternals===void 0)throw Error(U(38));return Qc(n,e,t,!1,r)};Ut.version="18.3.1-next-f1338f8080-20240426";function Hw(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Hw)}catch{}}Hw(),HI.exports=Ut;var uO=HI.exports;const _1=()=>{};var b_={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gw=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},v1=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],o=n[t++],a=n[t++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=n[t++],o=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Qw={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],o=i+1<n.length,a=o?n[i+1]:0,u=i+2<n.length,c=u?n[i+2]:0,d=s>>2,p=(s&3)<<4|a>>4;let m=(a&15)<<2|c>>6,E=c&63;u||(E=64,o||(m=64)),r.push(t[d],t[p],t[m],t[E])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Gw(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):v1(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],a=i<n.length?t[n.charAt(i)]:0;++i;const c=i<n.length?t[n.charAt(i)]:64;++i;const p=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||a==null||c==null||p==null)throw new I1;const m=s<<2|a>>4;if(r.push(m),c!==64){const E=a<<4&240|c>>2;if(r.push(E),p!==64){const R=c<<6&192|p;r.push(R)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class I1 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const E1=function(n){const e=Gw(n);return Qw.encodeByteArray(e,!0)},lc=function(n){return E1(n).replace(/\./g,"")},Xw=function(n){try{return Qw.decodeString(n,!0)}catch{}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yw(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w1=()=>Yw().__FIREBASE_DEFAULTS__,T1=()=>{if(typeof process>"u"||typeof b_>"u")return;const n=b_.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},S1=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Xw(n[1]);return e&&JSON.parse(e)},Xc=()=>{try{return _1()||w1()||T1()||S1()}catch{return}},Jw=n=>{var e,t;return(t=(e=Xc())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},cO=n=>{const e=Jw(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Zw=()=>{var n;return(n=Xc())===null||n===void 0?void 0:n.config},eT=n=>{var e;return(e=Xc())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A1{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eo(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function tT(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hO(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[lc(JSON.stringify(t)),lc(JSON.stringify(o)),""].join(".")}const aa={};function P1(){const n={prod:[],emulator:[]};for(const e of Object.keys(aa))aa[e]?n.emulator.push(e):n.prod.push(e);return n}function R1(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let O_=!1;function C1(n,e){if(typeof window>"u"||typeof document>"u"||!eo(window.location.host)||aa[n]===e||aa[n]||O_)return;aa[n]=e;function t(m){return`__firebase__banner__${m}`}const r="__firebase__banner",s=P1().prod.length>0;function o(){const m=document.getElementById(r);m&&m.remove()}function a(m){m.style.display="flex",m.style.background="#7faaf0",m.style.position="fixed",m.style.bottom="5px",m.style.left="5px",m.style.padding=".5em",m.style.borderRadius="5px",m.style.alignItems="center"}function u(m,E){m.setAttribute("width","24"),m.setAttribute("id",E),m.setAttribute("height","24"),m.setAttribute("viewBox","0 0 24 24"),m.setAttribute("fill","none"),m.style.marginLeft="-6px"}function c(){const m=document.createElement("span");return m.style.cursor="pointer",m.style.marginLeft="16px",m.style.fontSize="24px",m.innerHTML=" &times;",m.onclick=()=>{O_=!0,o()},m}function d(m,E){m.setAttribute("id",E),m.innerText="Learn more",m.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",m.setAttribute("target","__blank"),m.style.paddingLeft="5px",m.style.textDecoration="underline"}function p(){const m=R1(r),E=t("text"),R=document.getElementById(E)||document.createElement("span"),D=t("learnmore"),O=document.getElementById(D)||document.createElement("a"),A=t("preprendIcon"),_=document.getElementById(A)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(m.created){const w=m.element;a(w),d(O,D);const x=c();u(_,A),w.append(_,R,O,x),document.body.appendChild(w)}s?(R.innerText="Preview backend disconnected.",_.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(_.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,R.innerText="Preview backend running in this workspace."),R.setAttribute("id",E)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",p):p()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function k1(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ze())}function nT(){var n;const e=(n=Xc())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function V1(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function D1(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function N1(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function x1(){const n=ze();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function rT(){return!nT()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function iT(){return!nT()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function sT(){try{return typeof indexedDB=="object"}catch{return!1}}function b1(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O1="FirebaseError";class Hn extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=O1,Object.setPrototypeOf(this,Hn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,sl.prototype.create)}}class sl{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?L1(s,r):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new Hn(i,a,r)}}function L1(n,e){return n.replace(M1,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const M1=/\{\$([^}]+)}/g;function F1(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ai(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],o=e[i];if(L_(s)&&L_(o)){if(!Ai(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function L_(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function to(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function qo(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Wo(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function U1(n,e){const t=new B1(n,e);return t.subscribe.bind(t)}class B1{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");z1(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=Pd),i.error===void 0&&(i.error=Pd),i.complete===void 0&&(i.complete=Pd);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch{}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function z1(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Pd(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ee(n){return n&&n._delegate?n._delegate:n}class Pi{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ni="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j1{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new A1;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(q1(e))try{this.getOrInitializeService({instanceIdentifier:ni})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=ni){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ni){return this.instances.has(e)}getOptions(e=ni){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(s);r===a&&o.resolve(i)}return i}onInit(e,t){var r;const i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:$1(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=ni){return this.component?this.component.multipleInstances?e:ni:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function $1(n){return n===ni?void 0:n}function q1(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W1{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new j1(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ne;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ne||(ne={}));const K1={debug:ne.DEBUG,verbose:ne.VERBOSE,info:ne.INFO,warn:ne.WARN,error:ne.ERROR,silent:ne.SILENT},H1=ne.INFO,G1={[ne.DEBUG]:"log",[ne.VERBOSE]:"log",[ne.INFO]:"info",[ne.WARN]:"warn",[ne.ERROR]:"error"},Q1=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=G1[e];if(!i)throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class cm{constructor(e){this.name=e,this._logLevel=H1,this._logHandler=Q1,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ne))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?K1[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ne.DEBUG,...e),this._logHandler(this,ne.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ne.VERBOSE,...e),this._logHandler(this,ne.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ne.INFO,...e),this._logHandler(this,ne.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ne.WARN,...e),this._logHandler(this,ne.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ne.ERROR,...e),this._logHandler(this,ne.ERROR,...e)}}const X1=(n,e)=>e.some(t=>n instanceof t);let M_,F_;function Y1(){return M_||(M_=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function J1(){return F_||(F_=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const oT=new WeakMap,Lf=new WeakMap,aT=new WeakMap,Rd=new WeakMap,hm=new WeakMap;function Z1(n){const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t(Rr(n.result)),i()},o=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&oT.set(t,n)}).catch(()=>{}),hm.set(e,n),e}function eC(n){if(Lf.has(n))return;const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});Lf.set(n,e)}let Mf={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Lf.get(n);if(e==="objectStoreNames")return n.objectStoreNames||aT.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Rr(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function tC(n){Mf=n(Mf)}function nC(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Cd(this),e,...t);return aT.set(r,e.sort?e.sort():[e]),Rr(r)}:J1().includes(n)?function(...e){return n.apply(Cd(this),e),Rr(oT.get(this))}:function(...e){return Rr(n.apply(Cd(this),e))}}function rC(n){return typeof n=="function"?nC(n):(n instanceof IDBTransaction&&eC(n),X1(n,Y1())?new Proxy(n,Mf):n)}function Rr(n){if(n instanceof IDBRequest)return Z1(n);if(Rd.has(n))return Rd.get(n);const e=rC(n);return e!==n&&(Rd.set(n,e),hm.set(e,n)),e}const Cd=n=>hm.get(n);function iC(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(n,e),a=Rr(o);return r&&o.addEventListener("upgradeneeded",u=>{r(Rr(o.result),u.oldVersion,u.newVersion,Rr(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),a.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const sC=["get","getKey","getAll","getAllKeys","count"],oC=["put","add","delete","clear"],kd=new Map;function U_(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(kd.get(e))return kd.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,i=oC.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||sC.includes(t)))return;const s=async function(o,...a){const u=this.transaction(o,i?"readwrite":"readonly");let c=u.store;return r&&(c=c.index(a.shift())),(await Promise.all([c[t](...a),i&&u.done]))[0]};return kd.set(e,s),s}tC(n=>({...n,get:(e,t,r)=>U_(e,t)||n.get(e,t,r),has:(e,t)=>!!U_(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aC{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(lC(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function lC(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ff="@firebase/app",B_="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn=new cm("@firebase/app"),uC="@firebase/app-compat",cC="@firebase/analytics-compat",hC="@firebase/analytics",dC="@firebase/app-check-compat",fC="@firebase/app-check",pC="@firebase/auth",mC="@firebase/auth-compat",gC="@firebase/database",yC="@firebase/data-connect",_C="@firebase/database-compat",vC="@firebase/functions",IC="@firebase/functions-compat",EC="@firebase/installations",wC="@firebase/installations-compat",TC="@firebase/messaging",SC="@firebase/messaging-compat",AC="@firebase/performance",PC="@firebase/performance-compat",RC="@firebase/remote-config",CC="@firebase/remote-config-compat",kC="@firebase/storage",VC="@firebase/storage-compat",DC="@firebase/firestore",NC="@firebase/ai",xC="@firebase/firestore-compat",bC="firebase",OC="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uf="[DEFAULT]",LC={[Ff]:"fire-core",[uC]:"fire-core-compat",[hC]:"fire-analytics",[cC]:"fire-analytics-compat",[fC]:"fire-app-check",[dC]:"fire-app-check-compat",[pC]:"fire-auth",[mC]:"fire-auth-compat",[gC]:"fire-rtdb",[yC]:"fire-data-connect",[_C]:"fire-rtdb-compat",[vC]:"fire-fn",[IC]:"fire-fn-compat",[EC]:"fire-iid",[wC]:"fire-iid-compat",[TC]:"fire-fcm",[SC]:"fire-fcm-compat",[AC]:"fire-perf",[PC]:"fire-perf-compat",[RC]:"fire-rc",[CC]:"fire-rc-compat",[kC]:"fire-gcs",[VC]:"fire-gcs-compat",[DC]:"fire-fst",[xC]:"fire-fst-compat",[NC]:"fire-vertex","fire-js":"fire-js",[bC]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uc=new Map,MC=new Map,Bf=new Map;function z_(n,e){try{n.container.addComponent(e)}catch(t){Bn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ds(n){const e=n.name;if(Bf.has(e))return Bn.debug(`There were multiple attempts to register component ${e}.`),!1;Bf.set(e,n);for(const t of uc.values())z_(t,n);for(const t of MC.values())z_(t,n);return!0}function dm(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ue(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FC={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Cr=new sl("app","Firebase",FC);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UC{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Pi("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Cr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const no=OC;function BC(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Uf,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw Cr.create("bad-app-name",{appName:String(i)});if(t||(t=Zw()),!t)throw Cr.create("no-options");const s=uc.get(i);if(s){if(Ai(t,s.options)&&Ai(r,s.config))return s;throw Cr.create("duplicate-app",{appName:i})}const o=new W1(i);for(const u of Bf.values())o.addComponent(u);const a=new UC(t,r,o);return uc.set(i,a),a}function zC(n=Uf){const e=uc.get(n);if(!e&&n===Uf&&Zw())return BC();if(!e)throw Cr.create("no-app",{appName:n});return e}function kr(n,e,t){var r;let i=(r=LC[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${i}" with version "${e}":`];s&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Bn.warn(a.join(" "));return}Ds(new Pi(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jC="firebase-heartbeat-database",$C=1,Fa="firebase-heartbeat-store";let Vd=null;function lT(){return Vd||(Vd=iC(jC,$C,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Fa)}catch{}}}}).catch(n=>{throw Cr.create("idb-open",{originalErrorMessage:n.message})})),Vd}async function qC(n){try{const t=(await lT()).transaction(Fa),r=await t.objectStore(Fa).get(uT(n));return await t.done,r}catch(e){if(e instanceof Hn)Bn.warn(e.message);else{const t=Cr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Bn.warn(t.message)}}}async function j_(n,e){try{const r=(await lT()).transaction(Fa,"readwrite");await r.objectStore(Fa).put(e,uT(n)),await r.done}catch(t){if(t instanceof Hn)Bn.warn(t.message);else{const r=Cr.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Bn.warn(r.message)}}}function uT(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WC=1024,KC=30;class HC{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new QC(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=$_();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>KC){const o=XC(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Bn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=$_(),{heartbeatsToSend:r,unsentEntries:i}=GC(this._heartbeatsCache.heartbeats),s=lc(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Bn.warn(t),""}}}function $_(){return new Date().toISOString().substring(0,10)}function GC(n,e=WC){const t=[];let r=n.slice();for(const i of n){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),q_(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),q_(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class QC{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return sT()?b1().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await qC(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return j_(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return j_(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function q_(n){return lc(JSON.stringify({version:2,heartbeats:n})).length}function XC(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YC(n){Ds(new Pi("platform-logger",e=>new aC(e),"PRIVATE")),Ds(new Pi("heartbeat",e=>new HC(e),"PRIVATE")),kr(Ff,B_,n),kr(Ff,B_,"esm2017"),kr("fire-js","")}YC("");var JC="firebase",ZC="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */kr(JC,ZC,"app");function fm(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(n);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(n,r[i])&&(t[r[i]]=n[r[i]]);return t}function cT(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ek=cT,hT=new sl("auth","Firebase",cT());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cc=new cm("@firebase/auth");function tk(n,...e){cc.logLevel<=ne.WARN&&cc.warn(`Auth (${no}): ${n}`,...e)}function Eu(n,...e){cc.logLevel<=ne.ERROR&&cc.error(`Auth (${no}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qt(n,...e){throw mm(n,...e)}function Ct(n,...e){return mm(n,...e)}function pm(n,e,t){const r=Object.assign(Object.assign({},ek()),{[e]:t});return new sl("auth","Firebase",r).create(e,{appName:n.name})}function yt(n){return pm(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Yc(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Qt(n,"argument-error"),pm(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function mm(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return hT.create(n,...e)}function j(n,e,...t){if(!n)throw mm(e,...t)}function Nn(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Eu(e),new Error(e)}function zn(n,e){n||Nn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ua(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function gm(){return W_()==="http:"||W_()==="https:"}function W_(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nk(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(gm()||D1()||"connection"in navigator)?navigator.onLine:!0}function rk(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(e,t){this.shortDelay=e,this.longDelay=t,zn(t>e,"Short delay should be less than long delay!"),this.isMobile=k1()||N1()}get(){return nk()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ym(n,e){zn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dT{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Nn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Nn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Nn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ik={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sk=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ok=new ol(3e4,6e4);function je(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function $e(n,e,t,r,i={}){return fT(n,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const a=to(Object.assign({key:n.config.apiKey},o)).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);const c=Object.assign({method:e,headers:u},s);return V1()||(c.referrerPolicy="no-referrer"),n.emulatorConfig&&eo(n.emulatorConfig.host)&&(c.credentials="include"),dT.fetch()(await pT(n,n.config.apiHost,t,a),c)})}async function fT(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},ik),e);try{const i=new lk(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Ko(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const a=s.ok?o.errorMessage:o.error.message,[u,c]=a.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ko(n,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Ko(n,"email-already-in-use",o);if(u==="USER_DISABLED")throw Ko(n,"user-disabled",o);const d=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw pm(n,d,c);Qt(n,d)}}catch(i){if(i instanceof Hn)throw i;Qt(n,"network-request-failed",{message:String(i)})}}async function Gn(n,e,t,r,i={}){const s=await $e(n,e,t,r,i);return"mfaPendingCredential"in s&&Qt(n,"multi-factor-auth-required",{_serverResponse:s}),s}async function pT(n,e,t,r){const i=`${e}${t}?${r}`,s=n,o=s.config.emulator?ym(n.config,i):`${n.config.apiScheme}://${i}`;return sk.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function ak(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class lk{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Ct(this.auth,"network-request-failed")),ok.get())})}}function Ko(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=Ct(n,e,r);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K_(n){return n!==void 0&&n.getResponse!==void 0}function H_(n){return n!==void 0&&n.enterprise!==void 0}class mT{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return ak(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uk(n){return(await $e(n,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function gT(n,e){return $e(n,"GET","/v2/recaptchaConfig",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ck(n,e){return $e(n,"POST","/v1/accounts:delete",e)}async function hk(n,e){return $e(n,"POST","/v1/accounts:update",e)}async function hc(n,e){return $e(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function la(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function dk(n,e=!1){const t=ee(n),r=await t.getIdToken(e),i=Jc(r);j(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:la(Dd(i.auth_time)),issuedAtTime:la(Dd(i.iat)),expirationTime:la(Dd(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Dd(n){return Number(n)*1e3}function Jc(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Eu("JWT malformed, contained fewer than 3 sections"),null;try{const i=Xw(t);return i?JSON.parse(i):(Eu("Failed to decode base64 JWT payload"),null)}catch(i){return Eu("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function G_(n){const e=Jc(n);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ri(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Hn&&fk(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function fk({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pk{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=la(this.lastLoginAt),this.creationTime=la(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ba(n){var e;const t=n.auth,r=await n.getIdToken(),i=await Ri(n,hc(t,{idToken:r}));j(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?yT(s.providerUserInfo):[],a=gk(n.providerData,o),u=n.isAnonymous,c=!(n.email&&s.passwordHash)&&!(a!=null&&a.length),d=u?c:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new zf(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(n,p)}async function mk(n){const e=ee(n);await Ba(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function gk(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function yT(n){return n.map(e=>{var{providerId:t}=e,r=fm(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yk(n,e){const t=await fT(n,{},async()=>{const r=to({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,o=await pT(n,i,"/v1/token",`key=${s}`),a=await n._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:a,body:r};return n.emulatorConfig&&eo(n.emulatorConfig.host)&&(u.credentials="include"),dT.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function _k(n,e){return $e(n,"POST","/v2/accounts:revokeToken",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):G_(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){j(e.length!==0,"internal-error");const t=G_(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await yk(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,o=new vs;return r&&(j(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(j(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(j(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new vs,this.toJSON())}_performRefresh(){return Nn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nr(n,e){j(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class nn{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=fm(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new pk(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new zf(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Ri(this,this.stsTokenManager.getToken(this.auth,e));return j(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return dk(this,e)}reload(){return mk(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new nn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Ba(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ue(this.auth.app))return Promise.reject(yt(this.auth));const e=await this.getIdToken();return await Ri(this,ck(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,o,a,u,c,d;const p=(r=t.displayName)!==null&&r!==void 0?r:void 0,m=(i=t.email)!==null&&i!==void 0?i:void 0,E=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,R=(o=t.photoURL)!==null&&o!==void 0?o:void 0,D=(a=t.tenantId)!==null&&a!==void 0?a:void 0,O=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,A=(c=t.createdAt)!==null&&c!==void 0?c:void 0,_=(d=t.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:w,emailVerified:x,isAnonymous:F,providerData:M,stsTokenManager:v}=t;j(w&&v,e,"internal-error");const y=vs.fromJSON(this.name,v);j(typeof w=="string",e,"internal-error"),nr(p,e.name),nr(m,e.name),j(typeof x=="boolean",e,"internal-error"),j(typeof F=="boolean",e,"internal-error"),nr(E,e.name),nr(R,e.name),nr(D,e.name),nr(O,e.name),nr(A,e.name),nr(_,e.name);const I=new nn({uid:w,auth:e,email:m,emailVerified:x,displayName:p,isAnonymous:F,photoURL:R,phoneNumber:E,tenantId:D,stsTokenManager:y,createdAt:A,lastLoginAt:_});return M&&Array.isArray(M)&&(I.providerData=M.map(T=>Object.assign({},T))),O&&(I._redirectEventId=O),I}static async _fromIdTokenResponse(e,t,r=!1){const i=new vs;i.updateFromServerResponse(t);const s=new nn({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Ba(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];j(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?yT(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),a=new vs;a.updateFromIdToken(r);const u=new nn({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new zf(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q_=new Map;function xn(n){zn(n instanceof Function,"Expected a class definition");let e=Q_.get(n);return e?(zn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Q_.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _T{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}_T.type="NONE";const X_=_T;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wu(n,e,t){return`firebase:${n}:${e}:${t}`}class Is{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=wu(this.userKey,i.apiKey,s),this.fullPersistenceKey=wu("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await hc(this.auth,{idToken:e}).catch(()=>{});return t?nn._fromGetAccountInfoResponse(this.auth,t,e):null}return nn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Is(xn(X_),e,r);const i=(await Promise.all(t.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||xn(X_);const o=wu(r,e.config.apiKey,e.name);let a=null;for(const c of t)try{const d=await c._get(o);if(d){let p;if(typeof d=="string"){const m=await hc(e,{idToken:d}).catch(()=>{});if(!m)break;p=await nn._fromGetAccountInfoResponse(e,m,d)}else p=nn._fromJSON(e,d);c!==s&&(a=p),s=c;break}}catch{}const u=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new Is(s,e,r):(s=u[0],a&&await s._set(o,a.toJSON()),await Promise.all(t.map(async c=>{if(c!==s)try{await c._remove(o)}catch{}})),new Is(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y_(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(wT(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(vT(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ST(e))return"Blackberry";if(AT(e))return"Webos";if(IT(e))return"Safari";if((e.includes("chrome/")||ET(e))&&!e.includes("edge/"))return"Chrome";if(TT(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function vT(n=ze()){return/firefox\//i.test(n)}function IT(n=ze()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function ET(n=ze()){return/crios\//i.test(n)}function wT(n=ze()){return/iemobile/i.test(n)}function TT(n=ze()){return/android/i.test(n)}function ST(n=ze()){return/blackberry/i.test(n)}function AT(n=ze()){return/webos/i.test(n)}function _m(n=ze()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function vk(n=ze()){var e;return _m(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Ik(){return x1()&&document.documentMode===10}function PT(n=ze()){return _m(n)||TT(n)||AT(n)||ST(n)||/windows phone/i.test(n)||wT(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RT(n,e=[]){let t;switch(n){case"Browser":t=Y_(ze());break;case"Worker":t=`${Y_(ze())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${no}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ek{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((o,a)=>{try{const u=e(s);o(u)}catch(u){a(u)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wk(n,e={}){return $e(n,"GET","/v2/passwordPolicy",je(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tk=6;class Sk{constructor(e){var t,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:Tk,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,o,a;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(a=u.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),u}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ak{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new J_(this),this.idTokenSubscription=new J_(this),this.beforeStateQueue=new Ek(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=hT,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=xn(t)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await Is.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await hc(this,{idToken:e}),r=await nn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch{await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ue(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,a=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===a)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ba(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=rk()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ue(this.app))return Promise.reject(yt(this));const t=e?ee(e):null;return t&&j(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ue(this.app)?Promise.reject(yt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ue(this.app)?Promise.reject(yt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(xn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await wk(this),t=new Sk(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new sl("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await _k(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&xn(e)||this._popupRedirectResolver;j(t,this,"argument-error"),this.redirectPersistenceManager=await Is.create(this,[xn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=RT(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;if(Ue(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&tk(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Ge(n){return ee(n)}class J_{constructor(e){this.auth=e,this.observer=null,this.addObserver=U1(t=>this.observer=t)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let al={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Pk(n){al=n}function vm(n){return al.loadJS(n)}function Rk(){return al.recaptchaV2Script}function Ck(){return al.recaptchaEnterpriseScript}function kk(){return al.gapiScript}function CT(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vk=500,Dk=6e4,tu=1e12;class Nk{constructor(e){this.auth=e,this.counter=tu,this._widgets=new Map}render(e,t){const r=this.counter;return this._widgets.set(r,new Ok(e,this.auth.name,t||{})),this.counter++,r}reset(e){var t;const r=e||tu;(t=this._widgets.get(r))===null||t===void 0||t.delete(),this._widgets.delete(r)}getResponse(e){var t;const r=e||tu;return((t=this._widgets.get(r))===null||t===void 0?void 0:t.getResponse())||""}async execute(e){var t;const r=e||tu;return(t=this._widgets.get(r))===null||t===void 0||t.execute(),""}}class xk{constructor(){this.enterprise=new bk}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class bk{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Ok{constructor(e,t,r){this.params=r,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const i=typeof e=="string"?document.getElementById(e):e;j(i,"argument-error",{appName:t}),this.container=i,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=Lk(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},Dk)},Vk))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function Lk(n){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<n;r++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}const Mk="recaptcha-enterprise",ua="NO_RECAPTCHA";class kT{constructor(e){this.type=Mk,this.auth=Ge(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,a)=>{gT(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const c=new mT(u);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,o(c.siteKey)}}).catch(u=>{a(u)})})}function i(s,o,a){const u=window.grecaptcha;H_(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(c=>{o(c)}).catch(()=>{o(ua)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new xk().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{r(this.auth).then(a=>{if(!t&&H_(window.grecaptcha))i(a,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=Ck();u.length!==0&&(u+=a),vm(u).then(()=>{i(a,s,o)}).catch(c=>{o(c)})}}).catch(a=>{o(a)})})}}async function bo(n,e,t,r=!1,i=!1){const s=new kT(n);let o;if(i)o=ua;else try{o=await s.verify(t)}catch{o=await s.verify(t,!0)}const a=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){const u=a.phoneEnrollmentInfo.phoneNumber,c=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const u=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Vr(n,e,t,r,i){var s,o;if(i==="EMAIL_PASSWORD_PROVIDER")if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await bo(n,e,t,t==="getOobCode");return r(n,a)}else return r(n,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){const u=await bo(n,e,t,t==="getOobCode");return r(n,u)}else return Promise.reject(a)});else if(i==="PHONE_PROVIDER")if(!((o=n._getRecaptchaConfig())===null||o===void 0)&&o.isProviderEnabled("PHONE_PROVIDER")){const a=await bo(n,e,t);return r(n,a).catch(async u=>{var c;if(((c=n._getRecaptchaConfig())===null||c===void 0?void 0:c.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(u.code==="auth/missing-recaptcha-token"||u.code==="auth/invalid-app-credential")){const d=await bo(n,e,t,!1,!0);return r(n,d)}return Promise.reject(u)})}else{const a=await bo(n,e,t,!1,!0);return r(n,a)}else return Promise.reject(i+" provider is not supported.")}async function Fk(n){const e=Ge(n),t=await gT(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new mT(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new kT(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uk(n,e){const t=dm(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(Ai(s,e??{}))return i;Qt(i,"already-initialized")}return t.initialize({options:e})}function Bk(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(xn);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function zk(n,e,t){const r=Ge(n);j(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=VT(e),{host:o,port:a}=jk(e),u=a===null?"":`:${a}`,c={url:`${s}//${o}${u}/`},d=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){j(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),j(Ai(c,r.config.emulator)&&Ai(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,eo(o)?(tT(`${s}//${o}${u}`),C1("Auth",!0)):$k()}function VT(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function jk(n){const e=VT(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Z_(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Z_(o)}}}function Z_(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function $k(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Nn("not implemented")}_getIdTokenResponse(e){return Nn("not implemented")}_linkToIdToken(e,t){return Nn("not implemented")}_getReauthenticationResolver(e){return Nn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qk(n,e){return $e(n,"POST","/v1/accounts:resetPassword",je(n,e))}async function Wk(n,e){return $e(n,"POST","/v1/accounts:update",e)}async function Kk(n,e){return $e(n,"POST","/v1/accounts:signUp",e)}async function Hk(n,e){return $e(n,"POST","/v1/accounts:update",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gk(n,e){return Gn(n,"POST","/v1/accounts:signInWithPassword",je(n,e))}async function eh(n,e){return $e(n,"POST","/v1/accounts:sendOobCode",je(n,e))}async function Qk(n,e){return eh(n,e)}async function Xk(n,e){return eh(n,e)}async function Yk(n,e){return eh(n,e)}async function Jk(n,e){return eh(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zk(n,e){return Gn(n,"POST","/v1/accounts:signInWithEmailLink",je(n,e))}async function eV(n,e){return Gn(n,"POST","/v1/accounts:signInWithEmailLink",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class za extends Zc{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new za(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new za(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Vr(e,t,"signInWithPassword",Gk,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Zk(e,{email:this._email,oobCode:this._password});default:Qt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Vr(e,r,"signUpPassword",Kk,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return eV(e,{idToken:t,email:this._email,oobCode:this._password});default:Qt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Es(n,e){return Gn(n,"POST","/v1/accounts:signInWithIdp",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tV="http://localhost";class jn extends Zc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new jn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Qt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=fm(t,["providerId","signInMethod"]);if(!r||!i)return null;const o=new jn(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Es(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Es(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Es(e,t)}buildRequest(){const e={requestUri:tV,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=to(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ev(n,e){return $e(n,"POST","/v1/accounts:sendVerificationCode",je(n,e))}async function nV(n,e){return Gn(n,"POST","/v1/accounts:signInWithPhoneNumber",je(n,e))}async function rV(n,e){const t=await Gn(n,"POST","/v1/accounts:signInWithPhoneNumber",je(n,e));if(t.temporaryProof)throw Ko(n,"account-exists-with-different-credential",t);return t}const iV={USER_NOT_FOUND:"user-not-found"};async function sV(n,e){const t=Object.assign(Object.assign({},e),{operation:"REAUTH"});return Gn(n,"POST","/v1/accounts:signInWithPhoneNumber",je(n,t),iV)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ca extends Zc{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new ca({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new ca({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return nV(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return rV(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return sV(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:i}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:i}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s}=e;return!r&&!t&&!i&&!s?null:new ca({verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oV(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function aV(n){const e=qo(Wo(n)).link,t=e?qo(Wo(e)).deep_link_id:null,r=qo(Wo(n)).deep_link_id;return(r?qo(Wo(r)).link:null)||r||t||e||n}class th{constructor(e){var t,r,i,s,o,a;const u=qo(Wo(e)),c=(t=u.apiKey)!==null&&t!==void 0?t:null,d=(r=u.oobCode)!==null&&r!==void 0?r:null,p=oV((i=u.mode)!==null&&i!==void 0?i:null);j(c&&d&&p,"argument-error"),this.apiKey=c,this.operation=p,this.code=d,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.lang)!==null&&o!==void 0?o:null,this.tenantId=(a=u.tenantId)!==null&&a!==void 0?a:null}static parseLink(e){const t=aV(e);try{return new th(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(){this.providerId=Mi.PROVIDER_ID}static credential(e,t){return za._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=th.parseLink(t);return j(r,"argument-error"),za._fromEmailAndCode(e,r.code,r.tenantId)}}Mi.PROVIDER_ID="password";Mi.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Mi.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io extends ro{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class Tu extends io{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return j("providerId"in t&&"signInMethod"in t,"argument-error"),jn._fromParams(t)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return j(e.idToken||e.accessToken,"argument-error"),jn._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return Tu.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return Tu.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r,oauthTokenSecret:i,pendingToken:s,nonce:o,providerId:a}=e;if(!r&&!i&&!t&&!s||!a)return null;try{return new Tu(a)._credential({idToken:t,accessToken:r,nonce:o,pendingToken:s})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr extends io{constructor(){super("facebook.com")}static credential(e){return jn._fromParams({providerId:cr.PROVIDER_ID,signInMethod:cr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return cr.credentialFromTaggedObject(e)}static credentialFromError(e){return cr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return cr.credential(e.oauthAccessToken)}catch{return null}}}cr.FACEBOOK_SIGN_IN_METHOD="facebook.com";cr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr extends io{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return jn._fromParams({providerId:hr.PROVIDER_ID,signInMethod:hr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return hr.credentialFromTaggedObject(e)}static credentialFromError(e){return hr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return hr.credential(t,r)}catch{return null}}}hr.GOOGLE_SIGN_IN_METHOD="google.com";hr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr extends io{constructor(){super("github.com")}static credential(e){return jn._fromParams({providerId:dr.PROVIDER_ID,signInMethod:dr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return dr.credentialFromTaggedObject(e)}static credentialFromError(e){return dr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return dr.credential(e.oauthAccessToken)}catch{return null}}}dr.GITHUB_SIGN_IN_METHOD="github.com";dr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr extends io{constructor(){super("twitter.com")}static credential(e,t){return jn._fromParams({providerId:fr.PROVIDER_ID,signInMethod:fr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return fr.credentialFromTaggedObject(e)}static credentialFromError(e){return fr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return fr.credential(t,r)}catch{return null}}}fr.TWITTER_SIGN_IN_METHOD="twitter.com";fr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function DT(n,e){return Gn(n,"POST","/v1/accounts:signUp",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await nn._fromIdTokenResponse(e,r,i),o=tv(r);return new vn({user:s,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=tv(r);return new vn({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function tv(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dO(n){var e;if(Ue(n.app))return Promise.reject(yt(n));const t=Ge(n);if(await t._initializationPromise,!((e=t.currentUser)===null||e===void 0)&&e.isAnonymous)return new vn({user:t.currentUser,providerId:null,operationType:"signIn"});const r=await DT(t,{returnSecureToken:!0}),i=await vn._fromIdTokenResponse(t,"signIn",r,!0);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dc extends Hn{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,dc.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new dc(e,t,r,i)}}function NT(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?dc._fromErrorAndOperation(n,s,e,r):s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xT(n){return new Set(n.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fO(n,e){const t=ee(n);await nh(!0,t,e);const{providerUserInfo:r}=await hk(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),i=xT(r||[]);return t.providerData=t.providerData.filter(s=>i.has(s.providerId)),i.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function bT(n,e,t=!1){const r=await Ri(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return vn._forOperation(n,"link",r)}async function nh(n,e,t){await Ba(e);const r=xT(e.providerData),i=n===!1?"provider-already-linked":"no-such-provider";j(r.has(t)===n,e.auth,i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lV(n,e,t=!1){const{auth:r}=n;if(Ue(r.app))return Promise.reject(yt(r));const i="reauthenticate";try{const s=await Ri(n,NT(r,i,e,n),t);j(s.idToken,r,"internal-error");const o=Jc(s.idToken);j(o,r,"internal-error");const{sub:a}=o;return j(n.uid===a,r,"user-mismatch"),vn._forOperation(n,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Qt(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function OT(n,e,t=!1){if(Ue(n.app))return Promise.reject(yt(n));const r="signIn",i=await NT(n,r,e),s=await vn._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}async function Im(n,e){return OT(Ge(n),e)}async function uV(n,e){const t=ee(n);return await nh(!1,t,e.providerId),bT(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cV(n,e){return Gn(n,"POST","/v1/accounts:signInWithCustomToken",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pO(n,e){if(Ue(n.app))return Promise.reject(yt(n));const t=Ge(n),r=await cV(t,{token:e,returnSecureToken:!0}),i=await vn._fromIdTokenResponse(t,"signIn",r);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rh(n,e,t){var r;j(((r=t.url)===null||r===void 0?void 0:r.length)>0,n,"invalid-continue-uri"),j(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,n,"invalid-dynamic-link-domain"),j(typeof t.linkDomain>"u"||t.linkDomain.length>0,n,"invalid-hosting-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.linkDomain=t.linkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(j(t.iOS.bundleId.length>0,n,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(j(t.android.packageName.length>0,n,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Em(n){const e=Ge(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function mO(n,e,t){const r=Ge(n),i={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&rh(r,i,t),await Vr(r,i,"getOobCode",Xk,"EMAIL_PASSWORD_PROVIDER")}async function gO(n,e,t){await qk(ee(n),{oobCode:e,newPassword:t}).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Em(n),r})}async function yO(n,e){await Hk(ee(n),{oobCode:e})}async function _O(n,e,t){if(Ue(n.app))return Promise.reject(yt(n));const r=Ge(n),o=await Vr(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",DT,"EMAIL_PASSWORD_PROVIDER").catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Em(n),u}),a=await vn._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(a.user),a}function vO(n,e,t){return Ue(n.app)?Promise.reject(yt(n)):Im(ee(n),Mi.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Em(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function IO(n,e,t){const r=Ge(n),i={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function s(o,a){j(a.handleCodeInApp,r,"argument-error"),a&&rh(r,o,a)}s(i,t),await Vr(r,i,"getOobCode",Yk,"EMAIL_PASSWORD_PROVIDER")}function EO(n,e){const t=th.parseLink(e);return(t==null?void 0:t.operation)==="EMAIL_SIGNIN"}async function wO(n,e,t){if(Ue(n.app))return Promise.reject(yt(n));const r=ee(n),i=Mi.credentialWithLink(e,t||Ua());return j(i._tenantId===(r.tenantId||null),r,"tenant-id-mismatch"),Im(r,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hV(n,e){return $e(n,"POST","/v1/accounts:createAuthUri",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TO(n,e){const t=gm()?Ua():"http://localhost",r={identifier:e,continueUri:t},{signinMethods:i}=await hV(ee(n),r);return i||[]}async function SO(n,e){const t=ee(n),i={requestType:"VERIFY_EMAIL",idToken:await n.getIdToken()};e&&rh(t.auth,i,e);const{email:s}=await Qk(t.auth,i);s!==n.email&&await n.reload()}async function AO(n,e,t){const r=ee(n),s={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await n.getIdToken(),newEmail:e};t&&rh(r.auth,s,t);const{email:o}=await Jk(r.auth,s);o!==n.email&&await n.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dV(n,e){return $e(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PO(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=ee(n),s={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await Ri(r,dV(r.auth,s));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const a=r.providerData.find(({providerId:u})=>u==="password");a&&(a.displayName=r.displayName,a.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function RO(n,e){const t=ee(n);return Ue(t.auth.app)?Promise.reject(yt(t.auth)):LT(t,e,null)}function CO(n,e){return LT(ee(n),null,e)}async function LT(n,e,t){const{auth:r}=n,s={idToken:await n.getIdToken(),returnSecureToken:!0};e&&(s.email=e),t&&(s.password=t);const o=await Ri(n,Wk(r,s));await n._updateTokensIfNecessary(o,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fV(n){var e,t;if(!n)return null;const{providerId:r}=n,i=n.rawUserInfo?JSON.parse(n.rawUserInfo):{},s=n.isNewUser||n.kind==="identitytoolkit#SignupNewUserResponse";if(!r&&(n!=null&&n.idToken)){const o=(t=(e=Jc(n.idToken))===null||e===void 0?void 0:e.firebase)===null||t===void 0?void 0:t.sign_in_provider;if(o){const a=o!=="anonymous"&&o!=="custom"?o:null;return new ws(s,a)}}if(!r)return null;switch(r){case"facebook.com":return new pV(s,i);case"github.com":return new mV(s,i);case"google.com":return new gV(s,i);case"twitter.com":return new yV(s,i,n.screenName||null);case"custom":case"anonymous":return new ws(s,null);default:return new ws(s,r,i)}}class ws{constructor(e,t,r={}){this.isNewUser=e,this.providerId=t,this.profile=r}}class MT extends ws{constructor(e,t,r,i){super(e,t,r),this.username=i}}class pV extends ws{constructor(e,t){super(e,"facebook.com",t)}}class mV extends MT{constructor(e,t){super(e,"github.com",t,typeof(t==null?void 0:t.login)=="string"?t==null?void 0:t.login:null)}}class gV extends ws{constructor(e,t){super(e,"google.com",t)}}class yV extends MT{constructor(e,t,r){super(e,"twitter.com",t,r)}}function kO(n){const{user:e,_tokenResponse:t}=n;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:fV(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function VO(n,e){return ee(n).setPersistence(e)}function _V(n,e,t,r){return ee(n).onIdTokenChanged(e,t,r)}function vV(n,e,t){return ee(n).beforeAuthStateChanged(e,t)}function DO(n,e,t,r){return ee(n).onAuthStateChanged(e,t,r)}function NO(n){return ee(n).signOut()}function xO(n,e){return Ge(n).revokeAccessToken(e)}async function bO(n){return ee(n).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nv(n,e){return $e(n,"POST","/v2/accounts/mfaEnrollment:start",je(n,e))}const fc="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FT{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(fc,"1"),this.storage.removeItem(fc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IV=1e3,EV=10;class UT extends FT{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=PT(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,u)=>{this.notifyListeners(o,u)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);Ik()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,EV):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},IV)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}UT.type="LOCAL";const wV=UT;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BT extends FT{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}BT.type="SESSION";const zT=BT;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TV(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new ih(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const a=Array.from(o).map(async c=>c(t.origin,s)),u=await TV(a);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ih.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sh(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SV{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,u)=>{const c=sh("",20);i.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(p){const m=p;if(m.data.eventId===c)switch(m.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(m.data.response);break;default:clearTimeout(d),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(){return window}function AV(n){Oe().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wm(){return typeof Oe().WorkerGlobalScope<"u"&&typeof Oe().importScripts=="function"}async function PV(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function RV(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function CV(){return wm()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jT="firebaseLocalStorageDb",kV=1,pc="firebaseLocalStorage",$T="fbase_key";class ll{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function oh(n,e){return n.transaction([pc],e?"readwrite":"readonly").objectStore(pc)}function VV(){const n=indexedDB.deleteDatabase(jT);return new ll(n).toPromise()}function jf(){const n=indexedDB.open(jT,kV);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(pc,{keyPath:$T})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(pc)?e(r):(r.close(),await VV(),e(await jf()))})})}async function rv(n,e,t){const r=oh(n,!0).put({[$T]:e,value:t});return new ll(r).toPromise()}async function DV(n,e){const t=oh(n,!1).get(e),r=await new ll(t).toPromise();return r===void 0?null:r.value}function iv(n,e){const t=oh(n,!0).delete(e);return new ll(t).toPromise()}const NV=800,xV=3;class qT{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await jf(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>xV)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return wm()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ih._getInstance(CV()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await PV(),!this.activeServiceWorker)return;this.sender=new SV(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||RV()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await jf();return await rv(e,fc,"1"),await iv(e,fc),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>rv(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>DV(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>iv(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=oh(i,!1).getAll();return new ll(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),NV)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}qT.type="LOCAL";const bV=qT;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sv(n,e){return $e(n,"POST","/v2/accounts/mfaSignIn:start",je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nd=CT("rcb"),OV=new ol(3e4,6e4);class LV{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(!((e=Oe().grecaptcha)===null||e===void 0)&&e.render)}load(e,t=""){return j(MV(t),e,"argument-error"),this.shouldResolveImmediately(t)&&K_(Oe().grecaptcha)?Promise.resolve(Oe().grecaptcha):new Promise((r,i)=>{const s=Oe().setTimeout(()=>{i(Ct(e,"network-request-failed"))},OV.get());Oe()[Nd]=()=>{Oe().clearTimeout(s),delete Oe()[Nd];const a=Oe().grecaptcha;if(!a||!K_(a)){i(Ct(e,"internal-error"));return}const u=a.render;a.render=(c,d)=>{const p=u(c,d);return this.counter++,p},this.hostLanguage=t,r(a)};const o=`${Rk()}?${to({onload:Nd,render:"explicit",hl:t})}`;vm(o).catch(()=>{clearTimeout(s),i(Ct(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(!((t=Oe().grecaptcha)===null||t===void 0)&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function MV(n){return n.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(n)}class FV{async load(e){return new Nk(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ha="recaptcha",UV={theme:"light",type:"image"};class OO{constructor(e,t,r=Object.assign({},UV)){this.parameters=r,this.type=ha,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=Ge(e),this.isInvisible=this.parameters.size==="invisible",j(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const i=typeof t=="string"?document.getElementById(t):t;j(i,this.auth,"argument-error"),this.container=i,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new FV:new LV,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),r=t.getResponse(e);return r||new Promise(i=>{const s=o=>{o&&(this.tokenChangeListeners.delete(s),i(o))};this.tokenChangeListeners.add(s),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){j(!this.parameters.sitekey,this.auth,"argument-error"),j(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),j(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(r=>r(t)),typeof e=="function")e(t);else if(typeof e=="string"){const r=Oe()[e];typeof r=="function"&&r(t)}}}assertNotDestroyed(){j(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){j(gm()&&!wm(),this.auth,"internal-error"),await BV(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await uk(this.auth);j(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return j(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function BV(){let n=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}n=()=>e(),window.addEventListener("load",n)}).catch(e=>{throw n&&window.removeEventListener("load",n),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WT{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=ca._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function LO(n,e,t){if(Ue(n.app))return Promise.reject(yt(n));const r=Ge(n),i=await KT(r,e,ee(t));return new WT(i,s=>Im(r,s))}async function MO(n,e,t){const r=ee(n);await nh(!1,r,"phone");const i=await KT(r.auth,e,ee(t));return new WT(i,s=>uV(r,s))}async function KT(n,e,t){var r;if(!n._getRecaptchaConfig())try{await Fk(n)}catch{}try{let i;if(typeof e=="string"?i={phoneNumber:e}:i=e,"session"in i){const s=i.session;if("phoneNumber"in i){j(s.type==="enroll",n,"internal-error");const o={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Vr(n,o,"mfaSmsEnrollment",async(d,p)=>{if(p.phoneEnrollmentInfo.captchaResponse===ua){j((t==null?void 0:t.type)===ha,d,"argument-error");const m=await xd(d,p,t);return nv(d,m)}return nv(d,p)},"PHONE_PROVIDER").catch(d=>Promise.reject(d))).phoneSessionInfo.sessionInfo}else{j(s.type==="signin",n,"internal-error");const o=((r=i.multiFactorHint)===null||r===void 0?void 0:r.uid)||i.multiFactorUid;j(o,n,"missing-multi-factor-info");const a={mfaPendingCredential:s.credential,mfaEnrollmentId:o,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Vr(n,a,"mfaSmsSignIn",async(p,m)=>{if(m.phoneSignInInfo.captchaResponse===ua){j((t==null?void 0:t.type)===ha,p,"argument-error");const E=await xd(p,m,t);return sv(p,E)}return sv(p,m)},"PHONE_PROVIDER").catch(p=>Promise.reject(p))).phoneResponseInfo.sessionInfo}}else{const s={phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Vr(n,s,"sendVerificationCode",async(c,d)=>{if(d.captchaResponse===ua){j((t==null?void 0:t.type)===ha,c,"argument-error");const p=await xd(c,d,t);return ev(c,p)}return ev(c,d)},"PHONE_PROVIDER").catch(c=>Promise.reject(c))).sessionInfo}}finally{t==null||t._reset()}}async function xd(n,e,t){j(t.type===ha,n,"argument-error");const r=await t.verify();j(typeof r=="string",n,"argument-error");const i=Object.assign({},e);if("phoneEnrollmentInfo"in i){const s=i.phoneEnrollmentInfo.phoneNumber,o=i.phoneEnrollmentInfo.captchaResponse,a=i.phoneEnrollmentInfo.clientType,u=i.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(i,{phoneEnrollmentInfo:{phoneNumber:s,recaptchaToken:r,captchaResponse:o,clientType:a,recaptchaVersion:u}}),i}else if("phoneSignInInfo"in i){const s=i.phoneSignInInfo.captchaResponse,o=i.phoneSignInInfo.clientType,a=i.phoneSignInInfo.recaptchaVersion;return Object.assign(i,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:s,clientType:o,recaptchaVersion:a}}),i}else return Object.assign(i,{recaptchaToken:r}),i}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ul(n,e){return e?xn(e):(j(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tm extends Zc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Es(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Es(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Es(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function zV(n){return OT(n.auth,new Tm(n),n.bypassAuthState)}function jV(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),lV(t,new Tm(n),n.bypassAuthState)}async function $V(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),bT(t,new Tm(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HT{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return zV;case"linkViaPopup":case"linkViaRedirect":return $V;case"reauthViaPopup":case"reauthViaRedirect":return jV;default:Qt(this.auth,"internal-error")}}resolve(e){zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qV=new ol(2e3,1e4);async function FO(n,e,t){if(Ue(n.app))return Promise.reject(Ct(n,"operation-not-supported-in-this-environment"));const r=Ge(n);Yc(n,e,ro);const i=ul(r,t);return new yr(r,"signInViaPopup",e,i).executeNotNull()}async function UO(n,e,t){const r=ee(n);Yc(r.auth,e,ro);const i=ul(r.auth,t);return new yr(r.auth,"linkViaPopup",e,i,r).executeNotNull()}class yr extends HT{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,yr.currentPopupAction&&yr.currentPopupAction.cancel(),yr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){zn(this.filter.length===1,"Popup operations only handle one event");const e=sh();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Ct(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ct(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,yr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ct(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,qV.get())};e()}}yr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WV="pendingRedirect",Su=new Map;class KV extends HT{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Su.get(this.auth._key());if(!e){try{const r=await HV(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Su.set(this.auth._key(),e)}return this.bypassAuthState||Su.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function HV(n,e){const t=XT(e),r=QT(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}async function GT(n,e){return QT(n)._set(XT(e),"true")}function GV(n,e){Su.set(n._key(),e)}function QT(n){return xn(n._redirectPersistence)}function XT(n){return wu(WV,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BO(n,e,t){return QV(n,e,t)}async function QV(n,e,t){if(Ue(n.app))return Promise.reject(yt(n));const r=Ge(n);Yc(n,e,ro),await r._initializationPromise;const i=ul(r,t);return await GT(i,r),i._openRedirect(r,e,"signInViaRedirect")}function zO(n,e,t){return XV(n,e,t)}async function XV(n,e,t){const r=ee(n);Yc(r.auth,e,ro),await r.auth._initializationPromise;const i=ul(r.auth,t);await nh(!1,r,e.providerId),await GT(i,r.auth);const s=await YV(r);return i._openRedirect(r.auth,e,"linkViaRedirect",s)}async function jO(n,e){return await Ge(n)._initializationPromise,YT(n,e,!1)}async function YT(n,e,t=!1){if(Ue(n.app))return Promise.reject(yt(n));const r=Ge(n),i=ul(r,e),o=await new KV(r,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}async function YV(n){const e=sh(`${n.uid}:::`);return n._redirectEventId=e,await n.auth._setRedirectUser(n),await n.auth._persistUserIfCurrent(n),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JV=10*60*1e3;class ZV{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!eD(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!JT(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Ct(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=JV&&this.cachedEventUids.clear(),this.cachedEventUids.has(ov(e))}saveEventToCache(e){this.cachedEventUids.add(ov(e)),this.lastProcessedEventTime=Date.now()}}function ov(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function JT({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function eD(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return JT(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tD(n,e={}){return $e(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nD=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,rD=/^https?/;async function iD(n){if(n.config.emulator)return;const{authorizedDomains:e}=await tD(n);for(const t of e)try{if(sD(t))return}catch{}Qt(n,"unauthorized-domain")}function sD(n){const e=Ua(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!rD.test(t))return!1;if(nD.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oD=new ol(3e4,6e4);function av(){const n=Oe().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function aD(n){return new Promise((e,t)=>{var r,i,s;function o(){av(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{av(),t(Ct(n,"network-request-failed"))},timeout:oD.get()})}if(!((i=(r=Oe().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Oe().gapi)===null||s===void 0)&&s.load)o();else{const a=CT("iframefcb");return Oe()[a]=()=>{gapi.load?o():t(Ct(n,"network-request-failed"))},vm(`${kk()}?onload=${a}`).catch(u=>t(u))}}).catch(e=>{throw Au=null,e})}let Au=null;function lD(n){return Au=Au||aD(n),Au}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uD=new ol(5e3,15e3),cD="__/auth/iframe",hD="emulator/auth/iframe",dD={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},fD=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function pD(n){const e=n.config;j(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?ym(e,hD):`https://${n.config.authDomain}/${cD}`,r={apiKey:e.apiKey,appName:n.name,v:no},i=fD.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${to(r).slice(1)}`}async function mD(n){const e=await lD(n),t=Oe().gapi;return j(t,n,"internal-error"),e.open({where:document.body,url:pD(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:dD,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=Ct(n,"network-request-failed"),a=Oe().setTimeout(()=>{s(o)},uD.get());function u(){Oe().clearTimeout(a),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gD={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},yD=500,_D=600,vD="_blank",ID="http://localhost";class lv{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ED(n,e,t,r=yD,i=_D){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const u=Object.assign(Object.assign({},gD),{width:r.toString(),height:i.toString(),top:s,left:o}),c=ze().toLowerCase();t&&(a=ET(c)?vD:t),vT(c)&&(e=e||ID,u.scrollbars="yes");const d=Object.entries(u).reduce((m,[E,R])=>`${m}${E}=${R},`,"");if(vk(c)&&a!=="_self")return wD(e||"",a),new lv(null);const p=window.open(e||"",a,d);j(p,n,"popup-blocked");try{p.focus()}catch{}return new lv(p)}function wD(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TD="__/auth/handler",SD="emulator/auth/handler",AD=encodeURIComponent("fac");async function uv(n,e,t,r,i,s){j(n.config.authDomain,n,"auth-domain-config-required"),j(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:no,eventId:i};if(e instanceof ro){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",F1(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,p]of Object.entries({}))o[d]=p}if(e instanceof io){const d=e.getScopes().filter(p=>p!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const a=o;for(const d of Object.keys(a))a[d]===void 0&&delete a[d];const u=await n._getAppCheckToken(),c=u?`#${AD}=${encodeURIComponent(u)}`:"";return`${PD(n)}?${to(a).slice(1)}${c}`}function PD({config:n}){return n.emulator?ym(n,SD):`https://${n.authDomain}/${TD}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bd="webStorageSupport";class RD{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=zT,this._completeRedirectFn=YT,this._overrideRedirectResult=GV}async _openPopup(e,t,r,i){var s;zn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await uv(e,t,r,Ua(),i);return ED(e,o,sh())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await uv(e,t,r,Ua(),i);return AV(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(zn(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await mD(e),r=new ZV(e);return t.register("authEvent",i=>(j(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(bd,{type:bd},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[bd];o!==void 0&&t(!!o),Qt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=iD(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return PT()||IT()||_m()}}const CD=RD;var cv="@firebase/auth",hv="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kD{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function VD(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function DD(n){Ds(new Pi("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;j(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:RT(n)},c=new Ak(r,i,s,u);return Bk(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Ds(new Pi("auth-internal",e=>{const t=Ge(e.getProvider("auth").getImmediate());return(r=>new kD(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),kr(cv,hv,VD(n)),kr(cv,hv,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ND=5*60,xD=eT("authIdTokenMaxAge")||ND;let dv=null;const bD=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>xD)return;const i=t==null?void 0:t.token;dv!==i&&(dv=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function $O(n=zC()){const e=dm(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Uk(n,{popupRedirectResolver:CD,persistence:[bV,wV,zT]}),r=eT("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=bD(s.toString());vV(t,o,()=>o(t.currentUser)),_V(t,a=>o(a))}}const i=Jw("auth");return i&&zk(t,`http://${i}`),t}function OD(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Pk({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=Ct("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",OD().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});DD("Browser");var fv=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Dr,ZT;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(v,y){function I(){}I.prototype=y.prototype,v.D=y.prototype,v.prototype=new I,v.prototype.constructor=v,v.C=function(T,P,V){for(var S=Array(arguments.length-2),zt=2;zt<arguments.length;zt++)S[zt-2]=arguments[zt];return y.prototype[P].apply(T,S)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(v,y,I){I||(I=0);var T=Array(16);if(typeof y=="string")for(var P=0;16>P;++P)T[P]=y.charCodeAt(I++)|y.charCodeAt(I++)<<8|y.charCodeAt(I++)<<16|y.charCodeAt(I++)<<24;else for(P=0;16>P;++P)T[P]=y[I++]|y[I++]<<8|y[I++]<<16|y[I++]<<24;y=v.g[0],I=v.g[1],P=v.g[2];var V=v.g[3],S=y+(V^I&(P^V))+T[0]+3614090360&4294967295;y=I+(S<<7&4294967295|S>>>25),S=V+(P^y&(I^P))+T[1]+3905402710&4294967295,V=y+(S<<12&4294967295|S>>>20),S=P+(I^V&(y^I))+T[2]+606105819&4294967295,P=V+(S<<17&4294967295|S>>>15),S=I+(y^P&(V^y))+T[3]+3250441966&4294967295,I=P+(S<<22&4294967295|S>>>10),S=y+(V^I&(P^V))+T[4]+4118548399&4294967295,y=I+(S<<7&4294967295|S>>>25),S=V+(P^y&(I^P))+T[5]+1200080426&4294967295,V=y+(S<<12&4294967295|S>>>20),S=P+(I^V&(y^I))+T[6]+2821735955&4294967295,P=V+(S<<17&4294967295|S>>>15),S=I+(y^P&(V^y))+T[7]+4249261313&4294967295,I=P+(S<<22&4294967295|S>>>10),S=y+(V^I&(P^V))+T[8]+1770035416&4294967295,y=I+(S<<7&4294967295|S>>>25),S=V+(P^y&(I^P))+T[9]+2336552879&4294967295,V=y+(S<<12&4294967295|S>>>20),S=P+(I^V&(y^I))+T[10]+4294925233&4294967295,P=V+(S<<17&4294967295|S>>>15),S=I+(y^P&(V^y))+T[11]+2304563134&4294967295,I=P+(S<<22&4294967295|S>>>10),S=y+(V^I&(P^V))+T[12]+1804603682&4294967295,y=I+(S<<7&4294967295|S>>>25),S=V+(P^y&(I^P))+T[13]+4254626195&4294967295,V=y+(S<<12&4294967295|S>>>20),S=P+(I^V&(y^I))+T[14]+2792965006&4294967295,P=V+(S<<17&4294967295|S>>>15),S=I+(y^P&(V^y))+T[15]+1236535329&4294967295,I=P+(S<<22&4294967295|S>>>10),S=y+(P^V&(I^P))+T[1]+4129170786&4294967295,y=I+(S<<5&4294967295|S>>>27),S=V+(I^P&(y^I))+T[6]+3225465664&4294967295,V=y+(S<<9&4294967295|S>>>23),S=P+(y^I&(V^y))+T[11]+643717713&4294967295,P=V+(S<<14&4294967295|S>>>18),S=I+(V^y&(P^V))+T[0]+3921069994&4294967295,I=P+(S<<20&4294967295|S>>>12),S=y+(P^V&(I^P))+T[5]+3593408605&4294967295,y=I+(S<<5&4294967295|S>>>27),S=V+(I^P&(y^I))+T[10]+38016083&4294967295,V=y+(S<<9&4294967295|S>>>23),S=P+(y^I&(V^y))+T[15]+3634488961&4294967295,P=V+(S<<14&4294967295|S>>>18),S=I+(V^y&(P^V))+T[4]+3889429448&4294967295,I=P+(S<<20&4294967295|S>>>12),S=y+(P^V&(I^P))+T[9]+568446438&4294967295,y=I+(S<<5&4294967295|S>>>27),S=V+(I^P&(y^I))+T[14]+3275163606&4294967295,V=y+(S<<9&4294967295|S>>>23),S=P+(y^I&(V^y))+T[3]+4107603335&4294967295,P=V+(S<<14&4294967295|S>>>18),S=I+(V^y&(P^V))+T[8]+1163531501&4294967295,I=P+(S<<20&4294967295|S>>>12),S=y+(P^V&(I^P))+T[13]+2850285829&4294967295,y=I+(S<<5&4294967295|S>>>27),S=V+(I^P&(y^I))+T[2]+4243563512&4294967295,V=y+(S<<9&4294967295|S>>>23),S=P+(y^I&(V^y))+T[7]+1735328473&4294967295,P=V+(S<<14&4294967295|S>>>18),S=I+(V^y&(P^V))+T[12]+2368359562&4294967295,I=P+(S<<20&4294967295|S>>>12),S=y+(I^P^V)+T[5]+4294588738&4294967295,y=I+(S<<4&4294967295|S>>>28),S=V+(y^I^P)+T[8]+2272392833&4294967295,V=y+(S<<11&4294967295|S>>>21),S=P+(V^y^I)+T[11]+1839030562&4294967295,P=V+(S<<16&4294967295|S>>>16),S=I+(P^V^y)+T[14]+4259657740&4294967295,I=P+(S<<23&4294967295|S>>>9),S=y+(I^P^V)+T[1]+2763975236&4294967295,y=I+(S<<4&4294967295|S>>>28),S=V+(y^I^P)+T[4]+1272893353&4294967295,V=y+(S<<11&4294967295|S>>>21),S=P+(V^y^I)+T[7]+4139469664&4294967295,P=V+(S<<16&4294967295|S>>>16),S=I+(P^V^y)+T[10]+3200236656&4294967295,I=P+(S<<23&4294967295|S>>>9),S=y+(I^P^V)+T[13]+681279174&4294967295,y=I+(S<<4&4294967295|S>>>28),S=V+(y^I^P)+T[0]+3936430074&4294967295,V=y+(S<<11&4294967295|S>>>21),S=P+(V^y^I)+T[3]+3572445317&4294967295,P=V+(S<<16&4294967295|S>>>16),S=I+(P^V^y)+T[6]+76029189&4294967295,I=P+(S<<23&4294967295|S>>>9),S=y+(I^P^V)+T[9]+3654602809&4294967295,y=I+(S<<4&4294967295|S>>>28),S=V+(y^I^P)+T[12]+3873151461&4294967295,V=y+(S<<11&4294967295|S>>>21),S=P+(V^y^I)+T[15]+530742520&4294967295,P=V+(S<<16&4294967295|S>>>16),S=I+(P^V^y)+T[2]+3299628645&4294967295,I=P+(S<<23&4294967295|S>>>9),S=y+(P^(I|~V))+T[0]+4096336452&4294967295,y=I+(S<<6&4294967295|S>>>26),S=V+(I^(y|~P))+T[7]+1126891415&4294967295,V=y+(S<<10&4294967295|S>>>22),S=P+(y^(V|~I))+T[14]+2878612391&4294967295,P=V+(S<<15&4294967295|S>>>17),S=I+(V^(P|~y))+T[5]+4237533241&4294967295,I=P+(S<<21&4294967295|S>>>11),S=y+(P^(I|~V))+T[12]+1700485571&4294967295,y=I+(S<<6&4294967295|S>>>26),S=V+(I^(y|~P))+T[3]+2399980690&4294967295,V=y+(S<<10&4294967295|S>>>22),S=P+(y^(V|~I))+T[10]+4293915773&4294967295,P=V+(S<<15&4294967295|S>>>17),S=I+(V^(P|~y))+T[1]+2240044497&4294967295,I=P+(S<<21&4294967295|S>>>11),S=y+(P^(I|~V))+T[8]+1873313359&4294967295,y=I+(S<<6&4294967295|S>>>26),S=V+(I^(y|~P))+T[15]+4264355552&4294967295,V=y+(S<<10&4294967295|S>>>22),S=P+(y^(V|~I))+T[6]+2734768916&4294967295,P=V+(S<<15&4294967295|S>>>17),S=I+(V^(P|~y))+T[13]+1309151649&4294967295,I=P+(S<<21&4294967295|S>>>11),S=y+(P^(I|~V))+T[4]+4149444226&4294967295,y=I+(S<<6&4294967295|S>>>26),S=V+(I^(y|~P))+T[11]+3174756917&4294967295,V=y+(S<<10&4294967295|S>>>22),S=P+(y^(V|~I))+T[2]+718787259&4294967295,P=V+(S<<15&4294967295|S>>>17),S=I+(V^(P|~y))+T[9]+3951481745&4294967295,v.g[0]=v.g[0]+y&4294967295,v.g[1]=v.g[1]+(P+(S<<21&4294967295|S>>>11))&4294967295,v.g[2]=v.g[2]+P&4294967295,v.g[3]=v.g[3]+V&4294967295}r.prototype.u=function(v,y){y===void 0&&(y=v.length);for(var I=y-this.blockSize,T=this.B,P=this.h,V=0;V<y;){if(P==0)for(;V<=I;)i(this,v,V),V+=this.blockSize;if(typeof v=="string"){for(;V<y;)if(T[P++]=v.charCodeAt(V++),P==this.blockSize){i(this,T),P=0;break}}else for(;V<y;)if(T[P++]=v[V++],P==this.blockSize){i(this,T),P=0;break}}this.h=P,this.o+=y},r.prototype.v=function(){var v=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);v[0]=128;for(var y=1;y<v.length-8;++y)v[y]=0;var I=8*this.o;for(y=v.length-8;y<v.length;++y)v[y]=I&255,I/=256;for(this.u(v),v=Array(16),y=I=0;4>y;++y)for(var T=0;32>T;T+=8)v[I++]=this.g[y]>>>T&255;return v};function s(v,y){var I=a;return Object.prototype.hasOwnProperty.call(I,v)?I[v]:I[v]=y(v)}function o(v,y){this.h=y;for(var I=[],T=!0,P=v.length-1;0<=P;P--){var V=v[P]|0;T&&V==y||(I[P]=V,T=!1)}this.g=I}var a={};function u(v){return-128<=v&&128>v?s(v,function(y){return new o([y|0],0>y?-1:0)}):new o([v|0],0>v?-1:0)}function c(v){if(isNaN(v)||!isFinite(v))return p;if(0>v)return O(c(-v));for(var y=[],I=1,T=0;v>=I;T++)y[T]=v/I|0,I*=4294967296;return new o(y,0)}function d(v,y){if(v.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(v.charAt(0)=="-")return O(d(v.substring(1),y));if(0<=v.indexOf("-"))throw Error('number format error: interior "-" character');for(var I=c(Math.pow(y,8)),T=p,P=0;P<v.length;P+=8){var V=Math.min(8,v.length-P),S=parseInt(v.substring(P,P+V),y);8>V?(V=c(Math.pow(y,V)),T=T.j(V).add(c(S))):(T=T.j(I),T=T.add(c(S)))}return T}var p=u(0),m=u(1),E=u(16777216);n=o.prototype,n.m=function(){if(D(this))return-O(this).m();for(var v=0,y=1,I=0;I<this.g.length;I++){var T=this.i(I);v+=(0<=T?T:4294967296+T)*y,y*=4294967296}return v},n.toString=function(v){if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(R(this))return"0";if(D(this))return"-"+O(this).toString(v);for(var y=c(Math.pow(v,6)),I=this,T="";;){var P=x(I,y).g;I=A(I,P.j(y));var V=((0<I.g.length?I.g[0]:I.h)>>>0).toString(v);if(I=P,R(I))return V+T;for(;6>V.length;)V="0"+V;T=V+T}},n.i=function(v){return 0>v?0:v<this.g.length?this.g[v]:this.h};function R(v){if(v.h!=0)return!1;for(var y=0;y<v.g.length;y++)if(v.g[y]!=0)return!1;return!0}function D(v){return v.h==-1}n.l=function(v){return v=A(this,v),D(v)?-1:R(v)?0:1};function O(v){for(var y=v.g.length,I=[],T=0;T<y;T++)I[T]=~v.g[T];return new o(I,~v.h).add(m)}n.abs=function(){return D(this)?O(this):this},n.add=function(v){for(var y=Math.max(this.g.length,v.g.length),I=[],T=0,P=0;P<=y;P++){var V=T+(this.i(P)&65535)+(v.i(P)&65535),S=(V>>>16)+(this.i(P)>>>16)+(v.i(P)>>>16);T=S>>>16,V&=65535,S&=65535,I[P]=S<<16|V}return new o(I,I[I.length-1]&-2147483648?-1:0)};function A(v,y){return v.add(O(y))}n.j=function(v){if(R(this)||R(v))return p;if(D(this))return D(v)?O(this).j(O(v)):O(O(this).j(v));if(D(v))return O(this.j(O(v)));if(0>this.l(E)&&0>v.l(E))return c(this.m()*v.m());for(var y=this.g.length+v.g.length,I=[],T=0;T<2*y;T++)I[T]=0;for(T=0;T<this.g.length;T++)for(var P=0;P<v.g.length;P++){var V=this.i(T)>>>16,S=this.i(T)&65535,zt=v.i(P)>>>16,Gr=v.i(P)&65535;I[2*T+2*P]+=S*Gr,_(I,2*T+2*P),I[2*T+2*P+1]+=V*Gr,_(I,2*T+2*P+1),I[2*T+2*P+1]+=S*zt,_(I,2*T+2*P+1),I[2*T+2*P+2]+=V*zt,_(I,2*T+2*P+2)}for(T=0;T<y;T++)I[T]=I[2*T+1]<<16|I[2*T];for(T=y;T<2*y;T++)I[T]=0;return new o(I,0)};function _(v,y){for(;(v[y]&65535)!=v[y];)v[y+1]+=v[y]>>>16,v[y]&=65535,y++}function w(v,y){this.g=v,this.h=y}function x(v,y){if(R(y))throw Error("division by zero");if(R(v))return new w(p,p);if(D(v))return y=x(O(v),y),new w(O(y.g),O(y.h));if(D(y))return y=x(v,O(y)),new w(O(y.g),y.h);if(30<v.g.length){if(D(v)||D(y))throw Error("slowDivide_ only works with positive integers.");for(var I=m,T=y;0>=T.l(v);)I=F(I),T=F(T);var P=M(I,1),V=M(T,1);for(T=M(T,2),I=M(I,2);!R(T);){var S=V.add(T);0>=S.l(v)&&(P=P.add(I),V=S),T=M(T,1),I=M(I,1)}return y=A(v,P.j(y)),new w(P,y)}for(P=p;0<=v.l(y);){for(I=Math.max(1,Math.floor(v.m()/y.m())),T=Math.ceil(Math.log(I)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),V=c(I),S=V.j(y);D(S)||0<S.l(v);)I-=T,V=c(I),S=V.j(y);R(V)&&(V=m),P=P.add(V),v=A(v,S)}return new w(P,v)}n.A=function(v){return x(this,v).h},n.and=function(v){for(var y=Math.max(this.g.length,v.g.length),I=[],T=0;T<y;T++)I[T]=this.i(T)&v.i(T);return new o(I,this.h&v.h)},n.or=function(v){for(var y=Math.max(this.g.length,v.g.length),I=[],T=0;T<y;T++)I[T]=this.i(T)|v.i(T);return new o(I,this.h|v.h)},n.xor=function(v){for(var y=Math.max(this.g.length,v.g.length),I=[],T=0;T<y;T++)I[T]=this.i(T)^v.i(T);return new o(I,this.h^v.h)};function F(v){for(var y=v.g.length+1,I=[],T=0;T<y;T++)I[T]=v.i(T)<<1|v.i(T-1)>>>31;return new o(I,v.h)}function M(v,y){var I=y>>5;y%=32;for(var T=v.g.length-I,P=[],V=0;V<T;V++)P[V]=0<y?v.i(V+I)>>>y|v.i(V+I+1)<<32-y:v.i(V+I);return new o(P,v.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,ZT=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=d,Dr=o}).apply(typeof fv<"u"?fv:typeof self<"u"?self:typeof window<"u"?window:{});var nu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var e0,Ho,t0,Pu,$f,n0,r0,i0;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,h,f){return l==Array.prototype||l==Object.prototype||(l[h]=f.value),l};function t(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof nu=="object"&&nu];for(var h=0;h<l.length;++h){var f=l[h];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=t(this);function i(l,h){if(h)e:{var f=r;l=l.split(".");for(var g=0;g<l.length-1;g++){var k=l[g];if(!(k in f))break e;f=f[k]}l=l[l.length-1],g=f[l],h=h(g),h!=g&&h!=null&&e(f,l,{configurable:!0,writable:!0,value:h})}}function s(l,h){l instanceof String&&(l+="");var f=0,g=!1,k={next:function(){if(!g&&f<l.length){var N=f++;return{value:h(N,l[N]),done:!1}}return g=!0,{done:!0,value:void 0}}};return k[Symbol.iterator]=function(){return k},k}i("Array.prototype.values",function(l){return l||function(){return s(this,function(h,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function u(l){var h=typeof l;return h=h!="object"?h:l?Array.isArray(l)?"array":h:"null",h=="array"||h=="object"&&typeof l.length=="number"}function c(l){var h=typeof l;return h=="object"&&l!=null||h=="function"}function d(l,h,f){return l.call.apply(l.bind,arguments)}function p(l,h,f){if(!l)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var k=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(k,g),l.apply(h,k)}}return function(){return l.apply(h,arguments)}}function m(l,h,f){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:p,m.apply(null,arguments)}function E(l,h){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),l.apply(this,g)}}function R(l,h){function f(){}f.prototype=h.prototype,l.aa=h.prototype,l.prototype=new f,l.prototype.constructor=l,l.Qb=function(g,k,N){for(var z=Array(arguments.length-2),fe=2;fe<arguments.length;fe++)z[fe-2]=arguments[fe];return h.prototype[k].apply(g,z)}}function D(l){const h=l.length;if(0<h){const f=Array(h);for(let g=0;g<h;g++)f[g]=l[g];return f}return[]}function O(l,h){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(u(g)){const k=l.length||0,N=g.length||0;l.length=k+N;for(let z=0;z<N;z++)l[k+z]=g[z]}else l.push(g)}}class A{constructor(h,f){this.i=h,this.j=f,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function _(l){return/^[\s\xa0]*$/.test(l)}function w(){var l=a.navigator;return l&&(l=l.userAgent)?l:""}function x(l){return x[" "](l),l}x[" "]=function(){};var F=w().indexOf("Gecko")!=-1&&!(w().toLowerCase().indexOf("webkit")!=-1&&w().indexOf("Edge")==-1)&&!(w().indexOf("Trident")!=-1||w().indexOf("MSIE")!=-1)&&w().indexOf("Edge")==-1;function M(l,h,f){for(const g in l)h.call(f,l[g],g,l)}function v(l,h){for(const f in l)h.call(void 0,l[f],f,l)}function y(l){const h={};for(const f in l)h[f]=l[f];return h}const I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(l,h){let f,g;for(let k=1;k<arguments.length;k++){g=arguments[k];for(f in g)l[f]=g[f];for(let N=0;N<I.length;N++)f=I[N],Object.prototype.hasOwnProperty.call(g,f)&&(l[f]=g[f])}}function P(l){var h=1;l=l.split(":");const f=[];for(;0<h&&l.length;)f.push(l.shift()),h--;return l.length&&f.push(l.join(":")),f}function V(l){a.setTimeout(()=>{throw l},0)}function S(){var l=Y;let h=null;return l.g&&(h=l.g,l.g=l.g.next,l.g||(l.h=null),h.next=null),h}class zt{constructor(){this.h=this.g=null}add(h,f){const g=Gr.get();g.set(h,f),this.h?this.h.next=g:this.g=g,this.h=g}}var Gr=new A(()=>new ho,l=>l.reset());class ho{constructor(){this.next=this.g=this.h=null}set(h,f){this.h=h,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let En,q=!1,Y=new zt,J=()=>{const l=a.Promise.resolve(void 0);En=()=>{l.then(Ee)}};var Ee=()=>{for(var l;l=S();){try{l.h.call(l.g)}catch(f){V(f)}var h=Gr;h.j(l),100>h.h&&(h.h++,l.next=h.g,h.g=l)}q=!1};function de(){this.s=this.s,this.C=this.C}de.prototype.s=!1,de.prototype.ma=function(){this.s||(this.s=!0,this.N())},de.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ve(l,h){this.type=l,this.g=this.target=h,this.defaultPrevented=!1}Ve.prototype.h=function(){this.defaultPrevented=!0};var wn=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var l=!1,h=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const f=()=>{};a.addEventListener("test",f,h),a.removeEventListener("test",f,h)}catch{}return l}();function Tn(l,h){if(Ve.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var f=this.type=l.type,g=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=h,h=l.relatedTarget){if(F){e:{try{x(h.nodeName);var k=!0;break e}catch{}k=!1}k||(h=null)}}else f=="mouseover"?h=l.fromElement:f=="mouseout"&&(h=l.toElement);this.relatedTarget=h,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:Sn[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&Tn.aa.h.call(this)}}R(Tn,Ve);var Sn={2:"touch",3:"pen",4:"mouse"};Tn.prototype.h=function(){Tn.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var An="closure_listenable_"+(1e6*Math.random()|0),EA=0;function wA(l,h,f,g,k){this.listener=l,this.proxy=null,this.src=h,this.type=f,this.capture=!!g,this.ha=k,this.key=++EA,this.da=this.fa=!1}function Il(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function El(l){this.src=l,this.g={},this.h=0}El.prototype.add=function(l,h,f,g,k){var N=l.toString();l=this.g[N],l||(l=this.g[N]=[],this.h++);var z=Nh(l,h,g,k);return-1<z?(h=l[z],f||(h.fa=!1)):(h=new wA(h,this.src,N,!!g,k),h.fa=f,l.push(h)),h};function Dh(l,h){var f=h.type;if(f in l.g){var g=l.g[f],k=Array.prototype.indexOf.call(g,h,void 0),N;(N=0<=k)&&Array.prototype.splice.call(g,k,1),N&&(Il(h),l.g[f].length==0&&(delete l.g[f],l.h--))}}function Nh(l,h,f,g){for(var k=0;k<l.length;++k){var N=l[k];if(!N.da&&N.listener==h&&N.capture==!!f&&N.ha==g)return k}return-1}var xh="closure_lm_"+(1e6*Math.random()|0),bh={};function Rg(l,h,f,g,k){if(Array.isArray(h)){for(var N=0;N<h.length;N++)Rg(l,h[N],f,g,k);return null}return f=Vg(f),l&&l[An]?l.K(h,f,c(g)?!!g.capture:!1,k):TA(l,h,f,!1,g,k)}function TA(l,h,f,g,k,N){if(!h)throw Error("Invalid event type");var z=c(k)?!!k.capture:!!k,fe=Lh(l);if(fe||(l[xh]=fe=new El(l)),f=fe.add(h,f,g,z,N),f.proxy)return f;if(g=SA(),f.proxy=g,g.src=l,g.listener=f,l.addEventListener)wn||(k=z),k===void 0&&(k=!1),l.addEventListener(h.toString(),g,k);else if(l.attachEvent)l.attachEvent(kg(h.toString()),g);else if(l.addListener&&l.removeListener)l.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function SA(){function l(f){return h.call(l.src,l.listener,f)}const h=AA;return l}function Cg(l,h,f,g,k){if(Array.isArray(h))for(var N=0;N<h.length;N++)Cg(l,h[N],f,g,k);else g=c(g)?!!g.capture:!!g,f=Vg(f),l&&l[An]?(l=l.i,h=String(h).toString(),h in l.g&&(N=l.g[h],f=Nh(N,f,g,k),-1<f&&(Il(N[f]),Array.prototype.splice.call(N,f,1),N.length==0&&(delete l.g[h],l.h--)))):l&&(l=Lh(l))&&(h=l.g[h.toString()],l=-1,h&&(l=Nh(h,f,g,k)),(f=-1<l?h[l]:null)&&Oh(f))}function Oh(l){if(typeof l!="number"&&l&&!l.da){var h=l.src;if(h&&h[An])Dh(h.i,l);else{var f=l.type,g=l.proxy;h.removeEventListener?h.removeEventListener(f,g,l.capture):h.detachEvent?h.detachEvent(kg(f),g):h.addListener&&h.removeListener&&h.removeListener(g),(f=Lh(h))?(Dh(f,l),f.h==0&&(f.src=null,h[xh]=null)):Il(l)}}}function kg(l){return l in bh?bh[l]:bh[l]="on"+l}function AA(l,h){if(l.da)l=!0;else{h=new Tn(h,this);var f=l.listener,g=l.ha||l.src;l.fa&&Oh(l),l=f.call(g,h)}return l}function Lh(l){return l=l[xh],l instanceof El?l:null}var Mh="__closure_events_fn_"+(1e9*Math.random()>>>0);function Vg(l){return typeof l=="function"?l:(l[Mh]||(l[Mh]=function(h){return l.handleEvent(h)}),l[Mh])}function et(){de.call(this),this.i=new El(this),this.M=this,this.F=null}R(et,de),et.prototype[An]=!0,et.prototype.removeEventListener=function(l,h,f,g){Cg(this,l,h,f,g)};function ft(l,h){var f,g=l.F;if(g)for(f=[];g;g=g.F)f.push(g);if(l=l.M,g=h.type||h,typeof h=="string")h=new Ve(h,l);else if(h instanceof Ve)h.target=h.target||l;else{var k=h;h=new Ve(g,l),T(h,k)}if(k=!0,f)for(var N=f.length-1;0<=N;N--){var z=h.g=f[N];k=wl(z,g,!0,h)&&k}if(z=h.g=l,k=wl(z,g,!0,h)&&k,k=wl(z,g,!1,h)&&k,f)for(N=0;N<f.length;N++)z=h.g=f[N],k=wl(z,g,!1,h)&&k}et.prototype.N=function(){if(et.aa.N.call(this),this.i){var l=this.i,h;for(h in l.g){for(var f=l.g[h],g=0;g<f.length;g++)Il(f[g]);delete l.g[h],l.h--}}this.F=null},et.prototype.K=function(l,h,f,g){return this.i.add(String(l),h,!1,f,g)},et.prototype.L=function(l,h,f,g){return this.i.add(String(l),h,!0,f,g)};function wl(l,h,f,g){if(h=l.i.g[String(h)],!h)return!0;h=h.concat();for(var k=!0,N=0;N<h.length;++N){var z=h[N];if(z&&!z.da&&z.capture==f){var fe=z.listener,Qe=z.ha||z.src;z.fa&&Dh(l.i,z),k=fe.call(Qe,g)!==!1&&k}}return k&&!g.defaultPrevented}function Dg(l,h,f){if(typeof l=="function")f&&(l=m(l,f));else if(l&&typeof l.handleEvent=="function")l=m(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:a.setTimeout(l,h||0)}function Ng(l){l.g=Dg(()=>{l.g=null,l.i&&(l.i=!1,Ng(l))},l.l);const h=l.h;l.h=null,l.m.apply(null,h)}class PA extends de{constructor(h,f){super(),this.m=h,this.l=f,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Ng(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function fo(l){de.call(this),this.h=l,this.g={}}R(fo,de);var xg=[];function bg(l){M(l.g,function(h,f){this.g.hasOwnProperty(f)&&Oh(h)},l),l.g={}}fo.prototype.N=function(){fo.aa.N.call(this),bg(this)},fo.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Fh=a.JSON.stringify,RA=a.JSON.parse,CA=class{stringify(l){return a.JSON.stringify(l,void 0)}parse(l){return a.JSON.parse(l,void 0)}};function Uh(){}Uh.prototype.h=null;function Og(l){return l.h||(l.h=l.i())}function Lg(){}var po={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Bh(){Ve.call(this,"d")}R(Bh,Ve);function zh(){Ve.call(this,"c")}R(zh,Ve);var Qr={},Mg=null;function Tl(){return Mg=Mg||new et}Qr.La="serverreachability";function Fg(l){Ve.call(this,Qr.La,l)}R(Fg,Ve);function mo(l){const h=Tl();ft(h,new Fg(h))}Qr.STAT_EVENT="statevent";function Ug(l,h){Ve.call(this,Qr.STAT_EVENT,l),this.stat=h}R(Ug,Ve);function pt(l){const h=Tl();ft(h,new Ug(h,l))}Qr.Ma="timingevent";function Bg(l,h){Ve.call(this,Qr.Ma,l),this.size=h}R(Bg,Ve);function go(l,h){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){l()},h)}function yo(){this.g=!0}yo.prototype.xa=function(){this.g=!1};function kA(l,h,f,g,k,N){l.info(function(){if(l.g)if(N)for(var z="",fe=N.split("&"),Qe=0;Qe<fe.length;Qe++){var oe=fe[Qe].split("=");if(1<oe.length){var tt=oe[0];oe=oe[1];var nt=tt.split("_");z=2<=nt.length&&nt[1]=="type"?z+(tt+"="+oe+"&"):z+(tt+"=redacted&")}}else z=null;else z=N;return"XMLHTTP REQ ("+g+") [attempt "+k+"]: "+h+`
`+f+`
`+z})}function VA(l,h,f,g,k,N,z){l.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+k+"]: "+h+`
`+f+`
`+N+" "+z})}function Ui(l,h,f,g){l.info(function(){return"XMLHTTP TEXT ("+h+"): "+NA(l,f)+(g?" "+g:"")})}function DA(l,h){l.info(function(){return"TIMEOUT: "+h})}yo.prototype.info=function(){};function NA(l,h){if(!l.g)return h;if(!h)return null;try{var f=JSON.parse(h);if(f){for(l=0;l<f.length;l++)if(Array.isArray(f[l])){var g=f[l];if(!(2>g.length)){var k=g[1];if(Array.isArray(k)&&!(1>k.length)){var N=k[0];if(N!="noop"&&N!="stop"&&N!="close")for(var z=1;z<k.length;z++)k[z]=""}}}}return Fh(f)}catch{return h}}var Sl={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},zg={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},jh;function Al(){}R(Al,Uh),Al.prototype.g=function(){return new XMLHttpRequest},Al.prototype.i=function(){return{}},jh=new Al;function Jn(l,h,f,g){this.j=l,this.i=h,this.l=f,this.R=g||1,this.U=new fo(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new jg}function jg(){this.i=null,this.g="",this.h=!1}var $g={},$h={};function qh(l,h,f){l.L=1,l.v=kl(Pn(h)),l.m=f,l.P=!0,qg(l,null)}function qg(l,h){l.F=Date.now(),Pl(l),l.A=Pn(l.v);var f=l.A,g=l.R;Array.isArray(g)||(g=[String(g)]),iy(f.i,"t",g),l.C=0,f=l.j.J,l.h=new jg,l.g=wy(l.j,f?h:null,!l.m),0<l.O&&(l.M=new PA(m(l.Y,l,l.g),l.O)),h=l.U,f=l.g,g=l.ca;var k="readystatechange";Array.isArray(k)||(k&&(xg[0]=k.toString()),k=xg);for(var N=0;N<k.length;N++){var z=Rg(f,k[N],g||h.handleEvent,!1,h.h||h);if(!z)break;h.g[z.key]=z}h=l.H?y(l.H):{},l.m?(l.u||(l.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,h)):(l.u="GET",l.g.ea(l.A,l.u,null,h)),mo(),kA(l.i,l.u,l.A,l.l,l.R,l.m)}Jn.prototype.ca=function(l){l=l.target;const h=this.M;h&&Rn(l)==3?h.j():this.Y(l)},Jn.prototype.Y=function(l){try{if(l==this.g)e:{const nt=Rn(this.g);var h=this.g.Ba();const ji=this.g.Z();if(!(3>nt)&&(nt!=3||this.g&&(this.h.h||this.g.oa()||hy(this.g)))){this.J||nt!=4||h==7||(h==8||0>=ji?mo(3):mo(2)),Wh(this);var f=this.g.Z();this.X=f;t:if(Wg(this)){var g=hy(this.g);l="";var k=g.length,N=Rn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Xr(this),_o(this);var z="";break t}this.h.i=new a.TextDecoder}for(h=0;h<k;h++)this.h.h=!0,l+=this.h.i.decode(g[h],{stream:!(N&&h==k-1)});g.length=0,this.h.g+=l,this.C=0,z=this.h.g}else z=this.g.oa();if(this.o=f==200,VA(this.i,this.u,this.A,this.l,this.R,nt,f),this.o){if(this.T&&!this.K){t:{if(this.g){var fe,Qe=this.g;if((fe=Qe.g?Qe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(fe)){var oe=fe;break t}}oe=null}if(f=oe)Ui(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Kh(this,f);else{this.o=!1,this.s=3,pt(12),Xr(this),_o(this);break e}}if(this.P){f=!0;let Xt;for(;!this.J&&this.C<z.length;)if(Xt=xA(this,z),Xt==$h){nt==4&&(this.s=4,pt(14),f=!1),Ui(this.i,this.l,null,"[Incomplete Response]");break}else if(Xt==$g){this.s=4,pt(15),Ui(this.i,this.l,z,"[Invalid Chunk]"),f=!1;break}else Ui(this.i,this.l,Xt,null),Kh(this,Xt);if(Wg(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),nt!=4||z.length!=0||this.h.h||(this.s=1,pt(16),f=!1),this.o=this.o&&f,!f)Ui(this.i,this.l,z,"[Invalid Chunked Response]"),Xr(this),_o(this);else if(0<z.length&&!this.W){this.W=!0;var tt=this.j;tt.g==this&&tt.ba&&!tt.M&&(tt.j.info("Great, no buffering proxy detected. Bytes received: "+z.length),Jh(tt),tt.M=!0,pt(11))}}else Ui(this.i,this.l,z,null),Kh(this,z);nt==4&&Xr(this),this.o&&!this.J&&(nt==4?_y(this.j,this):(this.o=!1,Pl(this)))}else XA(this.g),f==400&&0<z.indexOf("Unknown SID")?(this.s=3,pt(12)):(this.s=0,pt(13)),Xr(this),_o(this)}}}catch{}finally{}};function Wg(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function xA(l,h){var f=l.C,g=h.indexOf(`
`,f);return g==-1?$h:(f=Number(h.substring(f,g)),isNaN(f)?$g:(g+=1,g+f>h.length?$h:(h=h.slice(g,g+f),l.C=g+f,h)))}Jn.prototype.cancel=function(){this.J=!0,Xr(this)};function Pl(l){l.S=Date.now()+l.I,Kg(l,l.I)}function Kg(l,h){if(l.B!=null)throw Error("WatchDog timer not null");l.B=go(m(l.ba,l),h)}function Wh(l){l.B&&(a.clearTimeout(l.B),l.B=null)}Jn.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(DA(this.i,this.A),this.L!=2&&(mo(),pt(17)),Xr(this),this.s=2,_o(this)):Kg(this,this.S-l)};function _o(l){l.j.G==0||l.J||_y(l.j,l)}function Xr(l){Wh(l);var h=l.M;h&&typeof h.ma=="function"&&h.ma(),l.M=null,bg(l.U),l.g&&(h=l.g,l.g=null,h.abort(),h.ma())}function Kh(l,h){try{var f=l.j;if(f.G!=0&&(f.g==l||Hh(f.h,l))){if(!l.K&&Hh(f.h,l)&&f.G==3){try{var g=f.Da.g.parse(h)}catch{g=null}if(Array.isArray(g)&&g.length==3){var k=g;if(k[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<l.F)Ol(f),xl(f);else break e;Yh(f),pt(18)}}else f.za=k[1],0<f.za-f.T&&37500>k[2]&&f.F&&f.v==0&&!f.C&&(f.C=go(m(f.Za,f),6e3));if(1>=Qg(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else Jr(f,11)}else if((l.K||f.g==l)&&Ol(f),!_(h))for(k=f.Da.g.parse(h),h=0;h<k.length;h++){let oe=k[h];if(f.T=oe[0],oe=oe[1],f.G==2)if(oe[0]=="c"){f.K=oe[1],f.ia=oe[2];const tt=oe[3];tt!=null&&(f.la=tt,f.j.info("VER="+f.la));const nt=oe[4];nt!=null&&(f.Aa=nt,f.j.info("SVER="+f.Aa));const ji=oe[5];ji!=null&&typeof ji=="number"&&0<ji&&(g=1.5*ji,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const Xt=l.g;if(Xt){const Ml=Xt.g?Xt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ml){var N=g.h;N.g||Ml.indexOf("spdy")==-1&&Ml.indexOf("quic")==-1&&Ml.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(Gh(N,N.h),N.h=null))}if(g.D){const Zh=Xt.g?Xt.g.getResponseHeader("X-HTTP-Session-Id"):null;Zh&&(g.ya=Zh,ge(g.I,g.D,Zh))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-l.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var z=l;if(g.qa=Ey(g,g.J?g.ia:null,g.W),z.K){Xg(g.h,z);var fe=z,Qe=g.L;Qe&&(fe.I=Qe),fe.B&&(Wh(fe),Pl(fe)),g.g=z}else gy(g);0<f.i.length&&bl(f)}else oe[0]!="stop"&&oe[0]!="close"||Jr(f,7);else f.G==3&&(oe[0]=="stop"||oe[0]=="close"?oe[0]=="stop"?Jr(f,7):Xh(f):oe[0]!="noop"&&f.l&&f.l.ta(oe),f.v=0)}}mo(4)}catch{}}var bA=class{constructor(l,h){this.g=l,this.map=h}};function Hg(l){this.l=l||10,a.PerformanceNavigationTiming?(l=a.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Gg(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function Qg(l){return l.h?1:l.g?l.g.size:0}function Hh(l,h){return l.h?l.h==h:l.g?l.g.has(h):!1}function Gh(l,h){l.g?l.g.add(h):l.h=h}function Xg(l,h){l.h&&l.h==h?l.h=null:l.g&&l.g.has(h)&&l.g.delete(h)}Hg.prototype.cancel=function(){if(this.i=Yg(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function Yg(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let h=l.i;for(const f of l.g.values())h=h.concat(f.D);return h}return D(l.i)}function OA(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(u(l)){for(var h=[],f=l.length,g=0;g<f;g++)h.push(l[g]);return h}h=[],f=0;for(g in l)h[f++]=l[g];return h}function LA(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(u(l)||typeof l=="string"){var h=[];l=l.length;for(var f=0;f<l;f++)h.push(f);return h}h=[],f=0;for(const g in l)h[f++]=g;return h}}}function Jg(l,h){if(l.forEach&&typeof l.forEach=="function")l.forEach(h,void 0);else if(u(l)||typeof l=="string")Array.prototype.forEach.call(l,h,void 0);else for(var f=LA(l),g=OA(l),k=g.length,N=0;N<k;N++)h.call(void 0,g[N],f&&f[N],l)}var Zg=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function MA(l,h){if(l){l=l.split("&");for(var f=0;f<l.length;f++){var g=l[f].indexOf("="),k=null;if(0<=g){var N=l[f].substring(0,g);k=l[f].substring(g+1)}else N=l[f];h(N,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function Yr(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof Yr){this.h=l.h,Rl(this,l.j),this.o=l.o,this.g=l.g,Cl(this,l.s),this.l=l.l;var h=l.i,f=new Eo;f.i=h.i,h.g&&(f.g=new Map(h.g),f.h=h.h),ey(this,f),this.m=l.m}else l&&(h=String(l).match(Zg))?(this.h=!1,Rl(this,h[1]||"",!0),this.o=vo(h[2]||""),this.g=vo(h[3]||"",!0),Cl(this,h[4]),this.l=vo(h[5]||"",!0),ey(this,h[6]||"",!0),this.m=vo(h[7]||"")):(this.h=!1,this.i=new Eo(null,this.h))}Yr.prototype.toString=function(){var l=[],h=this.j;h&&l.push(Io(h,ty,!0),":");var f=this.g;return(f||h=="file")&&(l.push("//"),(h=this.o)&&l.push(Io(h,ty,!0),"@"),l.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&l.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&l.push("/"),l.push(Io(f,f.charAt(0)=="/"?BA:UA,!0))),(f=this.i.toString())&&l.push("?",f),(f=this.m)&&l.push("#",Io(f,jA)),l.join("")};function Pn(l){return new Yr(l)}function Rl(l,h,f){l.j=f?vo(h,!0):h,l.j&&(l.j=l.j.replace(/:$/,""))}function Cl(l,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);l.s=h}else l.s=null}function ey(l,h,f){h instanceof Eo?(l.i=h,$A(l.i,l.h)):(f||(h=Io(h,zA)),l.i=new Eo(h,l.h))}function ge(l,h,f){l.i.set(h,f)}function kl(l){return ge(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function vo(l,h){return l?h?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function Io(l,h,f){return typeof l=="string"?(l=encodeURI(l).replace(h,FA),f&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function FA(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var ty=/[#\/\?@]/g,UA=/[#\?:]/g,BA=/[#\?]/g,zA=/[#\?@]/g,jA=/#/g;function Eo(l,h){this.h=this.g=null,this.i=l||null,this.j=!!h}function Zn(l){l.g||(l.g=new Map,l.h=0,l.i&&MA(l.i,function(h,f){l.add(decodeURIComponent(h.replace(/\+/g," ")),f)}))}n=Eo.prototype,n.add=function(l,h){Zn(this),this.i=null,l=Bi(this,l);var f=this.g.get(l);return f||this.g.set(l,f=[]),f.push(h),this.h+=1,this};function ny(l,h){Zn(l),h=Bi(l,h),l.g.has(h)&&(l.i=null,l.h-=l.g.get(h).length,l.g.delete(h))}function ry(l,h){return Zn(l),h=Bi(l,h),l.g.has(h)}n.forEach=function(l,h){Zn(this),this.g.forEach(function(f,g){f.forEach(function(k){l.call(h,k,g,this)},this)},this)},n.na=function(){Zn(this);const l=Array.from(this.g.values()),h=Array.from(this.g.keys()),f=[];for(let g=0;g<h.length;g++){const k=l[g];for(let N=0;N<k.length;N++)f.push(h[g])}return f},n.V=function(l){Zn(this);let h=[];if(typeof l=="string")ry(this,l)&&(h=h.concat(this.g.get(Bi(this,l))));else{l=Array.from(this.g.values());for(let f=0;f<l.length;f++)h=h.concat(l[f])}return h},n.set=function(l,h){return Zn(this),this.i=null,l=Bi(this,l),ry(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[h]),this.h+=1,this},n.get=function(l,h){return l?(l=this.V(l),0<l.length?String(l[0]):h):h};function iy(l,h,f){ny(l,h),0<f.length&&(l.i=null,l.g.set(Bi(l,h),D(f)),l.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],h=Array.from(this.g.keys());for(var f=0;f<h.length;f++){var g=h[f];const N=encodeURIComponent(String(g)),z=this.V(g);for(g=0;g<z.length;g++){var k=N;z[g]!==""&&(k+="="+encodeURIComponent(String(z[g]))),l.push(k)}}return this.i=l.join("&")};function Bi(l,h){return h=String(h),l.j&&(h=h.toLowerCase()),h}function $A(l,h){h&&!l.j&&(Zn(l),l.i=null,l.g.forEach(function(f,g){var k=g.toLowerCase();g!=k&&(ny(this,g),iy(this,k,f))},l)),l.j=h}function qA(l,h){const f=new yo;if(a.Image){const g=new Image;g.onload=E(er,f,"TestLoadImage: loaded",!0,h,g),g.onerror=E(er,f,"TestLoadImage: error",!1,h,g),g.onabort=E(er,f,"TestLoadImage: abort",!1,h,g),g.ontimeout=E(er,f,"TestLoadImage: timeout",!1,h,g),a.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=l}else h(!1)}function WA(l,h){const f=new yo,g=new AbortController,k=setTimeout(()=>{g.abort(),er(f,"TestPingServer: timeout",!1,h)},1e4);fetch(l,{signal:g.signal}).then(N=>{clearTimeout(k),N.ok?er(f,"TestPingServer: ok",!0,h):er(f,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(k),er(f,"TestPingServer: error",!1,h)})}function er(l,h,f,g,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),g(f)}catch{}}function KA(){this.g=new CA}function HA(l,h,f){const g=f||"";try{Jg(l,function(k,N){let z=k;c(k)&&(z=Fh(k)),h.push(g+N+"="+encodeURIComponent(z))})}catch(k){throw h.push(g+"type="+encodeURIComponent("_badmap")),k}}function Vl(l){this.l=l.Ub||null,this.j=l.eb||!1}R(Vl,Uh),Vl.prototype.g=function(){return new Dl(this.l,this.j)},Vl.prototype.i=function(l){return function(){return l}}({});function Dl(l,h){et.call(this),this.D=l,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R(Dl,et),n=Dl.prototype,n.open=function(l,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=h,this.readyState=1,To(this)},n.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(h.body=l),(this.D||a).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,wo(this)),this.readyState=0},n.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,To(this)),this.g&&(this.readyState=3,To(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;sy(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function sy(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}n.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var h=l.value?l.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!l.done}))&&(this.response=this.responseText+=h)}l.done?wo(this):To(this),this.readyState==3&&sy(this)}},n.Ra=function(l){this.g&&(this.response=this.responseText=l,wo(this))},n.Qa=function(l){this.g&&(this.response=l,wo(this))},n.ga=function(){this.g&&wo(this)};function wo(l){l.readyState=4,l.l=null,l.j=null,l.v=null,To(l)}n.setRequestHeader=function(l,h){this.u.append(l,h)},n.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],h=this.h.entries();for(var f=h.next();!f.done;)f=f.value,l.push(f[0]+": "+f[1]),f=h.next();return l.join(`\r
`)};function To(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(Dl.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function oy(l){let h="";return M(l,function(f,g){h+=g,h+=":",h+=f,h+=`\r
`}),h}function Qh(l,h,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=oy(f),typeof l=="string"?f!=null&&encodeURIComponent(String(f)):ge(l,h,f))}function Pe(l){et.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(Pe,et);var GA=/^https?$/i,QA=["POST","PUT"];n=Pe.prototype,n.Ha=function(l){this.J=l},n.ea=function(l,h,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);h=h?h.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():jh.g(),this.v=this.o?Og(this.o):Og(jh),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(h,String(l),!0),this.B=!1}catch(N){ay(this,N);return}if(l=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var k in g)f.set(k,g[k]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const N of g.keys())f.set(N,g.get(N));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(N=>N.toLowerCase()=="content-type"),k=a.FormData&&l instanceof a.FormData,!(0<=Array.prototype.indexOf.call(QA,h,void 0))||g||k||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[N,z]of f)this.g.setRequestHeader(N,z);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{cy(this),this.u=!0,this.g.send(l),this.u=!1}catch(N){ay(this,N)}};function ay(l,h){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=h,l.m=5,ly(l),Nl(l)}function ly(l){l.A||(l.A=!0,ft(l,"complete"),ft(l,"error"))}n.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,ft(this,"complete"),ft(this,"abort"),Nl(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Nl(this,!0)),Pe.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?uy(this):this.bb())},n.bb=function(){uy(this)};function uy(l){if(l.h&&typeof o<"u"&&(!l.v[1]||Rn(l)!=4||l.Z()!=2)){if(l.u&&Rn(l)==4)Dg(l.Ea,0,l);else if(ft(l,"readystatechange"),Rn(l)==4){l.h=!1;try{const z=l.Z();e:switch(z){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var f;if(!(f=h)){var g;if(g=z===0){var k=String(l.D).match(Zg)[1]||null;!k&&a.self&&a.self.location&&(k=a.self.location.protocol.slice(0,-1)),g=!GA.test(k?k.toLowerCase():"")}f=g}if(f)ft(l,"complete"),ft(l,"success");else{l.m=6;try{var N=2<Rn(l)?l.g.statusText:""}catch{N=""}l.l=N+" ["+l.Z()+"]",ly(l)}}finally{Nl(l)}}}}function Nl(l,h){if(l.g){cy(l);const f=l.g,g=l.v[0]?()=>{}:null;l.g=null,l.v=null,h||ft(l,"ready");try{f.onreadystatechange=g}catch{}}}function cy(l){l.I&&(a.clearTimeout(l.I),l.I=null)}n.isActive=function(){return!!this.g};function Rn(l){return l.g?l.g.readyState:0}n.Z=function(){try{return 2<Rn(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(l){if(this.g){var h=this.g.responseText;return l&&h.indexOf(l)==0&&(h=h.substring(l.length)),RA(h)}};function hy(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function XA(l){const h={};l=(l.g&&2<=Rn(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<l.length;g++){if(_(l[g]))continue;var f=P(l[g]);const k=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const N=h[k]||[];h[k]=N,N.push(f)}v(h,function(g){return g.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function So(l,h,f){return f&&f.internalChannelParams&&f.internalChannelParams[l]||h}function dy(l){this.Aa=0,this.i=[],this.j=new yo,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=So("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=So("baseRetryDelayMs",5e3,l),this.cb=So("retryDelaySeedMs",1e4,l),this.Wa=So("forwardChannelMaxRetries",2,l),this.wa=So("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new Hg(l&&l.concurrentRequestLimit),this.Da=new KA,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=dy.prototype,n.la=8,n.G=1,n.connect=function(l,h,f,g){pt(0),this.W=l,this.H=h||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=Ey(this,null,this.W),bl(this)};function Xh(l){if(fy(l),l.G==3){var h=l.U++,f=Pn(l.I);if(ge(f,"SID",l.K),ge(f,"RID",h),ge(f,"TYPE","terminate"),Ao(l,f),h=new Jn(l,l.j,h),h.L=2,h.v=kl(Pn(f)),f=!1,a.navigator&&a.navigator.sendBeacon)try{f=a.navigator.sendBeacon(h.v.toString(),"")}catch{}!f&&a.Image&&(new Image().src=h.v,f=!0),f||(h.g=wy(h.j,null),h.g.ea(h.v)),h.F=Date.now(),Pl(h)}Iy(l)}function xl(l){l.g&&(Jh(l),l.g.cancel(),l.g=null)}function fy(l){xl(l),l.u&&(a.clearTimeout(l.u),l.u=null),Ol(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&a.clearTimeout(l.s),l.s=null)}function bl(l){if(!Gg(l.h)&&!l.s){l.s=!0;var h=l.Ga;En||J(),q||(En(),q=!0),Y.add(h,l),l.B=0}}function YA(l,h){return Qg(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=h.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=go(m(l.Ga,l,h),vy(l,l.B)),l.B++,!0)}n.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const k=new Jn(this,this.j,l);let N=this.o;if(this.S&&(N?(N=y(N),T(N,this.S)):N=this.S),this.m!==null||this.O||(k.H=N,N=null),this.P)e:{for(var h=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(h+=g,4096<h){h=f;break e}if(h===4096||f===this.i.length-1){h=f+1;break e}}h=1e3}else h=1e3;h=my(this,k,h),f=Pn(this.I),ge(f,"RID",l),ge(f,"CVER",22),this.D&&ge(f,"X-HTTP-Session-Id",this.D),Ao(this,f),N&&(this.O?h="headers="+encodeURIComponent(String(oy(N)))+"&"+h:this.m&&Qh(f,this.m,N)),Gh(this.h,k),this.Ua&&ge(f,"TYPE","init"),this.P?(ge(f,"$req",h),ge(f,"SID","null"),k.T=!0,qh(k,f,null)):qh(k,f,h),this.G=2}}else this.G==3&&(l?py(this,l):this.i.length==0||Gg(this.h)||py(this))};function py(l,h){var f;h?f=h.l:f=l.U++;const g=Pn(l.I);ge(g,"SID",l.K),ge(g,"RID",f),ge(g,"AID",l.T),Ao(l,g),l.m&&l.o&&Qh(g,l.m,l.o),f=new Jn(l,l.j,f,l.B+1),l.m===null&&(f.H=l.o),h&&(l.i=h.D.concat(l.i)),h=my(l,f,1e3),f.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),Gh(l.h,f),qh(f,g,h)}function Ao(l,h){l.H&&M(l.H,function(f,g){ge(h,g,f)}),l.l&&Jg({},function(f,g){ge(h,g,f)})}function my(l,h,f){f=Math.min(l.i.length,f);var g=l.l?m(l.l.Na,l.l,l):null;e:{var k=l.i;let N=-1;for(;;){const z=["count="+f];N==-1?0<f?(N=k[0].g,z.push("ofs="+N)):N=0:z.push("ofs="+N);let fe=!0;for(let Qe=0;Qe<f;Qe++){let oe=k[Qe].g;const tt=k[Qe].map;if(oe-=N,0>oe)N=Math.max(0,k[Qe].g-100),fe=!1;else try{HA(tt,z,"req"+oe+"_")}catch{g&&g(tt)}}if(fe){g=z.join("&");break e}}}return l=l.i.splice(0,f),h.D=l,g}function gy(l){if(!l.g&&!l.u){l.Y=1;var h=l.Fa;En||J(),q||(En(),q=!0),Y.add(h,l),l.v=0}}function Yh(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=go(m(l.Fa,l),vy(l,l.v)),l.v++,!0)}n.Fa=function(){if(this.u=null,yy(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=go(m(this.ab,this),l)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,pt(10),xl(this),yy(this))};function Jh(l){l.A!=null&&(a.clearTimeout(l.A),l.A=null)}function yy(l){l.g=new Jn(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var h=Pn(l.qa);ge(h,"RID","rpc"),ge(h,"SID",l.K),ge(h,"AID",l.T),ge(h,"CI",l.F?"0":"1"),!l.F&&l.ja&&ge(h,"TO",l.ja),ge(h,"TYPE","xmlhttp"),Ao(l,h),l.m&&l.o&&Qh(h,l.m,l.o),l.L&&(l.g.I=l.L);var f=l.g;l=l.ia,f.L=1,f.v=kl(Pn(h)),f.m=null,f.P=!0,qg(f,l)}n.Za=function(){this.C!=null&&(this.C=null,xl(this),Yh(this),pt(19))};function Ol(l){l.C!=null&&(a.clearTimeout(l.C),l.C=null)}function _y(l,h){var f=null;if(l.g==h){Ol(l),Jh(l),l.g=null;var g=2}else if(Hh(l.h,h))f=h.D,Xg(l.h,h),g=1;else return;if(l.G!=0){if(h.o)if(g==1){f=h.m?h.m.length:0,h=Date.now()-h.F;var k=l.B;g=Tl(),ft(g,new Bg(g,f)),bl(l)}else gy(l);else if(k=h.s,k==3||k==0&&0<h.X||!(g==1&&YA(l,h)||g==2&&Yh(l)))switch(f&&0<f.length&&(h=l.h,h.i=h.i.concat(f)),k){case 1:Jr(l,5);break;case 4:Jr(l,10);break;case 3:Jr(l,6);break;default:Jr(l,2)}}}function vy(l,h){let f=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(f*=2),f*h}function Jr(l,h){if(l.j.info("Error code "+h),h==2){var f=m(l.fb,l),g=l.Xa;const k=!g;g=new Yr(g||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Rl(g,"https"),kl(g),k?qA(g.toString(),f):WA(g.toString(),f)}else pt(2);l.G=0,l.l&&l.l.sa(h),Iy(l),fy(l)}n.fb=function(l){l?(this.j.info("Successfully pinged google.com"),pt(2)):(this.j.info("Failed to ping google.com"),pt(1))};function Iy(l){if(l.G=0,l.ka=[],l.l){const h=Yg(l.h);(h.length!=0||l.i.length!=0)&&(O(l.ka,h),O(l.ka,l.i),l.h.i.length=0,D(l.i),l.i.length=0),l.l.ra()}}function Ey(l,h,f){var g=f instanceof Yr?Pn(f):new Yr(f);if(g.g!="")h&&(g.g=h+"."+g.g),Cl(g,g.s);else{var k=a.location;g=k.protocol,h=h?h+"."+k.hostname:k.hostname,k=+k.port;var N=new Yr(null);g&&Rl(N,g),h&&(N.g=h),k&&Cl(N,k),f&&(N.l=f),g=N}return f=l.D,h=l.ya,f&&h&&ge(g,f,h),ge(g,"VER",l.la),Ao(l,g),g}function wy(l,h,f){if(h&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=l.Ca&&!l.pa?new Pe(new Vl({eb:f})):new Pe(l.pa),h.Ha(l.J),h}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ty(){}n=Ty.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ll(){}Ll.prototype.g=function(l,h){return new kt(l,h)};function kt(l,h){et.call(this),this.g=new dy(h),this.l=l,this.h=h&&h.messageUrlParams||null,l=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(l?l["X-WebChannel-Content-Type"]=h.messageContentType:l={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(l?l["X-WebChannel-Client-Profile"]=h.va:l={"X-WebChannel-Client-Profile":h.va}),this.g.S=l,(l=h&&h.Sb)&&!_(l)&&(this.g.m=l),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!_(h)&&(this.g.D=h,l=this.h,l!==null&&h in l&&(l=this.h,h in l&&delete l[h])),this.j=new zi(this)}R(kt,et),kt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},kt.prototype.close=function(){Xh(this.g)},kt.prototype.o=function(l){var h=this.g;if(typeof l=="string"){var f={};f.__data__=l,l=f}else this.u&&(f={},f.__data__=Fh(l),l=f);h.i.push(new bA(h.Ya++,l)),h.G==3&&bl(h)},kt.prototype.N=function(){this.g.l=null,delete this.j,Xh(this.g),delete this.g,kt.aa.N.call(this)};function Sy(l){Bh.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var h=l.__sm__;if(h){e:{for(const f in h){l=f;break e}l=void 0}(this.i=l)&&(l=this.i,h=h!==null&&l in h?h[l]:void 0),this.data=h}else this.data=l}R(Sy,Bh);function Ay(){zh.call(this),this.status=1}R(Ay,zh);function zi(l){this.g=l}R(zi,Ty),zi.prototype.ua=function(){ft(this.g,"a")},zi.prototype.ta=function(l){ft(this.g,new Sy(l))},zi.prototype.sa=function(l){ft(this.g,new Ay)},zi.prototype.ra=function(){ft(this.g,"b")},Ll.prototype.createWebChannel=Ll.prototype.g,kt.prototype.send=kt.prototype.o,kt.prototype.open=kt.prototype.m,kt.prototype.close=kt.prototype.close,i0=function(){return new Ll},r0=function(){return Tl()},n0=Qr,$f={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Sl.NO_ERROR=0,Sl.TIMEOUT=8,Sl.HTTP_ERROR=6,Pu=Sl,zg.COMPLETE="complete",t0=zg,Lg.EventType=po,po.OPEN="a",po.CLOSE="b",po.ERROR="c",po.MESSAGE="d",et.prototype.listen=et.prototype.K,Ho=Lg,Pe.prototype.listenOnce=Pe.prototype.L,Pe.prototype.getLastError=Pe.prototype.Ka,Pe.prototype.getLastErrorCode=Pe.prototype.Ba,Pe.prototype.getStatus=Pe.prototype.Z,Pe.prototype.getResponseJson=Pe.prototype.Oa,Pe.prototype.getResponseText=Pe.prototype.oa,Pe.prototype.send=Pe.prototype.ea,Pe.prototype.setWithCredentials=Pe.prototype.Ha,e0=Pe}).apply(typeof nu<"u"?nu:typeof self<"u"?self:typeof window<"u"?window:{});const pv="@firebase/firestore",mv="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ot.UNAUTHENTICATED=new ot(null),ot.GOOGLE_CREDENTIALS=new ot("google-credentials-uid"),ot.FIRST_PARTY=new ot("first-party-uid"),ot.MOCK_USER=new ot("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let so="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ci=new cm("@firebase/firestore");function Xi(){return Ci.logLevel}function L(n,...e){if(Ci.logLevel<=ne.DEBUG){const t=e.map(Sm);Ci.debug(`Firestore (${so}): ${n}`,...t)}}function Ne(n,...e){if(Ci.logLevel<=ne.ERROR){const t=e.map(Sm);Ci.error(`Firestore (${so}): ${n}`,...t)}}function Lr(n,...e){if(Ci.logLevel<=ne.WARN){const t=e.map(Sm);Ci.warn(`Firestore (${so}): ${n}`,...t)}}function Sm(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,s0(n,r,t)}function s0(n,e,t){let r=`FIRESTORE (${so}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Ne(r),new Error(r)}function G(n,e,t,r){let i="Unexpected state";typeof t=="string"?i=t:r=t,n||s0(e,i,r)}function H(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class B extends Hn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LD{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class MD{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(ot.UNAUTHENTICATED))}shutdown(){}}class FD{constructor(e){this.t=e,this.currentUser=ot.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){G(this.o===void 0,42304);let r=this.i;const i=u=>this.i!==r?(r=this.i,t(u)):Promise.resolve();let s=new gn;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new gn,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},a=u=>{L("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>a(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(L("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new gn)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(L("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(G(typeof r.accessToken=="string",31837,{l:r}),new LD(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return G(e===null||typeof e=="string",2055,{h:e}),new ot(e)}}class UD{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=ot.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class BD{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new UD(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(ot.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class gv{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class zD{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ue(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){G(this.o===void 0,3512);const r=s=>{s.error!=null&&L("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,L("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{L("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):L("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new gv(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(G(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new gv(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jD(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function o0(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Am{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=jD(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%62))}return r}}function X(n,e){return n<e?-1:n>e?1:0}function qf(n,e){let t=0;for(;t<n.length&&t<e.length;){const r=n.codePointAt(t),i=e.codePointAt(t);if(r!==i){if(r<128&&i<128)return X(r,i);{const s=o0(),o=$D(s.encode(yv(n,t)),s.encode(yv(e,t)));return o!==0?o:X(r,i)}}t+=r>65535?2:1}return X(n.length,e.length)}function yv(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function $D(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return X(n[t],e[t]);return X(n.length,e.length)}function Ns(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}function a0(n){return n+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _v="__name__";class un{constructor(e,t,r){t===void 0?t=0:t>e.length&&K(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&K(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return un.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof un?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=un.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return X(e.length,t.length)}static compareSegments(e,t){const r=un.isNumericId(e),i=un.isNumericId(t);return r&&!i?-1:!r&&i?1:r&&i?un.extractNumericId(e).compare(un.extractNumericId(t)):qf(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Dr.fromString(e.substring(4,e.length-2))}}class ae extends un{construct(e,t,r){return new ae(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new B(b.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new ae(t)}static emptyPath(){return new ae([])}}const qD=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Te extends un{construct(e,t,r){return new Te(e,t,r)}static isValidIdentifier(e){return qD.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Te.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===_v}static keyField(){return new Te([_v])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new B(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let o=!1;for(;i<e.length;){const a=e[i];if(a==="\\"){if(i+1===e.length)throw new B(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new B(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new B(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Te(t)}static emptyPath(){return new Te([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${constructor(e){this.path=e}static fromPath(e){return new $(ae.fromString(e))}static fromName(e){return new $(ae.fromString(e).popFirst(5))}static empty(){return new $(ae.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ae.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ae.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new $(new ae(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l0(n,e,t){if(!t)throw new B(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function WD(n,e,t,r){if(e===!0&&r===!0)throw new B(b.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function vv(n){if(!$.isDocumentKey(n))throw new B(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Iv(n){if($.isDocumentKey(n))throw new B(b.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function u0(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function ah(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":K(12329,{type:typeof n})}function Ot(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new B(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=ah(n);throw new B(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function KD(n,e){if(e<=0)throw new B(b.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Me(n,e){const t={typeString:n};return e&&(t.value=e),t}function cl(n,e){if(!u0(n))throw new B(b.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const o=n[r];if(i&&typeof o!==i){t=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){t=`Expected '${r}' field to equal '${s.value}'`;break}}if(t)throw new B(b.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ev=-62135596800,wv=1e6;class le{static now(){return le.fromMillis(Date.now())}static fromDate(e){return le.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*wv);return new le(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new B(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new B(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Ev)throw new B(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new B(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/wv}_compareTo(e){return this.seconds===e.seconds?X(this.nanoseconds,e.nanoseconds):X(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:le._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(cl(e,le._jsonSchema))return new le(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ev;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}le._jsonSchemaVersion="firestore/timestamp/1.0",le._jsonSchema={type:Me("string",le._jsonSchemaVersion),seconds:Me("number"),nanoseconds:Me("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{static fromTimestamp(e){return new Q(e)}static min(){return new Q(new le(0,0))}static max(){return new Q(new le(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xs=-1;class mc{constructor(e,t,r,i){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=i}}function Wf(n){return n.fields.find(e=>e.kind===2)}function ri(n){return n.fields.filter(e=>e.kind!==2)}mc.UNKNOWN_ID=-1;class Ru{constructor(e,t){this.fieldPath=e,this.kind=t}}class ja{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new ja(0,Ft.min())}}function c0(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=Q.fromTimestamp(r===1e9?new le(t+1,0):new le(t,r));return new Ft(i,$.empty(),e)}function h0(n){return new Ft(n.readTime,n.key,xs)}class Ft{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Ft(Q.min(),$.empty(),xs)}static max(){return new Ft(Q.max(),$.empty(),xs)}}function Pm(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=$.comparator(n.documentKey,e.documentKey),t!==0?t:X(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const d0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class f0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qr(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==d0)throw n;L("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&K(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new C((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof C?t:C.resolve(t)}catch(t){return C.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):C.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):C.reject(t)}static resolve(e){return new C((t,r)=>{t(e)})}static reject(e){return new C((t,r)=>{r(e)})}static waitFor(e){return new C((t,r)=>{let i=0,s=0,o=!1;e.forEach(a=>{++i,a.next(()=>{++s,o&&s===i&&t()},u=>r(u))}),o=!0,s===i&&t()})}static or(e){let t=C.resolve(!1);for(const r of e)t=t.next(i=>i?C.resolve(i):r());return t}static forEach(e,t){const r=[];return e.forEach((i,s)=>{r.push(t.call(this,i,s))}),this.waitFor(r)}static mapArray(e,t){return new C((r,i)=>{const s=e.length,o=new Array(s);let a=0;for(let u=0;u<s;u++){const c=u;t(e[c]).next(d=>{o[c]=d,++a,a===s&&r(o)},d=>i(d))}})}static doWhile(e,t){return new C((r,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):r()};s()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt="SimpleDb";class lh{static open(e,t,r,i){try{return new lh(t,e.transaction(i,r))}catch(s){throw new da(t,s)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new gn,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new da(e,t.error)):this.S.resolve()},this.transaction.onerror=r=>{const i=Rm(r.target.error);this.S.reject(new da(e,i))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(L(Dt,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}v(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new GD(t)}}class Nr{static delete(e){return L(Dt,"Removing database:",e),si(Yw().indexedDB.deleteDatabase(e)).toPromise()}static C(){if(!sT())return!1;if(Nr.F())return!0;const e=ze(),t=Nr.M(e),r=0<t&&t<10,i=p0(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||r||s)}static F(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.O)==="YES"}static N(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),r=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(r)}constructor(e,t,r){this.name=e,this.version=t,this.B=r,this.L=null,Nr.M(ze())===12.2&&Ne("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async k(e){return this.db||(L(Dt,"Opening database:",this.name),this.db=await new Promise((t,r)=>{const i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{const o=s.target.result;t(o)},i.onblocked=()=>{r(new da(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{const o=s.target.error;o.name==="VersionError"?r(new B(b.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?r(new B(b.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):r(new da(e,o))},i.onupgradeneeded=s=>{L(Dt,'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);const o=s.target.result;if(this.L!==null&&this.L!==s.oldVersion)throw new Error(`refusing to open IndexedDB database due to potential corruption of the IndexedDB database data; this corruption could be caused by clicking the "clear site data" button in a web browser; try reloading the web page to re-initialize the IndexedDB database: lastClosedDbVersion=${this.L}, event.oldVersion=${s.oldVersion}, event.newVersion=${s.newVersion}, db.version=${o.version}`);this.B.q(o,i.transaction,s.oldVersion,this.version).next(()=>{L(Dt,"Database upgrade to version "+this.version+" complete")})}}),this.db.addEventListener("close",t=>{const r=t.target;this.L=r.version},{passive:!0})),this.db.addEventListener("versionchange",t=>{var r;t.newVersion===null&&(Lr('Received "versionchange" event with newVersion===null; notifying the registered DatabaseDeletedListener, if any'),(r=this.databaseDeletedListener)===null||r===void 0||r.call(this))},{passive:!0}),this.db}setDatabaseDeletedListener(e){if(this.databaseDeletedListener)throw new Error("setDatabaseDeletedListener() may only be called once, and it has already been called");this.databaseDeletedListener=e}async runTransaction(e,t,r,i){const s=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.k(e);const a=lh.open(this.db,e,s?"readonly":"readwrite",r),u=i(a).next(c=>(a.v(),c)).catch(c=>(a.abort(c),C.reject(c))).toPromise();return u.catch(()=>{}),await a.D,u}catch(a){const u=a,c=u.name!=="FirebaseError"&&o<3;if(L(Dt,"Transaction failed with error:",u.message,"Retrying:",c),this.close(),!c)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function p0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class HD{constructor(e){this.$=e,this.U=!1,this.K=null}get isDone(){return this.U}get W(){return this.K}set cursor(e){this.$=e}done(){this.U=!0}G(e){this.K=e}delete(){return si(this.$.delete())}}class da extends B{constructor(e,t){super(b.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Wr(n){return n.name==="IndexedDbTransactionError"}class GD{constructor(e){this.store=e}put(e,t){let r;return t!==void 0?(L(Dt,"PUT",this.store.name,e,t),r=this.store.put(t,e)):(L(Dt,"PUT",this.store.name,"<auto-key>",e),r=this.store.put(e)),si(r)}add(e){return L(Dt,"ADD",this.store.name,e,e),si(this.store.add(e))}get(e){return si(this.store.get(e)).next(t=>(t===void 0&&(t=null),L(Dt,"GET",this.store.name,e,t),t))}delete(e){return L(Dt,"DELETE",this.store.name,e),si(this.store.delete(e))}count(){return L(Dt,"COUNT",this.store.name),si(this.store.count())}j(e,t){const r=this.options(e,t),i=r.index?this.store.index(r.index):this.store;if(typeof i.getAll=="function"){const s=i.getAll(r.range);return new C((o,a)=>{s.onerror=u=>{a(u.target.error)},s.onsuccess=u=>{o(u.target.result)}})}{const s=this.cursor(r),o=[];return this.J(s,(a,u)=>{o.push(u)}).next(()=>o)}}H(e,t){const r=this.store.getAll(e,t===null?void 0:t);return new C((i,s)=>{r.onerror=o=>{s(o.target.error)},r.onsuccess=o=>{i(o.target.result)}})}Y(e,t){L(Dt,"DELETE ALL",this.store.name);const r=this.options(e,t);r.Z=!1;const i=this.cursor(r);return this.J(i,(s,o,a)=>a.delete())}X(e,t){let r;t?r=e:(r={},t=e);const i=this.cursor(r);return this.J(i,t)}ee(e){const t=this.cursor({});return new C((r,i)=>{t.onerror=s=>{const o=Rm(s.target.error);i(o)},t.onsuccess=s=>{const o=s.target.result;o?e(o.primaryKey,o.value).next(a=>{a?o.continue():r()}):r()}})}J(e,t){const r=[];return new C((i,s)=>{e.onerror=o=>{s(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void i();const u=new HD(a),c=t(a.primaryKey,a.value,u);if(c instanceof C){const d=c.catch(p=>(u.done(),C.reject(p)));r.push(d)}u.isDone?i():u.W===null?a.continue():a.continue(u.W)}}).next(()=>C.waitFor(r))}options(e,t){let r;return e!==void 0&&(typeof e=="string"?r=e:t=e),{index:r,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const r=this.store.index(e.index);return e.Z?r.openKeyCursor(e.range,t):r.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function si(n){return new C((e,t)=>{n.onsuccess=r=>{const i=r.target.result;e(i)},n.onerror=r=>{const i=Rm(r.target.error);t(i)}})}let Tv=!1;function Rm(n){const e=Nr.M(ze());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(n.message.indexOf(t)>=0){const r=new B("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Tv||(Tv=!0,setTimeout(()=>{throw r},0)),r}}return n}const fa="IndexBackfiller";class QD{constructor(e,t){this.asyncQueue=e,this.te=t,this.task=null}start(){this.ne(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}ne(e){L(fa,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const t=await this.te.re();L(fa,`Documents written: ${t}`)}catch(t){Wr(t)?L(fa,"Ignoring IndexedDB error during index backfill: ",t):await qr(t)}await this.ne(6e4)})}}class XD{constructor(e,t){this.localStore=e,this.persistence=t}async re(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.ie(t,e))}ie(e,t){const r=new Set;let i=t,s=!0;return C.doWhile(()=>s===!0&&i>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o=>{if(o!==null&&!r.has(o))return L(fa,`Processing collection: ${o}`),this.se(e,o,i).next(a=>{i-=a,r.add(o)});s=!1})).next(()=>t-i)}se(e,t,r){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(i=>this.localStore.localDocuments.getNextDocuments(e,t,i,r).next(s=>{const o=s.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next(()=>this.oe(i,s)).next(a=>(L(fa,`Updating offset: ${a}`),this.localStore.indexManager.updateCollectionGroup(e,t,a))).next(()=>o.size)}))}oe(e,t){let r=e;return t.changes.forEach((i,s)=>{const o=h0(s);Pm(o,r)>0&&(r=o)}),new Ft(r.readTime,r.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this._e(r),this.ae=r=>t.writeSequenceNumber(r))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Tt.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mi=-1;function uh(n){return n==null}function $a(n){return n===0&&1/n==-1/0}function m0(n){return typeof n=="number"&&Number.isInteger(n)&&!$a(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gc="";function ht(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Sv(e)),e=YD(n.get(t),e);return Sv(e)}function YD(n,e){let t=e;const r=n.length;for(let i=0;i<r;i++){const s=n.charAt(i);switch(s){case"\0":t+="";break;case gc:t+="";break;default:t+=s}}return t}function Sv(n){return n+gc+""}function dn(n){const e=n.length;if(G(e>=2,64408,{path:n}),e===2)return G(n.charAt(0)===gc&&n.charAt(1)==="",56145,{path:n}),ae.emptyPath();const t=e-2,r=[];let i="";for(let s=0;s<e;){const o=n.indexOf(gc,s);switch((o<0||o>t)&&K(50515,{path:n}),n.charAt(o+1)){case"":const a=n.substring(s,o);let u;i.length===0?u=a:(i+=a,u=i,i=""),r.push(u);break;case"":i+=n.substring(s,o),i+="\0";break;case"":i+=n.substring(s,o+1);break;default:K(61167,{path:n})}s=o+2}return new ae(r)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ii="remoteDocuments",hl="owner",qi="owner",qa="mutationQueues",JD="userId",en="mutations",Av="batchId",di="userMutationsIndex",Pv=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cu(n,e){return[n,ht(e)]}function g0(n,e,t){return[n,ht(e),t]}const ZD={},bs="documentMutations",yc="remoteDocumentsV14",eN=["prefixPath","collectionGroup","readTime","documentId"],ku="documentKeyIndex",tN=["prefixPath","collectionGroup","documentId"],y0="collectionGroupIndex",nN=["collectionGroup","readTime","prefixPath","documentId"],Wa="remoteDocumentGlobal",Kf="remoteDocumentGlobalKey",Os="targets",_0="queryTargetsIndex",rN=["canonicalId","targetId"],Ls="targetDocuments",iN=["targetId","path"],Cm="documentTargetsIndex",sN=["path","targetId"],_c="targetGlobalKey",gi="targetGlobal",Ka="collectionParents",oN=["collectionId","parent"],Ms="clientMetadata",aN="clientId",ch="bundles",lN="bundleId",hh="namedQueries",uN="name",km="indexConfiguration",cN="indexId",Hf="collectionGroupIndex",hN="collectionGroup",pa="indexState",dN=["indexId","uid"],v0="sequenceNumberIndex",fN=["uid","sequenceNumber"],ma="indexEntries",pN=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],I0="documentKeyIndex",mN=["indexId","uid","orderedDocumentKey"],dh="documentOverlays",gN=["userId","collectionPath","documentId"],Gf="collectionPathOverlayIndex",yN=["userId","collectionPath","largestBatchId"],E0="collectionGroupOverlayIndex",_N=["userId","collectionGroup","largestBatchId"],Vm="globals",vN="name",w0=[qa,en,bs,ii,Os,hl,gi,Ls,Ms,Wa,Ka,ch,hh],IN=[...w0,dh],T0=[qa,en,bs,yc,Os,hl,gi,Ls,Ms,Wa,Ka,ch,hh,dh],S0=T0,Dm=[...S0,km,pa,ma],EN=Dm,A0=[...Dm,Vm],wN=A0;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qf extends f0{constructor(e,t){super(),this.ce=e,this.currentSequenceNumber=t}}function qe(n,e){const t=H(n);return Nr.N(t.ce,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rv(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Kr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function P0(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e,t){this.comparator=e,this.root=t||Ye.EMPTY}insert(e,t){return new me(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ye.BLACK,null,null))}remove(e){return new me(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ye.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ru(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ru(this.root,e,this.comparator,!1)}getReverseIterator(){return new ru(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ru(this.root,e,this.comparator,!0)}}class ru{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ye{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??Ye.RED,this.left=i??Ye.EMPTY,this.right=s??Ye.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new Ye(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Ye.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Ye.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ye.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ye.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw K(43730,{key:this.key,value:this.value});if(this.right.isRed())throw K(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw K(27949);return e+(this.isRed()?0:1)}}Ye.EMPTY=null,Ye.RED=!0,Ye.BLACK=!1;Ye.EMPTY=new class{constructor(){this.size=0}get key(){throw K(57766)}get value(){throw K(16141)}get color(){throw K(16727)}get left(){throw K(29726)}get right(){throw K(36894)}copy(e,t,r,i,s){return this}insert(e,t,r){return new Ye(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e){this.comparator=e,this.data=new me(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Cv(this.data.getIterator())}getIteratorFrom(e){return new Cv(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof he)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new he(this.comparator);return t.data=e,t}}class Cv{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Wi(n){return n.hasNext()?n.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this.fields=e,e.sort(Te.comparator)}static empty(){return new St([])}unionWith(e){let t=new he(Te.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new St(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ns(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R0 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new R0("Invalid base64 string: "+s):s}}(e);return new xe(t)}static fromUint8Array(e){const t=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new xe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return X(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}xe.EMPTY_BYTE_STRING=new xe("");const TN=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function $n(n){if(G(!!n,39018),typeof n=="string"){let e=0;const t=TN.exec(n);if(G(!!t,46558,{timestamp:n}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ve(n.seconds),nanos:ve(n.nanos)}}function ve(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function qn(n){return typeof n=="string"?xe.fromBase64String(n):xe.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C0="server_timestamp",k0="__type__",V0="__previous_value__",D0="__local_write_time__";function Nm(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[k0])===null||t===void 0?void 0:t.stringValue)===C0}function fh(n){const e=n.mapValue.fields[V0];return Nm(e)?fh(e):e}function Ha(n){const e=$n(n.mapValue.fields[D0].timestampValue);return new le(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SN{constructor(e,t,r,i,s,o,a,u,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=d}}const vc="(default)";class ki{constructor(e,t){this.projectId=e,this.database=t||vc}static empty(){return new ki("","")}get isDefaultDatabase(){return this.database===vc}isEqual(e){return e instanceof ki&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xm="__type__",N0="__max__",_r={mapValue:{fields:{__type__:{stringValue:N0}}}},bm="__vector__",Fs="value",Vu={nullValue:"NULL_VALUE"};function Mr(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Nm(n)?4:x0(n)?9007199254740991:ph(n)?10:11:K(28295,{value:n})}function In(n,e){if(n===e)return!0;const t=Mr(n);if(t!==Mr(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Ha(n).isEqual(Ha(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=$n(i.timestampValue),a=$n(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,s){return qn(i.bytesValue).isEqual(qn(s.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,s){return ve(i.geoPointValue.latitude)===ve(s.geoPointValue.latitude)&&ve(i.geoPointValue.longitude)===ve(s.geoPointValue.longitude)}(n,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return ve(i.integerValue)===ve(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=ve(i.doubleValue),a=ve(s.doubleValue);return o===a?$a(o)===$a(a):isNaN(o)&&isNaN(a)}return!1}(n,e);case 9:return Ns(n.arrayValue.values||[],e.arrayValue.values||[],In);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(Rv(o)!==Rv(a))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!In(o[u],a[u])))return!1;return!0}(n,e);default:return K(52216,{left:n})}}function Ga(n,e){return(n.values||[]).find(t=>In(t,e))!==void 0}function Fr(n,e){if(n===e)return 0;const t=Mr(n),r=Mr(e);if(t!==r)return X(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return X(n.booleanValue,e.booleanValue);case 2:return function(s,o){const a=ve(s.integerValue||s.doubleValue),u=ve(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1}(n,e);case 3:return kv(n.timestampValue,e.timestampValue);case 4:return kv(Ha(n),Ha(e));case 5:return qf(n.stringValue,e.stringValue);case 6:return function(s,o){const a=qn(s),u=qn(o);return a.compareTo(u)}(n.bytesValue,e.bytesValue);case 7:return function(s,o){const a=s.split("/"),u=o.split("/");for(let c=0;c<a.length&&c<u.length;c++){const d=X(a[c],u[c]);if(d!==0)return d}return X(a.length,u.length)}(n.referenceValue,e.referenceValue);case 8:return function(s,o){const a=X(ve(s.latitude),ve(o.latitude));return a!==0?a:X(ve(s.longitude),ve(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Vv(n.arrayValue,e.arrayValue);case 10:return function(s,o){var a,u,c,d;const p=s.fields||{},m=o.fields||{},E=(a=p[Fs])===null||a===void 0?void 0:a.arrayValue,R=(u=m[Fs])===null||u===void 0?void 0:u.arrayValue,D=X(((c=E==null?void 0:E.values)===null||c===void 0?void 0:c.length)||0,((d=R==null?void 0:R.values)===null||d===void 0?void 0:d.length)||0);return D!==0?D:Vv(E,R)}(n.mapValue,e.mapValue);case 11:return function(s,o){if(s===_r.mapValue&&o===_r.mapValue)return 0;if(s===_r.mapValue)return 1;if(o===_r.mapValue)return-1;const a=s.fields||{},u=Object.keys(a),c=o.fields||{},d=Object.keys(c);u.sort(),d.sort();for(let p=0;p<u.length&&p<d.length;++p){const m=qf(u[p],d[p]);if(m!==0)return m;const E=Fr(a[u[p]],c[d[p]]);if(E!==0)return E}return X(u.length,d.length)}(n.mapValue,e.mapValue);default:throw K(23264,{le:t})}}function kv(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return X(n,e);const t=$n(n),r=$n(e),i=X(t.seconds,r.seconds);return i!==0?i:X(t.nanos,r.nanos)}function Vv(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=Fr(t[i],r[i]);if(s)return s}return X(t.length,r.length)}function Us(n){return Xf(n)}function Xf(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=$n(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return qn(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return $.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",i=!0;for(const s of t.values||[])i?i=!1:r+=",",r+=Xf(s);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${Xf(t.fields[o])}`;return i+"}"}(n.mapValue):K(61005,{value:n})}function Du(n){switch(Mr(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=fh(n);return e?16+Du(e):16;case 5:return 2*n.stringValue.length;case 6:return qn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+Du(s),0)}(n.arrayValue);case 10:case 11:return function(r){let i=0;return Kr(r.fields,(s,o)=>{i+=s.length+Du(o)}),i}(n.mapValue);default:throw K(13486,{value:n})}}function Qa(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Yf(n){return!!n&&"integerValue"in n}function Xa(n){return!!n&&"arrayValue"in n}function Dv(n){return!!n&&"nullValue"in n}function Nv(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Nu(n){return!!n&&"mapValue"in n}function ph(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[xm])===null||t===void 0?void 0:t.stringValue)===bm}function ga(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Kr(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=ga(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ga(n.arrayValue.values[t]);return e}return Object.assign({},n)}function x0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===N0}const b0={mapValue:{fields:{[xm]:{stringValue:bm},[Fs]:{arrayValue:{}}}}};function AN(n){return"nullValue"in n?Vu:"booleanValue"in n?{booleanValue:!1}:"integerValue"in n||"doubleValue"in n?{doubleValue:NaN}:"timestampValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in n?{stringValue:""}:"bytesValue"in n?{bytesValue:""}:"referenceValue"in n?Qa(ki.empty(),$.empty()):"geoPointValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in n?{arrayValue:{}}:"mapValue"in n?ph(n)?b0:{mapValue:{}}:K(35942,{value:n})}function PN(n){return"nullValue"in n?{booleanValue:!1}:"booleanValue"in n?{doubleValue:NaN}:"integerValue"in n||"doubleValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in n?{stringValue:""}:"stringValue"in n?{bytesValue:""}:"bytesValue"in n?Qa(ki.empty(),$.empty()):"referenceValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in n?{arrayValue:{}}:"arrayValue"in n?b0:"mapValue"in n?ph(n)?{mapValue:{}}:_r:K(61959,{value:n})}function xv(n,e){const t=Fr(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?-1:!n.inclusive&&e.inclusive?1:0}function bv(n,e){const t=Fr(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?1:!n.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{constructor(e){this.value=e}static empty(){return new ut({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Nu(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ga(t)}setAll(e){let t=Te.emptyPath(),r={},i=[];e.forEach((o,a)=>{if(!t.isImmediateParentOf(a)){const u=this.getFieldsMap(t);this.applyChanges(u,r,i),r={},i=[],t=a.popLast()}o?r[a.lastSegment()]=ga(o):i.push(a.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());Nu(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return In(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];Nu(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){Kr(t,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new ut(ga(this.value))}}function O0(n){const e=[];return Kr(n.fields,(t,r)=>{const i=new Te([t]);if(Nu(r)){const s=O0(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new St(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e,t,r,i,s,o,a){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Ce(e,0,Q.min(),Q.min(),Q.min(),ut.empty(),0)}static newFoundDocument(e,t,r,i){return new Ce(e,1,t,Q.min(),r,i,0)}static newNoDocument(e,t){return new Ce(e,2,t,Q.min(),Q.min(),ut.empty(),0)}static newUnknownDocument(e,t){return new Ce(e,3,t,Q.min(),Q.min(),ut.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ut.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ut.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ce&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ce(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e,t){this.position=e,this.inclusive=t}}function Ov(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){const s=e[i],o=n.position[i];if(s.field.isKeyField()?r=$.comparator($.fromName(o.referenceValue),t.key):r=Fr(o,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Lv(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!In(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(e,t="asc"){this.field=e,this.dir=t}}function RN(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L0{}class re extends L0{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new CN(e,t,r):t==="array-contains"?new DN(e,r):t==="in"?new j0(e,r):t==="not-in"?new NN(e,r):t==="array-contains-any"?new xN(e,r):new re(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new kN(e,r):new VN(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Fr(t,this.value)):t!==null&&Mr(this.value)===Mr(t)&&this.matchesComparison(Fr(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return K(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ue extends L0{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new ue(e,t)}matches(e){return zs(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function zs(n){return n.op==="and"}function Jf(n){return n.op==="or"}function Om(n){return M0(n)&&zs(n)}function M0(n){for(const e of n.filters)if(e instanceof ue)return!1;return!0}function Zf(n){if(n instanceof re)return n.field.canonicalString()+n.op.toString()+Us(n.value);if(Om(n))return n.filters.map(e=>Zf(e)).join(",");{const e=n.filters.map(t=>Zf(t)).join(",");return`${n.op}(${e})`}}function F0(n,e){return n instanceof re?function(r,i){return i instanceof re&&r.op===i.op&&r.field.isEqual(i.field)&&In(r.value,i.value)}(n,e):n instanceof ue?function(r,i){return i instanceof ue&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,a)=>s&&F0(o,i.filters[a]),!0):!1}(n,e):void K(19439)}function U0(n,e){const t=n.filters.concat(e);return ue.create(t,n.op)}function B0(n){return n instanceof re?function(t){return`${t.field.canonicalString()} ${t.op} ${Us(t.value)}`}(n):n instanceof ue?function(t){return t.op.toString()+" {"+t.getFilters().map(B0).join(" ,")+"}"}(n):"Filter"}class CN extends re{constructor(e,t,r){super(e,t,r),this.key=$.fromName(r.referenceValue)}matches(e){const t=$.comparator(e.key,this.key);return this.matchesComparison(t)}}class kN extends re{constructor(e,t){super(e,"in",t),this.keys=z0("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class VN extends re{constructor(e,t){super(e,"not-in",t),this.keys=z0("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function z0(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>$.fromName(r.referenceValue))}class DN extends re{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Xa(t)&&Ga(t.arrayValue,this.value)}}class j0 extends re{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ga(this.value.arrayValue,t)}}class NN extends re{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ga(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Ga(this.value.arrayValue,t)}}class xN extends re{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Xa(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Ga(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bN{constructor(e,t=null,r=[],i=[],s=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=a,this.Pe=null}}function ep(n,e=null,t=[],r=[],i=null,s=null,o=null){return new bN(n,e,t,r,i,s,o)}function Vi(n){const e=H(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Zf(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),uh(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Us(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Us(r)).join(",")),e.Pe=t}return e.Pe}function dl(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!RN(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!F0(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Lv(n.startAt,e.startAt)&&Lv(n.endAt,e.endAt)}function Ic(n){return $.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Ec(n,e){return n.filters.filter(t=>t instanceof re&&t.field.isEqual(e))}function Mv(n,e,t){let r=Vu,i=!0;for(const s of Ec(n,e)){let o=Vu,a=!0;switch(s.op){case"<":case"<=":o=AN(s.value);break;case"==":case"in":case">=":o=s.value;break;case">":o=s.value,a=!1;break;case"!=":case"not-in":o=Vu}xv({value:r,inclusive:i},{value:o,inclusive:a})<0&&(r=o,i=a)}if(t!==null){for(let s=0;s<n.orderBy.length;++s)if(n.orderBy[s].field.isEqual(e)){const o=t.position[s];xv({value:r,inclusive:i},{value:o,inclusive:t.inclusive})<0&&(r=o,i=t.inclusive);break}}return{value:r,inclusive:i}}function Fv(n,e,t){let r=_r,i=!0;for(const s of Ec(n,e)){let o=_r,a=!0;switch(s.op){case">=":case">":o=PN(s.value),a=!1;break;case"==":case"in":case"<=":o=s.value;break;case"<":o=s.value,a=!1;break;case"!=":case"not-in":o=_r}bv({value:r,inclusive:i},{value:o,inclusive:a})>0&&(r=o,i=a)}if(t!==null){for(let s=0;s<n.orderBy.length;++s)if(n.orderBy[s].field.isEqual(e)){const o=t.position[s];bv({value:r,inclusive:i},{value:o,inclusive:t.inclusive})>0&&(r=o,i=t.inclusive);break}}return{value:r,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e,t=null,r=[],i=[],s=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=u,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function $0(n,e,t,r,i,s,o,a){return new oo(n,e,t,r,i,s,o,a)}function fl(n){return new oo(n)}function Uv(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function q0(n){return n.collectionGroup!==null}function ya(n){const e=H(n);if(e.Te===null){e.Te=[];const t=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new he(Te.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(c=>{c.isInequality()&&(a=a.add(c.field))})}),a})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.Te.push(new Ya(s,r))}),t.has(Te.keyField().canonicalString())||e.Te.push(new Ya(Te.keyField(),r))}return e.Te}function Lt(n){const e=H(n);return e.Ie||(e.Ie=ON(e,ya(n))),e.Ie}function ON(n,e){if(n.limitType==="F")return ep(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Ya(i.field,s)});const t=n.endAt?new Bs(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Bs(n.startAt.position,n.startAt.inclusive):null;return ep(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function tp(n,e){const t=n.filters.concat([e]);return new oo(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function wc(n,e,t){return new oo(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function mh(n,e){return dl(Lt(n),Lt(e))&&n.limitType===e.limitType}function W0(n){return`${Vi(Lt(n))}|lt:${n.limitType}`}function Yi(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(i=>B0(i)).join(", ")}]`),uh(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(i=>Us(i)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(i=>Us(i)).join(",")),`Target(${r})`}(Lt(n))}; limitType=${n.limitType})`}function pl(n,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):$.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(n,e)&&function(r,i){for(const s of ya(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(n,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(n,e)&&function(r,i){return!(r.startAt&&!function(o,a,u){const c=Ov(o,a,u);return o.inclusive?c<=0:c<0}(r.startAt,ya(r),i)||r.endAt&&!function(o,a,u){const c=Ov(o,a,u);return o.inclusive?c>=0:c>0}(r.endAt,ya(r),i))}(n,e)}function K0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function H0(n){return(e,t)=>{let r=!1;for(const i of ya(n)){const s=LN(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function LN(n,e,t){const r=n.field.isKeyField()?$.comparator(e.key,t.key):function(s,o,a){const u=o.data.field(s),c=a.data.field(s);return u!==null&&c!==null?Fr(u,c):K(42886)}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return K(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Kr(this.inner,(t,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return P0(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MN=new me($.comparator);function xt(){return MN}const G0=new me($.comparator);function Go(...n){let e=G0;for(const t of n)e=e.insert(t.key,t);return e}function Q0(n){let e=G0;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function fn(){return _a()}function X0(){return _a()}function _a(){return new Qn(n=>n.toString(),(n,e)=>n.isEqual(e))}const FN=new me($.comparator),UN=new he($.comparator);function Z(...n){let e=UN;for(const t of n)e=e.add(t);return e}const BN=new he(X);function Lm(){return BN}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mm(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:$a(e)?"-0":e}}function Y0(n){return{integerValue:""+n}}function J0(n,e){return m0(e)?Y0(e):Mm(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gh{constructor(){this._=void 0}}function zN(n,e,t){return n instanceof js?function(i,s){const o={fields:{[k0]:{stringValue:C0},[D0]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Nm(s)&&(s=fh(s)),s&&(o.fields[V0]=s),{mapValue:o}}(t,e):n instanceof $s?eS(n,e):n instanceof qs?tS(n,e):function(i,s){const o=Z0(i,s),a=Bv(o)+Bv(i.Ee);return Yf(o)&&Yf(i.Ee)?Y0(a):Mm(i.serializer,a)}(n,e)}function jN(n,e,t){return n instanceof $s?eS(n,e):n instanceof qs?tS(n,e):t}function Z0(n,e){return n instanceof Ws?function(r){return Yf(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class js extends gh{}class $s extends gh{constructor(e){super(),this.elements=e}}function eS(n,e){const t=nS(e);for(const r of n.elements)t.some(i=>In(i,r))||t.push(r);return{arrayValue:{values:t}}}class qs extends gh{constructor(e){super(),this.elements=e}}function tS(n,e){let t=nS(e);for(const r of n.elements)t=t.filter(i=>!In(i,r));return{arrayValue:{values:t}}}class Ws extends gh{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function Bv(n){return ve(n.integerValue||n.doubleValue)}function nS(n){return Xa(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(e,t){this.field=e,this.transform=t}}function $N(n,e){return n.field.isEqual(e.field)&&function(r,i){return r instanceof $s&&i instanceof $s||r instanceof qs&&i instanceof qs?Ns(r.elements,i.elements,In):r instanceof Ws&&i instanceof Ws?In(r.Ee,i.Ee):r instanceof js&&i instanceof js}(n.transform,e.transform)}class qN{constructor(e,t){this.version=e,this.transformResults=t}}class ct{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ct}static exists(e){return new ct(void 0,e)}static updateTime(e){return new ct(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function xu(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class yh{}function rS(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new _h(n.key,ct.none()):new ao(n.key,n.data,ct.none());{const t=n.data,r=ut.empty();let i=new he(Te.comparator);for(let s of e.fields)if(!i.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new Xn(n.key,r,new St(i.toArray()),ct.none())}}function WN(n,e,t){n instanceof ao?function(i,s,o){const a=i.value.clone(),u=jv(i.fieldTransforms,s,o.transformResults);a.setAll(u),s.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(n,e,t):n instanceof Xn?function(i,s,o){if(!xu(i.precondition,s))return void s.convertToUnknownDocument(o.version);const a=jv(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(iS(i)),u.setAll(a),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(n,e,t):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function va(n,e,t,r){return n instanceof ao?function(s,o,a,u){if(!xu(s.precondition,o))return a;const c=s.value.clone(),d=$v(s.fieldTransforms,u,o);return c.setAll(d),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null}(n,e,t,r):n instanceof Xn?function(s,o,a,u){if(!xu(s.precondition,o))return a;const c=$v(s.fieldTransforms,u,o),d=o.data;return d.setAll(iS(s)),d.setAll(c),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),a===null?null:a.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(p=>p.field))}(n,e,t,r):function(s,o,a){return xu(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(n,e,t)}function KN(n,e){let t=null;for(const r of n.fieldTransforms){const i=e.data.field(r.field),s=Z0(r.transform,i||null);s!=null&&(t===null&&(t=ut.empty()),t.set(r.field,s))}return t||null}function zv(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&Ns(r,i,(s,o)=>$N(s,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class ao extends yh{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Xn extends yh{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function iS(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function jv(n,e,t){const r=new Map;G(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let i=0;i<t.length;i++){const s=n[i],o=s.transform,a=e.data.field(s.field);r.set(s.field,jN(o,a,t[i]))}return r}function $v(n,e,t){const r=new Map;for(const i of n){const s=i.transform,o=t.data.field(i.field);r.set(i.field,zN(s,o,e))}return r}class _h extends yh{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class sS extends yh{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&WN(s,e,r[i])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=va(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=va(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=X0();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let a=this.applyToLocalView(o,s.mutatedFields);a=t.has(i.key)?null:a;const u=rS(o,a);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(Q.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Z())}isEqual(e){return this.batchId===e.batchId&&Ns(this.mutations,e.mutations,(t,r)=>zv(t,r))&&Ns(this.baseMutations,e.baseMutations,(t,r)=>zv(t,r))}}class Bm{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){G(e.mutations.length===r.length,58842,{Ve:e.mutations.length,me:r.length});let i=function(){return FN}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new Bm(e,t,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zm{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HN{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var be,ie;function GN(n){switch(n){case b.OK:return K(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return K(15467,{code:n})}}function oS(n){if(n===void 0)return Ne("GRPC error has no .code"),b.UNKNOWN;switch(n){case be.OK:return b.OK;case be.CANCELLED:return b.CANCELLED;case be.UNKNOWN:return b.UNKNOWN;case be.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case be.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case be.INTERNAL:return b.INTERNAL;case be.UNAVAILABLE:return b.UNAVAILABLE;case be.UNAUTHENTICATED:return b.UNAUTHENTICATED;case be.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case be.NOT_FOUND:return b.NOT_FOUND;case be.ALREADY_EXISTS:return b.ALREADY_EXISTS;case be.PERMISSION_DENIED:return b.PERMISSION_DENIED;case be.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case be.ABORTED:return b.ABORTED;case be.OUT_OF_RANGE:return b.OUT_OF_RANGE;case be.UNIMPLEMENTED:return b.UNIMPLEMENTED;case be.DATA_LOSS:return b.DATA_LOSS;default:return K(39323,{code:n})}}(ie=be||(be={}))[ie.OK=0]="OK",ie[ie.CANCELLED=1]="CANCELLED",ie[ie.UNKNOWN=2]="UNKNOWN",ie[ie.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ie[ie.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ie[ie.NOT_FOUND=5]="NOT_FOUND",ie[ie.ALREADY_EXISTS=6]="ALREADY_EXISTS",ie[ie.PERMISSION_DENIED=7]="PERMISSION_DENIED",ie[ie.UNAUTHENTICATED=16]="UNAUTHENTICATED",ie[ie.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ie[ie.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ie[ie.ABORTED=10]="ABORTED",ie[ie.OUT_OF_RANGE=11]="OUT_OF_RANGE",ie[ie.UNIMPLEMENTED=12]="UNIMPLEMENTED",ie[ie.INTERNAL=13]="INTERNAL",ie[ie.UNAVAILABLE=14]="UNAVAILABLE",ie[ie.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QN=new Dr([4294967295,4294967295],0);function qv(n){const e=o0().encode(n),t=new ZT;return t.update(e),new Uint8Array(t.digest())}function Wv(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Dr([t,r],0),new Dr([i,s],0)]}class jm{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Qo(`Invalid padding: ${t}`);if(r<0)throw new Qo(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Qo(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Qo(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Dr.fromNumber(this.fe)}pe(e,t,r){let i=e.add(t.multiply(Dr.fromNumber(r)));return i.compare(QN)===1&&(i=new Dr([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=qv(e),[r,i]=Wv(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(r,i,s);if(!this.ye(o))return!1}return!0}static create(e,t,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new jm(s,i,t);return r.forEach(a=>o.insert(a)),o}insert(e){if(this.fe===0)return;const t=qv(e),[r,i]=Wv(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(r,i,s);this.we(o)}}we(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Qo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e,t,r,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const i=new Map;return i.set(e,gl.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new ml(Q.min(),i,new me(X),xt(),Z())}}class gl{constructor(e,t,r,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new gl(r,t,Z(),Z(),Z())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu{constructor(e,t,r,i){this.Se=e,this.removedTargetIds=t,this.key=r,this.be=i}}class aS{constructor(e,t){this.targetId=e,this.De=t}}class lS{constructor(e,t,r=xe.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=i}}class Kv{constructor(){this.ve=0,this.Ce=Hv(),this.Fe=xe.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Z(),t=Z(),r=Z();return this.Ce.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:r=r.add(i);break;default:K(38017,{changeType:s})}}),new gl(this.Fe,this.Me,e,t,r)}ke(){this.xe=!1,this.Ce=Hv()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,G(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class XN{constructor(e){this.We=e,this.Ge=new Map,this.ze=xt(),this.je=iu(),this.Je=iu(),this.He=new me(X)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,t=>{const r=this.tt(t);switch(e.state){case 0:this.nt(t)&&r.Be(e.resumeToken);break;case 1:r.Ue(),r.Oe||r.ke(),r.Be(e.resumeToken);break;case 2:r.Ue(),r.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(r.Ke(),r.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),r.Be(e.resumeToken));break;default:K(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach((r,i)=>{this.nt(i)&&t(i)})}it(e){const t=e.targetId,r=e.De.count,i=this.st(t);if(i){const s=i.target;if(Ic(s))if(r===0){const o=new $(s.path);this.Xe(t,o,Ce.newNoDocument(o,Q.min()))}else G(r===1,20013,{expectedCount:r});else{const o=this.ot(t);if(o!==r){const a=this._t(e),u=a?this.ut(a,e,o):1;if(u!==0){this.rt(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,c)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=t;let o,a;try{o=qn(r).toUint8Array()}catch(u){if(u instanceof R0)return Lr("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new jm(o,i,s)}catch(u){return Lr(u instanceof Qo?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.fe===0?null:a}ut(e,t,r){return t.De.count===r-this.ht(e,t.targetId)?0:2}ht(e,t){const r=this.We.getRemoteKeysForTarget(t);let i=0;return r.forEach(s=>{const o=this.We.lt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(a)||(this.Xe(t,s,null),i++)}),i}Pt(e){const t=new Map;this.Ge.forEach((s,o)=>{const a=this.st(o);if(a){if(s.current&&Ic(a.target)){const u=new $(a.target.path);this.Tt(u).has(o)||this.It(o,u)||this.Xe(o,u,Ce.newNoDocument(u,e))}s.Ne&&(t.set(o,s.Le()),s.ke())}});let r=Z();this.Je.forEach((s,o)=>{let a=!0;o.forEachWhile(u=>{const c=this.st(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(r=r.add(s))}),this.ze.forEach((s,o)=>o.setReadTime(e));const i=new ml(e,t,this.He,this.ze,r);return this.ze=xt(),this.je=iu(),this.Je=iu(),this.He=new me(X),i}Ze(e,t){if(!this.nt(e))return;const r=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,r),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,r){if(!this.nt(e))return;const i=this.tt(e);this.It(e,t)?i.qe(t,1):i.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),r&&(this.ze=this.ze.insert(t,r))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new Kv,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new he(X),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new he(X),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||L("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new Kv),this.We.getRemoteKeysForTarget(e).forEach(t=>{this.Xe(e,t,null)})}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function iu(){return new me($.comparator)}function Hv(){return new me($.comparator)}const YN={asc:"ASCENDING",desc:"DESCENDING"},JN={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},ZN={and:"AND",or:"OR"};class ex{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function np(n,e){return n.useProto3Json||uh(e)?e:{value:e}}function Ks(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function uS(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function tx(n,e){return Ks(n,e.toTimestamp())}function _t(n){return G(!!n,49232),Q.fromTimestamp(function(t){const r=$n(t);return new le(r.seconds,r.nanos)}(n))}function $m(n,e){return rp(n,e).canonicalString()}function rp(n,e){const t=function(i){return new ae(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function cS(n){const e=ae.fromString(n);return G(vS(e),10190,{key:e.toString()}),e}function Tc(n,e){return $m(n.databaseId,e.path)}function yi(n,e){const t=cS(e);if(t.get(1)!==n.databaseId.projectId)throw new B(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new B(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new $(fS(t))}function hS(n,e){return $m(n.databaseId,e)}function dS(n){const e=cS(n);return e.length===4?ae.emptyPath():fS(e)}function ip(n){return new ae(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function fS(n){return G(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Gv(n,e,t){return{name:Tc(n,e),fields:t.value.mapValue.fields}}function nx(n,e,t){const r=yi(n,e.name),i=_t(e.updateTime),s=e.createTime?_t(e.createTime):Q.min(),o=new ut({mapValue:{fields:e.fields}}),a=Ce.newFoundDocument(r,i,s,o);return t&&a.setHasCommittedMutations(),t?a.setHasCommittedMutations():a}function rx(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:K(39313,{state:c})}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(c,d){return c.useProto3Json?(G(d===void 0||typeof d=="string",58123),xe.fromBase64String(d||"")):(G(d===void 0||d instanceof Buffer||d instanceof Uint8Array,16193),xe.fromUint8Array(d||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(c){const d=c.code===void 0?b.UNKNOWN:oS(c.code);return new B(d,c.message||"")}(o);t=new lS(r,i,s,a||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=yi(n,r.document.name),s=_t(r.document.updateTime),o=r.document.createTime?_t(r.document.createTime):Q.min(),a=new ut({mapValue:{fields:r.document.fields}}),u=Ce.newFoundDocument(i,s,o,a),c=r.targetIds||[],d=r.removedTargetIds||[];t=new bu(c,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=yi(n,r.document),s=r.readTime?_t(r.readTime):Q.min(),o=Ce.newNoDocument(i,s),a=r.removedTargetIds||[];t=new bu([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=yi(n,r.document),s=r.removedTargetIds||[];t=new bu([],s,i,null)}else{if(!("filter"in e))return K(11601,{At:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new HN(i,s),a=r.targetId;t=new aS(a,o)}}return t}function Sc(n,e){let t;if(e instanceof ao)t={update:Gv(n,e.key,e.value)};else if(e instanceof _h)t={delete:Tc(n,e.key)};else if(e instanceof Xn)t={update:Gv(n,e.key,e.data),updateMask:ux(e.fieldMask)};else{if(!(e instanceof sS))return K(16599,{Rt:e.type});t={verify:Tc(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const a=o.transform;if(a instanceof js)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof $s)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof qs)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Ws)return{fieldPath:o.field.canonicalString(),increment:a.Ee};throw K(20930,{transform:o.transform})}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:tx(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:K(27497)}(n,e.precondition)),t}function sp(n,e){const t=e.currentDocument?function(s){return s.updateTime!==void 0?ct.updateTime(_t(s.updateTime)):s.exists!==void 0?ct.exists(s.exists):ct.none()}(e.currentDocument):ct.none(),r=e.updateTransforms?e.updateTransforms.map(i=>function(o,a){let u=null;if("setToServerValue"in a)G(a.setToServerValue==="REQUEST_TIME",16630,{proto:a}),u=new js;else if("appendMissingElements"in a){const d=a.appendMissingElements.values||[];u=new $s(d)}else if("removeAllFromArray"in a){const d=a.removeAllFromArray.values||[];u=new qs(d)}else"increment"in a?u=new Ws(o,a.increment):K(16584,{proto:a});const c=Te.fromServerFormat(a.fieldPath);return new Fm(c,u)}(n,i)):[];if(e.update){e.update.name;const i=yi(n,e.update.name),s=new ut({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(u){const c=u.fieldPaths||[];return new St(c.map(d=>Te.fromServerFormat(d)))}(e.updateMask);return new Xn(i,s,o,t,r)}return new ao(i,s,t,r)}if(e.delete){const i=yi(n,e.delete);return new _h(i,t)}if(e.verify){const i=yi(n,e.verify);return new sS(i,t)}return K(1463,{proto:e})}function ix(n,e){return n&&n.length>0?(G(e!==void 0,14353),n.map(t=>function(i,s){let o=i.updateTime?_t(i.updateTime):_t(s);return o.isEqual(Q.min())&&(o=_t(s)),new qN(o,i.transformResults||[])}(t,e))):[]}function pS(n,e){return{documents:[hS(n,e.path)]}}function mS(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=hS(n,i);const s=function(c){if(c.length!==0)return _S(ue.create(c,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const o=function(c){if(c.length!==0)return c.map(d=>function(m){return{field:Ji(m.field),direction:ox(m.dir)}}(d))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=np(n,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{Vt:t,parent:i}}function gS(n){let e=dS(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let i=null;if(r>0){G(r===1,65062);const d=t.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let s=[];t.where&&(s=function(p){const m=yS(p);return m instanceof ue&&Om(m)?m.getFilters():[m]}(t.where));let o=[];t.orderBy&&(o=function(p){return p.map(m=>function(R){return new Ya(Zi(R.field),function(O){switch(O){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(R.direction))}(m))}(t.orderBy));let a=null;t.limit&&(a=function(p){let m;return m=typeof p=="object"?p.value:p,uh(m)?null:m}(t.limit));let u=null;t.startAt&&(u=function(p){const m=!!p.before,E=p.values||[];return new Bs(E,m)}(t.startAt));let c=null;return t.endAt&&(c=function(p){const m=!p.before,E=p.values||[];return new Bs(E,m)}(t.endAt)),$0(e,i,o,s,a,"F",u,c)}function sx(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return K(28987,{purpose:i})}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function yS(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Zi(t.unaryFilter.field);return re.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Zi(t.unaryFilter.field);return re.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Zi(t.unaryFilter.field);return re.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Zi(t.unaryFilter.field);return re.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return K(61313);default:return K(60726)}}(n):n.fieldFilter!==void 0?function(t){return re.create(Zi(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return K(58110);default:return K(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return ue.create(t.compositeFilter.filters.map(r=>yS(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return K(1026)}}(t.compositeFilter.op))}(n):K(30097,{filter:n})}function ox(n){return YN[n]}function ax(n){return JN[n]}function lx(n){return ZN[n]}function Ji(n){return{fieldPath:n.canonicalString()}}function Zi(n){return Te.fromServerFormat(n.fieldPath)}function _S(n){return n instanceof re?function(t){if(t.op==="=="){if(Nv(t.value))return{unaryFilter:{field:Ji(t.field),op:"IS_NAN"}};if(Dv(t.value))return{unaryFilter:{field:Ji(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Nv(t.value))return{unaryFilter:{field:Ji(t.field),op:"IS_NOT_NAN"}};if(Dv(t.value))return{unaryFilter:{field:Ji(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ji(t.field),op:ax(t.op),value:t.value}}}(n):n instanceof ue?function(t){const r=t.getFilters().map(i=>_S(i));return r.length===1?r[0]:{compositeFilter:{op:lx(t.op),filters:r}}}(n):K(54877,{filter:n})}function ux(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function vS(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e,t,r,i,s=Q.min(),o=Q.min(),a=xe.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new bn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new bn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new bn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new bn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IS{constructor(e){this.gt=e}}function cx(n,e){let t;if(e.document)t=nx(n.gt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const r=$.fromSegments(e.noDocument.path),i=Ni(e.noDocument.readTime);t=Ce.newNoDocument(r,i),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return K(56709);{const r=$.fromSegments(e.unknownDocument.path),i=Ni(e.unknownDocument.version);t=Ce.newUnknownDocument(r,i)}}return e.readTime&&t.setReadTime(function(i){const s=new le(i[0],i[1]);return Q.fromTimestamp(s)}(e.readTime)),t}function Qv(n,e){const t=e.key,r={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Ac(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())r.document=function(s,o){return{name:Tc(s,o.key),fields:o.data.value.mapValue.fields,updateTime:Ks(s,o.version.toTimestamp()),createTime:Ks(s,o.createTime.toTimestamp())}}(n.gt,e);else if(e.isNoDocument())r.noDocument={path:t.path.toArray(),readTime:Di(e.version)};else{if(!e.isUnknownDocument())return K(57904,{document:e});r.unknownDocument={path:t.path.toArray(),version:Di(e.version)}}return r}function Ac(n){const e=n.toTimestamp();return[e.seconds,e.nanoseconds]}function Di(n){const e=n.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Ni(n){const e=new le(n.seconds,n.nanoseconds);return Q.fromTimestamp(e)}function oi(n,e){const t=(e.baseMutations||[]).map(s=>sp(n.gt,s));for(let s=0;s<e.mutations.length-1;++s){const o=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){const a=e.mutations[s+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const r=e.mutations.map(s=>sp(n.gt,s)),i=le.fromMillis(e.localWriteTimeMs);return new Um(e.batchId,i,t,r)}function Xo(n){const e=Ni(n.readTime),t=n.lastLimboFreeSnapshotVersion!==void 0?Ni(n.lastLimboFreeSnapshotVersion):Q.min();let r;return r=function(s){return s.documents!==void 0}(n.query)?function(s){const o=s.documents.length;return G(o===1,1966,{count:o}),Lt(fl(dS(s.documents[0])))}(n.query):function(s){return Lt(gS(s))}(n.query),new bn(r,n.targetId,"TargetPurposeListen",n.lastListenSequenceNumber,e,t,xe.fromBase64String(n.resumeToken))}function ES(n,e){const t=Di(e.snapshotVersion),r=Di(e.lastLimboFreeSnapshotVersion);let i;i=Ic(e.target)?pS(n.gt,e.target):mS(n.gt,e.target).Vt;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Vi(e.target),readTime:t,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function wS(n){const e=gS({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?wc(e,e.limit,"L"):e}function Od(n,e){return new zm(e.largestBatchId,sp(n.gt,e.overlayMutation))}function Xv(n,e){const t=e.path.lastSegment();return[n,ht(e.path.popLast()),t]}function Yv(n,e,t,r){return{indexId:n,uid:e,sequenceNumber:t,readTime:Di(r.readTime),documentKey:ht(r.documentKey.path),largestBatchId:r.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hx{getBundleMetadata(e,t){return Jv(e).get(t).next(r=>{if(r)return function(s){return{id:s.bundleId,createTime:Ni(s.createTime),version:s.version}}(r)})}saveBundleMetadata(e,t){return Jv(e).put(function(i){return{bundleId:i.id,createTime:Di(_t(i.createTime)),version:i.version}}(t))}getNamedQuery(e,t){return Zv(e).get(t).next(r=>{if(r)return function(s){return{name:s.name,query:wS(s.bundledQuery),readTime:Ni(s.readTime)}}(r)})}saveNamedQuery(e,t){return Zv(e).put(function(i){return{name:i.name,readTime:Di(_t(i.readTime)),bundledQuery:i.bundledQuery}}(t))}}function Jv(n){return qe(n,ch)}function Zv(n){return qe(n,hh)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vh{constructor(e,t){this.serializer=e,this.userId=t}static yt(e,t){const r=t.uid||"";return new vh(e,r)}getOverlay(e,t){return Oo(e).get(Xv(this.userId,t)).next(r=>r?Od(this.serializer,r):null)}getOverlays(e,t){const r=fn();return C.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){const i=[];return r.forEach((s,o)=>{const a=new zm(t,o);i.push(this.wt(e,a))}),C.waitFor(i)}removeOverlaysForBatchId(e,t,r){const i=new Set;t.forEach(o=>i.add(ht(o.getCollectionPath())));const s=[];return i.forEach(o=>{const a=IDBKeyRange.bound([this.userId,o,r],[this.userId,o,r+1],!1,!0);s.push(Oo(e).Y(Gf,a))}),C.waitFor(s)}getOverlaysForCollection(e,t,r){const i=fn(),s=ht(t),o=IDBKeyRange.bound([this.userId,s,r],[this.userId,s,Number.POSITIVE_INFINITY],!0);return Oo(e).j(Gf,o).next(a=>{for(const u of a){const c=Od(this.serializer,u);i.set(c.getKey(),c)}return i})}getOverlaysForCollectionGroup(e,t,r,i){const s=fn();let o;const a=IDBKeyRange.bound([this.userId,t,r],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Oo(e).X({index:E0,range:a},(u,c,d)=>{const p=Od(this.serializer,c);s.size()<i||p.largestBatchId===o?(s.set(p.getKey(),p),o=p.largestBatchId):d.done()}).next(()=>s)}wt(e,t){return Oo(e).put(function(i,s,o){const[a,u,c]=Xv(s,o.mutation.key);return{userId:s,collectionPath:u,documentId:c,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Sc(i.gt,o.mutation)}}(this.serializer,this.userId,t))}}function Oo(n){return qe(n,dh)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dx{St(e){return qe(e,Vm)}getSessionToken(e){return this.St(e).get("sessionToken").next(t=>{const r=t==null?void 0:t.value;return r?xe.fromUint8Array(r):xe.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.St(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ai{constructor(){}bt(e,t){this.Dt(e,t),t.vt()}Dt(e,t){if("nullValue"in e)this.Ct(t,5);else if("booleanValue"in e)this.Ct(t,10),t.Ft(e.booleanValue?1:0);else if("integerValue"in e)this.Ct(t,15),t.Ft(ve(e.integerValue));else if("doubleValue"in e){const r=ve(e.doubleValue);isNaN(r)?this.Ct(t,13):(this.Ct(t,15),$a(r)?t.Ft(0):t.Ft(r))}else if("timestampValue"in e){let r=e.timestampValue;this.Ct(t,20),typeof r=="string"&&(r=$n(r)),t.Mt(`${r.seconds||""}`),t.Ft(r.nanos||0)}else if("stringValue"in e)this.xt(e.stringValue,t),this.Ot(t);else if("bytesValue"in e)this.Ct(t,30),t.Nt(qn(e.bytesValue)),this.Ot(t);else if("referenceValue"in e)this.Bt(e.referenceValue,t);else if("geoPointValue"in e){const r=e.geoPointValue;this.Ct(t,45),t.Ft(r.latitude||0),t.Ft(r.longitude||0)}else"mapValue"in e?x0(e)?this.Ct(t,Number.MAX_SAFE_INTEGER):ph(e)?this.Lt(e.mapValue,t):(this.kt(e.mapValue,t),this.Ot(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Ot(t)):K(19022,{Qt:e})}xt(e,t){this.Ct(t,25),this.$t(e,t)}$t(e,t){t.Mt(e)}kt(e,t){const r=e.fields||{};this.Ct(t,55);for(const i of Object.keys(r))this.xt(i,t),this.Dt(r[i],t)}Lt(e,t){var r,i;const s=e.fields||{};this.Ct(t,53);const o=Fs,a=((i=(r=s[o].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.length)||0;this.Ct(t,15),t.Ft(ve(a)),this.xt(o,t),this.Dt(s[o],t)}qt(e,t){const r=e.values||[];this.Ct(t,50);for(const i of r)this.Dt(i,t)}Bt(e,t){this.Ct(t,37),$.fromName(e).path.forEach(r=>{this.Ct(t,60),this.$t(r,t)})}Ct(e,t){e.Ft(t)}Ot(e){e.Ft(2)}}ai.Ut=new ai;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ki=255;function fx(n){if(n===0)return 8;let e=0;return n>>4||(e+=4,n<<=4),n>>6||(e+=2,n<<=2),n>>7||(e+=1),e}function eI(n){const e=64-function(r){let i=0;for(let s=0;s<8;++s){const o=fx(255&r[s]);if(i+=o,o!==8)break}return i}(n);return Math.ceil(e/8)}class px{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Kt(e){const t=e[Symbol.iterator]();let r=t.next();for(;!r.done;)this.Wt(r.value),r=t.next();this.Gt()}zt(e){const t=e[Symbol.iterator]();let r=t.next();for(;!r.done;)this.jt(r.value),r=t.next();this.Jt()}Ht(e){for(const t of e){const r=t.charCodeAt(0);if(r<128)this.Wt(r);else if(r<2048)this.Wt(960|r>>>6),this.Wt(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.Wt(480|r>>>12),this.Wt(128|63&r>>>6),this.Wt(128|63&r);else{const i=t.codePointAt(0);this.Wt(240|i>>>18),this.Wt(128|63&i>>>12),this.Wt(128|63&i>>>6),this.Wt(128|63&i)}}this.Gt()}Yt(e){for(const t of e){const r=t.charCodeAt(0);if(r<128)this.jt(r);else if(r<2048)this.jt(960|r>>>6),this.jt(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.jt(480|r>>>12),this.jt(128|63&r>>>6),this.jt(128|63&r);else{const i=t.codePointAt(0);this.jt(240|i>>>18),this.jt(128|63&i>>>12),this.jt(128|63&i>>>6),this.jt(128|63&i)}}this.Jt()}Zt(e){const t=this.Xt(e),r=eI(t);this.en(1+r),this.buffer[this.position++]=255&r;for(let i=t.length-r;i<t.length;++i)this.buffer[this.position++]=255&t[i]}tn(e){const t=this.Xt(e),r=eI(t);this.en(1+r),this.buffer[this.position++]=~(255&r);for(let i=t.length-r;i<t.length;++i)this.buffer[this.position++]=~(255&t[i])}nn(){this.rn(Ki),this.rn(255)}sn(){this._n(Ki),this._n(255)}reset(){this.position=0}seed(e){this.en(e.length),this.buffer.set(e,this.position),this.position+=e.length}an(){return this.buffer.slice(0,this.position)}Xt(e){const t=function(s){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,s,!1),new Uint8Array(o.buffer)}(e),r=!!(128&t[0]);t[0]^=r?255:128;for(let i=1;i<t.length;++i)t[i]^=r?255:0;return t}Wt(e){const t=255&e;t===0?(this.rn(0),this.rn(255)):t===Ki?(this.rn(Ki),this.rn(0)):this.rn(t)}jt(e){const t=255&e;t===0?(this._n(0),this._n(255)):t===Ki?(this._n(Ki),this._n(0)):this._n(e)}Gt(){this.rn(0),this.rn(1)}Jt(){this._n(0),this._n(1)}rn(e){this.en(1),this.buffer[this.position++]=e}_n(e){this.en(1),this.buffer[this.position++]=~e}en(e){const t=e+this.position;if(t<=this.buffer.length)return;let r=2*this.buffer.length;r<t&&(r=t);const i=new Uint8Array(r);i.set(this.buffer),this.buffer=i}}class mx{constructor(e){this.un=e}Nt(e){this.un.Kt(e)}Mt(e){this.un.Ht(e)}Ft(e){this.un.Zt(e)}vt(){this.un.nn()}}class gx{constructor(e){this.un=e}Nt(e){this.un.zt(e)}Mt(e){this.un.Yt(e)}Ft(e){this.un.tn(e)}vt(){this.un.sn()}}class Lo{constructor(){this.un=new px,this.cn=new mx(this.un),this.ln=new gx(this.un)}seed(e){this.un.seed(e)}hn(e){return e===0?this.cn:this.ln}an(){return this.un.an()}reset(){this.un.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e,t,r,i){this.Pn=e,this.Tn=t,this.In=r,this.dn=i}En(){const e=this.dn.length,t=e===0||this.dn[e-1]===255?e+1:e,r=new Uint8Array(t);return r.set(this.dn,0),t!==e?r.set([0],this.dn.length):++r[r.length-1],new li(this.Pn,this.Tn,this.In,r)}An(e,t,r){return{indexId:this.Pn,uid:e,arrayValue:Ou(this.In),directionalValue:Ou(this.dn),orderedDocumentKey:Ou(t),documentKey:r.path.toArray()}}Rn(e,t,r){const i=this.An(e,t,r);return[i.indexId,i.uid,i.arrayValue,i.directionalValue,i.orderedDocumentKey,i.documentKey]}}function rr(n,e){let t=n.Pn-e.Pn;return t!==0?t:(t=tI(n.In,e.In),t!==0?t:(t=tI(n.dn,e.dn),t!==0?t:$.comparator(n.Tn,e.Tn)))}function tI(n,e){for(let t=0;t<n.length&&t<e.length;++t){const r=n[t]-e[t];if(r!==0)return r}return n.length-e.length}function Ou(n){return iT()?function(t){let r="";for(let i=0;i<t.length;i++)r+=String.fromCharCode(t[i]);return r}(n):n}function nI(n){return typeof n!="string"?n:function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(n)}class rI{constructor(e){this.Vn=new he((t,r)=>Te.comparator(t.field,r.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.mn=e.orderBy,this.fn=[];for(const t of e.filters){const r=t;r.isInequality()?this.Vn=this.Vn.add(r):this.fn.push(r)}}get gn(){return this.Vn.size>1}pn(e){if(G(e.collectionGroup===this.collectionId,49279),this.gn)return!1;const t=Wf(e);if(t!==void 0&&!this.yn(t))return!1;const r=ri(e);let i=new Set,s=0,o=0;for(;s<r.length&&this.yn(r[s]);++s)i=i.add(r[s].fieldPath.canonicalString());if(s===r.length)return!0;if(this.Vn.size>0){const a=this.Vn.getIterator().getNext();if(!i.has(a.field.canonicalString())){const u=r[s];if(!this.wn(a,u)||!this.Sn(this.mn[o++],u))return!1}++s}for(;s<r.length;++s){const a=r[s];if(o>=this.mn.length||!this.Sn(this.mn[o++],a))return!1}return!0}bn(){if(this.gn)return null;let e=new he(Te.comparator);const t=[];for(const r of this.fn)if(!r.field.isKeyField())if(r.op==="array-contains"||r.op==="array-contains-any")t.push(new Ru(r.field,2));else{if(e.has(r.field))continue;e=e.add(r.field),t.push(new Ru(r.field,0))}for(const r of this.mn)r.field.isKeyField()||e.has(r.field)||(e=e.add(r.field),t.push(new Ru(r.field,r.dir==="asc"?0:1)));return new mc(mc.UNKNOWN_ID,this.collectionId,t,ja.empty())}yn(e){for(const t of this.fn)if(this.wn(t,e))return!0;return!1}wn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const r=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===r}Sn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TS(n){var e,t;if(G(n instanceof re||n instanceof ue,20012),n instanceof re){if(n instanceof j0){const i=((t=(e=n.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map(s=>re.create(n.field,"==",s)))||[];return ue.create(i,"or")}return n}const r=n.filters.map(i=>TS(i));return ue.create(r,n.op)}function yx(n){if(n.getFilters().length===0)return[];const e=lp(TS(n));return G(SS(e),7391),op(e)||ap(e)?[e]:e.getFilters()}function op(n){return n instanceof re}function ap(n){return n instanceof ue&&Om(n)}function SS(n){return op(n)||ap(n)||function(t){if(t instanceof ue&&Jf(t)){for(const r of t.getFilters())if(!op(r)&&!ap(r))return!1;return!0}return!1}(n)}function lp(n){if(G(n instanceof re||n instanceof ue,34018),n instanceof re)return n;if(n.filters.length===1)return lp(n.filters[0]);const e=n.filters.map(r=>lp(r));let t=ue.create(e,n.op);return t=Pc(t),SS(t)?t:(G(t instanceof ue,64498),G(zs(t),40251),G(t.filters.length>1,57927),t.filters.reduce((r,i)=>qm(r,i)))}function qm(n,e){let t;return G(n instanceof re||n instanceof ue,38388),G(e instanceof re||e instanceof ue,25473),t=n instanceof re?e instanceof re?function(i,s){return ue.create([i,s],"and")}(n,e):iI(n,e):e instanceof re?iI(e,n):function(i,s){if(G(i.filters.length>0&&s.filters.length>0,48005),zs(i)&&zs(s))return U0(i,s.getFilters());const o=Jf(i)?i:s,a=Jf(i)?s:i,u=o.filters.map(c=>qm(c,a));return ue.create(u,"or")}(n,e),Pc(t)}function iI(n,e){if(zs(e))return U0(e,n.getFilters());{const t=e.filters.map(r=>qm(n,r));return ue.create(t,"or")}}function Pc(n){if(G(n instanceof re||n instanceof ue,11850),n instanceof re)return n;const e=n.getFilters();if(e.length===1)return Pc(e[0]);if(M0(n))return n;const t=e.map(i=>Pc(i)),r=[];return t.forEach(i=>{i instanceof re?r.push(i):i instanceof ue&&(i.op===n.op?r.push(...i.filters):r.push(i))}),r.length===1?r[0]:ue.create(r,n.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _x{constructor(){this.Dn=new Wm}addToCollectionParentIndex(e,t){return this.Dn.add(t),C.resolve()}getCollectionParents(e,t){return C.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return C.resolve()}deleteFieldIndex(e,t){return C.resolve()}deleteAllFieldIndexes(e){return C.resolve()}createTargetIndexes(e,t){return C.resolve()}getDocumentsMatchingTarget(e,t){return C.resolve(null)}getIndexType(e,t){return C.resolve(0)}getFieldIndexes(e,t){return C.resolve([])}getNextCollectionGroupToUpdate(e){return C.resolve(null)}getMinOffset(e,t){return C.resolve(Ft.min())}getMinOffsetFromCollectionGroup(e,t){return C.resolve(Ft.min())}updateCollectionGroup(e,t,r){return C.resolve()}updateIndexEntries(e,t){return C.resolve()}}class Wm{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new he(ae.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new he(ae.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sI="IndexedDbIndexManager",su=new Uint8Array(0);class vx{constructor(e,t){this.databaseId=t,this.vn=new Wm,this.Cn=new Qn(r=>Vi(r),(r,i)=>dl(r,i)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){const r=t.lastSegment(),i=t.popLast();e.addOnCommittedListener(()=>{this.vn.add(t)});const s={collectionId:r,parent:ht(i)};return oI(e).put(s)}return C.resolve()}getCollectionParents(e,t){const r=[],i=IDBKeyRange.bound([t,""],[a0(t),""],!1,!0);return oI(e).j(i).next(s=>{for(const o of s){if(o.collectionId!==t)break;r.push(dn(o.parent))}return r})}addFieldIndex(e,t){const r=Mo(e),i=function(a){return{indexId:a.indexId,collectionGroup:a.collectionGroup,fields:a.fields.map(u=>[u.fieldPath.canonicalString(),u.kind])}}(t);delete i.indexId;const s=r.add(i);if(t.indexState){const o=Gi(e);return s.next(a=>{o.put(Yv(a,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const r=Mo(e),i=Gi(e),s=Hi(e);return r.delete(t.indexId).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=Mo(e),r=Hi(e),i=Gi(e);return t.Y().next(()=>r.Y()).next(()=>i.Y())}createTargetIndexes(e,t){return C.forEach(this.Fn(t),r=>this.getIndexType(e,r).next(i=>{if(i===0||i===1){const s=new rI(r).bn();if(s!=null)return this.addFieldIndex(e,s)}}))}getDocumentsMatchingTarget(e,t){const r=Hi(e);let i=!0;const s=new Map;return C.forEach(this.Fn(t),o=>this.Mn(e,o).next(a=>{i&&(i=!!a),s.set(o,a)})).next(()=>{if(i){let o=Z();const a=[];return C.forEach(s,(u,c)=>{L(sI,`Using index ${function(w){return`id=${w.indexId}|cg=${w.collectionGroup}|f=${w.fields.map(x=>`${x.fieldPath}:${x.kind}`).join(",")}`}(u)} to execute ${Vi(t)}`);const d=function(w,x){const F=Wf(x);if(F===void 0)return null;for(const M of Ec(w,F.fieldPath))switch(M.op){case"array-contains-any":return M.value.arrayValue.values||[];case"array-contains":return[M.value]}return null}(c,u),p=function(w,x){const F=new Map;for(const M of ri(x))for(const v of Ec(w,M.fieldPath))switch(v.op){case"==":case"in":F.set(M.fieldPath.canonicalString(),v.value);break;case"not-in":case"!=":return F.set(M.fieldPath.canonicalString(),v.value),Array.from(F.values())}return null}(c,u),m=function(w,x){const F=[];let M=!0;for(const v of ri(x)){const y=v.kind===0?Mv(w,v.fieldPath,w.startAt):Fv(w,v.fieldPath,w.startAt);F.push(y.value),M&&(M=y.inclusive)}return new Bs(F,M)}(c,u),E=function(w,x){const F=[];let M=!0;for(const v of ri(x)){const y=v.kind===0?Fv(w,v.fieldPath,w.endAt):Mv(w,v.fieldPath,w.endAt);F.push(y.value),M&&(M=y.inclusive)}return new Bs(F,M)}(c,u),R=this.xn(u,c,m),D=this.xn(u,c,E),O=this.On(u,c,p),A=this.Nn(u.indexId,d,R,m.inclusive,D,E.inclusive,O);return C.forEach(A,_=>r.H(_,t.limit).next(w=>{w.forEach(x=>{const F=$.fromSegments(x.documentKey);o.has(F)||(o=o.add(F),a.push(F))})}))}).next(()=>a)}return C.resolve(null)})}Fn(e){let t=this.Cn.get(e);return t||(e.filters.length===0?t=[e]:t=yx(ue.create(e.filters,"and")).map(r=>ep(e.path,e.collectionGroup,e.orderBy,r.getFilters(),e.limit,e.startAt,e.endAt)),this.Cn.set(e,t),t)}Nn(e,t,r,i,s,o,a){const u=(t!=null?t.length:1)*Math.max(r.length,s.length),c=u/(t!=null?t.length:1),d=[];for(let p=0;p<u;++p){const m=t?this.Bn(t[p/c]):su,E=this.Ln(e,m,r[p%c],i),R=this.kn(e,m,s[p%c],o),D=a.map(O=>this.Ln(e,m,O,!0));d.push(...this.createRange(E,R,D))}return d}Ln(e,t,r,i){const s=new li(e,$.empty(),t,r);return i?s:s.En()}kn(e,t,r,i){const s=new li(e,$.empty(),t,r);return i?s.En():s}Mn(e,t){const r=new rI(t),i=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,i).next(s=>{let o=null;for(const a of s)r.pn(a)&&(!o||a.fields.length>o.fields.length)&&(o=a);return o})}getIndexType(e,t){let r=2;const i=this.Fn(t);return C.forEach(i,s=>this.Mn(e,s).next(o=>{o?r!==0&&o.fields.length<function(u){let c=new he(Te.comparator),d=!1;for(const p of u.filters)for(const m of p.getFlattenedFilters())m.field.isKeyField()||(m.op==="array-contains"||m.op==="array-contains-any"?d=!0:c=c.add(m.field));for(const p of u.orderBy)p.field.isKeyField()||(c=c.add(p.field));return c.size+(d?1:0)}(s)&&(r=1):r=0})).next(()=>function(o){return o.limit!==null}(t)&&i.length>1&&r===2?1:r)}qn(e,t){const r=new Lo;for(const i of ri(e)){const s=t.data.field(i.fieldPath);if(s==null)return null;const o=r.hn(i.kind);ai.Ut.bt(s,o)}return r.an()}Bn(e){const t=new Lo;return ai.Ut.bt(e,t.hn(0)),t.an()}Qn(e,t){const r=new Lo;return ai.Ut.bt(Qa(this.databaseId,t),r.hn(function(s){const o=ri(s);return o.length===0?0:o[o.length-1].kind}(e))),r.an()}On(e,t,r){if(r===null)return[];let i=[];i.push(new Lo);let s=0;for(const o of ri(e)){const a=r[s++];for(const u of i)if(this.$n(t,o.fieldPath)&&Xa(a))i=this.Un(i,o,a);else{const c=u.hn(o.kind);ai.Ut.bt(a,c)}}return this.Kn(i)}xn(e,t,r){return this.On(e,t,r.position)}Kn(e){const t=[];for(let r=0;r<e.length;++r)t[r]=e[r].an();return t}Un(e,t,r){const i=[...e],s=[];for(const o of r.arrayValue.values||[])for(const a of i){const u=new Lo;u.seed(a.an()),ai.Ut.bt(o,u.hn(t.kind)),s.push(u)}return s}$n(e,t){return!!e.filters.find(r=>r instanceof re&&r.field.isEqual(t)&&(r.op==="in"||r.op==="not-in"))}getFieldIndexes(e,t){const r=Mo(e),i=Gi(e);return(t?r.j(Hf,IDBKeyRange.bound(t,t)):r.j()).next(s=>{const o=[];return C.forEach(s,a=>i.get([a.indexId,this.uid]).next(u=>{o.push(function(d,p){const m=p?new ja(p.sequenceNumber,new Ft(Ni(p.readTime),new $(dn(p.documentKey)),p.largestBatchId)):ja.empty(),E=d.fields.map(([R,D])=>new Ru(Te.fromServerFormat(R),D));return new mc(d.indexId,d.collectionGroup,E,m)}(a,u))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((r,i)=>{const s=r.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:X(r.collectionGroup,i.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,r){const i=Mo(e),s=Gi(e);return this.Wn(e).next(o=>i.j(Hf,IDBKeyRange.bound(t,t)).next(a=>C.forEach(a,u=>s.put(Yv(u.indexId,this.uid,o,r)))))}updateIndexEntries(e,t){const r=new Map;return C.forEach(t,(i,s)=>{const o=r.get(i.collectionGroup);return(o?C.resolve(o):this.getFieldIndexes(e,i.collectionGroup)).next(a=>(r.set(i.collectionGroup,a),C.forEach(a,u=>this.Gn(e,i,u).next(c=>{const d=this.zn(s,u);return c.isEqual(d)?C.resolve():this.jn(e,s,u,c,d)}))))})}Jn(e,t,r,i){return Hi(e).put(i.An(this.uid,this.Qn(r,t.key),t.key))}Hn(e,t,r,i){return Hi(e).delete(i.Rn(this.uid,this.Qn(r,t.key),t.key))}Gn(e,t,r){const i=Hi(e);let s=new he(rr);return i.X({index:I0,range:IDBKeyRange.only([r.indexId,this.uid,Ou(this.Qn(r,t))])},(o,a)=>{s=s.add(new li(r.indexId,t,nI(a.arrayValue),nI(a.directionalValue)))}).next(()=>s)}zn(e,t){let r=new he(rr);const i=this.qn(t,e);if(i==null)return r;const s=Wf(t);if(s!=null){const o=e.data.field(s.fieldPath);if(Xa(o))for(const a of o.arrayValue.values||[])r=r.add(new li(t.indexId,e.key,this.Bn(a),i))}else r=r.add(new li(t.indexId,e.key,su,i));return r}jn(e,t,r,i,s){L(sI,"Updating index entries for document '%s'",t.key);const o=[];return function(u,c,d,p,m){const E=u.getIterator(),R=c.getIterator();let D=Wi(E),O=Wi(R);for(;D||O;){let A=!1,_=!1;if(D&&O){const w=d(D,O);w<0?_=!0:w>0&&(A=!0)}else D!=null?_=!0:A=!0;A?(p(O),O=Wi(R)):_?(m(D),D=Wi(E)):(D=Wi(E),O=Wi(R))}}(i,s,rr,a=>{o.push(this.Jn(e,t,r,a))},a=>{o.push(this.Hn(e,t,r,a))}),C.waitFor(o)}Wn(e){let t=1;return Gi(e).X({index:v0,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(r,i,s)=>{s.done(),t=i.sequenceNumber+1}).next(()=>t)}createRange(e,t,r){r=r.sort((o,a)=>rr(o,a)).filter((o,a,u)=>!a||rr(o,u[a-1])!==0);const i=[];i.push(e);for(const o of r){const a=rr(o,e),u=rr(o,t);if(a===0)i[0]=e.En();else if(a>0&&u<0)i.push(o),i.push(o.En());else if(u>0)break}i.push(t);const s=[];for(let o=0;o<i.length;o+=2){if(this.Yn(i[o],i[o+1]))return[];const a=i[o].Rn(this.uid,su,$.empty()),u=i[o+1].Rn(this.uid,su,$.empty());s.push(IDBKeyRange.bound(a,u))}return s}Yn(e,t){return rr(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(aI)}getMinOffset(e,t){return C.mapArray(this.Fn(t),r=>this.Mn(e,r).next(i=>i||K(44426))).next(aI)}}function oI(n){return qe(n,Ka)}function Hi(n){return qe(n,ma)}function Mo(n){return qe(n,km)}function Gi(n){return qe(n,pa)}function aI(n){G(n.length!==0,28825);let e=n[0].indexState.offset,t=e.largestBatchId;for(let r=1;r<n.length;r++){const i=n[r].indexState.offset;Pm(i,e)<0&&(e=i),t<i.largestBatchId&&(t=i.largestBatchId)}return new Ft(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lI={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},AS=41943040;class at{static withCacheSize(e){return new at(e,at.DEFAULT_COLLECTION_PERCENTILE,at.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PS(n,e,t){const r=n.store(en),i=n.store(bs),s=[],o=IDBKeyRange.only(t.batchId);let a=0;const u=r.X({range:o},(d,p,m)=>(a++,m.delete()));s.push(u.next(()=>{G(a===1,47070,{batchId:t.batchId})}));const c=[];for(const d of t.mutations){const p=g0(e,d.key.path,t.batchId);s.push(i.delete(p)),c.push(d.key)}return C.waitFor(s).next(()=>c)}function Rc(n){if(!n)return 0;let e;if(n.document)e=n.document;else if(n.unknownDocument)e=n.unknownDocument;else{if(!n.noDocument)throw K(14731);e=n.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */at.DEFAULT_COLLECTION_PERCENTILE=10,at.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,at.DEFAULT=new at(AS,at.DEFAULT_COLLECTION_PERCENTILE,at.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),at.DISABLED=new at(-1,0,0);class Ih{constructor(e,t,r,i){this.userId=e,this.serializer=t,this.indexManager=r,this.referenceDelegate=i,this.Zn={}}static yt(e,t,r,i){G(e.uid!=="",64387);const s=e.isAuthenticated()?e.uid:"";return new Ih(s,t,r,i)}checkEmpty(e){let t=!0;const r=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return ir(e).X({index:di,range:r},(i,s,o)=>{t=!1,o.done()}).next(()=>t)}addMutationBatch(e,t,r,i){const s=es(e),o=ir(e);return o.add({}).next(a=>{G(typeof a=="number",49019);const u=new Um(a,t,r,i),c=function(E,R,D){const O=D.baseMutations.map(_=>Sc(E.gt,_)),A=D.mutations.map(_=>Sc(E.gt,_));return{userId:R,batchId:D.batchId,localWriteTimeMs:D.localWriteTime.toMillis(),baseMutations:O,mutations:A}}(this.serializer,this.userId,u),d=[];let p=new he((m,E)=>X(m.canonicalString(),E.canonicalString()));for(const m of i){const E=g0(this.userId,m.key.path,a);p=p.add(m.key.path.popLast()),d.push(o.put(c)),d.push(s.put(E,ZD))}return p.forEach(m=>{d.push(this.indexManager.addToCollectionParentIndex(e,m))}),e.addOnCommittedListener(()=>{this.Zn[a]=u.keys()}),C.waitFor(d).next(()=>u)})}lookupMutationBatch(e,t){return ir(e).get(t).next(r=>r?(G(r.userId===this.userId,48,"Unexpected user for mutation batch",{userId:r.userId,batchId:t}),oi(this.serializer,r)):null)}Xn(e,t){return this.Zn[t]?C.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next(r=>{if(r){const i=r.keys();return this.Zn[t]=i,i}return null})}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=IDBKeyRange.lowerBound([this.userId,r]);let s=null;return ir(e).X({index:di,range:i},(o,a,u)=>{a.userId===this.userId&&(G(a.batchId>=r,47524,{er:r}),s=oi(this.serializer,a)),u.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let r=mi;return ir(e).X({index:di,range:t,reverse:!0},(i,s,o)=>{r=s.batchId,o.done()}).next(()=>r)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,mi],[this.userId,Number.POSITIVE_INFINITY]);return ir(e).j(di,t).next(r=>r.map(i=>oi(this.serializer,i)))}getAllMutationBatchesAffectingDocumentKey(e,t){const r=Cu(this.userId,t.path),i=IDBKeyRange.lowerBound(r),s=[];return es(e).X({range:i},(o,a,u)=>{const[c,d,p]=o,m=dn(d);if(c===this.userId&&t.path.isEqual(m))return ir(e).get(p).next(E=>{if(!E)throw K(61480,{tr:o,batchId:p});G(E.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:E.userId,batchId:p}),s.push(oi(this.serializer,E))});u.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new he(X);const i=[];return t.forEach(s=>{const o=Cu(this.userId,s.path),a=IDBKeyRange.lowerBound(o),u=es(e).X({range:a},(c,d,p)=>{const[m,E,R]=c,D=dn(E);m===this.userId&&s.path.isEqual(D)?r=r.add(R):p.done()});i.push(u)}),C.waitFor(i).next(()=>this.nr(e,r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1,s=Cu(this.userId,r),o=IDBKeyRange.lowerBound(s);let a=new he(X);return es(e).X({range:o},(u,c,d)=>{const[p,m,E]=u,R=dn(m);p===this.userId&&r.isPrefixOf(R)?R.length===i&&(a=a.add(E)):d.done()}).next(()=>this.nr(e,a))}nr(e,t){const r=[],i=[];return t.forEach(s=>{i.push(ir(e).get(s).next(o=>{if(o===null)throw K(35274,{batchId:s});G(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:s}),r.push(oi(this.serializer,o))}))}),C.waitFor(i).next(()=>r)}removeMutationBatch(e,t){return PS(e.ce,this.userId,t).next(r=>(e.addOnCommittedListener(()=>{this.rr(t.batchId)}),C.forEach(r,i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))}rr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return C.resolve();const r=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),i=[];return es(e).X({range:r},(s,o,a)=>{if(s[0]===this.userId){const u=dn(s[1]);i.push(u)}else a.done()}).next(()=>{G(i.length===0,56720,{ir:i.map(s=>s.canonicalString())})})})}containsKey(e,t){return RS(e,this.userId,t)}sr(e){return CS(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:mi,lastStreamToken:""})}}function RS(n,e,t){const r=Cu(e,t.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return es(n).X({range:s,Z:!0},(a,u,c)=>{const[d,p,m]=a;d===e&&p===i&&(o=!0),c.done()}).next(()=>o)}function ir(n){return qe(n,en)}function es(n){return qe(n,bs)}function CS(n){return qe(n,qa)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new xi(0)}static ur(){return new xi(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ix{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.cr(e).next(t=>{const r=new xi(t.highestTargetId);return t.highestTargetId=r.next(),this.lr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.cr(e).next(t=>Q.fromTimestamp(new le(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.cr(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,r){return this.cr(e).next(i=>(i.highestListenSequenceNumber=t,r&&(i.lastRemoteSnapshotVersion=r.toTimestamp()),t>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=t),this.lr(e,i)))}addTargetData(e,t){return this.hr(e,t).next(()=>this.cr(e).next(r=>(r.targetCount+=1,this.Pr(t,r),this.lr(e,r))))}updateTargetData(e,t){return this.hr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>Qi(e).delete(t.targetId)).next(()=>this.cr(e)).next(r=>(G(r.targetCount>0,8065),r.targetCount-=1,this.lr(e,r)))}removeTargets(e,t,r){let i=0;const s=[];return Qi(e).X((o,a)=>{const u=Xo(a);u.sequenceNumber<=t&&r.get(u.targetId)===null&&(i++,s.push(this.removeTargetData(e,u)))}).next(()=>C.waitFor(s)).next(()=>i)}forEachTarget(e,t){return Qi(e).X((r,i)=>{const s=Xo(i);t(s)})}cr(e){return uI(e).get(_c).next(t=>(G(t!==null,2888),t))}lr(e,t){return uI(e).put(_c,t)}hr(e,t){return Qi(e).put(ES(this.serializer,t))}Pr(e,t){let r=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,r=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,r=!0),r}getTargetCount(e){return this.cr(e).next(t=>t.targetCount)}getTargetData(e,t){const r=Vi(t),i=IDBKeyRange.bound([r,Number.NEGATIVE_INFINITY],[r,Number.POSITIVE_INFINITY]);let s=null;return Qi(e).X({range:i,index:_0},(o,a,u)=>{const c=Xo(a);dl(t,c.target)&&(s=c,u.done())}).next(()=>s)}addMatchingKeys(e,t,r){const i=[],s=pr(e);return t.forEach(o=>{const a=ht(o.path);i.push(s.put({targetId:r,path:a})),i.push(this.referenceDelegate.addReference(e,r,o))}),C.waitFor(i)}removeMatchingKeys(e,t,r){const i=pr(e);return C.forEach(t,s=>{const o=ht(s.path);return C.waitFor([i.delete([r,o]),this.referenceDelegate.removeReference(e,r,s)])})}removeMatchingKeysForTargetId(e,t){const r=pr(e),i=IDBKeyRange.bound([t],[t+1],!1,!0);return r.delete(i)}getMatchingKeysForTargetId(e,t){const r=IDBKeyRange.bound([t],[t+1],!1,!0),i=pr(e);let s=Z();return i.X({range:r,Z:!0},(o,a,u)=>{const c=dn(o[1]),d=new $(c);s=s.add(d)}).next(()=>s)}containsKey(e,t){const r=ht(t.path),i=IDBKeyRange.bound([r],[a0(r)],!1,!0);let s=0;return pr(e).X({index:Cm,Z:!0,range:i},([o,a],u,c)=>{o!==0&&(s++,c.done())}).next(()=>s>0)}Et(e,t){return Qi(e).get(t).next(r=>r?Xo(r):null)}}function Qi(n){return qe(n,Os)}function uI(n){return qe(n,gi)}function pr(n){return qe(n,Ls)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cI="LruGarbageCollector",kS=1048576;function hI([n,e],[t,r]){const i=X(n,t);return i===0?X(e,r):i}class Ex{constructor(e){this.Tr=e,this.buffer=new he(hI),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();hI(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class VS{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){L(cI,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Wr(t)?L(cI,"Ignoring IndexedDB error during garbage collection: ",t):await qr(t)}await this.Rr(3e5)})}}class wx{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next(r=>Math.floor(t/100*r))}nthSequenceNumber(e,t){if(t===0)return C.resolve(Tt.ue);const r=new Ex(t);return this.Vr.forEachTarget(e,i=>r.Er(i.sequenceNumber)).next(()=>this.Vr.gr(e,i=>r.Er(i))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.Vr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(L("LruGarbageCollector","Garbage collection skipped; disabled"),C.resolve(lI)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(L("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),lI):this.pr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let r,i,s,o,a,u,c;const d=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(p=>(p>this.params.maximumSequenceNumbersToCollect?(L("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),i=this.params.maximumSequenceNumbersToCollect):i=p,o=Date.now(),this.nthSequenceNumber(e,i))).next(p=>(r=p,a=Date.now(),this.removeTargets(e,r,t))).next(p=>(s=p,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(p=>(c=Date.now(),Xi()<=ne.DEBUG&&L("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-d}ms
	Determined least recently used ${i} in `+(a-o)+`ms
	Removed ${s} targets in `+(u-a)+`ms
	Removed ${p} documents in `+(c-u)+`ms
Total Duration: ${c-d}ms`),C.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:p})))}}function DS(n,e){return new wx(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tx{constructor(e,t){this.db=e,this.garbageCollector=DS(this,t)}mr(e){const t=this.yr(e);return this.db.getTargetCache().getTargetCount(e).next(r=>t.next(i=>r+i))}yr(e){let t=0;return this.gr(e,r=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}gr(e,t){return this.wr(e,(r,i)=>t(i))}addReference(e,t,r){return ou(e,r)}removeReference(e,t,r){return ou(e,r)}removeTargets(e,t,r){return this.db.getTargetCache().removeTargets(e,t,r)}markPotentiallyOrphaned(e,t){return ou(e,t)}Sr(e,t){return function(i,s){let o=!1;return CS(i).ee(a=>RS(i,a,s).next(u=>(u&&(o=!0),C.resolve(!u)))).next(()=>o)}(e,t)}removeOrphanedDocuments(e,t){const r=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[];let s=0;return this.wr(e,(o,a)=>{if(a<=t){const u=this.Sr(e,o).next(c=>{if(!c)return s++,r.getEntry(e,o).next(()=>(r.removeEntry(o,Q.min()),pr(e).delete(function(p){return[0,ht(p.path)]}(o))))});i.push(u)}}).next(()=>C.waitFor(i)).next(()=>r.apply(e)).next(()=>s)}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,r)}updateLimboDocument(e,t){return ou(e,t)}wr(e,t){const r=pr(e);let i,s=Tt.ue;return r.X({index:Cm},([o,a],{path:u,sequenceNumber:c})=>{o===0?(s!==Tt.ue&&t(new $(dn(i)),s),s=c,i=u):s=Tt.ue}).next(()=>{s!==Tt.ue&&t(new $(dn(i)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function ou(n,e){return pr(n).put(function(r,i){return{targetId:0,path:ht(r.path),sequenceNumber:i}}(e,n.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NS{constructor(){this.changes=new Qn(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ce.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?C.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sx{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,r){return Zr(e).put(r)}removeEntry(e,t,r){return Zr(e).delete(function(s,o){const a=s.path.toArray();return[a.slice(0,a.length-2),a[a.length-2],Ac(o),a[a.length-1]]}(t,r))}updateMetadata(e,t){return this.getMetadata(e).next(r=>(r.byteSize+=t,this.br(e,r)))}getEntry(e,t){let r=Ce.newInvalidDocument(t);return Zr(e).X({index:ku,range:IDBKeyRange.only(Fo(t))},(i,s)=>{r=this.Dr(t,s)}).next(()=>r)}vr(e,t){let r={size:0,document:Ce.newInvalidDocument(t)};return Zr(e).X({index:ku,range:IDBKeyRange.only(Fo(t))},(i,s)=>{r={document:this.Dr(t,s),size:Rc(s)}}).next(()=>r)}getEntries(e,t){let r=xt();return this.Cr(e,t,(i,s)=>{const o=this.Dr(i,s);r=r.insert(i,o)}).next(()=>r)}Fr(e,t){let r=xt(),i=new me($.comparator);return this.Cr(e,t,(s,o)=>{const a=this.Dr(s,o);r=r.insert(s,a),i=i.insert(s,Rc(o))}).next(()=>({documents:r,Mr:i}))}Cr(e,t,r){if(t.isEmpty())return C.resolve();let i=new he(pI);t.forEach(u=>i=i.add(u));const s=IDBKeyRange.bound(Fo(i.first()),Fo(i.last())),o=i.getIterator();let a=o.getNext();return Zr(e).X({index:ku,range:s},(u,c,d)=>{const p=$.fromSegments([...c.prefixPath,c.collectionGroup,c.documentId]);for(;a&&pI(a,p)<0;)r(a,null),a=o.getNext();a&&a.isEqual(p)&&(r(a,c),a=o.hasNext()?o.getNext():null),a?d.G(Fo(a)):d.done()}).next(()=>{for(;a;)r(a,null),a=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(e,t,r,i,s){const o=t.path,a=[o.popLast().toArray(),o.lastSegment(),Ac(r.readTime),r.documentKey.path.isEmpty()?"":r.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Zr(e).j(IDBKeyRange.bound(a,u,!0)).next(c=>{s==null||s.incrementDocumentReadCount(c.length);let d=xt();for(const p of c){const m=this.Dr($.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);m.isFoundDocument()&&(pl(t,m)||i.has(m.key))&&(d=d.insert(m.key,m))}return d})}getAllFromCollectionGroup(e,t,r,i){let s=xt();const o=fI(t,r),a=fI(t,Ft.max());return Zr(e).X({index:y0,range:IDBKeyRange.bound(o,a,!0)},(u,c,d)=>{const p=this.Dr($.fromSegments(c.prefixPath.concat(c.collectionGroup,c.documentId)),c);s=s.insert(p.key,p),s.size===i&&d.done()}).next(()=>s)}newChangeBuffer(e){return new Ax(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return dI(e).get(Kf).next(t=>(G(!!t,20021),t))}br(e,t){return dI(e).put(Kf,t)}Dr(e,t){if(t){const r=cx(this.serializer,t);if(!(r.isNoDocument()&&r.version.isEqual(Q.min())))return r}return Ce.newInvalidDocument(e)}}function xS(n){return new Sx(n)}class Ax extends NS{constructor(e,t){super(),this.Or=e,this.trackRemovals=t,this.Nr=new Qn(r=>r.toString(),(r,i)=>r.isEqual(i))}applyChanges(e){const t=[];let r=0,i=new he((s,o)=>X(s.canonicalString(),o.canonicalString()));return this.changes.forEach((s,o)=>{const a=this.Nr.get(s);if(t.push(this.Or.removeEntry(e,s,a.readTime)),o.isValidDocument()){const u=Qv(this.Or.serializer,o);i=i.add(s.path.popLast());const c=Rc(u);r+=c-a.size,t.push(this.Or.addEntry(e,s,u))}else if(r-=a.size,this.trackRemovals){const u=Qv(this.Or.serializer,o.convertToNoDocument(Q.min()));t.push(this.Or.addEntry(e,s,u))}}),i.forEach(s=>{t.push(this.Or.indexManager.addToCollectionParentIndex(e,s))}),t.push(this.Or.updateMetadata(e,r)),C.waitFor(t)}getFromCache(e,t){return this.Or.vr(e,t).next(r=>(this.Nr.set(t,{size:r.size,readTime:r.document.readTime}),r.document))}getAllFromCache(e,t){return this.Or.Fr(e,t).next(({documents:r,Mr:i})=>(i.forEach((s,o)=>{this.Nr.set(s,{size:o,readTime:r.get(s).readTime})}),r))}}function dI(n){return qe(n,Wa)}function Zr(n){return qe(n,yc)}function Fo(n){const e=n.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function fI(n,e){const t=e.documentKey.path.toArray();return[n,Ac(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function pI(n,e){const t=n.path.toArray(),r=e.path.toArray();let i=0;for(let s=0;s<t.length-2&&s<r.length-2;++s)if(i=X(t[s],r[s]),i)return i;return i=X(t.length,r.length),i||(i=X(t[t.length-2],r[r.length-2]),i||X(t[t.length-1],r[r.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Px{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bS{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(r!==null&&va(r.mutation,i,St.empty(),le.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,Z()).next(()=>r))}getLocalViewOfDocuments(e,t,r=Z()){const i=fn();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,r).next(s=>{let o=Go();return s.forEach((a,u)=>{o=o.insert(a,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const r=fn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,Z()))}populateOverlays(e,t,r){const i=[];return r.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,a)=>{t.set(o,a)})})}computeViews(e,t,r,i){let s=xt();const o=_a(),a=function(){return _a()}();return t.forEach((u,c)=>{const d=r.get(c.key);i.has(c.key)&&(d===void 0||d.mutation instanceof Xn)?s=s.insert(c.key,c):d!==void 0?(o.set(c.key,d.mutation.getFieldMask()),va(d.mutation,c,d.mutation.getFieldMask(),le.now())):o.set(c.key,St.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((c,d)=>o.set(c,d)),t.forEach((c,d)=>{var p;return a.set(c,new Px(d,(p=o.get(c))!==null&&p!==void 0?p:null))}),a))}recalculateAndSaveOverlays(e,t){const r=_a();let i=new me((o,a)=>o-a),s=Z();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const a of o)a.keys().forEach(u=>{const c=t.get(u);if(c===null)return;let d=r.get(u)||St.empty();d=a.applyToLocalView(c,d),r.set(u,d);const p=(i.get(a.batchId)||Z()).add(u);i=i.insert(a.batchId,p)})}).next(()=>{const o=[],a=i.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,d=u.value,p=X0();d.forEach(m=>{if(!s.has(m)){const E=rS(t.get(m),r.get(m));E!==null&&p.set(m,E),s=s.add(m)}}),o.push(this.documentOverlayCache.saveOverlays(e,c,p))}return C.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,i){return function(o){return $.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):q0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):C.resolve(fn());let a=xs,u=s;return o.next(c=>C.forEach(c,(d,p)=>(a<p.largestBatchId&&(a=p.largestBatchId),s.get(d)?C.resolve():this.remoteDocumentCache.getEntry(e,d).next(m=>{u=u.insert(d,m)}))).next(()=>this.populateOverlays(e,c,s)).next(()=>this.computeViews(e,u,c,Z())).next(d=>({batchId:a,changes:Q0(d)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new $(t)).next(r=>{let i=Go();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){const s=t.collectionGroup;let o=Go();return this.indexManager.getCollectionParents(e,s).next(a=>C.forEach(a,u=>{const c=function(p,m){return new oo(m,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(t,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,c,r,i).next(d=>{d.forEach((p,m)=>{o=o.insert(p,m)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i))).next(o=>{s.forEach((u,c)=>{const d=c.getKey();o.get(d)===null&&(o=o.insert(d,Ce.newInvalidDocument(d)))});let a=Go();return o.forEach((u,c)=>{const d=s.get(u);d!==void 0&&va(d.mutation,c,St.empty(),le.now()),pl(t,c)&&(a=a.insert(u,c))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rx{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return C.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,function(i){return{id:i.id,version:i.version,createTime:_t(i.createTime)}}(t)),C.resolve()}getNamedQuery(e,t){return C.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,function(i){return{name:i.name,query:wS(i.bundledQuery),readTime:_t(i.readTime)}}(t)),C.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cx{constructor(){this.overlays=new me($.comparator),this.kr=new Map}getOverlay(e,t){return C.resolve(this.overlays.get(t))}getOverlays(e,t){const r=fn();return C.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((i,s)=>{this.wt(e,t,s)}),C.resolve()}removeOverlaysForBatchId(e,t,r){const i=this.kr.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.kr.delete(r)),C.resolve()}getOverlaysForCollection(e,t,r){const i=fn(),s=t.length+1,o=new $(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return C.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new me((c,d)=>c-d);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>r){let d=s.get(c.largestBatchId);d===null&&(d=fn(),s=s.insert(c.largestBatchId,d)),d.set(c.getKey(),c)}}const a=fn(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((c,d)=>a.set(c,d)),!(a.size()>=i)););return C.resolve(a)}wt(e,t,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.kr.get(i.largestBatchId).delete(r.key);this.kr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new zm(t,r));let s=this.kr.get(t);s===void 0&&(s=Z(),this.kr.set(t,s)),this.kr.set(t,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kx{constructor(){this.sessionToken=xe.EMPTY_BYTE_STRING}getSessionToken(e){return C.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,C.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Km{constructor(){this.qr=new he(We.Qr),this.$r=new he(We.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const r=new We(e,t);this.qr=this.qr.add(r),this.$r=this.$r.add(r)}Kr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Wr(new We(e,t))}Gr(e,t){e.forEach(r=>this.removeReference(r,t))}zr(e){const t=new $(new ae([])),r=new We(t,e),i=new We(t,e+1),s=[];return this.$r.forEachInRange([r,i],o=>{this.Wr(o),s.push(o.key)}),s}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new $(new ae([])),r=new We(t,e),i=new We(t,e+1);let s=Z();return this.$r.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const t=new We(e,0),r=this.qr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class We{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return $.comparator(e.key,t.key)||X(e.Hr,t.Hr)}static Ur(e,t){return X(e.Hr,t.Hr)||$.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vx{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new he(We.Qr)}checkEmpty(e){return C.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Um(s,t,r,i);this.mutationQueue.push(o);for(const a of i)this.Yr=this.Yr.add(new We(a.key,s)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return C.resolve(o)}lookupMutationBatch(e,t){return C.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=this.Xr(r),s=i<0?0:i;return C.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return C.resolve(this.mutationQueue.length===0?mi:this.er-1)}getAllMutationBatches(e){return C.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new We(t,0),i=new We(t,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([r,i],o=>{const a=this.Zr(o.Hr);s.push(a)}),C.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new he(X);return t.forEach(i=>{const s=new We(i,0),o=new We(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,o],a=>{r=r.add(a.Hr)})}),C.resolve(this.ei(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1;let s=r;$.isDocumentKey(s)||(s=s.child(""));const o=new We(new $(s),0);let a=new he(X);return this.Yr.forEachWhile(u=>{const c=u.key.path;return!!r.isPrefixOf(c)&&(c.length===i&&(a=a.add(u.Hr)),!0)},o),C.resolve(this.ei(a))}ei(e){const t=[];return e.forEach(r=>{const i=this.Zr(r);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){G(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Yr;return C.forEach(t.mutations,i=>{const s=new We(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Yr=r})}rr(e){}containsKey(e,t){const r=new We(t,0),i=this.Yr.firstAfterOrEqual(r);return C.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,C.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dx{constructor(e){this.ni=e,this.docs=function(){return new me($.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,i=this.docs.get(r),s=i?i.size:0,o=this.ni(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return C.resolve(r?r.document.mutableCopy():Ce.newInvalidDocument(t))}getEntries(e,t){let r=xt();return t.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Ce.newInvalidDocument(i))}),C.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=xt();const o=t.path,a=new $(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:d}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||Pm(h0(d),r)<=0||(i.has(d.key)||pl(t,d))&&(s=s.insert(d.key,d.mutableCopy()))}return C.resolve(s)}getAllFromCollectionGroup(e,t,r,i){K(9500)}ri(e,t){return C.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Nx(this)}getSize(e){return C.resolve(this.size)}}class Nx extends NS{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?t.push(this.Or.addEntry(e,i)):this.Or.removeEntry(r)}),C.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xx{constructor(e){this.persistence=e,this.ii=new Qn(t=>Vi(t),dl),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.si=0,this.oi=new Km,this.targetCount=0,this._i=xi.ar()}forEachTarget(e,t){return this.ii.forEach((r,i)=>t(i)),C.resolve()}getLastRemoteSnapshotVersion(e){return C.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return C.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),C.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.si&&(this.si=t),C.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new xi(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,C.resolve()}updateTargetData(e,t){return this.hr(t),C.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,C.resolve()}removeTargets(e,t,r){let i=0;const s=[];return this.ii.forEach((o,a)=>{a.sequenceNumber<=t&&r.get(a.targetId)===null&&(this.ii.delete(o),s.push(this.removeMatchingKeysForTargetId(e,a.targetId)),i++)}),C.waitFor(s).next(()=>i)}getTargetCount(e){return C.resolve(this.targetCount)}getTargetData(e,t){const r=this.ii.get(t)||null;return C.resolve(r)}addMatchingKeys(e,t,r){return this.oi.Kr(t,r),C.resolve()}removeMatchingKeys(e,t,r){this.oi.Gr(t,r);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),C.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),C.resolve()}getMatchingKeysForTargetId(e,t){const r=this.oi.Jr(t);return C.resolve(r)}containsKey(e,t){return C.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(e,t){this.ai={},this.overlays={},this.ui=new Tt(0),this.ci=!1,this.ci=!0,this.li=new kx,this.referenceDelegate=e(this),this.hi=new xx(this),this.indexManager=new _x,this.remoteDocumentCache=function(i){return new Dx(i)}(r=>this.referenceDelegate.Pi(r)),this.serializer=new IS(t),this.Ti=new Rx(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Cx,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.ai[e.toKey()];return r||(r=new Vx(t,this.referenceDelegate),this.ai[e.toKey()]=r),r}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,r){L("MemoryPersistence","Starting transaction:",e);const i=new bx(this.ui.next());return this.referenceDelegate.Ii(),r(i).next(s=>this.referenceDelegate.di(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Ei(e,t){return C.or(Object.values(this.ai).map(r=>()=>r.containsKey(e,t)))}}class bx extends f0{constructor(e){super(),this.currentSequenceNumber=e}}class Eh{constructor(e){this.persistence=e,this.Ai=new Km,this.Ri=null}static Vi(e){return new Eh(e)}get mi(){if(this.Ri)return this.Ri;throw K(60996)}addReference(e,t,r){return this.Ai.addReference(r,t),this.mi.delete(r.toString()),C.resolve()}removeReference(e,t,r){return this.Ai.removeReference(r,t),this.mi.add(r.toString()),C.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),C.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach(i=>this.mi.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.mi.add(s.toString()))}).next(()=>r.removeTargetData(e,t))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return C.forEach(this.mi,r=>{const i=$.fromPath(r);return this.fi(e,i).next(s=>{s||t.removeEntry(i,Q.min())})}).next(()=>(this.Ri=null,t.apply(e)))}updateLimboDocument(e,t){return this.fi(e,t).next(r=>{r?this.mi.delete(t.toString()):this.mi.add(t.toString())})}Pi(e){return 0}fi(e,t){return C.or([()=>C.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Cc{constructor(e,t){this.persistence=e,this.gi=new Qn(r=>ht(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=DS(this,t)}static Vi(e,t){return new Cc(e,t)}Ii(){}di(e){return C.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>t.next(i=>r+i))}yr(e){let t=0;return this.gr(e,r=>{t++}).next(()=>t)}gr(e,t){return C.forEach(this.gi,(r,i)=>this.Sr(e,r,i).next(s=>s?C.resolve():t(i)))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ri(e,o=>this.Sr(e,o,t).next(a=>{a||(r++,s.removeEntry(o,Q.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),C.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),C.resolve()}removeReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),C.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),C.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Du(e.data.value)),t}Sr(e,t,r){return C.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.gi.get(t);return C.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ox{constructor(e){this.serializer=e}q(e,t,r,i){const s=new lh("createOrUpgrade",t);r<1&&i>=1&&(function(u){u.createObjectStore(hl)}(e),function(u){u.createObjectStore(qa,{keyPath:JD}),u.createObjectStore(en,{keyPath:Av,autoIncrement:!0}).createIndex(di,Pv,{unique:!0}),u.createObjectStore(bs)}(e),mI(e),function(u){u.createObjectStore(ii)}(e));let o=C.resolve();return r<3&&i>=3&&(r!==0&&(function(u){u.deleteObjectStore(Ls),u.deleteObjectStore(Os),u.deleteObjectStore(gi)}(e),mI(e)),o=o.next(()=>function(u){const c=u.store(gi),d={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:Q.min().toTimestamp(),targetCount:0};return c.put(_c,d)}(s))),r<4&&i>=4&&(r!==0&&(o=o.next(()=>function(u,c){return c.store(en).j().next(p=>{u.deleteObjectStore(en),u.createObjectStore(en,{keyPath:Av,autoIncrement:!0}).createIndex(di,Pv,{unique:!0});const m=c.store(en),E=p.map(R=>m.put(R));return C.waitFor(E)})}(e,s))),o=o.next(()=>{(function(u){u.createObjectStore(Ms,{keyPath:aN})})(e)})),r<5&&i>=5&&(o=o.next(()=>this.pi(s))),r<6&&i>=6&&(o=o.next(()=>(function(u){u.createObjectStore(Wa)}(e),this.yi(s)))),r<7&&i>=7&&(o=o.next(()=>this.wi(s))),r<8&&i>=8&&(o=o.next(()=>this.Si(e,s))),r<9&&i>=9&&(o=o.next(()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)})),r<10&&i>=10&&(o=o.next(()=>this.bi(s))),r<11&&i>=11&&(o=o.next(()=>{(function(u){u.createObjectStore(ch,{keyPath:lN})})(e),function(u){u.createObjectStore(hh,{keyPath:uN})}(e)})),r<12&&i>=12&&(o=o.next(()=>{(function(u){const c=u.createObjectStore(dh,{keyPath:gN});c.createIndex(Gf,yN,{unique:!1}),c.createIndex(E0,_N,{unique:!1})})(e)})),r<13&&i>=13&&(o=o.next(()=>function(u){const c=u.createObjectStore(yc,{keyPath:eN});c.createIndex(ku,tN),c.createIndex(y0,nN)}(e)).next(()=>this.Di(e,s)).next(()=>e.deleteObjectStore(ii))),r<14&&i>=14&&(o=o.next(()=>this.Ci(e,s))),r<15&&i>=15&&(o=o.next(()=>function(u){u.createObjectStore(km,{keyPath:cN,autoIncrement:!0}).createIndex(Hf,hN,{unique:!1}),u.createObjectStore(pa,{keyPath:dN}).createIndex(v0,fN,{unique:!1}),u.createObjectStore(ma,{keyPath:pN}).createIndex(I0,mN,{unique:!1})}(e))),r<16&&i>=16&&(o=o.next(()=>{t.objectStore(pa).clear()}).next(()=>{t.objectStore(ma).clear()})),r<17&&i>=17&&(o=o.next(()=>{(function(u){u.createObjectStore(Vm,{keyPath:vN})})(e)})),r<18&&i>=18&&iT()&&(o=o.next(()=>{t.objectStore(pa).clear()}).next(()=>{t.objectStore(ma).clear()})),o}yi(e){let t=0;return e.store(ii).X((r,i)=>{t+=Rc(i)}).next(()=>{const r={byteSize:t};return e.store(Wa).put(Kf,r)})}pi(e){const t=e.store(qa),r=e.store(en);return t.j().next(i=>C.forEach(i,s=>{const o=IDBKeyRange.bound([s.userId,mi],[s.userId,s.lastAcknowledgedBatchId]);return r.j(di,o).next(a=>C.forEach(a,u=>{G(u.userId===s.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const c=oi(this.serializer,u);return PS(e,s.userId,c).next(()=>{})}))}))}wi(e){const t=e.store(Ls),r=e.store(ii);return e.store(gi).get(_c).next(i=>{const s=[];return r.X((o,a)=>{const u=new ae(o),c=function(p){return[0,ht(p)]}(u);s.push(t.get(c).next(d=>d?C.resolve():(p=>t.put({targetId:0,path:ht(p),sequenceNumber:i.highestListenSequenceNumber}))(u)))}).next(()=>C.waitFor(s))})}Si(e,t){e.createObjectStore(Ka,{keyPath:oN});const r=t.store(Ka),i=new Wm,s=o=>{if(i.add(o)){const a=o.lastSegment(),u=o.popLast();return r.put({collectionId:a,parent:ht(u)})}};return t.store(ii).X({Z:!0},(o,a)=>{const u=new ae(o);return s(u.popLast())}).next(()=>t.store(bs).X({Z:!0},([o,a,u],c)=>{const d=dn(a);return s(d.popLast())}))}bi(e){const t=e.store(Os);return t.X((r,i)=>{const s=Xo(i),o=ES(this.serializer,s);return t.put(o)})}Di(e,t){const r=t.store(ii),i=[];return r.X((s,o)=>{const a=t.store(yc),u=function(p){return p.document?new $(ae.fromString(p.document.name).popFirst(5)):p.noDocument?$.fromSegments(p.noDocument.path):p.unknownDocument?$.fromSegments(p.unknownDocument.path):K(36783)}(o).path.toArray(),c={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};i.push(a.put(c))}).next(()=>C.waitFor(i))}Ci(e,t){const r=t.store(en),i=xS(this.serializer),s=new Hm(Eh.Vi,this.serializer.gt);return r.j().next(o=>{const a=new Map;return o.forEach(u=>{var c;let d=(c=a.get(u.userId))!==null&&c!==void 0?c:Z();oi(this.serializer,u).keys().forEach(p=>d=d.add(p)),a.set(u.userId,d)}),C.forEach(a,(u,c)=>{const d=new ot(c),p=vh.yt(this.serializer,d),m=s.getIndexManager(d),E=Ih.yt(d,this.serializer,m,s.referenceDelegate);return new bS(i,E,p,m).recalculateAndSaveOverlaysForDocumentKeys(new Qf(t,Tt.ue),u).next()})})}}function mI(n){n.createObjectStore(Ls,{keyPath:iN}).createIndex(Cm,sN,{unique:!0}),n.createObjectStore(Os,{keyPath:"targetId"}).createIndex(_0,rN,{unique:!0}),n.createObjectStore(gi)}const sr="IndexedDbPersistence",Ld=18e5,Md=5e3,Fd="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",Lx="main";class Gm{constructor(e,t,r,i,s,o,a,u,c,d,p=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=r,this.Fi=s,this.window=o,this.document=a,this.Mi=c,this.xi=d,this.Oi=p,this.ui=null,this.ci=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Ni=null,this.inForeground=!1,this.Bi=null,this.Li=null,this.ki=Number.NEGATIVE_INFINITY,this.qi=m=>Promise.resolve(),!Gm.C())throw new B(b.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Tx(this,i),this.Qi=t+Lx,this.serializer=new IS(u),this.$i=new Nr(this.Qi,this.Oi,new Ox(this.serializer)),this.li=new dx,this.hi=new Ix(this.referenceDelegate,this.serializer),this.remoteDocumentCache=xS(this.serializer),this.Ti=new hx,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,d===!1&&Ne(sr,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ki().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new B(b.FAILED_PRECONDITION,Fd);return this.Wi(),this.Gi(),this.zi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.hi.getHighestSequenceNumber(e))}).then(e=>{this.ui=new Tt(e,this.Mi)}).then(()=>{this.ci=!0}).catch(e=>(this.$i&&this.$i.close(),Promise.reject(e)))}ji(e){return this.qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.$i.setDatabaseDeletedListener(e)}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Fi.enqueueAndForget(async()=>{this.started&&await this.Ki()}))}Ki(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>au(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Ji(e).next(t=>{t||(this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)))})}).next(()=>this.Hi(e)).next(t=>this.isPrimary&&!t?this.Yi(e).next(()=>!1):!!t&&this.Zi(e).next(()=>!0))).catch(e=>{if(Wr(e))return L(sr,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return L(sr,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Fi.enqueueRetryable(()=>this.qi(e)),this.isPrimary=e})}Ji(e){return Uo(e).get(qi).next(t=>C.resolve(this.Xi(t)))}es(e){return au(e).delete(this.clientId)}async ts(){if(this.isPrimary&&!this.ns(this.ki,Ld)){this.ki=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const r=qe(t,Ms);return r.j().next(i=>{const s=this.rs(i,Ld),o=i.filter(a=>s.indexOf(a)===-1);return C.forEach(o,a=>r.delete(a.clientId)).next(()=>o)})}).catch(()=>[]);if(this.Ui)for(const t of e)this.Ui.removeItem(this.ss(t.clientId))}}zi(){this.Li=this.Fi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Ki().then(()=>this.ts()).then(()=>this.zi()))}Xi(e){return!!e&&e.ownerId===this.clientId}Hi(e){return this.xi?C.resolve(!0):Uo(e).get(qi).next(t=>{if(t!==null&&this.ns(t.leaseTimestampMs,Md)&&!this._s(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new B(b.FAILED_PRECONDITION,Fd);return!1}}return!(!this.networkEnabled||!this.inForeground)||au(e).j().next(r=>this.rs(r,Md).find(i=>{if(this.clientId!==i.clientId){const s=!this.networkEnabled&&i.networkEnabled,o=!this.inForeground&&i.inForeground,a=this.networkEnabled===i.networkEnabled;if(s||o&&a)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&L(sr,`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.ci=!1,this.us(),this.Li&&(this.Li.cancel(),this.Li=null),this.cs(),this.ls(),await this.$i.runTransaction("shutdown","readwrite",[hl,Ms],e=>{const t=new Qf(e,Tt.ue);return this.Yi(t).next(()=>this.es(t))}),this.$i.close(),this.hs()}rs(e,t){return e.filter(r=>this.ns(r.updateTimeMs,t)&&!this._s(r.clientId))}Ps(){return this.runTransaction("getActiveClients","readonly",e=>au(e).j().next(t=>this.rs(t,Ld).map(r=>r.clientId)))}get started(){return this.ci}getGlobalsCache(){return this.li}getMutationQueue(e,t){return Ih.yt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new vx(e,this.serializer.gt.databaseId)}getDocumentOverlayCache(e){return vh.yt(this.serializer,e)}getBundleCache(){return this.Ti}runTransaction(e,t,r){L(sr,"Starting transaction:",e);const i=t==="readonly"?"readonly":"readwrite",s=function(u){return u===18?wN:u===17?A0:u===16?EN:u===15?Dm:u===14?S0:u===13?T0:u===12?IN:u===11?w0:void K(60245)}(this.Oi);let o;return this.$i.runTransaction(e,i,s,a=>(o=new Qf(a,this.ui?this.ui.next():Tt.ue),t==="readwrite-primary"?this.Ji(o).next(u=>!!u||this.Hi(o)).next(u=>{if(!u)throw Ne(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)),new B(b.FAILED_PRECONDITION,d0);return r(o)}).next(u=>this.Zi(o).next(()=>u)):this.Ts(o).next(()=>r(o)))).then(a=>(o.raiseOnCommittedEvent(),a))}Ts(e){return Uo(e).get(qi).next(t=>{if(t!==null&&this.ns(t.leaseTimestampMs,Md)&&!this._s(t.ownerId)&&!this.Xi(t)&&!(this.xi||this.allowTabSynchronization&&t.allowTabSynchronization))throw new B(b.FAILED_PRECONDITION,Fd)})}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Uo(e).put(qi,t)}static C(){return Nr.C()}Yi(e){const t=Uo(e);return t.get(qi).next(r=>this.Xi(r)?(L(sr,"Releasing primary lease."),t.delete(qi)):C.resolve())}ns(e,t){const r=Date.now();return!(e<r-t)&&(!(e>r)||(Ne(`Detected an update time that is in the future: ${e} > ${r}`),!1))}Wi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Bi=()=>{this.Fi.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.Ki()))},this.document.addEventListener("visibilitychange",this.Bi),this.inForeground=this.document.visibilityState==="visible")}cs(){this.Bi&&(this.document.removeEventListener("visibilitychange",this.Bi),this.Bi=null)}Gi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Ni=()=>{this.us();const t=/(?:Version|Mobile)\/1[456]/;rT()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Fi.enterRestrictedMode(!0),this.Fi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Ni))}ls(){this.Ni&&(this.window.removeEventListener("pagehide",this.Ni),this.Ni=null)}_s(e){var t;try{const r=((t=this.Ui)===null||t===void 0?void 0:t.getItem(this.ss(e)))!==null;return L(sr,`Client '${e}' ${r?"is":"is not"} zombied in LocalStorage`),r}catch(r){return Ne(sr,"Failed to get zombied client id.",r),!1}}us(){if(this.Ui)try{this.Ui.setItem(this.ss(this.clientId),String(Date.now()))}catch(e){Ne("Failed to set zombie client id.",e)}}hs(){if(this.Ui)try{this.Ui.removeItem(this.ss(this.clientId))}catch{}}ss(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Uo(n){return qe(n,hl)}function au(n){return qe(n,Ms)}function OS(n,e){let t=n.projectId;return n.isDefaultDatabase||(t+="."+n.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qm{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.Is=r,this.ds=i}static Es(e,t){let r=Z(),i=Z();for(const s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Qm(e,t.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mx{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LS{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=function(){return rT()?8:p0(ze())>0?6:4}()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,r,i){const s={result:null};return this.ps(e,t).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.ys(e,t,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new Mx;return this.ws(e,t,o).next(a=>{if(s.result=a,this.Rs)return this.Ss(e,t,o,a.size)})}).next(()=>s.result)}Ss(e,t,r,i){return r.documentReadCount<this.Vs?(Xi()<=ne.DEBUG&&L("QueryEngine","SDK will not create cache indexes for query:",Yi(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),C.resolve()):(Xi()<=ne.DEBUG&&L("QueryEngine","Query:",Yi(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.fs*i?(Xi()<=ne.DEBUG&&L("QueryEngine","The SDK decides to create cache indexes for query:",Yi(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Lt(t))):C.resolve())}ps(e,t){if(Uv(t))return C.resolve(null);let r=Lt(t);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=wc(t,null,"F"),r=Lt(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=Z(...s);return this.gs.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,r).next(u=>{const c=this.bs(t,a);return this.Ds(t,c,o,u.readTime)?this.ps(e,wc(t,null,"F")):this.vs(e,c,t,u)}))})))}ys(e,t,r,i){return Uv(t)||i.isEqual(Q.min())?C.resolve(null):this.gs.getDocuments(e,r).next(s=>{const o=this.bs(t,s);return this.Ds(t,o,r,i)?C.resolve(null):(Xi()<=ne.DEBUG&&L("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Yi(t)),this.vs(e,o,t,c0(i,xs)).next(a=>a))})}bs(e,t){let r=new he(H0(e));return t.forEach((i,s)=>{pl(e,s)&&(r=r.add(s))}),r}Ds(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ws(e,t,r){return Xi()<=ne.DEBUG&&L("QueryEngine","Using full collection scan to execute query:",Yi(t)),this.gs.getDocumentsMatchingQuery(e,t,Ft.min(),r)}vs(e,t,r,i){return this.gs.getDocumentsMatchingQuery(e,r,i).next(s=>(t.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xm="LocalStore",Fx=3e8;class Ux{constructor(e,t,r,i){this.persistence=e,this.Cs=t,this.serializer=i,this.Fs=new me(X),this.Ms=new Qn(s=>Vi(s),dl),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(r)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new bS(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Fs))}}function MS(n,e,t,r){return new Ux(n,e,t,r)}async function FS(n,e){const t=H(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,t.Ns(e),t.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],a=[];let u=Z();for(const c of i){o.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}for(const c of s){a.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}return t.localDocuments.getDocuments(r,u).next(c=>({Bs:c,removedBatchIds:o,addedBatchIds:a}))})})}function Bx(n,e){const t=H(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=t.Os.newChangeBuffer({trackRemovals:!0});return function(a,u,c,d){const p=c.batch,m=p.keys();let E=C.resolve();return m.forEach(R=>{E=E.next(()=>d.getEntry(u,R)).next(D=>{const O=c.docVersions.get(R);G(O!==null,48541),D.version.compareTo(O)<0&&(p.applyToRemoteDocument(D,c),D.isValidDocument()&&(D.setReadTime(c.commitVersion),d.addEntry(D)))})}),E.next(()=>a.mutationQueue.removeMutationBatch(u,p))}(t,r,e,s).next(()=>s.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(a){let u=Z();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(u=u.add(a.batch.mutations[c].key));return u}(e))).next(()=>t.localDocuments.getDocuments(r,i))})}function US(n){const e=H(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.hi.getLastRemoteSnapshotVersion(t))}function zx(n,e){const t=H(n),r=e.snapshotVersion;let i=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=t.Os.newChangeBuffer({trackRemovals:!0});i=t.Fs;const a=[];e.targetChanges.forEach((d,p)=>{const m=i.get(p);if(!m)return;a.push(t.hi.removeMatchingKeys(s,d.removedDocuments,p).next(()=>t.hi.addMatchingKeys(s,d.addedDocuments,p)));let E=m.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?E=E.withResumeToken(xe.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):d.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(d.resumeToken,r)),i=i.insert(p,E),function(D,O,A){return D.resumeToken.approximateByteSize()===0||O.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=Fx?!0:A.addedDocuments.size+A.modifiedDocuments.size+A.removedDocuments.size>0}(m,E,d)&&a.push(t.hi.updateTargetData(s,E))});let u=xt(),c=Z();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(s,d))}),a.push(jx(s,o,e.documentUpdates).next(d=>{u=d.Ls,c=d.ks})),!r.isEqual(Q.min())){const d=t.hi.getLastRemoteSnapshotVersion(s).next(p=>t.hi.setTargetsMetadata(s,s.currentSequenceNumber,r));a.push(d)}return C.waitFor(a).next(()=>o.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,u,c)).next(()=>u)}).then(s=>(t.Fs=i,s))}function jx(n,e,t){let r=Z(),i=Z();return t.forEach(s=>r=r.add(s)),e.getEntries(n,r).next(s=>{let o=xt();return t.forEach((a,u)=>{const c=s.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(i=i.add(a)),u.isNoDocument()&&u.version.isEqual(Q.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):L(Xm,"Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)}),{Ls:o,ks:i}})}function $x(n,e){const t=H(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=mi),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function kc(n,e){const t=H(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return t.hi.getTargetData(r,e).next(s=>s?(i=s,C.resolve(i)):t.hi.allocateTargetId(r).next(o=>(i=new bn(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.hi.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=t.Fs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(r.targetId,r),t.Ms.set(e,r.targetId)),r})}async function Hs(n,e,t){const r=H(n),i=r.Fs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Wr(o))throw o;L(Xm,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Fs=r.Fs.remove(e),r.Ms.delete(i.target)}function up(n,e,t){const r=H(n);let i=Q.min(),s=Z();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,c,d){const p=H(u),m=p.Ms.get(d);return m!==void 0?C.resolve(p.Fs.get(m)):p.hi.getTargetData(c,d)}(r,o,Lt(e)).next(a=>{if(a)return i=a.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(o,a.targetId).next(u=>{s=u})}).next(()=>r.Cs.getDocumentsMatchingQuery(o,e,t?i:Q.min(),t?s:Z())).next(a=>(jS(r,K0(e),a),{documents:a,qs:s})))}function BS(n,e){const t=H(n),r=H(t.hi),i=t.Fs.get(e);return i?Promise.resolve(i.target):t.persistence.runTransaction("Get target data","readonly",s=>r.Et(s,e).next(o=>o?o.target:null))}function zS(n,e){const t=H(n),r=t.xs.get(e)||Q.min();return t.persistence.runTransaction("Get new document changes","readonly",i=>t.Os.getAllFromCollectionGroup(i,e,c0(r,xs),Number.MAX_SAFE_INTEGER)).then(i=>(jS(t,e,i),i))}function jS(n,e,t){let r=n.xs.get(e)||Q.min();t.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),n.xs.set(e,r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $S="firestore_clients";function gI(n,e){return`${$S}_${n}_${e}`}const qS="firestore_mutations";function yI(n,e,t){let r=`${qS}_${n}_${t}`;return e.isAuthenticated()&&(r+=`_${e.uid}`),r}const WS="firestore_targets";function Ud(n,e){return`${WS}_${n}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn="SharedClientState";class Vc{constructor(e,t,r,i){this.user=e,this.batchId=t,this.state=r,this.error=i}static Ks(e,t,r){const i=JSON.parse(r);let s,o=typeof i=="object"&&["pending","acknowledged","rejected"].indexOf(i.state)!==-1&&(i.error===void 0||typeof i.error=="object");return o&&i.error&&(o=typeof i.error.message=="string"&&typeof i.error.code=="string",o&&(s=new B(i.error.code,i.error.message))),o?new Vc(e,t,i.state,s):(Ne(cn,`Failed to parse mutation state for ID '${t}': ${r}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Ia{constructor(e,t,r){this.targetId=e,this.state=t,this.error=r}static Ks(e,t){const r=JSON.parse(t);let i,s=typeof r=="object"&&["not-current","current","rejected"].indexOf(r.state)!==-1&&(r.error===void 0||typeof r.error=="object");return s&&r.error&&(s=typeof r.error.message=="string"&&typeof r.error.code=="string",s&&(i=new B(r.error.code,r.error.message))),s?new Ia(e,r.state,i):(Ne(cn,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Dc{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ks(e,t){const r=JSON.parse(t);let i=typeof r=="object"&&r.activeTargetIds instanceof Array,s=Lm();for(let o=0;i&&o<r.activeTargetIds.length;++o)i=m0(r.activeTargetIds[o]),s=s.add(r.activeTargetIds[o]);return i?new Dc(e,s):(Ne(cn,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Ym{constructor(e,t){this.clientId=e,this.onlineState=t}static Ks(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new Ym(t.clientId,t.onlineState):(Ne(cn,`Failed to parse online state: ${e}`),null)}}class cp{constructor(){this.activeTargetIds=Lm()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Bd{constructor(e,t,r,i,s){this.window=e,this.Fi=t,this.persistenceKey=r,this.js=i,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Js=this.Hs.bind(this),this.Ys=new me(X),this.started=!1,this.Zs=[];const o=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=s,this.Xs=gI(this.persistenceKey,this.js),this.eo=function(u){return`firestore_sequence_number_${u}`}(this.persistenceKey),this.Ys=this.Ys.insert(this.js,new cp),this.no=new RegExp(`^${$S}_${o}_([^_]*)$`),this.ro=new RegExp(`^${qS}_${o}_(\\d+)(?:_(.*))?$`),this.io=new RegExp(`^${WS}_${o}_(\\d+)$`),this.so=function(u){return`firestore_online_state_${u}`}(this.persistenceKey),this.oo=function(u){return`firestore_bundle_loaded_v2_${u}`}(this.persistenceKey),this.window.addEventListener("storage",this.Js)}static C(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ps();for(const r of e){if(r===this.js)continue;const i=this.getItem(gI(this.persistenceKey,r));if(i){const s=Dc.Ks(r,i);s&&(this.Ys=this.Ys.insert(s.clientId,s))}}this._o();const t=this.storage.getItem(this.so);if(t){const r=this.ao(t);r&&this.uo(r)}for(const r of this.Zs)this.Hs(r);this.Zs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.eo,JSON.stringify(e))}getAllActiveQueryTargets(){return this.co(this.Ys)}isActiveQueryTarget(e){let t=!1;return this.Ys.forEach((r,i)=>{i.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.lo(e,"pending")}updateMutationState(e,t,r){this.lo(e,t,r),this.ho(e)}addLocalQueryTarget(e,t=!0){let r="not-current";if(this.isActiveQueryTarget(e)){const i=this.storage.getItem(Ud(this.persistenceKey,e));if(i){const s=Ia.Ks(e,i);s&&(r=s.state)}}return t&&this.Po.Gs(e),this._o(),r}removeLocalQueryTarget(e){this.Po.zs(e),this._o()}isLocalQueryTarget(e){return this.Po.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Ud(this.persistenceKey,e))}updateQueryState(e,t,r){this.To(e,t,r)}handleUserChange(e,t,r){t.forEach(i=>{this.ho(i)}),this.currentUser=e,r.forEach(i=>{this.addPendingMutation(i)})}setOnlineState(e){this.Io(e)}notifyBundleLoaded(e){this.Eo(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Js),this.removeItem(this.Xs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return L(cn,"READ",e,t),t}setItem(e,t){L(cn,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){L(cn,"REMOVE",e),this.storage.removeItem(e)}Hs(e){const t=e;if(t.storageArea===this.storage){if(L(cn,"EVENT",t.key,t.newValue),t.key===this.Xs)return void Ne("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Fi.enqueueRetryable(async()=>{if(this.started){if(t.key!==null){if(this.no.test(t.key)){if(t.newValue==null){const r=this.Ao(t.key);return this.Ro(r,null)}{const r=this.Vo(t.key,t.newValue);if(r)return this.Ro(r.clientId,r)}}else if(this.ro.test(t.key)){if(t.newValue!==null){const r=this.mo(t.key,t.newValue);if(r)return this.fo(r)}}else if(this.io.test(t.key)){if(t.newValue!==null){const r=this.po(t.key,t.newValue);if(r)return this.yo(r)}}else if(t.key===this.so){if(t.newValue!==null){const r=this.ao(t.newValue);if(r)return this.uo(r)}}else if(t.key===this.eo){const r=function(s){let o=Tt.ue;if(s!=null)try{const a=JSON.parse(s);G(typeof a=="number",30636,{wo:s}),o=a}catch(a){Ne(cn,"Failed to read sequence number from WebStorage",a)}return o}(t.newValue);r!==Tt.ue&&this.sequenceNumberHandler(r)}else if(t.key===this.oo){const r=this.So(t.newValue);await Promise.all(r.map(i=>this.syncEngine.bo(i)))}}}else this.Zs.push(t)})}}get Po(){return this.Ys.get(this.js)}_o(){this.setItem(this.Xs,this.Po.Ws())}lo(e,t,r){const i=new Vc(this.currentUser,e,t,r),s=yI(this.persistenceKey,this.currentUser,e);this.setItem(s,i.Ws())}ho(e){const t=yI(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Io(e){const t={clientId:this.js,onlineState:e};this.storage.setItem(this.so,JSON.stringify(t))}To(e,t,r){const i=Ud(this.persistenceKey,e),s=new Ia(e,t,r);this.setItem(i,s.Ws())}Eo(e){const t=JSON.stringify(Array.from(e));this.setItem(this.oo,t)}Ao(e){const t=this.no.exec(e);return t?t[1]:null}Vo(e,t){const r=this.Ao(e);return Dc.Ks(r,t)}mo(e,t){const r=this.ro.exec(e),i=Number(r[1]),s=r[2]!==void 0?r[2]:null;return Vc.Ks(new ot(s),i,t)}po(e,t){const r=this.io.exec(e),i=Number(r[1]);return Ia.Ks(i,t)}ao(e){return Ym.Ks(e)}So(e){return JSON.parse(e)}async fo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Do(e.batchId,e.state,e.error);L(cn,`Ignoring mutation for non-active user ${e.user.uid}`)}yo(e){return this.syncEngine.vo(e.targetId,e.state,e.error)}Ro(e,t){const r=t?this.Ys.insert(e,t):this.Ys.remove(e),i=this.co(this.Ys),s=this.co(r),o=[],a=[];return s.forEach(u=>{i.has(u)||o.push(u)}),i.forEach(u=>{s.has(u)||a.push(u)}),this.syncEngine.Co(o,a).then(()=>{this.Ys=r})}uo(e){this.Ys.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}co(e){let t=Lm();return e.forEach((r,i)=>{t=t.unionWith(i.activeTargetIds)}),t}}class KS{constructor(){this.Fo=new cp,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,r){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new cp,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qx{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _I="ConnectivityMonitor";class vI{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){L(_I,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){L(_I,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lu=null;function hp(){return lu===null?lu=function(){return 268435456+Math.round(2147483648*Math.random())}():lu++,"0x"+lu.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zd="RestConnection",Wx={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Kx{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.Ko=this.databaseId.database===vc?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,t,r,i,s){const o=hp(),a=this.Go(e,t.toUriEncodedString());L(zd,`Sending RPC '${e}' ${o}:`,a,r);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(u,i,s);const{host:c}=new URL(a),d=eo(c);return this.jo(e,a,u,r,d).then(p=>(L(zd,`Received RPC '${e}' ${o}: `,p),p),p=>{throw Lr(zd,`RPC '${e}' ${o} failed with error: `,p,"url: ",a,"request:",r),p})}Jo(e,t,r,i,s,o){return this.Wo(e,t,r,i,s)}zo(e,t,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+so}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}Go(e,t){const r=Wx[e];return`${this.$o}/v1/${t}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hx{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st="WebChannelConnection";class Gx extends Kx{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,r,i,s){const o=hp();return new Promise((a,u)=>{const c=new e0;c.setWithCredentials(!0),c.listenOnce(t0.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Pu.NO_ERROR:const p=c.getResponseJson();L(st,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(p)),a(p);break;case Pu.TIMEOUT:L(st,`RPC '${e}' ${o} timed out`),u(new B(b.DEADLINE_EXCEEDED,"Request time out"));break;case Pu.HTTP_ERROR:const m=c.getStatus();if(L(st,`RPC '${e}' ${o} failed with status:`,m,"response text:",c.getResponseText()),m>0){let E=c.getResponseJson();Array.isArray(E)&&(E=E[0]);const R=E==null?void 0:E.error;if(R&&R.status&&R.message){const D=function(A){const _=A.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(_)>=0?_:b.UNKNOWN}(R.status);u(new B(D,R.message))}else u(new B(b.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new B(b.UNAVAILABLE,"Connection failed."));break;default:K(9055,{c_:e,streamId:o,l_:c.getLastErrorCode(),h_:c.getLastError()})}}finally{L(st,`RPC '${e}' ${o} completed.`)}});const d=JSON.stringify(i);L(st,`RPC '${e}' ${o} sending request:`,i),c.send(t,"POST",d,r,15)})}P_(e,t,r){const i=hp(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=i0(),a=r0(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.zo(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;const d=s.join("");L(st,`Creating RPC '${e}' stream ${i}: ${d}`,u);const p=o.createWebChannel(d,u);this.T_(p);let m=!1,E=!1;const R=new Hx({Ho:O=>{E?L(st,`Not sending because RPC '${e}' stream ${i} is closed:`,O):(m||(L(st,`Opening RPC '${e}' stream ${i} transport.`),p.open(),m=!0),L(st,`RPC '${e}' stream ${i} sending:`,O),p.send(O))},Yo:()=>p.close()}),D=(O,A,_)=>{O.listen(A,w=>{try{_(w)}catch(x){setTimeout(()=>{throw x},0)}})};return D(p,Ho.EventType.OPEN,()=>{E||(L(st,`RPC '${e}' stream ${i} transport opened.`),R.s_())}),D(p,Ho.EventType.CLOSE,()=>{E||(E=!0,L(st,`RPC '${e}' stream ${i} transport closed`),R.__(),this.I_(p))}),D(p,Ho.EventType.ERROR,O=>{E||(E=!0,Lr(st,`RPC '${e}' stream ${i} transport errored. Name:`,O.name,"Message:",O.message),R.__(new B(b.UNAVAILABLE,"The operation could not be completed")))}),D(p,Ho.EventType.MESSAGE,O=>{var A;if(!E){const _=O.data[0];G(!!_,16349);const w=_,x=(w==null?void 0:w.error)||((A=w[0])===null||A===void 0?void 0:A.error);if(x){L(st,`RPC '${e}' stream ${i} received error:`,x);const F=x.status;let M=function(I){const T=be[I];if(T!==void 0)return oS(T)}(F),v=x.message;M===void 0&&(M=b.INTERNAL,v="Unknown error status: "+F+" with message "+x.message),E=!0,R.__(new B(M,v)),p.close()}else L(st,`RPC '${e}' stream ${i} received:`,_),R.a_(_)}}),D(a,n0.STAT_EVENT,O=>{O.stat===$f.PROXY?L(st,`RPC '${e}' stream ${i} detected buffering proxy`):O.stat===$f.NOPROXY&&L(st,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{R.o_()},0),R}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(t=>t===e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function HS(){return typeof window<"u"?window:null}function Lu(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wh(n){return new ex(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GS{constructor(e,t,r=1e3,i=1.5,s=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=i,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),i=Math.max(0,t-r);i>0&&L("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const II="PersistentStream";class QS{constructor(e,t,r,i,s,o,a,u){this.Fi=e,this.w_=r,this.S_=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new GS(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===b.RESOURCE_EXHAUSTED?(Ne(t.toString()),Ne("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.b_===t&&this.W_(r,i)},r=>{e(()=>{const i=new B(b.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(i)})})}W_(e,t){const r=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo(()=>{r(()=>this.listener.Zo())}),this.stream.e_(()=>{r(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(i=>{r(()=>this.G_(i))}),this.stream.onMessage(i=>{r(()=>++this.C_==1?this.j_(i):this.onNext(i))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(e){return L(II,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget(()=>this.b_===e?t():(L(II,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Qx extends QS{constructor(e,t,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,i,o),this.serializer=s}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=rx(this.serializer,e),r=function(s){if(!("targetChange"in s))return Q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Q.min():o.readTime?_t(o.readTime):Q.min()}(e);return this.listener.J_(t,r)}H_(e){const t={};t.database=ip(this.serializer),t.addTarget=function(s,o){let a;const u=o.target;if(a=Ic(u)?{documents:pS(s,u)}:{query:mS(s,u).Vt},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=uS(s,o.resumeToken);const c=np(s,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(Q.min())>0){a.readTime=Ks(s,o.snapshotVersion.toTimestamp());const c=np(s,o.expectedCount);c!==null&&(a.expectedCount=c)}return a}(this.serializer,e);const r=sx(this.serializer,e);r&&(t.labels=r),this.k_(t)}Y_(e){const t={};t.database=ip(this.serializer),t.removeTarget=e,this.k_(t)}}class Xx extends QS{constructor(e,t,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,o),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return G(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,G(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){G(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=ix(e.writeResults,e.commitTime),r=_t(e.commitTime);return this.listener.ta(r,t)}na(){const e={};e.database=ip(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Sc(this.serializer,r))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yx{}class Jx extends Yx{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new B(b.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,r,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Wo(e,rp(t,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new B(b.UNKNOWN,s.toString())})}Jo(e,t,r,i,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Jo(e,rp(t,r),i,o,a,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new B(b.UNKNOWN,o.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class Zx{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Ne(t),this._a=!1):L("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bi="RemoteStore";class eb{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo(o=>{r.enqueueAndForget(async()=>{Fi(this)&&(L(bi,"Restarting streams for network reachability change."),await async function(u){const c=H(u);c.Ia.add(4),await yl(c),c.Aa.set("Unknown"),c.Ia.delete(4),await Th(c)}(this))})}),this.Aa=new Zx(r,i)}}async function Th(n){if(Fi(n))for(const e of n.da)await e(!0)}async function yl(n){for(const e of n.da)await e(!1)}function Sh(n,e){const t=H(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),eg(t)?Zm(t):uo(t).x_()&&Jm(t,e))}function Gs(n,e){const t=H(n),r=uo(t);t.Ta.delete(e),r.x_()&&XS(t,e),t.Ta.size===0&&(r.x_()?r.B_():Fi(t)&&t.Aa.set("Unknown"))}function Jm(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Q.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}uo(n).H_(e)}function XS(n,e){n.Ra.$e(e),uo(n).Y_(e)}function Zm(n){n.Ra=new XN({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),uo(n).start(),n.Aa.aa()}function eg(n){return Fi(n)&&!uo(n).M_()&&n.Ta.size>0}function Fi(n){return H(n).Ia.size===0}function YS(n){n.Ra=void 0}async function tb(n){n.Aa.set("Online")}async function nb(n){n.Ta.forEach((e,t)=>{Jm(n,e)})}async function rb(n,e){YS(n),eg(n)?(n.Aa.la(e),Zm(n)):n.Aa.set("Unknown")}async function ib(n,e,t){if(n.Aa.set("Online"),e instanceof lS&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const a of s.targetIds)i.Ta.has(a)&&(await i.remoteSyncer.rejectListen(a,o),i.Ta.delete(a),i.Ra.removeTarget(a))}(n,e)}catch(r){L(bi,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Nc(n,r)}else if(e instanceof bu?n.Ra.Ye(e):e instanceof aS?n.Ra.it(e):n.Ra.et(e),!t.isEqual(Q.min()))try{const r=await US(n.localStore);t.compareTo(r)>=0&&await function(s,o){const a=s.Ra.Pt(o);return a.targetChanges.forEach((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const d=s.Ta.get(c);d&&s.Ta.set(c,d.withResumeToken(u.resumeToken,o))}}),a.targetMismatches.forEach((u,c)=>{const d=s.Ta.get(u);if(!d)return;s.Ta.set(u,d.withResumeToken(xe.EMPTY_BYTE_STRING,d.snapshotVersion)),XS(s,u);const p=new bn(d.target,u,c,d.sequenceNumber);Jm(s,p)}),s.remoteSyncer.applyRemoteEvent(a)}(n,t)}catch(r){L(bi,"Failed to raise snapshot:",r),await Nc(n,r)}}async function Nc(n,e,t){if(!Wr(e))throw e;n.Ia.add(1),await yl(n),n.Aa.set("Offline"),t||(t=()=>US(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{L(bi,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await Th(n)})}function JS(n,e){return e().catch(t=>Nc(n,t,e))}async function lo(n){const e=H(n),t=Ur(e);let r=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:mi;for(;sb(e);)try{const i=await $x(e.localStore,r);if(i===null){e.Pa.length===0&&t.B_();break}r=i.batchId,ob(e,i)}catch(i){await Nc(e,i)}ZS(e)&&eA(e)}function sb(n){return Fi(n)&&n.Pa.length<10}function ob(n,e){n.Pa.push(e);const t=Ur(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function ZS(n){return Fi(n)&&!Ur(n).M_()&&n.Pa.length>0}function eA(n){Ur(n).start()}async function ab(n){Ur(n).na()}async function lb(n){const e=Ur(n);for(const t of n.Pa)e.X_(t.mutations)}async function ub(n,e,t){const r=n.Pa.shift(),i=Bm.from(r,e,t);await JS(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await lo(n)}async function cb(n,e){e&&Ur(n).Z_&&await async function(r,i){if(function(o){return GN(o)&&o!==b.ABORTED}(i.code)){const s=r.Pa.shift();Ur(r).N_(),await JS(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await lo(r)}}(n,e),ZS(n)&&eA(n)}async function EI(n,e){const t=H(n);t.asyncQueue.verifyOperationInProgress(),L(bi,"RemoteStore received new credentials");const r=Fi(t);t.Ia.add(3),await yl(t),r&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Th(t)}async function dp(n,e){const t=H(n);e?(t.Ia.delete(2),await Th(t)):e||(t.Ia.add(2),await yl(t),t.Aa.set("Unknown"))}function uo(n){return n.Va||(n.Va=function(t,r,i){const s=H(t);return s.ia(),new Qx(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Zo:tb.bind(null,n),e_:nb.bind(null,n),n_:rb.bind(null,n),J_:ib.bind(null,n)}),n.da.push(async e=>{e?(n.Va.N_(),eg(n)?Zm(n):n.Aa.set("Unknown")):(await n.Va.stop(),YS(n))})),n.Va}function Ur(n){return n.ma||(n.ma=function(t,r,i){const s=H(t);return s.ia(),new Xx(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:ab.bind(null,n),n_:cb.bind(null,n),ea:lb.bind(null,n),ta:ub.bind(null,n)}),n.da.push(async e=>{e?(n.ma.N_(),await lo(n)):(await n.ma.stop(),n.Pa.length>0&&(L(bi,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))})),n.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new gn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const o=Date.now()+r,a=new tg(e,t,o,i,s);return a.start(r),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new B(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ng(n,e){if(Ne("AsyncQueue",`${e}: ${n}`),Wr(n))return new B(b.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{static emptySet(e){return new Ts(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||$.comparator(t.key,r.key):(t,r)=>$.comparator(t.key,r.key),this.keyedMap=Go(),this.sortedSet=new me(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ts)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Ts;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wI{constructor(){this.fa=new me($.comparator)}track(e){const t=e.doc.key,r=this.fa.get(t);r?e.type!==0&&r.type===3?this.fa=this.fa.insert(t,e):e.type===3&&r.type!==1?this.fa=this.fa.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.fa=this.fa.remove(t):e.type===1&&r.type===2?this.fa=this.fa.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):K(63341,{At:e,ga:r}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal((t,r)=>{e.push(r)}),e}}class Qs{constructor(e,t,r,i,s,o,a,u,c){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,r,i,s){const o=[];return t.forEach(a=>{o.push({type:0,doc:a})}),new Qs(e,t,Ts.emptySet(t),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&mh(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==r[i].type||!t[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hb{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(e=>e.ba())}}class db{constructor(){this.queries=TI(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,r){const i=H(t),s=i.queries;i.queries=TI(),s.forEach((o,a)=>{for(const u of a.wa)u.onError(r)})})(this,new B(b.ABORTED,"Firestore shutting down"))}}function TI(){return new Qn(n=>W0(n),mh)}async function rg(n,e){const t=H(n);let r=3;const i=e.query;let s=t.queries.get(i);s?!s.Sa()&&e.ba()&&(r=2):(s=new hb,r=e.ba()?0:1);try{switch(r){case 0:s.ya=await t.onListen(i,!0);break;case 1:s.ya=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const a=ng(o,`Initialization of query '${Yi(e.query)}' failed`);return void e.onError(a)}t.queries.set(i,s),s.wa.push(e),e.va(t.onlineState),s.ya&&e.Ca(s.ya)&&sg(t)}async function ig(n,e){const t=H(n),r=e.query;let i=3;const s=t.queries.get(r);if(s){const o=s.wa.indexOf(e);o>=0&&(s.wa.splice(o,1),s.wa.length===0?i=e.ba()?0:1:!s.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function fb(n,e){const t=H(n);let r=!1;for(const i of e){const s=i.query,o=t.queries.get(s);if(o){for(const a of o.wa)a.Ca(i)&&(r=!0);o.ya=i}}r&&sg(t)}function pb(n,e,t){const r=H(n),i=r.queries.get(e);if(i)for(const s of i.wa)s.onError(t);r.queries.delete(e)}function sg(n){n.Da.forEach(e=>{e.next()})}var fp,SI;(SI=fp||(fp={})).Fa="default",SI.Cache="cache";class og{constructor(e,t,r){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=r||{}}Ca(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Qs(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const r=t!=="Offline";return(!this.options.ka||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Qs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==fp.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tA{constructor(e){this.key=e}}class nA{constructor(e){this.key=e}}class mb{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Z(),this.mutatedKeys=Z(),this.Xa=H0(e),this.eu=new Ts(this.Xa)}get tu(){return this.Ha}nu(e,t){const r=t?t.ru:new wI,i=t?t.eu:this.eu;let s=t?t.mutatedKeys:this.mutatedKeys,o=i,a=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,c=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,p)=>{const m=i.get(d),E=pl(this.query,p)?p:null,R=!!m&&this.mutatedKeys.has(m.key),D=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let O=!1;m&&E?m.data.isEqual(E.data)?R!==D&&(r.track({type:3,doc:E}),O=!0):this.iu(m,E)||(r.track({type:2,doc:E}),O=!0,(u&&this.Xa(E,u)>0||c&&this.Xa(E,c)<0)&&(a=!0)):!m&&E?(r.track({type:0,doc:E}),O=!0):m&&!E&&(r.track({type:1,doc:m}),O=!0,(u||c)&&(a=!0)),O&&(E?(o=o.add(E),s=D?s.add(d):s.delete(d)):(o=o.delete(d),s=s.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),s=s.delete(d.key),r.track({type:1,doc:d})}return{eu:o,ru:r,Ds:a,mutatedKeys:s}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,i){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const o=e.ru.pa();o.sort((d,p)=>function(E,R){const D=O=>{switch(O){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return K(20277,{At:O})}};return D(E)-D(R)}(d.type,p.type)||this.Xa(d.doc,p.doc)),this.su(r),i=i!=null&&i;const a=t&&!i?this.ou():[],u=this.Za.size===0&&this.current&&!i?1:0,c=u!==this.Ya;return this.Ya=u,o.length!==0||c?{snapshot:new Qs(this.query,e.eu,s,o,e.mutatedKeys,u===0,c,!1,!!r&&r.resumeToken.approximateByteSize()>0),_u:a}:{_u:a}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new wI,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach(t=>this.Ha=this.Ha.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ha=this.Ha.delete(t)),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Z(),this.eu.forEach(r=>{this.au(r.key)&&(this.Za=this.Za.add(r.key))});const t=[];return e.forEach(r=>{this.Za.has(r)||t.push(new nA(r))}),this.Za.forEach(r=>{e.has(r)||t.push(new tA(r))}),t}uu(e){this.Ha=e.qs,this.Za=Z();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Qs.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const co="SyncEngine";class gb{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class yb{constructor(e){this.key=e,this.lu=!1}}class _b{constructor(e,t,r,i,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.hu={},this.Pu=new Qn(a=>W0(a),mh),this.Tu=new Map,this.Iu=new Set,this.du=new me($.comparator),this.Eu=new Map,this.Au=new Km,this.Ru={},this.Vu=new Map,this.mu=xi.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function vb(n,e,t=!0){const r=Ah(n);let i;const s=r.Pu.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await rA(r,e,t,!0),i}async function Ib(n,e){const t=Ah(n);await rA(t,e,!0,!1)}async function rA(n,e,t,r){const i=await kc(n.localStore,Lt(e)),s=i.targetId,o=n.sharedClientState.addLocalQueryTarget(s,t);let a;return r&&(a=await ag(n,e,s,o==="current",i.resumeToken)),n.isPrimaryClient&&t&&Sh(n.remoteStore,i),a}async function ag(n,e,t,r,i){n.gu=(p,m,E)=>async function(D,O,A,_){let w=O.view.nu(A);w.Ds&&(w=await up(D.localStore,O.query,!1).then(({documents:v})=>O.view.nu(v,w)));const x=_&&_.targetChanges.get(O.targetId),F=_&&_.targetMismatches.get(O.targetId)!=null,M=O.view.applyChanges(w,D.isPrimaryClient,x,F);return pp(D,O.targetId,M._u),M.snapshot}(n,p,m,E);const s=await up(n.localStore,e,!0),o=new mb(e,s.qs),a=o.nu(s.documents),u=gl.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",i),c=o.applyChanges(a,n.isPrimaryClient,u);pp(n,t,c._u);const d=new gb(e,t,o);return n.Pu.set(e,d),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),c.snapshot}async function Eb(n,e,t){const r=H(n),i=r.Pu.get(e),s=r.Tu.get(i.targetId);if(s.length>1)return r.Tu.set(i.targetId,s.filter(o=>!mh(o,e))),void r.Pu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Hs(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),t&&Gs(r.remoteStore,i.targetId),Xs(r,i.targetId)}).catch(qr)):(Xs(r,i.targetId),await Hs(r.localStore,i.targetId,!0))}async function wb(n,e){const t=H(n),r=t.Pu.get(e),i=t.Tu.get(r.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Gs(t.remoteStore,r.targetId))}async function Tb(n,e,t){const r=hg(n);try{const i=await function(o,a){const u=H(o),c=le.now(),d=a.reduce((E,R)=>E.add(R.key),Z());let p,m;return u.persistence.runTransaction("Locally write mutations","readwrite",E=>{let R=xt(),D=Z();return u.Os.getEntries(E,d).next(O=>{R=O,R.forEach((A,_)=>{_.isValidDocument()||(D=D.add(A))})}).next(()=>u.localDocuments.getOverlayedDocuments(E,R)).next(O=>{p=O;const A=[];for(const _ of a){const w=KN(_,p.get(_.key).overlayedDocument);w!=null&&A.push(new Xn(_.key,w,O0(w.value.mapValue),ct.exists(!0)))}return u.mutationQueue.addMutationBatch(E,c,A,a)}).next(O=>{m=O;const A=O.applyToLocalDocumentSet(p,D);return u.documentOverlayCache.saveOverlays(E,O.batchId,A)})}).then(()=>({batchId:m.batchId,changes:Q0(p)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,a,u){let c=o.Ru[o.currentUser.toKey()];c||(c=new me(X)),c=c.insert(a,u),o.Ru[o.currentUser.toKey()]=c}(r,i.batchId,t),await Hr(r,i.changes),await lo(r.remoteStore)}catch(i){const s=ng(i,"Failed to persist write");t.reject(s)}}async function iA(n,e){const t=H(n);try{const r=await zx(t.localStore,e);e.targetChanges.forEach((i,s)=>{const o=t.Eu.get(s);o&&(G(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?o.lu=!0:i.modifiedDocuments.size>0?G(o.lu,14607):i.removedDocuments.size>0&&(G(o.lu,42227),o.lu=!1))}),await Hr(t,r,e)}catch(r){await qr(r)}}function AI(n,e,t){const r=H(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const i=[];r.Pu.forEach((s,o)=>{const a=o.view.va(e);a.snapshot&&i.push(a.snapshot)}),function(o,a){const u=H(o);u.onlineState=a;let c=!1;u.queries.forEach((d,p)=>{for(const m of p.wa)m.va(a)&&(c=!0)}),c&&sg(u)}(r.eventManager,e),i.length&&r.hu.J_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Sb(n,e,t){const r=H(n);r.sharedClientState.updateQueryState(e,"rejected",t);const i=r.Eu.get(e),s=i&&i.key;if(s){let o=new me($.comparator);o=o.insert(s,Ce.newNoDocument(s,Q.min()));const a=Z().add(s),u=new ml(Q.min(),new Map,new me(X),o,a);await iA(r,u),r.du=r.du.remove(s),r.Eu.delete(e),cg(r)}else await Hs(r.localStore,e,!1).then(()=>Xs(r,e,t)).catch(qr)}async function Ab(n,e){const t=H(n),r=e.batch.batchId;try{const i=await Bx(t.localStore,e);ug(t,r,null),lg(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Hr(t,i)}catch(i){await qr(i)}}async function Pb(n,e,t){const r=H(n);try{const i=await function(o,a){const u=H(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let d;return u.mutationQueue.lookupMutationBatch(c,a).next(p=>(G(p!==null,37113),d=p.keys(),u.mutationQueue.removeMutationBatch(c,p))).next(()=>u.mutationQueue.performConsistencyCheck(c)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(c,d,a)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,d)).next(()=>u.localDocuments.getDocuments(c,d))})}(r.localStore,e);ug(r,e,t),lg(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Hr(r,i)}catch(i){await qr(i)}}function lg(n,e){(n.Vu.get(e)||[]).forEach(t=>{t.resolve()}),n.Vu.delete(e)}function ug(n,e,t){const r=H(n);let i=r.Ru[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.Ru[r.currentUser.toKey()]=i}}function Xs(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Tu.get(e))n.Pu.delete(r),t&&n.hu.pu(r,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach(r=>{n.Au.containsKey(r)||sA(n,r)})}function sA(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(Gs(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),cg(n))}function pp(n,e,t){for(const r of t)r instanceof tA?(n.Au.addReference(r.key,e),Rb(n,r)):r instanceof nA?(L(co,"Document no longer in limbo: "+r.key),n.Au.removeReference(r.key,e),n.Au.containsKey(r.key)||sA(n,r.key)):K(19791,{yu:r})}function Rb(n,e){const t=e.key,r=t.path.canonicalString();n.du.get(t)||n.Iu.has(r)||(L(co,"New document in limbo: "+t),n.Iu.add(r),cg(n))}function cg(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new $(ae.fromString(e)),r=n.mu.next();n.Eu.set(r,new yb(t)),n.du=n.du.insert(t,r),Sh(n.remoteStore,new bn(Lt(fl(t.path)),r,"TargetPurposeLimboResolution",Tt.ue))}}async function Hr(n,e,t){const r=H(n),i=[],s=[],o=[];r.Pu.isEmpty()||(r.Pu.forEach((a,u)=>{o.push(r.gu(u,e,t).then(c=>{var d;if((c||t)&&r.isPrimaryClient){const p=c?!c.fromCache:(d=t==null?void 0:t.targetChanges.get(u.targetId))===null||d===void 0?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(c){i.push(c);const p=Qm.Es(u.targetId,c);s.push(p)}}))}),await Promise.all(o),r.hu.J_(i),await async function(u,c){const d=H(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>C.forEach(c,m=>C.forEach(m.Is,E=>d.persistence.referenceDelegate.addReference(p,m.targetId,E)).next(()=>C.forEach(m.ds,E=>d.persistence.referenceDelegate.removeReference(p,m.targetId,E)))))}catch(p){if(!Wr(p))throw p;L(Xm,"Failed to update sequence numbers: "+p)}for(const p of c){const m=p.targetId;if(!p.fromCache){const E=d.Fs.get(m),R=E.snapshotVersion,D=E.withLastLimboFreeSnapshotVersion(R);d.Fs=d.Fs.insert(m,D)}}}(r.localStore,s))}async function Cb(n,e){const t=H(n);if(!t.currentUser.isEqual(e)){L(co,"User change. New user:",e.toKey());const r=await FS(t.localStore,e);t.currentUser=e,function(s,o){s.Vu.forEach(a=>{a.forEach(u=>{u.reject(new B(b.CANCELLED,o))})}),s.Vu.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Hr(t,r.Bs)}}function kb(n,e){const t=H(n),r=t.Eu.get(e);if(r&&r.lu)return Z().add(r.key);{let i=Z();const s=t.Tu.get(e);if(!s)return i;for(const o of s){const a=t.Pu.get(o);i=i.unionWith(a.view.tu)}return i}}async function Vb(n,e){const t=H(n),r=await up(t.localStore,e.query,!0),i=e.view.uu(r);return t.isPrimaryClient&&pp(t,e.targetId,i._u),i}async function Db(n,e){const t=H(n);return zS(t.localStore,e).then(r=>Hr(t,r))}async function Nb(n,e,t,r){const i=H(n),s=await function(a,u){const c=H(a),d=H(c.mutationQueue);return c.persistence.runTransaction("Lookup mutation documents","readonly",p=>d.Xn(p,u).next(m=>m?c.localDocuments.getDocuments(p,m):C.resolve(null)))}(i.localStore,e);s!==null?(t==="pending"?await lo(i.remoteStore):t==="acknowledged"||t==="rejected"?(ug(i,e,r||null),lg(i,e),function(a,u){H(H(a).mutationQueue).rr(u)}(i.localStore,e)):K(6720,"Unknown batchState",{wu:t}),await Hr(i,s)):L(co,"Cannot apply mutation batch with id: "+e)}async function xb(n,e){const t=H(n);if(Ah(t),hg(t),e===!0&&t.fu!==!0){const r=t.sharedClientState.getAllActiveQueryTargets(),i=await PI(t,r.toArray());t.fu=!0,await dp(t.remoteStore,!0);for(const s of i)Sh(t.remoteStore,s)}else if(e===!1&&t.fu!==!1){const r=[];let i=Promise.resolve();t.Tu.forEach((s,o)=>{t.sharedClientState.isLocalQueryTarget(o)?r.push(o):i=i.then(()=>(Xs(t,o),Hs(t.localStore,o,!0))),Gs(t.remoteStore,o)}),await i,await PI(t,r),function(o){const a=H(o);a.Eu.forEach((u,c)=>{Gs(a.remoteStore,c)}),a.Au.jr(),a.Eu=new Map,a.du=new me($.comparator)}(t),t.fu=!1,await dp(t.remoteStore,!1)}}async function PI(n,e,t){const r=H(n),i=[],s=[];for(const o of e){let a;const u=r.Tu.get(o);if(u&&u.length!==0){a=await kc(r.localStore,Lt(u[0]));for(const c of u){const d=r.Pu.get(c),p=await Vb(r,d);p.snapshot&&s.push(p.snapshot)}}else{const c=await BS(r.localStore,o);a=await kc(r.localStore,c),await ag(r,oA(c),o,!1,a.resumeToken)}i.push(a)}return r.hu.J_(s),i}function oA(n){return $0(n.path,n.collectionGroup,n.orderBy,n.filters,n.limit,"F",n.startAt,n.endAt)}function bb(n){return function(t){return H(H(t).persistence).Ps()}(H(n).localStore)}async function Ob(n,e,t,r){const i=H(n);if(i.fu)return void L(co,"Ignoring unexpected query state notification.");const s=i.Tu.get(e);if(s&&s.length>0)switch(t){case"current":case"not-current":{const o=await zS(i.localStore,K0(s[0])),a=ml.createSynthesizedRemoteEventForCurrentChange(e,t==="current",xe.EMPTY_BYTE_STRING);await Hr(i,o,a);break}case"rejected":await Hs(i.localStore,e,!0),Xs(i,e,r);break;default:K(64155,t)}}async function Lb(n,e,t){const r=Ah(n);if(r.fu){for(const i of e){if(r.Tu.has(i)&&r.sharedClientState.isActiveQueryTarget(i)){L(co,"Adding an already active target "+i);continue}const s=await BS(r.localStore,i),o=await kc(r.localStore,s);await ag(r,oA(s),o.targetId,!1,o.resumeToken),Sh(r.remoteStore,o)}for(const i of t)r.Tu.has(i)&&await Hs(r.localStore,i,!1).then(()=>{Gs(r.remoteStore,i),Xs(r,i)}).catch(qr)}}function Ah(n){const e=H(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=iA.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=kb.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Sb.bind(null,e),e.hu.J_=fb.bind(null,e.eventManager),e.hu.pu=pb.bind(null,e.eventManager),e}function hg(n){const e=H(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Ab.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Pb.bind(null,e),e}class Ja{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=wh(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return MS(this.persistence,new LS,e.initialUser,this.serializer)}Du(e){return new Hm(Eh.Vi,this.serializer)}bu(e){return new KS}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ja.provider={build:()=>new Ja};class Mb extends Ja{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){G(this.persistence.referenceDelegate instanceof Cc,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new VS(r,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?at.withCacheSize(this.cacheSizeBytes):at.DEFAULT;return new Hm(r=>Cc.Vi(r,t),this.serializer)}}class aA extends Ja{constructor(e,t,r){super(),this.Mu=e,this.cacheSizeBytes=t,this.forceOwnership=r,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Mu.initialize(this,e),await hg(this.Mu.syncEngine),await lo(this.Mu.remoteStore),await this.persistence.ji(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){return MS(this.persistence,new LS,e.initialUser,this.serializer)}Cu(e,t){const r=this.persistence.referenceDelegate.garbageCollector;return new VS(r,e.asyncQueue,t)}Fu(e,t){const r=new XD(t,this.persistence);return new QD(e.asyncQueue,r)}Du(e){const t=OS(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),r=this.cacheSizeBytes!==void 0?at.withCacheSize(this.cacheSizeBytes):at.DEFAULT;return new Gm(this.synchronizeTabs,t,e.clientId,r,e.asyncQueue,HS(),Lu(),this.serializer,this.sharedClientState,!!this.forceOwnership)}bu(e){return new KS}}class Fb extends aA{constructor(e,t){super(e,t,!1),this.Mu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Mu.syncEngine;this.sharedClientState instanceof Bd&&(this.sharedClientState.syncEngine={Do:Nb.bind(null,t),vo:Ob.bind(null,t),Co:Lb.bind(null,t),Ps:bb.bind(null,t),bo:Db.bind(null,t)},await this.sharedClientState.start()),await this.persistence.ji(async r=>{await xb(this.Mu.syncEngine,r),this.gcScheduler&&(r&&!this.gcScheduler.started?this.gcScheduler.start():r||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(r&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():r||this.indexBackfillerScheduler.stop())})}bu(e){const t=HS();if(!Bd.C(t))throw new B(b.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const r=OS(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Bd(t,e.asyncQueue,r,e.clientId,e.initialUser)}}class Za{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>AI(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Cb.bind(null,this.syncEngine),await dp(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new db}()}createDatastore(e){const t=wh(e.databaseInfo.databaseId),r=function(s){return new Gx(s)}(e.databaseInfo);return function(s,o,a,u){return new Jx(s,o,a,u)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,i,s,o,a){return new eb(r,i,s,o,a)}(this.localStore,this.datastore,e.asyncQueue,t=>AI(this.syncEngine,t,0),function(){return vI.C()?new vI:new qx}())}createSyncEngine(e,t){return function(i,s,o,a,u,c,d){const p=new _b(i,s,o,a,u,c);return d&&(p.fu=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=H(i);L(bi,"RemoteStore shutting down."),s.Ia.add(5),await yl(s),s.Ea.shutdown(),s.Aa.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Za.provider={build:()=>new Za};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dg{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Ne("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Br="FirestoreClient";class Ub{constructor(e,t,r,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=i,this.user=ot.UNAUTHENTICATED,this.clientId=Am.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{L(Br,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(L(Br,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new gn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=ng(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function jd(n,e){n.asyncQueue.verifyOperationInProgress(),L(Br,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async i=>{r.isEqual(i)||(await FS(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>{Lr("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then(()=>{L("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(i=>{Lr("Terminating Firestore due to IndexedDb database deletion failed",i)})}),n._offlineComponents=e}async function RI(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Bb(n);L(Br,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>EI(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,i)=>EI(e.remoteStore,i)),n._onlineComponents=e}async function Bb(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){L(Br,"Using user provided OfflineComponentProvider");try{await jd(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===b.FAILED_PRECONDITION||i.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Lr("Error using user provided cache. Falling back to memory cache: "+t),await jd(n,new Ja)}}else L(Br,"Using default OfflineComponentProvider"),await jd(n,new Mb(void 0));return n._offlineComponents}async function lA(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(L(Br,"Using user provided OnlineComponentProvider"),await RI(n,n._uninitializedComponentsProvider._online)):(L(Br,"Using default OnlineComponentProvider"),await RI(n,new Za))),n._onlineComponents}function zb(n){return lA(n).then(e=>e.syncEngine)}async function xc(n){const e=await lA(n),t=e.eventManager;return t.onListen=vb.bind(null,e.syncEngine),t.onUnlisten=Eb.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Ib.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=wb.bind(null,e.syncEngine),t}function jb(n,e,t={}){const r=new gn;return n.asyncQueue.enqueueAndForget(async()=>function(s,o,a,u,c){const d=new dg({next:m=>{d.Ou(),o.enqueueAndForget(()=>ig(s,p));const E=m.docs.has(a);!E&&m.fromCache?c.reject(new B(b.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&m.fromCache&&u&&u.source==="server"?c.reject(new B(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(m)},error:m=>c.reject(m)}),p=new og(fl(a.path),d,{includeMetadataChanges:!0,ka:!0});return rg(s,p)}(await xc(n),n.asyncQueue,e,t,r)),r.promise}function $b(n,e,t={}){const r=new gn;return n.asyncQueue.enqueueAndForget(async()=>function(s,o,a,u,c){const d=new dg({next:m=>{d.Ou(),o.enqueueAndForget(()=>ig(s,p)),m.fromCache&&u.source==="server"?c.reject(new B(b.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(m)},error:m=>c.reject(m)}),p=new og(a,d,{includeMetadataChanges:!0,ka:!0});return rg(s,p)}(await xc(n),n.asyncQueue,e,t,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uA(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CI=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qb="firestore.googleapis.com",kI=!0;class VI{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new B(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=qb,this.ssl=kI}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:kI;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=AS;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<kS)throw new B(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}WD("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=uA((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new B(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new B(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new B(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class fg{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new VI({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new B(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new B(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new VI(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new MD;switch(r.type){case"firstParty":return new BD(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new B(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=CI.get(t);r&&(L("ComponentProvider","Removing Datastore"),CI.delete(t),r.terminate())}(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Yn(this.firestore,e,this._query)}}class ke{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new xr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ke(this.firestore,e,this._key)}toJSON(){return{type:ke._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(cl(t,ke._jsonSchema))return new ke(e,r||null,new $(ae.fromString(t.referencePath)))}}ke._jsonSchemaVersion="firestore/documentReference/1.0",ke._jsonSchema={type:Me("string",ke._jsonSchemaVersion),referencePath:Me("string")};class xr extends Yn{constructor(e,t,r){super(e,t,fl(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ke(this.firestore,null,new $(e))}withConverter(e){return new xr(this.firestore,e,this._path)}}function WO(n,e,...t){if(n=ee(n),l0("collection","path",e),n instanceof fg){const r=ae.fromString(e,...t);return Iv(r),new xr(n,null,r)}{if(!(n instanceof ke||n instanceof xr))throw new B(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(ae.fromString(e,...t));return Iv(r),new xr(n.firestore,null,r)}}function Wb(n,e,...t){if(n=ee(n),arguments.length===1&&(e=Am.newId()),l0("doc","path",e),n instanceof fg){const r=ae.fromString(e,...t);return vv(r),new ke(n,null,new $(r))}{if(!(n instanceof ke||n instanceof xr))throw new B(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(ae.fromString(e,...t));return vv(r),new ke(n.firestore,n instanceof xr?n.converter:null,new $(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DI="AsyncQueue";class NI{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new GS(this,"async_queue_retry"),this.oc=()=>{const r=Lu();r&&L(DI,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const t=Lu();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Lu();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const t=new gn;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Wr(e))throw e;L(DI,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const t=this._c.then(()=>(this.nc=!0,e().catch(r=>{throw this.tc=r,this.nc=!1,Ne("INTERNAL UNHANDLED ERROR: ",xI(r)),r}).then(r=>(this.nc=!1,r))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const i=tg.createAndSchedule(this,e,t,r,s=>this.lc(s));return this.ec.push(i),i}ac(){this.tc&&K(47125,{hc:xI(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function xI(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bI(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(n,["next","error","complete"])}class Wn extends fg{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new NI,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new NI(e),this._firestoreClient=void 0,await e}}}function KO(n,e,t){t||(t=vc);const r=dm(n,"firestore");if(r.isInitialized(t)){const i=r.getImmediate({identifier:t}),s=r.getOptions(t);if(Ai(s,e))return i;throw new B(b.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new B(b.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<kS)throw new B(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&eo(e.host)&&tT(e.host),r.initialize({options:e,instanceIdentifier:t})}function Ph(n){if(n._terminated)throw new B(b.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Kb(n),n._firestoreClient}function Kb(n){var e,t,r;const i=n._freezeSettings(),s=function(a,u,c,d){return new SN(a,u,c,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,uA(d.experimentalLongPollingOptions),d.useFetchStreams,d.isUsingEmulator)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new Ub(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&function(a){const u=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(u),_online:u}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new qt(xe.fromBase64String(e))}catch(t){throw new B(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new qt(xe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:qt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(cl(e,qt._jsonSchema))return qt.fromBase64String(e.bytes)}}qt._jsonSchemaVersion="firestore/bytes/1.0",qt._jsonSchema={type:Me("string",qt._jsonSchemaVersion),bytes:Me("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rh{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new B(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Te(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new B(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new B(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return X(this._lat,e._lat)||X(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:yn._jsonSchemaVersion}}static fromJSON(e){if(cl(e,yn._jsonSchema))return new yn(e.latitude,e.longitude)}}yn._jsonSchemaVersion="firestore/geoPoint/1.0",yn._jsonSchema={type:Me("string",yn._jsonSchemaVersion),latitude:Me("number"),longitude:Me("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:_n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(cl(e,_n._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new _n(e.vectorValues);throw new B(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}_n._jsonSchemaVersion="firestore/vectorValue/1.0",_n._jsonSchema={type:Me("string",_n._jsonSchemaVersion),vectorValues:Me("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hb=/^__.*__$/;class Gb{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Xn(e,this.data,this.fieldMask,t,this.fieldTransforms):new ao(e,this.data,t,this.fieldTransforms)}}class cA{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Xn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function hA(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw K(40011,{Ec:n})}}class pg{constructor(e,t,r,i,s,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new pg(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:r,mc:!1});return i.fc(e),i}gc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:r,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return bc(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(hA(this.Ec)&&Hb.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class Qb{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||wh(e)}Dc(e,t,r,i=!1){return new pg({Ec:e,methodName:t,bc:r,path:Te.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ch(n){const e=n._freezeSettings(),t=wh(n._databaseId);return new Qb(n._databaseId,!!e.ignoreUndefinedProperties,t)}function dA(n,e,t,r,i,s={}){const o=n.Dc(s.merge||s.mergeFields?2:0,e,t,i);yg("Data must be an object, but it was:",o,r);const a=fA(r,o);let u,c;if(s.merge)u=new St(o.fieldMask),c=o.fieldTransforms;else if(s.mergeFields){const d=[];for(const p of s.mergeFields){const m=mp(e,p,t);if(!o.contains(m))throw new B(b.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);mA(d,m)||d.push(m)}u=new St(d),c=o.fieldTransforms.filter(p=>u.covers(p.field))}else u=null,c=o.fieldTransforms;return new Gb(new ut(a),u,c)}class kh extends _l{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof kh}}class mg extends _l{_toFieldTransform(e){return new Fm(e.path,new js)}isEqual(e){return e instanceof mg}}class gg extends _l{constructor(e,t){super(e),this.Cc=t}_toFieldTransform(e){const t=new Ws(e.serializer,J0(e.serializer,this.Cc));return new Fm(e.path,t)}isEqual(e){return e instanceof gg&&this.Cc===e.Cc}}function Xb(n,e,t,r){const i=n.Dc(1,e,t);yg("Data must be an object, but it was:",i,r);const s=[],o=ut.empty();Kr(r,(u,c)=>{const d=_g(e,u,t);c=ee(c);const p=i.gc(d);if(c instanceof kh)s.push(d);else{const m=vl(c,p);m!=null&&(s.push(d),o.set(d,m))}});const a=new St(s);return new cA(o,a,i.fieldTransforms)}function Yb(n,e,t,r,i,s){const o=n.Dc(1,e,t),a=[mp(e,r,t)],u=[i];if(s.length%2!=0)throw new B(b.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let m=0;m<s.length;m+=2)a.push(mp(e,s[m])),u.push(s[m+1]);const c=[],d=ut.empty();for(let m=a.length-1;m>=0;--m)if(!mA(c,a[m])){const E=a[m];let R=u[m];R=ee(R);const D=o.gc(E);if(R instanceof kh)c.push(E);else{const O=vl(R,D);O!=null&&(c.push(E),d.set(E,O))}}const p=new St(c);return new cA(d,p,o.fieldTransforms)}function Jb(n,e,t,r=!1){return vl(t,n.Dc(r?4:3,e))}function vl(n,e){if(pA(n=ee(n)))return yg("Unsupported field value:",e,n),fA(n,e);if(n instanceof _l)return function(r,i){if(!hA(i.Ec))throw i.wc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const a of r){let u=vl(a,i.yc(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(n,e)}return function(r,i){if((r=ee(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return J0(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=le.fromDate(r);return{timestampValue:Ks(i.serializer,s)}}if(r instanceof le){const s=new le(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ks(i.serializer,s)}}if(r instanceof yn)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof qt)return{bytesValue:uS(i.serializer,r._byteString)};if(r instanceof ke){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.wc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:$m(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof _n)return function(o,a){return{mapValue:{fields:{[xm]:{stringValue:bm},[Fs]:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw a.wc("VectorValues must only contain numeric values.");return Mm(a.serializer,c)})}}}}}}(r,i);throw i.wc(`Unsupported field value: ${ah(r)}`)}(n,e)}function fA(n,e){const t={};return P0(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Kr(n,(r,i)=>{const s=vl(i,e.Vc(r));s!=null&&(t[r]=s)}),{mapValue:{fields:t}}}function pA(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof le||n instanceof yn||n instanceof qt||n instanceof ke||n instanceof _l||n instanceof _n)}function yg(n,e,t){if(!pA(t)||!u0(t)){const r=ah(t);throw r==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+r)}}function mp(n,e,t){if((e=ee(e))instanceof Rh)return e._internalPath;if(typeof e=="string")return _g(n,e);throw bc("Field path arguments must be of type string or ",n,!1,void 0,t)}const Zb=new RegExp("[~\\*/\\[\\]]");function _g(n,e,t){if(e.search(Zb)>=0)throw bc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Rh(...e.split("."))._internalPath}catch{throw bc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function bc(n,e,t,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new B(b.INVALID_ARGUMENT,a+n+u)}function mA(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gA{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ke(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new eO(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(vg("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class eO extends gA{data(){return super.data()}}function vg(n,e){return typeof e=="string"?_g(n,e):e instanceof Rh?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yA(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new B(b.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ig{}class Eg extends Ig{}function HO(n,e,...t){let r=[];e instanceof Ig&&r.push(e),r=r.concat(t),function(s){const o=s.filter(u=>u instanceof Tg).length,a=s.filter(u=>u instanceof wg).length;if(o>1||o>0&&a>0)throw new B(b.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)n=i._apply(n);return n}class wg extends Eg{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new wg(e,t,r)}_apply(e){const t=this._parse(e);return _A(e._query,t),new Yn(e.firestore,e.converter,tp(e._query,t))}_parse(e){const t=Ch(e.firestore);return function(s,o,a,u,c,d,p){let m;if(c.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new B(b.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){LI(p,d);const R=[];for(const D of p)R.push(OI(u,s,D));m={arrayValue:{values:R}}}else m=OI(u,s,p)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||LI(p,d),m=Jb(a,o,p,d==="in"||d==="not-in");return re.create(c,d,m)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class Tg extends Ig{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Tg(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:ue.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,s){let o=i;const a=s.getFlattenedFilters();for(const u of a)_A(o,u),o=tp(o,u)}(e._query,t),new Yn(e.firestore,e.converter,tp(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Sg extends Eg{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Sg(e,t)}_apply(e){const t=function(i,s,o){if(i.startAt!==null)throw new B(b.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new B(b.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ya(s,o)}(e._query,this._field,this._direction);return new Yn(e.firestore,e.converter,function(i,s){const o=i.explicitOrderBy.concat([s]);return new oo(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function GO(n,e="asc"){const t=e,r=vg("orderBy",n);return Sg._create(r,t)}class Ag extends Eg{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new Ag(e,t,r)}_apply(e){return new Yn(e.firestore,e.converter,wc(e._query,this._limit,this._limitType))}}function QO(n){return KD("limit",n),Ag._create("limit",n,"F")}function OI(n,e,t){if(typeof(t=ee(t))=="string"){if(t==="")throw new B(b.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!q0(e)&&t.indexOf("/")!==-1)throw new B(b.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(ae.fromString(t));if(!$.isDocumentKey(r))throw new B(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Qa(n,new $(r))}if(t instanceof ke)return Qa(n,t._key);throw new B(b.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ah(t)}.`)}function LI(n,e){if(!Array.isArray(n)||n.length===0)throw new B(b.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function _A(n,e){const t=function(i,s){for(const o of i)for(const a of o.getFlattenedFilters())if(s.indexOf(a.op)>=0)return a.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new B(b.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new B(b.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class tO{convertValue(e,t="none"){switch(Mr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ve(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(qn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw K(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Kr(e,(i,s)=>{r[i]=this.convertValue(s,t)}),r}convertVectorValue(e){var t,r,i;const s=(i=(r=(t=e.fields)===null||t===void 0?void 0:t[Fs].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>ve(o.doubleValue));return new _n(s)}convertGeoPoint(e){return new yn(ve(e.latitude),ve(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=fh(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Ha(e));default:return null}}convertTimestamp(e){const t=$n(e);return new le(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=ae.fromString(e);G(vS(r),9688,{name:e});const i=new ki(r.get(1),r.get(3)),s=new $(r.popFirst(5));return i.isEqual(t)||Ne(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vA(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class Yo{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class _i extends gA{constructor(e,t,r,i,s,o){super(e,t,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Mu(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(vg("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new B(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=_i._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}_i._jsonSchemaVersion="firestore/documentSnapshot/1.0",_i._jsonSchema={type:Me("string",_i._jsonSchemaVersion),bundleSource:Me("string","DocumentSnapshot"),bundleName:Me("string"),bundle:Me("string")};class Mu extends _i{data(e={}){return super.data(e)}}class vi{constructor(e,t,r,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Yo(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Mu(this._firestore,this._userDataWriter,r.key,r,new Yo(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new B(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(a=>{const u=new Mu(i._firestore,i._userDataWriter,a.doc.key,a.doc,new Yo(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(a=>s||a.type!==3).map(a=>{const u=new Mu(i._firestore,i._userDataWriter,a.doc.key,a.doc,new Yo(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);let c=-1,d=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),d=o.indexOf(a.doc.key)),{type:nO(a.type),doc:u,oldIndex:c,newIndex:d}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new B(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=vi._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Am.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],i=[];return this.docs.forEach(s=>{s._document!==null&&(t.push(s._document),r.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function nO(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return K(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XO(n){n=Ot(n,ke);const e=Ot(n.firestore,Wn);return jb(Ph(e),n._key).then(t=>IA(e,n,t))}vi._jsonSchemaVersion="firestore/querySnapshot/1.0",vi._jsonSchema={type:Me("string",vi._jsonSchemaVersion),bundleSource:Me("string","QuerySnapshot"),bundleName:Me("string"),bundle:Me("string")};class Pg extends tO{constructor(e){super(),this.firestore=e}convertBytes(e){return new qt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ke(this.firestore,null,t)}}function YO(n){n=Ot(n,Yn);const e=Ot(n.firestore,Wn),t=Ph(e),r=new Pg(e);return yA(n._query),$b(t,n._query).then(i=>new vi(e,r,n,i))}function JO(n,e,t){n=Ot(n,ke);const r=Ot(n.firestore,Wn),i=vA(n.converter,e,t);return Vh(r,[dA(Ch(r),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,ct.none())])}function ZO(n,e,t,...r){n=Ot(n,ke);const i=Ot(n.firestore,Wn),s=Ch(i);let o;return o=typeof(e=ee(e))=="string"||e instanceof Rh?Yb(s,"updateDoc",n._key,e,t,r):Xb(s,"updateDoc",n._key,e),Vh(i,[o.toMutation(n._key,ct.exists(!0))])}function e2(n){return Vh(Ot(n.firestore,Wn),[new _h(n._key,ct.none())])}function t2(n,e){const t=Ot(n.firestore,Wn),r=Wb(n),i=vA(n.converter,e);return Vh(t,[dA(Ch(n.firestore),"addDoc",r._key,i,n.converter!==null,{}).toMutation(r._key,ct.exists(!1))]).then(()=>r)}function n2(n,...e){var t,r,i;n=ee(n);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||bI(e[o])||(s=e[o++]);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(bI(e[o])){const p=e[o];e[o]=(t=p.next)===null||t===void 0?void 0:t.bind(p),e[o+1]=(r=p.error)===null||r===void 0?void 0:r.bind(p),e[o+2]=(i=p.complete)===null||i===void 0?void 0:i.bind(p)}let u,c,d;if(n instanceof ke)c=Ot(n.firestore,Wn),d=fl(n._key.path),u={next:p=>{e[o]&&e[o](IA(c,n,p))},error:e[o+1],complete:e[o+2]};else{const p=Ot(n,Yn);c=Ot(p.firestore,Wn),d=p._query;const m=new Pg(c);u={next:E=>{e[o]&&e[o](new vi(c,m,p,E))},error:e[o+1],complete:e[o+2]},yA(n._query)}return function(m,E,R,D){const O=new dg(D),A=new og(E,O,R);return m.asyncQueue.enqueueAndForget(async()=>rg(await xc(m),A)),()=>{O.Ou(),m.asyncQueue.enqueueAndForget(async()=>ig(await xc(m),A))}}(Ph(c),d,a,u)}function Vh(n,e){return function(r,i){const s=new gn;return r.asyncQueue.enqueueAndForget(async()=>Tb(await zb(r),i,s)),s.promise}(Ph(n),e)}function IA(n,e,t){const r=t.docs.get(e._key),i=new Pg(n);return new _i(n,i,e._key,r,new Yo(t.hasPendingWrites,t.fromCache),e.converter)}class rO{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=oO(),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function r2(n){return new rO(n)}class iO{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Za.provider,this._offlineComponentProvider={build:t=>new aA(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class sO{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Za.provider,this._offlineComponentProvider={build:t=>new Fb(t,e==null?void 0:e.cacheSizeBytes)}}}function oO(n){return new iO(void 0)}function i2(){return new sO}function s2(){return new mg("serverTimestamp")}function o2(n){return new gg("increment",n)}(function(e,t=!0){(function(i){so=i})(no),Ds(new Pi("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),a=new Wn(new FD(r.getProvider("auth-internal")),new zD(o,r.getProvider("app-check-internal")),function(c,d){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new B(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ki(c.options.projectId,d)}(o,i),o);return s=Object.assign({useFetchStreams:t},s),a._setSettings(s),a},"PUBLIC").setMultipleInstances(!0)),kr(pv,mv,e),kr(pv,mv,"esm2017")})();export{Mi as $,HO as A,GO as B,Pi as C,WO as D,n2 as E,Hn as F,hr as G,Wb as H,YO as I,QO as J,e2 as K,JO as L,t2 as M,s2 as N,DO as O,o2 as P,XO as Q,lO as R,no as S,ZO as T,yO as U,gO as V,bO as W,TO as X,Tu as Y,EO as Z,Ds as _,uO as a,cr as a0,dr as a1,OO as a2,MO as a3,fr as a4,mk as a5,xO as a6,SO as a7,IO as a8,VO as a9,dO as aa,pO as ab,wO as ac,LO as ad,fO as ae,RO as af,CO as ag,PO as ah,zk as ai,AO as aj,BO as ak,zO as al,UO as am,uV as an,jn as ao,kO as ap,X_ as aq,bV as ar,zT as as,wV as at,kr as b,Ue as c,ee as d,dm as e,cO as f,zC as g,hO as h,eo as i,BC as j,KO as k,r2 as l,i2 as m,$O as n,jO as o,tT as p,FO as q,KI as r,Im as s,vO as t,C1 as u,_O as v,mO as w,NO as x,aO as y,JA as z};
