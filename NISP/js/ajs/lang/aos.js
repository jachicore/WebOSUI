(function($) {
	$.aos = {};
	$.aos.preImports = new Array();
	var preImportsCheck = {};
	var count = 0;

	$.aos.ajsRoot = (function() {//所有系统所需的JS的根目录
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			var src = scripts[i].src;
			var index = src.indexOf("js/ajs/lang/aos.js");
			if (index > 0) {
				return src.substring(0, index);
			}
		}
	})();

	$.aos.require = function(js) {
		var contains = false;
		if (!preImportsCheck[js]) {
			preImportsCheck[js] = js;
			$.aos.preImports.push(js);
		}
	};

	$.aos.onImport = function(jspath, data) {

	};

	$.aos.ready = function(options) {
		var def = {
			begin : function() {
			},
			onImport : function(jspath, data) {
			},
			finish : function() {
			}
		};
		def = $.extend(def, options);

		def.begin();

		// 判断要导入的js文件是否已经导入
		var jsFilePaths = $.aos.preImports;
		for (var r = 0; r < jsFilePaths.length; r++) {
			var jsFilePath = jsFilePaths[r];
			var jsFilePathType = jsFilePath.substring(jsFilePath.lastIndexOf('.') + 1, jsFilePath.length);
			// 如果没有导入则导入
			if (jsFilePathType == 'js') {
				var request = $.ajax({
					url : $.aos.ajsRoot + jsFilePath,
					dataType : "script",
					async : false
				});
				request.done(function(data) {
					var js = document.createElement("script");
					js.type = "text/javascript";
					js.text = data;
					var head = document.getElementsByTagName('head')[0];
					head.appendChild(js);
					def.onImport(jsFilePath, data);
				});
			}

			if (jsFilePathType == 'css') {
				var fileref = document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", jsFilePath);
				document.getElementsByTagName("head")[0].appendChild(fileref);
				def.onImport(jsFilePath, '');
			}
		}
		def.finish();
	};
	
	
	//default load
	$.aos.require("js/ajs/utils/tree/zTreeStyle.css");
	$.aos.require("css/smoothness/jquery-ui-1.8.16.custom.css");
	$.aos.require("js/ajs/jquery/jquery-ui-1.8.16.custom.min.js");
	$.aos.require("js/ajs/lang/underscore-min.js");
	$.aos.require("js/ajs/utils/coding/base64.js");
	$.aos.require("js/ajs/ajax/ajax.js");
	$.aos.require("js/ajs/utils/entities/json2.js");
	$.aos.require("js/ajs/utils/entities/cycle.js");
	$.aos.require("js/ajs/utils/entities/xml.js");
	$.aos.require("js/ajs/utils/sorter/sorter.js");
	$.aos.require("js/ajs/webOS/DMC.js");
	$.aos.require("js/ajs/webOS/AsynDMC.js");
	$.aos.require("js/ajs/utils/common/superget.js");
	$.aos.require("js/ajs/webOS/oldFileSystem.js");
	$.aos.require("js/ajs/webOS/fileSystem.js");
	$.aos.require("js/ajs/webOS/sessions.js");
	$.aos.require("js/ajs/webOS/kernel.js");
	$.aos.require("js/ajs/webOS/app.js");
	$.aos.require("js/ajs/webOS/users.js");
	$.aos.require("js/ajs/webOS/registry.js");
	$.aos.require("js/ajs/webOS/userFramework.js");
	//$.aos.require("js/ajs/utils/sdb/sdb.js");
	$.aos.require("js/ajs/utils/log/log-utils.js");
	$.aos.require("js/ajs/webOS/webOS.js");
	
	
	
})(jQuery);
