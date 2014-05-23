/**
 *  文件: fileSystem.js
 *  描述：
 		Dependency : ajs/webOS/DMC.js
 */

(function($){
			var FileSystem = DMC.create("com.ambimmort.webos.dmcClient.filesystem.concrete.FileSystem");
			function FS(){
				this.FileSystem = FileSystem;
			}
			FS.prototype.sessiontest = function(){
				return FileSystem.sessiontest();
			};
			
			FS.prototype.mapWith = function(path){
				return JSON.parse(FileSystem.mapWith(path));
			};
			
			FS.prototype.read = function(file){
			    return FileSystem.read(file);
			    
			};
			
			FS.prototype.write = function(file,content){
			    FileSystem.write(file,content);
			};
			
			FS.prototype.ls = function(file){
			    return JSON.parse(FileSystem.ls(file));
			};
			
			FS.prototype.lsDirs = function(file){
			    return JSON.parse(FileSystem.lsDirs(file));
			};
			
			FS.prototype.lsFiles = function(file){
			    return JSON.parse(FileSystem.lsFiles(file));
			};

			FS.prototype.ls4realNameApp = function(file){
			    return JSON.parse(FileSystem.ls4realNameApp(file));
			};
			
			FS.prototype.exists = function(file){
			    return FileSystem.exists(file);
			};
			FS.prototype.existsByFatherAndName = function(fatherpath,srcpath){
			    return FileSystem.existsByFatherAndName(fatherpath,srcpath);
			};
			FS.prototype.createLink = function(toPath,name,srcPathLink){
			    return FileSystem.createLink(toPath,name,srcPathLink);
			};
			FS.prototype.delete = function(fromPath,srcPathLink){
			    return FileSystem.deleteByFahterAndName(fromPath,srcPathLink);
			};

			FS.prototype.createType = function(folder,name,path,profile,type){
			    return FileSystem.createType(folder,name,path,profile,type);
			};
			FS.prototype.create = function(file){
				
				return createLoop(this,file,0);
			    //FileSystem.create(file);
				
				function createLoop(obj,file,count){
					if(obj.exists(file) == "true"){
						var f = obj.mapWith(file);
						var name = f.name;
						var dot = name.lastIndexOf(".");
						var fileName = '';
						var suffix = f.suffix;
						
						if(dot!=0&&dot!=name.length-1&&dot!=-1){
							suffix = "."+suffix;
							filename = name.substring(0,dot);
						}else if(dot==-1){
							suffix = "";
							filename = name;
						}
						var path = file.substring(0, file.lastIndexOf("/"));
						var ff = path+"/"+filename+"("+count+")"+suffix;
						if(obj.exists(ff) == "true"){
							count++;
							return createLoop(obj,file,count)	
						}else{
							FileSystem.create(ff);
							return ff;
						}
					}else{
						FileSystem.create(file);
						return file;	
					}	
				}
				
			};
			
			FS.prototype.rm = function(file){
			    FileSystem.rm(file);
			};

			FS.prototype.deleteAllByUser = function(user){
				FileSystem.deleteAllByUser(user);
			};

			FS.prototype.mkdir4User = function(path,user){
				FileSystem.mkdir4User(path,user);
			};
			
			FS.prototype.mkdir = function(file){
				
				return mkdirLoop(this,file,0);
				
				function mkdirLoop(obj,file,count){
					if(obj.exists(file) == "true"){
						var f = obj.mapWith(file);
						var name = f.name;
						
						var path = file.substring(0, file.lastIndexOf("/"));
						var newDir = path+"/"+name+"("+count+")";
						if(obj.exists(newDir) == "true"){
							count++;
							return mkdirLoop(obj,file,count)	
						}else{
							FileSystem.mkdir(newDir);
							return newDir;
						}
					}else{
						FileSystem.mkdir(file);
						return file;	
					}
				}
				
			};
			
			FS.prototype.rn = function(from,to){
				FileSystem.rn(from,to);
			};
			
			FS.prototype.cp = function(from,to){
			 	FileSystem.cp(from,to);
			};
			
			FS.prototype.mv = function(from,to){
			 	FileSystem.mv(from,to);
			};

			$.aos.fs = new FS();
})(jQuery);



