
		var GROUPPATH = "/etc/groups";
		
		var APPPATH = "/app/core";
		
		$.aos = top.$.aos ? top.$.aos : {};
		
		function db_findAllGroups(){
			return $.aos.fs.lsDirs(GROUPPATH);
		}
		
		function db_findAllGroupApp(name){
			return $.aos.fs.lsFiles(GROUPPATH+"/"+name);
		}
		
		function db_deleteGroup(name){
			return $.aos.fs.rm(GROUPPATH+"/"+name);
		}
		
		function db_findGivenGroups(name){
			return 	$.aos.fs.exists(GROUPPATH+"/"+name)=='true'?true:false;
		}
		
		function db_saveGroup(name){
			return $.aos.fs.mkdir(GROUPPATH+"/"+name);
		}
		
