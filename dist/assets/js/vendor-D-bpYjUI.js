function e(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var t={exports:{}};!function(e){var t=Object.prototype.hasOwnProperty,r="~";function n(){}function a(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function i(e,t,n,i,o){if("function"!=typeof n)throw new TypeError("The listener must be a function");var f=new a(n,i||e,o),u=r?r+t:t;return e._events[u]?e._events[u].fn?e._events[u]=[e._events[u],f]:e._events[u].push(f):(e._events[u]=f,e._eventsCount++),e}function o(e,t){0==--e._eventsCount?e._events=new n:delete e._events[t]}function f(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(r=!1)),f.prototype.eventNames=function(){var e,n,a=[];if(0===this._eventsCount)return a;for(n in e=this._events)t.call(e,n)&&a.push(r?n.slice(1):n);return Object.getOwnPropertySymbols?a.concat(Object.getOwnPropertySymbols(e)):a},f.prototype.listeners=function(e){var t=r?r+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var a=0,i=n.length,o=new Array(i);a<i;a++)o[a]=n[a].fn;return o},f.prototype.listenerCount=function(e){var t=r?r+e:e,n=this._events[t];return n?n.fn?1:n.length:0},f.prototype.emit=function(e,t,n,a,i,o){var f=r?r+e:e;if(!this._events[f])return!1;var u,s,l=this._events[f],c=arguments.length;if(l.fn){switch(l.once&&this.removeListener(e,l.fn,void 0,!0),c){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,t),!0;case 3:return l.fn.call(l.context,t,n),!0;case 4:return l.fn.call(l.context,t,n,a),!0;case 5:return l.fn.call(l.context,t,n,a,i),!0;case 6:return l.fn.call(l.context,t,n,a,i,o),!0}for(s=1,u=new Array(c-1);s<c;s++)u[s-1]=arguments[s];l.fn.apply(l.context,u)}else{var h,d=l.length;for(s=0;s<d;s++)switch(l[s].once&&this.removeListener(e,l[s].fn,void 0,!0),c){case 1:l[s].fn.call(l[s].context);break;case 2:l[s].fn.call(l[s].context,t);break;case 3:l[s].fn.call(l[s].context,t,n);break;case 4:l[s].fn.call(l[s].context,t,n,a);break;default:if(!u)for(h=1,u=new Array(c-1);h<c;h++)u[h-1]=arguments[h];l[s].fn.apply(l[s].context,u)}}return!0},f.prototype.on=function(e,t,r){return i(this,e,t,r,!1)},f.prototype.once=function(e,t,r){return i(this,e,t,r,!0)},f.prototype.removeListener=function(e,t,n,a){var i=r?r+e:e;if(!this._events[i])return this;if(!t)return o(this,i),this;var f=this._events[i];if(f.fn)f.fn!==t||a&&!f.once||n&&f.context!==n||o(this,i);else{for(var u=0,s=[],l=f.length;u<l;u++)(f[u].fn!==t||a&&!f[u].once||n&&f[u].context!==n)&&s.push(f[u]);s.length?this._events[i]=1===s.length?s[0]:s:o(this,i)}return this},f.prototype.removeAllListeners=function(e){var t;return e?(t=r?r+e:e,this._events[t]&&o(this,t)):(this._events=new n,this._eventsCount=0),this},f.prototype.off=f.prototype.removeListener,f.prototype.addListener=f.prototype.on,f.prefixed=r,f.EventEmitter=f,e.exports=f}(t);const r=e(t.exports);var n={grad:.9,turn:360,rad:360/(2*Math.PI)},a=function(e){return"string"==typeof e?e.length>0:"number"==typeof e},i=function(e,t,r){return void 0===t&&(t=0),void 0===r&&(r=Math.pow(10,t)),Math.round(r*e)/r+0},o=function(e,t,r){return void 0===t&&(t=0),void 0===r&&(r=1),e>r?r:e>t?e:t},f=function(e){return(e=isFinite(e)?e%360:0)>0?e:e+360},u=function(e){return{r:o(e.r,0,255),g:o(e.g,0,255),b:o(e.b,0,255),a:o(e.a)}},s=function(e){return{r:i(e.r),g:i(e.g),b:i(e.b),a:i(e.a,3)}},l=/^#([0-9a-f]{3,8})$/i,c=function(e){var t=e.toString(16);return t.length<2?"0"+t:t},h=function(e){var t=e.r,r=e.g,n=e.b,a=e.a,i=Math.max(t,r,n),o=i-Math.min(t,r,n),f=o?i===t?(r-n)/o:i===r?2+(n-t)/o:4+(t-r)/o:0;return{h:60*(f<0?f+6:f),s:i?o/i*100:0,v:i/255*100,a:a}},d=function(e){var t=e.h,r=e.s,n=e.v,a=e.a;t=t/360*6,r/=100,n/=100;var i=Math.floor(t),o=n*(1-r),f=n*(1-(t-i)*r),u=n*(1-(1-t+i)*r),s=i%6;return{r:255*[n,f,o,o,u,n][s],g:255*[u,n,n,f,o,o][s],b:255*[o,o,u,n,n,f][s],a:a}},v=function(e){return{h:f(e.h),s:o(e.s,0,100),l:o(e.l,0,100),a:o(e.a)}},p=function(e){return{h:i(e.h),s:i(e.s),l:i(e.l),a:i(e.a,3)}},b=function(e){return d((r=(t=e).s,{h:t.h,s:(r*=((n=t.l)<50?n:100-n)/100)>0?2*r/(n+r)*100:0,v:n+r,a:t.a}));var t,r,n},x=function(e){return{h:(t=h(e)).h,s:(a=(200-(r=t.s))*(n=t.v)/100)>0&&a<200?r*n/100/(a<=100?a:200-a)*100:0,l:a/2,a:t.a};var t,r,n,a},g=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,y=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,m=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,w=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,k={string:[[function(e){var t=l.exec(e);return t?(e=t[1]).length<=4?{r:parseInt(e[0]+e[0],16),g:parseInt(e[1]+e[1],16),b:parseInt(e[2]+e[2],16),a:4===e.length?i(parseInt(e[3]+e[3],16)/255,2):1}:6===e.length||8===e.length?{r:parseInt(e.substr(0,2),16),g:parseInt(e.substr(2,2),16),b:parseInt(e.substr(4,2),16),a:8===e.length?i(parseInt(e.substr(6,2),16)/255,2):1}:null:null},"hex"],[function(e){var t=m.exec(e)||w.exec(e);return t?t[2]!==t[4]||t[4]!==t[6]?null:u({r:Number(t[1])/(t[2]?100/255:1),g:Number(t[3])/(t[4]?100/255:1),b:Number(t[5])/(t[6]?100/255:1),a:void 0===t[7]?1:Number(t[7])/(t[8]?100:1)}):null},"rgb"],[function(e){var t=g.exec(e)||y.exec(e);if(!t)return null;var r,a,i=v({h:(r=t[1],a=t[2],void 0===a&&(a="deg"),Number(r)*(n[a]||1)),s:Number(t[3]),l:Number(t[4]),a:void 0===t[5]?1:Number(t[5])/(t[6]?100:1)});return b(i)},"hsl"]],object:[[function(e){var t=e.r,r=e.g,n=e.b,i=e.a,o=void 0===i?1:i;return a(t)&&a(r)&&a(n)?u({r:Number(t),g:Number(r),b:Number(n),a:Number(o)}):null},"rgb"],[function(e){var t=e.h,r=e.s,n=e.l,i=e.a,o=void 0===i?1:i;if(!a(t)||!a(r)||!a(n))return null;var f=v({h:Number(t),s:Number(r),l:Number(n),a:Number(o)});return b(f)},"hsl"],[function(e){var t=e.h,r=e.s,n=e.v,i=e.a,u=void 0===i?1:i;if(!a(t)||!a(r)||!a(n))return null;var s=function(e){return{h:f(e.h),s:o(e.s,0,100),v:o(e.v,0,100),a:o(e.a)}}({h:Number(t),s:Number(r),v:Number(n),a:Number(u)});return d(s)},"hsv"]]},_=function(e,t){for(var r=0;r<t.length;r++){var n=t[r][0](e);if(n)return[n,t[r][1]]}return[null,void 0]},M=function(e,t){var r=x(e);return{h:r.h,s:o(r.s+100*t,0,100),l:r.l,a:r.a}},Z=function(e){return(299*e.r+587*e.g+114*e.b)/1e3/255},N=function(e,t){var r=x(e);return{h:r.h,s:r.s,l:o(r.l+100*t,0,100),a:r.a}},A=function(){function e(e){this.parsed=function(e){return"string"==typeof e?_(e.trim(),k.string):"object"==typeof e&&null!==e?_(e,k.object):[null,void 0]}(e)[0],this.rgba=this.parsed||{r:0,g:0,b:0,a:1}}return e.prototype.isValid=function(){return null!==this.parsed},e.prototype.brightness=function(){return i(Z(this.rgba),2)},e.prototype.isDark=function(){return Z(this.rgba)<.5},e.prototype.isLight=function(){return Z(this.rgba)>=.5},e.prototype.toHex=function(){return t=(e=s(this.rgba)).r,r=e.g,n=e.b,o=(a=e.a)<1?c(i(255*a)):"","#"+c(t)+c(r)+c(n)+o;var e,t,r,n,a,o},e.prototype.toRgb=function(){return s(this.rgba)},e.prototype.toRgbString=function(){return t=(e=s(this.rgba)).r,r=e.g,n=e.b,(a=e.a)<1?"rgba("+t+", "+r+", "+n+", "+a+")":"rgb("+t+", "+r+", "+n+")";var e,t,r,n,a},e.prototype.toHsl=function(){return p(x(this.rgba))},e.prototype.toHslString=function(){return t=(e=p(x(this.rgba))).h,r=e.s,n=e.l,(a=e.a)<1?"hsla("+t+", "+r+"%, "+n+"%, "+a+")":"hsl("+t+", "+r+"%, "+n+"%)";var e,t,r,n,a},e.prototype.toHsv=function(){return e=h(this.rgba),{h:i(e.h),s:i(e.s),v:i(e.v),a:i(e.a,3)};var e},e.prototype.invert=function(){return P({r:255-(e=this.rgba).r,g:255-e.g,b:255-e.b,a:e.a});var e},e.prototype.saturate=function(e){return void 0===e&&(e=.1),P(M(this.rgba,e))},e.prototype.desaturate=function(e){return void 0===e&&(e=.1),P(M(this.rgba,-e))},e.prototype.grayscale=function(){return P(M(this.rgba,-1))},e.prototype.lighten=function(e){return void 0===e&&(e=.1),P(N(this.rgba,e))},e.prototype.darken=function(e){return void 0===e&&(e=.1),P(N(this.rgba,-e))},e.prototype.rotate=function(e){return void 0===e&&(e=15),this.hue(this.hue()+e)},e.prototype.alpha=function(e){return"number"==typeof e?P({r:(t=this.rgba).r,g:t.g,b:t.b,a:e}):i(this.rgba.a,3);var t},e.prototype.hue=function(e){var t=x(this.rgba);return"number"==typeof e?P({h:e,s:t.s,l:t.l,a:t.a}):i(t.h)},e.prototype.isEqual=function(e){return this.toHex()===P(e).toHex()},e}(),P=function(e){return e instanceof A?e:new A(e)},z=[],O=function(e){e.forEach((function(e){z.indexOf(e)<0&&(e(A,k),z.push(e))}))};function q(e,t){var r={white:"#ffffff",bisque:"#ffe4c4",blue:"#0000ff",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",antiquewhite:"#faebd7",aqua:"#00ffff",azure:"#f0ffff",whitesmoke:"#f5f5f5",papayawhip:"#ffefd5",plum:"#dda0dd",blanchedalmond:"#ffebcd",black:"#000000",gold:"#ffd700",goldenrod:"#daa520",gainsboro:"#dcdcdc",cornsilk:"#fff8dc",cornflowerblue:"#6495ed",burlywood:"#deb887",aquamarine:"#7fffd4",beige:"#f5f5dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkkhaki:"#bdb76b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",peachpuff:"#ffdab9",darkmagenta:"#8b008b",darkred:"#8b0000",darkorchid:"#9932cc",darkorange:"#ff8c00",darkslateblue:"#483d8b",gray:"#808080",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",deeppink:"#ff1493",deepskyblue:"#00bfff",wheat:"#f5deb3",firebrick:"#b22222",floralwhite:"#fffaf0",ghostwhite:"#f8f8ff",darkviolet:"#9400d3",magenta:"#ff00ff",green:"#008000",dodgerblue:"#1e90ff",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",blueviolet:"#8a2be2",forestgreen:"#228b22",lawngreen:"#7cfc00",indianred:"#cd5c5c",indigo:"#4b0082",fuchsia:"#ff00ff",brown:"#a52a2a",maroon:"#800000",mediumblue:"#0000cd",lightcoral:"#f08080",darkturquoise:"#00ced1",lightcyan:"#e0ffff",ivory:"#fffff0",lightyellow:"#ffffe0",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",linen:"#faf0e6",mediumaquamarine:"#66cdaa",lemonchiffon:"#fffacd",lime:"#00ff00",khaki:"#f0e68c",mediumseagreen:"#3cb371",limegreen:"#32cd32",mediumspringgreen:"#00fa9a",lightskyblue:"#87cefa",lightblue:"#add8e6",midnightblue:"#191970",lightpink:"#ffb6c1",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",mintcream:"#f5fffa",lightslategray:"#778899",lightslategrey:"#778899",navajowhite:"#ffdead",navy:"#000080",mediumvioletred:"#c71585",powderblue:"#b0e0e6",palegoldenrod:"#eee8aa",oldlace:"#fdf5e6",paleturquoise:"#afeeee",mediumturquoise:"#48d1cc",mediumorchid:"#ba55d3",rebeccapurple:"#663399",lightsteelblue:"#b0c4de",mediumslateblue:"#7b68ee",thistle:"#d8bfd8",tan:"#d2b48c",orchid:"#da70d6",mediumpurple:"#9370db",purple:"#800080",pink:"#ffc0cb",skyblue:"#87ceeb",springgreen:"#00ff7f",palegreen:"#98fb98",red:"#ff0000",yellow:"#ffff00",slateblue:"#6a5acd",lavenderblush:"#fff0f5",peru:"#cd853f",palevioletred:"#db7093",violet:"#ee82ee",teal:"#008080",slategray:"#708090",slategrey:"#708090",aliceblue:"#f0f8ff",darkseagreen:"#8fbc8f",darkolivegreen:"#556b2f",greenyellow:"#adff2f",seagreen:"#2e8b57",seashell:"#fff5ee",tomato:"#ff6347",silver:"#c0c0c0",sienna:"#a0522d",lavender:"#e6e6fa",lightgreen:"#90ee90",orange:"#ffa500",orangered:"#ff4500",steelblue:"#4682b4",royalblue:"#4169e1",turquoise:"#40e0d0",yellowgreen:"#9acd32",salmon:"#fa8072",saddlebrown:"#8b4513",sandybrown:"#f4a460",rosybrown:"#bc8f8f",darksalmon:"#e9967a",lightgoldenrodyellow:"#fafad2",snow:"#fffafa",lightgrey:"#d3d3d3",lightgray:"#d3d3d3",dimgray:"#696969",dimgrey:"#696969",olivedrab:"#6b8e23",olive:"#808000"},n={};for(var a in r)n[r[a]]=a;var i={};e.prototype.toName=function(t){if(!(this.rgba.a||this.rgba.r||this.rgba.g||this.rgba.b))return"transparent";var a,o,f=n[this.toHex()];if(f)return f;if(null==t?void 0:t.closest){var u=this.toRgb(),s=1/0,l="black";if(!i.length)for(var c in r)i[c]=new e(r[c]).toRgb();for(var h in r){var d=(a=u,o=i[h],Math.pow(a.r-o.r,2)+Math.pow(a.g-o.g,2)+Math.pow(a.b-o.b,2));d<s&&(s=d,l=h)}return l}},t.string.push([function(t){var n=t.toLowerCase(),a="transparent"===n?"#0000":r[n];return a?new e(a).toRgb():null},"name"])}var S=/iPhone/i,j=/iPod/i,C=/iPad/i,I=/\biOS-universal(?:.+)Mac\b/i,L=/\bAndroid(?:.+)Mobile\b/i,T=/Android/i,E=/(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,H=/Silk/i,R=/Windows Phone/i,B=/\bWindows(?:.+)ARM\b/i,$=/BlackBerry/i,F=/BB10/i,D=/Opera Mini/i,W=/\b(CriOS|Chrome)(?:.+)Mobile/i,U=/Mobile(?:.+)Firefox\b/i,V=function(e){return void 0!==e&&"MacIntel"===e.platform&&"number"==typeof e.maxTouchPoints&&e.maxTouchPoints>1&&"undefined"==typeof MSStream};function G(e){var t={userAgent:"",platform:"",maxTouchPoints:0};e||"undefined"==typeof navigator?"string"==typeof e?t.userAgent=e:e&&e.userAgent&&(t={userAgent:e.userAgent,platform:e.platform,maxTouchPoints:e.maxTouchPoints||0}):t={userAgent:navigator.userAgent,platform:navigator.platform,maxTouchPoints:navigator.maxTouchPoints||0};var r=t.userAgent,n=r.split("[FBAN");void 0!==n[1]&&(r=n[0]),void 0!==(n=r.split("Twitter"))[1]&&(r=n[0]);var a=function(e){return function(t){return t.test(e)}}(r),i={apple:{phone:a(S)&&!a(R),ipod:a(j),tablet:!a(S)&&(a(C)||V(t))&&!a(R),universal:a(I),device:(a(S)||a(j)||a(C)||a(I)||V(t))&&!a(R)},amazon:{phone:a(E),tablet:!a(E)&&a(H),device:a(E)||a(H)},android:{phone:!a(R)&&a(E)||!a(R)&&a(L),tablet:!a(R)&&!a(E)&&!a(L)&&(a(H)||a(T)),device:!a(R)&&(a(E)||a(H)||a(L)||a(T))||a(/\bokhttp\b/i)},windows:{phone:a(R),tablet:a(B),device:a(R)||a(B)},other:{blackberry:a($),blackberry10:a(F),opera:a(D),firefox:a(U),chrome:a(W),device:a($)||a(F)||a(D)||a(U)||a(W)},any:!1,phone:!1,tablet:!1};return i.any=i.apple.device||i.android.device||i.windows.device||i.other.device,i.phone=i.apple.phone||i.android.phone||i.windows.phone,i.tablet=i.apple.tablet||i.android.tablet||i.windows.tablet,i}var J={exports:{}};function K(e,t,r){r=r||2;var n,a,i,o,f,u,s,l=t&&t.length,c=l?t[0]*r:e.length,h=Q(e,0,c,r,!0),d=[];if(!h||h.next===h.prev)return d;if(l&&(h=function(e,t,r,n){var a,i,o,f=[];for(a=0,i=t.length;a<i;a++)(o=Q(e,t[a]*n,a<i-1?t[a+1]*n:e.length,n,!1))===o.next&&(o.steiner=!0),f.push(ue(o));for(f.sort(ae),a=0;a<f.length;a++)r=ie(f[a],r);return r}(e,t,h,r)),e.length>80*r){n=i=e[0],a=o=e[1];for(var v=r;v<c;v+=r)(f=e[v])<n&&(n=f),(u=e[v+1])<a&&(a=u),f>i&&(i=f),u>o&&(o=u);s=0!==(s=Math.max(i-n,o-a))?32767/s:0}return Y(h,d,r,n,a,s,0),d}function Q(e,t,r,n,a){var i,o;if(a===we(e,t,r,n)>0)for(i=t;i<r;i+=n)o=ge(i,e[i],e[i+1],o);else for(i=r-n;i>=t;i-=n)o=ge(i,e[i],e[i+1],o);return o&&he(o,o.next)&&(ye(o),o=o.next),o}function X(e,t){if(!e)return e;t||(t=e);var r,n=e;do{if(r=!1,n.steiner||!he(n,n.next)&&0!==ce(n.prev,n,n.next))n=n.next;else{if(ye(n),(n=t=n.prev)===n.next)break;r=!0}}while(r||n!==t);return t}function Y(e,t,r,n,a,i,o){if(e){!o&&i&&function(e,t,r,n){var a=e;do{0===a.z&&(a.z=fe(a.x,a.y,t,r,n)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next}while(a!==e);a.prevZ.nextZ=null,a.prevZ=null,function(e){var t,r,n,a,i,o,f,u,s=1;do{for(r=e,e=null,i=null,o=0;r;){for(o++,n=r,f=0,t=0;t<s&&(f++,n=n.nextZ);t++);for(u=s;f>0||u>0&&n;)0!==f&&(0===u||!n||r.z<=n.z)?(a=r,r=r.nextZ,f--):(a=n,n=n.nextZ,u--),i?i.nextZ=a:e=a,a.prevZ=i,i=a;r=n}i.nextZ=null,s*=2}while(o>1)}(a)}(e,n,a,i);for(var f,u,s=e;e.prev!==e.next;)if(f=e.prev,u=e.next,i?te(e,n,a,i):ee(e))t.push(f.i/r|0),t.push(e.i/r|0),t.push(u.i/r|0),ye(e),e=u.next,s=u.next;else if((e=u)===s){o?1===o?Y(e=re(X(e),t,r),t,r,n,a,i,2):2===o&&ne(e,t,r,n,a,i):Y(X(e),t,r,n,a,i,1);break}}}function ee(e){var t=e.prev,r=e,n=e.next;if(ce(t,r,n)>=0)return!1;for(var a=t.x,i=r.x,o=n.x,f=t.y,u=r.y,s=n.y,l=a<i?a<o?a:o:i<o?i:o,c=f<u?f<s?f:s:u<s?u:s,h=a>i?a>o?a:o:i>o?i:o,d=f>u?f>s?f:s:u>s?u:s,v=n.next;v!==t;){if(v.x>=l&&v.x<=h&&v.y>=c&&v.y<=d&&se(a,f,i,u,o,s,v.x,v.y)&&ce(v.prev,v,v.next)>=0)return!1;v=v.next}return!0}function te(e,t,r,n){var a=e.prev,i=e,o=e.next;if(ce(a,i,o)>=0)return!1;for(var f=a.x,u=i.x,s=o.x,l=a.y,c=i.y,h=o.y,d=f<u?f<s?f:s:u<s?u:s,v=l<c?l<h?l:h:c<h?c:h,p=f>u?f>s?f:s:u>s?u:s,b=l>c?l>h?l:h:c>h?c:h,x=fe(d,v,t,r,n),g=fe(p,b,t,r,n),y=e.prevZ,m=e.nextZ;y&&y.z>=x&&m&&m.z<=g;){if(y.x>=d&&y.x<=p&&y.y>=v&&y.y<=b&&y!==a&&y!==o&&se(f,l,u,c,s,h,y.x,y.y)&&ce(y.prev,y,y.next)>=0)return!1;if(y=y.prevZ,m.x>=d&&m.x<=p&&m.y>=v&&m.y<=b&&m!==a&&m!==o&&se(f,l,u,c,s,h,m.x,m.y)&&ce(m.prev,m,m.next)>=0)return!1;m=m.nextZ}for(;y&&y.z>=x;){if(y.x>=d&&y.x<=p&&y.y>=v&&y.y<=b&&y!==a&&y!==o&&se(f,l,u,c,s,h,y.x,y.y)&&ce(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;m&&m.z<=g;){if(m.x>=d&&m.x<=p&&m.y>=v&&m.y<=b&&m!==a&&m!==o&&se(f,l,u,c,s,h,m.x,m.y)&&ce(m.prev,m,m.next)>=0)return!1;m=m.nextZ}return!0}function re(e,t,r){var n=e;do{var a=n.prev,i=n.next.next;!he(a,i)&&de(a,n,n.next,i)&&be(a,i)&&be(i,a)&&(t.push(a.i/r|0),t.push(n.i/r|0),t.push(i.i/r|0),ye(n),ye(n.next),n=e=i),n=n.next}while(n!==e);return X(n)}function ne(e,t,r,n,a,i){var o=e;do{for(var f=o.next.next;f!==o.prev;){if(o.i!==f.i&&le(o,f)){var u=xe(o,f);return o=X(o,o.next),u=X(u,u.next),Y(o,t,r,n,a,i,0),void Y(u,t,r,n,a,i,0)}f=f.next}o=o.next}while(o!==e)}function ae(e,t){return e.x-t.x}function ie(e,t){var r=function(e,t){var r,n=t,a=e.x,i=e.y,o=-1/0;do{if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){var f=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(f<=a&&f>o&&(o=f,r=n.x<n.next.x?n:n.next,f===a))return r}n=n.next}while(n!==t);if(!r)return null;var u,s=r,l=r.x,c=r.y,h=1/0;n=r;do{a>=n.x&&n.x>=l&&a!==n.x&&se(i<c?a:o,i,l,c,i<c?o:a,i,n.x,n.y)&&(u=Math.abs(i-n.y)/(a-n.x),be(n,e)&&(u<h||u===h&&(n.x>r.x||n.x===r.x&&oe(r,n)))&&(r=n,h=u)),n=n.next}while(n!==s);return r}(e,t);if(!r)return t;var n=xe(r,e);return X(n,n.next),X(r,r.next)}function oe(e,t){return ce(e.prev,e,t.prev)<0&&ce(t.next,e,e.next)<0}function fe(e,t,r,n,a){return(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-r)*a|0)|e<<8))|e<<4))|e<<2))|e<<1))|(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=(t-n)*a|0)|t<<8))|t<<4))|t<<2))|t<<1))<<1}function ue(e){var t=e,r=e;do{(t.x<r.x||t.x===r.x&&t.y<r.y)&&(r=t),t=t.next}while(t!==e);return r}function se(e,t,r,n,a,i,o,f){return(a-o)*(t-f)>=(e-o)*(i-f)&&(e-o)*(n-f)>=(r-o)*(t-f)&&(r-o)*(i-f)>=(a-o)*(n-f)}function le(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!function(e,t){var r=e;do{if(r.i!==e.i&&r.next.i!==e.i&&r.i!==t.i&&r.next.i!==t.i&&de(r,r.next,e,t))return!0;r=r.next}while(r!==e);return!1}(e,t)&&(be(e,t)&&be(t,e)&&function(e,t){var r=e,n=!1,a=(e.x+t.x)/2,i=(e.y+t.y)/2;do{r.y>i!=r.next.y>i&&r.next.y!==r.y&&a<(r.next.x-r.x)*(i-r.y)/(r.next.y-r.y)+r.x&&(n=!n),r=r.next}while(r!==e);return n}(e,t)&&(ce(e.prev,e,t.prev)||ce(e,t.prev,t))||he(e,t)&&ce(e.prev,e,e.next)>0&&ce(t.prev,t,t.next)>0)}function ce(e,t,r){return(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y)}function he(e,t){return e.x===t.x&&e.y===t.y}function de(e,t,r,n){var a=pe(ce(e,t,r)),i=pe(ce(e,t,n)),o=pe(ce(r,n,e)),f=pe(ce(r,n,t));return a!==i&&o!==f||(!(0!==a||!ve(e,r,t))||(!(0!==i||!ve(e,n,t))||(!(0!==o||!ve(r,e,n))||!(0!==f||!ve(r,t,n)))))}function ve(e,t,r){return t.x<=Math.max(e.x,r.x)&&t.x>=Math.min(e.x,r.x)&&t.y<=Math.max(e.y,r.y)&&t.y>=Math.min(e.y,r.y)}function pe(e){return e>0?1:e<0?-1:0}function be(e,t){return ce(e.prev,e,e.next)<0?ce(e,t,e.next)>=0&&ce(e,e.prev,t)>=0:ce(e,t,e.prev)<0||ce(e,e.next,t)<0}function xe(e,t){var r=new me(e.i,e.x,e.y),n=new me(t.i,t.x,t.y),a=e.next,i=t.prev;return e.next=t,t.prev=e,r.next=a,a.prev=r,n.next=r,r.prev=n,i.next=n,n.prev=i,n}function ge(e,t,r,n){var a=new me(e,t,r);return n?(a.next=n.next,a.prev=n,n.next.prev=a,n.next=a):(a.prev=a,a.next=a),a}function ye(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function me(e,t,r){this.i=e,this.x=t,this.y=r,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function we(e,t,r,n){for(var a=0,i=t,o=r-n;i<r;i+=n)a+=(e[o]-e[i])*(e[i+1]+e[o+1]),o=i;return a}J.exports=K,J.exports.default=K,K.deviation=function(e,t,r,n){var a=t&&t.length,i=a?t[0]*r:e.length,o=Math.abs(we(e,0,i,r));if(a)for(var f=0,u=t.length;f<u;f++){var s=t[f]*r,l=f<u-1?t[f+1]*r:e.length;o-=Math.abs(we(e,s,l,r))}var c=0;for(f=0;f<n.length;f+=3){var h=n[f]*r,d=n[f+1]*r,v=n[f+2]*r;c+=Math.abs((e[h]-e[v])*(e[d+1]-e[h+1])-(e[h]-e[d])*(e[v+1]-e[h+1]))}return 0===o&&0===c?0:Math.abs((c-o)/o)},K.flatten=function(e){for(var t=e[0][0].length,r={vertices:[],holes:[],dimensions:t},n=0,a=0;a<e.length;a++){for(var i=0;i<e[a].length;i++)for(var o=0;o<t;o++)r.vertices.push(e[a][i][o]);a>0&&(n+=e[a-1].length,r.holes.push(n))}return r};const ke=e(J.exports);var _e=function(e){var t=[];return e.replace(Ze,(function(e,r,n){var a=r.toLowerCase();for(n=function(e){var t=e.match(Ne);return t?t.map(Number):[]}(n),"m"==a&&n.length>2&&(t.push([r].concat(n.splice(0,2))),a="l",r="m"==r?"l":"L");;){if(n.length==Me[a])return n.unshift(r),t.push(n);if(n.length<Me[a])throw new Error("malformed path data");t.push([r].concat(n.splice(0,Me[a])))}})),t},Me={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},Ze=/([astvzqmhlc])([^astvzqmhlc]*)/gi;var Ne=/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;const Ae=e(_e);export{r as E,ke as e,G as i,O as k,q as n,Ae as p,P as w};
//# sourceMappingURL=vendor-D-bpYjUI.js.map
