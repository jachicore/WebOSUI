/*
*应用程序中心
*author: c1avie
*version: 2.0
*/

$(function() {
    var tempapps = parent.$.aos.app.getAllApp();
    var apps=[];
    for(var i = 0;i<tempapps.length;i++){
        if (tempapps[i].isInnerApp=="1") {
                continue;
        }
        apps.push(tempapps[i]);
    }
    for(var i=0;i<apps.length;i++) {
        var data_id = apps[i].appid,
            data_img = apps[i].image,
            data_url = apps[i].installUrl,
            data_name = apps[i].name;
            data_type = apps[i].isInnerApp;

        var profile = apps[i].profile;
        var profile_funcs = JSON.parse(profile).funcs;
        var dt_list = '<dt><input name="namecheckbox" class="app-center-list" type="checkbox" class="namecheckbox" data-type = "'+data_type+'" '+'data-profile="'+profile+'" data-id="' + data_id + '"value="' + data_name + '"><span data-url="' + data_url + '"data-name="'+ data_name +'">' + data_name + '</span></dt>';
        var dd_list = '<dd><ul class="list-group">';
        for(var j=0;j<profile_funcs.length;j++) {
            if(profile_funcs[j].id == '1000') continue;
            dd_list += '<li class="list-group-item">' + profile_funcs[j].name + '</li>';
        }
        dd_list += '</ul></dd>';
        $('.app-list dl').append(dt_list);
        $('.app-list dl').append(dd_list);
        $($('.app-center-list')[i]).attr("data-profile",profile);
    }

    var app_title = $('.app-list dt span');
    var app_title_img = $('.app-list dt span img');
	$(".app-list dd").hide();
    app_title.live('click',function() {
        var name = $(this).attr('data-name');
        var url = $(this).attr('data-url');
        var profile = $(this).parent().find('input[type="checkbox"]').attr('data-profile');
        //console.log(profile);
        profile = JSON.parse(profile);
        var height = profile.winSettings.height;
        var width = profile.winSettings.width;
        $('.app-add').css("display","block");
        $('.app-add h4').html("修改应用");
        $('#exampleInputUrl').val(url);
        $('#exampleInputName').val(name);
        $('#exampleInputHeight').val(height);
        $('#exampleInputWidth').val(width);
        $('#add-value').css("display","none");
        $('#change-value').css("display","block");
        $('.whcenter').css("display","block");
        // $("dd:visible").slideUp("slow");
        $(this).parent().parent().find('input[type="checkbox"]').attr("checked",false);
        $(this).parent().find('input[type="checkbox"]').attr("checked",true);
        // $(this).parent().next().slideDown("slow");
        $(this).parent().next().toggle();
        var img = $(this).find('img');
        var img_src = $(this).find('img').attr("src");
        return false;
    });
    //切换到增加应用
    $('#btn-add').click(function() {
        $('#exampleInputUrl').val("");
        $('#exampleInputName').val("");
        $('.app-add').css("display","block");
        $('.app-add h4').html("增加应用");
        $('#addapp-title').css("display","block");
        $('#change-value').css("display","none");
        $('#add-value').css("display","block");
        $('.whcenter').css("display","none");
    });
    var update_url,update_id,update_name;
    function updateBack(data) {
        parent.$.aos.app.updateApp(update_id,update_name,update_url,data);
    }
    //更新应用
    $('#btn-update').click(function() {
        var flag = false;
        $('input[name="namecheckbox"]:checked').each(function() {
            flag = true;
            update_url = $(this).next().data('url');
            update_id = $(this).data('id');
            update_name = $(this).next().data('name');
            $.ajax({
                type: "get",
                async: false,
                contentType: "application/json",
                url: update_url,
                dataType: 'jsonp',
                jsonp: "callbackparam",
                jsonpCallback:"success_jsonpCallback",
                success: function(data) {
                    var data = JSON.stringify(data);
                    updateBack(data);
                    alert("更新成功");
                    window.location.reload(); 
                },
                error: function() {
                    alert("更新失败");
                }
            }); 
        });
        if(!flag) alert("请选择应用程序");
    });
    //取消
    $('#cancel-data').click(function() {
        $('#exampleInputUrl').val("");
        $('#exampleInputName').val("");
    });
    //切换到删除应用
    $('#btn-delete').click(function() {
        var flag = false;
        $('input[name="namecheckbox"]:checked').each(function() {
            flag = true;
            var type = $(this).data('type');
            //alert(type);
            if (type =='1') {
                alert($(this).next().data('name') + '不能删除');
            }
            else{
                var data_id = $(this).data('id');
                alert("删除成功!");
                parent.$.aos.app.deleteApp(data_id);
                window.location.reload(); 
            }

        });
        if(!flag) alert("请选择应用程序");
    });
    var name,url;
    function getBack(data){
        parent.$.aos.app.addApp(name,url,data);
    }
    //增加应用-服务器
    $('#add-data').click(function() {
        var reg = /[']+/;
        name = $('#exampleInputName').val();
        url= $('#exampleInputUrl').val();
        if(name == "" || url == "") {
            alert("Url或名称为空!");
            return;
        }
        if (reg.test(name)||reg.test(url)) {
            alert("Url或名有特殊符号!");
            return;
        }
        //var data;
        $.ajax({
            type: "get",
            async: false,
            contentType: "application/json",
            url: url,
            dataType: 'jsonp',
            jsonp: "callbackparam",
            jsonpCallback:"success_jsonpCallback",
            success: function(data) {
                var data = JSON.stringify(data);
                getBack(data);
                alert("添加成功");
                window.location.reload(); 
            },
            error: function() {
                alert("添加失败");
            }
        }); 
    });
    //修改应用
    $('#change-data').click(function() {
        var change_name = $('#exampleInputName').val();
        var change_url = $('#exampleInputUrl').val();
        var change_height = $('#exampleInputHeight').val();
        var change_width = $('#exampleInputWidth').val();
        var reg = /^[0-9]*$/;
        if((!reg.test(change_height)) || (!reg.test(change_width))) {
            alert("输入的长度或宽度为非数字!");
            return;
        }
        reg = /[']+/;
        if (reg.test(change_name)||reg.test(change_url)) {
            alert("Url或名有特殊符号!");
            return;
        }
        if(change_name == "") {
            alert("名称为空!");
            return;
        }
        var change_id = $('input[name="namecheckbox"]:checked').attr("data-id");
        var change_profile = $('input[name="namecheckbox"]:checked').attr("data-profile");
        var profile = JSON.parse(change_profile);
        var winSettings = profile.winSettings;
        winSettings.width= parseInt(change_width);
        winSettings.height= parseInt(change_height);
        
        profile.winSettings = winSettings;
        parent.$.aos.app.updateApp(change_id,change_name,change_url,JSON.stringify(profile));
        alert("修改成功");
        window.location.reload(); 
    });
});