// JavaScript Document
function resize_jqGrid(table_id){
    jQuery(window).bind('resize', function() {
        // Get width of parent container
        var width = $("body")[0].clientWidth;
        if (width == null || width < 1){
            // For IE, revert to offsetWidth if necessary
            width = $("body")[0].offsetWidth;
        }
        width = width - 20; // Fudge factor to prevent horizontal scrollbars
        if (width > 0 &&
            // Only resize if new width exceeds a minimal threshold
            // Fixes IE issue with in-place resizing when mousing-over frame bars
            Math.abs(width - $("#"+table_id).width()) > 5)
            {
            $("#"+table_id).jqGrid('setGridWidth',width);
        }
				
    }).trigger('resize');
}

/*
 * param = {gridid:xxx,pageid:xxx,tools:[{name:xxxx,clickFun:function}]}
 */
function createOrRefreshGrid (param, grid) {
	$("#"+param.gridid).jqGrid("GridUnload",param.gridid);
	
	var gridParam = {
		height:"100%",
		//url : "server.php",
		datatype:"local", //"json",
		colNames:['列1'],
		colModel:[
			{name:'col1', index:'col1',align:"center"}
		],
		data:[],
		isCaption:false,
		multiselect:true,
		rowNum:10, 
		rowList:[5,10,20,50], 
		pager: '#'+param.pageid,  
		viewrecords: true, 
		sortorder: "desc", 
		autowidth:true,
		shrinkToFit:true
	};
	
	for (var attr in grid) {
		gridParam[attr] = grid[attr];
	}
	
	datagrid = $("#"+param.gridid).jqGrid(gridParam);
	datagrid.jqGrid('navGrid','#'+param.pageid,{edit:false,add:false,del:false,search:false,refresh:false});
	datagrid.jqGrid('filterToolbar',{stringResult: true,searchOnEnter : true});
	resize_jqGrid(param.gridid);	
	
	if (param.tools) {
		for (var i=0; i<param.tools.length; i++) {
			var tool = param.tools[i];
			var exportBtn = $("<input type='button' value='Export Data'/>");
			$("#t_"+param.gridid).append(exportBtn);
			exportBtn.val(tool.name);
			exportBtn.click(tool.clickFun);
		}
	}
}
