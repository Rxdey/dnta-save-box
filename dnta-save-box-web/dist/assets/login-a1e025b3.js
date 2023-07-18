import{ar as M,ai as m,ag as V,af as H,aj as O,X as z}from"./el-notification-5937243a.js";import{ad as D,ae as L,r as F,x as R,y as G,C as g,q as B,ai as T,I as W,E as X,a8 as S}from"./index-1a618a16.js";const $="/32.png";var N={exports:{}},A={exports:{}};(function(){var l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",y={rotl:function(a,u){return a<<u|a>>>32-u},rotr:function(a,u){return a<<32-u|a>>>u},endian:function(a){if(a.constructor==Number)return y.rotl(a,8)&16711935|y.rotl(a,24)&4278255360;for(var u=0;u<a.length;u++)a[u]=y.endian(a[u]);return a},randomBytes:function(a){for(var u=[];a>0;a--)u.push(Math.floor(Math.random()*256));return u},bytesToWords:function(a){for(var u=[],i=0,c=0;i<a.length;i++,c+=8)u[c>>>5]|=a[i]<<24-c%32;return u},wordsToBytes:function(a){for(var u=[],i=0;i<a.length*32;i+=8)u.push(a[i>>>5]>>>24-i%32&255);return u},bytesToHex:function(a){for(var u=[],i=0;i<a.length;i++)u.push((a[i]>>>4).toString(16)),u.push((a[i]&15).toString(16));return u.join("")},hexToBytes:function(a){for(var u=[],i=0;i<a.length;i+=2)u.push(parseInt(a.substr(i,2),16));return u},bytesToBase64:function(a){for(var u=[],i=0;i<a.length;i+=3)for(var c=a[i]<<16|a[i+1]<<8|a[i+2],f=0;f<4;f++)i*8+f*6<=a.length*8?u.push(l.charAt(c>>>6*(3-f)&63)):u.push("=");return u.join("")},base64ToBytes:function(a){a=a.replace(/[^A-Z0-9+\/]/ig,"");for(var u=[],i=0,c=0;i<a.length;c=++i%4)c!=0&&u.push((l.indexOf(a.charAt(i-1))&Math.pow(2,-2*c+8)-1)<<c*2|l.indexOf(a.charAt(i))>>>6-c*2);return u}};A.exports=y})();var q=A.exports,x={utf8:{stringToBytes:function(l){return x.bin.stringToBytes(unescape(encodeURIComponent(l)))},bytesToString:function(l){return decodeURIComponent(escape(x.bin.bytesToString(l)))}},bin:{stringToBytes:function(l){for(var y=[],a=0;a<l.length;a++)y.push(l.charCodeAt(a)&255);return y},bytesToString:function(l){for(var y=[],a=0;a<l.length;a++)y.push(String.fromCharCode(l[a]));return y.join("")}}},w=x;/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var P=function(l){return l!=null&&(C(l)||Z(l)||!!l._isBuffer)};function C(l){return!!l.constructor&&typeof l.constructor.isBuffer=="function"&&l.constructor.isBuffer(l)}function Z(l){return typeof l.readFloatLE=="function"&&typeof l.slice=="function"&&C(l.slice(0,0))}(function(){var l=q,y=w.utf8,a=P,u=w.bin,i=function(c,f){c.constructor==String?f&&f.encoding==="binary"?c=u.stringToBytes(c):c=y.stringToBytes(c):a(c)?c=Array.prototype.slice.call(c,0):!Array.isArray(c)&&c.constructor!==Uint8Array&&(c=c.toString());for(var e=l.bytesToWords(c),p=c.length*8,n=1732584193,r=-271733879,o=-1732584194,t=271733878,s=0;s<e.length;s++)e[s]=(e[s]<<8|e[s]>>>24)&16711935|(e[s]<<24|e[s]>>>8)&4278255360;e[p>>>5]|=128<<p%32,e[(p+64>>>9<<4)+14]=p;for(var d=i._ff,v=i._gg,_=i._hh,h=i._ii,s=0;s<e.length;s+=16){var E=n,I=r,k=o,U=t;n=d(n,r,o,t,e[s+0],7,-680876936),t=d(t,n,r,o,e[s+1],12,-389564586),o=d(o,t,n,r,e[s+2],17,606105819),r=d(r,o,t,n,e[s+3],22,-1044525330),n=d(n,r,o,t,e[s+4],7,-176418897),t=d(t,n,r,o,e[s+5],12,1200080426),o=d(o,t,n,r,e[s+6],17,-1473231341),r=d(r,o,t,n,e[s+7],22,-45705983),n=d(n,r,o,t,e[s+8],7,1770035416),t=d(t,n,r,o,e[s+9],12,-1958414417),o=d(o,t,n,r,e[s+10],17,-42063),r=d(r,o,t,n,e[s+11],22,-1990404162),n=d(n,r,o,t,e[s+12],7,1804603682),t=d(t,n,r,o,e[s+13],12,-40341101),o=d(o,t,n,r,e[s+14],17,-1502002290),r=d(r,o,t,n,e[s+15],22,1236535329),n=v(n,r,o,t,e[s+1],5,-165796510),t=v(t,n,r,o,e[s+6],9,-1069501632),o=v(o,t,n,r,e[s+11],14,643717713),r=v(r,o,t,n,e[s+0],20,-373897302),n=v(n,r,o,t,e[s+5],5,-701558691),t=v(t,n,r,o,e[s+10],9,38016083),o=v(o,t,n,r,e[s+15],14,-660478335),r=v(r,o,t,n,e[s+4],20,-405537848),n=v(n,r,o,t,e[s+9],5,568446438),t=v(t,n,r,o,e[s+14],9,-1019803690),o=v(o,t,n,r,e[s+3],14,-187363961),r=v(r,o,t,n,e[s+8],20,1163531501),n=v(n,r,o,t,e[s+13],5,-1444681467),t=v(t,n,r,o,e[s+2],9,-51403784),o=v(o,t,n,r,e[s+7],14,1735328473),r=v(r,o,t,n,e[s+12],20,-1926607734),n=_(n,r,o,t,e[s+5],4,-378558),t=_(t,n,r,o,e[s+8],11,-2022574463),o=_(o,t,n,r,e[s+11],16,1839030562),r=_(r,o,t,n,e[s+14],23,-35309556),n=_(n,r,o,t,e[s+1],4,-1530992060),t=_(t,n,r,o,e[s+4],11,1272893353),o=_(o,t,n,r,e[s+7],16,-155497632),r=_(r,o,t,n,e[s+10],23,-1094730640),n=_(n,r,o,t,e[s+13],4,681279174),t=_(t,n,r,o,e[s+0],11,-358537222),o=_(o,t,n,r,e[s+3],16,-722521979),r=_(r,o,t,n,e[s+6],23,76029189),n=_(n,r,o,t,e[s+9],4,-640364487),t=_(t,n,r,o,e[s+12],11,-421815835),o=_(o,t,n,r,e[s+15],16,530742520),r=_(r,o,t,n,e[s+2],23,-995338651),n=h(n,r,o,t,e[s+0],6,-198630844),t=h(t,n,r,o,e[s+7],10,1126891415),o=h(o,t,n,r,e[s+14],15,-1416354905),r=h(r,o,t,n,e[s+5],21,-57434055),n=h(n,r,o,t,e[s+12],6,1700485571),t=h(t,n,r,o,e[s+3],10,-1894986606),o=h(o,t,n,r,e[s+10],15,-1051523),r=h(r,o,t,n,e[s+1],21,-2054922799),n=h(n,r,o,t,e[s+8],6,1873313359),t=h(t,n,r,o,e[s+15],10,-30611744),o=h(o,t,n,r,e[s+6],15,-1560198380),r=h(r,o,t,n,e[s+13],21,1309151649),n=h(n,r,o,t,e[s+4],6,-145523070),t=h(t,n,r,o,e[s+11],10,-1120210379),o=h(o,t,n,r,e[s+2],15,718787259),r=h(r,o,t,n,e[s+9],21,-343485551),n=n+E>>>0,r=r+I>>>0,o=o+k>>>0,t=t+U>>>0}return l.endian([n,r,o,t])};i._ff=function(c,f,e,p,n,r,o){var t=c+(f&e|~f&p)+(n>>>0)+o;return(t<<r|t>>>32-r)+f},i._gg=function(c,f,e,p,n,r,o){var t=c+(f&p|e&~p)+(n>>>0)+o;return(t<<r|t>>>32-r)+f},i._hh=function(c,f,e,p,n,r,o){var t=c+(f^e^p)+(n>>>0)+o;return(t<<r|t>>>32-r)+f},i._ii=function(c,f,e,p,n,r,o){var t=c+(e^(f|~p))+(n>>>0)+o;return(t<<r|t>>>32-r)+f},i._blocksize=16,i._digestsize=16,N.exports=function(c,f){if(c==null)throw new Error("Illegal argument "+c);var e=l.wordsToBytes(i(c,f));return f&&f.asBytes?e:f&&f.asString?u.bytesToString(e):l.bytesToHex(e)}})();var J=N.exports;const K=D(J),Q={...M};const Y={class:"login"},j={class:"login-modal"},b=g("div",{class:"logo"},[g("img",{src:$,alt:""}),S(" DNTA BOX ")],-1),rr={class:"login-form"},tr={class:"form-wrap"},nr=g("label",{class:"label"},"账号",-1),or={class:"form-input"},er={class:"form-wrap"},sr=g("label",{class:"label"},"密码",-1),ar={class:"form-input"},ur=g("div",{class:"tip-wrap"},[g("span",{class:"tip"},"忘记密码?"),g("span",{class:"tip"},"注册")],-1),ir={class:"button-wrap"},fr={__name:"login",setup(l){const y=L(),a=F(!1),u=F({userName:"",password:""}),i=async()=>{if(!u.value.userName||!u.value.password){m.error("请输入账号和密码");return}a.value=!0;const c={userName:u.value.userName,password:K(u.value.password).toUpperCase()},f=await Q.LoginUsePOST(c);a.value=!1;const{msg:e,data:p,success:n,token:r}=f;if(!n){e&&m.error(e);return}V.set("token",r,{expires:365}),H.setItem("userInfo",p),O({title:"登录成功",message:"欢迎回来",type:"success"}),window.postMessage({type:"worldpack",action:"login",token:r},"/"),setTimeout(()=>{y.push("/home")},1e3)};return(c,f)=>{const e=z;return R(),G("div",Y,[g("div",j,[b,g("div",rr,[g("div",tr,[nr,g("div",or,[B(g("input",{type:"text",placeholder:"请输入账号","onUpdate:modelValue":f[0]||(f[0]=p=>u.value.userName=p)},null,512),[[T,u.value.userName]])])]),g("div",er,[sr,g("div",ar,[B(g("input",{type:"password",placeholder:"请输入密码","onUpdate:modelValue":f[1]||(f[1]=p=>u.value.password=p)},null,512),[[T,u.value.password]])])]),ur,g("div",ir,[W(e,{type:"primary",round:"",size:"large",loading:a.value,onClick:i},{default:X(()=>[S("登录")]),_:1},8,["loading"])])])])])}}};export{fr as default};
