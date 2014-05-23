// JavaScript Document
// NISP套件类
(function($){
	
	function GnSuite(){
		this.path = "";
		this.host = "";
		this.dataSource = {};
		this.navList = new Array();
		this.funcList = new Array();
		this.tips = ["提示：当你需要反复查看某段时间的数据时，您可以选择将生成好的数据导出成Grid格式保存在自己的桌面上，方便查看...","tip1","tip2","tip3","tip4","tip5","tip6","tip7"];
		this.isToolbarMinimize = false;
	}
	
	GnSuite.prototype.init = function(options){
		
		var settings = {
			data : [],
			path : '',
			callback : function(){},
		};
		
		$.extend(true,settings,options);
		
		if(settings.path != ''){
			settings.data = this.loadData(settings.path);
			this.path = settings.path;
		}
		
		var o = this;
		
		this.wrap = $("<div class='wrap'></div>");
		this.header = $("<div class='header'></div>");
		this.navTab = $("<div class='nav-tab'></div>");
		
		this.navTabTitle = $("<div class='nav-tab-title'></div>");
		this.navFloatBtn = $("<span class='float-btn'>最小化导航栏</span>");
		this.navFloatBtn_rebuild = $("<span style='display:none' class='float-btn'>立即生效策略</span>");
		this.container = $("<div class='container'></div>");
		this.sidebar = $("<div class='sidebar'></div>");
		this.flexBtn = $("<div class='flex-btn' style='cursor:e-resize'><span></span></div>");
		this.frame = $("<div class='iframe'><iframe id='iframe' name='iframe'  width='100%' height='100%' frameborder='0' src=''></iframe></div>");
		this.iframe = this.frame.find("#iframe");
		this.iframe.css({overflow:'auto'});
		
		var _dialog = '';
			_dialog += "<div class='dialog'>";
			_dialog += "     <div class='title'>";
			_dialog += "         <h4></h4>";
			_dialog += "         <div>";
			_dialog += "         <span class='del'>X</span>";
			_dialog += "         </div>";
			_dialog += "     </div>";
			_dialog += "     <div class='boxmain'></div>";
			_dialog += "     <div class='btnbar'>        ";
/*			_dialog += "          <input type='submit' value='完成' class='btnsty1 submit'>        ";
			_dialog += "          <input type='submit' value='取消' class='btnsty1 cancel'>      ";*/
			_dialog += "     </div>";
			_dialog += "</div>";
		
		this.dialog = $(_dialog);
		
		this.overlay = $("<div class='shade-layer'></div>");
		
		this.loadingIcon = $("<div class='loading-layer'><div class='border'><img width='100' height='100'  src='css/images/dg-loading.gif' /><div class='notes'>当前操作的数据量较大，请耐心等候...</div><p>"+this.tips[0]+"</p></div></div>");
		
		
		this.container.append(this.sidebar).append(this.flexBtn).append(this.frame);
		
		this.navTabTitle.append(this.navFloatBtn).append(this.navFloatBtn_rebuild);
		this.navTab.append(this.navTabTitle);
		this.header.append(this.navTab);
		this.wrap.append(this.header).append(this.container);
		
		$("body").append(this.wrap).append(this.dialog).append(this.overlay).append(this.loadingIcon);
		
		this.overlay.css({height: $(document).height()+$(document).scrollTop()});
				
		// 收缩按钮
		this.flexBtn.find("span").toggle(function(){
			//o.sidebar.hide();
//			o.frame.css({width:'99%'});
			o.hideSidebar();
			o.flexBtn.show();
		},function(){
			o.showSidebar();
			//o.sidebar.show();
//			o.sidebar.css({width:'14%'});
//			o.frame.css({width:'85%'});
		});
		
		
		this.flexBtnCurrentPosition = $(".flex-btn").position().left*1;
		
		this.flexBtn.draggable({ 
			axis: "x",
			containment: "parent",
			iframeFix: true,
			stop: function( event, ui ){
				//console.log(flexBtnCurrentPosition);
				var _pl = $(this).position().left*1;
				var _sw = $(".sidebar").width()*1;
				var _iw = $(".iframe").width()*1;
				var total = _sw+_iw;
				$(".sidebar").css({width: ((_sw + _pl - o.flexBtnCurrentPosition)/total*100)+'%'});
				$(".iframe").css({width: ((_iw - _pl + o.flexBtnCurrentPosition)/total*100-1)+'%'});
				/*$(".sidebar").width(_sw + _pl - flexBtnCurrentPosition);
				$(".iframe").width(_iw - _pl + flexBtnCurrentPosition);*/
				o.flexBtnCurrentPosition = _pl;
				$(this).css({left:0});
			}
		});
		
		
		// 生成Nav
		settings.data.find("nav").each(function(i){
			//创建导航
			var nav = new SuiteNavigation();
			nav.id = i;
			nav.name = $(this).attr("name");
			nav.dataSource = $(this).children();
			nav.pObj = o.navTab;
			nav.action = $(this).attr("action");
			nav.init();

			o.navList.push(nav);
			if(i == 0){
				nav.selfObj.show();
				
			}
			//遍历funcList
			if(nav.funcList.length!=0){
				for(var i =0; i<nav.funcList.length;i++){
						o.funcList.push(nav.funcList[i]);
					
					}
				
				}
			
		});
		
		//工具栏悬浮按钮
		this.navFloatBtn.toggle(function(){
			o.minimizeToolBar();
			$(this).html("还原导航栏");
		},function(){
			o.maximizeToolBar();
			$(this).html("最小化导航栏");
		});
		
		doActions(settings.data.find("nav").parents().attr("action"));
		
		settings.callback();
	};
	
	GnSuite.prototype.loadData = function(path){

/*		$.ajax({
		  url: path,
		  async: false,
		  type:'get',
		  success:function(data){
				_data = $(data);
		  },
		  dataType: 'xml',
		});*/
		
		var xmlContent = top.$.aos.fs.read(path);
		
		//IE 对 $.each()有BUG,所以这里
		if ($.browser.msie) {
			var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.loadXML(xmlContent);
			xmlContent = xmlDoc;
		}
		
		return $(xmlContent);
	};
	
	GnSuite.prototype.iframeRefresh = function(url){
		url = url.substring(0,url.lastIndexOf('#')==-1?url.length : url.lastIndexOf('#'));
		
		this.iframe.attr('src',url);
	};
	
	GnSuite.prototype.openDialog = function(options){
		
			var o = this;
			var __height = typeof(options.height) == 'undefined' ? '550px' : options.height-50;
			var __width = typeof(options.width) == 'undefined' ? '590px' : options.width-10;
			
			var opt = {
				width : 600,
				height : 'auto',
				url : '',
				height : 'auto',
				top : '5%',
				left : '30%',
				content : $("<iframe id='iframe' name='iframe' frameborder='0' src=''></iframe>").css({width:__width, height:__height,overflow:'auto'}),
				title : '',
				modal : true,
				draggable : true,
				buttons: {
					/*"确定": function() {
						o.dialog.hide();
						o.overlay.hide();
					},
					"取消": function() {
						o.dialog.hide();
						o.overlay.hide();
					}*/
				},
				callback: function(){}
			};
			
			$.extend(true, opt, options);
			
			
			this.dialog.css({width: opt.width, height: opt.height, top: opt.top, left: opt.left});
			this.dialog.find(".title > h4").html(opt.title);
			opt.content.attr('src',opt.url);
			this.dialog.find(".boxmain").html(opt.content);
			
			if(opt.draggable){
				var h4 = this.dialog.find(".title");
				this.dialog.draggable({ handle: h4 });
			}
			if(opt.modal){
				this.overlay.show();
			}
			
			this.dialog.find(".del").click(function(){
				o.dialog.hide();
				o.overlay.hide();
			});
			
			this.dialog.find(".btnbar").html('');
			for(var b in opt.buttons){
				var btn = $("<input type='submit' value='"+b+"' class='btnsty1'>").click(opt.buttons[b]);
				this.dialog.find(".btnbar").append(btn);
			}
			
			this.dialog.show();
			opt.callback();
	};
	
	GnSuite.prototype.closeDialog = function(){
		this.dialog.hide();
		this.overlay.hide();
	};
	
	GnSuite.prototype.hideSidebar = function(){
		this.sidebar.hide();
		this.flexBtn.hide();
		this.frame.css({width:'99%'});
	};
	
	GnSuite.prototype.showSidebar = function(){
		this.sidebar.show();
		this.flexBtn.show();
		this.flexBtnCurrentPosition = $(".flex-btn").position().left*1;
		this.sidebar.css({width:'14%'});
		this.frame.css({width:'85%'});
	};
	
	GnSuite.prototype.loadingStart = function(){
			this.overlay.show();
			this.loadingIcon.show();	
	};
	
	GnSuite.prototype.loadingEnd = function(){
		this.overlay.hide();
		this.loadingIcon.hide();
	};
	
	GnSuite.prototype.minimizeToolBar = function(){
		this.header.css({height:"30px"});
		var _height = this.sidebar.height()+125;
		
		this.sidebar.css('height', _height);
		this.flexBtn.css('height', _height);
		this.frame.css('height', _height);
		
		$(".nav-tab-container").css({zIndex:"-999"});
		
		for ( var i = 0; i < this.navList.length; i++) {
			this.navList[i].ontabClick = function(obj){
				$(document).one('click', function(){
					obj.selfObj.css({zIndex:"1"});
					$(document).one('click', function(){
						//obj.selfObj.fadeOut(500);
						$(".nav-tab-container").css({zIndex:"-999"});
					});
				});
			};
		}
		this.isToolbarMinimize = true;
	};
	
	GnSuite.prototype.maximizeToolBar = function(){
		this.header.css({height:"155px"});
		var _height = this.sidebar.height()-125;
		
		this.sidebar.css('height', _height);
		this.flexBtn.css('height', _height);
		this.frame.css('height', _height);
		$(".nav-tab-container").css({zIndex:"1"});
		for ( var i = 0; i < this.navList.length; i++) {
			this.navList[i].ontabClick = function(obj){};
		}
		$(document).off("click");
		$(".nav-tab-container-current").css({zIndex:"1"});
		this.isToolbarMinimize = false;
	};
	
	//-----------------------------板块--------------------------
	//
	function SuiteNavigation(){
		
		this.id;
		this.name;
		this.pObj;
		this.dataSource;
		this.selfObj;
		this.funcList = new Array();
		this.blockList = new Array();
		this.action;
		this.ontabClick = function(obj){};
	}
	
	SuiteNavigation.prototype.init = function(){

		var obj = this;
		
		obj.selfObj = $("<div class='nav-tab-container'><div>");
		var tabis = $("<a href='#' class='nav-tab-title-cell'><p>"+obj.name+"</p></a>");
		$(".nav-tab-title").append(tabis);
		if(this.id == 0){tabis.addClass("nav-tab-title-cell-current");}
		
		for(var i=0;i<obj.dataSource.length;i++){
			//创建功能块
			var block = new SuiteBlock;
			block.dataSource = $(obj.dataSource[i]);
			block.title = $(obj.dataSource[i]).attr("title");
			block.pObj = obj.selfObj;
			block.init();
			obj.blockList.push(block);
					
		}
		obj.getAllFuncs();//初始化获取functions功能块;
		
		tabis.click(function(){
			$(this).addClass("nav-tab-title-cell-current");
			$(this).siblings(".nav-tab-title-cell").removeClass("nav-tab-title-cell-current");
			$(".nav-tab-container").hide();
			obj.selfObj.show();
			
			$.gnsuite.iframe.attr('src','');
			
			doActions(obj.action);
			
			$(".nav-tab-container-current").removeClass("nav-tab-container-current");
			obj.selfObj.addClass("nav-tab-container-current");
			
			obj.ontabClick(obj);
		});
		
		obj.pObj.append(obj.selfObj);
		
	};
	
	SuiteNavigation.prototype.getAllFuncs = function(){
		this.funcList.length = 0;
		if(this.blockList){
			for(var i =0;i<this.blockList.length;i++){
				//下级有function数组
				if(this.blockList[i].funcList.length!=0){
					
					for(var j=0;j<this.blockList[i].funcList.length;j++){

						this.funcList.push(this.blockList[i].funcList[j]);
						
						}
					
				}else{
					this.funcList.push(this.blockList[i]);
					}
					
				}
			}
			
	};
	
	//------------------------------功能块-------------------------
	//
	function SuiteBlock(){
		this.pObj;
		this.selfObj;
		this.title;
		this.dataSource;
		this.setList = new Array();
		this.menuList = new Array();
		this.funcList = new Array();
	}
	
	SuiteBlock.prototype.init = function(){
		var o = this;
		var cont = "";
		var navTabContainerCell = $("<div class='nav-tab-container-cell'></div>");
		var navTabContainerCellTitle = $("<div class='nav-tab-container-cell-title'>"+this.title+"</div>");
		var navTabContainerCellList = $("<div class='nav-tab-container-cell-list'></div>");

		navTabContainerCell.append(navTabContainerCellList);
		navTabContainerCell.append(navTabContainerCellTitle);
		
		this.pObj.append(navTabContainerCell);
		

		//生成功能
		var funcs = this.dataSource.children("func");
		for(var i = 0;i<funcs.length;i++){

			var f = new SuiteFunction();
			f.pObj = navTabContainerCellList;
			f.name = $(funcs[i]).attr('name');
			f.url = $(funcs[i]).attr('url');
			f.icon = $(funcs[i]).attr('icon');
			f.action = $(funcs[i]).attr("action");
			o.funcList.push(f);
			navTabContainerCellList.append(f.initBigItem());
			
			}

		
		//是否有下拉菜单
		if(this.dataSource.find("funcMenu").length >0){
			
			var menu = new SuiteDropdownMenu;
			menu.pObj = navTabContainerCell;
			menu.dataSource = o.dataSource.find("funcMenu").children(); 
			menu.init();
			o.menuList.push(menu);
			//遍历funcList
			for(var i =0 ;i<menu.funcList.length;i++){
				
				o.funcList.push(menu.funcList[i]);
				}			
			
			navTabContainerCell.append(menu.selfObj);
			
			navTabContainerCellTitle.click(function(){
				
				$('.drop-menu').hide();
				menu.selfObj.show();
				
				$(document).one('click',function(){
					$(document).one('click',function(){
						menu.selfObj.hide();	
					});
				});
			});
			
			
		}
			
		//是否有小功能集合
		if(this.dataSource.find("funcSet").length >0){
			var set = new SuiteSet;
			set.pObj = navTabContainerCellList;
			set.dataSource = o.dataSource.find("funcSet").children(); 
			set.init();
			
			//遍历function
			for(var i = 0; i<set.funcList.length ; i++){
				o.funcList.push(set.funcList[i]);
				
				}
			navTabContainerCellList.append(set.selfObj);
			this.setList.push(set);
		}
		
		
	};
	//-------------------------------最小功能------------------------
	//
	function SuiteFunction(){
		this.pObj;
		this.selfObj;
		this.url;
		this.name;
		this.icon;
		this.action;
	}
	
	SuiteFunction.prototype.initBigItem = function(){
		var obj = this;
		var url = this.url;
		var cont = "";
		//cont += "<a class='nav-tab-title-cell-icon-width82' href='../../"+this.url+"?randomnum="+(new Date()).getTime()+"' target='iframe'>";
		if(url.indexOf("http://")==-1){
			cont += "<a class='nav-tab-title-cell-icon-width82' href='../../"+this.url+"?randomnum="+(new Date()).getTime()+"' target='iframe'>";
		}else{
			var iframeUrl = encodeURI(this.url+"?user="+top.$.aos.users.current);
			cont += "<a class='nav-tab-title-cell-icon-width82' href='"+iframeUrl+"' target='iframe'>";
		}
		
		cont += "<span>";
		cont += "<img width='32' height='32' src='"+this.icon+"'>";
		cont +="</span>";
		cont +="<p>"+this.name+"</p>";
		//cont +="<div class='drop-arrow82'><img src='css/images/drop-arrow.png' width='7' height='4' /></div>";
		cont +="<div class='drop-arrow82'></div>";
		cont +="</a>";
		var c = $(cont);
		
		c.click(function(){
			$(".nav-tab-title-cell-icon-current-width82").removeClass("nav-tab-title-cell-icon-current-width82");
			$(this).addClass("nav-tab-title-cell-icon-current-width82");
			
			doActions(obj.action);
			return
		});
		
		this.selfObj = c;
		return c;
				
	};
	SuiteFunction.prototype.initSmallItem = function(){
		var cont = "";
		cont +="<a class='nav-tab-a-cell-list-icon'  href='"+this.url+"' target='iframe'>"+this.name+"</a>";
		var c = $(cont);	
		this.selfObj = c;
		return c;
	};
	
	SuiteFunction.prototype.initMenuItem = function(){
		var cont = "";
		cont +="<a  href='"+this.url+"' target='iframe'>"+this.name+"</a>";
		var c = $(cont);	
		this.selfObj = c;
		return c;
	};
	
	SuiteFunction.prototype.hide = function(){
			
		if(this.selfObj.attr("class")=="nav-tab-title-cell-icon-width82"&&this.selfObj.siblings().length>0){
			this.selfObj.hide();	
			
			}else{
				if(this.selfObj.parent().attr("class") == "nav-tab-container-cell-list")
					this.selfObj.parent().parent().hide();					
				}
		
		
		if(this.selfObj.parent().attr("class") == "nav-tab-a-cell-list")
		this.selfObj.hide();
		
		if(this.selfObj.parent().attr("class") == "drop-menu")
		this.selfObj.hide();

		};
	SuiteFunction.prototype.show = function(){
		if(this.selfObj.attr("class")=="nav-tab-title-cell-icon-width82"&&this.selfObj.siblings().length>0){
			this.selfObj.show();	
			
			}else{
				if(this.selfObj.parent().attr("class") == "nav-tab-container-cell-list")
					this.selfObj.parent().parent().show();					
				}
		
		
		if(this.selfObj.parent().attr("class") == "nav-tab-a-cell-list")
		this.selfObj.show();
		
		if(this.selfObj.parent().attr("class") == "drop-menu")
		this.selfObj.show();
		
		};
	SuiteFunction.prototype.disable = function(){
		if(this.selfObj.attr("class")=="nav-tab-title-cell-icon-width82"&&this.selfObj.siblings().length>0){

			this.disablestyle(this.selfObj);
			
			}else{
				if(this.selfObj.parent().attr("class") == "nav-tab-container-cell-list")

					this.disablestyle(this.selfObj.parent().parent());				
				}
		
		
		if(this.selfObj.parent().attr("class") == "nav-tab-a-cell-list")
		this.disablestyle(this.selfObj);
		
		if(this.selfObj.parent().attr("class") == "drop-menu")
		this.disablestyle(this.selfObj);
		
		
		};
	SuiteFunction.prototype.enable = function(){
		if(this.selfObj.attr("class")=="nav-tab-title-cell-icon-width82"&&this.selfObj.siblings().length>0){
		this.selfObj.find(".conver").remove();
			
			}else{
				if(this.selfObj.parent().attr("class") == "nav-tab-container-cell-list")

					this.selfObj.parent().parent().find(".conver").remove();
				}
		
		
		if(this.selfObj.parent().attr("class") == "nav-tab-a-cell-list")
		this.selfObj.find(".conver").remove();
		
		if(this.selfObj.parent().attr("class") == "drop-menu")
		this.selfObj.find(".conver").remove();
		
		
		};
	
	SuiteFunction.prototype.disablestyle = function(obj){	

			var width = obj.width()+13;
			var height = obj.height()+2;
			var offset = obj.offset();
			var div = $("<div class='conver'></div>");
			div.css({position:"absolute",width:width+"px",height:height+"px",top:offset.top,left:offset.left,background:"white",filter:"alpha(opacity=50)","-moz-opacity":0.5,"-khtml-opacity": 0.5,opacity: 0.5});
			
			obj.find(".conver").remove();
			obj.find("img").css({filter:"alpha(opacity=50)","-moz-opacity":0.5,"-khtml-opacity": 0.5,opacity: 0.5});
			obj.append(div);

		//obj.disabled = true;


		};
	
	
	//-------------------------------小功能集合------------------------
	//
	function SuiteSet(){
		this.pObj;
		this.selfObj;
		this.dataSource;
		this.funcList = new Array();
	}
	
	SuiteSet.prototype.init = function(){
				
		var navTabACellList = $("<div class='nav-tab-a-cell-list'></div>");
			
		for(var i=0;i<this.dataSource.length;i++){
			var f = new SuiteFunction();
			f.pObj = navTabACellList;
			f.name = $(this.dataSource[i]).attr('name');
			f.url = $(this.dataSource[i]).attr('url');
			f.icon = $(this.dataSource[i]).attr('icon');
			f.action = $(this.dataSource[i]).attr("action");
			navTabACellList.append(f.initSmallItem());
			
			this.funcList.push(f);
		}
		
		this.selfObj = navTabACellList;
	};
	
	//--------------------------------下拉菜单-----------------------
	//
	function SuiteDropdownMenu(){
		this.pObj;
		this.selfObj;
		this.dataSource;
		this.funcList = new Array();
	}
	
	SuiteDropdownMenu.prototype.init = function(){
		
		var dropMenu = $("<div class='drop-menu'></div>");
		
		for(var i=0;i<this.dataSource.length;i++){
				if($(this.dataSource[i]).attr("type") == 'splitLine'){
					var cont = "";
					cont += "<a class='line'></a>";
					dropMenu.append(cont);
				}else{
					var f = new SuiteFunction();
					f.name = $(this.dataSource[i]).attr('name');
					f.url = $(this.dataSource[i]).attr('url');
					f.icon = $(this.dataSource[i]).attr('icon');
					f.action = $(this.dataSource[i]).attr("action");
					
					dropMenu.append(f.initMenuItem());
					
					this.funcList.push(f);
				}
			}
		this.selfObj = dropMenu;
	};

	//--------------------------------执行配置文件的动作方法-----------------------
	//
	function doActions(action){
		$.gnsuite.showSidebar();
		
		if(typeof(action)!='undefined'){
			var acts = action.split(" ");
			var root = $.gnsuite.path;
			//console.log(root)
			root = root.substring(0,root.lastIndexOf("/"));
			for(i in acts){
				//console.log(root+"/"+acts[i]+".js");
				var act = acts[i].indexOf("(") == -1 && acts[i].indexOf(")") == -1 ?  acts[i] : acts[i].substring(0,acts[i].indexOf("("));
				var param = acts[i].indexOf("(") == -1 && acts[i].indexOf(")") == -1 ? null : acts[i].substring(acts[i].indexOf("(")*1+1,acts[i].indexOf(")"));
				
				var command = top.$.aos.fs.read(root+"/script/"+act+".js");
				//console.log(typeof(command));
				
				
				var sc= eval("(function(){var r = "+param+"; return r;})();");
				
				if(typeof(command) == 'string'){
					eval("(function(param){"+command+"})("+JSON.stringify(sc)+")");
				}else{
					var command = top.$.aos.fs.read(root+"/script/"+act+".js");
					//console.log("============"+typeof(command));
					eval("(function(param){"+command+"})("+JSON.stringify(sc)+")");
				}
			}
		}
	}
	
	
	$.gnsuite = new GnSuite();
	
})(jQuery);
