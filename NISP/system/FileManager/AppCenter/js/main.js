/*
*应用程序中心
*author: c1avie
*version: 2.0
*/

$(function() {
	$("dd:not(:first)").hide();
    $("dt a").click(function(){
        $("dd:visible").slideUp("slow");
        $(this).parent().next().slideDown("slow");
        return false;
    });

    var ul_li = $('.aside dl ul a'),
        layout = $('.layout');
    $('.layout:not(:first-child)').hide();
    ul_li.click(function() {
        layout.hide();
        var li_index = ul_li.index(this) + 1;
        $('#layout' + li_index).show();
        return false;
    });

});