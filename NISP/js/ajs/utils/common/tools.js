/**
 *  文件: Tools.js
 *  描述：
 		Dependency : 普通方法工具类
 */
(function($){
		   
			function Tools(){
			}
			
			Tools.prototype.isUndefined = function(str){
				return typeof(str) == 'undefined'?true:false;
			}
			
			Tools.prototype.isNull = function(str){
				return str == null || str.value == "";
			}
			
			/**
			 * java String hashCode 的实现
			 * @param strKey
			 * @return intValue
			 */
			Tools.prototype.hashCode = function(strKey)
			{
				var hash = 0;
				if(!this.isNull(strKey))
				{
					for (var i = 0; i < strKey.length; i++)
					{
						hash = hash * 31 + strKey.charCodeAt(i);
						hash = this.intValue(hash);
					}
				}
				return hash;
			}
			
			/**
			 * 将js页面的number类型转换为java的int类型
			 * @param num
			 * @return intValue
			 */
			Tools.prototype.intValue = function(num)
			{
				var MAX_VALUE = 0x7fff;
				var MIN_VALUE = 0x0000;
				if(num > MAX_VALUE || num < MIN_VALUE)
				{
					return num &= 0xFFFF;
				}
				return num;
			}
			
			Tools.prototype.convertUTCToNormalDateTime = function(utc){
				var date = new Date(utc);
				var ndt;
				ndt = date.getUTCFullYear()+"/"+date.getUTCMonth()+"/"+date.getUTCDate()+" "+date.getUTCHours()+":"+date.getUTCMinutes()+":"+date.getUTCSeconds();
				return ndt;
			}
			
			// 去除字符串的首尾的空格
			Tools.prototype.trim = function(str){
			   return str.replace(/(^\s*)|(\s*$)/g, "");
			}
			
			// 判断输入是否是有效的电子邮件
			Tools.prototype.isEmail = function(str)
			{
				var result=/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
				return result.test(str)
			}
			
			
			// 判断输入是否是一个数字--(数字包含小数)--
			Tools.prototype.isNumber = function(str)
			{
				return !isNaN(str);
			}
			
			// 判断输入是否是一个整数
			Tools.prototype.isInt = function(str)
			{
				var result=/^(-|\+)?\d+$/;
				return result.test(str)
			}
						
			// 匹配由数字、26个英文字母或者下划线组成的字符串
			Tools.prototype.isLegalChar = function(str)
			{
				var result=/^\w+$/;
				return result.test(str)
			}
			
			// 匹配由数字、26个英文字母、中文或者下划线组成的字符串
			Tools.prototype.isLegalChar_ZN = function(str)
			{
				var result=/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				return result.test(str)
			}
			
			// 匹配URL
			Tools.prototype.isURL = function(str)
			{
				var result = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
				return result.test(str);
			}
			
			/** 
			* 过滤字符串,指定过滤内容，如果内容为空，则默认过滤 '~!@#$%^&*()-+." 
			* 
			* @return 包含过滤内容，返回True,否则返回false; 
			*/  
			Tools.prototype.isContainStr = function(str, filterString)
			{  
				filterString = filterString == "" ? "'~!@#$%^&*()-+.\"" : filterString; 
				console.log(filterString);
				var ch,i,temp,error = false;// 当包含非法字符时，返回True  
				for (i = 0; i <= (filterString.length - 1); i++) {  
					ch = filterString.charAt(i);  
					temp = str.indexOf(ch);  
					if (temp != -1) {  
						error = true;  
						break;  
					}  
				}  
				return error;  
			}
			
			
			$.tools = new Tools();

})(jQuery);



