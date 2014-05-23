(function($){
	
    $.aos.kernel = {};
    $.aos.kernel.registry = {};
    $.aos.ui = {};

    
    //初始化图标注册表
	$.aos.kernel.registry.iconMap = JSON.parse('{"url":{"img":"images/icons/ie.png", "hoverImg":"images/icons/icon-05-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" },"exe": {"img":"images/icons/icon-01.png", "hoverImg":"images/icons/icon-01-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" },"app": {"img":"images/icons/icon-01.png", "hoverImg":"images/icons/icon-01-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "txt":{"img":"images/icons/notes_icon.png", "hoverImg":"images/icons/Adv-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "appmodel":{"img":"images/icons/CNMP.png", "hoverImg":"images/icons/CNMP-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "chart":{"img":"images/icons/data_icon.png", "hoverImg":"images/icons/CNMP-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "jpg":{"img":"images/icons/photo_icon.png", "hoverImg":"images/icons/CNMP-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "mp3":{"img":"images/icons/music-icon.png", "hoverImg":"images/icons/CNMP-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "MPG":{"img":"images/icons/mov-icon.png", "hoverImg":"images/icons/CNMP-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "suite":{"img":"images/icons/icon-05.png", "hoverImg":"images/icons/icon-05-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "datagrid":{"img":"images/icons/data_icon.png", "hoverImg":"images/icons/icon-05-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "html":{"img":"images/icons/html.png", "hoverImg":"images/icons/icon-05-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" },"css":{"img":"images/icons/css.png", "hoverImg":"images/icons/icon-05-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }, "js":{"img":"images/icons/js.png", "hoverImg":"images/icons/icon-05-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" }}');

    
    //初始化应用程序启动器注册表
	$.aos.kernel.registry.appLanucherMap = JSON.parse('{"url":"openurl","exe":"openurl","txt":"notepad","appmodel":"/bin/AppModel.sh","chart":"openchart","datagrid":"opentable","jpg":"openimage","suite":"gnsuite","mp3":"/bin/MediaPlayer.sh","html":"webide","css":"webide","js":"webide"}');

	//将Filesystem上的一个节点（文件）封装成页面上的一个UI节点

	$.aos.kernel.registry.installApp = function(fileNode){
		var appnode={};
		var appkey = fileNode.name.substring(0, fileNode.name.lastIndexOf('.'));
        var exe = $.aos.app.getExeById(appkey,$.aos.users.current);//返回已经拼接好?id=1_3_4&user=currentuser的数据。
        appnode.suffix = "exe";
        appnode.name = exe.name + ".exe";
    	appnode.linkpath = exe.linkurl;	
        appnode.fatherpath=fileNode.fatherpath;
        appnode.path=fileNode.path;
    	appnode.size = 0;
    	var d = new Date(fileNode.lastModifyTime);
		appnode.lastModified = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours() + ':'+d.getMinutes()+':'+d.getSeconds();
 		appnode.type="file"; //file or dir
 		appnode.winSettings=JSON.parse(exe.winsettings);

        appnode.icon = {"img":exe.image, "hoverImg":"images/icons/CNMP-1.png","menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" };
        appnode.starter = $.aos.kernel.registry.getAppLanucher(appnode);
        
        return appnode;  			
	}
 	$.aos.ui.AppNode = function(appNode){
 		var appnode={};
        appnode.name=appNode.name;
        appnode.appid = appNode.appid;
        appnode.image =  appNode.image;
        return appnode;
    };
    $.aos.ui.UINode = function(fileNode){
    	if(fileNode == null){
    		return;
    	}
        this.fileExtension=fileNode.suffix;
        if (fileNode.suffix == "exe") {
			return $.aos.kernel.registry.installApp(fileNode);
        }
        this.name=fileNode.name;
        this.linkpath = fileNode.linkpath;
        this.type=fileNode.type; //file or dir
        this.fatherpath=fileNode.fatherpath;
        this.path=fileNode.path;
		//var d = new Date(1395436606);
		var d = new Date(fileNode.lastModifyTime);
		this.lastModified = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours() + ':'+d.getMinutes()+':'+d.getSeconds();
		var profile = JSON.parse(fileNode.profile);
		this.size = fileNode.size;
        // this.icon =  '"img":"images/icons/task_icon.png"';
        this.icon =  $.aos.kernel.registry.getIcon(fileNode);
        this.starter = $.aos.kernel.registry.getAppLanucher(fileNode);

        //console.log('node name: '+fileNode.name+' node fileExtension: ' + fileNode.suffix);"(function(context){"+content+"})("+JSON.stringify(xContext)+");"
		
        return this;
    };

	$.aos.kernel.registry.isLinkLegal=function(file){
		var mapfile = $.aos.fs.mapWith(file.linkpath);
		return !(mapfile==null);
	}    

    $.aos.kernel.registry.getIcon=function(file){
		var defaultIcon = {"img":"images/icons/app-warning-icon.png", "hoverImg":"images/icons/CNMP-1.png","menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" };
		var urlIcon={"img":"images/icons/ie.png", "hoverImg":"images/icons/icon-05-1.png", "menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" };
		var defaultFolderIcon = {"img":"images/icons/icon-folder.png", "hoverImg":"images/icons/icon-folder-1.png","menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" };
		var unexist = {"img":"images/icons/CNMP.png", "hoverImg":"images/icons/CNMP-1.png","menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" };
		switch(file.type){

			case 'file':
				switch(file.suffix.toLowerCase()){
					case 'lin':
						var filetemp = $.aos.fs.mapWith(file.linkpath);
    					if (filetemp!=null) {
    						if (filetemp.suffix =="exe") {
    							//var appnode={};
								//var appkey = filetemp.name.substring(0, filetemp.name.lastIndexOf('.'));
        						//var exe = $.aos.app.getExeById(appkey,$.aos.users.current);
								//return {"img":exe.image, "hoverImg":"images/icons/CNMP-1.png","menuImg":"images/icons/nav-1-1.png","menuHoverImg":"images/icons/nav-1.png" };
    							return $.aos.kernel.registry.installApp(filetemp).icon;
    						}
    						return this.getIcon(filetemp);
    					}
							//return this.getIcon($.aos.fs.mapWith(file.linkpath));
						return defaultIcon;
						break;
					
					// 图片后缀
					case 'jpg':
					case 'gif':
					case 'png':
					case 'bmp':
						var path = $.util.getImageIcon(file.path,48,48);
						var icon = {
							img : path,
							hoverImg : '',
							menuImg : '',
							menuHoverImg : ''
						};
						return icon;
					
					break;
					
					default:
					// check whether webOS know this type of file
					if(file.suffix.toLowerCase() in $.aos.kernel.registry.iconMap){
						//if know then
						return $.aos.kernel.registry.iconMap[file.suffix+''];
					}else{
						return defaultIcon;
					}
				}
			break;
			
			case 'dir':
				// read folder.ini file in sub directory of "file" and get out the 
				// icon image property form it, then return the icon url.
				if($.aos.fs.exists(file.path+"/folder.ini") == 'true'){
					var file = $.aos.fs.mapWith(file.path+"/folder.ini");
					var tmpObj = JSON.parse($.aos.fs.mapWith(file.path+"/folder.ini"));
					return tmpObj.icon;
				}else{
					return defaultFolderIcon;
				}
			break;
		}
		
    };

    // 要返回一个函数
    $.aos.kernel.registry.getAppLanucher=function(file){
    	if(file.type=="file"){
    		var starterPath ="";
    		if (file.suffix == "lin") {
    			var filetemp = $.aos.fs.mapWith(file.linkpath);
    			if (filetemp!=null) {
    				if (filetemp.suffix =="exe") {
    					return $.aos.kernel.registry.installApp(filetemp).starter;
    				}
    				return this.getAppLanucher(filetemp);
    			}

    		}


    		if(file.suffix in $.aos.kernel.registry.appLanucherMap){
    			//if know then
    			starterPath = $.aos.kernel.registry.appLanucherMap[file.suffix+''];
    		}else{
    			starterPath = "errormessage";
    		}
			
			var context;
			// var content = $.aos.fs.read(starterPath);
			var content;

			switch(starterPath) {
				case 'openurl':
					var content0 = "var def = $.extend({width:1200, height:450, title: context.argFile.name},context.winSettings);";
					var content1 = "var window = $.aos.win.create(def);";
					var content2 = 'window.loadIframe(context.argFile.linkpath);';
					content = content0 + content1+content2;
					break;
				case 'notepad':
					var content1 = "var win = $.aos.win.create({width:805,height:350,title:'记事本',minimizeIcon:'images/icons/notes_icon.png'});";
					var content2= 'win.loadIframe("system/Editer/txt/index.html?_winid="+win.winid+"&_path="+context.argFile.path);';
					content = content1 + content2;
					break;
				case 'gnsuite':
					var content1 = "var def = $.extend({width:1200, height:450, title: context.argFile.name},context.winSettings);";
					var content2 = "var win = $.aos.win.create(def);";
					var content3 = 'win.loadIframe("applications/GNSuite/index.html?_winid="+win.winid+"&_path="+context.argFile.path);';
					content = content1 + content2 + content3;
					break;
				case 'openimage':
					var content0 = "var def = $.extend({width:600, height:600, title: context.argFile.name});";
					var content1 = "var path = $.util.getImage(context.argFile.path);$.aos.win.create(def).loadIframe(path);";
					content = content0 + content1;
					break;
				case 'openchart':
					content = '$.aos.win.create({title: context.argFile.name}).loadIframe("system/DataViewer/chart.html?_path="+context.argFile.path);'
					break;
				case 'opentable':
					content = '$.aos.win.create().loadIframe("system/DataViewer/datagrid.html?_path="+context.argFile.path);';
					break;
				case 'webide':
					var content1 = "var win = $.aos.win.create({width:805,height:350,title:'HTML编辑器',minimizeIcon:'images/icons/am.png'});"
					var content2 = 'win.loadIframe("system/Editer/ide/editer.html?_winid="+win.winid+"&_path="+context.argFile.path);'
					content = content1 + content2;
					break;
				case 'errormessage':
					content = 'alert("打开失败");';
					break;
				default:
					break;
			}
			if(typeof(file.winSettings)!='undefined'){
				var xContext = {'shFilePath':starterPath,'argFile':file,'winSettings':file.winSettings};
			}else{
				var xContext = {'shFilePath':starterPath,'argFile':file};
			}
			context = "(function(context){"+content+"})("+JSON.stringify(xContext)+");";
			return context;
			
    	}
    	else{
			
    		return "var win = $.aos.win.create({title: 'File Browser', minWidth: 800, 'minimizeIcon':'images/icons/icon-folder.png'});win.win.find('.am-window-content').fileBrowser({'path': '"+file.path+"', 'win': win});";
			//return "var w = $.aos.win.create({}).win.find('.am-window-content'); console.log(w);w.fileBrowser({path: '"+file.path+"'});";
    	}
    };

	
    
})(jQuery);
