/**
 *  文件: amcalendar.js
 *  描述：
 		  简介好用的日历Widget
		  
		  1. 取得当前要显示的月份的1号是在星期几
		  2. 取得当前要显示的月份一共有多少天的表格）
		  4. 根据显示的月份1号所在星期几空出前面的不属于该月日期的表格单元格
		  5. 根据显示的月份1号所在星期几来决定生成表格时从星期几开始生成日历显示（第一天在星期几）
		  6. 根据一共有多少天来顺次生成指定天数，另外每生成七个单元格需要加入一个表格的换行
		  7. 补足HTML表格空缺的单元
		  8.如果日期为当前日期设置current 的class='b_yellow'
 */
 
(function($){

  var myStylesLocation = 'js/ajs/webOS/component/widget/amcalendar.css';
  $('<link rel="stylesheet" type="text/css" href="'+myStylesLocation+'" >').appendTo("head");

  $.fn.amcalendar = function(options) {
        var defaults = {
            date : new Date(),
			selectedCss : 'aui-calendar-b_yellow',
			detail : false,
			prevNum : 1,  //点击上一月的次数
			nextNum : 1   //点击下一月的次数
        };
		
        var options = $.extend(defaults, options);  
		//console.log('prevNum : '+options.prevNum+" nextNum : "+options.nextNum);
		
		return this.each(function() {
			var obj = $(this); 
			var _days = getDaysByMonth(new Date(options.date));
			var _lastDays = getDaysByLastMonth(new Date(options.date));
			var _nextDays = getDaysByNextMonth(new Date(options.date));
			var fir_date = new Date(options.date);
			fir_date.setDate(1);
			var fir_date_in_week = fir_date.getDay();
			
			var curt = 1;//日期中的1号，最大值为当月的最后一天
			var curt2 = 1;//日期中的1号，最大值为7
			
			var mainCont = "";  //主框体内容
			mainCont += "<div class='aui-calendar-middle'>";
			mainCont += "        <div class='aui-calendar-today'>";
			mainCont += "            <p class='aui-calendar-week'></p>";
			mainCont += "            <p class='aui-calendar-date'></p>";
			mainCont += "            <p class='aui-calendar-month'></p>";
			mainCont += "        </div>";
			mainCont += "        <div class='aui-calendar-date_list'>";
			mainCont += "        	<div class='aui-calendar-d_month'><a style='float:left' class='aui-calendar-prev'></a><span class='aui-calendar-currentmonth'></span><a style='float:right' class='aui-calendar-next'></a></div>";
			mainCont += "            <div class='aui-calendar-d_week'></div>";
			mainCont += "            <div class='aui-calendar-d_date'></div>";
			mainCont += "        </div>";
			mainCont += "    </div>";
			mainCont += "    <div class='aui-calendar-btn'>";
			mainCont += "    	<a class='aui-calendar-close_btn' href='#'></a>";
			mainCont += "    	<a class='aui-calendar-chg open_btn' href='#'></a>";
			mainCont += "</div>";
			
			obj.append(mainCont);
			obj.css('width','186px').css('height','165px').css('overflow','hidden')
			   .css('position', 'fixed').css('zIndex', 150).css('top', '10%').css('right','3%');
			
			//判断显示总览还是详情
			if(options.detail){
				$(".aui-calendar-today", obj).hide();
				$(".aui-calendar-date_list", obj).show();
			}
			
			var dayCont = '';  // 日期内容
			//开始生产日历 6(行) X 7(列) 个格子
			for(var r=0; r<6; r++){
				dayCont +=	"<p>";
				//第一行特殊处理
				if(r==0){
					for(var c=0; c<7; c++){
						if(c >= fir_date_in_week){
							dayCont += "	<span>"+curt+"</span>";
							curt++;
						}else{
							dayCont += "	<span class='aui-calendar-c_gray'>"+(_lastDays-7+fir_date_in_week)+"</span>";	
							_lastDays++;
						}
					}	
				}else{
					for(var c=0; c<7; c++){
						if(curt < _days){
							dayCont += "	<span>"+curt+"</span>";
						}else if(curt == _days){
							dayCont += "	<span class='"+options.selectedCss+"'>"+curt+"</span>";
						}else{
							dayCont += "	<span class='aui-calendar-c_gray'>"+curt2+"</span>";	
							curt2++
						}
						curt++;
					}
				}
				dayCont +=	"</p>";
			}
			$(".aui-calendar-d_date", obj).append(dayCont);
			
			//year month 格式2012年3月
			var cumonth = options.date.getMonth()+1;
			var cuyear = options.date.getFullYear();
			var currentmonth = cuyear+'年'+cumonth+'月';
			$('.aui-calendar-currentmonth', obj).append(currentmonth);
			$('.aui-calendar-date', obj).append(options.date.getDate());
			$('.aui-calendar-month', obj).append(currentmonth);
			//week   格式'日','一','二','三','四','五','六'
			var content3 ='';
			var _weekday = new Array('日','一','二','三','四','五','六');
			var _dayweek = options.date.getDay();
			var _todayweek ='星期'+ _weekday[options.date.getDay()];
			
			for(i =0; i<_weekday.length; i++){
				if(_dayweek == i ){
						
					content3 +="<span class='aui-calendar-c_yellow'>"+_weekday[i]+"</span>";
				}else{
					content3 +="<span>"+_weekday[i]+"</span>";
				}
			}
			$('.aui-calendar-week', obj).append(_todayweek);
			$(".aui-calendar-d_week", obj).append(content3);
			
			$('.aui-calendar-prev',obj).click(function(){
					obj.html('');
					var pre = new Date();
					pre.setDate(1);
					pre.setMonth(new Date().getMonth()-options.prevNum);
					options.prevNum++;
					obj.amcalendar({
						date : pre, 
						selectedCss : '', 
						detail : true,
						prevNum : options.prevNum,
						nextNum : options.nextNum
					});
			});
			
			$('.aui-calendar-next',obj).click(function(){
					obj.html('');
					var next = new Date();
					next.setDate(1);
					next.setMonth(next.getMonth()+options.nextNum);
					//console.log(next.getMonth());
					//console.log(options.nextNum++);
					obj.amcalendar({
						date : next, 
						selectedCss : '', 
						detail : true,
						prevNum : options.prevNum,
						nextNum : options.nextNum
					});
			});
			
			/*btn show/hide draggable()*/
			obj.mouseover(function(){
				$(".aui-calendar-btn", obj).show();
			}).mouseout(function(){
				$(".aui-calendar-btn", obj).hide();
			}).draggable();

				/*change div&btn*/
			$(".aui-calendar-chg", obj).toggle(function(){		
				$(".aui-calendar-today", obj).hide();
				$(".aui-calendar-date_list", obj).show();			
				$(this).removeClass("aui-calendar-open_btn");
				$(this).addClass("aui-calendar-putaway_btn");
			}
			,function(){
				$(".aui-calendar-date_list", obj).hide();
				$(".aui-calendar-today", obj).show();
				$(this).removeClass("aui-calendar-putaway_btn");
				$(this).addClass("aui-calendar-open_btn");
			});
			
			/*close*/
			$(".aui-calendar-close_btn", obj).click(function(){
				obj.hide();		
			});
			
		});
		
		
		function getDaysByMonth(date){
			var curDate = date;
			var curMonth = curDate.getMonth();
			curDate.setMonth(curMonth + 1);
			curDate.setDate(0);
			return curDate.getDate();
		}
		
		function getDaysByLastMonth(date){
			date.setDate(0);
			return date.getDate();	
		}
		
		function getDaysByNextMonth(date){
			var curDate = date;
			var curMonth = curDate.getMonth();
			curDate.setMonth(curMonth + 2);
			curDate.setDate(0);
			return curDate.getDate();
		}

		
		
  };

})( jQuery );
