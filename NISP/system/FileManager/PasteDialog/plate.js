// JavaScript Document.

var _cont = $("<div style='width:450px; height:470px; background:#FFF;overflow:hidden; font-size:12px;'><style type=\"text/css\">.ssdcinfo:hover{ cursor:pointer; border:1px solid #CCD3DD;background:#F2F5FC;background: -webkit-gradient(linear, 0 0, 0 bottom, from(#FAFEFF), to(#F2F5FC));background: -moz-linear-gradient(#FAFEFF, #F2F5FC);background: linear-gradient(#FAFEFF, #F2F5FC);}</style><p style='width:100%; height:20px; line-height:20px; margin:0; margin-top:15px;font-size:20px; font-weight:bold; text-indent:20px; color:#0033CC; overflow:hidden;'>此位置已经包含同名文件。</p><p style='width:100%; height:15px; line-height:15px; margin:0; margin-top:5px;text-indent:20px; overflow:hidden;'>请单击要保留的文件</p></div>");
										
var _replay = $("<div class='ssdcinfo' style=' width:410px; height:130px; margin:10px 18px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px; border:1px solid #FFF; overflow:hidden;'><p  style='height:30px; line-height:30px; margin:0; font-size:14px;color:#0033CC; text-indent:5px; overflow:hidden;'>复制和替换</p><p  style='height:20px; line-height:20px; margin:0; margin-bottom:5px; color:#0033CC;text-indent:5px;overflow:hidden;'>使用正在复制的文件替换目标文件夹中的文件：</p><div style='float:left; width:60px; height:60px; margin:5px 0 0 10px; overflow:hidden;'><img src='"+$.aos.desktop.cutCache[1].icon.img+"' width='60' height='60' /></div><div style='float:right; width:330px; height:70px; text-align:left; overflow:hidden;'><p style='height:18px; line-height:18px; margin:0; overflow:hidden;'>"+$.aos.desktop.cutCache[1].name+"</p><p style='height:18px; line-height:18px; margin:0;overflow:hidden; color:#0033CC;'>"+$.aos.desktop.cutCache[1].path+"</p><p style='height:18px; line-height:18px; margin:0;overflow:hidden;'>大小："+$.aos.desktop.cutCache[1].size+"字节</p><p style='height:18px; line-height:18px; margin:0;overflow:hidden;'>修改日期："+$.aos.desktop.cutCache[1].lastModified+"</p></div></div>").click(function(){
	alert("from: "+$.aos.desktop.cutCache[1].path+" to: "+$.aos.desktop.currentDesktop.root);
	$.aos.desktop.cutCache[0].remove();
	$.aos.fs.mv($.aos.desktop.cutCache[1].path, $.aos.desktop.currentDesktop.root);
	var node = new $.aos.ui.UINode($.aos.fs.mapWith($.aos.desktop.currentDesktop.root+"/"+$.aos.desktop.cutCache[1].name));
	$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut(node));
	$.aos.desktop.cutCache = new Array();
	_box.del();
});


var _undo = $("<div class='ssdcinfo' style=' width:410px; height:130px; margin:10px 18px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px; border:1px solid #FFF; overflow:hidden;'><p  style='height:30px; line-height:30px; margin:0; font-size:14px;color:#0033CC; text-indent:5px; overflow:hidden;'>不用复制</p><p  style='height:20px; line-height:20px; margin:0; margin-bottom:5px; color:#0033CC;text-indent:5px;overflow:hidden;'>将不会更改任何文件。将此文件保留在目标文件夹中：</p><div style='float:left; width:60px; height:60px; margin:5px 0 0 10px; overflow:hidden;'><img src='"+$.aos.desktop.cutCache[1].icon.img+"' width='60' height='60' /></div><div style='float:right; width:330px; height:70px; text-align:left; overflow:hidden;'><p style='height:18px; line-height:18px; margin:0; overflow:hidden;'>"+$.aos.desktop.cutCache[1].name+"</p><p style='height:18px; line-height:18px; margin:0;overflow:hidden; color:#0033CC;'>"+$.aos.desktop.cutCache[1].path+"</p><p style='height:18px; line-height:18px; margin:0;overflow:hidden;'>大小："+$.aos.desktop.cutCache[1].size+"字节</p><p style='height:18px; line-height:18px; margin:0;overflow:hidden;'>修改日期："+$.aos.desktop.cutCache[1].lastModified+"</p></div></div>").click(function(){
	$.aos.desktop.cutCache[0].css('opacity', 1);
	_box.del();
});


var _copyRename = $("<div class='ssdcinfo' style='width:410px; height:60px;margin:10px 18px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px; border:1px solid #FFF;'><p style='height:30px; line-height:30px; margin:0; font-size:14px;color:#0033CC; text-indent:5px; overflow:hidden;'>复制,但保留着两个文件</p><p style='height:20px; line-height:20px; margin:0; margin-bottom:5px; color:#0033CC;text-indent:5px;overflow:hidden;'>正在复制的文件将重命名为'"+name+"'</p></div>").click({newName:name, newPath: path},function(e){
	alert("newName: "+e.data.newName+" newPath: "+e.data.newPath);
	$.aos.desktop.cutCache[0].css('opacity', 1);
	//在新路径下新建文件，将原文件内容拷贝过去
	$.aos.fs.create(e.data.newPath);
	var _content = $.aos.fs.read($.aos.desktop.cutCache[1].path);
	$.aos.fs.write(e.data.newPath, _content);
	
	var node = new $.aos.ui.UINode($.aos.fs.mapWith(e.data.newPath));
	$("#shortcut_desk").append($.aos.desktop.currentDesktop.addShortcut(node));
	$.aos.desktop.cutCache = new Array();
	_box.del();
});


var _cancel = $("<div class='ssdcinfo' style='width:410px; height:40px; line-height:40px; font-size:14px; margin:0 18px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px; text-align:center; border:1px solid #FFF;background:#F0F0F0;background: -webkit-gradient(linear, 0 0, 0 bottom, from(#FCFCFC), to(#F0F0F0));background: -moz-linear-gradient(#FCFCFC, #F0F0F0);background: linear-gradient(#FCFCFC, #F0F0F0);'>取消</div>").click(function(){
	$.aos.desktop.cutCache[0].css('opacity', 1);
	_box.del();
});


_cont.append(_replay).append(_undo).append(_copyRename).append(_cancel);
