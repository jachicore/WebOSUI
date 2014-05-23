/**
 *   添加用戶组應用
 */
	//  group-app 页面
		
		function initGroups(){
			loadAuthorityManager();
			
			$(".mm-group").change(function(){
				$('.right-app-list dl').html('');
				var apps = $.aos.app.getAppsByRole($(this).val());
				clearTreeApp();
				for ( var k = 0; k < apps.length; k++) {
					var app_profile = JSON.parse(apps[k].profile);
	
					var app_array = [];
					var temp_array=[];
					var app_array_idvalue=[];
					var key = apps[k].appid;
					for(var t = 0;t < app_profile.length;t++) {
						if(app_profile[t].id == "1000") continue;
						app_array.push({appkey:key,appid:app_profile[t].id,value:app_profile[t].name});
						app_array_idvalue.push({appid:app_profile[t].id,value:app_profile[t].name});	
					}
					temp_array.push({appkey:key,permissions:app_profile});
					addApps(apps[k].name,apps[k].installUrl,apps[k].profile,apps[k].appid,app_array_idvalue);
					checkTreeApp(temp_array);
					//initTreeApp();
				};
			});
			
		}


		function clearTreeApp(){
				$.each($('.left-app-list dt'), function(index,item){
					$(item).find('.left_namecheckbox').attr("checked",false);
					var app_child = $(item).next().find('input[type="checkbox"]');
					for(var i=0;i<app_child.length;i++){
						$(app_child[i]).attr("checked",false);
					}
				});
		}
		function checkTreeApp(app_array){
				$.each($('.left-app-list dt'), function(index,item){
					//flag=false;
					for(var i = 0;i<app_array.length;i++){
						if($(item).find('.left_namecheckbox').data('id')==app_array[i].appkey){
							var app_profile = app_array[i].permissions;
							//$(item).find('.left_namecheckbox').attr("checked",true);
							var app_child = $(item).next().find('input[type="checkbox"]');
							for(var i=0;i<app_child.length;i++){
								for(var t = 0;t < app_profile.length;t++) {
									if(app_profile[t].id == "1000") continue;
									//app_array.push({appkey:key,appid:app_profile[t].id,value:app_profile[t].name});
									if (app_profile[t].id == $(app_child[i]).attr("data-id")) {
											//alert(childid);
											$(app_child[i]).attr("checked",true);
											$(item).find('.left_namecheckbox').attr("checked",true);
									}
								}
							}
						}
					}

				});
		}

		//加载用户组
		function loadAuthorityManager() {
			var groups = $.aos.users.um.getGroups();
			if (groups.length != 0) {
			    var groupNames = new Array();
			}else{
				return;
			}
			
			for (var i=0; i<groups.length; i++) {
				if (groups[i] == "admin") {
					continue;
				}
				groupNames.push(groups[i]);
			}
			// 在页面中加载权限选项
			for(var i = 0;i < groupNames.length;i++) {
				var opt = $("<option value='"+groupNames[i]+"'>"+groupNames[i]+"</option>");
				$(".mm-group").append(opt);
				if(i==0){
					var firstGroup = $.aos.app.getAppsByRole(groupNames[i]);
					for ( var j = 0; j < firstGroup.length; j++) {
						var app_profile = JSON.parse(firstGroup[j].profile);
						var app_array = [];
						var app_array_idvalue=[];
						var key = firstGroup[j].appid;
						for(var t = 0;t < app_profile.length;t++) {

							if(app_profile[t].id == "1000") continue;
							app_array.push({appkey:key,permissions:app_profile});
							app_array_idvalue.push({appid:app_profile[t].id,value:app_profile[t].name});
						}
						addApps(firstGroup[j].name,firstGroup[j].installUrl,firstGroup[j].profile,firstGroup[j].appid,app_array_idvalue);
						checkTreeApp(app_array);
					};
				}
			}
		}
		function initEvent(){
			//添加应用
			$("#add").click(function(){
				$('.right-app-list dl').html("");
				$.each($('.left-app-list dt'), function(index,item){
					if($("input",$(item)).attr("checked")) {
						var app_child = $(item).next().find('input[type="checkbox"]:checked');
						var app_array = [];
						for(var i = 0;i < app_child.length;i++) {
							app_array.push({appid:$(app_child[i]).attr("data-id"),value:$(app_child[i]).val()});
						}
						var data_name = $(item).find('.left_usergroup').data('name');
						var data_url = $(item).find('.left_usergroup').data('url');
						var data_profile = $(item).find('.left_namecheckbox').data('profile');
						var data_id = $(item).find('.left_namecheckbox').data('id');
						data_profile = JSON.stringify(data_profile);
						addApps(data_name,data_url,data_profile,data_id,app_array);
					}
				});
			});
			//删除应用		
			$("#del").click(function(){
				removeApps();
			});
			//保存
			$("#save").click(function(){
				commit();
			});
			//新建用户组
			$("#addGroup").click(function(){
				window.location = "group-add.html";
			});
		}
		
		function initTreeApp() {
			$('.left-app-list .list-group-item').remove();
			var apps = parent.$.aos.app.getAllApp();
		    for(var i=0;i<apps.length;i++) {
		        var data_id = apps[i].appid,
		            data_img = apps[i].image,
		            data_url = apps[i].installUrl,
		            data_name = apps[i].name;
		        var profile = apps[i].profile;
		        var profile_funcs = JSON.parse(profile).funcs;

		        var dt_list = '<dt><input name="namecheckbox" type="checkbox" class="left_namecheckbox" data-profile="profile" data-id="' + data_id + '" value="' + data_name + '"><span class="mm-icon"><img src="css/images/app-icon.png" width="16" height="16"></span><span class="left_usergroup" data-url="' + data_url + '"data-name="'+ data_name +'">' + data_name + '</span></dt>';
		        var dd_list = '<dd><ul class="list-group">';
		        for(var j=0;j<profile_funcs.length;j++) {
		        	if(profile_funcs[j].id == "1000") continue;
		            dd_list += '<li class="list-group-item"><input name="childcheckbox" type="checkbox" value="' +profile_funcs[j].name + '" data-id="' + profile_funcs[j].id + '">' + profile_funcs[j].name + '</li>';
		        	$('.left-app-list .list-group-item').find('input[type="checkbox"]').live('click',function() {
		        		// if ($(this).attr("checked")) {
		        		// 	console.log("false");
		        		// 	$(this).attr("checked",false);
		        		// }else{
		        		// 	console.log("true");
		        		// 	$(this).attr("checked",true);
		        		// }
		        		//alert($(this).val());
		        		//console.log($(this).next().attr("checked"));
		        		//alert($(this).next().attr("checked"));
		        		//.find('input[type="checkbox"]:checked')
		        		
		        		
		        		// console.log(child);
		        		// var flag = false;
		        		// for (var i = 0; i < child.length; i++) {
		        		// 	console.log($(child[i]));
		        		// 	//console.log();
		        		// 	console.log($(child[i]).next().attr("checked"));
		        		// 	if ($(child[i]).attr("checked")){
		        		// 		flag=true;
		        		// 	}
		        		// };
		        		var child = $(this).parent().parent().parent().find('input[type="checkbox"]:checked');
		        		//alert(child.length);
		        		if (child.length==0) {
		        			$(this).parent().parent().parent().prev().find('.left_namecheckbox').attr("checked",false);	
		        		}else{
		        			$(this).parent().parent().parent().prev().find('.left_namecheckbox').attr("checked",true);
		        		}
		        		
		        	});
		        }
		        dd_list += '</ul></dd>';
		        $('.left-app-list dl').append(dt_list);
		        $('.left-app-list dl').append(dd_list);
		        $($('.left_namecheckbox')[i]).attr("data-profile",profile);
		        $($('.left_namecheckbox')[i]).live('click',function() {
		        	if($(this).attr("checked") == "checked") {
	        			$(this).parent().next().find('input[type="checkbox"]').attr("checked",true);
	        		}
	        		else {
	        			$(this).parent().next().find('input[type="checkbox"]').attr("checked",false);
	        		}
		        });
		    }
		    $(".left-app-list dd").hide();
		}
		//左子树
		var app_left_title = $('.left-app-list dt span');
	    app_left_title.live('click',function() {
	        $(this).parent().next().toggle();
	        return false;
	    });
	    //右子树
		var app_right_title = $('.right-app-list dt span');
	    app_right_title.live('click',function() {
	        $(this).parent().next().toggle();
	        return false;
	    });

		function initTree(){
			var t = $.tree.create({
				editable : false,
				checkable : true,
				isUsingFs : true,
				div : $("#treeDemo"),
				path : APPPATH,
			});
		
		}
		
		//添加应用
		function addApps(name,path,appname,appid,app_array){
		 	var profile = appname;
	        var profile_funcs = JSON.parse(profile).funcs;
			var dt_list = '<dt><input name="namecheckbox" type="checkbox" class="right_namecheckbox" data-id="' + appid + '" data-profile=' + profile + ' value="' + name + '"><span class="mm-icon"><img src="css/images/app-icon.png" width="16" height="16"></span><span class="right_usergroup" data-url="' + path + '"data-name="'+ name +'">' + name + '</span></dt>';
	        var dd_list = '<dd><ul class="list-group">';
	        // for(var j=0;j<profile_funcs.length;j++) {
	        // 	if(profile_funcs[j].id == "1000") continue;
	        //     dd_list += '<li class="list-group-item"><input name="childcheckbox" type="checkbox" data-id="' + profile_funcs[j].id + '">' + profile_funcs[j].name + '</li>';
	        // }
	        for(var j=0;j<app_array.length;j++) {

	            // dd_list += '<li class="list-group-item"><input name="childcheckbox" type="checkbox" value="' + app_array[j].value + '" data-id="' + app_array[j].appid + '">' + app_array[j].value + '</li>';
	            dd_list += '<li class="list-group-item list-item-app" data-id="' + app_array[j].appid + '">' + app_array[j].value + '</li>';
	        }
	        dd_list += '</ul></dd>';
	        $('.right-app-list dl').append(dt_list);
	        $('.right-app-list dl').append(dd_list);
	        $(".right-app-list dd").hide();
	        $('.right_namecheckbox').live('click',function() {
	        	if($(this).attr("checked") == "checked") {
        			$(this).parent().next().find('input[type="checkbox"]').attr("checked",true);
        		}
        		else {
        			$(this).parent().next().find('input[type="checkbox"]').attr("checked",false);
        		}
	        });
		}
		//删除应用
		function removeApps(){
			var flag=false;
			// var checked_val = $('.right-app-list:checked');
			// else if(checked_val.length == 0) {
			// 	alert("请选择需要修改的用户!");
			// 	return;
			// }
			$.each($('.right-app-list dt'), function(index,item){
				if($("input",$(item)).attr("checked")) {
					$(item).next().remove();
					$(item).remove();
					flag=true;
				}
			});
			if(!flag){
				alert("请选择需要删除的权限!");
			}
		}
		//保存
		function commit(){
			var groupname = $(".mm-group").val();
			if (groupname == "admin") {
				alert("admin权限不能更改");
				return;
			}
			var flag = $.aos.users.um.deleteGroupAppMapByGroup(groupname);
			var apps = [];
			var groupapp = $.aos.app.getAppsByRole(groupname);

			$.each($('.right-app-list dt'), function(index,item){
				var data_id = $(item).find('.right_namecheckbox').data('id');
				var child_id = $(item).next().find('input[type="checkbox"]');
				var child_id = $(item).next().find('.list-item-app');
				var array_child = new Array();
				for(var i = 0;i < child_id.length;i++) {
					array_child.push({id:$(child_id[i]).data('id')+"",name:$(child_id[i]).text()}); 
				}
				$.aos.users.um.updateGroupPermission(groupname,data_id,JSON.stringify(array_child));
			});
			alert("已保存");
			window.location.reload(); 
		}
		
		
		
		
		
		
		
		
