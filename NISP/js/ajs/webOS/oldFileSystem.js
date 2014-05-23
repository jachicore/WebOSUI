/**
 *  文件: oldOldFileSystem.js
 *  描述：
 		Dependency : ajs/webOS/DMC.js
 */

(function($){
			var OldFileSystem = DMC.create("com.ambimmort.webos.old.plugins.filesystem.impl.OldFileSystem");
			function OldFS(){
				this.OldFileSystem = OldFileSystem;
			}
			
			OldFS.prototype.mapWith = function(file){
				return JSON.parse(OldFileSystem.mapWith(file));
			};
			
			OldFS.prototype.read = function(file){
			    return OldFileSystem.read(file);
			};
			
			OldFS.prototype.write = function(file,content){
			    OldFileSystem.write(file,content);
			};
			
			OldFS.prototype.ls = function(file){
			    return JSON.parse(OldFileSystem.ls(file));
			};
			
			OldFS.prototype.lsDirs = function(file){
			    return JSON.parse(OldFileSystem.lsDirs(file));
			};
			
			OldFS.prototype.lsFiles = function(file){
			    return JSON.parse(OldFileSystem.lsFiles(file));
			};
			
			OldFS.prototype.exists = function(file){
			    return OldFileSystem.exists(file);
			};
			
			OldFS.prototype.create = function(file){
				
				return createLoop(this,file,0);
			    //OldFileSystem.create(file);
				
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
							OldFileSystem.create(ff);
							return ff;
						}
					}else{
						OldFileSystem.create(file);
						return file;	
					}	
				}
				
			};
			
			OldFS.prototype.rm = function(file){
			    OldFileSystem.rm(file);
			};
			
			OldFS.prototype.mkdir = function(file){
				
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
							OldFileSystem.mkdir(newDir);
							return newDir;
						}
					}else{
						OldFileSystem.mkdir(file);
						return file;	
					}
				}
				
			};
			
			OldFS.prototype.rn = function(from,to){
				OldFileSystem.rn(from,to);
			};
			
			OldFS.prototype.cp = function(from,to){
			 	OldFileSystem.cp(from,to);
			};
			
			OldFS.prototype.mv = function(from,to){
			 	OldFileSystem.mv(from,to);
			};

			$.aos.oldfs = new OldFS();
})(jQuery);



