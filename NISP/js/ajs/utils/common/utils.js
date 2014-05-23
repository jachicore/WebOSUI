/**
 *  文件: Utils.js
 *  描述：
 		Dependency : 普通方法工具类
 */
(function($){
		   
			function Utils(){
			}
			
			// 从链接
			Utils.prototype.getURLParam = function(param)
			{
				var url = window.location;
				url = decodeURI(url);
				var query = url.substring(url.indexOf("?",url.length));
				var iLen = param.length;
				var iStart = query.indexOf(param);
				if (iStart == -1)
					return "";
				iStart += iLen + 1;
				var iEnd = query.indexOf("&", iStart);
				if (iEnd == -1)
					return query.substring(iStart);
				return query.substring(iStart, iEnd);
			}
			
			Utils.prototype.getImage = function(path){
				// console.log("aos://"+path);
				// console.log(Base64.encode("aos://"+path));
				var p = "/aas/resource/getImage?file="+encodeURIComponent(Base64.encode("aos://"+path));		
				//alert(p);
				return p
			};
			
			Utils.prototype.getFile = function(path){
				var p = "/aas/resource/getFile?file="+Base64.encode(encodeURIComponent("aos://"+path));
				window.location = p;
			};
		
			Utils.prototype.getFile_encode = function(path, encode){
				var p = "/aas/resource/getFile?file="+encodeURIComponent(Base64.encode("aos://"+path))+"&encode="+encode;
				window.location = p;
			};
			
			Utils.prototype.getAudioStream = function(path){
				var p = "/aas/resource/getAudioStream?file="+Base64.encode("aos://"+path);
				return p;
			};
			
			
			Utils.prototype.getImageIcon = function(path, width, height){
				var p = "/aas/resource/getImageIcon?file="+encodeURIComponent(Base64.encode("aos://"+path))+"&swidth="+width+"&sheight="+height;
				return p
			};
			
			Utils.prototype.getImagePreview = function(path){
				return this.getImageIcon(path, 200,125);
			};
			
			Utils.prototype.get = function(url,fun){
				var u = "/aas/resource/getURL?_type_toajax="+Base64.encode('json')+"&_url_toajax="+Base64.encode(url);
				$.get(u,fun,'json');
			};
			
			Utils.prototype.loadingStart = function(obj){
				
			};
			
			Utils.prototype.loadingEnd = function(obj){
				
			};
			
			
			
			$.util = new Utils();

})(jQuery);



