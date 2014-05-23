/**
 *  文件: desktop.js
 *  描述：
 		Dependency : 桌面管理器类
 */

(function($){
			function Desktop(){
				var o = this;
				this.noteid = 0;    				// 节点ID是递增的数列
				this.descktopID;
				this.name;
				this.root;
				this.cssSetting;
				this.winList = new Array();
				
				//自定义右键上下文
				this.mOpen = {
					text: "打开方式",
					data: [
						[{
							text: "记事本打开",
							func: function() {
								var name = $(this).find(".name").html();
								var win = $.aos.win.create({title:name});
								win.loadIframe("system/Editer/txt/index.html?_winid="+win.winid+"&_path="+$(this).attr("path"));
							}
						}]
					]
				};
				this.mCut = {
					text: "剪切",
					func: function() {
						//第一个参数是li对象本身，第二个参数是uinode
						$.aos.desktop.cutCache.push($(this));
						$.aos.desktop.cutCache.push($(this).data('node'));
						$(this).css('opacity', 0.5);
					}
				};
				this.mCopy = {
					text: "复制",
					func: function() {
						//第一个参数是li对象本身，第二个参数是uinode
						$.aos.desktop.copyCache = new Array();
						$.aos.desktop.copyCache.push($(this));
						$.aos.desktop.copyCache.push($(this).data('node'));
					}	

				};
				this.mRename = {
					text: "重命名",
					func: function() {
						o.renameShortcut($(this).attr('id'));
					}	
				};
				this.mDel = {
					text: "删除",
					func: function() {
						o.delShortcut($(this).data('node'),$(this).attr('id'));
						$.aos.dock.init();
					}	
				};
				this.mSend = {
					text: "发送到",
					data: []
				};
				this.mDownload = {
					text: "下载",
					func: function() {
						var file = $.aos.fs.mapWith($(this).attr("path"));
						if($(this).attr("apptype")=="file"&&file.suffix!="lin"&&file.suffix!="url"){
							$.util.getFile($(this).attr("path"));
						}else{
							alert("暂不支持"+ file.suffix+"类型文件下载！");	
						}
				    }
				};
				this.mProperty = {
					text: "属性",
					func: function() {
						var path = $(this).attr("path");
						var _box = $.aos.lightbox.create({
							height:420,
							width:485,
							top:'10%',
							closable: true
						});
						_box.loadIframe("system/FileManager/PropertyDialog/index.html?path="+path);
						
				    }
				};
				
				this.desktopMenuData = [
				    [this.mCut, this.mCopy, this.mRename, this.mDel], [this.mDownload], [this.mSend],[this.mProperty]
				];
			}
			
			Desktop.prototype.init = function(){
				this.initShortcut(this.root);
			};
			
			//为桌面添加一个窗口
			Desktop.prototype.addWindow = function(w){
				this.winList.push(w);
			};
			
			//为桌面删除一个窗口
			Desktop.prototype.removeWindow = function(win){
				for(var i=0; i< (this.winList.length); i++){
						if(win.winid == this.winList[i].winid){
							this.winList.splice(i,1);
							return 
						}	
				}
			};
			
			//获取一个桌面窗口对象（通过ID）
			Desktop.prototype.getWindowById = function(id){
				for(var i=0; i< (this.winList.length); i++){
						if(id == this.winList[i].winid){
							return this.winList[i];
						}	
				}
			};
			
			
			//为桌面删除一个窗口（通过ID）
			Desktop.prototype.removeWindowById = function(id){
				for(var i=0; i< (this.winList.length); i++){
						if(id == this.winList[i].winid){
							this.winList[i].close(id);
							this.winList.splice(i,1);
							return 
						}	
				}
			};
			
			//关闭桌面所有窗口
			Desktop.prototype.closeAllWindows = function(){
				var length = this.winList.length;
				for(var k=0; k< length; k++){
					for(var i=0; i< (this.winList.length); i++){
							var obj = this.winList[i];
							obj.close(obj.winid);
					}
				}
			};
			
			//隐藏桌面所有窗口
			Desktop.prototype.hideAllWindows = function(){
				for(var i=0; i< (this.winList.length); i++){
						var obj = this.winList[i];
						obj.win.hide();
				}
			};
			
			//显示桌面所有窗口
			Desktop.prototype.showAllWindows = function(){
				for(var i=0; i< (this.winList.length); i++){
						var obj = this.winList[i];
						obj.win.show();
				}
			};
			
			
			// 初始化桌面图标
			Desktop.prototype.initShortcut = function(mpath){
				$("#shortcut_desk").html('');
				var o = this;
				
				//桌面列表
				var tempArray = [];
				for(var e = 0; e < $.aos.desktop.desktops.length; e++){
					var ddname = $.aos.desktop.desktops[e].name;
					var ddpath = $.aos.desktop.desktops[e].root;
					
					// 由于作用域链的配置机制，ddname 总是等于最后一个桌面的名字, 这里采用闭包的方式保存当前变量;
					var ddobj = {
						path : 	ddpath,
						func : function(){

								var o = this;
		
							//$.aos.desktop.cutCache.push($(this).data('node'));
							return function(){

								// o.path  -- 目标桌面路径
								// $(this).attr('path')  --  应用路径
								// $(this).attr('appname')  --  应用名字
								// $(this).attr('apptype')  --  应用类型，文件/文件夹
								
								
								/*if(o.path != $.aos.desktop.currentDesktop.root){			
									$.aos.fs.mv($(this).attr('path'), o.path);
									$(this).remove();
								}
								
								return o.path;	*/
								//发送到：桌面
							// var node = new $.aos.ui.UINode($(this).attr('path'));
							// $.aos.desktop.cutCache.push(o);
							// $.aos.desktop.cutCache.push(node);
								//alert($(this).attr('path'));
								if(o.path != $(this).attr('path')){
									var path = $(this).attr('path');
									//alert(path);
									//alert(o.path);
									var filesuffix = path.lastIndexOf(".")==-1?"" : path.substring(path.lastIndexOf("."),path.length);
									var isExe = (filesuffix==".exe");
									var isLink = (filesuffix==".lin");
									var name = path.lastIndexOf("/")==-1?path : path.substring(path.lastIndexOf("/")+1,path.length);

								//var timestamp = " - "+new Date().getTime();
								var timestamp = " - (复制)";
								//name = name.substring(0,name.lastIndexOf("."))+timestamp+name.substring(name.lastIndexOf("."),name.length);
								var filename = name.lastIndexOf(".")==-1?name : name.substring(0,name.lastIndexOf("."));
								var filesuffix = name.lastIndexOf(".")==-1?"" : name.substring(name.lastIndexOf("."),name.length);
								var isExe = (filesuffix==".exe");
								var isLink = (filesuffix==".lin");
								//alert(filesuffix);
								var checkname= name;
								var node = $(this).data('node');
								//name = filename + timestamp +filesuffix;
								//alert("2");
								//path = o.path+"/"+name;
								if((!isExe)&&($.aos.fs.exists(o.path+"/"+name) == 'true')){
									// if(true) {
										var _box = $.aos.lightbox.create({
											height:500,
											width:500,
											top:'10%',
											closable: false,
										});
									
										_box.loadHTML("system/FileManager/PasteDialog/index.html",function(){
											_box.loadedContent.data("params",{
												lightbox: _box,
												type: 'desktopSend',
												name: filename + timestamp +filesuffix,
												path: o.path+"/"+name,
												node: node,
											});
										});
								}else{
									//alert("ok");
									$.aos.fs.cp(path, o.path+"/"+name);
									if(o.path ==$.aos.desktop.currentDesktop.root){
										var node = new $.aos.ui.UINode($.aos.fs.mapWith(o.path+"/"+name));
										$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut(node));
									}

								}
								//return 
									//$(this).remove();
									$.aos.desktop.cutCache = new Array();	
									return o.path;			
								}
								
							};
						}
					};
					
					var _desk = {
						text: ddname,
						func: ddobj.func()
					};
					tempArray.push(_desk);
				}
				
				var _dock = {
					text : 	'应用码头',
					func: function(){
						// $(this).attr('path')  --  应用路径
						// $(this).attr('appname')  --  应用名字
						// $(this).attr('apptype')  --  应用类型，文件/文件夹
						
						var dockfile = {
							type : 'file',
							path : $(this).attr('path')
						};
						// var dockPath = "/home/"+$.aos.users.current+"/.dock/"+$(this).attr('appname')+".shortcut";
						// var dockPath = "system/dock/"+$(this).attr('appname')+".shortcut";
						var dockPath = "/system/dock";
						var dockPathLink = $(this).attr('path');
						 if($.aos.fs.existsByFatherAndName(dockPath,$(this).attr('appname')) == 'false'){
						//if(true) {
							// $.aos.fs.create(dockPath);
							$.aos.fs.createLink(dockPath,$(this).attr('appname')+".lin",dockPathLink);
							//$.aos.fs.createLink(dockPath,$(this).attr('appname'),dockPathLink);
							//$.aos.fs.write(dockPath, JSON.stringify(dockfile));
							
							$.aos.dock.init();
							
						}else{
							alert('快捷方式已存在');	
						}
					}	
				};
				
				tempArray.push(_dock);
				o.mSend.data = [];
				if(o.mSend.data.length == 0)
					o.mSend.data.push(tempArray);
					
				var fileArray = $.aos.fs.ls(mpath);
				for(var i=0; i < fileArray.length;i++){
					var f = fileArray[i];
					var node = new $.aos.ui.UINode(f);
					//$("#shortcut_desk").append(this.addShortcut(node));	
					this.addShortcut(node);
				}
			};
			
			// 添加桌面图标
			Desktop.prototype.addShortcut = function(uinode){
				//========uinode 结构如下：===========
				var o = this;
				var _id = this.noteid++;
				var name = uinode.name;

				if(uinode.type == 'file'){
					if(name.lastIndexOf('.') != -1){
						name = name.substring(0, name.lastIndexOf('.'));	
					}
				}
				
				var li = $("<li class='shortcut-li am-border-radius' id='_shortcut"+_id+"' path='"+uinode.path+"' appname='"+name+"' apptype='"+uinode.type+"'><img src='"+uinode.icon.img+"' /><span class='name'>"+name+"</span></li>").dblclick(function (){
					eval(uinode.starter);
				}).click(function(){    //点击图标显示图标全名
					var o = $(this);
					o.css( {background : 'url(images/icons/icon-bj-1.png)'} );
					o.find("span").css("position","absolute").css("height","auto");
					$(document).one('click', function(){ 
						$(document).one('click', function(){	
								o.find("span").css("position","").css("height","15px");
								o.css( {background : ''} );
						});
					});
						
				}).draggable({
                                        zIndex: 2000,
                                        opacity: 0.6
                                }).droppable({
                                        accept: "li.shortcut-li",
 					drop: function( event, ui ) {
        					//alert(1111);
					}
                                }).data('node', uinode);
				
				li.smartMenu(o.desktopMenuData, {
					//name: "shortcut"+new Date().getTime(),
					name: "shortcut"+new Date().getTime(),
					beforeShow: function() {		
						
					},
					afterShow: function() {		
						$(document).one('click',$.smartMenu.hide);
					}
				});
				
				$("#shortcut_desk").append(li);
				
				return li;
			};
			
			// 在文件夹中打开文件列表
			Desktop.prototype.showFolderFiles = function(obj, path, viewType){
					//var pathBar = obj.find('.pathBar');
					var mul = obj.find(".fb-right ul");
					var fileArray = $.aos.fs.ls(path);
					//pathBar.html(path);
					
					/*
					 *  
					*/
					$(".fb-path-select",obj).html('');
					var tt = path.split("/");
					for(var i=3; i<tt.length; i++){
						var mpath = $("<span>"+tt[i]+"</span><span><img border=0 src='images/plugin/filebrowser/hover-back.png' /></span>");
						var currentPath = '';
						for(var j=1; j<=i; j++){
							currentPath += '/'+tt[j];
						}
						mpath.click({
								pp : currentPath
							},function(event){
							$.aos.desktop.currentDesktop.showFolderFiles(obj, event.data.pp, viewType);	
							//发现原有bug，点击上方的mpath时路径其实没有改变。例如在刷新和复制文件时都会
							//出错。添加以下一行代码即可
							//沙恒 2014/4/17
							$(".fb-hidepath",obj).html(event.data.pp);
							//alert(event.data.pp);
						}
							
						);
						
						$(".fb-path-select",obj).append(mpath);
					}
					
					
					mul.html("");
					mul.removeClass("shortcut-ul");
					
					if(viewType == 'iconView'){
						mul.addClass("shortcut-ul");
					}
					if(viewType == 'listView'){
						mul.css("list-style", 'none');
						mul.append("<li><ul class='fb-info fb-info-hd'><li>名称</li><li>修改日期</li><li >类型</li><li>大小</li></ul></li>");	
					}
					
					if(fileArray != ''){
						for(var i=0; i < fileArray.length;i++){
							var f = fileArray[i];
							this.addFolderShortcut(obj, new $.aos.ui.UINode(f), viewType).appendTo(mul);
						}
					}
			};
			
			// 添加文件浏览器图标
			Desktop.prototype.addFolderShortcut = function(obj, uinode, viewType){
				
				//========uinode 结构如下：===========
				var o = this;
				var _id = this.noteid++;
				var name = uinode.name;
				if(uinode.type == 'file'){
					name = name.substring(0, name.lastIndexOf('.'));
				}
				
				var li;
				
				if(viewType == 'iconView'){
					li = $("<li class='shortcut-li am-border-radius' id='_shortcut"+_id+"' path='"+uinode.path+"'appname='"+name+"' apptype='"+uinode.type+"'><img src='"+uinode.icon.img+"' /><span class='name'>"+name+"</span></li>");
				}
				if(viewType == 'listView'){
					li = $("<li id='_shortcut"+_id+"' path='"+uinode.path+"'appname='"+name+"' apptype='"+uinode.type+"'><ul class='fb-info'><li>"+name+"</li><li>"+uinode.lastModified+"</li><li>"+uinode.type+"</li><li>"+uinode.size+"</li></ul></li>");
				}
				
				li.click(function(){    //点击图标显示图标全名
					var o = $(this);
					o.css( {background : 'url(images/icons/icon-bj-1.png)'} );
					o.find("span").css("position","absolute").css("height","auto");
					$(document).one('click', function(){ 
						$(document).one('click', function(){	
								o.find("span").css("position","").css("height","15px");
								o.css( {background : ''} );
						});
					});
						
				}).dblclick(function (){
					if(uinode.type == 'dir'){
						o.showFolderFiles(obj, uinode.path, viewType);
						$(".fb-hidepath",obj).html(uinode.path);
					}else{
						eval(uinode.starter);
					}
				}).data('node', uinode);
				
				if(viewType == 'iconView'){
					li.draggable({
						zIndex: 20000,
						opacity: 0.6,
						//grid: [71, 70],
						containment:'document'
					});
				}
				
				li.smartMenu(o.desktopMenuData, {
					name: "shortcut",
					beforeShow: function() {		
						
					},
					afterShow: function() {		
						$(document).one('click',$.smartMenu.hide);
					}
				});
				
				return li;
			};
			
			//打开桌面图标
			Desktop.prototype.openShortcut = function(uinode){
				alert("Ok");
			    eval(uinode.starter);
			};
			
			//重命名桌面图标
			Desktop.prototype.renameShortcut = function(id){
				var li = $('#'+id);
				li.css( {background : 'url(images/icons/icon-bj-1.png)'} );
				var shortcut = li.find('.name');
				shortcut.hide();
				var name = shortcut.html();
				var left = shortcut.position().left+10;
				var top = shortcut.position().top+50;
			    var newName = $("<input type='text' />").css('width','70px').css('color','#ffffff').css('border','1px #ffffff solid').css('text-align','center').css('background','none').val(name).appendTo($('#'+id)).focus();
				var oldPath = li.attr('path');
				var pathWithoutName = oldPath.substring(0, oldPath.lastIndexOf('/')+1);
				var suffix = oldPath.lastIndexOf('.')!=-1 ? oldPath.substring(oldPath.lastIndexOf('.'), oldPath.length) : "";
				newName.keydown(function(event) {
				  if (event.keyCode == '13') {
					  //alert(pathWithoutName+newName.val()+suffix)
					  if(name != newName.val()){
					  	//var reg = /^[a-zA-Z0-9_]{1}([a-zA-Z0-9]|[-_()]){0,19}$/;
					  	var reg = /^([a-zA-Z0-9\u4e00-\u9fa5]|[-_()]){0,19}$/;
					  	if(newName.val() != ""&&reg.test(newName.val())){
									  var p = pathWithoutName+newName.val()+suffix;
									  if($.aos.fs.exists(p) != 'true'){
											//alert(oldPath+"     "+pathWithoutName+newName.val()+suffix)
											$.aos.fs.rn(oldPath,p);
											li.attr('path', p);
											li.attr('appname',newName.val());
											li.unbind('dblclick');
											var node = new $.aos.ui.UINode($.aos.fs.mapWith(p));
											li.data('node',node);
											li.dblclick(function(){
												eval(node.starter);
											});
											shortcut.html(newName.val());
											shortcut.show();
											newName.remove();
											newName.val("destroy");
											li.css( {background : ''} );
									  }
									  else{
									  	alert("名字已存在,请重新命名");
									  }
					  	}else{
							alert('名字不合法！');  	
						}
					  }else{
						 shortcut.show();
						 newName.remove();
					  }
				   }
				});
				
				$(document).one('click', function(){ 
						$(document).one('click', function(){
						var reg = /^([a-zA-Z0-9]|[-_()]){0,19}$/;	
								if(name != newName.val()&&newName.val()!="destroy"){
								if(newName.val() != ""&&reg.test(newName.val())){
									  var p = pathWithoutName+newName.val()+suffix;
									  if($.aos.fs.exists(p) != 'true'){
											//alert(oldPath+"     "+pathWithoutName+newName.val()+suffix)
											$.aos.fs.rn(oldPath,p);
											li.attr('path', p);
											li.attr('appname',newName.val());
											li.unbind('dblclick');
											var node = new $.aos.ui.UINode($.aos.fs.mapWith(p));
											li.data('node',node);
											li.dblclick(function(){
												eval(node.starter);
											});
											shortcut.html(newName.val());
											shortcut.show();
											newName.remove();
											li.css( {background : ''} );
									  }
								}else{
									alert('名字不合法！');  	
								}
							  }else{
								 shortcut.show();
								 newName.remove();
							  }
						});
				});
				
			};
			
			//删除图标
			Desktop.prototype.delShortcut = function(node,id){
				var o = $("#"+id);
			    o.remove();
				//alert(o.attr('path'))
				var path = o.attr('path');
				if(path!='/' && path!="" && path!="*")
					$.aos.fs.rm(o.attr('path'));
			};
			
			//排序桌面图标
			Desktop.prototype.sortShortcut = function(){
				$("#shortcut_desk").find('li').each(function(){
					$(this).css('left','').css('top','');	  
				})
			};
			
			//剪切桌面图标
			Desktop.prototype.cutShortcut = function(id){
				
			};
			
			//创建桌面文件夹
			Desktop.prototype.makeDesktopDir = function(){
				$.aos.fs.mkdir(this.root);
			};
			
			//删除桌面文件夹
			Desktop.prototype.removeDesktopDir = function(){
				var f = confirm("确定删除桌面【"+this.name+"】");
				if(f)
					$.aos.fs.rm(this.root);
			};
			
			//重命名桌面文件夹
			Desktop.prototype.reNameDesktopDir = function(newName){
				var f = confirm("确定将["+this.name+"]改名为："+newName+"吗？");
				var path = this.root.substring(0,this.root.lastIndexOf("/"));
				if(f){
					if($.aos.fs.exists(path+newName) == 'false'){
						$.aos.fs.rn(this.root, path+"/"+newName);
					}else{
						alert("名字已存在，请重新命名！");	
					}
				}
			};
			
			
			/*=================== 桌面管理器类 ========================*/
			
			function DesktopManager(){
				this.currentDesktop;
				this.tmpCache;                                      //用于方便一些不同页面中的内容分享,在记事本的“另存为”时用到
				this.copyCache = new Array();						//复制缓存区
				this.cutCache = new Array();						//剪切缓存区
				this.desktops = new Array();
				this.isShowAlarm = true;
				this.alarmDivIsOpen = false;
			}
			
			DesktopManager.prototype.init = function(){
				var o = this;
				//初始化桌面
				this.initDesktop();
				// Dock组件
				$.aos.dock.init();
				//换肤
				$('._setting').click(function(){
					//$.aos.lightbox.create().loadHTML('system/Settings/theme/changeTheme.html');	
					$.aos.win.create({width:1000, height:500, title: '系统设置'}).loadIframe('system/Settings/theme/index.html');			
				});
				
				// 初次进入，桌面没有图标
				if($(".shortcut-ul li").size() == 0) {
					$.aos.win.create({width:1000, height:500, left:'5%', top:"5%",  title: '初始化配置', modal: true, draggable: true}).loadIframe('system/Settings/theme/app.html');
				}
				
				//聊天
				$('._multiDesktop').click(function(){
					o.currentDesktop.hideAllWindows();
				});
				
				//
				$('._skin').click(function(){
					o.currentDesktop.closeAllWindows();
				});
				
				//
				$('._expandWindows').click(function(){
					o.currentDesktop.showAllWindows();
				});
				
				
				//个人信息
				$('.person').click(function(){			
					$.aos.win.create({width: 600, height:350}).loadIframe('system/Settings/users/profile/index.html');				
					// $.aos.win.create({width: 600, height:350}).loadIframe('system/AppCenter/index.html');		
					// $.aos.win.create({width: 600, height:400, title: '应用程序中心'}).loadIframe('system/AppCenter/index.html');			
				});
				//登出
				$('.logout').click(function(){
					$.aos.log.info($.aos.users.current + "用户退出系统！");
					window.location = 'index.html';							
				});
				
				//自适应浏览器大小
				$(window).bind('resize', function() {
                    var width = $(this).width();
					var height = $(this).height();
					$('._main').css('height', height-40);
                    $('.center').css("width",width-90);
					$('.center').css('height', height-70);
					
					
					
                }).trigger('resize');
				
				
				//==============桌面初始化时调用外部业务逻辑代码=================
				
				/*var __loadCodes = $.aos.fs.ls("/app/defaultDesktopInit");
				for(var k=0,len=__loadCodes.length; k<len; k++){
					eval($.aos.fs.read(__loadCodes[k].path));
				}
				
				//====================================================
				
			
				//保持系统Session
				setInterval(function(){
					$.aos.session.setAttribute("maintainSession", "OK");
					var currentTime = new Date().toString();
					$.aos.fs.write("/home/"+$.aos.users.current+"/.maintainSession.cfg",currentTime);
					var writtenStr = $.aos.fs.read("/home/"+$.aos.users.current+"/.maintainSession.cfg");
					if(typeof(writtenStr)=='object' || writtenStr.indexOf(currentTime) == -1){
						alert("会话已超时，请重新登录！");
						window.location = 'index.html';
					}
				},300000);

				setInterval(function(){
					var username = $.aos.session.getAttribute("username");
					if (username == null) {
						alert("会话已超时，请重新登录！");
						window.location = 'index.html';
					}
					else{
					}
				},21*60*1000);*/

				
				//桌面右键菜单
				var mSort = {
					text: "排序",
					func: function() {
						o.currentDesktop.sortShortcut();
					}	
				}, mRefresh = {
					text: "刷新",
					func: function() {
						o.currentDesktop.initShortcut(o.currentDesktop.root);
					}
				}, mPaste = {
					text: "粘贴",
					func: function() {
						if($.aos.desktop.cutCache.length!=0 || $.aos.desktop.copyCache.length!=0){
							
							if($.aos.desktop.cutCache.length!=0){
								if ($.aos.desktop.currentDesktop.root.lastIndexOf($.aos.desktop.cutCache[1].path)!=-1) {
									alert("目标文件夹是源文件夹的子文件夹！");
									return
								}
								// 1. 判断当前文件夹是否有重名文件，有则提示是否覆盖，不覆盖则改名为名字+当前时间戳
								// 2. 改变o.cutCache[1]的name和path
							// 1. 判断当前文件夹是否有重名文件，有则提示，并改名为 （ 重命名 ）
								// 2. 改变o.cutCache[1]的name和path
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
								while($.aos.fs.exists($.aos.desktop.currentDesktop.root+"/"+name)=="true"){
									filename = name.lastIndexOf(".")==-1?name : name.substring(0,name.lastIndexOf("."));
									name=filename + timestamp +filesuffix;
								}
								
								var checkname= $.aos.desktop.cutCache[1].name;
								path = $.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.cutCache[1].name;
								if ($.aos.desktop.currentDesktop.root+"/"+checkname==$.aos.desktop.cutCache[1].path) {
									$.aos.desktop.cutCache[0].css('opacity', 1);
									return;
								}
								if($.aos.fs.exists($.aos.desktop.currentDesktop.root+"/"+checkname) == 'true'){
									// if(true) {
										var _box = $.aos.lightbox.create({
											height:500,
											width:500,
											top:'10%',
											closable: false,
										});
									
										_box.loadHTML("system/FileManager/PasteDialog/index.html",function(){
											_box.loadedContent.data("params",{
												lightbox: _box,
												type: 'desktopCut',
												name: name,
												path: path,
												src:$.aos.desktop.cutCache[1]
											});
										});
								}else{
									//alert("from: "+$.aos.desktop.copyCache[1].path+" to: "+currentRoot);
									if (isExe) {
										var temp = $.aos.desktop.cutCache[1].path;
										name = temp.lastIndexOf("/")==-1?temp : temp.substring(temp.lastIndexOf("/")+1,temp.length);
										$.aos.fs.mv($.aos.desktop.cutCache[1].path, $.aos.desktop.currentDesktop.root+"/"+name);
										path = $.aos.desktop.currentDesktop.root + "/" + name;
									}
									else if (isLink) {
										var temp = $.aos.desktop.cutCache[1].path;
										name = temp.lastIndexOf("/")==-1?temp : temp.substring(temp.lastIndexOf("/")+1,temp.length);
										//alert(name);
										$.aos.fs.createLink($.aos.desktop.currentDesktop.root,name,$.aos.desktop.cutCache[1].linkpath);
										$.aos.fs.rm($.aos.desktop.cutCache[1].path);
										path = $.aos.desktop.currentDesktop.root + "/" + name;
									}
									// $.aos.fs.cp($.aos.desktop.copyCache[1].path, $.aos.desktop.currentDesktop.root);
									else{
										$.aos.fs.mv($.aos.desktop.cutCache[1].path, $.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.cutCache[1].name);
										path = $.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.cutCache[1].name;
									}
									var node = new $.aos.ui.UINode($.aos.fs.mapWith(path));

									// var node = new $.aos.ui.UINode($.aos.fs.mapWith($.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.copyCache[1].name));
									$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut(node));
									$.aos.desktop.cutCache = new Array();	
								}
								// alert("ok2");
								// $($.aos.desktop.cutCache[0]).css('opacity', 0);
								//$.aos.desktop.cutCache[0].css('opacity', 0);
								return 
							}else if($.aos.desktop.copyCache.length!=0){
								// 1. 判断当前文件夹是否有重名文件，有则提示，并改名为 （ 重命名 ）
								// 2. 改变o.cutCache[1]的name和path
								if ($.aos.desktop.currentDesktop.root.lastIndexOf($.aos.desktop.copyCache[1].path)!=-1) {
									alert("目标文件夹是源文件夹的子文件夹！");
									return
								}
								var name = $.aos.desktop.copyCache[1].name;
								var path = $.aos.desktop.copyCache[1].path;
								//var timestamp = " - "+new Date().getTime();
								var timestamp = " - (复制)";
								//name = name.substring(0,name.lastIndexOf("."))+timestamp+name.substring(name.lastIndexOf("."),name.length);
								var filename = name.lastIndexOf(".")==-1?name : name.substring(0,name.lastIndexOf("."));
								var filesuffix = name.lastIndexOf(".")==-1?"" : name.substring(name.lastIndexOf("."),name.length);
								var isExe = (filesuffix==".exe");
								var isLink = (filesuffix==".lin");
								if (isExe) {
									name = filename + timestamp +".lin";
								}
								// else{
								// 	name = filename + timestamp +filesuffix;
								// }
								
								while($.aos.fs.exists($.aos.desktop.currentDesktop.root+"/"+name)=="true"){
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
								path = $.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.copyCache[1].name;
								if ($.aos.desktop.currentDesktop.root+"/"+checkname==$.aos.desktop.copyCache[1].path) {
									checkname = name;
								}
								if($.aos.fs.exists($.aos.desktop.currentDesktop.root+"/"+checkname) == 'true'){
									// if(true) {
										var _box = $.aos.lightbox.create({
											height:500,
											width:500,
											top:'10%',
											closable: false,
										});
									
										_box.loadHTML("system/FileManager/PasteDialog/index.html",function(){
											_box.loadedContent.data("params",{
												lightbox: _box,
												type: 'desktopCopy',
												name: name,
												path: path,
												src:$.aos.desktop.copyCache[1]
											});
										});
								}else{
									//alert("from: "+$.aos.desktop.copyCache[1].path+" to: "+currentRoot);
									if (isExe) {
										//alert(checkname);
										$.aos.fs.createLink($.aos.desktop.currentDesktop.root,checkname,$.aos.desktop.copyCache[1].path);
										path = $.aos.desktop.currentDesktop.root + "/" + checkname;
									}
									// $.aos.fs.cp($.aos.desktop.copyCache[1].path, $.aos.desktop.currentDesktop.root);
									else if (isLink) {
										$.aos.fs.createLink($.aos.desktop.currentDesktop.root,checkname,$.aos.desktop.copyCache[1].linkpath);
										path = $.aos.desktop.currentDesktop.root + "/" + checkname;
									}
									else{
										$.aos.fs.cp($.aos.desktop.copyCache[1].path, $.aos.desktop.currentDesktop.root+"/"+name);
										path = $.aos.desktop.currentDesktop.root+"/"+name;
									}
									
									var node = new $.aos.ui.UINode($.aos.fs.mapWith(path));
									// var node = new $.aos.ui.UINode($.aos.fs.mapWith($.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.copyCache[1].name));
									$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut(node));
									$.aos.desktop.copyCache = new Array();	
								}
								return 
							}
						}else{
							alert("没有任何复制或剪切项");
						}
					}	
				}, mAddApp = {
					text: "添加应用",
					func: function() {
						var w = $.aos.win.create({width:740,height:420,title:'应用市场',minimizeIcon:'images/icons/app_center.png'});
						w.loadIframe("system/AppCenter/");
					}
				}, mNew = {
					text: "新建",
					data: [
						[{
							text: "文本文件",
							func: function() {
								//var p = o.currentDesktop.root+'/新建文件'+new Date().getTime()+'.txt';
								var p = o.currentDesktop.root+'/新建文件.txt';
								var node = new $.aos.ui.UINode($.aos.fs.mapWith($.aos.fs.create(p)));
								$("#shortcut_desk").append(o.currentDesktop.addShortcut(node));	
							}
						}, {
							text: "文件夹",
							func: function() {
								//var p = o.currentDesktop.root+'/新建文件夹'+new Date().getTime();
								var p = o.currentDesktop.root+'/新建文件夹';
								var newDir = $.aos.fs.mkdir(p);
								var dd = $.aos.fs.mapWith(newDir);
								var node = new $.aos.ui.UINode(dd);
								$("#shortcut_desk").append(o.currentDesktop.addShortcut(node));	
							}
						}, {
							text: "创建快捷方式",
							func: function() {
								var w = $.aos.win.create({width:740,height:430,title:'创建快捷方式'});
								w.loadIframe("system/AddShortcut/index.html?_winid="+w.winid);
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
						box.loadIframe("system/FileManager/FileUpload/index.html?_path="+$.aos.desktop.currentDesktop.root);
					}
				};
				/*var mailMenuData = [
					[mSort, mRefresh], [mNew], [mPaste], [mAddApp],[mUpload]
				];*/
				var mailMenuData = [
					[mSort, mRefresh], [mNew], [mPaste], [mUpload]
				];
				
				$('.center').smartMenu(mailMenuData, {
					name: "desktop",
					beforeShow: function() {		
						
					},
					afterShow: function() {		
						$(document).one('click',$.smartMenu.hide);
					}
				});
				
				//右边最小化窗口bar  向上向下操作
				var _mini_count = 0;
				$('.next',$('.left_nav_tools')).click(function(){
					var shows = $(".show",$("#_minimizeBar"));
					if(shows.length >= 9){
						shows.eq(0).removeClass("show").addClass("hide");
					}
				});
				
				$('.prev',$('.left_nav_tools')).click(function(){
					var hides = $(".hide",$("#_minimizeBar"));
					hides.eq(hides.length-1).removeClass("hide").addClass("show");
				});
				
				
				// NISP 幕布下拉
				 $(".head_info").append("<iframe height='450px' width='100%' src='system/Notification/index.html' style='border:none;'>");
				
				$(".head_noclick").toggle(
				function(){
					o.alarmDivIsOpen = true;
					$(".head_menu").css({"z-index":"99998"});
					$(".head_info").css({"display":"block","opacity":"0.9","z-index":"99999"}).slideDown(500);
					$(".head_bar_right").css({"z-index":"0"});
					$(this).removeClass("onclick");
					$(this).addClass("noclick");					
				},
				function(){
					o.alarmDivIsOpen = false;
					$(".head_info").hide().slideUp(500,function(){
							$(".head_menu").css({"z-index":"1"});
							$(".head_bar_right").css({"z-index":"2"});
					});
					$(this).removeClass("noclick");
					$(this).addClass("onclick");
				});
				
				
			};
			
			//弹出告警提示
			DesktopManager.prototype.alarmShow = function(path){
				if (!this.alarmDivIsOpen)
				{
					$(".head_noclick").trigger("click");
				}
			}
			
			
			//初始化桌面
			DesktopManager.prototype.initDesktop = function(){
				//1. 遍历/home/[username]/文件夹检测用户有多少个桌面
				//2. 生成桌面选择的Bar
				//3. 读取system.config文件，查看用户的设置并显示CurrentDesktop
				var o = this;
				$('.screen_icon').html();
				var config = JSON.parse($.aos.reg.getValue($.aos.users.current + "_sysconfig"))||{};
				//console.log(config.currentDesk);
				if (config.currentDesk==undefined) {
					config.currentDesk = "default";
				}
				if (config.currentWallpaper==undefined) {
					config.currentWallpaper = "/images/theme/wallpapers/7.jpg";
				}
				//var config = JSON.parse($.aos.reg.getValue($.aos.users.current +"_sysconfig"));
				//var config = JSON.parse('{}');
				//初始化桌面墙纸
				$("body").css("background", "url(\""+$.util.getImage(config.currentWallpaper)+"\") repeat scroll 0 0 transparent");
				//初始化桌面主题
				$("#_amskin").attr("href",config.currentSkin);
				//o.createDesktopScreenIcon(path, config);
				var desktops = $.aos.fs.lsDirs("/system/desktops");
				for(var i=0; i < desktops.length;i++){
					var f = desktops[i];
					var desk = o.createDesktop(new Date().getTime()+i, f.name, f.path);
					//o.currentDesktop = desk;
					if(f.name == config.currentDesk){
						o.currentDesktop = desk;
					}
				}
				o.createDesktopScreenIcon();
				o.currentDesktop.init();
				
			};
			
			
			//创建桌面
			DesktopManager.prototype.createDesktop = function(id, name, root){
				var d = new Desktop();
				d.descktopID = id;
				d.name = name;
				d.root = root;
				$.aos.desktop.desktops.push(d);
				return d;
			};
			
			//移除桌面
			DesktopManager.prototype.removeDesktop = function(desk){
				for(var i=0; i< ($.aos.desktop.desktops.length); i++){
						if(desk.descktopID == $.aos.desktop.desktops[i].descktopID){
							$.aos.desktop.desktops.splice(i,1);
							return 
						}	
				}
			};
			
			//重命名桌面
			DesktopManager.prototype.renameDesktop = function(desk, newName){
				for(var i=0; i< ($.aos.desktop.desktops.length); i++){
						if(desk.descktopID == $.aos.desktop.desktops[i].descktopID){
							$.aos.desktop.desktops[i].name = newName;
							var path = $.aos.desktop.desktops[i].root.substring(0,$.aos.desktop.desktops[i].root.lastIndexOf("/"));
							$.aos.desktop.desktops[i].root = path+"/"+newName;
							return $.aos.desktop.desktops[i];
						}	
				}
			};
			
			//通过桌面名字获取桌面
			DesktopManager.prototype.getDesktopByName = function(name){
				for(var i=0; i< ($.aos.desktop.desktops.length); i++){
						if(name == $.aos.desktop.desktops[i].name){
							return $.aos.desktop.desktops[i];
						}	
				}
			};
			
			
			//生成多桌面的screen icon
			DesktopManager.prototype.createDesktopScreenIcon = function(){
				var o = this;
				$('.screen_icon').html("");
				
				for(var i=0; i < o.desktops.length;i++){
					var desk = o.desktops[i];
					var screenIcon = $("<span title='"+desk.name+"'>"+(i+1)+"</span>");
					screenIcon.click({
							d : desk
						},function(event){
							$(this).siblings().removeClass("selected");
							$(this).addClass("selected");
							o.changeDesktop(event.data.d);
							o.currentDesktop = event.data.d;
					});
					
					if(desk.name == o.currentDesktop.name){
						screenIcon.addClass("selected");
					}
					
					$('.screen_icon').append(screenIcon);
				}
			};
			
			//打开文件选择器窗口
			DesktopManager.prototype.openFileDialog = function(url,content){
				$.aos.desktop.tmpCache = content;
				var box = parent.$.aos.lightbox.create({
					width:1000,
					height:350,
					closable:true,
				});
				box.loadIframe(url);
			};
			
			
			// 切换桌面动画效果
			DesktopManager.prototype.changeDesktop = function(desk){
				var o = this;
				//IE8-7 对jquery 的 animate 有BUG, 检测浏览器版本并替换方法
				if(!jQuery.support.leadingWhitespace){
					$('.am-window').hide();
					desk.showAllWindows();
					desk.init();
					return	
				}
				
				$('._main').css('position','absolute')
				.animate({ 
					left: '50%',
					opacity: 0,
				}, 300)
				.animate({
					left: '-50%'
				}, function(){
					 $('.am-window').hide();
					 desk.showAllWindows();
					 desk.init();	
				})
				.animate({
					left: '0px',
					opacity: 1,
				 }, 300, function(){
					 $(this).css('position','');
				});
			};
			
			//系统告警
			DesktopManager.prototype.systemAlarm = function(param){
				/*param = {
					hasAlarm:true|false,
					content: "",
					toolbar:[{
						name: "查看全部";
						func: function(){}
					},"",""],
					
				}*/
				var alarmIcon = $(".nisp_alram_icon");
				if (alarmIcon.size() == 0) {
					var cc =  $("<span class='nisp_alram_icon'><img src='images/icons/alarm/alarm.gif' width='19'></span>");
					var o = this;
					cc.click(function(){
						if (o.isShowAlarm) {
							$(".nisp_alram").hide();
							o.isShowAlarm = false;
						} else {
							$(".nisp_alram").show();
							o.isShowAlarm = true;
						}
					});
					$(".help").after(cc);
				}
				
				var $cont = $(".nisp_alram");
				if ($cont.size() == 0) {
					var cont = '';
						cont += "        <div class='nisp_alram'>";
						cont += "        	<em>&nbsp;&nbsp;&nbsp;&nbsp;</em>";
						cont += "            <div class='nisp_alram_bar'>";
						//cont += "            	<a href='#' class='nisp_alram_all'>查看全部</a>&nbsp;|&nbsp;<a href='#' class='nisp_alram_ignore'>忽略全部</a>&nbsp;|&nbsp;<a href='#' class='nisp_alram_close'>关闭提示功能</a>";
						cont += "            </div>";
						cont += "            <ul>";
						/*cont += "            	<li>";
						cont += "	                告警设备：<a class='red' href='#'>【南汇 > 分析机 > 10.23.34.64】</a> 触发告警策略： <a class='red' href='#'>分析机告警</a>";
						cont += "                    <a href='#'>查看</a>&nbsp;|&nbsp;<a href='#' class='_hide'>忽略</a>";
						cont += "                </li>";*/
						cont += "			</ul>";
						cont += "        ";
						cont += "        </div>";
						
						$cont = $(cont);
						$("._main").before($cont);
				}
				$("ul",$cont).append(param.content);
					
				$("div.nisp_alram_bar", $cont).html("");
				for(var i=0; i<param.toolbar.length; i++){
					var co = $("<a href='#'>"+param.toolbar[i].name+"</a>&nbsp;|");
					co.click(param.toolbar[i].func);
					$cont.find(".nisp_alram_bar").append(co);	
				}
				
				if (param.hasAlarm){	
					if (this.isShowAlarm) {
						$cont.show();
					} else {
						$cont.hide();
					}
					alarmIcon.show();	
				} else {
				    $cont.hide();
					alarmIcon.hide();	
				}
					
			};
			
			//检测浏览器版本
			DesktopManager.prototype.detectBrowser = function(){
				if(!jQuery.support.leadingWhitespace){
					var c = $("<div style=\" position:absolute;z-index:9999; top:15%; left:30%;width:auto; height:30px; line-height:30px; padding:0 8px; color:#000; background:#F8F8F8; border-radius:4px; border:1px solid #999;\">您使用的浏览器版本过低，影响网页性能，建议你换用IE9,谷歌,或火狐浏览器。</div>​");
					c.appendTo('body');
					$(document).one('click', function(){ 
							c.fadeOut(2000,function(){ $(this).remove(); });
					});
				}
				 
			};

			$.aos.desktop = new DesktopManager();
})(jQuery);




