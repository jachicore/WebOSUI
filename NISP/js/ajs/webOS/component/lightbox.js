/**
 *  文件: desktop.js
 *  描述：
 		Dependency : 桌面管理器类
 */
(function($){
		 
			function Lightbox(options){
				this.appendDiv = "body";
				this.lightbox;
				this.loadedContent;
				
				this.settings = $.extend(true, {
					  width : 800,
					  height : 360,
					  top: '20%',
					  closable: true
				}, options);
				
				this.init();
			}
			
			// 初始化Lightbox
			Lightbox.prototype.init = function(){
				var o = this;
				var overlay = $("<div class='lightbox_overlay'></div>");
				var lightbox = $("<div class='lightbox' style=\"position:relative; z-index:1; width:"+this.settings.width+"px; height:"+this.settings.height+"px; top:"+this.settings.top+" \"></div>");
				var lightbox_contents = $("<div class='lightbox_contents'></div>");
				var lightbox_close = $("<span class='lightbox_close'></span>");
				
				if(this.settings.closable){
					lightbox_close.click(function (){
						o.del();
					});
					lightbox.append(lightbox_close);
				}
				lightbox.append(lightbox_contents);
				lightbox.appendTo(overlay);
				overlay.appendTo(o.appendDiv);
				
				this.lightbox = lightbox;
				
				return this
			}
			
			
			// 加载iframe
			Lightbox.prototype.loadIframe = function(url){
				frame = $("<iframe scrolling=\"auto\" frameborder=\"0\" src=\""+url+"\" style=\"width: "+(this.settings.width-20)+"px; height: "+(this.settings.height-30)+"px \" ></iframe>");
				this.lightbox.find(".lightbox_contents").append(frame);
				return this;
			}
			
			// 加载contents,参数为HTML代码
			Lightbox.prototype.loadContents = function(c){
				this.lightbox.find(".lightbox_contents").append(c);
				this.loadedContent = c;
				return this;
			}
			
			// 加载HTML页面
			Lightbox.prototype.loadHTML = function(url, func){
				var o = this;
				this.lightbox.find(".lightbox_contents").load(url,function(){
						o.loadedContent = $(this).children();
						func();
				});
				return this;
			}
			
			// 删除Lightbox
			Lightbox.prototype.del = function(url){
				$(".lightbox_overlay").remove();	
			}
			
			/*=========================================================================================*/
			
			function LightboxManager(){
			}
			
			LightboxManager.prototype.create = function(options){
					return new Lightbox(options);
			}
			
			LightboxManager.prototype.del = function(){
					$(".lightbox_overlay").remove();
			}
			
			$.aos.lightbox = new LightboxManager();
			
			
			

})(jQuery);



