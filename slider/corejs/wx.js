// 判断是否在微信中打开
if(navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)){
	// 微信SDK
	wx.config({
		debug: $_GET["wxdebug"] ? true : false,
		appId: wx_appid,
		timestamp: wx_timestamp,
		nonceStr: wx_nonceStr,
		signature: wx_signature,
		jsApiList: [
			// 所有要调用的 API 都要加到这个列表中
			"onMenuShareTimeline",
			"onMenuShareAppMessage",
			"onMenuShareQQ",
			"onMenuShareWeibo",
			"onMenuShareQZone",
			"startRecord",
			"stopRecord",
			"onVoiceRecordEnd",
			"playVoice",
			"pauseVoice",
			"stopVoice",
			"onVoicePlayEnd",
			"uploadVoice",
			"downloadVoice",
			"chooseImage",
			"previewImage",
			"uploadImage",
			"downloadImage",
			"translateVoice",
			"getNetworkType",
			"openLocation",
			"getLocation",
			"hideOptionMenu",
			"showOptionMenu",
			"hideMenuItems",
			"showMenuItems",
			"hideAllNonBaseMenuItem",
			"showAllNonBaseMenuItem",
			"closeWindow",
			"scanQRCode",
			"chooseWXPay",
			"openProductSpecificView",
			"addCard",
			"chooseCard",
			"openCard"
		]
	});
	wx.ready(function(){
		// 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareAppMessage({
			title: mainTitle,
			desc: mainDesc,
			link: mainURL,
			imgUrl: mainImgUrl,
			trigger: function (res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
				//alert('用户点击发送给朋友');
			},
			success: function (res) {
				//alert('已分享');
			},
			cancel: function (res) {
				//alert('已取消');
			},
			fail: function (res) {
				//alert(JSON.stringify(res));
			}
		});
		// 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareTimeline({
			title: mainTitle,
			desc: mainDesc,
			link: mainURL,
			imgUrl: mainImgUrl,
			trigger: function (res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
				//alert('用户点击分享到朋友圈');
			},
			success: function (res) {
				//alert('已分享');
			},
			cancel: function (res) {
				//alert('已取消');
			},
			fail: function (res) {
				//alert(JSON.stringify(res));
			}
		});
		// 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareQQ({
			title: mainTitle,
			desc: mainDesc,
			link: mainURL,
			imgUrl: mainImgUrl,
			trigger: function (res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
				//alert('用户点击分享到QQ');
			},
			complete: function (res) {
				//alert(JSON.stringify(res));
			},
			success: function (res) {
				//alert('已分享');
			},
			cancel: function (res) {
				//alert('已取消');
			},
			fail: function (res) {
				//alert(JSON.stringify(res));
			}
		});
		// 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareWeibo({
			title: mainTitle,
			desc: mainDesc,
			link: mainURL,
			imgUrl: mainImgUrl,
			trigger: function (res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
				//alert('用户点击分享到微博');
			},
			success: function (res) {
				//alert('已分享');
			},
			cancel: function (res) {
				//alert('已取消');
			},
			fail: function (res) {
				//alert(JSON.stringify(res));
			}
		});
		// 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
		wx.onMenuShareQZone({
			title: mainTitle,
			desc: mainDesc,
			link: mainURL,
			imgUrl: mainImgUrl,
			trigger: function (res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
				//alert('用户点击分享到QZone');
			},
			success: function (res) {
				//alert('已分享');
			},
			cancel: function (res) {
				//alert('已取消');
			},
			fail: function (res) {
				//alert(JSON.stringify(res));
			}
		});
	});
}
