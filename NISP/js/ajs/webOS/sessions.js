(function($){
	var SessionObj = DMC.create("com.ambimmort.webos.commons.dmc.SessionJS");
  function Session(){
  	this.sessionObj = SessionObj;
  }
  
  Session.prototype.setAttribute=function(key,value){
  	this.sessionObj.setAttribute(key,value);
  };
  
  Session.prototype.getAttribute=function(key){
  	return this.sessionObj.getAttribute(key);
  };
  
  $.aos.session = new Session();
  
})(jQuery);
