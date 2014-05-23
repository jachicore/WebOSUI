/**
 * 
 */
		var DATABASE = "um_groups";
		var path = "/etc/groups/";
		function initDatabase(){
			if(!top.$.aos.sdb.existTable(DATABASE)){
				top.$.aos.sdb.createTable(DATABASE,"0","65535");  
			}
		};
		function db_findAllGroups(){
			return top.$.aos.sdb.find(DATABASE,{name:".*"});
		};
		function db_findGivenGroups(name){
			var group = top.$.aos.sdb.find(DATABASE,{name:name})[0];
			return group;
		};
		function db_saveGroup(group){
			top.$.aos.sdb.save(DATABASE,group);
			top.$.aos.fs.mkdir(path+group.name);
		};
		function db_updateGroup(groupName, contentObject){
			var group = db_findGivenGroups(groupName);
			group.contentObject = contentObject;
			var groupFile = top.$.aos.fs.lsFiles(path+groupName);
			
			top.$.aos.sdb.update(group);
		};
		function db_deleteGroup(name){
			top.$.aos.sdb.del(DATABASE,{name:name});
			top.$.aos.fs.rmdir(path+name);
		};
		function db_findAppsByGroups(groups){
			var apps = [];
			for ( var i = 0; i < groups.length; i++) {
				var _apps = db_findGivenGroups(groups[i]).contentObject.apps;
				for ( var j = 0; j < _apps.length; j++) {
					apps.push(_apps[j]);
				};
			};
			return apps;
		};
		
		function contrast(groupName,obj,obj1){
			for(var i in obj){
				var appname = obj[i].appname;
				for(var g in obj1){
					var name = obj1[g].name;
					if(appname != name){
						top.$.aos.fs.rm(path+groupName+appname);
					}
				}
			}
			
			for(var g in obj1){
				var name = obj1[g].name;
				for(var i in obj){
					var appname = obj[i].appname;
					if(appname != name){
						top.$.aos.fs.cp("/home/admin/1/"+name+"",path+groupName);
					}
				}
			}
		}
		
		
