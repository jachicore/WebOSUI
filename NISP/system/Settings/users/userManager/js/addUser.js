// JavaScript Document

function registEvent(){
	
	loadAuthority();
	loadSystemUserList();
	$(".addUser").click(function(){
		var reg = /^([a-zA-Z0-9]|[-_()]){0,9}$/;
		var username = $.trim($("#_name").val());
		var roles = getRoles();
		if((!reg.test(username))||username=="") {
			alert("用户名不合法");
			return;
		}
		if (username != "" && roles.length > 0) {
			if(!($.aos.users.um.existsUser(username)=="true")){
					// var item = $("<p class=\"useritem\" style=\"margin:0px 0 0 20px;\"><label class=\"name\" style=\"display:inline-block; width:40%;\">Administrator</label> <label class=\"group\" style=\"display:inline-block; width:40%;\">Admin</label> <a href='#'>删除</a></p>");
					var item = $("<p class=\"useritem\" style=\"margin-right: 5px;margin-top: 10px;\"><input type='checkbox' style='margin-right: 5px;margin-top: 10px;' name='usercheckbox' class='usercheckbox'><label class=\"name\" style=\"display:inline-block;vertical-align: top;width:40%;\">Administrator</label> <label class=\"group\" style=\"display:inline-block;word-break: break-all; width:40%;\">Admin</label></p>");
					createUser(username,JSON.stringify(roles));
					$("label.name",item).html(username);
					$("label.group", item).html(roles.join(','));
					$(".usercheckbox",item).html(username);
					$(".usercheckbox",item).val(username);
					$("#_currentAddedUserList").append(item);
					alert("添加成功！");	
					window.location.reload(); 
			} else {
				alert("该用户已添加！");	
			}
		} else {
			alert("请输入用户名或者用户组!");
		}
	});
	//搜索用户.
	$('#search').click(function() {
		$('#_systemUserList').html("");
		var search_value = $('#search-value').val();
		if(search_value == "") {
			alert("输入的搜素内容为空!");
			return;
		}
		$('.mm-left-tree h2').html("<a href='javascript:window.location.reload();'>返回用户列表</a>");
		var get_user = $.aos.users.um.getUser(search_value);
		var item = $("<p class=\"useritem\" style=\"margin-right: 5px;margin-top: 10px;\"><input type='checkbox' style='margin-right: 5px;margin-top: 10px;' name='usercheckbox' class='usercheckbox'><label class=\"name\" style=\"display:inline-block;vertical-align: top;width:40%;\">Administrator</label> <label class=\"group\" style=\"display:inline-block;word-break: break-all; width:40%;\">Admin</label></p>");		var username = get_user.username;
		var roles = JSON.parse(get_user.roles);
		$("label.name",item).html(username);
		$("label.group", item).html(roles.join(','));
		$(".usercheckbox",item).html(username);
		$(".usercheckbox",item).val(username);
		$('#_currentAddedUserList').html("");
		$("#_currentAddedUserList").append(item);
	});
	//添加用户
	$('#add-user').click(function() {
		$('#_name').val("");
		$("[name = addcheckbox]:checkbox").attr("checked", false);
		$('#_name').removeAttr("readonly");
		$('#change-delete').css("display","none");
		$('#add-delete').css("display","block");
		$('.mm-right-tree h2').html("添加用户");
	});
	//修改用户
	$('#change-user').click(function() {
		var checked_val = $('.usercheckbox:checked');
		// if(username=='admin'){
		// 	alert("不能删除超级管理员！");
		// 	return
		// }
		if(checked_val.length > 1) {
			alert("不能同时修改多个用户!");
			return;
		}
		else if(checked_val.length == 0) {
			alert("请选择需要修改的用户!");
			return;
		}
		else {
			var select_group = checked_val.parent().find('label.group').text();
			var select_array = select_group.split(',');
			var group_input = $('#_group input');
			$('#add-delete').css("display","none");
			$('#change-delete').css("display","block");
			$('.mm-right-tree h2').html("修改用户");
			$("[name = addcheckbox]:checkbox").attr("checked", false);
			$('#_name').val(checked_val.text());
			$('#_name').attr("readonly","true");
			for(var i = 0;i < group_input.length;i++) {
				for(var j = 0;j < select_array.length;j++) {
					if($(group_input[i]).val() == select_array[j]) {
						$(group_input[i]).attr("checked","true");
					}
				}
			}
			$('#change-button').click(function() {
				var username = $.trim($("#_name").val());
				var roles = getRoles();
				if (username != "" && roles.length > 0) {
					var item = $("<p class=\"useritem\" style=\"margin-right: 5px;margin-top: 10px;\"><input type='checkbox' style='margin-right: 5px;margin-top: 10px;' name='usercheckbox' class='usercheckbox'><label class=\"name\" style=\"display:inline-block;vertical-align: top;width:40%;\">Administrator</label> <label class=\"group\" style=\"display:inline-block;word-break: break-all; width:40%;\">Admin</label></p>");					
					$.aos.users.um.alterUserGroup(username,JSON.stringify(roles));
					alert("修改成功");
					checked_val.parent().remove();
					$("label.name",item).html(username);
					$("label.group", item).html(roles.join(','));
					$(".usercheckbox",item).html(username);
					$(".usercheckbox",item).val(username);
					$("#_currentAddedUserList").append(item);
					window.location.reload(); 
				} else {
					alert("请输入用户名或者用户组!");
				}
			});
		}
	});
	//删除用户
	$('#delete-user').click(function() {
		var checked_val = $('.usercheckbox:checked');
		if (checked_val.length==0) {
			alert("请选择要删除的用户");
			return;
		}
		var c = confirm("确定要删除该用户吗？");
		if(!c) return;
		for(var i = 0;i < checked_val.length;i++) {
			(function(j) {
				delSystemUser(checked_val[j].value,checked_val[j]);
			})(i);
		}
		alert("删除成功");
		window.location.reload(); 
	});
	
	$("#groupAdd").click(function(){
		var errorP = new Array();
		$("p.useritem", $("#_currentAddedUserList")).each(function(){
			var username = $("label.name",this).html();
			var roles = $("label.group",this).html().split(',');
            roles.push("administrator");
			
			var user = parent.$.aos.users.um.getUser(username);
			if (user.rst == "null"){
				if (!createUser(username, roles)) {
					errorP.push(this);
				};
			}
		});
		for (var i = 0; i < errorP.length; i++) {
			$(errorP[i]).css("color", "#f00");
		}
		alert("添加完成！");
		window.location = "user-list.html";
	});
}

function notInList(username){
	//var len = $(".mm-left-tree label:contains('"+username+"')").size();
	//return len == 0;
	var flag = true;
	$("#_currentAddedUserList label").each(function(){
		if($(this).text() == username){
			flag = false
		}
	});	
	return flag;
}

function createUser(username, roles){
	var profile = {
		name: "",
		title: "-",
		department: "-",
		phone: "-",
		telephone: "-",
		qq: "-",
		fax: "-",
		email: "-",
		address: "-",
		introduction: "-",
		password: "1234"
	};
	profile.name = username;
	
	//var newUser = {profile,"roles":roles};
	if(typeof(username)!='undefined'){
		if (!(username in parent.$.aos.users.registry)) {
			parent.$.aos.users.um.saveUser(username, JSON.stringify(profile),roles+"");
			//createUserHome(username);
			//loadUserApp(username, roles);
		    return true;
	    } 		
	}
	return false
}

// 为用户添加默认应用快捷方式到桌面
function loadUserApp(username, roles) {
	var _apps = db_findAppsByGroups(roles);
	var _appPath = "/home/"+username+"/.app/myapp/";
	for ( var k = 0; k < _apps.length; k++) {
		addShortcut(_apps[k].name,_apps[k].path,_appPath,username);
	}
}

function getRoles(){
    var roles = new Array();
	var checked = $('#_group').find('input[type="checkbox"]:checked');
	for(var i = 0;i < checked.length;i++) {
		roles.push(checked[i].value);
	}
	return roles;
}

function loadAuthority() {
	var groups = $.aos.users.um.getGroups();
	if (groups.length != 0) {
	    var groupNames = new Array();
	}else{
		return;
	}
	
	for (var i=0; i<groups.length; i++) {
		groupNames.push(groups[i]);
	}
	// 在页面中加载权限选项
	for(var i = 0;i < groupNames.length;i++) {
		var user_checkbox = $('<input type="checkbox" name="addcheckbox" value="'+groupNames[i]+'" />'+groupNames[i]+'</input>');
		$("#_group").append(user_checkbox);
	}
}


function loadSystemUserList(){
	var list = parent.$.aos.users.um.getUserList();
	for(var j=0;j<list.length;j++){
		if(user == 'admin') continue;
		var user = list[j];
		var name = user.username;
		var out="";
		var groups = JSON.parse(list[j].roles);
		out = groups.join(',');
		// var users = $("<p class=\"useritem\" style=\"margin:0px 0 0 20px;\"><label class=\"name\" style=\"display:inline-block; width:40%;\">Administrator</label> <label class=\"group\" style=\"display:inline-block; width:40%;\">Admin</label> <a href='#' onclick=delSystemUser('"+name+"',this) >删除</a></p>");
		var users = $("<p class=\"useritem\" style=\"margin-right: 5px;margin-top: 10px;\"><input type='checkbox' style='margin-right: 5px;margin-top: 10px;' name='usercheckbox' class='usercheckbox'><label class=\"name\" style=\"display:inline-block;vertical-align: top;width:40%;\">Administrator</label> <label class=\"group\" style=\"display:inline-block;word-break: break-all; width:40%;\">Admin</label></p>");		$("label.name",users).html(name);
		$(".usercheckbox",users).html(name);
		$(".usercheckbox",users).val(name);
		$("label.group", users).html(out);
		
		$("#_systemUserList").append(users);
	}
}

	
function delSystemUser(username,obj){
	if(username=='admin'){
		alert("不能删除超级管理员！");
		return
	}
	//$(obj).parent().remove();
	top.$.aos.users.um.deleteUser(username);
	top.$.aos.fs.deleteAllByUser(username);
	top.$.aos.reg.delete(username+"_sysconfig");
}
