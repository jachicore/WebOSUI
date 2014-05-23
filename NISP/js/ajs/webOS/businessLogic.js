//==============桌面初始化时调用外部DMC代码=================
			
		if (typeof $.aos.nisp == 'undefined') {	
			$.aos.nisp = {};
		
			var __loadCodes = $.aos.fs.ls("/app/defaultDMCLoad");
			for(var k=0,len=__loadCodes.length; k<len; k++){
					eval($.aos.fs.read(__loadCodes[k].path));
			}
		}
			
//====================================================
				
