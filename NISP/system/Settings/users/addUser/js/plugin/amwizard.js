/**
 *  文件: amwizard.js
 *  描述：
 		  安装向导的jquery插件
 */
 
(function($){

  $.fn.amwizard = function(options) {
        var defaults = {
              animation:true,   // Animation Effect on navigation, true/false         
              validatorFunc:function(){return true;} // Step validation function, Step index will be passed
        };
        var options = $.extend(defaults, options);  
		
		return this.each(function() {
              var obj = $(this); 
			  var currentStep = $('ul.steps > li.fir-selected',obj);
			  var steps = $('ul.steps > li',obj).length-1;
			  
			  // 顶部导航的点击事件
			  $('ul.steps > li',obj).each(function(i){
				  var cont = $('#'+$('a', $(this)).attr('name'));
				  $(this).css('left',(i*110)+'px');
				  if(i != 0){
					  cont.css('display','none');
				  }
				  
				  $(this).data('step', i);
				  
				  $(this).click(function(){
					  //1. 判断是否有step-disable，有则不能点击
					  if(!$(this).hasClass('step-disable')){
						  //2. 显示tab内容,隐藏其他
						  cont.css('display','block');
						  cont.siblings().css('display','none');
						  
						  //3. 高亮step
						  $(this).addClass('selected').siblings().removeClass('selected');
					  }
				  });
			  });
			  
			  // 下一步按钮的点击事件
			  $('.wizard-btn > div.next', obj).click(function(){
				    // 1. 判断当前是不是最后一个Step
					// 2. Yse:  1）显示下一个step内容，隐藏其他
					//			2）高亮step导航
					//			3）显示"上一步"按钮
					//			4）设置checked状态
					//			5）设置step导航的disable
					//			6）重新赋值currentStep
					//			7）判断是否为最后一步
					//          8）yes : 改变按钮文字'完成'
					// 3. no :  1）设置checked状态
					var stepIndex = currentStep.data('step');
					if(options.validatorFunc(stepIndex)){
						if(currentStep.next().length != 0){
							var nextCont = $('#'+$('a', currentStep.next()).attr('name'));
							nextCont.css('display','block');
							nextCont.siblings().css('display','none');
							currentStep.next().removeClass('step-disable').addClass('selected').siblings().removeClass('selected').removeClass('fir-selected');
							$(this).prev('div.prev').css('display','block');
							$('a', currentStep).addClass('checked');
							
							currentStep = currentStep.next();
							if(currentStep.next().length == 0){
								$('a', $(this)).html('完 成');
							}
						}else{
							$('a', currentStep).addClass('checked');
						}
					}
			  });
			  
			  
			// 上一步按钮的点击事件
			$('.wizard-btn > div.prev',obj).click(function(){
				// 1. 判断当前是不是第一个Step
				// 2. Yse:  1）显示上一个step内容，隐藏其他
				//			2）高亮step导航
				//			3）下一步按钮文字切换为"下一步"
				//			4）设置checked状态
				//			5）设置step导航的disable
				//			6）重新赋值currentStep
				//			7）判断是否为第一步
				//          8）yes : 隐藏按钮
				if(currentStep.prev().length != 0){
					var nextCont = $('#'+currentStep.prev().find('a').attr('name'));
					nextCont.css('display','block');
					nextCont.siblings().css('display','none');
					currentStep.addClass('step-disable');
					currentStep.prev().addClass('selected').siblings().removeClass('selected');
					$(this).next('div.next').find('a').html('下一步 &gt;&gt;');
					$('a', currentStep).removeClass('checked');
					
					currentStep = currentStep.prev();
					if(currentStep.prev().length == 0){
						$(this).css('display','none');
						$('a', currentStep).removeClass('checked');
						currentStep.removeClass('selected').addClass('fir-selected');
					}
				}
			});
			  
		});
  };

})( jQuery );
