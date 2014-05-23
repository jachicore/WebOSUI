/**
 *   添加用戶组應用
 */

//	$(function(){
//		var DATABASE = "liuyang";
//		
//		function initDatabase(){
//			if(!top.$.aos.sdb.existTable(DATABASE)){
//				top.$.aos.sdb.createTable(DATABASE,"0","65535");  
//			}
//		}
//		function db_findAllGroups(){
//			return top.$.aos.sdb.find(DATABASE,{name:".*"});
//		}
//		function db_findGivenGroups(name){
//			var group = top.$.aos.sdb.find(DATABASE,{name:name})[0];
//			return group;
//		}
//		function db_saveGroup(group){
//			top.$.aos.sdb.save(DATABASE,group);
//		}
//		function db_updateGroup(groupName, contentObject){
//			var group = db_findGivenGroups(groupName);
//			group.contentObject = contentObject;
//			top.$.aos.sdb.update(group);
//		}
//		function db_deleteGroup(name){
//			top.$.aos.sdb.delete(DATABASE,{name:name});
//		}
//		
//		
	//  group-app 页面
		
		function initGroups(){
			var groups = db_findAllGroups();
			//console.log(groups);
			for ( var i = 0; i < groups.length; i++) {
				var opt = $("<option value='"+groups[i].contentObject.name+"'>"+groups[i].contentObject.name+"</option>");
				/*opt.click(function(){
					$('.right-app-list').html('');
					var apps = db_findGivenGroups($(this).attr('value')).contentObject.apps;
					for ( var k = 0; k < apps.length; k++) {
						addApps(apps[k].name,apps[k].path,apps[k].appname);
					};
				});*/
				
				if(i==0){
					var firstGroup = groups[i].contentObject.apps;
					for ( var j = 0; j < firstGroup.length; j++) {
						addApps(firstGroup[j].name,firstGroup[j].path,firstGroup[j].appname);
					};
				}
				
				$(".mm-group").append(opt);
			};
			
			$(".mm-group").change(function(){
				$('.right-app-list').html('');
				var apps = db_findGivenGroups($(this).val()).contentObject.apps;
				for ( var k = 0; k < apps.length; k++) {
					addApps(apps[k].name,apps[k].path,apps[k].appname);
				};
			});
			
		}
		
		function initEvent(tree){
			$("#add").click(function(){
	 			var n = tree.getCheckedNodes();
	 			for(var i = 0;i<n.length;i++){
	 				if(n[i]._type!='dir')
	 					addApps(n[i].name,n[i]._path,n[i]._name);
				};
			});
			
			$("#del").click(function(){
				removeApps();
			});
			
			$("#save").click(function(){
				conmmit();
			});
			
			$("#addGroup").click(function(){
				window.location = "group-add.html";
			});
		}
		
		function initTree(path){
			var t = $.tree.create({
				editable : false,
				checkable : true,
				isUsingFs : true,
				div : $("#treeDemo"),
				path : path,
			});
			return t;
		}
		
		
		function addApps(name,path,appname){
			//判斷應用名是否已存在，如存在则返回
			var curr = $('.right-app-list li');
			var d= false;
			for(var i=0;i<curr.length;i++){
				if(appname == curr.eq(i).data("appname")) d=true;
			}
			if(d) return 
			
			// 添加應用
			var cont = "<li>";
				cont += "	<input type='checkbox' id='' name='' >";
				cont += "	<span class='mm-icon'><img src='css/images/app-icon.png' width='16' height='16' /></span>";
				cont += "	<label>"+name+"</label>";
				cont += "</li>";
			var cc = $(cont);
			cc.data({name:name,path:path,appname:appname,});
			$(".right-app-list").append(cc);
			return cc;
		}
		
		function removeApps(){
			$.each($('.right-app-list li'), function(index,item){
				if($("input",$(item)).attr("checked"))
					$(item).remove();
			});
		}
		
		function conmmit(){
			var groupname = $(".mm-group").val();
			var apps = [];
			
			$.each($(".right-app-list li"), function(index,item){
				apps.push({appname:$(item).data("appname"),name:$(item).data("name"),path:$(item).data("path")});
			});
			
			var group = {
				name: groupname,
				apps: apps,
			};
			
			console.log(group);
			db_updateGroup(groupname,group);
			alert("已保存");
		}
		
		
		//  group-add 页面
		
		// function ListGroups(){
		// 	var groups = db_findAllGroups();
		// 	for ( var i = 0; i < groups.length; i++) {
		// 		var label = $("<label style='display:inline-block; width:150px;'>"+groups[i].contentObject.name+"</label>");
		// 		var del = $("<a href='#'>删除</a>");
		// 		var p = $("<p style='margin:0px 0 0 20px'></p>");
		// 		del.click({p:p,name:groups[i].contentObject.name,},function(e){
		// 			var c = confirm("确定要删除该用户组吗？");
		// 			if(!c) return
		// 			e.data.p.remove();
		// 			db_deleteGroup(e.data.name);
		// 			alert("删除成功!");
		// 		});
		// 		p.append(label).append(del);
		// 		$(".mm-left-tree").append(p);
		// 	};
		// }
		function ListGroups() {
			var user_group = $.aos.users.um.getGroups();
        	console.log(user_group);
        	for(var i = 0;i < user_group.length;i++) {
        		var user_checkbox = $('<input type="checkbox" value="'+groups[i].contentObject.name+'" />'+groups[i].contentObject.name);
        	}
        	console.log(user_checkbox);
		}

		function newGroup(){
			var name = $("#_name").val();
			if(name == ''){
				alert("用户组名不能为空");
				return 
			}
			if(typeof(db_findGivenGroups(name))!='undefined'){
				alert("用户名已存在,请重新输入");
				return 
			}
			var group = {
			  name:name,
			  apps:[],
			};
			
			db_saveGroup(group);
			
			alert("保存成功!");
			
			window.location = "group-add.html";
		};
		
		function addGroupEvent(){
			$("#groupAdd").click(function(){
				newGroup();
			});
			
			$("#back").click(function(){
				window.location = "group-app.html";
			});
		};
		
//	});
