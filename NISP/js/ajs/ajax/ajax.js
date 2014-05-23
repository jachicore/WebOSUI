/**
 *  作者： 何定巍
 *  版本：1.0
 *  最后修改时间：2012年1月22日
 *  描述：
 *  Ajax类是最底层的Ajax实现。
 *  例子：
 *  var ajax = new Ajax("POST","TestService","some data text", false, function(data){console.log(data);});
 *  ajax.call();
 *  在上面的例子中，第一个参数是请求所使用的方式有"POST"和"GET"两种
 *  第二个参数是响应请求的url，通常是一个servlet或php,也可以是asp
 *  第三个参数比较特别，它可以是一段任意的字符串数据，该部分数据与一般http请求的url中的“参数”不一样，
 *  它在http的body部分而不是头部分，因此，当要传输相对较大的数据到服务器的时候可以规避头溢出异常。
 *  第四个参数描述了是异步还是同步，false代表同步，true代表一步
 *  第五个参数是请求成功的回调函数
 *  
 *        
 */


function Ajax(method,url,data,syn,callback){
    this.url = url;
    this.data = data;
    this.syn = syn;
    this.callback = callback;
    this.method = method;
    return this;
}

Ajax.prototype = {
    
    call:function(){
        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        me = this;
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                me.callback(xmlhttp.responseText);
            } else{
//                me.error(xmlhttp.responseText);
            }
        }
        xmlhttp.open(this.method,this.url,this.syn);
        xmlhttp.send(this.data);
    },
    callback:function(data){},
    error:function(data){}
}
