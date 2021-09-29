//需引用Jquery

//遮挡层Css参数
overlay_Css = {
    position: "fixed",
    top: 0,
    left: 0,
    "z-index": 9999,
    background: "#808080",
    opacity: 0.8,
    filter: "alpha(opacity = 80)",
    width: "100%",
    height: "100%"
};

//对话框Css
dlg_Css = {
    position: "fixed"
}

//浮动窗体Css
overdlg_Css = {
    position: "fixed",
    "background-color": "#fff"
}

CurDlg = null;
OverDlg = null;

//弹出自定义对话框
$.fn.OpenZdyDialog = function () {
    CurDlg = this;
    var dialoglOverlay = $("#dialogOverlay");
    if (dialoglOverlay == undefined || dialoglOverlay == null || dialoglOverlay.length == 0) {
        dialoglOverlay = $("<div id='dialogOverlay'></div>"); 
        for (var o in overlay_Css) {
            dialoglOverlay.css(o.toString(), overlay_Css[o].toString());
        }
        $("body").append(dialoglOverlay);
    }
    for (var o in dlg_Css)
    {
        $(this).css(o.toString(), dlg_Css[o].toString());
    }
    $(dialoglOverlay).css("display", "block");
    
    $(dialoglOverlay).click(function () {
        $(CurDlg).css("display", "none");
        $(this).css("display", "none");
    });
    var left = ($(window).width() - $(this).width()) / 2;
    var top = ($(window).height() - $(this).height()) / 2;
    if (left <= 0) left = 0;
    if (top <= 0) top = 0;
    $(this).css("left", left);
    $(this).css("top", top);
    $(this).css("z-index", (parseInt(overlay_Css["z-index"]) + 1).toString()); // 比遮挡层高
    $(this).css("display", "block");
}

//关闭自定义对话框
$.fn.CloseZdyDialog = function () {
    var dialoglOverlay = $("#dialogOverlay");
    $("#dialogOverlay").css("display", "none");
    $(this).css("display", "none");
}


//弹出自定义不含遮挡层的div
$.fn.OpenOverDialog = function () {
    if ($(this).css("display") == "block") return;
    OverDlg = this;
    //for (var o in overdlg_Css) {
    //    $(this).css(o.toString(), overdlg_Css[o].toString()); //对话框一些默认属性
    //}
    $(this).css("position", "fixed");
    var point = getMouseLocation();
    var left = point.x - 45;
    var top = point.y + 10;
    if (left <= 0) left = 0;
    if (top <= 0) top = 0;
    if (($(window).width() - ($(this).width() + left)) < 0) left = $(window).width() - $(this).width() - 10;
    if (($(window).height() - ($(this).height() + top)) < 0) top = $(window).height() - $(this).height() - 10;
    $(this).css("left", left);
    $(this).css("top", top);
    $(this).css("z-index", (parseInt(overlay_Css["z-index"]) + 1).toString()); // 比遮挡层高
    $(this).css("display", "block");
    $(this).mouseleave(function () {
        if ($(this).css("display") == "none") return;
        $(this).css("display", "none");
    });
}

//关闭自定义对话框
$.fn.CloseOverDialog = function () {
    $(this).css("display", "none");
}

function getEvent() //同时兼容ie和ff的写法
{
    if (document.all)
        return window.event;
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}
var __is_ff = (navigator.userAgent.indexOf("Firefox") != -1); //Firefox 
function getMouseLocation() {
    var e = getEvent();
    var mouseX = 0;
    var mouseY = 0;
    if (__is_ff) {
        //mouseX = e.layerX + document.body.scrollLeft;
        //mouseY = e.layerY + document.body.scrollLeft;
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    else {
        //mouseX = e.x + document.body.scrollLeft;
        //mouseY = e.y + document.body.scrollTop;
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    return { x: mouseX, y: mouseY };
}
var alertHTML = function (txt,d) {
    var dldiv = $("#alert_Fram");
    var w = 268;
    if (txt.length > 13)
        w = txt.length * 18;
    if (dldiv == undefined || dldiv == null || dldiv.length == 0) {
        var strHtml = "<div id=\"alert_Fram\" style=\"width:" + w + "px;height:60px;background:#FFFFFF;z-index:10001;text-align:center;font-size:18px;line-height:60px;\" >";
        strHtml += " <div id=\"alertContent_\">" + txt + "</div>";
        strHtml += "</div>"
        dldiv = $(strHtml);
        $("body").append(dldiv);
    } else {
        $("#alertContent_").html(txt);
    }
    $(dldiv).OpenZdyDialog(); 
    if(typeof(d) != "undefined")
        setTimeout("$('#alert_Fram').CloseZdyDialog()", d * 1000);
}




