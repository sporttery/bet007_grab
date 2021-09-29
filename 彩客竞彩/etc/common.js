 function tips(html) {
	$.dialog({
		type : 'tips',
		overlayClose : true,
		contentHtml : html,
		autoClose : 2500
	});
}
 function  LotteryBuyInfo(){
     this.secrecyType = -1;  
     this.payPassword = null;  
     this.checkRepeated  = true; // 是否检查重复提交
     this.schemeContent = null;
     this.ShareInfo = null;  // 合买数据，为null则是代购
 }

 function  ContentInfo()
 {
     this.lotteryType = 0 ;
     this.playType  =0 ;
     this.cost = 0;
 }

function DigSchemeContent()
 {
    ContentInfo.call(this); //继承ContentInfo对象
    this.issues  = new Array();
    this.contents  = null;
    this.wonStop = false ;
    this.append = false ;
    this.filterType = null;
}

function DigIssues()
{
    this.issueId  = 0 ;
    this.multiple = 0 ; //倍数
}

function DigContent()
{
    this.optionalArray  = new Array() ; //拖码
    this.requiredArray  = new Array(); //胆码
}

function  OptionalArray()
{
    this.part = 0; //第几块，从0开始
    this.index = 0; //第几个，从0开始
}

function  DigContents()
{
    this.playType = 0 ; //玩法类型
    this.units = 0 ; //注数
    this.content = new Array(); //内容
}

/*
*传统足彩格式
*/
function ZCSchemeContent()
{
    ContentInfo.call(this); //继承ContentInfo对象
    this.multiple = 1 //倍数
    this.issueId  = 0 //期ID
    this.content = ""  //投注内容 
}

    /// <summary>
    /// 统计数字彩缩水投注注数
    /// </summary>
function CountShrinkNoteCount(typeID,chooseLen,zhongLen,daoLen)
{
    var listStr = "";
    if (typeID == 10) // 双色球
{
        listStr = "#10,7,6,5,1#10,8,6,5,4#10,9,6,5,7#10,10,6,5,14#10,11,6,5,22#10,12,6,5,38#10,13,6,5,61#10,14,6,5,98#10,15,6,5,142#10,16,6,5,224#10,17,6,5,338#10,18,6,5,484#10,19,6,5,684#10,20,6,5,850#10,21,6,5,1130#10,22,6,5,1529#10,8,6,4,3#10,9,6,4,3#10,10,6,4,3#10,11,6,4,5#10,12,6,4,6#10,13,6,4,10#10,14,6,4,14#10,15,6,4,19#10,16,6,4,25#10,17,6,4,34#10,18,6,4,42#10,19,6,4,54#10,20,6,4,66#10,21,6,4,80#10,22,6,4,102#10,7,5,5,6#10,8,5,5,12#10,9,5,5,30#10,10,5,5,50#10,11,5,5,100#10,12,5,5,132#10,13,5,5,245#10,14,5,5,371#10,15,5,5,579#10,16,5,5,808#10,17,5,5,1213#10,18,5,5,1547#10,19,5,5,2175#10,20,5,5,2850#10,21,5,5,3930#10,22,5,5,4681#";
}
else if (typeID == 20) // 大乐透
{
        listStr = "#20,7,5,4,3#20,8,5,4,5#20,9,5,4,9#20,10,5,4,14#20,11,5,4,22#20,12,5,4,35#20,13,5,4,50#20,14,5,4,69#20,15,5,4,95#20,16,5,4,134#20,17,5,4,179#20,18,5,4,234#20,19,5,4,305#20,20,5,4,388#20,21,5,4,491#20,22,5,4,628#20,10,5,3,2#20,11,5,3,5#20,12,5,3,6#20,13,5,3,9#20,14,5,3,12#20,15,5,3,13#20,16,5,3,20#20,17,5,3,21#20,18,5,3,26#20,19,5,3,32#20,20,5,3,40#20,21,5,3,47#20,22,5,3,57#20,6,4,4,5#20,7,4,4,9#20,8,4,4,20#20,9,4,4,30#20,10,4,4,51#20,11,4,4,66#20,12,4,4,113#20,13,4,4,157#20,14,4,4,230#20,15,4,4,295#20,16,4,4,405#20,17,4,4,491#20,18,4,4,664#20,19,4,4,846#20,20,4,4,1083#20,21,4,4,1251#20,22,4,4,1573#";
}
else if (typeID == 1) //足彩十四场
{
        listStr = "#1,0,14,0,177147#1,0,13,1,118098#1,0,13,0,59049#1,0,12,2,113724#1,0,12,1,56862#1,0,12,0,28431#1,0,11,3,75816#1,0,11,2,37908#1,0,11,1,18954#1,0,11,0,9477#1,0,10,4,52488#1,0,10,3,26244#1,0,10,2,13122#1,0,10,1,6804#1,0,10,0,3645#1,0,9,5,34992#1,0,9,4,17496#1,0,9,3,9612#1,0,9,2,4806#1,0,9,1,2538#1,0,9,0,1269#1,0,8,6,23328#1,0,8,5,11664#1,0,8,4,6408#1,0,8,3,3374#1,0,8,2,1728#1,0,8,1,972#1,0,8,0,486#1,0,7,7,16704#1,0,7,6,8352#1,0,7,5,4374#1,0,7,4,2304#1,0,7,3,1296#1,0,7,2,648#1,0,7,1,333#1,0,7,0,186#1,0,6,8,11664#1,0,6,7,5832#1,0,6,6,2916#1,0,6,5,1620#1,0,6,4,864#1,0,6,3,468#1,0,6,2,252#1,0,6,1,132#1,0,6,0,73#1,0,5,9,7776#1,0,5,8,3888#1,0,5,7,1944#1,0,5,6,1184#1,0,5,5,624#1,0,5,4,324#1,0,5,3,168#1,0,5,2,96#1,0,5,1,54#1,0,5,0,27#1,0,4,10,5184#1,0,4,9,2592#1,0,4,8,1296#1,0,4,7,852#1,0,4,6,432#1,0,4,5,238#1,0,4,4,128#1,0,4,3,72#1,0,4,2,36#1,0,4,1,18#1,0,4,0,9#1,0,3,11,4032#1,0,3,10,2016#1,0,3,9,1092#1,0,3,8,576#1,0,3,7,312#1,0,3,6,174#1,0,3,5,92#1,0,3,4,48#1,0,3,3,24#1,0,3,2,16#1,0,3,1,9#1,0,3,0,5#1,0,2,12,3008#1,0,2,11,1504#1,0,2,10,768#1,0,2,9,408#1,0,2,8,232#1,0,2,7,122#1,0,2,6,64#1,0,2,5,36#1,0,2,4,20#1,0,2,3,12#1,0,2,2,6#1,0,2,1,4#1,0,2,0,3#1,0,1,13,2048#1,0,1,12,1024#1,0,1,11,548#1,0,1,10,284#1,0,1,9,160#1,0,1,8,84#1,0,1,7,48#1,0,1,6,24#1,0,1,5,16#1,0,1,4,8#1,0,1,3,6#1,0,1,2,3#1,0,1,1,2#1,0,1,0,1#1,0,0,14,1460#1,0,0,13,730#1,0,0,12,380#1,0,0,11,192#1,0,0,10,120#1,0,0,9,62#1,0,0,8,32#1,0,0,7,16#1,0,0,6,12#1,0,0,5,7#1,0,0,4,4#1,0,0,3,2#1,0,0,2,2#1,0,0,1,1#";
}
else if (typeID == 5) //15场，中N保N-2
{
        listStr = "#5,1,0,15,2048#5,1,0,14,256#5,1,0,13,128#5,1,0,12,78#5,1,0,11,44#5,1,0,10,30#5,1,0,9,16#5,1,0,8,12#5,1,0,7,7#5,1,0,6,4#5,1,0,5,2#5,1,0,4,2#5,1,0,3,2#5,1,0,2,1#5,1,0,1,1#5,1,1,14,2048#5,1,1,13,384#5,1,1,12,192#5,1,1,11,96#5,1,1,10,60#5,1,1,9,35#5,1,1,8,20#5,1,1,7,12#5,1,1,6,8#5,1,1,5,6#5,1,1,4,3#5,1,1,3,2#5,1,1,2,2#5,1,1,1,1#5,1,1,0,1#5,1,2,12,512#5,1,2,11,256#5,1,2,10,144#5,1,2,9,74#5,1,2,8,48#5,1,2,7,28#5,1,2,6,16#5,1,2,5,11#5,1,2,4,6#5,1,2,3,4#5,1,2,2,3#5,1,2,1,2#5,1,2,0,1#5,1,3,11,716#5,1,3,10,358#5,1,3,9,192#5,1,3,8,96#5,1,3,7,56#5,1,3,6,36#5,1,3,5,23#5,1,3,4,13#5,1,3,3,8#5,1,3,2,5#5,1,3,1,3#5,1,3,0,3#5,1,4,10,960#5,1,4,9,480#5,1,4,8,252#5,1,4,7,144#5,1,4,6,72#5,1,4,5,48#5,1,4,4,24#5,1,4,3,18#5,1,4,2,10#5,1,4,1,6#5,1,4,0,3#5,1,5,9,1344#5,1,5,8,672#5,1,5,7,348#5,1,5,6,192#5,1,5,5,108#5,1,5,4,64#5,1,5,3,36#5,1,5,2,21#5,1,5,1,12#5,1,5,0,8#5,1,6,8,1912#5,1,6,7,956#5,1,6,6,519#5,1,6,5,276#5,1,6,4,144#5,1,6,3,72#5,1,6,2,48#5,1,6,1,27#5,1,6,0,17#5,1,7,7,2592#5,1,7,6,1296#5,1,7,5,714#5,1,7,4,385#5,1,7,3,216#5,1,7,2,108#5,1,7,1,54#5,1,7,0,34#5,1,8,6,3888#5,1,8,5,1944#5,1,8,4,972#5,1,8,3,504#5,1,8,2,288#5,1,8,1,162#5,1,8,0,81#5,1,9,5,3726#5,1,9,4,1863#5,1,9,3,1215#5,1,9,2,729#5,1,9,1,396#5,1,9,0,219#5,1,10,4,3888#5,1,10,3,1944#5,1,10,2,1458#5,1,10,1,729#5,1,10,0,555#5,1,12,0,2187#5,1,11,2,2916#5,1,11,1,1458#5,1,11,0,729#";
}
    var regtext = eval("/.*#" + typeID + "," + chooseLen + "," + zhongLen + "," + daoLen + ",(\\d+).*/");
    var countstr = listStr.replace(regtext, "$1");
    var rst = parseInt(countstr);
    if (isNaN(rst)) rst = 0;
    return rst;
}

var pagePanel = {
    panelIdArr: [],
    open: function (pageid) {
        this.panelIdArr.push(pageid);
        for (var i = 0; i < this.panelIdArr.length; i++) $("#" + this.panelIdArr[i]).hide();
        $("#" + pageid).show();
    },
    goback: function () {
        for (var i = 0; i < this.panelIdArr.length; i++) $("#" + this.panelIdArr[i]).hide();
        if (this.panelIdArr.length > 1) {
            this.panelIdArr.pop();
        }
        $("#" + this.panelIdArr[this.panelIdArr.length - 1]).show();
    },
    gofirst: function () {
        for (var i = 0; i < this.panelIdArr.length; i++) $("#" + this.panelIdArr[i]).hide();
        for (var i = this.panelIdArr.length - 1; i >= 1; i--) {
            this.panelIdArr.pop();
        }
        $("#" + this.panelIdArr[0]).show();
    },
    init: function (pageid) {
        this.panelIdArr.push(pageid);
    },
    getTopTitleHtml: function (title, isGofirst) {
        if (typeof (isGofirst) == "undefined")
            isGofirst = false;
        var HTMLArr = new Array();
        HTMLArr.push("<div class='topcontainer'><div  class='topbanner'>");
        HTMLArr.push("<span class='topRight'><span class='top_drop topdropbtn top_odds_ico' ></span></span>");
        HTMLArr.push("<span class='topLeft'><a id='goback1' class='backbtn' href='javascript:" + (isGofirst ? "pagePanel.gofirst()" : "pagePanel.goback()") + "'><em class='arrow-left'></em></a></span>");
        HTMLArr.push("<span class='top_drop topdropbtn' >" + title + "</span>");
        HTMLArr.push("</div></div>");
        HTMLArr.push("<div class='top-height-d' ></div>");
        return HTMLArr.join("");
    }

};


function buy(LotteryBuyInfoObj) {
    // 提交表单数据到后台处理
    $.ajax({
        type: "post",
        data: { action: "buy", buydata: JSON.stringify(LotteryBuyInfoObj) },
        url: window.location.href,
        beforeSend: function () {
            // 禁用按钮防止重复提交
            $(".dobuy").attr({ disabled: "disabled" });
        },
        success: function (data) {
            $(".dobuy").removeAttr("disabled"); //打开提交按钮
            var ResultObj = eval("(" + data + ")");
            if (ResultObj.resultCode == 100) {
                var LoginHtml = "<div style='line-height:26px;text-align:center;' >" + ResultObj.message + "</div>";
                $.dialog({
                    type: 'confirm',
                    titleText: "提示",
                    buttonText: {
                        ok: '继续投注',
                        cancel: '查看方案',
                        delete: '删除'
                    },
                    onClickOk: function () {
                        window.location.href = window.location.href;
                    },
                    onClickCancel: function () {
                        window.location.href = "/Trade/Info/LotteryDetail.aspx?lotteryid=" + ResultObj.body;

                    },
                    contentHtml: LoginHtml
                });
            } else if (ResultObj.resultCode == 201)
            {
                LoginDlg.SuccessCallBack = function () {buy(LotteryBuyInfoObj) };
                LoginDlg.show();
            }
			else if (ResultObj.resultCode == 202)//余额不足
            {
                $.dialog({
                    type: 'confirm',
                    titleText: "提示",
					overlayClose:true,
                    buttonText: {
                        ok: '账户充值',
                        cancel: '免费保存',
                    },
                    onClickOk: function () {
                        window.location.href = "/Trade/Mine/User/Fund/RechargePlatform.aspx";
                    },
                    onClickCancel: function () {
						LotteryBuyInfoObj.checkSave=true;
						buy(LotteryBuyInfoObj);
						//console.log(LotteryBuyInfoObj);
                    },
                    contentHtml: "您的余额不足，您可以免费保存方案或进行账户充值"
                });
            }
            else if (ResultObj.resultCode == 204) {
                if (typeof (LotteryBuyInfoObj.payPassword) != "undefined" && LotteryBuyInfoObj.payPassword != null) {
                    alert(ResultObj.message);
                }
                PayPassDlg.SuccessCallBack = function () {
                    LotteryBuyInfoObj.payPassword = $("#paypwd").val();
                    buy(LotteryBuyInfoObj)
                };
                PayPassDlg.show();
            }
            else {
                tips(ResultObj.message)
            }
        },
        complete: function () {
            $(".dobuy").removeAttr("disabled"); //打开提交按钮
        },
        error: function (data) {
            $(".dobuy").removeAttr("disabled"); //打开提交按钮
            console.info("error: " + data.responseText);
        }
    });
}

PayPassDlg = {
    show: function (otions) {
        if ($(".payDlg").length > 0) {
            $(".payDlg").remove();
            $("#payoverlay").remove();
        }
        var DlgHTML = "<div class='payDlg'><div class='paytitle'>验证支付密码</div>"
    + "<div class='paydrow1'  >"
        + "<input id='paypwd' class='buy-paypwd' type='password' placeholder='请输入你的支付密码'  />"
    + "</div>"
    + "<div class='paydrow2'  >"
        + "<div class='paybtndiv'  >"
            + "<button id='paycancel' class='paybtn paycancel'  type='button' >取消</button>"
        + "</div>"
        + "<div  class='paybtndiv'  >"
            + "<button id='payok' class='paybtn payok'  type='button' >确定</button>"
        + "</div>"
    + "</div>"
+ "</div><div id='payoverlay'></div>";
        var verify = 0;//本窗口验证，验证完下一步
        if (typeof (otions) != "undefined" && otions != "")
        {
            var ppDlg = eval(otions);
            if (typeof (ppDlg) != "undefined") {
                verify = ppDlg.verify;
                if (typeof (ppDlg.title) != "undefined" && ppDlg.title != "")
                    DlgHTML = DlgHTML.replace("验证支付密码", ppDlg.title);
                if (typeof (ppDlg.hcontent) != "undefined" && ppDlg.hcontent != "")
                    DlgHTML = ppDlg.hcontent;
            }
        }
        
        $("body").append(DlgHTML);
        $(".payDlg").slideDown(300);
        $("#paycancel").click(function () { PayPassDlg.close(); });
        $("#payok").click(function () {
            if (verify == 0) {
                PayPassDlg.SuccessCallBack();
                PayPassDlg.SuccessCallBack = function () { };
                $(".payDlg").remove();
                $("#payoverlay").remove();
            }
            else if (verify == 1 || verify == 3) {//验证支付密码
                var cashpayment = 1;//现金支出
                var virtualpayment = 1;//虚拟币支出
                var paypwd = escape($("#paypwd").val());
                var username = escape($("#username").val());
                var diamonds = escape($("#diamonds").val());
                var nn = Math.random();
                $.post("/Trade/Mine/User/Important/Password/PasswordHandler.ashx?n=" + nn,
               {
                   action: "verifypaypassword",
                   paypwd: paypwd
               },
               function (resultObj, status) {
                   if (resultObj.ErrCode == 0) {
                       var ppStatus = eval("(" + resultObj.Data + ")");
                       if (typeof (ppStatus) != "undefined")
                       {
                           cashpayment = ppStatus.cashPayment;
                           virtualpayment = ppStatus.virtualPayment;
                       }
                       PayPassDlg.close();
                       if (verify == 1) {
                           var uptHtml = "<div class='payDlg'>"
                                       + "<div class='paytitle'>修改使用范围<input id='hidepaypwd' type='hidden' value='" + paypwd + "'></div>"
                                       + "<div class='ppwd_form'>"
                                       + "<ul class='ppwd_cc'>"
                                       + "<li class='b_line'>现金提款<span class='r_text'><font color='#0079ff'>必须启用</font></span></li>"
                                       + "<li class='b_line'>现金支出<span class='w_right2'><input type='checkbox' id='chkcash' class='chk_ps' " + (cashpayment == 1 ? "checked" : "") + "/><label for='chkcash'></label></span></li>"
                                       + "<li>虚拟币支出（彩豆、钻石）<span class='w_right2'><input type='checkbox' id='chkvirtual' class='chk_ps' " + (virtualpayment == 1 ? "checked" : "") + "/><label for='chkvirtual'></label></span></li>"
                                       + "</ul>"
                                       + "</div>"
                                       + "<div class='paydrow2'  >"
                                       + "<div class='paybtndiv'  >"
                                       + "<button id='paycancel' class='paybtn paycancel'  type='button' >取消</button>"
                                       + "</div>"
                                       + "<div  class='paybtndiv'  >"
                                       + "<button id='payok' class='paybtn payok'  type='button' >确定</button>"
                                       + "</div>"
                                    + "</div>"
                                       + "</div><div id='payoverlay'></div>";
                           //clearTimeout(cc);
                          setTimeout(function () {
                               PayPassDlg.show({ verify: 2, hcontent: uptHtml });
                          }, 350);
                           
                       }
                       else if (verify == 3) {
                          
                           if (virtualpayment == 0) {//无支付密码
                               $.post("FundHandler.ashx?n=" + nn,
                                {
                                    action: "givediamond",
                                    username: $("#username").val(),
                                    diamonds: escape($("#diamonds").val()),
                                },
                                function (resultObj, status) {
                                    if (resultObj.ErrCode == 0) {
                                        var retObj = eval(resultObj.Data);
                                        commonObj.alertTips(retObj.msg);
                                        if (typeof (retObj.jumpUrl) != "undefined" && retObj.jumpUrl != "")
                                            location.href = retObj.jumpUrl; //跳转
                                    }
                                    else {
                                        commonObj.alertTips(resultObj.ErrMsg);
                                        PayPassDlg.close();
                                    }
                                },
                                "json"
                                );
                                return false;
                           }
                           else {
                               PayPassDlg.close();
                               var uptHtml = "<div class='switch width33'>"
                                       + "<div style='text-align:center;line-height:36px;height:36px;'>提示<input id='hidepaypwd' type='hidden' value='" + paypwd + "'><input id='hideusername' type='hidden' value='" + username + "'><input id='hidediamonds' type='hidden' value='" + diamonds + "'></div>"
                                       + "<div class='ppwd_form'>"
                                       + "<ul>"
                                       + "<li class='b_line'></li>"
                                       + "<li class='b_tips'>确认赠送？</li>"
                                       + "</ul>"
                                       + "</div>"
                                       + "</div>";
                               if ($('.dialog-wrap').length > 0) {
                                   $.dialog.close();
                               }
                               else {
                                   $.dialog({
                                       type: "confirm",
                                       showTitle: false,
                                       contentHtml: uptHtml,
                                       onClickOk: function () {
                                           var nn = Math.random();
                                           $.post("FundHandler.ashx?n=" + nn,
                                            {
                                                action: "givediamond",
                                                username: $("#hideusername").val(),
                                                diamonds: escape($("#hidediamonds").val()),
                                                paypwd: escape($("#hidepaypwd").val())
                                            },
                                            function (resultObj, status) {
                                                if (resultObj.ErrCode == 0) {
                                                    var retObj = eval(resultObj.Data);
                                                    commonObj.alertTips(retObj.msg, (typeof (retObj.jumpUrl) != "undefined"  && retObj.jumpUrl != null && retObj.jumpUrl != "" ? retObj.jumpUrl : ""));
                                                }
                                                else {
                                                    $.dialog.close();
                                                    setTimeout(function () {
                                                        commonObj.alertTips(resultObj.ErrMsg);
                                                    }, 350);
                                                }
                                            },
                                            "json"
                                            );
                                           return false;
                                       }
                                   });
                               }
                           }
                       }
                   }
                   else
                       commonObj.alertTips(resultObj.ErrMsg);
               },
               "json"
               );
                return false;
            }
            else if (verify == 2) {//修改支付密码范围
                $.post("PasswordHandler.ashx?n=" + nn,
                    {
                        action: "updatepaypasswordrange",
                        cashPayment: $("#chkcash").is(":checked"),
                        virtualpayment: $("#chkvirtual").is(":checked"),
                        oldpwd: escape($("#hidepaypwd").val())
                    },
                    function (resultObj, status) {
                        if (resultObj.ErrCode == 0) {
                            var retObj = eval(resultObj.Data);
                            commonObj.alertTips(retObj.msg, (typeof (retObj.jumpUrl) != "undefined" && retObj.jumpUrl != null && retObj.jumpUrl != "" ? retObj.jumpUrl : ""));
                        }
                        else {
                            commonObj.alertTips(resultObj.ErrMsg);
                        }
                    },
                    "json"
                    );
                return false;
            }
            else if (verify == 4) {//关闭支付密码
                $.post("PasswordHandler.ashx?n=" + nn,
                    {
                        action: "closepaypassword",
                        paypwd: escape($("#paypwd").val())
                    },
                    function (resultObj, status) {
                        if (resultObj.ErrCode == 0) {
                            var retObj = eval(resultObj.Data);
                            commonObj.alertTips(retObj.msg, (typeof (retObj.jumpUrl) != "undefined" && retObj.jumpUrl != null && retObj.jumpUrl != "" ? retObj.jumpUrl : ""));
                        }
                        else {
                            commonObj.alertTips(resultObj.ErrMsg);
                        }
                    },
                    "json"
                    );
                return false;
            }
            
        });
        $("#payoverlay").click(function () { PayPassDlg.close(); });
        $("#paypwd").keyup(function () {
            PayPassDlg.checkinp();
        });
        PayPassDlg.checkinp();
    },
    checkinp:function(){
        if ($("#paypwd").val() != "") {
            $("#payok").removeAttr("disabled");
            $("#payok").addClass("bgcolor4");
        } else {
            $("#payok").attr("disabled", "disabled");
            $("#payok").removeClass("bgcolor4");
        }
    },
    close: function () {
        $(".payDlg").slideUp(300, function () {
            $("#payoverlay").remove();
            $(".payDlg").remove();
        });
    },
    SuccessCallBack: function () {
    }
}

LoginDlg = {
    pagecacheName:"userloginpage",
    show: function () {
        var pagedata = LoginDlg.getCacheData();
        if (pagedata) {
            LoginDlg.exeshow(pagedata);
        } else {
            $.get("/Trade/Mine/User/Login.aspx?isopendlg=true&t=" + (new Date()).getSeconds(), function (data) {
                var matchobj = data.match(/<body[^>]*>[\s\S]*<\/body[^>]*>/gi);
                data = data.replace(/<script[^>]*jquery[^>]*>[^<]*<\/script[^>]*>/gi, ""); //防止jquery重新加载
                LoginDlg.setCacheData(data);
                LoginDlg.exeshow(data);
            });
        };
    },
    exeshow: function (data) {
        //--------------样式是否已加载--------------
        var hascss = false;
        var styleArr = $(document.head).find("link[rel='stylesheet']");
        for (var i = 0; i < styleArr.length; i++) {
            if ($(styleArr[i])[0].href.toLowerCase().indexOf("user.css") != -1) {
                hascss = true;
                break;
            }
        }
        if (hascss == false) {
            var now = new Date();
            var txt = now.getFullYear() + "0" + now.getMonth() + "0" + now.getDay();
            $(document.head).append("<link rel='stylesheet' href='/Trade/Mine/Css/user.css?v=" + txt + "' />");
        }
        //-------样式结束-----------------

        if ($(".LoginDlg").length > 0) {
            $(".LoginDlg").remove();
        }
        $("body").append("<div class='LoginDlg'> <div class='topbanner' >"
 + "<ul class='topbul' >"
    + "<li><a class='backbtn' onclick='LoginDlg.close()' ><span class='arrleft' ></span></a></li>"
     + "<li><span class='toptitle' >账户登录</span></li>"
     + "<li><span class='top-floatright' onclick=\"OpenHrefByJs('/Trade/Mine/User/RegisterByPhoneNo.aspx?ret=Login.aspx');\" >注册</span></li>"
 + "</ul>"
+ "</div><div id='loginpagecontent' ></div></div>");
        $("#loginpagecontent").append(data);
        $(".zh_top").remove();
        $("#btnLogin").unbind("click").on("click", function () {
            var nn = Math.random();
            var username = $("#username").val();
            var pwd = $("#pwd").val();
            $.post("/Trade/Mine/User/UserHandler.ashx?n=" + nn,
            {
                action: "login",
                username: escape(username),
                pwd: escape(pwd)
            },
            function (resultObj, status) {
                if (resultObj.ErrCode == 0) { //登录成功       
                    try {
                        if (resultObj.LoginInfo != "undefined" && resultObj.LoginInfo != null) {
                            //console.log(resultObj.LoginInfo);
                            MobileBase.appRefreshUserInfo(resultObj.LoginInfo);
                        }
                    } catch (e) {
                    };
                    LoginDlg.SuccessCallBack();
                    LoginDlg.close();
                }
                else
                    alert(resultObj.ErrMsg);
            },
            "json"
            );
            return false;
        });
    },
    getCacheData: function () {
        var startdt = new Date("2018/08/01");
        var now = new Date();
        if (now < startdt)
            return undefined; //实时登录获取服务器最新数据
        else
            return sessionStorage.getItem(LoginDlg.pagecacheName);   //返回缓存     
    },
    setCacheData: function (data) {
        sessionStorage.setItem(LoginDlg.pagecacheName, data);
    },
    initcache: function () {
        try {
            var pagedata = LoginDlg.getCacheData();
            if (pagedata) {
                return;
            } else {
                $.get("/Trade/Mine/User/Login.aspx?t=" + (new Date()).getSeconds(), function (data) {
                    var matchobj = data.match(/<body[^>]*>[\s\S]*<\/body[^>]*>/gi);
                    data = data.replace(/<script[^>]*jquery[^>]*>[^<]*<\/script[^>]*>/gi, ""); //防止jquery重新加载
                    LoginDlg.setCacheData(data);
                });
            }
        } catch (e) {
            console.log(e);
            alert(e.message);           
        };
    },
    close: function () {
        $(".LoginDlg").remove();
        LoginDlg.SuccessCallBack = function () { }; //清空
    },
    SuccessCallBack: function () {
    },
    CheckLogin: function (success_func,fail_func) {
        $.ajax({
            type: "post",
            url: "/Trade/Mine/User/UserHandler.ashx?t" + (new Date()).getMilliseconds() ,
            data: "action=isLogin",
            async: false,
            success: function (data) {
                resultObj = eval("(" + data + ")");
                if (resultObj.ErrCode == 0) { //登录成功     
                    if (resultObj.Data) {
                        if (typeof (success_func) == "function") {
                            success_func();
                        }
                    } else {
                        if (typeof (fail_func) == "function") {
                            fail_func();
                        }
                    }
                }
                else
                    alert(resultObj.ErrMsg);
            }
        });      
    }
}
setTimeout(function () { LoginDlg.initcache();}, 500);
var yyyFuncList = new Array();
function YaoYiYao(func) {
    yyyFuncList.push(func);
}
//摇一摇的功能
if (window.DeviceMotionEvent) {
    var speed = 20;//摇动的速度
    var x = y = z = lastX = lastY = lastZ = 0;
    window.addEventListener('devicemotion', function () {
        var acceleration = event.accelerationIncludingGravity;
        x = acceleration.x;
        y = acceleration.y;
        if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed) {
            $.each(yyyFuncList, function (i, val) {
                if (typeof (val) == "function") {
                    val();
                }
            });
        }
        lastX = x;
        lastY = y;
    }, false);
};
function writeCookie(c, d) { var a = ""; var b = 365; a = new Date((new Date()).getTime() + b * 3600000); a = ";path=/;expires=" + a.toGMTString(); document.cookie = c + "=" + d + a };
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);    
    if (r != null) return decodeURIComponent(r[2]); return null;
}

function OpenPlayHelp(typeid, name) {
    if (typeid >= 110 && typeid <= 114) typeid = 111;
    if (typeid >= 100 && typeid <= 105) typeid = 101;
    if ((typeid >= 5 && typeid <= 9) || typeid == 11) typeid = 5;    
    OpenHrefByJs('/Trade/Mine/User/Interactive/PayMode.aspx?t=' + typeid + '&name=' + encodeURIComponent(name) + '&ret=' + encodeURIComponent(location.href));
}
function OpenAnalysis(shref, isret) {
    if (typeof (isOpenApp) != "undefined" && isOpenApp == true) {
        var obj = { 'urlString': shref, useBrowser: false, targetName: 'URL', isPageNoHeader: true, useUIWebView:true };
        MobileBase.appRoute(obj);
    } else {
        location.href = shref + (typeof (isret) != "undefined" && isret == true ? (shref.indexOf("?") == -1 ? "?" : "") + "&ret=" + encodeURIComponent(location.href) : "");
    }
}

function GetUrlParams(reqUrl, paraName) {
    var vars = [], hash;
    var hashes = reqUrl.slice(reqUrl.indexOf('?') + 1).split('&');
    try {
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars[paraName];
    } catch (e) {
        return "";
    }
}