/*jslint browser: true, continue: true, eqeq: true, plusplus: true, vars: true, white: true */
var FlattrLoader=function(){"use strict";var a={instance:!1,queryString:!1,validParams:["mode","https","uid","button","language","html5-key-prefix","popout","revsharekey"],validButtonParams:["uid","owner","button","hidden","title","url","revsharekey"],options:{},POPOUT_WIDTH:400,POPOUT_HEIGHT:80,TIMEOUT:1500,activeButton:null,popout:null,eventHandlers:{unauthorized:function(){a.showPopoutForButton(a.activeButton)},popout_close_button_clicked:function(){a.removePopout()}},createIframe:function(a){var b=a.button=="compact",c=document.createElement("iframe");c.setAttribute("src",(this.getParam("https")==1?"https":"http")+"://button.flattr."+this.getParam("domain","com")+"/view/?e=1&"+this.encodeData(a)),c.setAttribute("class","FlattrButton"),c.setAttribute("width",b==1?110:55),c.setAttribute("height",b==1?20:62),c.setAttribute("frameBorder",0),c.setAttribute("scrolling","no"),c.setAttribute("title","Flattr"),c.setAttribute("border",0),c.setAttribute("marginHeight",0),c.setAttribute("marginWidth",0),c.setAttribute("allowTransparency","true"),c.data=a;if(a.popout!=0){var d=this;c.onmouseover=function(){d.activeButton=this}}return c},getAbsolutePositionForElement:function(a){var b={x:0,y:0};if(a.offsetParent)do b.x+=a.offsetLeft,b.y+=a.offsetTop,a=a.offsetParent;while(a);return b},showPopoutForButton:function(b){a.popout!=null&&a.removePopout();var c,d="s",e="e",f=window.innerWidth!==undefined?window.innerWidth:document.documentElement.clientWidth,g=window.innerHeight!==undefined?window.innerHeight:document.documentElement.clientHeight,h=this.getAbsolutePositionForElement(b);h.x>f/2&&(e="w"),h.y+Number(b.height)+this.POPOUT_HEIGHT>g&&(d="n"),c=d+e,b.data.dir=c;var i=this.createPopoutIframe(b,b.data);e==="w"?i.style.left=Number(h.x)-Number(this.POPOUT_WIDTH)+Number(b.width)+"px":e==="e"&&(i.style.left=h.x+"px"),d==="n"?i.style.top=Number(h.y)-Number(this.POPOUT_HEIGHT)+"px":d==="s"&&(i.style.top=Number(h.y)+Number(b.height)+"px"),i.timeout=setTimeout(function(){a.popout&&a.removePopout()},a.TIMEOUT*4),a.popout=i,document.querySelector("body").appendChild(i)},createPopoutIframe:function(b,c){var d=document.createElement("iframe");return d.setAttribute("src",(this.getParam("https")==1?"https":"http")+"://button.flattr."+this.getParam("domain","com")+"/popout/?"+this.encodeData(c)),d.setAttribute("frameBorder",0),d.setAttribute("allowTransparency","true"),d.setAttribute("style","position: absolute; display:block; z-index: 9999;"),d.setAttribute("width",this.POPOUT_WIDTH),d.setAttribute("height",this.POPOUT_HEIGHT),d.onmouseover=function(){this.timeout&&(clearTimeout(this.timeout),this.timeout=undefined)},d.onmouseout=function(){this.parentNode&&(this.timeout=setTimeout(function(){a.popout&&a.removePopout()},a.TIMEOUT))},d},removePopout:function(){if(!a.popout)return;var b=a.popout;b.timeout&&clearTimeout(b.timeout),b.parentNode.removeChild(b),a.popout=null},encodeData:function(a){var b,c,d="";for(b in a)a.hasOwnProperty(b)&&(c=a[b],b=="description"&&(c=this.stripTags(c,"<br>"),c.length>1e3&&(c=c.substring(0,1e3))),c=c.replace(/^\s+|\s+$/g,"").replace(/\s{2,}|\t+/g," "),d+=b+"="+encodeURIComponent(c)+"&");return d},getParam:function(a,b){return typeof this.options[a]!="undefined"?this.options[a]:b},init:function(){try{if(document.compatMode=="BackCompat"){var b=document.documentMode;if(b!=undefined&&b<8){console!=undefined&&console.log("The Flattr button requires the page to be rendered in Standards mode (IE8 or later).");return}}var c,d,e,f,g,h,i,j,k,l,m,n,o=document.getElementsByTagName("script");for(c=o.length-1;c>=0;c--){d=o[c];if(!d.hasAttribute("src"))continue;e=d.src,f=new RegExp("^(http(?:s?))://((?:(?:api|button).)?flattr.(com|dev))","i"),g=e.match(f);if(!g)continue;e.indexOf("button/load.js")&&(this.options.mode="d"),this.options.https=g[1].toString()=="https"?1:0,this.options.domain=g[3].toString(),h=e.indexOf("?");if(h){i=e.substring(++h),j=i.split("&");for(l=0;l<j.length;l++)k=j[l].split("="),this.validParam(k[0],this.validParams)&&(this.options[k[0]]=k[1])}this.instance=d;break}if(!this.instance)return}catch(p){}window.addEventListener!==undefined?(m=window.addEventListener,n="message"):(m=window.attachEvent,n="onmessage"),m(n,function(b){var c;try{c=JSON.parse(b.data)}catch(d){c={}}a.eventHandlers[c.flattr_button_event]!="function"&&a.eventHandlers[c.flattr_button_event]()},!1);switch(this.getParam("mode","sdk")){case"d":this.options.mode="direct";case"direct":this.render();break;case"auto":case"automatic":var q=this;this.domReady(function(){q.setup()});break;default:}return this},loadButton:function(a){var b,c,d,e,f,g={},h=null;for(b in this.options)this.options.hasOwnProperty(b)&&this.validParam(b,this.validButtonParams)&&(g[b]=this.options[b]);a.href&&(g.url=a.href),a.getAttribute("title")&&(g.title=a.getAttribute("title"));if((h=a.getAttribute("rev"))!==null&&h.substring(0,6)=="flattr"||(h=a.getAttribute("rel"))!==null&&h.substring(0,6)=="flattr"){h=h.substring(7).split(";");for(c=0;c<h.length;c++)d=h[c].split(":"),e=d.shift(),this.validParam(e,this.validButtonParams)&&(g[e]=d.join(":"))}else for(f in this.validButtonParams)this.validButtonParams.hasOwnProperty(f)&&(h=a.getAttribute(this.getParam("html5-key-prefix","data-flattr")+"-"+this.validButtonParams[f]))!==null&&(g[this.validButtonParams[f]]=h);this.replaceWith(a,this.createIframe(g))},render:function(a,b,c){var d,e={};for(d in this.options)this.options.hasOwnProperty(d)&&this.validParam(d,this.validButtonParams)&&(e[d]=this.options[d]);try{if(a)for(d in a)a.hasOwnProperty(d)&&this.validParam(d,this.validButtonParams)&&(e[d]=a[d]);else window.flattr_uid&&(e.uid=window.flattr_uid),window.flattr_url&&(e.url=window.flattr_url),window.flattr_btn&&(e.button=window.flattr_btn),window.flattr_hide&&(e.hidden=window.flattr_hide==1?1:0),window.flattr_tle&&(e.title=window.flattr_tle);var f=this.createIframe(e);if(b){typeof b=="string"&&(b=document.getElementById(b));switch(c){case"before":b.parentNode.insertBefore(f,b);break;case"replace":this.replaceWith(b,f);break;case"append":default:b.appendChild(f)}}else this.getParam("mode","manual")=="direct"&&this.replaceWith(this.instance,f)}catch(g){}},replaceWith:function(a,b){if(typeof b=="string")if(typeof document.documentElement.outerHTML!="undefined")a.outerHTML=b;else{var c=document.createRange();c.selectNode(a),b=c.createContextualFragment(b),a.parentNode.replaceChild(b,a)}var d=a.parentNode;d.replaceChild(b,a)},setup:function(){var a,b,c;if(document.querySelectorAll)try{c=document.querySelectorAll("a.FlattrButton")}catch(d){}if(c==undefined){c=[],a=document.getElementsByTagName("a");for(b=a.length-1;b>=0;b--)/FlattrButton/.test(a[b].className)&&(c[c.length]=a[b])}for(b=c.length-1;b>=0;b--)this.loadButton(c[b])},stripTags:function(a,b){var c="",d=!1,e=[],f=[],g="",h=0,i="",j="",k=function(a,b,c){return c.split(a).join(b)};b&&(f=b.match(/([a-zA-Z0-9]+)/gi)),a+="",e=a.match(/(<\/?[\S][^>]*>)/gi);for(c in e)if(e.hasOwnProperty(c)){if(isNaN(c))continue;j=e[c].toString(),d=!1;for(i in f)if(f.hasOwnProperty(i)){g=f[i],h=-1,h!=0&&(h=j.toLowerCase().indexOf("<"+g+">")),h!=0&&(h=j.toLowerCase().indexOf("<"+g+" ")),h!=0&&(h=j.toLowerCase().indexOf("</"+g));if(h==0){d=!0;break}}d||(a=k(j,"",a))}return a},validParam:function(a,b){var c;for(c=0;c<b.length;c++)if(b[c]==a)return!0;return!1}};return a}();!function(a,b){function c(a){m=1;while(a=d.shift())a()}var d=[],e,f,g=!1,h=b.documentElement,i=h.doScroll,j="DOMContentLoaded",k="addEventListener",l="onreadystatechange",m=/^loade|c/.test(b.readyState);b[k]&&b[k](j,f=function(){b.removeEventListener(j,f,g),c()},g),i&&b.attachEvent(l,e=function(){/^c/.test(b.readyState)&&(b.detachEvent(l,e),c())}),a.domReady=i?function(b){self!=top?m?b():d.push(b):function(){try{h.doScroll("left")}catch(c){return setTimeout(function(){a.domReady(b)},50)}b()}()}:function(a){m?a():d.push(a)}}(FlattrLoader,document),FlattrLoader.init()