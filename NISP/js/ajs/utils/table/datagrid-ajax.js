(function($){
	/////////////////////////////////////////////////////////////////////////	
	//Object() 创建对象
	/////////////////////////////////////////////////////////////////////////	
	function DataGrid(options){
	var defaults={
		container:"",
		caption:"DataGrid 表格插件",//表格的标题
		isCaption:true,//是否显示标题
		width:600,//表格的宽度
		height:800,//表格的高度
		colTitle:[		
//			{title:'ID',sortable:true,editable:false,isHide:false, width:40, sortFunction: parseInt},
//
//			{title:'用户名',sortable:true,width:80,isHide:true, searchType:"text", editable:true},
//			{title:'用户类型',sortable:true,width:80,isHide:false, editable:true, searchType:"select",searchArgument:['普通用户','白名单用户','黑名单用户','预打击用户','打击用户']},
//			{title:'控制类型',sortable:true,width:80,isHide:false, editable:true, searchType:"select",searchArgument:['条件警告','无条件警告','条件阻挡','无条件阻挡','条件阻断','无条件阻断','干扰类型','不处理']},
//			{title:'阀值',sortable:true,width:60,isHide:false, searchType:"select text", searchArgument:["=","<",">"], editable:true},
//			{title:'设备数',sortable:true,width:60,isHide:false, searchType:"select text", searchArgument:["=","<",">"],  editable:true},
			//{title:'共享台',sortable:true,width:60,isHide:false, searchType:"select text", searchArgument:["=","<",">"],  editable:true},
			//{title:'MAC',sortable:true,width:120,isHide:false, searchType:"text", editable:true},
			//{title:'IP',sortable:true,width:100,isHide:false, searchType:"text", editable:true},
			//{title:'历史图表',sortable:true,width:80,isHide:false,  editable:false},
			//{title:'详细信息',sortable:false,width:80,isDetail:false, isHide:false, editable:false,onclick:function(){
				//获取数据 实例 d.data.data;
				//获取当前记录ID d.data.id;

				//}},
			//{title:'用户状态',width:80,sortable:true,editable:false},
			
		],
		//data:[],//表格的数据. 比如有一个用户信息的表格，那么表格数据可能是：[{"张三","20","男","18623829482"},{"李四","32","男","18623845682"}] 'Time', 'Name', 'Note','Num','Price','Other'
		ajaxURL:"",
		isClickForDetail:false,//设置点击行, 是否显示该行详细信息
		clickForDetailFunction:function(id,obj){

					var data = obj.options.data;

					var detailList= $("<div class='data_list'></div>");
					var title  = $("<div class='title'><a class='close_icon'></a></div>");
					var detailTable = $("<table cellpadding='0' cellspacing='0'></table>");
					var titleTxt='';
					for(var j=0;j<data[id].length-2;j++){
						  var tr = '<tr>';
							  tr += "      <th>"+obj.options.colTitle[j].title+"</th>";
							  tr += "      <td>"+data[id][j]+"</td>";
							  tr += "</tr>";
							  titleTxt = data[id][1]
							  detailTable.append(tr);
						
						}
	
					 title.prepend(titleTxt);
					 detailList.append(title);
					 detailList.append(detailTable);
					 detailList.draggable({handle:title});
					 detailList.width(obj.options.width*0.6);
					 $("body").prepend(detailList);
					 
					 //关闭
					 detailList.find(".title .close_icon").click(function(){
						 detailList.remove();
					
	
				});
			
			},
		isMultiSelect:false,//是否支持选择多行
		sortable:true,//是否支持排序
		sortorder:"desc",//设置排序顺序, 两种:'desc'/'asc'
		totalRows:"10",//总记录条数
		rowNum:10,//设置一页显示的记录条数，初始化是10条
		rowList: [10,20,30],//设置选择每页显示的条数
		isColumnSearch:true,//是否支持列搜索
		isMenuBar:false,//设置需要菜单栏
		menuBarPara:[
			$("<input style='float:left', class='searchAll' type='text' />"),
			$("<button style = 'float:left'>ok</button>").click({k:this},function(e){
				console.log($(this).siblings(".searchAll").val());
				//console.log(e.data.k);	
			}),
		
		],
		isToolBar:false,//是否显示底部操作栏
		toolBar:[
/*			{name:'当前页面用户',onClick:function(){}},
			{name:'所有用户',onClick:function(){}},
			{name:'删除',onClick:function(){}},
			{name:'添加新用户',onClick:function(){}}
		
*/		],//设置是否工具栏	
		isContextMenu:false,	//是否设置右键菜单	
		contextMenu:[
			{title:"添加",events:"click",fun:function(e){
						var obj = e.data.obj;
						var thisObj = e.data.thisObj;
						var id =thisObj.data().id; //获取ID
						
						e.data.contextMenuObj.remove()//关闭菜单
						
						var data = obj.data;
						var tr=$("<ul class='tr'></ul>");
						for(var i=0;i<data.length;i++){
								//找到id所在记录
								if(id==data[i][0]){
										
										for(var j=0;j<obj.options.colTitle.length;j++){
											var td="";
											if(obj.options.colTitle[j].editable){
												
													if(obj.options.colTitle[j].isClass){
										
														td = " <li><select class='list'>";
														
														for(var d=0;d<obj.options.colTitle[j].class.length;d++){
															if(obj.options.colTitle[j].class[d]==data[i][j]){
				
																td += " <option value='"+obj.options.colTitle[j].class[d]+"' selected >"+obj.options.colTitle[j].class[d]+"</option>";
															}else{
																td += " <option value='"+obj.options.colTitle[j].class[d]+"'>"+obj.options.colTitle[j].class[d]+"</option>";
															}
														}//for
														td += " </select></li>";
														td =$(td);
										
													}else{
														
													  td = $("<li ><input type='text' value='' style='width:"+obj.options.colTitle[j].width+"px' /></li>");
													}
											}else{
												td = $("<li ></li>");
											}
											//console.log(obj)
											obj.autoWidth(j,obj.options.colTitle.length-1,td);
											if($.checkId[j]!='')td.hide();//自动隐藏
				
										tr.append(td);
										}//for
									
									}
							
							}
						//obj.addCheckbox(tr);
						thisObj.after(tr);
						tr.css("background","#ecff7f");	
						
						
					}
				},
			{title:"修改",events:"click",fun:function(e){
						var obj = e.data.obj;
						var thisObj = e.data.thisObj;
						var id =thisObj.data().id; //获取ID
						
						e.data.contextMenuObj.remove()//关闭菜单
				
						var data = obj.data;
						var tr=$("<ul class='tr'></ul>");
						for(var i=0;i<data.length;i++){
								//找到id所在记录
								if(id==data[i][0]){
										
										for(var j=0;j<obj.options.colTitle.length;j++){
											var td="";
											if(obj.options.colTitle[j].editable){
												
													if(obj.options.colTitle[j].isClass){
										
														td = " <li><select class='list'>";
														
														for(var d=0;d<obj.options.colTitle[j].class.length;d++){
															if(obj.options.colTitle[j].class[d]==data[i][j]){
				
																td += " <option value='"+obj.options.colTitle[j].class[d]+"' selected >"+obj.options.colTitle[j].class[d]+"</option>";
															}else{
																td += " <option value='"+obj.options.colTitle[j].class[d]+"'>"+obj.options.colTitle[j].class[d]+"</option>";
															}
														}//for
														td += " </select></li>";
														td =$(td);
										
													}else{
														
													  td = $("<li ><input type='text' value="+data[i][j]+" style='width:"+obj.options.colTitle[j].width+"px' /></li>");
													}
											}else{
												td = $("<li >"+data[i][j]+"</li>");
											}
										if($.checkId[j]!='')td.hide();//自动隐藏
										obj.autoWidth(j,obj.options.colTitle.length-1,td);
										tr.append(td);
										}//for
									
									}
							
							}
						//obj.addCheckbox(tr);
						thisObj.replaceWith(tr);
						tr.find("li").css("background","#e1effb");	
				
				
				
				}},
			{title:"删除",events:"click",fun:function(e){
						var obj = e.data.obj;
						var thisObj = e.data.thisObj;
						var id =thisObj.data().id; //获取ID
						
						e.data.contextMenuObj.remove()//关闭菜单
				
						thisObj.remove();
				
				
				
				}}

		],		
		
		};
		this.options=$.extend(true,defaults,options);	
		
	//识别Class Or Id Or DOM
	this.obj;//Dom对象
	if($("#"+this.options.container+"").length!=0){
		
			this.obj=$("#"+this.options.container+"");
		
		}else if($("."+this.options.container+"").length!=0){
			
			this.obj=$("."+this.options.container+"");
		}else if($(this.options.container+"").length!=0){
				
			this.obj=$(this.options.container+"");
		}
	
	this.init();//初始化引用
	}
	
	
	/////////////////////////////////////////////////////////////////////////	
	//initialization() 对象初始化
	/////////////////////////////////////////////////////////////////////////	

	DataGrid.prototype.init=function(){
		var oo = this;
		this.obj.css({width:this.options.width,height:this.options.height,border:"1px solid #999"})
		this.obj.addClass("datagrid_panel");
		this.obj.css({position:"relative"});
	
		this.pageSize =this.options.rowNum;
		this.currentPage = 1;
		$.checkId=[];//全局变量 hideCol id
		
		//是否设置标题栏
		if(this.options.isCaption)this.obj.prepend("<div class='g_title'>"+this.options.caption+"</div>");
		
		//是否设置菜单栏
		if(this.options.isMenuBar)this.obj.append(this.createMenu());
		
		this.obj.append(this.createTable());
		//是否设置工具栏
		if(this.options.isToolBar)this.obj.append(this.createToolBar());
		
		parent.$.util.get(this.options.ajaxURL+"&start=0&rows="+this.pageSize,function(msg){
			
				
				var mydata = msg.response.docs;
				oo.totalRows = msg.response.numFound;
				oo.totalPage = Math.ceil(oo.totalRows/oo.pageSize);
				oo.createDataList(oo.options.colTitle.length,mydata);
				oo.obj.append(oo.createPager(oo.data));
				$(".totalpagetxt",oo.obj).html(oo.totalPage);
				$(".count",oo.obj).html("View "+oo.currentPage*oo.pageSize+"-"+(oo.currentPage*oo.pageSize+oo.pageSize)+" of "+oo.totalPage*oo.pageSize+"");
				$(".txt_page").val(1);
				//console.log(oo.totalPage);
				
				oo.toTopPage();	
				oo.toLastPage();
				oo.toNextPage();
				oo.toPrePage();
				oo.toPage();
				oo.changeRowNum();
				
		});
				
		
		//是否设置右键菜单
		if(this.options.isContextMenu)this.contextMenu(this.obj.find(".tr:gt(1)"));//右键菜单

		//高度自适应
		this.autoWH(this.trHeight*this.pageSize);
		this.defaultHideCol();//默认隐藏列
		
		}	
		
	/////////////////////////////////////////////////////////////////////////	
	//Structure() 对象结构
	/////////////////////////////////////////////////////////////////////////	
		
	//创建菜单=================================================
	DataGrid.prototype.createMenu=function(){
		var subObj = $("<div class='menu g_menu'></div>")
		var option= $("<div class='options'></div>");
		var obj = this.obj;
		if(this.options.isMenuBar){
			
			for(var i=0;i<this.options.menuBarPara.length;i++){
					option.append(this.options.menuBarPara[i]);
				}
		}
		subObj.append(option);	
		this.hideColMenu(subObj);	
		
		return subObj
		}	
		
		
		
	//创建表结构=================================================
	DataGrid.prototype.createTable=function(){
		var subObj = $("<div class='table'></div>")
			
		//thead
		var tr = $("<ul class='head tr'></ul>");
		for(var i=0;i<this.options.colTitle.length;i++) {

			  var td = $("<li>"+this.options.colTitle[i].title+"</li>");
				
			  if(this.options.sortable && this.options.colTitle[i].sortable){
				  var dd=2,sortTxt="&";
				  td.append("<span class='sort'></span>")
				  td.click({obj:this},function(e){
					  var obj = e.data.obj;
					  var index = $(this).index();
					  dd++;
					  if(dd%2==0){
						  sortTxt=desc;
						  }else{
							  
							  sortTxt=asc;
							  }					  
					  
						var obj=e.data.obj;
						var path = obj.options.ajaxURL;
						var startNum = obj.currentPage*obj.pageSize;
						path += "&start="+startNum+"&rows="+obj.pageSize;
						path += obj.options.colTitle[index].name+"+"+sortTxt;
						//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
						parent.$.util.get(path,function(msg){
													 
							var newdata = msg.response.docs;
							obj.createDataList(column,newdata);
								 
						});
					  					  
				  });	

			  }
			  this.autoWidth(i,this.options.colTitle.length-1,td)
			  tr.append(td);
		}
		//是否添加多选
		//this.addCheckbox(tr);
		subObj.append(tr);
				
		return subObj;
		}	
		
		
	//创建数据列表=================================================
	DataGrid.prototype.createDataList=function(column,data){
			this.obj.find(".table .tr:gt(1)",this.obj).remove();
			var loading = $("<div class='loading'></div>");
			this.obj.prepend(loading);
	
			//tbody
			for(var i=0;i<data.length;i++) {
				var tr = $("<ul class='tr'></ul>").data({id:i});
				  for(var j=0;j<column;j++){
					  if(typeof(data[i][this.options.colTitle[j].name])!='undefined'){
						 var td = $("<li></li>");
						  td.append(data[i][this.options.colTitle[j].name]);
						   this.autoWidth(j,this.options.colTitle.length-1,td)
						  tr.append(td);
					  }
				  }
					
				//行点击详细
				if(this.options.isClickForDetail){
					var o = this;
					//console.log(o.options.data);
						tr.dblclick({id:data[i][0],o:this},function(e){
								o.options.clickForDetailFunction(e.data.id,e.data.o);							
							})
					}
				
				//右键菜单 添加 编辑 修改		
				if(this.options.isContextMenu)this.contextMenu(tr);//右键菜单
				
				this.obj.find(".table").append(tr);
			}	
			this.hideCol($.checkId,this);//隐藏列
			this.obj.find(".loading").remove();
			//列搜索
			if(this.options.isColumnSearch)this.columnSearch();
			//是否多选
			if(this.options.isMultiSelect)this.multiSelect();
			
		}
		
		
	//创建表底部工具栏=================================================
	DataGrid.prototype.createToolBar=function(){
		var subObj = $("<div class='toolbar bottomOparete'></div>")
		var cont = '';

			cont += "					<ul style='float:left;'><li><input type='checkbox'/></li>";
			cont += "					<li>将勾选用户设为</li>";
			cont += "					<li><select><option>黑名单用户</option></select></li> ";
			cont += "					<li>进行为</li>";
			cont += "					<li><select><option>无条件打击</option></select></li>";
			cont += "					<li>阀值<input type='text'/></li>";
			cont += "					<li><input type='button' value='确定' /></li></ul>";
			cont += "					<span style='float:right;line-hieght:30px;line-height:30px;margin-right:20px;'><a>批量导入</a> <a>批量导出</a></span>";
			cont += "";
			
		subObj.append(cont);
		return subObj
		}	
		
		
		
	//创建表底部分页=================================================
	DataGrid.prototype.createPager=function(newdata){
		var subObj = $("<div class='pager g_toolbar'></div>")
		
		//var totalRows = newdata.length;
		var totalRows = this.options.totalRows;
		var totalPage = Math.ceil(totalRows/this.pageSize);		

	$(".g_toolbar").remove();
	var cont = '';
		cont += "            <div class='page'>";
		cont += "                <a href='#' class='page_a_btn'><span class='pre_icon'></span></a>";
		cont += "                <a href='#' class='page_a_btn'><span class='up_icon'></span></a>";
		cont += "                <div class='line'></div>";
		cont += "           		<div><span>page </span><input name='' type='text'  value='1' class='txt_page'/><span>of</span>";
		cont += "           		<span class='totalpagetxt'>"+totalPage+"</span></div>";
		cont += "                <div class='line'></div>";
		cont += "                <a href='#' class='page_a_btn'><span class='down_icon'></span></a>";
		cont += "                <a href='#' class='page_a_btn'><span class='last_icon'></span></a>";
		cont += "				<div class='line'></div>";
		cont += "                <div>";
		cont += "                <select name='' class='slct_page'>";
								for(var i=0;i<this.options.rowList.length;i++){
		cont += "                <option value="+this.options.rowList[i]+">"+this.options.rowList[i]+"</option>";
									
									}
		cont += "                </select>";
		cont += "                </div>";
		cont += "            </div>";
		cont += "            <div class='count'>View 1-"+this.pageSize+" of "+totalRows+" </div>";
		
		var c = $(cont);
		subObj.append(c);	
		
		return subObj
		}
		
	//创建隐藏列下拉菜单
	DataGrid.prototype.hideColMenu = function(ParentObj){
			var showhidecolumn = $("<div class='showhidecolumn' style='float:right;margin:5px;'>点击显示列表</div>");
			var drop_menu=$("<div class='drop_menu' style='postion:absolute; display:none'></div>");
			
			var option1 = '';
			for(var i=0; i<this.options.colTitle.length; i++){
				if(this.options.colTitle[i].isHide){
				option1 += "<a href='#'><input type='checkbox' value='"+i+"' /><div class='line'></div>"+this.options.colTitle[i].title+"</a>";
					}else{
				option1 += "<a href='#'><input type='checkbox' value='"+i+"' checked='checked' /><div class='line'></div>"+this.options.colTitle[i].title+"</a>";
						}
			}
			submitis= $("<a href='#'>提交</a>");
			
			ParentObj.append(showhidecolumn);
			drop_menu.append(option1).append(submitis);
			showhidecolumn.after(drop_menu);
					
					
			//隐藏列下拉菜单选择	
			showhidecolumn.click(function(){
					$(".drop_menu",this.obj).show();
						
				});
			submitis.data({obj:this}).click(function(){
				var obj = $(this).data().obj;
				$(".drop_menu",this.obj).hide();
					var checkboxmenu = $("input[type='checkbox']",'.drop_menu');
					var ii=0;
					
					checkboxmenu.each(function(ii){
							if($(this).attr('checked')){
									$.checkId[ii]="";
							}else{
									$.checkId[ii]=$(this).attr('value');
								}
							
					});
					
					return obj.hideCol($.checkId,obj);
				});
				
		}
	//默认隐藏列
	DataGrid.prototype.defaultHideCol=function(){
		var id =new Array;
		for(var i=0;i<this.options.colTitle.length;i++){
			this.options.colTitle[i].isHide?id.push(""+i+""):id.push("");
			
			}
			
		this.hideCol(id,this);
		}
		
	/////////////////////////////////////////////////////////////////////////	
	//Methods()	对象方法
	/////////////////////////////////////////////////////////////////////////	
				
		
	//指定跳转页
	DataGrid.prototype.toPage=function(){
		$(".txt_page").keyup({obj:this},function(e){
			if(e.keyCode == 13){
				
				var obj=e.data.obj;
				var path = obj.options.ajaxURL;
				obj.totalPage = Math.ceil(obj.totalRows/obj.pageSize);
				var startNum = $(this).val()*1*obj.pageSize;
				path += "&start="+startNum+"&rows="+obj.pageSize;
				//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
				if($(this).val()>=1&&$(this).val()*1<=obj.totalPage){
						
						parent.$.util.get(path,function(msg){
													 
							var newdata = msg.response.docs;
							obj.createDataList(column,newdata);
								 
						});
						
					}else{
						alert("无效页数！")
						
						};

				}
			
			})
		}	
	//首页
	DataGrid.prototype.toTopPage=function(){
		var column =this.options.colTitle.length;
		
		$(".pre_icon",this.obj).click({obj:this},function(e){
				var obj=e.data.obj;
				var path = obj.options.ajaxURL;
				obj.totalPage = Math.ceil(obj.totalRows/obj.pageSize);
				path += "&start=0&rows="+obj.pageSize;
				//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
				parent.$.util.get(path,function(msg){
											 
					var newdata = msg.response.docs;
					obj.createDataList(column,newdata);
					$(".totalpagetxt",obj.obj).html(obj.totalPage);
					$(".count",obj.obj).html("View 1-"+obj.pageSize+" of "+obj.totalPage*obj.pageSize+"");
					$(".txt_page").val(1);
						 
				});
			
			
			});	
		}	
	//末页
	DataGrid.prototype.toLastPage=function(){	
		var column =this.options.colTitle.length;

		$(".last_icon",this.obj).click({obj:this},function(e){
			
				var obj=e.data.obj;
				var path = obj.options.ajaxURL;
				obj.totalPage = Math.ceil(obj.totalRows/obj.pageSize);
				var startNum = obj.totalPage*obj.pageSize;
				path += "&start="+startNum+"&rows="+obj.pageSize;
				//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
				parent.$.util.get(path,function(msg){
											 
					var newdata = msg.response.docs;
					obj.createDataList(column,newdata);
					$(".totalpagetxt",obj.obj).html(obj.totalPage);
					$(".count",obj.obj).html("View "+(obj.totalPage*obj.pageSize-obj.pageSize)+"-"+obj.totalPage*obj.pageSize+" of "+obj.totalPage*obj.pageSize+"");
					$(".txt_page").val(obj.totalPage);
				});

			});	
		}	
	//下一页
	DataGrid.prototype.toNextPage=function(){
		var column =this.options.colTitle.length;
		$(".down_icon",this.obj).click({obj:this},function(e){
				var obj=e.data.obj;
				console.log(obj.currentPage);
				var path = obj.options.ajaxURL;
				if(obj.currentPage!=obj.totalPage)obj.currentPage++;
				
				var startNum = obj.currentPage*obj.pageSize;
				path += "&start="+startNum+"&rows="+obj.pageSize;
				//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
				console.log(path);
				parent.$.util.get(path,function(msg){
											 
					var newdata = msg.response.docs;
					obj.createDataList(column,newdata);
					$(".totalpagetxt",obj.obj).html(obj.totalPage);
					$(".count",obj.obj).html("View "+obj.currentPage*obj.pageSize+"-"+(obj.currentPage*obj.pageSize+obj.pageSize)+" of "+obj.totalPage*obj.pageSize+"");
					$(".txt_page").val(obj.currentPage);
				});
			
			});	
		}	
	//上一页
	DataGrid.prototype.toPrePage=function(){
		var column =this.options.colTitle.length;

		$(".up_icon",this.obj).click({obj:this},function(e){
			
			
				var obj=e.data.obj;
				var path = obj.options.ajaxURL;
				obj.totalPage = Math.ceil(obj.totalRows/obj.pageSize);
				if(obj.currentPage!=1)obj.currentPage--;
				var startNum = obj.currentPage*obj.pageSize;
				path += "&start="+startNum+"&rows="+obj.pageSize;
				//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
				parent.$.util.get(path,function(msg){
											 
					var newdata = msg.response.docs;
					obj.createDataList(column,newdata);
					$(".count",obj.obj).html("View "+obj.currentPage*obj.pageSize+"-"+(obj.currentPage*obj.pageSize+obj.pageSize)+" of "+obj.totalPage*obj.pageSize+"");
					$(".txt_page").val(obj.currentPage);
						 
				});
			
				 
			});	
		}	
	//设置一页显示的记录条数
	DataGrid.prototype.changeRowNum=function(){
		var column =this.options.colTitle.length;
		
		$(".slct_page").change({obj:this},function(e){
			var obj=e.data.obj;
			obj.pageSize=$(".slct_page",obj.obj).find("option:selected").text();
			
			
				var obj=e.data.obj;
				var path = obj.options.ajaxURL;
				obj.totalPage = Math.ceil(obj.totalRows/obj.pageSize);
				var startNum = obj.currentPage*obj.pageSize;
				path += "&start="+startNum+"&rows="+obj.pageSize;
				//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
				parent.$.util.get(path,function(msg){
											 
					var newdata = msg.response.docs;
					obj.createDataList(column,newdata);
					var totalRows = obj.totalRows;
					var totalPage = Math.ceil(totalRows/obj.pageSize);	
					
					$(".totalpagetxt",obj.obj).html(totalPage);
					$(".count",obj.obj).html("View 1-"+obj.pageSize+" of "+totalRows+"");
					
					//自适应高度
					obj.autoWH(obj.trHeight*obj.pageSize);
					
					
						 
				});

			});
		
		
		}	
		
		
	//自适应高度宽度=================================================
	DataGrid.prototype.autoWH=function(height){
			var obj = this;
			this.obj.find("tr").height(24);//行高
			this.trHeight=24;//行高
			//高度自适应
			var height=0;
			height += obj.trHeight*(obj.pageSize*1+2)+(obj.pageSize*1+2);
			height += obj.obj.find(".g_menu").height()*1;
			height += obj.obj.find(".pager").height()*1+1;
			
			if(obj.options.isCaption)height += obj.obj.find(".g_title").height()*1;
			if(obj.options.isToolBar)height += obj.obj.find(".toolbar").height()*1;
			
			obj.obj.css("height","auto");
			obj.obj.find(".tableContainer").css("height",""+height+"px");
			obj.obj.find(".tableContainer").css("overflow","scroll");
			obj.obj.find(".tableContainer").css("border","1px solid red");
			//console.log(height)
			//console.log(obj.obj.find(".tableContainer").height())
			
			//总宽度
			var width = 0;
			for(var i=0;i<obj.options.colTitle.length;i++){
				width += obj.options.colTitle[i].width;
				
				}
				
			width += obj.options.colTitle.length +7*obj.options.colTitle.length+1;
			//obj.obj.css({width:width});
			obj.obj.css({width:this.options.width,margin:"10px",minWidth:width});
			obj.obj.find(".table").css({minWidth:""+(width+100)+"px"});
			obj.obj.find(".table .tr").each(function(){
				$(this).children("li:last").css({border:"0"})
				
				})
			
		}
		
	//自动列宽
	DataGrid.prototype.autoWidth=function(id,lastId,thisObj){
		var width = this.options.colTitle[id].width
		thisObj.css({width:width});
		thisObj.children("input").css({width:width-10});
		thisObj.children("select + input").css({width:width-40});
		if(id == lastId)thisObj.css({border:"0"});
		
		}
		
	//行右键菜单多选========================================
	//obj对象须添绑定data({id:data[i][0],obj:this})
	DataGrid.prototype.contextMenu = function(rowObj){
			var obj = this;
			rowObj.mouseup(function(e){
				var rowObj=$(this);
				var id =$(this).data("id");//data 传 id
				var scrollTop = $(window).scrollTop();
				
				$("body").attr("oncontextmenu","return false");
				$(".operateMenu").remove();
				var cont = "";
				var operateMenu = $("<div class='mousebox' style='position:absolute;z-index:1000;left:"+e.clientX+"px;top:"+(e.clientY+scrollTop)+"px;'></div>");
				var option ={};
				var optionTxt = obj.options.contextMenu;
				for(var i=0;i<optionTxt.length;i++){
					
					option = $("<a>"+optionTxt[i].title+"</a>");
					option.bind(""+optionTxt[i].events+"",{thisObj:rowObj,contextMenuObj:operateMenu,obj:obj},optionTxt[i].fun);
					operateMenu.append(option);
					}
				//右键事件
				if(e.button == 2){
					$(".mousebox").remove()
					$("body").append(operateMenu);
					}
					
				$(document).one('click', function(){ 
					$(document).one('click', function(e){
						if(e.button != 2){
						$(".mousebox").remove();
						}
					});
				});
					
				
				});
				
		}
			
	//添加列
	DataGrid.prototype.addCol=function(){
		
		}	
	//隐藏列
	DataGrid.prototype.hideCol=function(id,obj){
			$.checkId=id;//传入数据输出
			//console.log(id);
			if(id.length!=0){
				
				$(".table .tr",obj.obj).each(function(){
					//console.log(id.length)
						for(var i=0;i<id.length;i++){
							
							if(id[i]!=''){

								  $(this).children("li[class != 'checkbox']").eq(i).hide();
								}else{
								  $(this).children("li[class != 'checkbox']").eq(i).show();
									
									}
						}					
					});		
				}							
		}	
			
	
	//列排序=================================================
	DataGrid.prototype.cellSort=function(index,reverse,fn){	
				//增加多选列索引变换
				var index = this.options.isMultiSelect?index-1:index;

				var newData=this.data.sort(this.sort_by(index,reverse,fn));
				this.createDataList(this.options.colTitle.length,this.pager(newData,1,this.pageSize));
		}	
	DataGrid.prototype.sort_by=function(field, reverse, primer){		
			   var key = function (x) {return primer ? primer(x[field]) : x[field]}; 
			 
			   return function (a,b) { 
				   var A = key(a);
				   var B = key(b); 
				   return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                   
			   } 
		}	
		
		
	//多选1 shift键选取
	DataGrid.prototype.multiSelect = function(){
			var logs=new Array();
			var iflogs=new Array();
			var o,state=0;
			var startId=0,endId=0;
			var thisObj = this.obj.find(".table .tr",this.obj);
			//是否添加checkbox

			var checkbox=$("<li class='checkbox' style='z-index:999;width:20px;'><input type='checkbox' /></li>");
			var blank=$("<li class='' style='z-index:999;width:20px;'></li>");
			
			thisObj.eq(0).find(".checkbox").remove();
			thisObj.prepend(checkbox);
			thisObj.eq(1).find("li:first").html("");

			//checkbox选取
			thisObj.find("input:checkbox:gt(1)").click(function(e){
				state += 1;

					if($(this).attr("checked")){
						
						$(this).parent().parent().find("li").css({background:"#e5faff"});
					}else{
						
						$(this).parent().parent().find("li").css({background:"white"});
						}
				e.stopPropagation();
				})
			//全选
			thisObj.first().find("input:checkbox").click(function(e){
					
					if($(this).attr("checked")){
						thisObj.slice(2).find("li").css({background:"#e5faff"})
						thisObj.slice(2).find("input:checkbox").attr({checked:true});
						thisObj.slice(2).addClass("checked");//存入选中行
						
					}else{
						thisObj.slice(2).find("li").css({background:"white"})
						thisObj.slice(2).find("input:checkbox").attr({checked:false});
						thisObj.slice(2).removeClass("checked");//存入选中行
						}
				e.stopPropagation();
				})
					
			//tr选取
			thisObj.slice(2).click(function(e){
				//标记选取
				iflogs.push($(this).index())
				
				//判断shift键
				if(e.shiftKey){
					
	 				if(iflogs[iflogs.length-2]>$(this).index()){

						startId = $(this).index()+1;
						endId = iflogs[iflogs.length-2]
					}else if(iflogs[iflogs.length-2]<$(this).index()){

						startId = iflogs[iflogs.length-2]		
						endId = $(this).index()-1;
						}

					if(typeof(startId)!='undefined'&&startId!=endId){
						
							for(var i=startId;i<=endId;i++){
								var currtTr = $(".table .tr").eq(i);
								currtTr.find("li").css({background:"#e5faff"});
								currtTr.find("input:checkbox").attr({checked:true});
								currtTr.addClass("checked");//存入选中行
							
							}
						}
						
						
				}
				
				//判断鼠标左右键
				if(e.button == 2){//判断是否是鼠标右键	
						$(this).find("li").css({background:"#e5faff"})
						$(this).find("input:checkbox").attr({checked:true});
						$(this).addClass("checked");//存入选中行
					}else{//判断是否是鼠标左键					
					
						if($(this).hasClass("checked")){
							$(this).find("li").css({background:"white"})
							$(this).find("input:checkbox").attr({checked:false});
							$(this).removeClass("checked");//存入选中行
						}else{
							$(this).find("li").css({background:"#e5faff"})
							$(this).find("input:checkbox").attr({checked:true});
							$(this).addClass("checked");//存入选中行
							}
					}
				
				});				
				
				
		}
		
	//添加checkbox
	DataGrid.prototype.addCheckbox = function(parentObj){
		}
		
		
	//checkbox全选
	DataGrid.prototype.selectAll=function(name,obj){
			if($(name).attr("checked")=='checked'){
				$(".table",obj.obj).find("input[type='checkbox']").attr("checked", true);
				$(".table",obj.obj).find("li").css({background:"#eafafe"})
			}else{
				$(".table",obj.obj).find("input[type='checkbox']").attr("checked", false);
				$(".table",obj.obj).find("li").css({background:"white"})

				}				

		}	
		
		
	//列搜索=================================================
	DataGrid.prototype.columnSearch = function(){
		var obj =this;
		var thisObj = this.obj.find(".table .tr",this.obj);
		
		//列搜索栏
		var tr = $("<ul class='tr search'></ul>");
		for(var i=0;i<this.options.colTitle.length;i++) {
			var td;
			if(typeof(this.options.colTitle[i].searchType) != 'undefined'){
				switch (this.options.colTitle[i].searchType){
					case "text":
						td = $("<li><input class='text' type='text' /></li>");
					
					break;
					case "select":
						td = " <li><select class='list'>";
						
							for(var d=0;d<this.options.colTitle[i].searchArgument.length;d++){
										td += " <option value='"+this.options.colTitle[i].searchArgument[d]+"'>"+this.options.colTitle[i].searchArgument[d]+"</option>";
								}
						td += " </select></li>";
						td =$(td);
					
					
					break;
					case "select text":
						td = " <li><select class='condition'>";
						
							for(var d=0;d<this.options.colTitle[i].searchArgument.length;d++){
										td += " <option value='"+this.options.colTitle[i].searchArgument[d]+"'>"+this.options.colTitle[i].searchArgument[d]+"</option>";
								}
						td += " </select><input class='text' type='text' /></li>";
						td =$(td);
					
					
					
					break;
					
					}
				
				}else{
					td = $("<li></li>");
					
					}
			searchis(td);
			this.autoWidth(i,this.options.colTitle.length-1,td)	
			tr.append(td);
			
			
		}
		
		this.obj.find(".search",this.obj).remove();
		
		thisObj.first().after(tr);	
			
		this.hideCol($.checkId,obj);//隐藏列
					
			
			//事件
			function searchis(colObj){
					colObj.keyup(function(e){
							if(e.keyCode == 13){
								
									//自适应index
									var index = obj.options.isMultiSelect?$(this).index()-1:$(this).index();
									var txt="&";//查询条件
	
									if($(this).find(".list").length!=0){
										var val = $(this).find("select option:selected").text();
										 txt += "q="+obj.options.colTitle[index].name+":"+val+"*";
										
										}else if($(this).find(".condition").length!=0){
											var val = $(this).find("select option:selected").text();
											var txt = $(this).find(".text").text();
											switch(val){
												case "=" :
													txt += "q="+obj.options.colTitle[index].name+":["+txt+"to"+txt+"]";
												break;
												case ">" :
													txt += "q="+obj.options.colTitle[index].name+":["+txt+"to *]";
												break;
												case "<" :
													txt += "q="+obj.options.colTitle[index].name+":[* to "+txt+"]";
												break;											
												}
										
										}else{
										 	txt += "q="+obj.options.colTitle[index].name+":"+val+"*";
											
											}
									//obj.cellSearchText(index,txt,obj);

									var path = obj.options.ajaxURL;
									var startNum = 1*obj.pageSize;
									path += "&start="+startNum+"&rows="+obj.pageSize;
									path += txt;
									//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
									parent.$.util.get(path,function(msg){
																 
										var newdata = msg.response.docs;
										obj.createDataList(column,newdata);
											 
									});
									
									
							  }
						
						});
					
					colObj.find(".list").change(function(){
								//自适应index
								
								var index = obj.options.isMultiSelect?$(this).parent().index()-1:$(this).parent().index();
								var txt="&";
								var val = $(this).find("select option:selected").text();
								txt += "q="+obj.options.colTitle[index].name+":"+val+"*";
								
								var path = obj.options.ajaxURL;
								var startNum = 1*obj.pageSize;
								path += "&start="+startNum+"&rows="+obj.pageSize;
								path += txt;
								//"http://10.8.1.111:8983/solr/select?&q=*:*&wt=json&start=0&rows=10000"
								parent.$.util.get(path,function(msg){
															 
									var newdata = msg.response.docs;
									obj.createDataList(column,newdata);
										 
								});
						
						})
					
					
				
				}		
		
		}
	
						
	/////////////////////////////////////////////////////////////////////////	
	//创建Jquery 插件
	/////////////////////////////////////////////////////////////////////////	
	function Grid(){
		
		Grid.prototype.create=function(options){
			var d;
			d =new DataGrid(options)
			return d;
			}
		
		}
	$.datagrid = new Grid();
		
})(jQuery);
