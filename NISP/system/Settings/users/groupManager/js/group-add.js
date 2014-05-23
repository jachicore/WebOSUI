/**
 *   添加用戶组應用
 */
		//  group-add 页面

		function ListGroups(){
			loadAuthorityManager();
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
				var user_checkbox = $('<input type="checkbox" class="addGroupCheckbox" name="addGroupCheckbox" value="'+groupNames[i]+'" />'+groupNames[i]+'</input>');
				$(".mm-left-tree").append(user_checkbox);
			}
		}
		function db_findGivenGroups(name){
			return $.aos.users.um.existsGroup(name)=="true";
		}
		function newGroup(){
			var reg = /^([a-zA-Z0-9]|[-_()]){0,9}$/;	
			var name = $.trim($("#_name").val());

			if((!reg.test(name))||name==""){
				alert("用户组名不合法");
				return; 
			}
			if(db_findGivenGroups(name)){
				alert("用户组名已存在,请重新输入");
				return; 
			}
			// if(name.length > 10) {
			// 	alert("用户组名太长，请重新输入");
			// 	return;
			// }
			/*var group = {
			  name:name,
			  apps:[],
			};*/
			
			// db_saveGroup(name);
			$.aos.users.um.addGroup(name);
			
			alert("添加成功!");
			
			window.location = "group-add.html";
		}
		
		function addGroupEvent(){
			//删除用户组
			$('#delete-user').click(function() {
				var checked_val = $('.addGroupCheckbox:checked');
				if (checked_val.length==0) {
					alert("请选择要删除的用户");
					return;
				}
				else{
					var c = confirm("确定要删除吗？");
					if(!c) return;
				}
				$.each($('.addGroupCheckbox'), function(index,item){
					if ($(item).attr("checked")) {
						
						$.aos.users.um.deleteGroup($(item).val());
						
					}
				});
				alert("删除成功!");
				// var checked_group = $('.addGroupCheckbox:checked');
				// var c = confirm("确定要删除该用户组吗？");
				// if(!c) return;
				// // checked_group.remove();
				// $.aos.users.um.deleteGroup(checked_group.val());
				// alert("删除成功!");
				window.location = "group-add.html";
			});
			//添加用户组
			$("#groupAdd").click(function(){
				newGroup();
			});
			//返回
			$("#back").click(function(){
				window.location = "group-app.html";
			});
		}
		
//	});
