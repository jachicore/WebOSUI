
$(function(){
	init();
	setInterval(function(){
		//testwrite();
		init();
		
	},5000);
	$(".time").click(function(){
		$(this).next().toggle();
	});
	setInterval(function(){
		//testwrite();
		requestWebosService();
		
	},1000);

});

function testwrite(){
	//alert("ok");
  $.ajax({
            type: "get",
            async: false,
            contentType: "application/json",
            url: 'http://59.68.29.42:25107/aas/servlets/writeWarnInfo',
            data:{username:'admin',
            appid:'4e6d69ec-e9f5-4141-9912-1ce74e5e8035',
            notiftype:'warninfo',
            message:'testmessage'},
            dataType: 'jsonp',
            jsonp: "callbackparam",
        }); 

  $.ajax({
            type: "get",
            async: false,
            contentType: "application/json",
            url: 'http://59.68.29.42:25107/aas/servlets/writeWarnInfo',
            data:{username:'admin',
            appid:'4e6d69ec-e9f5-4141-9912-1ce74e5e8035',
            notiftype:'createwin',
            message:'{"url":"http://www.baidu.com","winSettings":{"width": 800, "height":800, "title":"baidu"}}'},
            dataType: 'jsonp',
            jsonp: "callbackparam",
        }); 
};

//初始化
function requestWebosService(){
	$.post("/aas/servlets/explorerService", {username: top.$.aos.users.current}, function(data) {
		if(data.createwin != null){
			openUrl(data.createwin);
		}
	},"json");
}

function init(){
	//alert("ok2");
	$.post("/aas/servlets/warnInfo", {username: top.$.aos.users.current,appid:"e34fe6ba-8ec7-46ef-8e29-e4894b8ebe36"}, function(data) {
		var count = getAllCount(data.items)
		if(count > 0){
			top.$.gritter.add({
				// (string | mandatory) the heading of the notification
				title: '告警信息',
				// (string | mandatory) the text inside the notification
				text: "您当前有<span style='padding: 0 5px; color: red'>"+count+"</span>条告警信息，<a href='javascript:void(0)' onclick=(function(){$.aos.desktop.alarmShow();$.gritter.removeAll();})() style='color: #fff'>请此处查看</a>",
				// (bool | optional) if you want it to fade out on its own or just sit there
				sticky: false,
				// (int | optional) the time you want it to be alive for before fading out
				time: ''
			});
			$("#clearAll").show();
		}
		showTitle(data.items);
	},"json");

};

function openUrl(data){
	for(var i=0;i<data.length;i++){
		var def = $.extend({width:1200, height:450, title: "test"},data[i].winSettings);
		var window = parent.$.aos.win.create(def);

		window.loadIframe(data[i].url);
	};
}

//获取告警总数
function getAllCount(data){
	var count = 0;
	for(var i in data){
		count += data[i].count;
	}
	
	return count;
}

//刷新
function refreshs(){

	getNotifi($(".active span").attr("path"));
}
//查看所有
function getAll(){
	var name = id = $(".active span").attr("title");
	var path = id = $(".active span").attr("path");
	
	var win = top.$.aos.win.create({
		top:20,
		left:100,
		width:800,
		height:400,
		title:"日志管理 - "+name,
		modal:false,
		windata:{parent:window, path:path}
	});
	win.loadIframe("system/Notification/getAll.html");
}
//删除全部
function delAll(){
	var path = $(".active span").attr("path");
	$.post("/aas/servlets/clearlogs", {path:path}, function(data) {
		if(data == true ||data == "true"){
			alert("清空成功！");
			$(".active span").html("0");
		}else{
			alert("服务器忙！");
		}
		refreshs();
	},"json");
};
//获取日志
function getNotifi(path){
	//alert("showlogs");
	if(typeof(path)=='undefined' || path==''){return}
	//var fileArray = top.$.aos.fs.ls(path).sort(sortNumber);
	$.post("/aas/servlets/showlogs", {path: path}, function(data) {
		var fileArray = data;
		var fiveArray = fileArray.last30m;
		var tenArray = fileArray.others;
		var objFive = $(".five .gaojing");
		var objTen = $(".ten .gaojing")
		showBox(objFive,fiveArray);
		showBox(objTen,tenArray);
	},"json");
};
//页面日子导航生成
function showTitle(data){
	var obj = $("#tabmenu ul");
	var cont = "";
	var path = $(".active span").attr("path");
	for(var i=0;i<data.length;i++){
		if(typeof(path) == "undefined"){
			cont += "<li class='li active'>"+data[i].name+"<span title='"+data[i].name+"' path='"+data[i].path+"' class='alertnum'>"+data[i].count+"</span></li>";
		}else if(data[i].path == path){
			cont += "<li class='li active'>"+data[i].name+"<span title='"+data[i].name+"' path='"+data[i].path+"' class='alertnum'>"+data[i].count+"</span></li>";
		}else{
			cont += "<li class='li'>"+data[i].name+"<span title='"+data[i].name+"' path='"+data[i].path+"' class='alertnum'>"+data[i].count+"</span></li>";
		}
	};
	obj.html("");
	obj.append(cont);
	//refreshs();
	$("#tabmenu li").click(function(){
		$(this).addClass("active");
		$(this).siblings("li").removeClass("active");
		var path = $("span",$(this)).attr("path");
		getNotifi(path);
	});
}
//页面日志生成
function showBox(obj,data){
	if(data.length>0){
		var cont = "<li style='font-size:18px;'><span class='span3 spanBgColor1'>通知时间</span><span class='span6 spanBgColor1'>通知内容</span></li>";
	}
	for(var i in data){
		cont += "<li><span class='span3 spanBgColor2'>"+getLocalTime(data[i].time)+"</span><span class='span6 spanBgColor2'>"+data[i].content+"</span></li>";
	};
	//cont += "<li><span class='span3 spanBgColor2'>以下没有数据...</span><span class='span6 spanBgColor2'>以下没有数据...</span></li>";
	obj.html("");
	obj.append(cont);
};
//时间戳转换为时间格式
function getLocalTime(time) {
	nS = time.toString().substring(10,0);
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "); 
};