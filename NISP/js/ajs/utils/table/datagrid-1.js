(function($){
	/////////////////////////////////////////////////////////////////////////	
	//Object() 创建对象
	/////////////////////////////////////////////////////////////////////////	
	function DataGrid(options){
	var defaults={
		container:"",
		caption:"DataGrid 表格插件",//表格的标题
		isCaption:true,//是否显示标题
		width:'100%',//表格的宽度
		height:800,//表格的高度
		colTitle:[		
//			{title:'ID',sortable:true,editable:false,isHide:false, width:40, sortFunction: parseInt},
//
//			{title:'用户名',sortable:true,width:80,isHide:true, searchType:"text", editable:true},
//			{title:'用户类型',sortable:true,width:80,isHide:false, editable:true, searchType:"select",searchArgument:['普通用户','白名单用户','黑名单用户','预打击用户','打击用户']},
//			{title:'控制类型',sortable:true,width:80,isHide:false, editable:true, searchType:"select",searchArgument:['条件警告','无条件警告','条件阻挡','无条件阻挡','条件阻断','无条件阻断','干扰类型','不处理']},
//			{title:'阀值',sortable:true,width:60,isHide:false, searchType:"select text", searchArgument:["=","<",">"], editable:true},
//			{title:'设备数',sortable:true,width:60,isHide:false, searchType:"select text", searchArgument:["=","<",">"],  editable:true},
//			{title:'共享台',sortable:true,width:60,isHide:false, searchType:"select text", searchArgument:["=","<",">"],  editable:true},
//			{title:'MAC',sortable:true,width:120,isHide:false, searchType:"text", editable:true},
//			{title:'IP',sortable:true,width:100,isHide:false, searchType:"text", editable:true},
//			{title:'历史图表',sortable:true,width:80,isHide:false,  editable:false},
//			{title:'详细信息',sortable:false,width:80,isDetail:false, isHide:false, editable:false,onclick:function(){
//				//获取数据 实例 d.data.data;
//				//获取当前记录ID d.data.id;
//
//				}},
//			{title:'用户状态',width:80,sortable:true,editable:false}
			
		],
		data:[],//表格的数据. 比如有一个用户信息的表格，那么表格数据可能是：[{"张三","20","男","18623829482"},{"李四","32","男","18623845682"}] 'Time', 'Name', 'Note','Num','Price','Other'
		isClickForDetail:false,//设置点击行, 是否显示该行详细信息
		clickForDetailFunction:function(id,obj){

					var data = obj.options.data;

					var detailList= $("<div class='dg-grid-box'></div>");
					var title  = $("<div class='title'><a href='' class='icon-close'></a></div>");
					var detailTable = $("<table cellpadding='0' cellspacing='0'></table>");
					var titleTxt='';
					for(var j=0;j<data[id].length-2;j++){
						  var tr = '<tr>';
							  tr += "      <th>"+obj.options.colTitle[j].title+"</th>";
							  tr += "      <td>"+data[id][j]+"</td>";
							  tr += "</tr>";
							  titleTxt = data[id][1];
							  detailTable.append(tr);
						
						}
	
					 title.prepend(titleTxt);
					 detailList.append(title);
					 detailList.append(detailTable);
					 detailList.draggable({handle:title});
					 detailList.width(obj.options.width*0.6);
					 $("body").prepend(detailList);
					 
					 //关闭
					 detailList.find(".title .icon-close").click(function(){
						 detailList.remove();
					
	
				});
			
			},
		isMultiSelect:false,//是否支持选择多行
		sortable:true,//是否支持排序
		sortorder:"desc",//设置排序顺序, 两种:'desc'/'asc'
		rowNum:10,//设置一页显示的记录条数，初始化是10条
		rowList: [10,20,30],//设置选择每页显示的条数
		isColumnSearch:true,//是否支持列搜索
		isMenuBar:false,//设置需要菜单栏
		menuBarPara:[
//		 			$("<div class='dg-btn-bg'><span>提示文字：</span><input class='searchAll' type='text' /></div>"),
//		 			$("<a class='dg-btn-a' href='#'>ok</a>").click({k:this},function(e){
//		 				console.log($(this).siblings(".searchAll").val());
//		 				//console.log(e.data.k);	
//		 			}),
//		 		
		],
		isTipsBar:false,//是否显示提示信息
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

						
					}
				},
			{title:"修改",events:"click",fun:function(e){
						var obj = e.data.obj;
						var thisObj = e.data.thisObj;
						var id =thisObj.data().id; //获取ID
						
						e.data.contextMenuObj.remove();//关闭菜单
				
						var data = obj.data;
				
				
				}},
			{title:"删除",events:"click",fun:function(e){
						var obj = e.data.obj;
						var thisObj = e.data.thisObj;
						var id =thisObj.data().id; //获取ID

						e.data.contextMenuObj.remove()//关闭菜单
				
						thisObj.remove();
				
				
				
				}}

		],
		func:{inputdata:function(){
			
			},outputdatacurr:function(data){
					
			},outputdataall:function(data){
					
			}},
		rowOnclick:function(data,obj,trObj){
//			console.log(data);
//			console.log(obj);
//			console.log(trObj);
			
			}		
		
		};
		this.options=$.extend(true,defaults,options);	
		
	//识别Class Or Id Or DOM
	this.obj;//Dom对象
	this.datasource = [];//初始数据源
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

		this.obj.css({width:this.options.width,height:this.options.height,border:"1px solid #999"});
		this.obj.addClass("dg-grid-container");
		this.obj.css({position:"relative"});
	
		this.data =this.options.data;
		this.pageSize =this.options.rowNum;
		this.totalPage = Math.ceil(this.data.length/this.pageSize);
		this.currentPage = 1;
		$.checkId=[];//全局变量 hideCol id
		
		//是否设置标题栏
		if(this.options.isCaption)this.obj.prepend("<div class='dg-grid-titile'>"+this.options.caption+"</div>");
		
		//是否设置菜单栏
		if(this.options.isMenuBar)this.obj.append(this.createMenu());
		
		//是否设置提示信息
		if(this.options.isTipsBar)this.obj.append(this.createTips());
		
		this.obj.append(this.createTable());

		//是否设置工具栏
		if(this.options.isToolBar)this.obj.append(this.createToolBar());
		
		this.obj.append(this.createPager(this.data));	
		
		//显示数据列表
		this.datashow(this.data);
				
		this.toTopPage();	
		this.toLastPage();
		this.toNextPage();
		this.toPrePage();
		this.toPage();
		this.changeRowNum();
		
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
		var subObj = $("<div class='menu dg-grid-menu'></div>");
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
		
	//创建提示信息============================================
	DataGrid.prototype.createTips=function(){
		var subObj = $("<div class='dg-grid-tips'>提示：按照日报表、月报表、年报表3种方式统计。</div>");
		return subObj
		}	

	//创建表结构=================================================
	DataGrid.prototype.createTable=function(){
		var subObj = $("<div class='dg-grid-table'></div>");
			
		//thead
		var tr = $("<ul class='head tr'></ul>");
		for(var i=0;i<this.options.colTitle.length;i++) {

			  var td = $("<li>"+this.options.colTitle[i].title+"</li>");
				
			  if(this.options.sortable && this.options.colTitle[i].sortable){
				  var dd=2,reverses=true;
				  td.append("<span class='sort'></span>");
				  td.click({fn: this.options.colTitle[i].sortFunction,obj:this},function(e){
					  var obj = e.data.obj;
					  dd++;
					  if(dd%2==0){
						  reverses=true;
						  }else{
							  
							  reverses=false;
							  }
					  obj.cellSort($(this).index(),reverses,e.data.fn);
				  });	

			  }
			  this.autoWidth(i,this.options.colTitle.length-1,td);
			  tr.append(td);
		}
		//是否添加多选
		//this.addCheckbox(tr);
		subObj.append(tr);
				
		return subObj;
		}	
		
	//显示数据列表
	DataGrid.prototype.datashow=function(data){
		this.datasource = [];
		this.createDataList(this.options.colTitle.length,this.pager(data,1,this.pageSize));
		}
		
	//创建数据列表=================================================
	DataGrid.prototype.createDataList=function(column,data){
			this.obj.find(".dg-grid-table .tr:gt(1)",this.obj).remove();
			var loading = $("<div class='loading'></div>");
			this.obj.prepend(loading);
	
			//tbody
			for(var i=0;i<data.length;i++) {
				var tr = $("<ul class='tr'></ul>").data({id:data[i][0],data:data[i]});
				  for(var j=0;j<column;j++){
					  if(typeof(data[i][j])!='undefined'){
						 var td = $("<li></li>");
						  td.append(data[i][j]);
						   this.autoWidth(j,this.options.colTitle.length-1,td);
						  tr.append(td);
					  }
				  }
					
				//行点击详细
				if(this.options.isClickForDetail){
					var o = this;

						tr.dblclick({id:data[i][0],o:this},function(e){
								o.options.clickForDetailFunction(e.data.id,e.data.o);							
							});
					}
				
				//右键菜单 添加 编辑 修改		
				if(this.options.isContextMenu)this.contextMenu(tr);//右键菜单
				
				this.obj.find(".dg-grid-table").append(tr);
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
		var obj = this;
		var subObj = $("<div class='dg-grid-toolbar bottomOparete'></div>");
		var link = $("<div class='link'></div>");
		var	inputdata = $("<a href='#' style='display:none' >批量导入</a>");
		var	outputdatacurr = $("<a href='#'>导出当前页记录</a>");
		var	outputdataall = $("<a href='#'>导出所有记录</a>");
		
		link.append(inputdata).append(outputdatacurr).append(outputdataall);
		subObj.append(link);
		//事件
		inputdata.click(function(){obj.get});
		outputdatacurr.click(function(){
			var datas = obj.getSelectedRowsData();
			obj.options.func.outputdatacurr(obj.exportData(datas));
			
		});
		outputdataall.click(function(){
			
			obj.options.func.outputdataall(obj.exportData(obj.data));
			
		});
		
		return subObj
		}	
		
		
		
	//创建表底部分页=================================================
	DataGrid.prototype.createPager=function(newdata){
		$('.pager').remove();
		var subObj = $("<div class='pager dg-grid-pagetrun'></div>");
		
		var totalRows = newdata.length;
		var totalPage = Math.ceil(totalRows/this.pageSize);		

	$(".dg-grid-pagetrun").remove();
	var cont = '';
		cont += "            <div class='count'>当前显示1-"+this.pageSize+"条 (共 <span class='totalrows'>"+totalRows+"</span> 条数据)</div>";
		cont += "            <div class='page'>";
		cont += "                <a href='#' class='page_a_btn'><span class='icon-pre'></span></a>";
		cont += "                <a href='#' class='page_a_btn'><span class='icon-up'></span></a>";
		cont += "           		<div><span>跳转到第</span><input name='' type='text'  value='1' class='txt_page'/><span>页(共</span>";
		cont += "           		<span class='totalpagetxt'>"+totalPage+"</span>页)</div>";
		cont += "                <a href='#' class='page_a_btn'><span class='icon-down'></span></a>";
		cont += "                <a href='#' class='page_a_btn'><span class='icon-last'></span></a>";
		cont += "                <div>";
		cont += "                <span>本页显示</span><select name='' class='slct_page'>";
								for(var i=0;i<this.options.rowList.length;i++){
		cont += "                <option value="+this.options.rowList[i]+">"+this.options.rowList[i]+"</option>";
									
									}
		cont += "                </select><span>条</span>";
		cont += "                </div>";
		cont += "            </div>";
		
		var c = $(cont);
		subObj.append(c);	
		
		return subObj
		}
		
	//创建隐藏列下拉菜单
	DataGrid.prototype.hideColMenu = function(ParentObj){
			var showhidecolumn = $("<div class='showhidecolumn' style='float:right;margin:10px;'>点击显示列表</div>");
			var drop_menu=$("<div class='dg-grid-drop-menu' style='position:absolute; display:none'></div>");
			
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
			this.obj.after(drop_menu);
					
					
			//隐藏列下拉菜单选择	
			showhidecolumn.click(function(){
					$(".dg-grid-drop-menu",this.obj).show();
					var offset = showhidecolumn.offset();

					drop_menu.css({position:'absolute',top:offset.top+showhidecolumn.height()+2,left:offset.left-(drop_menu.width()-showhidecolumn.width())});
						
				});
			submitis.data({obj:this}).click(function(){
				var obj = $(this).data().obj;
				$(".dg-grid-drop-menu",this.obj).hide();
					var checkboxmenu = $("input[type='checkbox']",'.dg-grid-drop-menu');
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
		
	//分页函数===============================================================
	DataGrid.prototype.pager=function(newdata,currentPage,pageSize){
		
				//this.datasource = $.extend(true,[],newdata);
				if(this.datasource.length==0){
					this.datasource = newdata;
					};
				//console.log(this.datasource);
				//console.log("==========");
				//console.log(this.datasource);
				//newdata = [];
				//console.log(this.datasource);
				
				this.data = newdata;
				
				var totalRows = newdata.length;
				var totalPage = Math.ceil(totalRows/pageSize);
				var data = new Array();
				var index = (currentPage-1)*pageSize;
				var flag = totalRows - (currentPage-1)*pageSize < pageSize ? totalRows - (currentPage-1)*pageSize : pageSize;//
				for(var i =0; i< flag; i++){
					data.push(newdata[index]);
					index++;
				}

			$(".txt_page",this.obj).val("");
			$(".txt_page",this.obj).val(currentPage);
			$(".totalpagetxt",this.obj).text(totalPage);
			$(".totalrows",this.obj).text(totalRows);
			//console.log(totalPage);
			return data;
		
		}	
		
		
	//指定跳转页
	DataGrid.prototype.toPage=function(){
		$(".txt_page").keyup({obj:this},function(e){
			if(e.keyCode == 13){
				
				var obj=e.data.obj;
				obj.totalPage = Math.ceil(obj.data.length/obj.pageSize);
				
				if($(this).val()>=1&&$(this).val()*1<=obj.totalPage){
						var newdata = obj.pager(obj.data,$(this).val()*1,obj.pageSize);
						obj.createDataList(obj.options.colTitle.length,newdata);
					}else{
						alert("无效页数！");
						
						};
				}
			
			});
		}	
	//首页
	DataGrid.prototype.toTopPage=function(){
		var column =this.options.colTitle.length;

		$(".icon-pre").click({obj:this},function(e){
			var obj=e.data.obj;
			obj.totalPage = Math.ceil(obj.data.length/obj.pageSize);
			obj.currentPage = 1;
			var newdata = obj.pager(obj.data,1,obj.pageSize);
			obj.createDataList(column,newdata);
			});	
		}	
	//末页
	DataGrid.prototype.toLastPage=function(){	
		var column =this.options.colTitle.length;

		$(".icon-last",this.obj).click({obj:this},function(e){
			var obj=e.data.obj;
			obj.currentPage = obj.totalPage = Math.ceil(obj.data.length/obj.pageSize);
			
			var newdata = obj.pager(obj.data,obj.totalPage,obj.pageSize);
			obj.createDataList(column,newdata);
			});	
		}	
	//下一页
	DataGrid.prototype.toNextPage=function(){
		var column =this.options.colTitle.length;
		
		$(".icon-down",this.obj).click({obj:this},function(e){
			var obj=e.data.obj;
			obj.totalPage = Math.ceil(obj.data.length/obj.pageSize);
			if(obj.currentPage==obj.totalPage){
				
			}else{
					
					obj.currentPage++;
					var newdata = obj.pager(obj.data,obj.currentPage,obj.pageSize);
					obj.createDataList(column,newdata);
				 }
			});	
		}	
	//上一页
	DataGrid.prototype.toPrePage=function(){
		var column =this.options.colTitle.length;

		$(".icon-up",this.obj).click({obj:this},function(e){
			var obj=e.data.obj;
			obj.totalPage = Math.ceil(obj.data.length/obj.pageSize);
			if(obj.currentPage==1){
				
			}else{
					
					obj.currentPage--;
					var newdata = obj.pager(obj.data,obj.currentPage,obj.pageSize);
					obj.createDataList(column,newdata);
				 }
				 
			});	
		}	
	//设置一页显示的记录条数
	DataGrid.prototype.changeRowNum=function(){

		$(".slct_page").change({obj:this},function(e){
			var obj=e.data.obj;
			obj.pageSize=$(".slct_page",obj.obj).find("option:selected").text();
			var totalRows = obj.data.length;
			var totalPage = Math.ceil(totalRows/obj.pageSize);	
			if(obj.currentPage>totalPage)obj.currentPage = totalPage;
			obj.createDataList(obj.options.colTitle.length,obj.pager(obj.data,obj.currentPage,obj.pageSize));
			$(".totalpagetxt",obj.obj).html(totalPage);
			$(".count",obj.obj).html("当前显示1-"+obj.pageSize+"条 (共 <span class='totalrows'>"+totalRows+"</span>条数据");
			
			//自适应高度
			obj.autoWH(obj.trHeight*obj.pageSize);
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
			height += obj.obj.find(".dg-grid-menu").height()*1;
			height += obj.obj.find(".pager").height()*1+1;
			
			if(obj.options.isCaption)height += obj.obj.find(".dg-grid-titile").height()*1;
			
			if(obj.options.isCaption)height += obj.obj.find(".dg-grid-tips").height()*1;

			if(obj.options.isToolBar)height += obj.obj.find(".dg-grid-toolbar").height()*1;
			
			obj.obj.css("height","auto");
			obj.obj.find(".tableContainer").css("height",""+height+"px");
			obj.obj.find(".tableContainer").css("overflow","scroll");
			obj.obj.find(".tableContainer").css("border","1px solid red");


			
			//总宽度
			var width = 0;
			for(var i=0;i<obj.options.colTitle.length;i++){
				width += obj.options.colTitle[i].width;
				
				}
				
			width += obj.options.colTitle.length +7*obj.options.colTitle.length+1;
			//obj.obj.css({width:width});
			obj.obj.css({width:this.options.width,margin:"0px",minWidth:width});
			obj.obj.find(".dg-grid-table").css({minWidth:""+(width+200)+"px"});
			obj.obj.find(".dg-grid-table .tr").each(function(){
				$(this).children("li:last").css({border:"0"});
				
				});
			
		}
		
	//自动列宽
	DataGrid.prototype.autoWidth=function(id,lastId,thisObj){
		var width = this.options.colTitle[id].width;
		var totalwidth = "";
		thisObj.css({width:width+"px",'over-flow':'hid'});
		if(thisObj.children("select + input").length==1){
				
				var other = thisObj.children("select").css({width:"28px"});
				totalwidth = (width-other.width())+"px";
				

			}else{
			totalwidth = width*1.2+"px";
				}
			//console.log(totalwidth)
			thisObj.children("input").css({width:totalwidth});	
		if(id == lastId)thisObj.css({border:"0"});
		
	}
	
	//导出
	DataGrid.prototype.exportData=function(datas){
		//obj 传递datagrid this对象
		var hideid = $.checkId;
		var title = [],dataTxt = "";
		if(datas.length != 0){
				
				for(var i = 0;i<this.options.colTitle.length;i++){
						if(hideid[i].length==0)
						title.push(this.options.colTitle[i].title);
					}
				

				for(var j = 0;j<datas.length;j++){
					var rowdata = [];
					for(var j_ = 0; j_<hideid.length ; j_++){
						
						if(hideid[j_].length==0)
						 rowdata.push(datas[j][j_]);
						}
					dataTxt += rowdata.join(',')+"\r\n";
				}
			
			}else{
				alert("你未选择记录！请选择");
				
				}
		var gettitle = title.join(',')+"\r\n";
		dataTxt = gettitle + dataTxt;
		return dataTxt;	
		}	
	
		
	//行右键菜单多选========================================
	//obj对象须添绑定data({id:data[i][0],obj:this});
	DataGrid.prototype.contextMenu = function(rowObj){
			var obj = this;
			rowObj.mouseup(function(e){
				var rowObj=$(this);
				var id =$(this).data("id");//data 传 id
				var scrollTop = $(window).scrollTop();
				
				$("body").attr("oncontextmenu","return false");
				$(".operateMenu").remove();
				var cont = "";
				var operateMenu = $("<div class='dg-grid-right-menu' style='position:absolute;z-index:1000;left:"+e.clientX+"px;top:"+(e.clientY+scrollTop)+"px;'></div>");
				var option ={};
				var optionTxt = obj.options.contextMenu;
				for(var i=0;i<optionTxt.length;i++){
					
					option = $("<a>"+optionTxt[i].title+"</a>");
					option.bind(""+optionTxt[i].events+"",{thisObj:rowObj,contextMenuObj:operateMenu,obj:obj},optionTxt[i].fun);
					operateMenu.append(option);
					}
				//右键事件
				if(e.button == 2){
					$(".dg-grid-right-menu").remove();
					$("body").append(operateMenu);
					}
					
				$(document).one('click', function(){ 
					$(document).one('click', function(e){
						if(e.button != 2){
						$(".dg-grid-right-menu").remove();
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

			if(id.length!=0){
				
				$(".dg-grid-table .tr",obj.obj).each(function(){

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
		
		
	//显示详细记录=================================================
	DataGrid.prototype.showDetail=function(){
		
				
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
			var obj = this;
			var logs=new Array();
			var iflogs=new Array();
			var o,state=0;
			var startId=0,endId=0;
			var thisObj = this.obj.find(".dg-grid-table .tr",this.obj);
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
				});
			//全选
			thisObj.first().find("input:checkbox").click(function(e){
						
					if($(this).attr("checked")){
						thisObj.slice(2).find("li").css({background:"#e5faff"});
						thisObj.slice(2).find("input:checkbox").attr({checked:true});
						thisObj.slice(2).addClass("checked");//存入选中行
						
						var datas = obj.getSelectedRowsData();
						var trObj = obj.getSelectedRowsObj();
						obj.options.rowOnclick(datas,obj,trObj);
						
					}else{
						thisObj.slice(2).find("li").css({background:"white"});
						thisObj.slice(2).find("input:checkbox").attr({checked:false});
						thisObj.slice(2).removeClass("checked");//存入选中行
						obj.options.rowOnclick([],obj,[]);
						}
				e.stopPropagation();
				});
					
			//tr选取
			thisObj.slice(2).click(function(e){
				//标记选取
				iflogs.push($(this).index());
				
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
								var currtTr = $(".dg-grid-table .tr").eq(i);
								currtTr.find("li").css({background:"#e5faff"});
								currtTr.find("input:checkbox").attr({checked:true});
								currtTr.addClass("checked");//存入选中行
							
							}
						}
						
						
				}
				
				//判断鼠标左右键
				if(e.button == 2){//判断是否是鼠标右键	
						$(this).find("li").css({background:"#e5faff"});
						$(this).find("input:checkbox").attr({checked:true});
						$(this).addClass("checked");//存入选中行
					}else{//判断是否是鼠标左键					
					
						if($(this).hasClass("checked")){
							$(this).find("li").css({background:"white"});
							$(this).find("input:checkbox").attr({checked:false});
							$(this).removeClass("checked");//存入选中行
						}else{
							$(this).find("li").css({background:"#e5faff"});
							$(this).find("input:checkbox").attr({checked:true});
							$(this).addClass("checked");//存入选中行
							}
					}
				//判断鼠标左键 输出行信息 事件驱动
				if(e.button == 0){
					var datas = obj.getSelectedRowsData();
					var trObj = obj.getSelectedRowsObj();
					
						obj.options.rowOnclick(datas,obj,trObj);
					
					}
				
				});				
				
				
		}
		
	//添加checkbox
	DataGrid.prototype.addCheckbox = function(parentObj){
		}
		
		
	//checkbox全选
	DataGrid.prototype.selectAll=function(name,obj){
			if($(name).attr("checked")=='checked'){
				$(".dg-grid-table",obj.obj).find("input[type='checkbox']").attr("checked", true);
				$(".dg-grid-table",obj.obj).find("li").css({background:"#eafafe"});
			}else{
				$(".dg-grid-table",obj.obj).find("input[type='checkbox']").attr("checked", false);
				$(".dg-grid-table",obj.obj).find("li").css({background:"white"});

				}				

		}	
		
	//状态存储=================================================
	DataGrid.prototype.setState=function(obj){
		document.cookie = JSON.stringify(obj);
		var state =document.cookie;
		var d =JSON.parse(state);

		}
	//状态存储=================================================
	DataGrid.prototype.getState=function(name,value){
		var state = document.cookie;
		return state;
		}
		
	//列搜索=================================================
	DataGrid.prototype.columnSearch = function(){
		var obj =this;
		var thisObj = this.obj.find(".dg-grid-table .tr",this.obj);
		
		//列搜索栏
		var tr = $("<ul class='tr search'></ul>");
		for(var i=0;i<this.options.colTitle.length;i++) {
			var td;
			if(typeof(this.options.colTitle[i].searchType) != 'undefined'){
				switch (this.options.colTitle[i].searchType){
					case "text":
						td = $("<li><input type='text' /></li>");
					
					break;
					case "select":
						td = " <li><select class='uClass'>";
						
							for(var d=0;d<this.options.colTitle[i].searchArgument.length;d++){
										td += " <option value='"+this.options.colTitle[i].searchArgument[d]+"'>"+this.options.colTitle[i].searchArgument[d]+"</option>";
								}
						td += " </select></li>";
						td =$(td);
					
					
					break;
					case "select text":
						td = " <li><select>";
						
							for(var d=0;d<this.options.colTitle[i].searchArgument.length;d++){
										td += " <option value='"+this.options.colTitle[i].searchArgument[d]+"'>"+this.options.colTitle[i].searchArgument[d]+"</option>";
								}
						td += " </select><input type='text' /></li>";
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
									var txt="";
	
									if($(this).find("select").length!=0);
										  txt += $(this).find("select option:selected").text()+":";
									if($(this).find("input:text").length!=0);
										  txt += $(this).find("input").val();
									obj.cellSearchText(index,txt,obj);
									

							  }
						
						});
					
					colObj.find(".uClass").change(function(){
								//自适应index
								
								var index = obj.options.isMultiSelect?$(this).parent().index()-1:$(this).parent().index();
								var txt="";

								txt = $(this).parent().find("select option:selected").text();
			
								obj.cellSearchText(index,txt,obj);
			
						});
					
					
				
				}		
		
		}
	
	DataGrid.prototype.cellSearchText=function(id,txt,obj){
		
		var txt=txt.split(":");
		var reg = new  RegExp(txt[1]);

		var dataAll=obj.data;
		var newSearchData=new Array();

		if(typeof(txt[1])!='undefined'&&txt[1]!=""){
			switch (txt[0]){
				case '=':

					for(var i=0;i<dataAll.length;i++){	
							if(txt[1]*1==dataAll[i][id]){
								newSearchData.push(dataAll[i]);
								}				
						}
					
					break;
				
				case '>':

					for(var i=0;i<dataAll.length;i++){	
							if(txt[1]*1<dataAll[i][id]){
								newSearchData.push(dataAll[i]);
								}				
						}

					break;
				
				case '<':

					for(var i=0;i<dataAll.length;i++){	
							if(txt[1]*1>dataAll[i][id]){
								newSearchData.push(dataAll[i]);
								}				
						}
					break;
				
				};

				
		}
		if(txt==""||txt[1]==""){//输入为空
			newSearchData = obj.datasource;
		}
		if(txt[0]!=""&&typeof(txt[1])=='undefined'){

		var reg = new  RegExp(txt[0]);
			for(var i=0;i<dataAll.length;i++){		
					if(reg.test(String(dataAll[i][id]))){
						newSearchData.push(dataAll[i]);
						}				
				}
			
			
			}
		if(txt[0].length==0&&txt[1].length>0){
		var reg = new  RegExp(txt[1]);
			for(var i=0;i<dataAll.length;i++){		
					if(reg.test(String(dataAll[i][id]))){
						newSearchData.push(dataAll[i]);
						}				
				}
		}
		console.log(txt);
		obj.data=newSearchData;
		var newdata = obj.pager(obj.data,1,obj.pageSize);
		obj.createDataList(obj.options.colTitle.length,newdata);

}

		
	//列拖动
/*	DataGrid.prototype.colDrag=function(thisObj){
		//thisObj table tr th 标题行 
		var obj = thisObj.children();
		var offset = obj.offset();
		var X = offset.left;
		var Y = offset.top;
		var startX = X;
		var endX = obj.width()+X;
				
		thisObj.children().mousedown({pObj:this.obj},function(ee){
			$(document).mousemove({obj:$(this),pObj:ee.data.pObj},function(e){
				var obj = e.data.obj;
				var pObj = e.data.pObj;
				var eX =e.clientX;
				var eY =e.clientY;

				obj.css({position:"absolute",left:eX-pObj.offset().left,border:"1px solid blue"});
				
				});
			
			}).mouseup(function(){
					$(document).unbind("mousemove");
					}).mouseover({obj:$(this),pObj:ee.data.pObj},function(e){
						
						obj.css({position:"absolute",left:eX-pObj.offset().left,border:"1px solid blue"});
						
						});
				
		}
*/	
	//选择行id
	DataGrid.prototype.getSelectedRows=function(){
		var ids = [];
		
		var thisObj = this.obj.find(".dg-grid-table .tr",this.obj);
		var checks = thisObj.find("input:checkbox");

		for( var i = 1; i<checks.length;i++){
				if($(checks[i]).attr("checked")){
					
					ids.push($(checks[i]).parent().parent().data("id"));
				}			
			}
		return ids;
		}

	//选择行data
	DataGrid.prototype.getSelectedRowsData=function(){
		var ids = [];
		var trObj = [];
		var thisObj = this.obj.find(".dg-grid-table .tr",this.obj);
		var checks = thisObj.find("input:checkbox");

		for( var i = 1; i<checks.length;i++){
				if($(checks[i]).attr("checked")){
					
					ids.push($(checks[i]).parent().parent().data("data"));
					trObj.push($(checks[i]).parent().parent());
				}			
			}
		return ids;
		}
	//选择行trOBJ
	DataGrid.prototype.getSelectedRowsObj=function(){
		var ids = [];
		var thisObj = this.obj.find(".dg-grid-table .tr",this.obj);
		var checks = thisObj.find("input:checkbox");

		for( var i = 1; i<checks.length;i++){
				if($(checks[i]).attr("checked")){
					
					ids.push($(checks[i]).parent().parent());

				}			
			}
		return ids;
		}
	//选择行trOBJ
	DataGrid.prototype.copyData=function(olddata){
		var newdata = [];
		var datatostring = "";
		if(olddata.length!=0){
				for(var i = 0 ;i<olddata.length;i++){
					datatostring += olddata[i].toString()+"!@#$%";						
					
					}
			}
		newdata = datatostring.split("!@#$%");
		if(newdata.length>0){
			for(var i=0;i<newdata.length;i++){
				newdata[i] = newdata[i].split(",");
				
				}
			
			}
		
		return newdata;
		}

	/////////////////////////////////////////////////////////////////////////	
	//创建Jquery 插件
	/////////////////////////////////////////////////////////////////////////	
	function Grid(){
		
		Grid.prototype.create = function(options){
			var d;
			d =new DataGrid(options);
			return d;
			}
		
		}
	$.datagrid = new Grid();
		
})(jQuery);
