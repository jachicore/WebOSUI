/**
 *  文件: Dock.js
 *  描述：
 		Dependency : DOCK类
 */
(function($){
	
	function Dock(options){
		this.settings = $.extend({
				dockDiv : '.dock'
			}, options);
		this.dockDiv = $(this.settings.dockDiv);
	}
	
	Dock.prototype.init = function(path){
		this.dockDiv.html('');
		var ul = $("<ul></ul>");

		// var fileArray = $.aos.fs.ls('/home/'+$.aos.users.current+'/.dock');
		var fileArray = $.aos.fs.ls('/system/dock');
		for(var i=0; i < fileArray.length;i++){
			var f = fileArray[i];
			var node = new $.aos.ui.UINode(f);
			ul.append(this.addItem(node));
		}
		
		this.dockDiv.append(ul);
		this.toFisheys();
	}
	
	Dock.prototype.toFisheys = function(){
		this.dockDiv.Fisheye({
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
	
	Dock.prototype.addItem = function(node){
		var o = this;
		var name = node.name;

		// if(node.type == 'file'){
		// if(node.type == 'link'){
		// 			name = name.substring(0, name.lastIndexOf('.'));
		// }
		var dockItem = $("<li linkpath='"+node.linkpath+"' name='"+name+"' fatherpath='"+node.fatherpath +"'><img alt='"+name+"' title='"+name+"' src='"+node.icon.img+"' alt='title'/><span></span></li>");
		// var dockItem = $("<li path='"+node.path+"'><img alt='"+name+"' title='"+name+"' src='"+node.path+"' alt='title'/><span></span></li>");
		dockItem.click(function(){
			o.openItem(node);
		});
		
		dockItem.bind('contextmenu',function(e){
		  var o = $(this);

		  var dock_title = o.find('img').attr('title');
		  var tmp_title = dock_title.split('/');
		  for(var i=0;i<tmp_title.length;i++) {
		  	tmp_title_value = tmp_title[i];
		  }
		  var menu = $("<span class='dock-right-menu'><a href='#'>将 <span>"+tmp_title_value+"</span> 从码头移除</a></span>").css({ left: e.pageX, top: e.pageY-50, zIndex: '10000' })
		  .click(function(){
			    //alert(o.attr('path'));
				var r=confirm("确定删除【"+o.find('img').attr('title')+"】？");
				if(r){
					$.aos.fs.delete(o.attr('fatherpath'),o.attr('name'));
					$.aos.dock.init();
				}
		  })
		  .appendTo("body");
		  $(document).one('click', function(){ 
				//o.find("span").css("position","").css("height","15px");
				menu.remove();
		  });
		  
		  return false;
	   });
		
		
		return dockItem;
	}
	
	Dock.prototype.removeItem = function(){
		
	}
	
	Dock.prototype.hideDock = function(){
	}
	
	Dock.prototype.showDock = function(){
	}
	
	Dock.prototype.openItem = function(uinode){
		eval(uinode.starter);
	}
	
	
	$.aos.dock = new Dock();
	
		  
})(jQuery);



