/**
 *  文件: app.js
 *  描述：
 		author:shaheng
 		date:2014.3.7
 		Dependency : ajs/webOS/DMC.js
 */

(function($){
			var App = DMC.create("com.ambimmort.webos.dmcClient.app.App");
			function application(){
				this.App = App;
			}

			application.prototype.getExeById = function(appkey,username){
				return JSON.parse(App.getExeById(appkey,username));
			};
			
			application.prototype.getAppsByRole = function(groupname){
				return JSON.parse(App.getAppsByRole(groupname));
			};

			application.prototype.getAppsByRoles = function(groups){
				return JSON.parse(App.getAppsByRoles(groups));
			};
			
			application.prototype.getAppById = function(id){
				return JSON.parse(App.getAppById(id));
			};

			application.prototype.getAllApp = function(){
				return JSON.parse(App.getAllApp());
			};

			application.prototype.addApp = function(name,url,profile){
				return App.addApp(name,url,profile);
			};
						
			application.prototype.updateApp = function(id,name,profile,url){
				return JSON.parse(App.updateApp(id,name,profile,url));
			};
				
			application.prototype.deleteApp = function(id){
				return JSON.parse(App.deleteApp(id));
			};
								
			$.aos.app = new application();
})(jQuery);



