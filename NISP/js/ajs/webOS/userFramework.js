/**
 *  �ļ�: fileSystem.js
 *  ������
 		Dependency : ajs/webOS/DMC.js
 */

(function($){
			var UM= DMC.create("com.ambimmort.webos.dmcClient.users.UserManager");
			function UserManager(){
				this.um = UM;
			}

			UserManager.prototype.deleteGroupAppMap = function(groupname,appid){
				return UM.deleteGroupAppMap(groupname,appid);
			};
			UserManager.prototype.deleteGroupAppMapByGroup = function(groupname){
				return UM.deleteGroupAppMapByGroup(groupname);
			};

			UserManager.prototype.addGroupPermission = function(groupname,appid,permissions){
				return UM.addGroupPermission(groupname,appid,permissions);
			};
			
			UserManager.prototype.updateGroupPermission = function(groupname,appid,permissions){
				return UM.updateGroupPermission(groupname,appid,permissions);
			};
			
			UserManager.prototype.addGroup = function(groupname){
				return UM.addGroup(groupname);
			};
			
			UserManager.prototype.existsGroup = function(groupname){
				return UM.existsGroup(groupname);
			};
			
			UserManager.prototype.existsUser = function(name){
				return UM.existsUser(name);
			};
			

			UserManager.prototype.deleteGroup = function(groupname){
				return UM.deleteGroup(groupname);
			};
			
			UserManager.prototype.getGroups = function(){
				return JSON.parse(UM.getGroups());
			};
			
			UserManager.prototype.alterUserGroup = function(username,groups){
				UM.alterUserGroup(username,groups);
			};

			UserManager.prototype.getUser = function(username){
				return JSON.parse(UM.getUser(username));
			};
			
			UserManager.prototype.login = function(username,password){
				return 	UM.login(username,password);
			};
			
			UserManager.prototype.getUserProfile = function(username){
				return 	JSON.parse(UM.getUserProfile(username));
			};
			
			UserManager.prototype.getUserRoles = function(username){
				return 	JSON.parse(UM.getUserRoles(username));
			};
			
			UserManager.prototype.saveUser = function(username,content,groups){
			    UM.saveUser(username,content,groups);
			};
			
			UserManager.prototype.getUserList = function(){
			    return JSON.parse(UM.getUserList());
			};
			
			UserManager.prototype.deleteUser = function(username){
			    UM.deleteUser(username);
			};

			$.aos.users.um = new UserManager();
})(jQuery);



