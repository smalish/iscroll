var storageFlag = function(){
	if(typeof window.localStorage === "object"){
		try{
			localStorage.setItem("localStorageTest", 1);
			localStorage.removeItem("localStorageTest");
			return true;
		}catch(e){
			return false;
		}
	}else{
		return false;
	}
}();
// 读取存储数据
function getStorage(key, cookie){
    if($.trim(key)){
        var res = "",
			isCookie = cookie && cookie == "cookie" ? true : false;
        if(storageFlag && !isCookie){
            if(localStorage.length > 0){
                var i = 0;
                for(; i < localStorage.length; i++){
                    if(localStorage.getItem(key)){
                        res = decodeURIComponent(localStorage.getItem(key));
                    }
                }
            }
            return res;
        }else{
            res = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
            if (res != null){
                return unescape(res[2]);
            }
            return "";
        }
    }
    return "";
}
// 设置存储数据
function setStorage(key, val, cookie){
    if($.trim(key)){
		var isCookie = cookie && cookie == "cookie" ? true : false;
        if(storageFlag && !isCookie){
            localStorage.setItem(key, encodeURIComponent(val));
        }else{
            var cookie = key + "=" + escape(val);
            days = (typeof(days) == 'undefined' || days == 0) ? 3650 : days;// 过期时间，默认10年
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            cookie = cookie + ";domain=.dangdang.com;path=/;expires=" + exp.toGMTString();
            document.cookie = cookie;
        }
    }
}
// 删除存储数据
function delStorage(key, cookie){
    if($.trim(key)){
		var isCookie = cookie && cookie == "cookie" ? true : false;
        if(storageFlag && !isCookie){
            if(localStorage.length > 0 && key != ""){
                localStorage.removeItem(localStorage.key(key));
            }
        }else{
            var exp = new Date(),
                cval = getStorage(key);
            exp.setTime(exp.getTime() - 1);
            if(cval != null){
                document.cookie = key + "=" + cval + ";domain=.dangdang.com;path=/;expires=" + exp.toGMTString();
            }
        }
    }
}
// 清除存储数据
function clearStorage(cookie){
	var isCookie = cookie && cookie == "cookie" ? true : false;
	if(storageFlag && !isCookie){
        localStorage.clear();
    }else{
        var key = document.cookie.match(/[^ =;]+(?=\=)/g);//console.log(key);
        if(key){
            for(var i = key.length - 1; i >= 0; i--){
                var exp = new Date(),
                    cval = getStorage(key[i]);
                exp.setTime(exp.getTime() - 1);
                document.cookie = key[i] + "=" + cval + ";domain=.dangdang.com;path=/;expires=" + exp.toGMTString();
            }
        }
    }
}

/*
 * 弹窗JS
 * 时间：2015-6-5
 * 作者：杨骏
 * 1.关注弹窗（pop）：黑底白字，无背景遮罩，2秒后自动关闭，有回调参数
 * 2.提示弹窗（alert）：有一个按钮的弹窗，有背景遮罩，点确定关闭，有回调参数
 * 3.选择弹窗（confirm）：有两个按钮的弹窗，有背景遮罩，点两个按钮都可以关闭，有回调参数
 * HTML结构：
    <!-- 遮罩开始 -->
	<section class="mask"></section>
	<!-- 遮罩结束 -->

	<!-- popup开始 -->
	<section class="popup">
		<div class="box">
			<p class="cell">
				<span class="con">
					<span class="title"></span>
					<span class="info"></span>
					<a href="javascript:void(0);" class="btn determine" ontouchstart="">确定</a>
					<a href="javascript:void(0);" class="btn cancel" ontouchstart="">取消</a>
					<a href="javascript:void(0);" class="btn ok" ontouchstart="">确定</a>
				</span>
			</p>
		</div>
	</section>
	<!-- popup结束 -->
 * 调用方式：
 * pop.popup({type:"pop", text:"该店铺收藏成功", complete:回调函数});
 * 参数说明：（以object形式传入）
 * {
 *   type:弹窗类型:pop（关注弹窗）、alert（提示弹窗）、confirm（选择弹窗）。默认alert
 * 	 wrap:弹窗容器ID或CLASS，默认“.popup”
 * 	 mask:遮罩容器ID或CLASS，默认“.mask”
 * 	 title:标题文字，默认“温馨提示”
 * 	 title_show:标题是否显示，alert默认为true，confirm默认为false
 * 	 text:文字内容，必传项！
 * 	 text_align:文字内容显示方向，left、center、right，默认“center”
 * 	 complete:弹窗完成后的回调
 * 	 determine:alert弹窗确定后的回调
 * 	 ok:confirm弹窗确定后的回调
 * 	 cancel:confirm弹窗取消后的回调
 * 	 determine_name:alert弹窗显示按钮文字，默认“确定”
 * 	 ok_name:confirm弹窗确定按钮文字，默认“确定”
 * 	 cancel_name:confirm弹窗取消按钮文字，默认“取消”
 * 	 speed:pop弹窗自动关闭时间（毫秒），默认2000ms
 * }
 */
var pop = {
	wrap: null,
	mask: null,
	text: "",
	complete: null,
	determine: null,
	ok: null,
	cancel: null,
	determine_name: "",
	ok_name: "",
	cancel_name: "",
	speed: 0,
	type: "",
	popup: function(obj){
		if(!obj.text){
			return false;
		}
		var that = this;
		that.wrap = obj.wrap ? $(obj.wrap) : $(".popup");
		that.mask = obj.mask ? $(obj.mask) : $(".mask");
		that.title = obj.title ? obj.title : "温馨提示";
		that.title_show = obj.title_show;
		that.text = obj.text;
		that.text_align = obj.text_align == "left" ? "left" : (obj.text_align == "right" ? "right" : "");
		that.complete = typeof obj.complete === "function" ? obj.complete : null;
		that.determine = typeof obj.determine === "function" ? obj.determine : null;
		that.ok = typeof obj.ok === "function" ? obj.ok : null;
		that.cancel = typeof obj.cancel === "function" ? obj.cancel : null;
		that.determine_name = obj.determine_name ? obj.determine_name : "确定";
		that.ok_name = obj.ok_name ? obj.ok_name : "确定";
		that.cancel_name = obj.cancel_name ? obj.cancel_name : "取消";
		that.speed = typeof obj.speed === "number" && obj.speed > 0 ? obj.speed : 2000;
		if(obj.type){
			switch (obj.type.toLowerCase()){
				case "pop":
					that.type = "Pop";
					break;
				case "confirm":
					that.type = "Confirm";
					break;
				default:
					that.type = "Alert";
			}
		}else{
			that.type = "Alert";
		}
		that.mask.css("display", "none");
		that.wrap.css("display", "none");
		that.wrap.removeClass("Pop Alert Confirm");
		that.wrap.find(".title").html("<span>" + that.title + "</span>").css("display", "block").find("span").css("display", "none");
		that.wrap.addClass(that.type).find(".info").removeClass("left right frame").addClass(that.text_align).html(that.text);
		that.wrap.find(".determine").html(that.determine_name).off("click").css("display", "none");
		that.wrap.find(".ok").html(that.ok_name).off("click").css("display", "none");
		that.wrap.find(".cancel").html(that.cancel_name).off("click").css("display", "none");
		if(that.type === "Pop"){
			that.openPop();
		}else if(that.type === "Confirm"){
			that.openConfirm();
		}else{
			that.openAlert();
		}
		that.wrap.css({
			width: window.innerWidth + "px",
			height: window.innerHeight + "px",
			display: "block"
		});
	},
	openPop: function(){
		//pop弹窗
		var that = this;
		that.wrap.find(".title").css("display", "none");
		setTimeout(function(){
			that.wrap.css("display", "none");
			if(that.complete){
				that.complete();
			}
		}, that.speed);
	},
	openConfirm: function(){
		//confirm弹窗
		var that = this;
		that.mask.css("display", "block");
		that.title_show = typeof that.title_show !== "undefined" ? (that.title_show ? true : false) : false;
		if(that.title_show){
			that.wrap.find(".title span").css("display", "block");
			that.wrap.find(".info").addClass("frame");
		}
		that.wrap.find(".ok").css("display", "block");
		that.wrap.find(".cancel").css("display", "block");
		that.wrap.find(".ok").on("click", function(){
			that.mask.css("display", "none");
			that.wrap.css("display", "none");
			if(that.ok){
				that.ok();
			}
			if(that.complete){
				that.complete();
			}
		});
		that.wrap.find(".cancel").on("click", function(){
			that.mask.css("display", "none");
			that.wrap.css("display", "none");
			if(that.cancel){
				that.cancel();
			}
			if(that.complete){
				that.complete();
			}
		});
	},
	openAlert: function(){
		//alert弹窗
		var that = this;
		that.mask.css("display", "block");
		that.title_show = typeof that.title_show !== "undefined" ? (that.title_show ? true : false) : true;
		if(that.title_show){
			that.wrap.find(".title span").css("display", "block");
		}else{
			that.wrap.find(".info").addClass("frame");
		}
		that.wrap.find(".determine").css("display", "block");
		that.wrap.find(".determine").on("click", function(){
			that.mask.css("display", "none");
			that.wrap.css("display", "none");
			if(that.determine){
				that.determine();
			}
			if(that.complete){
				that.complete();
			}
		});
	}
};

/*----------- 返回 $_GET 对象, 仿PHP模式 -------*/
var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        if(u[1].indexOf('#') != -1) {
            u = u[1].split("#");
            u = u[0].split("&");
        } else {
            u = u[1].split("&");
        }
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();
