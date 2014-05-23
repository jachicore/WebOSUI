/*
 *c1avie js
 *@project WebOs
 *@version 2.0
 *@author c1avie (www.c1avie.com)
 */

 $(function() {
 	var nz_icon = $('.nz-icon'),
 		nz_drop_menu = $('.nz-drop-menu');

	var menu_li = $("<li path='/system/desktops/myh/新建文件夹' appname='文件系统' apptype='dir'><img src='images/icons/icon-folder.png'><span class='name'>文件系统</span></li>").click(function (){
		$('.nz-drop-menu').css("display","none");
		var win = $.aos.win.create({title: 'File Browser', minWidth: 800, 'minimizeIcon':'images/icons/icon-folder.png'});
		var path = '/system';
		win.win.find('.am-window-content').fileBrowser({'path': path, 'win': win});		
	});
	$("#nz-drop-desk").append(menu_li);

 	nz_icon.bind('click',function(event) {
 		nz_drop_menu.toggle();
 		event.stopPropagation(); 
 	});
 	$('body').bind('click',function() {
		nz_drop_menu.hide();
	});
 });