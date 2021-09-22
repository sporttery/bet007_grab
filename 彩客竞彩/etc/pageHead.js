//IOS事件加载专用
var winObj = window;
if (window.parent != null && window.parent != undefined) winObj = window.parent;
function setupWebViewJavascriptBridge(callback) {
    if (winObj.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (winObj.WVJBCallbacks) { return winObj.WVJBCallbacks.push(callback); }
    winObj.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0);

    //旧版
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
        callback(WebViewJavascriptBridge)
    }, false)
}
/*******************安卓*******************/
//打开内嵌页面
function android_OpenWebView(title, url) {
    var obj = { 'title': title, 'url': url };
    window.androidBaseListener.appOpenWebView(JSON.stringify(obj));
}
//在推荐详情页中打开分析页
function android_OpenAnalysis(scheduleId, matchType) {
    /* matchType
     * 1 足球
     * 2 篮球*/
    var obj = { 'scheduleId': scheduleId, 'matchType': matchType };
    window.androidListener.appMatchAnalysis(JSON.stringify(obj));
}
//在推荐详情页中打开竞猜频道
function android_OpenGuess() {
    window.androidListener.appOpenGuess();
}



var MobileBase = {
    AppType: 1, // 1-安卓,2-IOS。默认安卓
    IOS_Bridge: null,
    RegIosJsCount:0,
    init: function () {
        if (MobileBase.AppType == 2) {
            setupWebViewJavascriptBridge(function (bridge) {
                MobileBase.IOS_Bridge = bridge;
            });
        }
    }
    ,
    RegIosJs: function (Name, Func) {
        //注册Js时间给Ios原生调用
        if (MobileBase.AppType == 2) {
            if (MobileBase.RegIosJsCount < 20) {
                if (MobileBase.IOS_Bridge == null) {
                    MobileBase.RegIosJsCount++;
                    setTimeout(function () { MobileBase.RegIosJs(Name, Func) }, 300);
                } else {
                    try {
                        MobileBase.IOS_Bridge.registerHandler(Name, function (data, responseCallback) {
                            if (typeof (Func) == "function") Func(data);
                            //responseCallback("执行了");
                        });
                    } catch (e) {
                        console.log("错误:" + e)
                    }
                }
            }
        }
    }
    ,
    appCallback: function (int_code, msg) {
        var obj = { code: int_code, message: msg };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appCallback", { code: parseInt(bForm.txtCode.value), message: bForm.txtMessage.value });
            MobileBase.IOS_Bridge.callHandler("appCallback", obj);
        } else {
            //window.androidBaseListener.appCallback("{ code: " + parseInt(bForm.txtCode.value) + ", message:'" + bForm.txtMessage.value + "' }");
            window.androidBaseListener.appCallback(param_str);
        }
    },
    OpenWebView: function (s_title, s_url) {
        var obj = { title: s_title, url: s_url };
        MobileBase.appOpenWebView(obj);
        
    },
    appOpenWebView: function (obj) {        
        if (obj.url.toLowerCase().indexOf("http") != 0) {
            if (obj.url.indexOf("/") == 0) {
                obj.url = window.location.href.substr(0, window.location.href.indexOf(":") + 3) + window.location.host + obj.url;
            } else if (Url.indexOf("../") == 0) {
                obj.url = window.location.href.substr(0, window.location.href.substr(0, window.location.href.split("?")[0].lastIndexOf("/")).lastIndexOf("/")) + obj.url.replace("../", "/");
            } else {
                obj.url = window.location.href.substr(0, window.location.href.split("?")[0].lastIndexOf("/") + 1) + obj.url;
            }
        }
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appOpenWebView", {title: bForm.txtTitle.value,url: bForm.txtUrl.value});
            MobileBase.IOS_Bridge.callHandler("appOpenWebView", obj);
        } else {
            // window.androidBaseListener.appOpenWebView("{ title: '" + bForm.txtTitle.value + "', url:'" + bForm.txtUrl.value + "'}");
            window.androidBaseListener.appOpenWebView(param_str);
        }
    },
    appAlert: function (s_title, s_msg) {
        var obj = { title: s_title, message: s_msg };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appAlert", { title: bForm.txtTitle2.value, message: bForm.txtMessage2.value });
            MobileBase.IOS_Bridge.callHandler("appAlert", obj);
        } else {
            // window.androidBaseListener.appAlert("{ title: '"+bForm.txtTitle2.value+"', message:'"+ bForm.txtMessage2.value+"' }");
            window.androidBaseListener.appAlert(param_str);
        }
    },
    appToast: function (s_msg) {
        var obj = { message: s_msg };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appToast", { message: bForm.txtMessage3.value });
            MobileBase.IOS_Bridge.callHandler("appToast", obj);
        } else {
            // window.androidBaseListener.appToast("{ message:'" + bForm.txtMessage3.value + "' }");
            window.androidBaseListener.appToast(param_str);
        }
    },
    appCallPhone: function (s_PhoneNumber, s_Title) {
        var obj = { phoneNumber: s_PhoneNumber, title: s_Title };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.("appCallPhone", { phoneNumber: bForm.txtPhoneNumber.value, title: bForm.txtTitle3.value });
            MobileBase.IOS_Bridge.callHandler("appToast", obj);
        } else {
            //window.androidBaseListener.appCallPhone("{ phoneNumber:'" + bForm.txtPhoneNumber.value + "' }");
            window.androidBaseListener.appCallPhone(param_str);
        }
    },
    showImages: function (ArrImgList, SelIndex) {
        var obj = { images: ArrImgList, selectedIndex: SelIndex }
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appShowImages", { "images": [bForm.txtImgURl1.value, bForm.txtImgURl2.value], "selectedIndex": 1 });
            MobileBase.IOS_Bridge.callHandler("showImages", obj);
        } else {
            //window.androidBaseListener.appShowImages("{images:['" + bForm.txtImgURl1.value + "', '" + bForm.txtImgURl2.value + "'],selectedIndex:1}");
            window.androidBaseListener.appShowImages(param_str);
        }
    },
    appSaveImage: function (imgUrl) {
        var obj = { imageUrl: imgUrl }
        //var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appSaveImage", { imageUrl: bForm.txtSaveImage.value }); 
            MobileBase.IOS_Bridge.callHandler("appSaveImage", obj);
        } else {
            // window.androidBaseListener.appSaveImage(bForm.txtSaveImage.value); 
            window.androidBaseListener.appSaveImage(imgUrl);
        }
    },
    appCopyToClipboard: function (txt) {
        var obj = { text: txt }
        //var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appCopyToClipboard", { text: bForm.txtToClipboard.value });
            MobileBase.IOS_Bridge.callHandler("appCopyToClipboard", obj);
        } else {
            //  window.androidBaseListener.appCopyToClipboard(bForm.txtToClipboard.value);
            window.androidBaseListener.appCopyToClipboard(txt);
        }
    },
    appGetCurrentUserId: function (CallBackFunc) {
        var UserIdRst = 0;
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler('appGetCurrentUserId', null, function (obj) { document.getElementById('txtGetCurrentUserId').value = obj.userId });
            MobileBase.IOS_Bridge.callHandler("appGetCurrentUserId", null, function (obj) {
                UserIdRst = obj.userId;
                if (typeof (CallBackFunc) == "function")
                    CallBackFunc(UserIdRst); //IOS只能调用CallBack返回
                else {
                    alert("缺少返回的CallBack函数");
                    return;
                }
            });
        } else {
            //  window.androidBaseListener.appGetCurrentUserId();
            UserIdRst = window.androidBaseListener.appGetCurrentUserId();
            if (typeof (CallBackFunc) == "function") CallBackFunc(UserIdRst);
        }
        return UserIdRst; //注意对于IOS这个值返回有误，必须使用CallBackFunc返回处理
    },
    //注意这里routeobj直接为对象
    appRoute: function (routeobj) {
        if (routeobj.targetName == "URL") {            
            if (routeobj.urlString.toLowerCase().indexOf("http") != 0) {
                if (routeobj.urlString.indexOf("/") == 0) {
                    routeobj.urlString = window.location.href.substr(0, window.location.href.indexOf(":") + 3) + window.location.host + routeobj.urlString;
                } else if (routeobj.urlString.indexOf("../") == 0) {
                    routeobj.urlString = window.location.href.substr(0, window.location.href.substr(0, window.location.href.split("?")[0].lastIndexOf("/")).lastIndexOf("/")) + routeobj.urlString.replace("../", "/");
                } else {
                    routeobj.urlString = window.location.href.substr(0, window.location.href.split("?")[0].lastIndexOf("/") + 1) + routeobj.urlString;
                }
            }
        }
        var param_str = JSON.stringify(routeobj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appRoute", { title: bForm.txtRouteTitle.value, targetName: bForm.txtTargetName.value });
            MobileBase.IOS_Bridge.callHandler("appRoute", routeobj);
        } else {
            //window.androidBaseListener.appRoute("{title:'" + bForm.txtRouteTitle.value + "',targetName:'" + bForm.txtTargetName.value + "'}");
            window.androidBaseListener.appRoute(param_str);
        }
    },
    appGoBack: function (routeobj) {
        var param_str = JSON.stringify(routeobj);
        if (MobileBase.AppType == 2) {
            //MobileBase.IOS_Bridge.callHandler("appGoBack", { title: bForm.txtRouteTitle2.value, targetName: bForm.txtTargetName2.value });
            MobileBase.IOS_Bridge.callHandler("appGoBack", routeobj);
        } else {
            // window.androidBaseListener.appGoBack("{title:'" + bForm.txtRouteTitle2.value + "',targetName:'" + bForm.txtTargetName2.value + "'}"); 
            window.androidBaseListener.appGoBack(param_str);
        }
    },
    appSetShareInfo: function (s_Title, s_content, s_imageUrl, s_pageUrl) {
        var obj = { title: s_Title, content: s_content, imageUrl: s_imageUrl, pageUrl: s_pageUrl };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            MobileBase.IOS_Bridge.callHandler("appSetShareInfo", obj);
        } else {
            window.androidBaseListener.appSetShareInfo(param_str);
        }
    },
    //关闭打开的页面
    goBack: function () {
        var obj = {};
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            MobileBase.IOS_Bridge.callHandler("appGoBack", obj);
        } else {
            window.androidBaseListener.goBack(param_str);
        }
    },
    appShare: function (s_Title, s_content, s_imageUrl, s_pageUrl) {
        var obj = { title: s_Title, content: s_content, imageUrl: s_imageUrl, pageUrl: s_pageUrl };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            MobileBase.IOS_Bridge.callHandler("appShare", obj);
        } else {
            window.androidBaseListener.appShare(param_str);
        }
    },
    appOpenRecommendDetail: function (s_id, s_isPaid, s_payMoney) {
        var obj = { id: s_id, isPaid: s_isPaid, payMoney: s_payMoney };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            MobileBase.IOS_Bridge.callHandler("appOpenRecommendDetail", obj);
        } else {
            window.androidListener.appOpenRecommendDetail(param_str);
        }
    },
    appOpenUpgradeTips: function (s_downloadUrl) {
        var obj = { downloadUrl: s_downloadUrl };
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            MobileBase.IOS_Bridge.callHandler("appDownloadApp", obj);
        } else {
            window.androidBaseListener.appDownloadApp(param_str);
        }
    },
    appRefreshUserInfo: function (obj) {
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            MobileBase.IOS_Bridge.callHandler("appRefreshUserInfo", obj);
        } else {
            window.androidBaseListener.appRefreshUserInfo(param_str);
        }
        
    },
    audioRecord: function (obj,IosCallBackfunc) {
        var param_str = JSON.stringify(obj);
        if (MobileBase.AppType == 2) {
            MobileBase.IOS_Bridge.callHandler("audioRecord", obj, function responseCallback(responseData) {
                console.log(responseData);
                if (typeof (IosCallBackfunc) == "function") IosCallBackfunc(responseData);
            });
        } else {
            window.androidBaseListener.audioRecord(param_str);
        }
    },
    appSetPageTag: function (obj) {
        try {
            if (MobileBase.AppType == 2) {
                var o = { "pageTag": obj };
                MobileBase.IOS_Bridge.callHandler("setPageTag", JSON.stringify(o));
            } else {
                window.androidBaseListener.setPageTag(obj);
            }
        } catch (e) {
            alert(e.message);
        }
        
    },
    appRefreshTagPage: function (obj) {
        try {
            if (MobileBase.AppType == 2) {
                var o = { "pageTag": obj };
                MobileBase.IOS_Bridge.callHandler("refreshTagPage", JSON.stringify(o));
            } else {
                window.androidBaseListener.refreshTagPage(obj);
            }
        } catch (e) {
            //alert(e.message);
        }
    },
    appGetRecommenderId: function (CallBackFunc) {
        if (typeof (CallBackFunc) != "function") {
            alert("缺少返回的CallBack函数");
            return;
        }
        if (MobileBase.AppType == 2) {
                MobileBase.IOS_Bridge.callHandler("appGetRecommenderId", null, function (obj) {
                    var RecommenderId = obj;
                    if (isNaN(RecommenderId) || RecommenderId == "undefined" || RecommenderId == null || RecommenderId == "") RecommenderId = 0;
                    CallBackFunc(RecommenderId);
                });
        } else {
            var RecommenderId = window.androidBaseListener.appGetRecommenderId();
            if (isNaN(RecommenderId) || RecommenderId == "undefined" || RecommenderId == null || RecommenderId=="") RecommenderId = 0;
            CallBackFunc(RecommenderId);
        }
    }
}
