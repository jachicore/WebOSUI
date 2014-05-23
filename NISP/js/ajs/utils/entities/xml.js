
function XML(xmlString){
    if (window.DOMParser)
    {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(xmlString,"text/xml");
//        this.document = xmlDoc;
         return xmlDoc;
    }
    else // Internet Explorer
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(xmlString);
        return xmlDoc;
//        this.document = xmlDoc;
    }
   
}


