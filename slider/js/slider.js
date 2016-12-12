$(function() {

  var slider = {
    init: function(){
      var that = this;

      that.img_index = 1;
      that.sum = $('#wrapper .slider li').length;

      that.initStyle();

      //创建iscroll
      //Options.snap自动分割容器，用于制作走马灯效果等。Options.snap:true //根据容器尺寸自动分割Options.snap:el// 根据元素分割
      //options.momentum  是否开启动量动画，关闭可以提升效率,默认值true
      that.bigiScroll = new IScroll('#wrapper', {scrollX:true, scrollY:false, snap:true, momentum:false, click:that.iScrollClick()});
      that.bigiScroll.currentPage.pageX = that.img_index;
      that.bigiScroll.pageSize = that.sum;

      that.slideInit(that.bigiScroll);
      that.slidePic(that.bigiScroll);
    },
    slideInit: function(iscrollInstance){
      var that = this;
      iscrollInstance.scrollToElement($(iscrollInstance.wrapper).find('li').eq(iscrollInstance.currentPage.pageX)[0], 0);
      iscrollInstance.on('scrollEnd', function(){
        that.slidePic(this);
      });
    },
    slidePic:function(iscrollInstance){
        $(iscrollInstance.wrapper).find('.on').removeClass('on');
        $(iscrollInstance.wrapper).find('.dot li').eq(iscrollInstance.currentPage.pageX).addClass('on');
    },
    //初始化样式
    initStyle: function(){
      var that = this;

      $('#wrapper .slider').css('width', that.sum*100 + '%');
      $('.slider li').css('width', 100/that.sum + '%');
    },
    iScrollClick :function(){
      // iscroll滑动列表 click参数兼容性判断
      if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
      if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
      if (/Silk/i.test(navigator.userAgent)) return false;
      if (/Android/i.test(navigator.userAgent)) {
        var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
        return parseFloat(s[0]+s[3]) < 44 ? false : true
      }
    
    }
  }
  //函数入口
  slider.init();

})
