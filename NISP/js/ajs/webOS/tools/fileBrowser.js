/**
 *  文件: fileBrowser.js
 *  描述：
 		Dependency : 构建jquery插件， 通过$("#xxx").fileBrowser() 讲文件浏览器捆绑在一个DIV中
 */
(function($){
	
	function initTreeView(obj, zo, path){
		/*---------左边栏树---------*/
		var zTreeObj = null;
		var viewType = $(".viewSelect",obj).val();
		var currentPath = $(".fb-hidepath",obj).html(path);
		
		var setting = {	
			data : {
				keep : {
					parent : true
				}	
			}, 
			callback: {
				onCollapse: function(event, treeId, treeNode) {
					zTreeObj.removeChildNodes(treeNode);
				},
				onExpand: function(event, treeId, treeNode){
					zTreeObj.addNodes(treeNode, getNodes(treeNode.path));
				},
				onClick: function(event, treeId, treeNode){
					var viewType = $(".viewSelect",obj).val();
					$.aos.desktop.currentDesktop.showFolderFiles(obj, treeNode.path, viewType);
					currentPath.html(treeNode.path);
				},
				onRightClick: function(event, treeId, treeNode){
					
				}
			}
		};
		zTreeObj = $.fn.zTree.init(zo, setting, getNodes('/system'));
		
		$.aos.desktop.currentDesktop.showFolderFiles(obj, path, viewType);
		
		$(".viewSelect",obj).change(function(){
			$.aos.desktop.currentDesktop.showFolderFiles(obj, path, $(this).val());	
		});
		
		$(".fb-path-parent",obj).click(function(){
			var str = currentPath.html();
			str = str.substring(0, str.lastIndexOf('/'));
			if(str != ''){
				$.aos.desktop.currentDesktop.showFolderFiles(obj, str, $(".viewSelect",obj).val());	
			}
			currentPath.html(str);
		});
		
	}
	
	function getNodes(path){
			var zNodes = [];
			var fileArray = $.aos.fs.lsDirs(path);
			for(var i=0; i < fileArray.length;i++){
				var fileRef = fileArray[i];
				var f = {"name": fileRef.name, "isParent":true, "path": fileRef.path};
				zNodes[zNodes.length] = f;
			}
			return zNodes;
	}
	
	
	 var methods = {
		init : function( options ) { 
			
		  var o = this;
		  
		  var settings = $.extend( {
			  'template'         : 'system/FileManager/index.html',
			  'path'			 : '/',
			  'win'				 : {}
		  }, options);
		  
		  this.load(settings.template,function(){
				var win = o.parents('.am-window');
				var dateid = 'w'+(new Date()).getTime();
				$('.ztree',o).attr('id',dateid+"ztree");
				
				
				$(".fb-left",o).css('height', win.height()-45);
				$(".fb-left-bar",o).css('height', win.height()-45).css("line-height", (win.height()-45)+'px');
				$(".fb-right",o).css('height', win.height()-45);
				$(".fb-path-select",o).css('width', win.width()-385);
				
				settings.win.onResize = function(event, ui){
					//container.css('width', win.width()-200);
					$(".fb-left",o).css('height', win.height()-45);
					$(".fb-left-bar",o).css('height', win.height()-45).css("line-height", (win.height()-45)+'px');
					$(".fb-right",o).css('height', win.height()-45);
					$(".fb-path-select",o).css('width', win.width()-385);
				};
				
				
				initTreeView(o,$("#"+dateid+"ztree"),settings.path);
				
				
				$('.fb-left-bar',o).toggle(function(){
						$('.fb-left-content',o).hide();
						$('.fb-left',o).css('width','6px');
						$('.fb-right',o).css('margin-left','6px');
						$('.barimg',o).attr('src','images/plugin/filebrowser/show.png');
				},function(){
						$('.fb-left-content',o).show();
						$('.fb-left',o).css('width','200px');
						$('.fb-right',o).css('margin-left','200px');
						$('.barimg',o).attr('src','images/plugin/filebrowser/hide.png');
				});	
				
				//右键菜单
				var mSort = {
					text: "排序",
					func: function() {
						
					}	
				}, mRefresh = {
					text: "刷新",
					func: function() {
						$.aos.desktop.currentDesktop.showFolderFiles(o, $(".fb-hidepath",o).html(), $(".viewSelect",o).val());
					}
				}, mPaste = {
					text: "粘贴",
					func: function() {
						//因为smartMenu插件的原因， 外部的 o 不能传进来， 比如我有2个文件夹A和B，我在第一个文件夹右键时显示为 0 = A， 当在第二个文件夹右键时 o 还是等于A
						//所以这里只能用this， this即为当前smartMenu插件的作用区，this.closest(".am-window-content")可找到父辈的o对象
						/*if($.aos.desktop.cutCache.length!=0 || $.aos.desktop.copyCache.length!=0){
							var thisparent = $(this).closest(".am-window-content");
							if($.aos.desktop.cutCache.length!=0){
								//第一个参数是li对象本身，第二个参数是uinode
								$.aos.desktop.cutCache[0].remove();
								//console.log("from: "+$.aos.desktop.cutCache[1].path+" To: "+$(".fb-hidepath",this).html());
								//console.log($(".fb-hidepath",this).html());
								$.aos.fs.mv($.aos.desktop.cutCache[1].path, $(".fb-hidepath",this).html());
								$.aos.desktop.currentDesktop.showFolderFiles(thisparent, $(".fb-hidepath",this).html(), $(".viewSelect",thisparent).val());
								$.aos.desktop.cutCache = new Array();
							}else if($.aos.desktop.copyCache.length!=0){
								$.aos.fs.cp($.aos.desktop.copyCache[1].path, $(".fb-hidepath",this).html());
								$.aos.desktop.currentDesktop.showFolderFiles(thisparent, $(".fb-hidepath",this).html(), $(".viewSelect",thisparent).val());
								//$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut($.aos.desktop.copyCache[1]));
							}
						}else{
							alert("没有任何复制或剪切项");
						}*/
						
						var obj = $(this);
						
						if($.aos.desktop.cutCache.length!=0 || $.aos.desktop.copyCache.length!=0){
							//console.log(o.cutCache[1]);
							var thisparent = $(this).closest(".am-window-content");
							
							if($.aos.desktop.cutCache.length!=0){
								if ($(".fb-hidepath",this).html().lastIndexOf($.aos.desktop.cutCache[1].path)!=-1) {
									alert("目标文件夹是源文件夹的子文件夹！");
									return
								}
								var name = $.aos.desktop.cutCache[1].name;
								var path = $.aos.desktop.cutCache[1].path;
								//var timestamp = " - "+new Date().getTime();
								var timestamp = " - (复制)";
								//name = name.substring(0,name.lastIndexOf("."))+timestamp+name.substring(name.lastIndexOf("."),name.length);
								var filename = name.lastIndexOf(".")==-1?name : name.substring(0,name.lastIndexOf("."));
								var filesuffix = name.lastIndexOf(".")==-1?"" : name.substring(name.lastIndexOf("."),name.length);
								var isExe = (filesuffix==".exe");
								var isLink = (filesuffix==".lin");
								//alert(filesuffix);
								name = filename + timestamp +filesuffix;
								while($.aos.fs.exists($(".fb-hidepath",this).html()+"/"+name)=="true"){
									filename = name.lastIndexOf(".")==-1?name : name.substring(0,name.lastIndexOf("."));
									name=filename + timestamp +filesuffix;
								}
								var checkname= $.aos.desktop.cutCache[1].name;
								path = $(".fb-hidepath",this).html() +"/"+$.aos.desktop.cutCache[1].name;
								if ($(".fb-hidepath",this).html()+"/"+checkname==$.aos.desktop.cutCache[1].path) {
									$.aos.desktop.cutCache[0].css('opacity', 1);
									return;
								}
								if($.aos.fs.exists($(".fb-hidepath",this).html() +"/"+checkname) == 'true'){
									// if(true) {
										var _box = $.aos.lightbox.create({
											height:500,
											width:500,
											top:'10%',
											closable: false,
										});
									
										_box.loadHTML("system/FileManager/PasteDialog/index-browser.html",function(){
											_box.loadedContent.data("params",{
												lightbox: _box,
												type: 'desktopCut',
												name: name,
												path: path,
												src:$.aos.desktop.cutCache[1],
												currentRoot: obj.find(".fb-hidepath"),
												thisparent: thisparent,
												viewType: $(".viewSelect",thisparent).val()
											});
										});
								}else{
									//alert("from: "+$.aos.desktop.copyCache[1].path+" to: "+currentRoot);
									if (isExe) {
										var temp = $.aos.desktop.cutCache[1].path;
										name = temp.lastIndexOf("/")==-1?temp : temp.substring(temp.lastIndexOf("/")+1,temp.length);
										$.aos.fs.mv($.aos.desktop.cutCache[1].path, $(".fb-hidepath",this).html() +"/"+name);
										path = $(".fb-hidepath",this).html()  + "/" + name;
									}
									if (isLink) {
										var temp = $.aos.desktop.cutCache[1].path;
										name = temp.lastIndexOf("/")==-1?temp : temp.substring(temp.lastIndexOf("/")+1,temp.length);
										//alert(name);
										$.aos.fs.createLink($(".fb-hidepath",this).html() ,name,$.aos.desktop.cutCache[1].linkpath);
										$.aos.fs.rm($.aos.desktop.cutCache[1].path);
										path = $(".fb-hidepath",this).html()  + "/" + name;
									}
									// $.aos.fs.cp($.aos.desktop.copyCache[1].path, $.aos.desktop.currentDesktop.root);
									else{
										$.aos.fs.mv($.aos.desktop.cutCache[1].path, $(".fb-hidepath",this).html() +"/"+$.aos.desktop.cutCache[1].name);
										path = $(".fb-hidepath",this).html() +"/"+$.aos.desktop.cutCache[1].name;
									}
									//var node = new $.aos.ui.UINode($.aos.fs.mapWith(path));
									$.aos.desktop.currentDesktop.showFolderFiles(thisparent, $(".fb-hidepath",this).html(), $(".viewSelect",thisparent).val());
									// var node = new $.aos.ui.UINode($.aos.fs.mapWith($.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.copyCache[1].name));
									//$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut(node));
									$.aos.desktop.cutCache = new Array();	
								}
								$.aos.desktop.cutCache[0].css('opacity', 0);
								return 
							}else if($.aos.desktop.copyCache.length!=0){
								if ($(".fb-hidepath",this).html().lastIndexOf($.aos.desktop.copyCache[1].path)!=-1) {
									alert("目标文件夹是源文件夹的子文件夹！");
									return
								}
								// 1. 判断当前文件夹是否有重名文件，有则提示，并改名为 （ 重命名 ）
								// 2. 改变o.cutCache[1]的name和path
								var name = $.aos.desktop.copyCache[1].name;
								//alert(name);
								var path = $.aos.desktop.copyCache[1].path;
								//var timestamp = " - "+new Date().getTime();
								var timestamp = " - (复制)";
								//name = name.substring(0,name.lastIndexOf("."))+timestamp+name.substring(name.lastIndexOf("."),name.length);
								var filename = name.lastIndexOf(".")==-1?name : name.substring(0,name.lastIndexOf("."));
								var filesuffix = name.lastIndexOf(".")==-1?"" : name.substring(name.lastIndexOf("."),name.length);
								var isExe = (filesuffix==".exe");
								var isLink = (filesuffix==".lin");
								//name = filename + timestamp +filesuffix;
								while($.aos.fs.exists($(".fb-hidepath",this).html()+"/"+name)=="true"){
									filename = name.lastIndexOf(".")==-1?name : name.substring(0,name.lastIndexOf("."));
									name=filename + timestamp +filesuffix;
								}
								var checkname;
								if (isExe) {
									name = filename +".lin";
									checkname = filename + timestamp +".lin";
								}
								else if (isLink) {
									checkname = $.aos.desktop.copyCache[1].name;
								}
								else{
									checkname = $.aos.desktop.copyCache[1].name;
								}
								path = $(".fb-hidepath",this).html()+"/"+$.aos.desktop.copyCache[1].name;
								if ($(".fb-hidepath",this).html()+"/"+checkname==$.aos.desktop.copyCache[1].path) {
									checkname = name;
								}
								if($.aos.fs.exists($(".fb-hidepath",this).html()+"/"+checkname) == 'true'){
									// if(true) {
										var _box = $.aos.lightbox.create({
											height:500,
											width:500,
											top:'10%',
											closable: false,
										});
									
										_box.loadHTML("system/FileManager/PasteDialog/index-browser.html",function(){
											_box.loadedContent.data("params",{
												lightbox: _box,
												type: 'desktopCopy',
												name: name,
												path: path,
												src:$.aos.desktop.copyCache[1],
												currentRoot: obj.find(".fb-hidepath"),
												thisparent: thisparent,
												viewType: $(".viewSelect",thisparent).val()
											});
										});
								}else{
									//alert("from: "+$.aos.desktop.copyCache[1].path+" to: "+currentRoot);
									if (isExe) {
										//alert(checkname);
										$.aos.fs.createLink($(".fb-hidepath",this).html(),checkname,$.aos.desktop.copyCache[1].path);
										path = $(".fb-hidepath",this).html() + "/" + checkname;
									}
									if (isLink) {
										$.aos.fs.createLink($(".fb-hidepath",this).html(),checkname,$.aos.desktop.copyCache[1].linkpath);
										path = $(".fb-hidepath",this).html() + "/" + checkname;
									}
									// $.aos.fs.cp($.aos.desktop.copyCache[1].path, $.aos.desktop.currentDesktop.root);
									else{
										$.aos.fs.cp($.aos.desktop.copyCache[1].path, $(".fb-hidepath",this).html()+"/"+name);
										path = $(".fb-hidepath",this).html()+"/"+name;
									}
									
									$.aos.desktop.currentDesktop.showFolderFiles(thisparent, $(".fb-hidepath",this).html(), $(".viewSelect",thisparent).val());
									// var node = new $.aos.ui.UINode($.aos.fs.mapWith($.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.copyCache[1].name));
									//$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut(node));
									$.aos.desktop.copyCache = new Array();	
								}
								return
							}
						}else{
							alert("没有任何复制或剪切项");
						}

						
					}	
				},mNew = {
					text: "新建",
					data: [
						[{
							text: "文本文件",
							func: function() {
								//alert($(".fb-hidepath",o).html());
								//var p = $(".fb-hidepath",o).html()+'/新建文件'+new Date().getTime()+'.txt';
								var p = $(".fb-hidepath",o).html()+'/新建文件.txt';
								$.aos.fs.create(p);
								$.aos.desktop.currentDesktop.showFolderFiles(o, $(".fb-hidepath",o).html(), $(".viewSelect",o).val());
							}
						}, {
							text: "文件夹",
							func: function() {
								//alert($(".fb-hidepath",o).html());
								//var p = $(".fb-hidepath",o).html()+'/新建文件夹'+new Date().getTime();
								var p = $(".fb-hidepath",o).html()+'/新建文件夹';
								$.aos.fs.mkdir(p);
								$.aos.desktop.currentDesktop.showFolderFiles(o, $(".fb-hidepath",o).html(), $(".viewSelect",o).val());
							}
						}]
					]
				}, mUpload = {
					text: "上传",
					func: function() {
						var box = parent.$.aos.lightbox.create({
							width:400,
							height:350,
							closable:true,
						});
						box.loadIframe("system/FileManager/FileUpload/index.html?_path="+$(".fb-hidepath",o).html());
					}
				};
				var mailMenuData = [
					[mSort, mRefresh], [mNew], [mPaste],[mUpload]
				];
				
				$(".fb-right",o).smartMenu(mailMenuData, {
					name: "fileBrowser"+new Date().getTime(),
					beforeShow: function() {		
						
					},
					afterShow: function() {		
						$(document).one('click',$.smartMenu.hide);
					}
				});
		  });
		  
		  
		}
	};
	
	
	$.fn.fileBrowser = function(method) {
		// Method calling logic
		if ( methods[method] ) {
		  	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  	return methods.init.apply( this, arguments );
		} else {
		  	$.error( 'Method ' +  method + ' does not exist on $.fileBrowser' );
		}    
		 return this
	};

})(jQuery);

