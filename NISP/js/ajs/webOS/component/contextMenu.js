/**
 *  文件: contextMenu.js
 *  描述：
 		Dependency : 右键菜单类
 */
;(function($){
		  
		  function ContextMenu(){
			  this.content;
		  }
		  
		  //初始化右键菜单
		  ContextMenu.prototype.init(){
			  var content = '';
			  content += "<div class=\"contextMenu\" id=\"myMenu\">"
			  <div class="contextMenu" id="myMenu1">
				<ul>
				  <li id="aos_openFolder">打开</li>
				  <li id="aos_rename">重命名</li>
				  <li id="aos_del">删除</li>
				</ul>
			  </div>
		  }
		  

})(jQuery);



