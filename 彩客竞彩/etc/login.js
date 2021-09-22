/***以下为登录功能**/
var loginSuccessAction = "";//登录成功后执行的东西
var isHidden = false;
function CodeAndEncode(_key, _str) {
    var codedStr = "";
    for (i = 0; i < _str.length; i++) {
        var _strXOR = _str.charCodeAt(i) ^ _key.charCodeAt(i % _key.length);
        codedStr += String.fromCharCode(_strXOR);
    }
    return codedStr;
}
//加载顶部的登录信息 
function loadLogin() {
    var loginHtml = "<ul class='ul_fmcss'>"
        + "<li class='responsive'>"
        + "<label class='each_resone bgc logins_name'>用户名</label>"
        + "<div class='each-resfive input_s'><input id='auth_userId' name='auth_userId' type='text' value='' class='loginsdetail'/></div>"
        + "</li>"
        + "<li class='responsive'><div class='e' id='err_userid'></div></li>"
        + "<li class='responsive'>"
        + "<label class='each_resone bgc logins_name'>密&nbsp;&nbsp;码</label>"
        + "<div class='each-resfive input_s'><input id='auth_passwd' name='auth_passwd' type='password' value='' class='loginsdetail'/></div>"
        + "</li>"
        + "<li class='responsive'><div class='e' id='err_passpwd'></div></li>"
        + "<li><input type='submit' id='divLogin' onclick='MiniLogin()' class='redbtn' value='登录' /></div></li>"
        + "</ul>";
	$(".loginContent").html(loginHtml);
    $("#headlogintd").html("<div class='topmenu'><a href='javascript:' class='t_lout' onclick='loginHdl()'>登录</a><a href='/User/Register.aspx' class='t_register'>注册</a></div>");
	$("#headLogin").click(function(){ 
		showLoginPanel();
	});
	$("#headReg").click(function(){
		location.href='/User/Register.aspx';
	});
}

function loadValidate(phoneNum) {       
    var loginHtml = generateAuthHtm(phoneNum)
    $(".loginContent").html(loginHtml);
}

function generateAuthHtm(phoneNum) {
    if (phoneNum.length > 10) {
        phoneNum = phoneNum.substring(0, 3) + "*****" + phoneNum.substring(8, 11);
    }
    var authHtml = "<ul class='ul_fmcss'>"
    + "<li class='responsive'><div class='e' id='err_message'>登陆IP存在异常，请通过手机验证登陆。</div></li>"
    + "<li class='responsive' id='phone_lab'>"
    + "<label class='each_resone bgc logins_name'>已绑定手机号</label>"
    + "<div class='each-resfive input_s'><input id='phone_num' name='phone_num' type='text' value='" + phoneNum + "' class='loginsdetail' readonly='readonly' /></div>"
    + "</li>"
    + "<li class='responsive' id='auth_plane'>"
    + "<label class='each_resone bgc logins_name'>验证码</label>"
    + "<div class='each-resfive input_s'><input id='auth_message' name='auth_message' type='text' value='' class='loginsdetail'/></div>"
    + "<input id='validate_btn' type='button' value='发送验证码' class='validate_btn' onclick='sendAuthMsg()'/>" 
    + "</li>"
    + "<li><input type='submit' id='divLogin' onclick='AuthLogin()' class='redbtn' value='验证登录' /></div></li>"
    + "</ul>";
    return authHtml;
}

function sendAuthMsg() {
    $.get("/user/login.aspx?ajax=s&" + Math.random(), function (r) {
        if (r != "") {
            $("#err_message").html(r);
        }
        if (r.indexOf("已发送") > 0) {
            countSecond();
        }
    });
}

function AuthLogin() {
    var message = $("#auth_message").val()
    if (message == "") {
        $("#err_message").html("请输入验证码");
        return false;
    }
    $.ajax({
        type: "POST",
        cache: false,
        url: "../user/login.aspx?ajax=a&message=" + message + "&" + Math.random(),
        success: function (r) {
            var user = eval('(' + r + ')');
            if (user.errip != "0") {
                $("#err_message").html(user.errmsg);
                return false;
            }
            if (user != null && user != 'undefined') {
                if (user.userid) {
                    if (user.lock == "1") {
                        $(".loginContent").html("为了账户资金信息安全，您的彩客账户已被锁定！");
                        return;
                    }
                    UserInfo(user);
                    closeLogin();
                }
                else {
                    loadValidate();
                }
            }
        },
        error: function (r) {
            loadValidate();
        }
    });
}

//倒计时
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
function countSecond() {
    curCount = count;
    $("#validate_btn").attr("disabled", "true");
    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
}

function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#validate_btn").removeAttr("disabled");//启用按钮
        $("#validate_btn").val("重新发送验证码");
    }
    else {
        curCount--;
        $("#validate_btn").val("再次发送需等待" + curCount + "秒");
    }
}

function loginHdl() {
    $('#Filter_Panel').slideUp('fast');
    if ($('#Login_Panel').is(':hidden')) showLogin();
    else closeLogin();
    return false;
}
//打开登录窗口
function showLoginPanel(){
	$('#Filter_Panel').slideUp('fast');
    if ($('#Login_Panel').is(':hidden')) showLogin();
    else closeLogin();
    return false;
}

function showLoginValidate() {
    loadLogin();
    $('#err_passpwd').append('登陆IP存在异常，请通过手机验证登陆。');
    $('#auth_plane').append('<label class="each_resone bgc logins_name">手机验证</label><div class="each-resfive input_s"><input id="auth_message" name="auth_message" type="text" value="" class="loginsdetail"/></div>');
    $('#auth_getmess').append('<span class="validate_btn">获取验证码</span>');
}

function RefreshUser() {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../user/login.aspx?ajax=c&" + Math.random(),
        success: function(r) {
            var user = eval('(' + r + ')');
            if (user != null && user != 'undefined') {
                if (user.userid) {
                    if (user.lock == "1") {
                        $(".loginContent").html("为了账户资金信息安全，您的彩客账户已被锁定！");
                        return;
                    }
                    UserInfo(user);
                    showLoginPanel();
                }
                else {
                    loadLogin();
                }
            }
        },
        error: function(r) {
            loadLogin();
        },
        complete: function(XHR, TS) { XHR = null; }
    });
}
function MiniLogin() {
    var uname = $("#auth_userId").val();
    var upwd = $("#auth_passwd").val();
    var key = new String(Math.random());
    upwd = CodeAndEncode(key, upwd);
	$("#err_userid").html("");
	$("#err_passpwd").html("");
    if (uname == "") {
		$("#err_userid").text("请输入用户名！");
        return false;
    }
    if(upwd == ""){
        $("#err_passpwd").text("请输入密码！");
        return false;
    }
	$("#divLogin").hide();
    $.ajax({
        type: "POST",
        cache: false,
        url: "../user/login.aspx?ajax=1&" + Math.random(),
        data: "u=" + escape(uname) + "&p=" + escape(upwd) + "&k=" + key + "}",
        success: function(r) {
            var user = eval('(' + r + ')');
            if (user != null && user != 'undefined') {
                if (user.userid) {
                    if (user.lock == "1") {
                        $(".loginContent").html("为了账户资金信息安全，您的彩客账户已被锁定！");
                        return false;
                    }
                    if (user.errip == "1") {
                        loadValidate(user.phonenum);
                        return false;
                    }
                    if (user.errip == "2") {
                        alert("您的账户登录IP异常！");
                    }
                    UserInfo(user);
                    //showLoginPanel();
                    closeLogin();
                }
                else {
                     if(user.errmsg.indexOf("密码") != -1)
                         $("#err_passpwd").text(user.errmsg);
                     else
					     $("#err_userid").text(user.errmsg);
                }
				$("#divLogin").show();
                return false;
            }
			$("#divLogin").show();
        },
        error: function(r) {
			$("#err_userid").html("发生未知异常:" + r);
			$("#divLogin").show();
            return false;
        },
        complete: function(XHR, TS) { XHR = null; }
    });
    return false;
}
function showLogin(){
	showLogin("");
}
function showLogin(theSuccessAction) {
	loginSuccessAction = theSuccessAction;
    if ($(".loginContent").html().indexOf("加载中..") != -1 || $(".loginContent").html().indexOf("退出") != -1) loadLogin();
    var overlayID = "_t_overlay";
    if (!byID(overlayID)) $('body').append('<div class="overlay" id="' + overlayID + '"></div>');
    $('.overlay').css({ 'height': window.screen.height, 'left': '0px', 'top': '0px', 'width': '100%', 'display': 'block', 'position': 'absolute','z-index':'1000' }).show();
    $('#Login_Panel').slideDown('fast');
}
function closeLogin() {
    $('.overlay').hide();
    $('#Login_Panel').slideUp('fast');
}
function UserInfo(user) {
    var name = decodeURI(user.username);
    $(".loginContent").html("<a href=\"../User/MyAccount.aspx?s=1\" data-rel=\"dialog\" data-transition=\"pop\">" + name + "</a> "
		+ "余额：<span style=\"color:Red\">￥" + user.money + "</span> <a onclick='showLogoutTips()' style=\"color:Red;cursor:pointer;display:"+(isHidden ?"none":"")+"\">退出</a>");
    $("#headlogintd").html("<div class='topmenu'><a onclick='showLogoutTips()' class='t_lout2' id='u_btn_1' style='display:" + (isHidden ? "none" : "") + "'>退出</a><label style='color:red; margin-right:10px;font-size:18px;'>" + name + "</label></div>");
    refreshPage(unescape(user.page));
	if (user.PayPwd && user.PayPwd == "1")
		$("#divPayPwd").show();
	if(loginSuccessAction!=""){
		setTimeout(loginSuccessAction,1);
		loginSuccessAction="";
	}
}
function showLogoutTips()
{
    $('#dvLogoutTips').html("<table width='100%' style='BORDER-COLLAPSE: collapse' cellspacing='0' cellpadding='0' class='w_tips'><tr><td colspan='2' align='center'>是否确认退出账户登录？</td></tr><tr><td width='50%'><input type='button' class='long_btn redbg' onclick='logout();' value='确定' /></td><td><input type='button' class='long_btn yelbg md-close'  value='取消' /></td></tr></table>");
    ModalEffectsOpen('logoutTips');
}
function logout() {
	loadLogin();
    $.get("/user/login.aspx?ajax=o&" + Math.random(), function(data) {
        var user = eval('(' + data + ')');
        needPayPWD = false;
        refreshPage(unescape(user.page));
        closeModal();
    });
}
var _alfUrl = new Array("/Info/lottery.aspx", "/user/", "/pay/");
function refreshPage(pageURL) {
    for (var i = 0; i < _alfUrl.length; i++) {
        if (pageURL.toLocaleLowerCase().indexOf(_alfUrl[i].toLocaleLowerCase()) > 0) {
            if(_alfUrl[i]=="/user/" || _alfUrl[i]=="/pay/")
                location.href = "/";
            else
                location.href = pageURL;
        }
    }
}

/********其他页面需要立即加载的内容**********/
function byID(id) {
    return document.getElementById(id);
}
function byName(name) {
    return document.getElementsByName(name);
}
function GetCNum(bigNum, smallNum) {
    if (bigNum == 0) return 0;
    var num1 = 1, num2 = 1;
    for (var i = bigNum; i > (bigNum - smallNum); i--) num1 *= i;
    for (var i = 1; i <= smallNum; i++) num2 *= i;
    return num1 / num2;
}
//字符串转换成整型
String.prototype.toInt = function() {
    var rlt = 0
    try {
        rlt = parseInt(this);
        if (isNaN(rlt)) rlt = 0;
    } catch (e) { }
    return rlt;
}
//数组排序 升序
function sortArrayAsc(a, b) {
    if (isNaN(a[0])) return a[0].localeCompare(b[0]);
    else return a[0] - b[0];
}

/**本地存储**/
var hasStorage = window.localStorage;
var Storage = {
    Set: function(key, value) {
        if (hasStorage) localStorage.setItem(key, value);
        else writeCookie(key, value);
    },
    Get: function(key) {
        if (hasStorage) return localStorage.getItem(key);
        else return getCookie(key);
    }
};
//cookie操作
function getCookie(name) {
    var cname = name + "=";
    var dc = document.cookie;
    if (dc.length > 0) {
        begin = dc.indexOf(cname);
        if (begin != -1) {
            begin += cname.length;
            end = dc.indexOf(";", begin);
            if (end == -1) end = dc.length;
            return dc.substring(begin, end);
        }
    }
    return null;
}
function writeCookie(name, value) {
    var expire = "";
    var hours = 365;
    expire = new Date((new Date()).getTime() + hours * 3600000);
    expire = ";path=/;expires=" + expire.toGMTString();
    document.cookie = name + "=" + value + expire;
}

var tipsDiv_01 = "";
var tipsTO=0;
var tipsT;
function showTips(tips) {
    if (tipsDiv_01 == "") {
        tipsDiv_01 = '<div class="tipsClass" id="tipsDiv_">' + tips + '</div>';
        $('body').append(tipsDiv_01);
    }
    else {
        byID("tipsDiv_").innerHTML = tips;
    }
    $('div.tipsClass').css({
        'top': ($(window).height() / 2 + $(window).scrollTop()) + 'px',
        'left': ($(window).width() - 245) / 2 + "px",
        'border': '2px solid #E6D30A',
        'position': 'absolute',
        'padding': '5px',
        'background': '#FFF588',
        'font-size': '12px',
        'margin': '0 auto',
        'line-height': '25px',
        'z-index': '100',
        'text-align': 'center',
        'width': '250px',
        'color': '#6D270A',
        'opacity': '0.95'
    });
	$('div.tipsClass').click(function(){$(this).hide()});
    $('div.tipsClass').addClass("Fillet");
    $('div.tipsClass').show();
	tipsTO = 3;
	clearTimeout(tipsT);
	tipsT = setTimeout("HidTips()", 1000);
}
var confirmDiv_ = "";
function JQConfirm(msg, eventHdl) {
    if (confirmDiv_ == "") {
        confirmDiv_ = '<div class="confirmClass"><div id="confirmDiv_" style="padding:5px 0px 5px 0px">' + msg + '</div><div><input type=button value="确定" onclick="'+eventHdl.replace(/'/gi,"\"")+';hideConform();" class="btn001" /><input type=button value="取消" onclick="hideConform()" class="btn001" /></div></div>';
        $('body').append(confirmDiv_);
    }
    else {
        byID("confirmDiv_").innerHTML = msg;
    }
    $('div.confirmClass').css({
        'top': ($(window).height() / 2 + $(window).scrollTop()) + 'px',
        'left': ($(window).width() - 245) / 2 + "px",
        'border': '2px solid #528ADF',
        'position': 'absolute',
        'padding': '5px',
        'background': '#B0CAF0',
        'margin': '0 auto',
        'line-height': '25px',
        'z-index': '100',
        'text-align': 'center',
        'width': '250px',
        'color': '#6D270A',
        'opacity': '0.95'
    });
    $('div.confirmClass').addClass("Fillet");
    $('div.confirmClass').show();
}
function hideConform(){$('div.confirmClass').hide();}


function HidTips()
{
	if(tipsTO<=0)
	{
		$('div.tipsClass').fadeOut();
		tipsTO=0;
	}
	else
	{
		tipsTO--;
		tipsT = setTimeout("HidTips()", 1000);
	}
}

//下拉框 样式
var _dropFrameID = "_dropFrameID_";
var _dropFrameDiv = "";
function openDropByID(obj,theDivID){
	var willOpen = (obj.className == "dropDownClass");//将要打开
	var dropList = $(".dropDownClass_s");
	for (var i = 0; i < dropList.length; i++) {
        dropList[i].className = "dropDownClass";
    }
	if(willOpen){
		var curObj = $(obj);
		if (_dropFrameDiv == "") {
			_dropFrameDiv = '<div id="'+_dropFrameID+'"></div>';
			$('body').append(_dropFrameDiv);
		}
		$("#"+_dropFrameID+" div").each(function(index) {
			$(this).hide();
            $("body").append($(this));
        });
		$("#"+_dropFrameID).html("<span class='dropLine' style='width:"+(curObj.width()+10-2)+"px;float:left;margin-left:"+(curObj.offset().left+1)+"px;'></span>");
		$("#"+_dropFrameID).append($("#"+theDivID));
		$("#"+theDivID).show();
		$("#"+_dropFrameID).css("top",(curObj.offset().top + curObj.height() - 1)+"px");
		$("#"+_dropFrameID).slideDown('fast');
		curObj.css("z-index","100");
		obj.className = "dropDownClass_s";
	}
	else{
		$("#"+_dropFrameID).slideUp('fast');
	}
}

var myUserAgent = (navigator.userAgent.toLocaleLowerCase());
if(myUserAgent.indexOf("trident") != -1){
	$("head").append("<style>.ul_fmcss li{margin-bottom:10px;}"
+".main_log{margin:0 8px;}"
+".ul_fmcss{list-style-type: none;}"
+".ul_fmcss li{display: list-item;width:100%;}"
+".responsive{float:left;}"
+".responsive .bgc{float:left;width:30%;border: 1px solid #E0D0C7;border-right:0;}"
+".responsive .input_s{float:left;width:59%;border: 1px solid #E0D0C7;border-left:0;}"
+".logins_name{color:#fff;font-size:16px;}"
+".logins_name{color:#fff;font-size:16px;padding:0 0 0 15px;}"
+".each_resone{-moz-box-flex:1;-webkit-box-flex:1;box-flex:1;display:block;width:15px;}"
+".each-resfive{-moz-box-flex:2;-webkit-box-flex:2;box-flex:2;display:block;width:90px;}"
+".input_s{padding-right:10px;border-radius:0;position:relative;}"
+".input_s span{padding:0 8px;}"
+".input_ss{padding-right:10px;border:solid #c4c4c3;border-width:0px 0px 0px 0;border-radius:0;position:relative;}"
+".input_ss input{padding:0 8px;}"
+".loginsdetail::-webkit-input-placeholder{color:#cfcfcf;}"
+".loginsdetail::-moz-placeholder{color:#cfcfcf;}"
+".loginsdetail{height:37px;line-height:normal;width:100%;-webkit-appearance:none;border:0;padding-left:10px;background-color:#FFFFFF;font-size:16px;}"
+".bgc{color: #333;font-weight: bold;width: 60px;background-color: #F9EAE3;}"
+".e{padding-left:12px;color:#f00;}</style>");
}else{
	$("head").append("<style>.ul_fmcss li{margin-bottom:10px;position:relative;}"
+".main_log{margin:0 8px;}"
+".responsive{display:-moz-box;display:-webkit-box;display:box;-moz-box-orient:horizontal;-webkit-box-orient:horizontal;box-orient:horizontal;width:100%;}"
+".logins_name{color:#fff;font-size:16px;}"
+".logins_name{height:42px;line-height:42px;color:#fff;font-size:16px;padding:0 0 0 15px;}"
+".each_resone{-moz-box-flex:1;-webkit-box-flex:1;box-flex:1;display:block;width:15px;}"
+".each-resfive{-moz-box-flex:2;-webkit-box-flex:2;box-flex:2;display:block;width:90px;}"
+".input_s{padding-right:36px;border:solid #c4c4c3;border-width:1px 1px 1px 0;border-radius:0;position:relative;}"
+".input_s span{padding:0 8px;}"
+".input_ss{padding-right:36px;border:solid #c4c4c3;border-width:0px 0px 0px 0;border-radius:0;position:relative;}"
+".input_ss input{padding:0 8px;}"
+".ul_fmcss .input_s{padding-right:36px;border:solid #c4c4c3;border-width:1px 1px 1px 0;border-radius:0;position:relative;}"
+".loginsdetail{height:38px;line-height:normal;width:100%;-webkit-appearance:none;border:0;padding-left:10px;}"
+".loginsdetail::-webkit-input-placeholder{color:#cfcfcf;}"
+".loginsdetail::-moz-placeholder{color:#cfcfcf;}"
+".loginsdetail{height:38px;line-height:normal;width:100%;-webkit-appearance:none;border:0;padding-left:10px;background-color:#FFFFFF;font-size:16px;}"
+".bgc{color: #333;font-weight: bold;width: 60px;background-color: #F9EAE3;border: 1px solid #E0D0C7;}"
+ ".validate_btn{display:block;background-color:#EEE;border:1px solid #ABADB3;font-weight:bold;width:165px;cursor:pointer;font-size:16px;line-height:42px;text-align:center;}"
+ ".e{padding-left:12px;color:#f00;}</style>");
}