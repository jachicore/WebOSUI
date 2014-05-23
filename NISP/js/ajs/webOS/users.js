(function($){

	$.aos.users = {};
	
	$.aos.users.registry = {};
	
	// current session user
	$.aos.users.current = {};
	$.aos.users.currentUser = {};
	$.aos.users.roles = {};

	$.aos.users.getUserLists=function(applicationTypes){
			var ulist = [];
			for(user in $.aos.users.registry){
				var uo = $.aos.users.registry[user];
				var flag = true;
				for(var i=0;i<uo.roles.length;i++){
					if(applicationTypes.indexOf(uo.roles[i])==-1){
						flag = false;
						break;
					}
				}
				if(flag==false) continue;
				else{
					ulist[ulist.length]=uo;
				}
			}
			return ulist;
		};
	
	$.aos.users.isApplicationAccessable=function(applicationType){};
	
	// init user registry table start
	// var userList =JSON.parse($.aos.fs.read("/etc/user.ini"));
	// $.aos.users.registry = userList;
	// init user registry table end
	
	$.aos.users.createLoginForm = function(){
		var contents = '';
		contents += "<div class='loginForm'>";
		contents += "	<div class='block' style='padding-left:72px;'><img src='images/blue/login/icon-login01.jpg' align='absbottom' /><h4>用户登录</h4><h6>login</h6></div>";
		contents += "	<div class='block' style='padding-left:8px;'><img src='images/blue/login/login-line.jpg' /></div>";
		contents += "	<div class='block'><span>用户名：</span><input id='_username' type='text' /></div>";
		contents += "	<div class='block'><span>密  码：</span><input id='_password' type='password' /></div>";
		contents += "	<div class='block'><a href='#'>登&nbsp;录</a></p>";
		contents += "</div>";
		
		var form = $(contents);
		
		var l = $.aos.lightbox.create({width: 343, height: 234, closable: false}).loadContents(form);
		
		form.find("a").click(function(){
			var username = $('#_username').val();
			var password = $('#_password').val();
			if($.aos.users.login(username, password)){
					l.del();
					$('.person').html(username);
					$.aos.log.info(username + "用户登陆系统！");
					$.aos.desktop.init();
			}else{
				//alert('用户名或密码不正确，请重新输入');
				$('#_password').val('');
			}
		});
		

		
		$('.loginForm').keydown(function(event) {
			  var username = $('#_username').val();
			  var password = $('#_password').val();
			  if(event.keyCode == '13'){
				    if($.aos.users.login(username, password)){
							l.del();
							$('.person').html(username);
							$.aos.log.info(username + "用户登陆系统！");
							$.aos.desktop.init();

					}else{
						//alert('用户名或密码不正确，请重新输入');
						$('#_password').val('');
					}
			   }
		});
		
	};
	
	
	$.aos.users.login = function(username, password){

		var str = $.aos.users.um.login(username,password);
		if(str == 'true'){
				$.aos.users.current = username;
				$.aos.session.setAttribute("username",username);
				var roles = $.aos.users.um.getUserRoles(username);
				$.aos.users.roles = roles;
				// $.aos.users.currentUser = $.aos.users.um.getUserProfile(username);
				// $.aos.session.setAttribute("gndesktop.currentUser",username);
				
				return true;
		}else if(str == 'false'){
			alert("用户名或密码错误！");
			return false;
		}else{
			alert(str);
			return false;	
		}
	};
})(jQuery);
