/*
 * 判断手机是否安装当当客户端，如果安装了，就打开，否则下载
 * HTML标签：<button href="需要调起的客户端字典（dangdang:\\）" android="android客户端下载地址" ios="ios客户端下载地址"></button>
 * 方法：
 * 		downLoad ——判断手机是否安装当当客户端，如果安装了，就打开，否则下载
 * 		browser ——用UA判断手机系统
 * 		isUpChrome28 ——判断手机浏览器是否是chrome并且版本是否大于28
 */
var appDownLoad = {
	browser: {//判断手机
		versions:function(){
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return {
				trident: u.indexOf('Trident') > -1, //IE
				presto: u.indexOf('Presto') > -1, //opera
				webKit: u.indexOf('AppleWebKit') > -1, //webkit
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android
				iPhone: u.indexOf('iPhone') > -1 , //iPhone
				iPad: u.indexOf('iPad') > -1, //iPad
				webApp: u.indexOf('Safari') == -1, //Safari
				uc: !!u.match(/UCBrowser/) //ios
			};
		}(),
		language:(navigator.browserLanguage || navigator.language).toLowerCase()
	},
	isWeixin: function(){
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else{
			return false;
		}
	}(),
	isUpChrome28: function(){
		var reg = new RegExp("Chrome/[0-9|.]+"),
			res = reg.exec(navigator.userAgent);
		res = res && res[0] ? res[0].replace("Chrome/", "") : false;
		if(res){
			res = res.split(".");
			if(res[0] >= 28){
				res = true;
			}else{
				res = false;
			}
		}
		return res;
	}(),
	browerPrefix: function(){
		var res = '';
		['webkit', 'moz', 'o', 'ms'].forEach(function(prefix){
			if(typeof document[prefix + 'Hidden'] != 'undefined'){
				res = prefix;
			}
		});
		return res;
	}(),
	getStyle: function(el, style){
		//读取样式
		var realStyle = null;
		if(el.currentStyle){
			realStyle = el.currentStyle[style];
		}else if(window.getComputedStyle){
			realStyle = window.getComputedStyle(el, null)[style];
		}
		return parseInt(realStyle);
	},
	addEvent: function(target, type, func){
		//绑定事件
		if(target.addEventListener){
			//非ie 和ie9
			target.addEventListener(type, func, false);
		}else if(target.attachEvent){
			//ie6到ie8
			target.attachEvent("on" + type, func);
		}else{
			//ie5
			target["on" + type] = func;
		}
	},
	removeEvent: function(target, type, func){
		//解除绑定事件
		if(target.removeEventListener){
			target.removeEventListener(type, func, false);
		}else if(target.detachEvent){
			target.detachEvent("on" + type, func);
		}else{
			target["on" + type] = null;
		}
	},
	downLoad: function(){
		var that = this,
			appUrl = that.getAttribute("href"),
			webUrl = appDownLoad.browser.versions.android ? that.getAttribute("android") : that.getAttribute("ios"),
			packageName = 'com.dangdang.buy2',
			last = Date.now(),
			now = 0,
			speed = 2000,
			ifr = null,
			a = null;
		if(appDownLoad.browser.versions.android && appDownLoad.isUpChrome28){
			window.location.href = 'intent://' + appUrl + '#Intent;scheme=' + appUrl + ';package=' + packageName + ';end';
		}else if(appDownLoad.browser.versions.iPhone || appDownLoad.browser.versions.iPad){
			a = document.createElement('a');
			a.setAttribute('href', appUrl),
			a.style.display = 'none',
			document.body.appendChild(a);
			var htmlevents = document.createEvent("HTMLEvents");
			htmlevents.initEvent('click', !1, !1),
			a.dispatchEvent(htmlevents);
		}else{
			var ifr = document.createElement('iframe');
			ifr.style.height = "1px";
			ifr.style.width = "1px";
			ifr.style.position = "absolute";
			ifr.style.top = "-999px";
			ifr.style.left = "-999px";
			ifr.src = appUrl;
			document.body.appendChild(ifr);
		}
		// 绑定visibilitychange事件
		var visibilitychangeEvent = function(){
			if(document[visiblestate] == 'hidden'){
				// 页面处于后台
				clearInterval(interval);
				interval = null;
			//}else if(document[visiblestate] == 'visible'){
				// 页面处于前台
			}
		}
		appDownLoad.removeEvent(document, appDownLoad.browerPrefix + 'visibilitychange', visibilitychangeEvent);
		appDownLoad.addEvent(document, appDownLoad.browerPrefix + 'visibilitychange', visibilitychangeEvent);
		// 如果没安装客户端
		var times = 0,
			flag = false,
			interval = null,
			visiblestate = appDownLoad.browerPrefix == '' ? 'visibilityState' : appDownLoad.browerPrefix + 'VisibilityState';
		interval = setInterval(function(){
			if(Date.now() - last < speed){
				last = Date.now();
				times++;
			}else if(Date.now() - last > speed){
				flag = true;
				clearInterval(interval);
				interval = null;
				if(ifr !== null){
					document.body.removeChild(ifr);
				}
				if(a !== null){
					document.body.removeChild(a);
				}
			}
			if(!flag && times >= 10){
				clearInterval(interval);
				interval = null;
				if(ifr !== null){
					document.body.removeChild(ifr);
				}
				if(a !== null){
					document.body.removeChild(a);
				}
				window.location.href = webUrl;
			}
		}, 200);
	}
};
