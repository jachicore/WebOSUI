// JavaScript Document
// 树对象
$(function(){
		function Gntree(){
			this.zTreeObj;
			this.divObj;
			this.aos = typeof($.aos) == 'undefined' ? top.$.aos : $.aos;  
			this.ztree = typeof($.fn.zTree) == 'undefined' ? top.$.fn.zTree : $.fn.zTree;
			this.css;
			this.root;
			this.isRightClick = false;
			this.isUsingFs = false;
			this.rightMenu = [];
			this.dirOnly = false;
			this.icon_dir = "";
			this.icon_file = "";
			this.data;
			this.ztreeSetting = {
				check: {
					enable: true,
					//chkStyle: "radio"
					chkStyle: "checkbox",
					autoCheckTrigger: false,
					chkboxType: { "Y": "ps", "N": "ps" },
					nocheckInherit: true
				},
				edit: {
					enable: true,
					showRemoveBtn: false,
					showRenameBtn: false
				},	
				data : {
					keep : {
						parent : true
					},
					simpleData: {
						enable: false
					}
				}, 
				callback: {
					onCollapse: function(event, treeId, treeNode) {
						
					},
					onExpand: function(event, treeId, treeNode){
						
					},
					onClick: function(event, treeId, treeNode){
						
					},
					onRightClick: function(event, treeId, treeNode){
						
					},
					beforeDrop: function(treeNode,targetNode,moveType){
						
					},
					beforeDrag: function(treeId, treeNodes){
						
					}
				}
			};
			
			
		}
		
		//初始化
		Gntree.prototype.init = function(){
			
			var self = this;
			
			var ztreeSetting = {};
			
			ztreeSetting.data = this.ztreeSetting.data;
			ztreeSetting.edit = this.ztreeSetting.edit;
			ztreeSetting.check = this.ztreeSetting.check;
			
			//this.zTreeObj = $.fn.zTree.init(this.divObj, ztreeSetting, this.data);
			
			ztreeSetting.callback = {
					onCollapse: function(event, treeId, treeNode) {
						if(self.isUsingFs){
							self.zTreeObj.removeChildNodes(treeNode);
						}
						self.ztreeSetting.callback.onCollapse(event, treeId, treeNode);
						self.onCollapse();
					},
					onExpand: function(event, treeId, treeNode){
						
						if(self.isUsingFs){
							self.expandNodes(treeNode, self.transformTozTreeNodes(treeNode._path));
						}
						
						self.ztreeSetting.callback.onExpand(event, treeId, treeNode);
						self.onExpand();
					},
					onClick: function(event, treeId, treeNode){
						
						//var f = [{name:'t3',isParent: false}];
						//self.zTreeObj.addNodes(treeNode, f);
						
						self.ztreeSetting.callback.onClick(event, treeId, treeNode);
						self.onClick(event, treeId, treeNode);
					},
					onRightClick: function(event, treeId, treeNode){

						if(self.isRightClick){
							
							$("#rMenu").remove();
							var cont ="";
								cont += "<div id='rMenu' style=' position:absolute;  display:block; text-align: left;padding: 2px;'>";
								cont += "	<ul>";
								cont += "	</ul>";
								cont += "</div>";
							var $cont = $(cont);
							
							for(i in self.rightMenu){
									var ss = $("<li style='margin: 1px 0;float:left;clear:both;width:90px;font-size:12px;padding: 2px 5px;text-align:center;cursor: pointer;list-style: none;border:1px solid #DBE8EB;background:#F5FAFE;'>"+self.rightMenu[i].name+"</li>").click({
											e : event,
											id : treeId,
											node : treeNode,
											index : i
										},function(e){
											self.rightMenu[e.data.index].func(self, e.data.e,e.data.id,e.data.node);
											
									}).mouseover(function(){
										$(this).css("background","#666666");
									}).mouseout(function(){
										$(this).css("background","#F5FAFE");
									});
									$cont.css({"top":(event.clientY-10)+"px", "left":(event.clientX-20)+"px"});
									$cont.find('ul').append(ss);
							}
							
							$(document.body).append($cont);
							$(document).one('click', function(){
									$cont.remove();
							});
							
						}


						
						
						self.ztreeSetting.callback.onRightClick(event, treeId, treeNode);
						self.onRightClick();
					},
					beforeDrop: function(treeId,treeNode,targetNode,moveType){
						//首先判断目标节点是否存在，不存在返回false;存在进行下一步
						if(targetNode ==null){
							return false;	
						}else{
							if(self.isUsingFs){
								//当movetype为inner时，并且目标节点为文件夹，执行移动操作，否则返回false
								if(moveType =='inner' && self.aos.fs.mapWith(targetNode._path).type == 'dir'){
									
									self.aos.fs.mv(treeNode[0]._path, targetNode._path);
									
									if(self.aos.fs.mapWith(treeNode[0]._path).type == 'dir'){//如果移动的起始节点的类型为文件夹时，移动后节点的路径直接使其变为目标节点的路径
										
										treeNode[0]._path =targetNode._path;
										
									}else{//如果移动的起始节点的类型为txt文件时，移动后的节点路径为目标节点的路径加上其自身的txt文件名
										var frompath = treeNode[0]._path.split("/");
										console.log(frompath[frompath.length-1])
										treeNode[0]._path =	targetNode._path+"/"+frompath[frompath.length-1];
										
									}
								//当movetype为next时，执行以下操作
								}else if(moveType =='next' ){
									var p1 = treeNode[0]._path.split("/");
									p1.pop();
									var fromp = p1.join("/");//移动节点的上级目录
									var p2 = targetNode._path.split("/");
									var p3 = p2[p2.length-1];//移动节点的文件名
									p2.pop();
									var top = p2.join("/");//目标节点的上级目录
									if(fromp == top){//如果移动节点与目标节点的上级目录相同时，说明是在同级目录进行移动，返回false
										return false;	
									}else{
										var topath = targetNode._path.split("/");
										topath.pop();
										var topath1 = topath.join("/");
										targetNode._path = topath1;//使移动的目标定位在目录
										
										self.aos.fs.mv(treeNode[0]._path, targetNode._path);
										var frompath = treeNode[0]._path.split("/");
										treeNode[0]._path = topath1+"/"+frompath[frompath.length-1];//移动的节点的路径为目标节点的目录加上其自身的最后一个文件夹或文件
										targetNode._path = targetNode._path+"/"+p3;//由于改变了目标节点的路径，需恢复，所以加上目标节点的文件名或文件	
									}
									
								//与movetype=next相同，为了方便查看故分开写了	
								}else if(moveType =='prev'){
									
									
									var t1 = treeNode[0]._path.split("/");
									t1.pop();
									var fromp = t1.join("/");
									var t2 = targetNode._path.split("/");
									
									var p3 = t2[t2.length-1];
									t2.pop();
									var top = t2.join("/");
									if(fromp == top){
										return false;	
									}else{
										var topath = targetNode._path.split("/");
										topath.pop();
										var topath1 = topath.join("/");
										targetNode._path = topath1;
										
										self.aos.fs.mv(treeNode[0]._path, targetNode._path);
										var frompath = treeNode[0]._path.split("/");
										treeNode[0]._path = topath1+"/"+frompath[frompath.length-1];
										targetNode._path = targetNode._path+"/"+p3;
									
									}
										
								}else{
									alert('您要移动到父级目标不是一个目录');
									return false;
								}
							}
						}
						
						self.ztreeSetting.callback.beforeDrop(treeId,treeNode, targetNode, moveType);
						self.beforeDrop();
						
					},
					beforeDrag: function(treeId, treeNodes){
						
						for (var i=0,l=treeNodes.length; i<l; i++) {
							if (treeNodes[i].drag === false) {
								return false;
							}
						}
						return true;
						self.ztreeSetting.callback.beforeDrag(treeNodes);
						self.beforeDrag();
					}
			};
			
			
			
			this.zTreeObj = this.ztree.init(this.divObj, ztreeSetting, this.data);
			
		}
		
		
		//外部调用方法
		Gntree.prototype.onClick = function(event, treeId, treeNode){
					
		},
		Gntree.prototype.onCollapse = function(event, treeId, treeNode) {
						
		},
		Gntree.prototype.onExpand = function(event, treeId, treeNode){
						
		},
		Gntree.prototype.onRightClick = function(event, treeId, treeNode){
						
		},
		Gntree.prototype.beforeDrop = function(treeNode,targetNode,moveType){
						
		},
		Gntree.prototype.beforeDrag = function(treeId, treeNodes){
						
		}
		
		//添加文件
		Gntree.prototype.addFsFile = function(parentNode){
			
			var p1 = parentNode._path.indexOf(".");
			if(p1!=-1){
				alert("此文件不能当做目录")	
			}else{
				  var name=prompt("请输入名字","");
				  if (name!=null && name!=""){
					var path = parentNode._path+"/"+name+".txt";
					if(top.$.aos.fs.exists(path) == 'false'){
						this.aos.fs.create(path);
						this.zTreeObj.addNodes(parentNode, [{ "name": name+".txt", "isParent":false, "_path":path , "_name": name+".txt", "_type": "file"}], false);
					}else{
						alert("名字已存在，请重新命名！");
					}
				  }else{
					  alert("名字不能为空");   
				  }
				
			};
		}
		
		
		//删除节点
		Gntree.prototype.delFsFile = function(parentNode){
			if(confirm("是否删除节点")){
				this.aos.fs.rm(parentNode._path);
				this.zTreeObj.removeNode(parentNode);
			}else{
				
			}
		}
		
		//添加文件
		Gntree.prototype.addFsDir = function(parentNode){
			//1.  判断newNode是dir或file (newNode.type)
			
			var p1 = parentNode._path.indexOf(".");
			if(p1!=-1){
				alert("此文件不能当做目录")	
			}else{
				 var name=prompt("请输入名字","");
				  if (name!=null && name!=""){
					var path = parentNode._path+"/"+name;
					if(top.$.aos.fs.exists(path) == 'false'){
						this.aos.fs.mkdir(path);
						this.zTreeObj.addNodes(parentNode, [{ "name": name, "isParent":true, "_path":path , "_name": name, "_type": "dir"}]);
					}else{
						alert("名字已存在，请重新命名！");
					}
				  }else{
					  alert("名字不能为空");   
				  }	
			};
		}
		
		//添加节点
		Gntree.prototype.addNodes = function(parentNode, newNode){
			//1.  判断newNode是dir或file (newNode.type)
			
			console.log(newNode)
			for(var i=0; i<newNode.length; i++){
				if(newNode[i]._type=='dir'){
					this.aos.fs.mkdir(newNode[i]._path);
				}else if(newNode[i]._type=='file'){
					this.aos.fs.create(newNode[i]._path);
				}else{
					alert("错误")	
				}
			}
			
			
			//2.  在Filesystem 的 parentNode.path路径下生成文件/文件夹
			//3.  	文件建立成功,则在ztree上添加节点
			//3.1		调用ztree自身的addNode方法
			//4.    文件建立失败,返回错误信息
			
			//console.log(parentNode);
			//console.log(newNode);
			this.zTreeObj.addNodes(parentNode, newNode);
		}
		
		Gntree.prototype.expandNodes = function(parentNode, newNode){
			this.zTreeObj.addNodes(parentNode, newNode);
		}

                Gntree.prototype.expandNode = function(node, expandFlag, sonSign, focus, callbackFlag){
                        return this.zTreeObj.expandNode(node, expandFlag, sonSign, focus, callbackFlag);
                }

		Gntree.prototype.selectNode = function(node, addFlag){
                  this.zTreeObj.selectNode(node,addFlag);
		}

		//获取多选框中选中的节点
		Gntree.prototype.getCheckedNodes = function(flag){
			// flag = true/false
			 return this.zTreeObj.getCheckedNodes(flag);
		}
		
		//获取选择的节点
		Gntree.prototype.getSelectedNodes = function(){
			//console.log(this.zTreeObj);
			 return this.zTreeObj.getSelectedNodes();
		}
		

		
		//获取节点
		Gntree.prototype.getNodes = function(){
			 return this.zTreeObj.getNodes();
		}
		
		//根据路径获取节点
		Gntree.prototype.getNodeByPath = function(){
			
		}
		
		//根据获取节点路径
		Gntree.prototype.getNodePath = function(node){
			var patharr=[];
			loop(node);
			patharr.reverse();
			console.log(patharr)
			function loop(node){
				patharr.push(node);
				if(node.getParentNode()!=null){
				loop(node.getParentNode());
				}
			}
			return patharr;
		}

		//根据获取节点路径
		Gntree.prototype.getNodePathString = function(node,symbols,name){
			var patharr=[];
			var path="";
			loop(node);
			
			patharr.reverse();
			path = patharr.join(symbols)
			//console.log(symbols+path)
			function loop(node){
				
				patharr.push(node.name);
				if(node.getParentNode()!=null){
					loop(node.getParentNode());
				}
			}
			return path;
		}
		
		//移动节点
		Gntree.prototype.moveNode = function(fromNode, toNode){
			
		}
		
		//刷新整个树
		Gntree.prototype.refresh = function(){
			var self = this;
			self.zTreeObj.refresh();
		}
		
		//编辑节点
		Gntree.prototype.editNode = function(node){
			
		}
		
		//拷贝节点
		Gntree.prototype.copyNode = function(fromNode, toNode){
			
		}
		
		//展开所有节点
		//expandFlag = true 表示 展开 全部节点
		//expandFlag = false 表示 折叠 全部节点
		Gntree.prototype.expandAll = function(expandFlag){
			zTree.expandAll(true);
		}
		
		//通过filesystem生成Ztree的data  
		Gntree.prototype.transformTozTreeNodes = function(path){  
			var zNodes = [];
			var fileArray = [];
			if(this.dirOnly){
				fileArray = this.aos.fs.lsDirs(path);
			}else{
				fileArray = this.aos.fs.lsDirs(path);
				var lsedfiles = this.aos.fs.ls4realNameApp(path);
				for (var k = 0; k < lsedfiles.length; k++) {
					if(lsedfiles[k].type == 'file'){
						fileArray.push(lsedfiles[k]);
					}
				}
				//console.log(fileArray);
			}
			
			
			for(var i=0; i < fileArray.length;i++){  
				var fileRef = fileArray[i];
				var f={};
				if(fileRef.type =='dir'){
					f = {"name": fileRef.name, "isParent":true, icon:this.icon_dir, "_path": fileRef.path, "_name": fileRef.name, "_type": fileRef.type};	
				}else if(fileRef.type  == 'file'){
					var name = fileRef.name.lastIndexOf(".") == -1 ? fileRef.name: fileRef.name.substring(0,fileRef.name.lastIndexOf("."));
					f = {"name": name, "isParent":false, icon:this.icon_file,  "_path": fileRef.path, "_name": fileRef.name, "_type": fileRef.type};	
				}
				  
				zNodes.push(f);  
			}
			return zNodes;  
		} 
		
				//取消选择节点
		Gntree.prototype.cancelSelectedNode = function(node){
		    return this.zTreeObj.cancelSelectedNode(node);	
		}
		
		Gntree.prototype.create = function(options){
				//gntree.data = gntree.transformTozTreeNodes(options.path);
				var opt = $.extend(true,{
					editable : false,
					checkable : false,
					icon_dir : "",
					icon_file : "",
					chkStyle : "checkbox",
					data : [],
					path : '/',
					div : 'body',
					isRightClick : false,
					isUsingFs : false,
					isSimpleData : false,
					rightMenu : [],
					dirOnly : false,
				},options);
				
				this.rightMenu = opt.rightMenu;
				this.isUsingFs = opt.isUsingFs;
				this.root = opt.path;
				this.icon_dir = opt.icon_dir;
				this.icon_file = opt.icon_file;
				this.dirOnly = opt.dirOnly;
				this.isRightClick = opt.isRightClick;
				if(opt.data.length != 0){
					this.data = opt.data;
				}else{
					this.data = this.transformTozTreeNodes(opt.path);
				}
				this.divObj = opt.div;
				this.ztreeSetting.edit.enable = opt.editable;
				this.ztreeSetting.check.enable = opt.checkable;
				this.ztreeSetting.check.chkStyle = opt.chkStyle;
				this.ztreeSetting.data.simpleData.enable = opt.isSimpleData;
				
				this.init();
				return this
		}
		
		Gntree.prototype.reloadData = function(data){
				this.data = data;
				this.init();
		}
		
		Gntree.prototype.reloadDataByPath = function(path){
				this.data = this.transformTozTreeNodes(path);
				this.init();
		}
		
		
		$.tree = new Gntree();
	
	
	
	})

