/**
 *  文件: Window.js
 *  描述：
 		Dependency : 窗口类
 */
(function($){
	$.fn.dock = function(options){
		var o = this;
		var settings = $.extend({}, options);
		
		return this.each(function(){
			var obj = $(this)
			
			listItems();
			
			
			function toFisheys(){
				obj.Fisheye({
					maxWidth : 30,
					items: 'li',
					itemsText: 'span',//标题
					container: 'ul',
					itemWidth: 46, //物件的大小
					proximity: 90, //相邻的两个元素的过渡，数值越小过渡越小；
					halign : 'center',
					valign: 'bottom',
					alignment : 'left',	
				});
			}
			
			function listItems(){
				  var ul = $("<ul></ul>");
				  
				  for(var i=0; i<5; i++){
					  ul.append(addItem());  
				  }
				  
				  obj.append(ul);
				  
				  toFisheys();	
			}
			
			function addItem(){
				var dockItem = $("<li><img src='images/dock/icon-address.png' alt='title'/><span></span></li>");
				dockItem.click(function(){
					openItem();
				});
				
				return dockItem
			}
			
			function removeItem(){
				
			}
			
			function hideDock(){
				
			}
			
			function showDock(){
				
			}
			
			function openItem(){
				alert(111);
			}
			
		});
	};	  
})(jQuery);



