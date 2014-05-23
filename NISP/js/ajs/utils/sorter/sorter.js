/**
 *  �ļ�: sorter.js
 *  ������
 		Dependency : NONE
 */

(function($){
	$.aos.utils = {};
	$.aos.utils.by= function(name){
    return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }
        else {
            throw ("error");
        }
    }
};
	$.aos.utils.sort = function(array,sorter){
		array.sort(sorter);
	}
	
/*	var files = $.aos.fs.ls("/");
	$.aos.utils.sort(files,$.aos.utils.by("type",$.aos.utils.by('name')));*/

})(jQuery);




