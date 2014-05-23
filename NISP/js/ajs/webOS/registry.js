/**
 *  文件: registry.js
 	author:shaheng
 	date:2014-3-3
 *  描述：
 		Dependency : ajs/webOS/DMC.js
 */

(function($){
			var registry = DMC.create("com.ambimmort.webos.dmcClient.registry.Registry");
			function reg(){
				this.registry = registry;
			}
			reg.prototype.getValue = function(key){
				return registry.getValue(key);
			};
			reg.prototype.addRegistry = function(key,value){
				return registry.addRegistry(key,value);
			};
			reg.prototype.updateValue = function(key,value){
				return registry.updateValue(key,value);
			};

			reg.prototype.delete = function(key){
				return registry.delete(key);
			};
			
			
			$.aos.reg = new reg();
})(jQuery);



