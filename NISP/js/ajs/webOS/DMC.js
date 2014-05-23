
/**
 *  Title: DMC - Direct Method Call
 *  Author: 何定巍
 *  Version: 0.1
 *  Last Updated: 2012/1/23
 *  Description:
 *      DMC（直接方法调用），旨在为前端直接使用后台方法创建一个简单的JavaScript框架。
 *  使用DMC有如下好处：
 *      1. DMC能智能的创建远程对象，能够是JS程序员像调用Java方法一样执行后台服务
 *         例子： 
 *         假设我们有这样一个Java类：
 *         //Java类
 *         package Test;
 *         public class Hello{
 *             public void sayHello(String name){
 *              return "hello "+ name;
 *             }
 *         }
 *         //--------end----------
 *         那么我们可以像这样使用DMC JS框架:
 *         var helloObject = DMC.create("Test.Hello"); //创建一个Test.Hello对象
 *         var rst = helloObject.sayHello("hedingwei");//直接调用远程的sayHello方法
 *         console.log(rst); //终端上会打印出："hello hedingwei"
 *         //-----------------------
 *         实现DMC框架有意思的地方就在于它会自动的根据后台所提供的Java类创建JS对象。
 *         
 *       2. DMC通过http的数据部分传值而非头部分，因此不会收到请求头大小溢出的异常。
 *       3. 对于前端程序员开发时，DMC还可以方便的被继续封装。尽管使用DMC仅需要2句代码
 *         
 */

DMCConfig = {
	"host":"localhost",
	"port":8999
}

/**
 * DMC 构造函数
 */
function DMC(){}

//var classDefinition ={
//    "className":"Hello",
//    "methods":{
//        "sayHello":{
//            "returnType":"java.lang.String",
//            "parameterType":["java.lang.String"]
//        }
//    }
//}

//aasdmc = function(className,method){
//        var methodData = JSON.stringify(method);
//        var returnData = {};
//        var nc = new Ajax("POST", "DMCService?name="+className,methodData,false,function(data){
//            if(data==null){
//                
//            }else{
//                returnData = JSON.parse(data);
//            }
//        });
//        nc.call();
//        return returnData;
//    };

/**
 * 用于动态创建的DMCObject，它会根据传入的类模版动态生成JS对象。
 */
function DMCObject(classObject,className){
    this.classObject = classObject;
    this.className = className;
    var tmpObject = {};
    
    tmpObject['call'] =function(className,method,methodName,methodData){
        method['values']= Base64.encode(JSON.stringify(methodData));
        method['name']=methodName;
        var tmpData = JSON.stringify(method);
        
        var returnData = {};
        var nc = new Ajax("POST", "/DMC/DMCService?name="+className+"&methodName="+methodName,tmpData,false,function(data){
            if(data==null){
                        
            }else{
                  returnData=data;
            }
        });
        nc.call();
        return returnData;
    };
    
    tmpObject['classObject'] = this.classObject;
    for(var m in classObject){
    
    	  
    	  if(typeof classObject[m] =="function") continue;
        var pts = classObject[m].parameterType;
        var ps = [];
        for(var i=0;i<pts.length;i++){
            ps[i] = 'x'+i;
        }
        var f = new Function(ps,"var args = Array.prototype.slice.call(arguments);return this.call('"+className+"',this.classObject['"+m+"'],'"+m+"',args);");
        tmpObject[m+""]=f;
    }
    return tmpObject;
}

//var classCache = {
//    "Hello":
//    {
//        "sayHello":{
//            "returnType":"java.lang.String",
//            "parameterType":["java.lang.String"]
//        }
//    }
//}
var classCache ={}
DMC.prototype = {
    load:function(className){
        var nc = new Ajax("POST", "/DMC/ClassService?name="+className,"",false,this.fx);
        nc.call();
    },
    fx:function(data){
        data = JSON.parse(data);
        classCache[data.className+""]=data.methods;
    },
    create:function(className){
        if(className in classCache){
            
        }else{
            this.load(className);
        }
        if(className in classCache){
            return new DMCObject(classCache[className+""],className);
        }else{
            console.log("class "+className+" not found");
            return {};
        }
    }
};

   var DMC = new DMC();
