/**
 *  文件: Window.js
 *  描述：
 		Dependency : 窗口类
 */
(function($){
		  
		  var winidindex = 0;
		  var maxZindex = 200;
		  var beginZindex = 10;
		  
			function Window(options){
				this.contens = "";      								// 描述windows的html代码
				this.win;       										// windows的jquery对象, win = $(contents)
				this.winMinimize;										//最小化后的win对象
				this.winid = "winid"+winidindex++;						//window ID
				this.isMinimize = false;								//是否已最小化
				this.isMaxmize = false;									//是否已最大化
				this.loadContentsType = '';								//内容载入类型： 'iframe','contents','html'
				this.winContent = '';									//window 内容, 可以是HTML代码片段也可是URL
							
				this.settings = $.extend( {
					  appendTo : $('._main'),                           //window的载体
					  //minimizeWindowBar : $(".minimizeWindowBar"),    
					  minimizeIcon : 'images/icons/add_icon.png',		//最小化后的窗口图标
					  width : 800,										//宽度
					  height : 300,										//高度
					  minWidth: 300,									//最小宽度
					  minHeight: 200,									//最小高度
					  left : 150+winidindex*5,							//方位-左
					  top : 50+winidindex*5,							//方位-高
					  title : '',										//标题
					  url : '',											//载入的页面URL（可选）
					  draggable : true,									//支持拖拽
					  resizable : true,									//支持拖动大小
					  overlay : true,									//支持失去焦点时遮挡
					  initMaxsize : false,								//初始最大化
					  modal : false,									//遮挡层
					  loadingCompleted : function(){},					//当内页加载完成时执行
					  windata : {self: this}							//传道内页的数据
				}, options);
				
				this.settings.windata = $.extend({self: this},this.settings.windata);
				this.height = this.settings.height;
				this.width = this.settings.width;
				this.frame = null;
//				this.width = obj.width?obj.width-0:800;
//				this.height = obj.height?obj.height-0:300;
//				this.left = obj.left && obj.left!='0'?obj.left-0:150+winidindex*5;
//				this.top = obj.top && obj.left!='0'?obj.top-0:50+winidindex*5;
//				this.title = obj.title?obj.title:"";
//				this.url = obj.url?obj.url:"";
				
				this.init();
				if(this.settings.initMaxsize){
					this.maxmize(this.winid);	
				}
			}
			
			//初始化窗口
			Window.prototype.init = function(){
				
				var o = this;
				var _left = isNaN(this.settings.left)?this.settings.left:(this.settings.left+"px");
				var _top = isNaN(this.settings.top)?this.settings.top:(this.settings.top+"px");
				
				this.contens = "<div id=\""+this.winid+"\" class=\"am-window am-border-radius\" style=\"position:absolute; z-index:"+maxZindex+"; width:"+this.settings.width+"px; height:"+this.settings.height+"px; left:"+_left+"; top:"+_top+"\" prePosition-x='' prePosition-y='' prePosition-h='' prePosition-w='' >";
				this.contens += "	<div class=\"am-window-bar\">";
				this.contens += "		<h3>"+this.settings.title+"</h3>";
				this.contens += "		<div class=\"am-window-bar-control\">";
				this.contens += "			<a class='icon_refresh' href=\"#\"></a>";
				this.contens += "			<a class='icon_min' href=\"#\"></a>";
				this.contens += "			<a class='icon_max' href=\"#\"></a>";
				this.contens += "			<a class='icon_close' href=\"#\"></a>";
				this.contens += "		</div>";
				this.contens += "	</div>";
				this.contens += "	<div id=\""+this.winid+"_content\" class=\"am-window-content\" style=\"width:"+this.settings.width+"px; height:"+(this.settings.height-10)+"px;\" >";
				this.contens += "		<div class=\"am-window-content-resize-overlay\" style=\"width:100%; height:"+(this.settings.height-10)+"px; position:absolute; z-index:2; top:20; left:0;\" ></div>";
				this.contens += "	</div>";
				//this.contens += "	<div style=\"width:100%; height:"+(this.settings.height+24)+"px;  z-index:"+maxZindex+++";\" class=\"am-window-content-overlay\"> ";
				this.contens += "</div>";
				
				var winMinCont = "";
				winMinCont += "";
				
				//$('a.selected', $("#_minimizeBar")).removeClass("selected");  // 把其他的最小化图标高亮去掉
				this.winMinimize = $("<li id='"+this.winid+"_minz' class='show'><a class='selected' href='#'><img src='"+this.settings.minimizeIcon+"' /></a></li>").click(function(){
					$("#"+o.winid).show();
					o.aboveAll();
					o.isMinimize = false;
					//$('a.selected', $("#_minimizeBar")).removeClass("selected");
					//$(this).find('a').addClass("selected");
				}).appendTo('#_minimizeBar');
				
				var win = $(this.contens);
				win.appendTo(this.settings.appendTo);
				
				win.find(".am-window-bar").dblclick(function(){
					o.maxmize(o.winid);									
				});
				
				
				//判断是否设置了失去焦点时遮挡窗体
				//因为考虑到文件浏览器窗口可能要支持响应拖拽事件，所以当窗体是文件浏览器时overlay设置为false
				if(this.settings.overlay){
					var content_overlay = $("<div style=\"width:100%; height:"+(this.settings.height+20)+"px;  z-index:"+maxZindex+";\" class=\"am-window-content-overlay\">");
					content_overlay.mousedown(function(){
						o.aboveAll();
						return false;    //消除窗口跟随鼠标移动
					}).appendTo(win);
				}
				else{
					win.find(".am-window-bar").mousedown(function(){
						o.aboveAll();
					});
				}
				
				if(this.settings.modal){
					var overlay = $("<div class='lightbox_overlay' id='lightbox_overlay_"+this.winid+"'></div>");
					overlay.css({ zIndex : maxZindex });
					overlay.appendTo("body");
					win.find(".icon_min").hide();
					win.find(".icon_max").hide();
					this.settings.resizable = false;
				}
				
				win.find(".icon_min").click(function(){
					if(!o.isMinimize){
						o.minimize(o.winid);
					}
				});
				win.find(".icon_max").click(function(){
					o.maxmize(o.winid);								
				});
				win.find(".icon_close").click(function(){
					
					o.close(o.winid);								
				});
				win.find(".icon_refresh").click(function(){
					o.refresh(o);							
				});
				
				
				/*================== 设置窗体拖拽 =======================*/
				if(this.settings.draggable){
					win.draggable({ 
						handle: $(this).find(".am-window-bar"), 
						opacity: 0.7,
						containment: [0-win.width(),0, $(window).width(),$(window).height()-80],
						start: function(event, ui){
							win.find(".am-window-content-resize-overlay").show();
							o.onDragStart(event,ui);
						},
						stop: function(event, ui){
							win.find(".am-window-content-resize-overlay").hide();
							o.onDragStop(event,ui);
						}
					});
				}
				
				/*================== 设置改变大小拖拽 =======================*/
				if(this.settings.resizable){
					win.resizable({
						alsoResize: win.find(".am-window-content"),
						minHeight: o.settings.minHeight,
						minWidth: o.settings.minWidth,
						start: function(event, ui){
							win.find(".am-window-content-resize-overlay").show();
							o.onResizeStart(event,ui);
						},
						resize: function(event, ui) { 
							win.find(".am-window-content-resize-overlay").css('height', win.find(".am-window-content").css('height'));
							win.find(".am-window-content-overlay").css('height', win.find(".am-window-content").css('height'));
							o.height = win.find(".am-window-content").height();
							o.width = win.find(".am-window-content").width();
							o.onResize(event,ui);
						},
						stop: function(event, ui){
							win.find(".am-window-content-resize-overlay").hide();
							//win.find(".am-window-content-resize-overlay").css('height', win.find(".am-window-content").css('height'));
							//win.find(".am-window-content-overlay").css('height', win.find(".am-window-content").css('height'));
							o.height = win.find(".am-window-content").height();
							o.width = win.find(".am-window-content").width();
							o.onResizeStop(event,ui);
						}
					});
				}
				
				
				this.win = win;
				this.winContent = win.find(".am-window-content");
				
				o.loadingStar();
				o.aboveAll();
			};
			
			
			// 当窗口开始Resize时提供的外部接口
			Window.prototype.onResizeStart = function(event,ui){};
			// 当窗口结束Resize时提供的外部接口
			Window.prototype.onResizeStop = function(event,ui){};
			// 当窗口进行Resize时提供的外部接口
			Window.prototype.onResize = function(event,ui){};
			// 当窗口开始Drag时提供的外部接口
			Window.prototype.onDragStart = function(event,ui){};
			// 当窗口结束Drag时提供的外部接口
			Window.prototype.onDragStop = function(event,ui){};
			// 当窗口进行Drag时提供的外部接口
			Window.prototype.onDrag = function(event,ui){};
			// 当窗口最大化时提供的外部接口
			Window.prototype.onMaxmize = function(){};
			// 当窗口最小化时提供的外部接口
			Window.prototype.onMinimize = function(){};
			// 当窗口关闭时提供的外部接口
			Window.prototype.onClose = function(){};
			// 提供的外部接口，当aboveAll结束时执行
			Window.prototype.onAboveAll = function(){};
			// 提供的外部接口，当frame载入完成时执行
			//Window.prototype.onLoadingCompleted = function(){}
			
			
			// 显示加载状态
			Window.prototype.loadingStar = function(){
				var css = {'background-color':'#6dbedf', 'background-image' : 'url(images/common/loading.png)', 'background-repeat' : 'no-repeat', 'background-position': 'center'};
				this.win.find('.am-window-content-resize-overlay').css(css).show();
				//this.win.find('.am-window-content-resize-overlay').css('background', '#6dbedf url(images/blue/loading.png) no-repeat fixed center').show();
			};
			
			// 加载状态结束
			Window.prototype.loadingStop = function(){
				var css = {'background-color':'', 'background-image' : '', 'background-repeat' : '', 'background-position': ''};
				this.win.find('.am-window-content-resize-overlay').fadeOut(500, function(){
					$(this).css(css);																		 
				});
			};
			
			
			//前置窗口
			Window.prototype.aboveAll = function(){
				maxZindex++;
				this.win.css('z-index', maxZindex);	
				maxZindex++;
				$('.am-window-content-overlay').show();
				this.win.find('.am-window-content-overlay').css('z-index', maxZindex).hide();
				
				//最小图标的高亮处理
				$('a.selected', $("#_minimizeBar")).removeClass("selected");     // 把其他的最小化图标高亮去
				$("#"+this.winid+"_minz").find('a').addClass("selected");
				
				this.onAboveAll();
			};
			
			// 最小化化窗口
			Window.prototype.minimize = function(winid){
				var o = this;
				o.isMinimize = true;
				var win = $("#"+winid);
				win.hide();
				
				o.onMinimize;
				o.onResize();
			};
			
			// 最大化窗口
			Window.prototype.maxmize = function(winid){
				var o = this;
				var win = $("#"+winid);
				if(this.isMaxmize){
					this.restorePosition(win);
					this.isMaxmize = false;
					win.css("position", "absolute");
				}else{
					this.recordPosition(win);
					this.isMaxmize = true;
					var width = $(window).width();
					var height = $(window).height();
					
					win.width(width);
					win.height(height-50);
					win.find(".am-window-content").width(width);
					win.find(".am-window-content").height(height-56);
					this.width = width;
					this.height = height-56;
					win.css("position", "fixed");
					win.css("top",0);
					win.css("left",0);
				}
				this.onMaxmize();
				this.onResize();
			};
			
			// 刷新窗口
			Window.prototype.refresh = function(obj){
				//console.log(obj.loadContentsType);
				var obj = typeof(obj)=="undefined"?this:obj;
				switch(obj.loadContentsType){
					case "iframe" : 
						obj.loadIframe(obj.winContent);
						break;
					case "contents" : 
						obj.loadContents(obj.winContent);
						break;
					case "html" : 
						obj.loadHTML(obj.winContent);
						break;
				}
			};
			
			// 关闭窗口
			Window.prototype.close = function(winid){
				var winid = typeof(winid)=="undefined"?this.winid:winid;
				$("#"+winid).remove();
				$("#"+winid+'_minz').remove();
				$.aos.win.del(this);
				if(this.settings.modal){$("#lightbox_overlay_"+this.winid).remove();}
				this.onClose();
			};
			
			// 重置窗口
			Window.prototype.restorePosition = function(win){
				win.css("width",win.attr("prePosition-w")-0);
				win.css("height",win.attr("prePosition-h")-0);
				win.find(".am-window-content").css("width",win.attr("prePosition-w")-0);
				win.find(".am-window-content").css("height",win.attr("prePosition-h")-6);
				this.height = win.attr("prePosition-h")-6;
				this.width = win.attr("prePosition-w")-0;
				win.css("top",win.attr("prePosition-y")-0);
				win.css("left",win.attr("prePosition-x")-0);
			};
			
			// 记录窗口坐标
			Window.prototype.recordPosition = function(win){
				win.attr("prePosition-x",win.css("left").substring(0,win.css("left").length-2));
				win.attr("prePosition-y",win.css("top").substring(0,win.css("top").length-2));
				win.attr("prePosition-h",win.css("height").substring(0,win.css("height").length-2));
				win.attr("prePosition-w",win.css("width").substring(0,win.css("width").length-2));
			};
			
			
			// 加载iframe
			Window.prototype.loadIframe = function(url){
				$(".am-window-content-iframe",this.win).remove();
				this.loadContentsType = "iframe";
				this.winContent = url;
				var o = this;
				var frame = $("<iframe class='am-window-content-iframe' scrolling=\"auto\" frameborder=\"0\" src=\""+url+"\" ></iframe>");
				this.win.find(".am-window-content").append(frame);
				frame.attr('onload', function(){
					var iwin = frame.get(0).contentWindow; 
					iwin.windata = o.settings.windata;
					o.loadingStop();
				});
				this.frame = frame;
				return this;
			};
			
			// 加载contents,参数为HTML代码
			Window.prototype.loadContents = function(c){
				$(".am-window-content > div.am-window-content-resize-overlay",this.win).siblings().html('');
				this.loadContentsType = "contents";
				this.winContent = c;
				this.win.find(".am-window-content").append(c);
				this.loadingStop();
				return this;
			};
			
			// 加载HTML页面
			Window.prototype.loadHTML = function(url){
				$(".am-window-content > div.am-window-content-resize-overlay",this.win).siblings().html('');
				this.loadContentsType = "html";
				this.winContent = url;
				var o = this;
				this.win.find(".am-window-content").load(url,function(){
					o.loadingStop();
				});
				return this;
			};
			
			/*=========================================================================================*/
			
			function WindowManager(){
			}
			
			WindowManager.prototype.create = function(options){
					var w = new Window(options);
					$.aos.desktop.currentDesktop.addWindow(w);
					return w;
			};
			
			WindowManager.prototype.del = function(win){
					$.aos.desktop.currentDesktop.removeWindow(win);
			};
			
			WindowManager.prototype.closeAll = function(){
					$.aos.desktop.currentDesktop.closeAllWindows();
			};
			
			WindowManager.prototype.hideAll = function(){
					$.aos.desktop.currentDesktop.hideAllWindows();
			};
			
			WindowManager.prototype.showAll = function(){
					$.aos.desktop.currentDesktop.showAllWindows();
			};
			
			WindowManager.prototype.error = function(obj){
					alert('该文件无法打开！！');
			};
			
			$.aos.win = new WindowManager();

})(jQuery);
