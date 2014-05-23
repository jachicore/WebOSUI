(function($){
	var memcacheObj = DMC.create("com.ambimmort.memcache.jsClient.MemcacheJSClient");
  function Memcache(){
  	this.memcacheObj = memcacheObj;
  }
  
  Memcache.prototype.put=function(namespace,table,key,value){
  	  memcacheObj.put(namespace,table,key,value);
  };
  
  Memcache.prototype.get=function(namespace,table,key){
  	return memcacheObj.get(namespace,table,key);
  };
  
  Memcache.prototype.remove=function(namespace,table,key){
  	return memcacheObj.remove(namespace,table,key);
  };
  
  Memcache.prototype.remove=function(namespace,table){
  	return memcacheObj.remove(namespace,table);
  };
  
  Memcache.prototype.remove=function(namespace){
  	return memcacheObj.remove(namespace);
  };
  
  $.aos.memory = new Memcache();
  
})(jQuery);
