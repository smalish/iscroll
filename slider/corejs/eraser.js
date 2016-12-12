/*
 * 刮刮卡效果
 * 调用方式：eraserInit(container, width, height, positionTop, positionLeft, fill, word, wordColor, fontSize);
 * 参数：canvas为绝对定位
 * 		container ——canvas的父容器，DOM对象，必须
 * 		width ——canvas宽，不加px，必须
 * 		height ——canvas高，不加px，必须
 *		positionTop ——canvas的top值，要加px，默认为0px
 *		positionLeft ——canvas的left值，要加px，默认为0px
 *		fill ——canvas底色，可设置图片和纯色，默认#ddd
 *		word ——canvas文本，默认空
 *		wordColor ——canvas文本颜色，默认为黑色
 *		fontSize ——canvas文本字体，不加px，默认为20px
 */

(function() {
    function createCanvas(parent, width, height, top, left) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.style.left = left || '0px'; //位于图片从左数位置
        canvas.node.style.top = top || '0px' //位于图片从上数位置
        canvas.node.style.position = 'absolute';
        canvas.node.width = width || 100; //蒙层宽度
        canvas.node.height = height || 100; //蒙层高度
        parent.appendChild(canvas.node);
        return canvas;
    }
    // 计算擦除的百分比
    function getTransparentPercent(ctx, width, height) {
        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            transPixs = [];
        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        // 通过判断每个像素点来计算百分比
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    }
    eraserInit = function (container, width, height, top, left, fillColor, word, color, size) {
        var canvas = createCanvas(container, width, height, top, left),
        	ctx = canvas.context,
			text = function(){
				setTimeout(function(){
					ctx.fillStyle = color || "#000";//设置填充样式
					ctx.font = "bolder " + (size || 20) + "px sans-serif";//设置字体
					ctx.textBaseline = "middle";//设置字体垂直对齐方式（top,hanging,middle,alphabetic,ideographic,bottom），默认为alphabetic。
					ctx.textAlign = "center";//设置字体水平对齐方式（start,end,left,right,center），默认为start。
					ctx.fillText(word || "", width / 2, height / 2);//填充字符串，在(0, 0)处开始写入字符串，最大长度400px(选填)。
				}, 200);
			};
		ctx.fillCircle = function(x, y, radius, fillColor) {
			this.fillStyle = fillColor;
			this.beginPath();
			this.moveTo(x, y);
			this.arc(x, y, radius, 0, Math.PI * 2, false);
			this.fill();
		};
		if(fillColor.indexOf(".") < 0){
			ctx.clearTo = function(fillColor) {
				ctx.fillStyle = fillColor;
				ctx.fillRect(0, 0, width, height);
			};
			ctx.clearTo(fillColor || "#ddd");
			text();
		}else{
			/* 图像显示开始 */
			var flag = false,
				img = new Image();//创建image对象
			img.onload = function(){
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);//绘制将局部区域进行放大后的图像
				text();
			}
			img.src = fillColor;
			/* 图像显示结束 */
		}

        //canvas区域内touch事件绑定、处理
        canvas.node.addEventListener("touchmove", function(e) {
        	 e.preventDefault();
        	 var x = e.changedTouches[0].clientX + window.scrollX - container.offsetLeft;
             var y = e.changedTouches[0].clientY + window.scrollY - container.offsetTop;
             var radius = 10; // 划开区域大小
             var fillColor = '#000';
             //只绘制先绘制图形不相交的部分,由先绘制图形的填充覆盖,其余部分透明
             ctx.globalCompositeOperation = 'destination-out';
             ctx.fillCircle(x, y, radius, fillColor);
			 //显示擦除比率
			 //var rate = getTransparentPercent(ctx, width, height);
			 //console.log(rate);
        }, false);
    }
})();
