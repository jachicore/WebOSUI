$(function() {

	var tools = top.$.tools;
	// var $ = {};
	$.aos = tools.isUndefined($.aos) ? top.$.aos : $.aos;
	$.win = tools.isUndefined($.win) ? top.$.win : $.win;
	$.desktop = tools.isUndefined($.desktop) ? top.$.desktop : $.desktop;
	$.tools = tools.isUndefined($.tools) ? top.$.tools : $.tools;
	$.util = tools.isUndefined($.util) ? top.$.util : $.util;

	var path = "/tmp/commands";
	var type = 0;// 0表示未保存文件，1表示已保存文件
	var fileList = top.$.aos.fs.ls(path);
	path = path + "/";

	// var slectvalue_tmp = "";
	var cont = "";
	for (i in fileList) {
		cont += " <option value='" + fileList[i].name + "'>" + fileList[i].name
				+ "</option>";
	}
	$cont = $(cont);
	$cont.appendTo($("#selectList"));

	$("#selectList").change(function() {
		type = 1;
		var shContent = top.$.aos.fs.read(path + $(this).get(0).value);
		var textareaText = $("#_terminal").text() + shContent;
		$("#_terminal").text(textareaText);

		// slectvalue_tmp = $("#selectList").get(0).value;
	});

	$("#execute").click(function() {
		var content = $("#_terminal").val();
		eval(content);
	});
	$("#terminalNewPage").click(function() {
		if ($("#_terminal").val() != "") {
			if (window.confirm('你确定要清除此文件内容并创建新文件')) {
				$("#_terminal").val("");
				type = 0;
			} else {

			}
		}
		window.location = "index.html";
	});

	$("#terminalsave").click(function() {
		saveTerminal(type);
	});

	$("#clearTerminal").click(function() {
		$("#_terminal").val("");
	});

	function saveTerminal(type) {

		var terminalTontent = $("#_terminal").val();
		if (type == 1) {
			var fileName = $("#selectList").get(0).value;
			var path1 = path + fileName;
			top.$.aos.fs.write(path1, terminalTontent);
		} else {
			if (terminalTontent == '') {
				alert("请输入文本内容");
			} else {
				var terminalName = window.prompt("请输入文件名", "");
				if (terminalName == "") {
					alert("文件名不能为空")

				} else if (terminalName == null) {
				} else {
					if (top.$.aos.fs.exists(path + terminalName) == 'true') {
						alert(terminalName + "文件已存在");
					} else {
						top.$.aos.fs.create(path + terminalName + ".sh");
						top.$.aos.fs.write(path + terminalName + ".sh",
								terminalTontent);
					}
				}
			}
		}
	}

});
