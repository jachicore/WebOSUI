// JavaScript Document

(function($){
		
	function Log(){
		console.log("create log instance!");
	}
	
	Log.prototype.info = function (operInfo) {
		
		var logUrl = "/aas/writelog";
		var username = top.$.aos.users.current;
		console.log(operInfo);
		$.ajax({
			async:false,
			data:{user:username, content:operInfo},
			type:'POST',
			url:logUrl
		});
		
	};
	
	$.aos.log = new Log();
})(jQuery);



