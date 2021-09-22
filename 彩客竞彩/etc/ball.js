// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//var time1 = new Date().Format("yyyy-MM-dd");
//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Array.prototype.Contains = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
};
String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
}

String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
}
function formatPassMode(passModeOri) {
    return passModeOri.replace("P1_1", "单关").replace(/P/gi, "").replace(/\_/gi, "串");
}
// 自定义字典对象
function Dictionary() {
    var items = {};

    this.has = function (key) {
        return key in items;
    };

    this.set = function (key, value) {
        items[key] = value;
    };

    this.remove = function (key) {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    };

    this.get = function (key) {
        return this.has(key) ? items[key] : undefined;
    };

    this.values = function () {
        var values = [];
        for (var k in items) {
            if (this.has(k)) {
                values.push(items[k]);
            }
        }
        return values;
    };

    this.clear = function () {
        items = {};
    };

    this.size = function () {
        var count = 0;
        for (var prop in items) {
            if (items.hasOwnProperty(prop)) {
                ++count;
            }
        }
        return count;
    };

    this.getItems = function () {
        return items;
    };
}


var PassModeDic = new Dictionary();
PassModeDic.set("P2_3", "P1_1,P2_1");
PassModeDic.set("P3_3", "P2_1");
PassModeDic.set("P3_4", "P2_1,P3_1");
PassModeDic.set("P3_6", "P1_1,P2_1");
PassModeDic.set("P3_7", "P1_1,P2_1,P3_1");
PassModeDic.set("P4_4", "P3_1");
PassModeDic.set("P4_5", "P3_1,P4_1");
PassModeDic.set("P4_6", "P2_1");
PassModeDic.set("P4_10", "P1_1,P2_1");
PassModeDic.set("P4_11", "P2_1,P3_1,P4_1");
PassModeDic.set("P4_14", "P1_1,P2_1,P3_1");
PassModeDic.set("P4_15", "P1_1,P2_1,P3_1,P4_1");
PassModeDic.set("P5_5", "P4_1");
PassModeDic.set("P5_6", "P4_1,P5_1");
PassModeDic.set("P5_10", "P2_1");
PassModeDic.set("P5_15", "P1_1,P2_1");
PassModeDic.set("P5_16", "P3_1,P4_1,P5_1");
PassModeDic.set("P5_20", "P2_1,P3_1");
PassModeDic.set("P5_25", "P1_1,P2_1,P3_1");
PassModeDic.set("P5_26", "P2_1,P3_1,P4_1,P5_1");
PassModeDic.set("P5_30", "P1_1,P2_1,P3_1,P4_1");
PassModeDic.set("P5_31", "P1_1,P2_1,P3_1,P4_1,P5_1");
PassModeDic.set("P6_6", "P5_1");
PassModeDic.set("P6_7", "P5_1,P6_1");
PassModeDic.set("P6_15", "P2_1");
PassModeDic.set("P6_20", "P3_1");
PassModeDic.set("P6_21", "P1_1,P2_1");
PassModeDic.set("P6_22", "P4_1,P5_1,P6_1");
PassModeDic.set("P6_35", "P2_1,P3_1");
PassModeDic.set("P6_41", "P1_1,P2_1,P3_1");
PassModeDic.set("P6_42", "P3_1,P4_1,P5_1,P6_1");
PassModeDic.set("P6_50", "P2_1,P3_1,P4_1");
PassModeDic.set("P6_56", "P1_1,P2_1,P3_1,P4_1");
PassModeDic.set("P6_57", "P2_1,P3_1,P4_1,P5_1,P6_1");
PassModeDic.set("P6_62", "P1_1,P2_1,P3_1,P4_1,P5_1");
PassModeDic.set("P6_63", "P1_1,P2_1,P3_1,P4_1,P5_1,P6_1");
PassModeDic.set("P7_7", "P6_1");
PassModeDic.set("P7_8", "P6_1,P7_1");
PassModeDic.set("P7_21", "P5_1");
PassModeDic.set("P7_35", "P4_1");
PassModeDic.set("P7_120", "P2_1,P3_1,P4_1,P5_1,P6_1,P7_1");
PassModeDic.set("P7_127", "P1_1,P2_1,P3_1,P4_1,P5_1,P6_1,P7_1");
PassModeDic.set("P8_8", "P7_1");
PassModeDic.set("P8_9", "P7_1,P8_1");
PassModeDic.set("P8_28", "P6_1");
PassModeDic.set("P8_56", "P5_1");
PassModeDic.set("P8_70", "P4_1");
PassModeDic.set("P8_247", "P2_1,P3_1,P4_1,P5_1,P6_1,P7_1,P8_1");
PassModeDic.set("P8_255", "P1_1,P2_1,P3_1,P4_1,P5_1,P6_1,P7_1,P8_1");


var fonL_ = new Array();
//组合算法
function FastGroupNums(s, i, d, NumberLen, Numbers) {
    for (var n = i; n < Numbers - NumberLen + d + 1; n++) {
        if (d == NumberLen) {
            fonL_.push(s + n);
        } else {
            FastGroupNums(s + n + ",", n + 1, d + 1, NumberLen, Numbers);
        }
    }
}
function Combin(s) {
    var temp = s[0];
    for (var i = 1; i < s.length; i++) {
        temp = Multiplication(temp, s[i]);
    }
    return temp;
}
function Multiplication(a, b) {
    var result = new Array();
    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
            result.push(a[i] + "," + b[j]);
        }
    }
    return result;
}

function backtoMain() { //返回到主界面
    $("#divPage_Main").show();
    $("#divPage_Preview").hide();
    $("#divPage_Optimize").hide();
}
function backtoPreView() { //返回复式预览页面
    $("#divPage_Main").hide();
    $("#divPage_Preview").show();
    $("#divPage_Optimize").hide();
}
function openTipsByLink(linkStr, linkTitle) {
    /*if (typeof (isOpenApp) != "undefined" && isOpenApp == true) {
	   var obj = { 'urlString': linkStr, useBrowser: false, targetName: 'URL', isPageNoHeader: true };
	   MobileBase.appRoute(obj);
	} else {*/
    //创建一个div，加载iframe
    var theId = "dg_" + linkStr.split('?')[0].replace(/(.*\/)|(\.)/gi, "");
    //console.log("theId:"+theId);
    var html = "<div id='" + theId + "' class='topDgDiv'>"
     + '<div class="topbanner"><span class="topLeft"><a class="backbtn" href="#" onclick="$(\'#' + theId + '\').remove();return false;"><em class="arrow-left"></em></a></span>' + linkTitle + '</div>'
     + '<div style="-webkit-overflow-scrolling: touch;overflow-y: scroll;height:100%;"><iframe id="helpframe" src="' + linkStr + '" frameborder="0"  width="100%"  style="height:100%;overflow-y:auto;"  ></iframe></div>'
     + '</div>';
    $('body').append(html);
    $("#helpframe").css("height", ($(window).height() - $(".topDgDiv .topbanner").height() - 10) + "px");
    //}
}

function openCurPageHelp() {
    if ($("#divPage_Optimize").css("display") != "none") {
        openTipsByLink('/PlayHelp/Optimize.html', '奖金优化说明');
    } else {
        openTipsByLink("/PlayHelp/" + lotteryType + ".html", "玩法说明");
    }
}

$(function () {

    /*头部的操作*/
    $("#divPage_Main .top_drop").each(function (idx, item) {
        /*********菜单栏点击下拉展开一个选择区*/
        $(this).click(function () {
            if ($('.dialog-wrap').length > 0) {
                $.dialog.close();

            }
            else {
                var html = "";
                var curId = $(this).attr("id");
                if (curId == "top_type")
                    html = switchHtml;
                else if (curId == "top_odds_ico")
                    html = switchOddsHtml;
                else if (curId == "top_sclass_ico")
                    html = sclassHtml;

                var theId = "dg_" + $(this).attr("id");
                if (curId == "top_sclass_ico") {
                    //console.log("theId:"+theId);
                    var htmlFilter = "<div id='" + theId + "' class='topDgDiv'>"
						 + '<div class="topbanner"><span class="topLeft"><a class="backbtn" href="#" onclick="$(\'#divPage_Main\').show();$(\'#' + theId + '\').remove();return false;"><em class="arrow-left"></em></a></span>筛选</div>'
						+ html
						 + '</div>';
                    $('body').append(htmlFilter);
                    $("#divPage_Main").hide();
                } else {
                    $.dialog({
                        showTitle: false,
                        contentHtml: html,
                        overlayClose: true,
                        onClosed: function () {
                            $("#divPage_Main .top_drop").find(".arrow-up").removeClass("arrow-up").addClass("arrow-moredown");
                        }
                    });
                }
                //控制弹出窗的样式
                $(".dialog-wrap").addClass("showTopBanner");
                $(this).find(".arrow-moredown").removeClass("arrow-moredown").addClass("arrow-up");

                //加载完内容再设绑定事件(切换彩种)
                $(".switch .link").each(function (idx, item) {
                    $(this).click(function () {
                        var link = $(this).attr("data-v-href");
                        if (link != undefined && link != "")
                            location.href = link;
                    });
                });
                //加载完内容再设绑定事件(切换赔率)
                $(".switch .odds").each(function (idx, item) {
                    $(this).click(function () {
                        var key = $(this).attr("data-v-key");
                        writeCookie("company_" + groupId, key);
                        location.href = location.href;
                    });
                });

                //加载完内容再设绑定事件(切换赔率)
                $(".switchSclass .radio[name='award']").each(function (idx, item) {
                    $(this).click(function () {
                        $(".switchSclass .radio[name='award']").removeClass("selected");
                        $(this).addClass("selected");
                    });
                });
                $(".switchSclass .checkbox").each(function (idx, item) {
                    $(this).click(function () {
                        if ($(this).attr("class").indexOf("selected") > 0)
                            $(this).removeClass("selected");
                        else
                            $(this).addClass("selected");
                    });
                });
                if ($(this).attr("id") == "top_sclass_ico") { //筛选功能比较特殊，全屏
                    $(".dialog-content").addClass("dialog-content-sclass");
                    $(".dialog-wrap").addClass("fullSclassDialog");
                }
                $("#sclassBottomBtn li").each(function (idx, item) { //筛选底部的三个按钮
                    $(this).click(function () {
                        var v = $(this).attr("v");
                        if (v == "0") { //全选
                            $(".switchSclass .checkbox").each(function (idx1, item1) {
                                if ($(this).attr("class").indexOf("selected") > 0)
                                    $(this).removeClass("selected");
                                $(this).addClass("selected");
                            });
                        } else if (v == "1") { //反选
                            $(".switchSclass .checkbox").each(function (idx1, item1) {
                                if ($(this).attr("class").indexOf("selected") > 0)
                                    $(this).removeClass("selected");
                                else
                                    $(this).addClass("selected");
                            });
                        } else if (v == "2") { //确认
                            var awardIndex = $(".switchSclass .selected[name='award']").attr("data-v-key");
                            var oddTypes = new Array();
                            if ($(".switchSclass .selected[name='asiaOddType']").length < 1) {
                                alert("请至少选择1个亚盘");
                                return;
                            }
                            $.each($(".switchSclass .selected[name='asiaOddType']"), function (idx1, item1) {
                                oddTypes.push($(this).attr("data-v-key"));
                            });
                            var matchNames = new Array();
                            if ($(".switchSclass .selected[name='sclassName']").length < 1) {
                                alert("请至少选择1个联赛");
                                return;
                            }
                            $.each($(".switchSclass .selected[name='sclassName']"), function (idx1, item1) {
                                matchNames.push($(this).attr("data-v-key"));
                            });
                            var link = location.href.replace(/\&((awardIndex)|(oddTypes)|(matchNames)|(isShowHotOnly))\=[^\&]*/gi, "");
                            if (link.indexOf("?") == -1)
                                link += "?";
                            var isShowHotOnly = false;
                            if (document.getElementById("hotmatch")) {
                                if (document.getElementById("hotmatch").checked)
                                      isShowHotOnly = true;
                            }
                            link += "&awardIndex=" + awardIndex + "&oddTypes=" + escape(oddTypes.join(",")) + "&matchNames=" + escape(matchNames.join(",")) + (isShowHotOnly ? "&isShowHotOnly=true" : "");
                            location.href = link;
                        } else if (v == "3") { //五大联赛
                            var sclassList = ["英超", "意甲", "德甲", "法甲", "西甲"];
                            $("span[name=sclassName]").removeClass("selected");
                            for (var i = 0; i < sclassList.length; i++) {
                                $("span[data-v-key=" + sclassList[i] + "]").addClass("selected");
                            }
                            //var link = location.href.replace(/\&((awardIndex)|(oddTypes)|(matchNames)|(isShowHotOnly))\=[^\&]*/gi, "");
                            //if (link.indexOf("?") == -1)
                            //    link += "?";
                            //link += "&matchNames=" + escape(sclassList.join(","));
                            //location.href = link;
                        }
                    });
                });
            }
        });
    });

    $(".openhelp").click(function () {
        openTipsByLink("/PlayHelp/" + lotteryType + ".html", "玩法说明");
        //OpenPlayHelp(typeId, "玩法说明");
    });
    /*********购彩区域的操作******/
    $("#divPage_Main .betList .item").each(function (idx, item) {
        $(this).click(function () { //选号
            $(this).toggleClass("select");
            GetAllItems_FromMain();

            var isPass = true;
            var msg = "";
            if (groupId == 4 && contents.length > 15) {
                msg = '北京单场选号不能超过15场';
                isPass = false;
            } else if (groupId != 4 && contents.length > 10) {
                msg = '竞彩选号不能超过10场';
                isPass = false;
            }
            if (msg != "")
                tips(msg);

            if (!isPass)
                $(this).toggleClass("select");

            //alert($(this).parents(".match_item").attr("data-id"));

        });
    });
    var selNames = new Dictionary();
    //竞足 -- 0：胜平负过关；1：让球胜平负；2：比分过关；3：进球数过关；4：半全场胜平负；99：混合过关；
    //竞篮 -- 0：让分胜负；1：胜负；2：胜分差；3：大小分；99：混合过关；
    //北单  0:单场胜平负,1:单场进球数,2:单场上下单双,3:单场比分,4:单场半全场,5:单场胜负过关
    if (groupId == 6) {
        selNames.set(0, "胜,平,负".split(","));
        selNames.set(1, "让胜,让平,让负".split(","));
        selNames.set(2, "0:0,0:1,0:2,0:3,1:0,1:1,1:2,1:3,2:0,2:1,2:2,2:3,3:0,3:1,3:2,3:3,4:0,4:1,4:2,0:4,1:4,2:4,5:0,5:1,5:2,0:5,1:5,2:5,胜其他,平其他,负其他".split(","));
        selNames.set(3, "0,1,2,3,4,5,6,7+".split(","));
        selNames.set(4, "胜胜,胜平,胜负,平胜,平平,平负,负胜,负平,负负".split(","));
    } else if (groupId == 7) {
        selNames.set(0, "让分主胜,让分客胜".split(","));
        selNames.set(1, "主胜,客胜".split(","));
        selNames.set(2, "胜1-5分,胜6-10分,胜11-15分,胜16-20分,胜21-25分,胜26分以上,负1-5分,负6-10分,负11-15分,负16-20分,负21-25分,负26分以上".split(","));
        selNames.set(3, "大,小".split(","));
    } else if (groupId == 4) {
        selNames.set(0, "胜,平,负".split(",")); //单场胜平负
        selNames.set(1, "0,1,2,3,4,5,6,7+".split(",")); //单场进球数
        selNames.set(2, "上单,上双,下单,下双".split(",")); //单场上下单双
        selNames.set(3, "0:0,0:1,0:2,0:3,1:0,1:1,1:2,1:3,2:0,2:1,2:2,2:3,3:0,3:1,3:2,3:3,4:0,4:1,4:2,0:4,1:4,2:4,胜其他,平其他,负其他".split(",")); //单场比分
        selNames.set(4, "胜胜,胜平,胜负,平胜,平平,平负,负胜,负平,负负".split(",")); //单场半全场
        selNames.set(5, "胜,负".split(",")); //单场胜负过关
    }
    //选号区打开大弹窗
    $("#divPage_Main .openItemBox").each(function (idx, item) {
        openItemsBox(item);
       
    });

    //点击打开参考数据
    $("#divPage_Main .list_main .left1").each(function (idx, item) {
        $(this).click(function () {
            var refDataDiv = $(this).parents(".match_item").find(".refData");
            var refDataV = eval("'" + refDataDiv.attr("data-v") + "'");
            var json = eval("(" + refDataV + ")");
            var html = refDataDiv.html().replace(/\s/gi, "");
            if (html.indexOf("table") == -1) {
                html = "<span class='ref_arrow_up'></span><table cellspacing='0' cellpadding='0'>";
                var titles = ["排名", "近期战绩", "历史交锋", "", "", "", "", "", "", ""];
                for (var i = 0; i < json.length; i++) {
                    var details = json[i]["details"];
                    if (details != undefined) {
                        html += "<tr><td>" + titles[i] + "</td>";
                        if (details.length == 1) {
                            html += "<td colspan='2'>" + details[0] + "</td>";
                        } else {
                            html += "<td>" + details[0] + "</td>";
                            html += "<td>" + details[1] + "</td>";
                        }
                        html += "</tr>";
                    }
                }
                html += "</table>";
                refDataDiv.html(html);
            }

            if (refDataDiv.is(":hidden")) { //显示隐藏
                $(this).find(".bet_arrow_down").addClass("bet_arrow_up");
                refDataDiv.show();
            } else {
                $(this).find(".bet_arrow_down").removeClass("bet_arrow_up");
                refDataDiv.hide();
            }
        });
    });

    function openItemDlg(matchid) {
        //  var boxV = eval("'" + $(item).attr("data-v") + "'");
        var oRecord = findRecordByMatchID(matchid);
        var boxJson = oRecord.oddsList;        
        if (GetQueryString("gid") == 7) {
            //整理顺序
            var playDic = new Dictionary();
            for (var i = 0; i < boxJson.length; i++)
            {
                playDic.set(boxJson[i].playType, boxJson[i]);
            }
            var newboxJson = new Array();
            if (playDic.has("1")) newboxJson.push(playDic.get("1")); //非让分
            if (playDic.has("0")) newboxJson.push(playDic.get("0")); //让分
            if (playDic.has("3")) newboxJson.push(playDic.get("3")); //大小分
            if (playDic.has("2")) newboxJson.push(playDic.get("2")); //胜分差
            boxJson = newboxJson;
        }
        var main_match_item = $("#divPage_Main .match_item[data-id='" + matchid + "']");
        var html = "<div class='opendlgd' mid='" + matchid + "' schid='" + oRecord.scheduleId + "'  >";
        //tmp console.log(boxJson);
        if (type != 3) {
            $.each(boxJson, function (idxJson, subJson) { //{"playType":4,"isHasSingle":true,"odds":[4.0,13.0,27.0,5.4,4.7,5.4,27.0,13.0,4.0]}
                function tdHtml(data_idx) {
                    return "<td class='item_tmp' data-idx='" + data_idx + "' data-playtype='" + subJson.playType + "'>" + selNames.get(subJson.playType)[data_idx] + "<sp>" + subJson.odds[data_idx] + "</sp></td>";
                }
                function divHtml(data_idx) {
                    return "<div class='item_tmp rowcol' data-idx='" + data_idx + "' data-playtype='" + subJson.playType + "'>" + selNames.get(subJson.playType)[data_idx] + "<sp>" + subJson.odds[data_idx] + "</sp></div>";
                }
                html += "<table class='openItemTable'>";
                if (groupId == 6) { //竞彩足球 0：胜平负过关；1：让球胜平负；2：比分过关；3：进球数过关；4：半全场胜平负；99：混合过关；
                    if (subJson.playType == 0) {
                        // html += "<tr><td class='tdP tdP_" + subJson.playType + "'>非让球</td>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + "</tr>";
                        html += "<tr><td class='tdP line12  tdP_" + subJson.playType + "'>非让球</td><td><div class='floatrow jcball'>" + divHtml(0) + divHtml(1) + divHtml(2) + "</div></td></tr>";
                    } else if (subJson.playType == 1) {
                        // html += "<tr><td class='tdP tdP_" + subJson.playType + "'>让<br/>" + main_match_item.find(".polygoal").html() + "</td>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + "</tr>";
                        var tdclass = "tdP_5";
                        if (parseInt(main_match_item.find(".polygoal").html()) > 0) tdclass = "tdP_1";
                        html += "<tr  ><td class='tdP " + tdclass + "'>让<br/>" + main_match_item.find(".polygoal").html() + "</td><td><div class='floatrow jcball'>" + divHtml(0) + divHtml(1) + divHtml(2) + "</div></td></tr>";
                    } else if (subJson.playType == 2) {
                        html += "<tr class='trrow1' ><td class='tdP tdP_" + subJson.playType + "' rowspan='7'>比<br>分</td>" + tdHtml(4) + tdHtml(8) + tdHtml(9) + tdHtml(12) + tdHtml(13) + "</tr>"
                         + "<tr class='trrow1' >" + tdHtml(14) + tdHtml(16) + tdHtml(17) + tdHtml(18) + tdHtml(22) + "</tr>"
                         + "<tr class='trrow1' >" + tdHtml(23) + tdHtml(24) + "<td class='item_tmp' data-idx='28' data-playtype='2' colspan='3'>胜其他<sp>" + subJson.odds[28] + "</sp></td>" + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(0) + tdHtml(5) + tdHtml(10) + tdHtml(15) + "<td class='item_tmp' data-idx='29' data-playtype='2'>平其他<sp>" + subJson.odds[29] + "</sp></td>" + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(1) + tdHtml(2) + tdHtml(6) + tdHtml(3) + tdHtml(7) + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(11) + tdHtml(19) + tdHtml(20) + tdHtml(21) + tdHtml(25) + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(26) + tdHtml(27) + "<td class='item_tmp' data-idx='30' data-playtype='2' colspan='3'>负其他<sp>" + subJson.odds[30] + "</sp></td>" + "</tr>";
                    } else if (subJson.playType == 3) {
                        html += "<tr class='trrow1' ><td class='tdP tdP_" + subJson.playType + "' rowspan='2'>进<br>球<br>数</td>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + tdHtml(3)
                         + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(4) + tdHtml(5) + tdHtml(6) + tdHtml(7) + "</tr>";
                    } else if (subJson.playType == 4) {
                        html += "<tr class='trrow1'><td class='tdP tdP_" + subJson.playType + "' rowspan='3'>半<br>全<br>场</td>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + "</tr><tr class='trrow1'>"
                        + tdHtml(3) + tdHtml(4) + tdHtml(5) + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(6) + tdHtml(7) + tdHtml(8) + "</tr>";
                    }
                } else if (groupId == 7) { //竞彩篮球 0：胜负；1：让分胜负；2：胜分差；3：大小分；99：混合过关；
                    if (subJson.playType == 0) {
                        var tdclass = "tdP_5";
                        if (parseInt(main_match_item.find(".polygoal").html()) > 0) tdclass = "tdP_1";
                        html += "<tr><td class='tdP " + tdclass + "'>让分</td><td><div class='floatrow jcball'>" + divHtml(0) + "<div class='lqrq'><div class='pos-center-parent'><div class='pos-center'>" + main_match_item.find(".polygoal").html() + "</div></div></div>" + divHtml(1) + "</div></td></tr>";
                    } else if (subJson.playType == 1) {
                        html += "<tr><td class='tdP  line12 tdP_0'>胜负</td><td><div class='floatrow jcball'>" + divHtml(0) + divHtml(1) +  "</div></td></tr>";
                    }  else if (subJson.playType == 2) {
                        html += "<tr class='trrow1'><td class='tdP tdP_" + subJson.playType + "' rowspan='4'>胜<br>分<br>差</td>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + "</tr><tr  class='trrow1'>"
                        + tdHtml(3) + tdHtml(4) + tdHtml(5) + "</tr>"
                        + "<tr class='trrow1'>" + tdHtml(6) + tdHtml(7) + tdHtml(8) + "</tr>"
                        + "<tr class='trrow1'>" + tdHtml(9) + tdHtml(10) + tdHtml(11) + "</tr>";
                    } else if (subJson.playType == 3) {
                        html += "<tr><td class='tdP line12  tdP_" + subJson.playType + "'>大小分</td><td><div class='floatrow jcball'>" + divHtml(0) + "<div class='lqdxf'><div class='pos-center-parent'><div class='pos-center'>" + main_match_item.find(".zf").html() + "</div></div></div>" + divHtml(1) + "</div></td></tr>";
                    }
                } else if (groupId == 4) { //0:单场胜平负,1:单场进球数,2:单场上下单双,3:单场比分,4:单场半全场,5:单场胜负过关
                    if (subJson.playType == 0) {
                        var i_rf = parseInt(main_match_item.find(".polygoal").html())
                        var colorClass = "tdP_" + (i_rf == 0 ? "0" : i_rf > 0 ? "1" : "5");
                        html += "<tr class='trrow1'><td class='tdP " + colorClass + "' >" + main_match_item.find(".polygoal").html() + "</td>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + "</tr>";
                    } else if (subJson.playType == 1) {
                        html += "<tr class='trrow1'><td class='tdP tdP_" + subJson.playType + "' rowspan='2'>进<br>球<br>数</td>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + tdHtml(3)
                                            + "</tr>"
                                            + "<tr>" + tdHtml(4) + tdHtml(5) + tdHtml(6) + tdHtml(7) + "</tr>";
                    } else if (subJson.playType == 2) {
                        html += "<tr class='trrow1'>" + tdHtml(0) + tdHtml(1) + tdHtml(2) + +tdHtml(3) + "</tr>";
                    }
                    else if (subJson.playType == 3) {//<td class='tdP tdP_" + subJson.playType + "' rowspan='5'>比<br>分</td>
                        html += "<tr class='trrow1'>" + tdHtml(4) + tdHtml(8) + tdHtml(9) + tdHtml(12) + tdHtml(13) + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(14) + tdHtml(16) + tdHtml(17) + tdHtml(18) + tdHtml(22) + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(0) + tdHtml(5) + tdHtml(10) + tdHtml(15) + tdHtml(23) + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(1) + tdHtml(2) + tdHtml(6) + tdHtml(3) + tdHtml(7) + "</tr>"
                         + "<tr class='trrow1'>" + tdHtml(11) + tdHtml(19) + tdHtml(20) + tdHtml(21) + tdHtml(24) + "</tr>";
                    } else if (subJson.playType == 4) {
                        //胜胜,胜平,胜负,平胜,平平,平负,负胜,负平,负负
                        html += "<tr class='trrow1'>" + tdHtml(0) + tdHtml(2) + tdHtml(3) + "</tr>"
                                           + "<tr class='trrow1'>" + tdHtml(4) + tdHtml(5) + tdHtml(6) + "</tr>"
                                           + "<tr class='trrow1'>" + tdHtml(7) + tdHtml(8) + tdHtml(9) + "</tr>"
                    } else if (subJson.playType == 5) {
                        var rf = parseFloat(main_match_item.find(".polygoal").html());
                        html += "<tr class='trrow1'>" + tdHtml(0) + "<td class='sfrftxt" + (rf < 0 ? " rf_green" : " rf_red") + "'>" + main_match_item.find(".polygoal").html() + "</td>" + tdHtml(1) + "</tr>";
                    }
                }
                html += "</table>";
            });
        } else {
            html += "<table class='openItemTable'>"
            if (oRecord.rf < 0) {
                html += "<tr class='trrow1'>" + "<td class='item_tmp' data-idx='0' data-playtype='0'>主胜<sp>" + oRecord.oddsList[0].odds[0] + "</sp></td>"
                               + "<td class='item_tmp' data-idx='2' data-playtype='1'>客不败<sp>" + oRecord.oddsList[1].odds[2] + "</sp></td>"
                               + "</tr>";
            } else if (oRecord.rf > 0) {
                html += "<tr class='trrow1'>" + "<td class='item_tmp' data-idx='0' data-playtype='1'>主不败<sp>" + oRecord.oddsList[1].odds[0] + "</sp></td>"
                                          + "<td class='item_tmp' data-idx='2' data-playtype='0'>客胜<sp>" + oRecord.oddsList[0].odds[2] + "</sp></td>"
                                          + "</tr>";
            }
            html += "</table>";
        }
        html += "</div>";
        var item = $(".match_item[data-id=" + matchid + "]").find(".openItemBox");


        $("#dialog_content_d2").html(html);
        $("#dialog-title1").html(oRecord.homeTeam + " VS " + oRecord.guestTeam);
        $("#seldialog").OpenZdyDialog();
        function selbind() {
            var tmp1 = ";" + $(item).attr("data-select");
            $(".item_tmp").each(function (idx1, item1) {
                //绑定上一轮所选
                var data_playtype = parseInt($(this).attr("data-playtype"));
                var data_idx = parseInt($(this).attr("data-idx"));
                var outItem = main_match_item.find(".item[data-idx='" + data_idx + "'][data-playtype='" + data_playtype + "']");

                //console.log(tmp1+"\r\noutItem:"+outItem.length+"\r\n"+data_playtype+","+data_idx+"\r\n"+tmp1.indexOf(";"+data_playtype+","+data_idx+";"));

                if (outItem.length > 0) { //如果外面有选号，则选中
                    if (outItem.hasClass("select"))
                        $(this).toggleClass("select");
                } else if (tmp1.indexOf(";" + data_playtype + "," + data_idx + ",") != -1) {
                    $(this).toggleClass("select");
                }
                //绑定按钮事件
                $(this).click(function () {
                    $(this).toggleClass("select");
                });
            });
            //$(".dialog-content").width("95%");
        }
        selbind();
        $("#dialogbtn_cancel").unbind("click").click(function () {
            $("#seldialog").CloseZdyDialog();
        });
        $("#dialogbtn_ok").unbind("click").click(function () {
            var tmpList = new Array();
            var showTmpList = new Array();
            var tmpPreList = new Array(); //预览需要绑定的
            //先把外面单独的选号区选号去掉
            main_match_item.find(".betList .select").toggleClass("select");
           
            //把可以非弹出的选项模拟点击，其他就记录起来
            $(".openItemTable .select").each(function (idx1, item1) {
                var data_playtype = parseInt($(this).attr("data-playtype"));
                var data_idx = parseInt($(this).attr("data-idx"));
                //1、选号区，则模拟选号区，2、预览区，则模拟预览区
                var outMainItem = main_match_item.find(".item[data-idx='" + data_idx + "'][data-playtype='" + data_playtype + "']");
                var curItem = data_playtype + "," + data_idx + "," + $(item1).html();
                if (outMainItem.length > 0) { //如果外面有选号，则模拟点击
                    if (!outMainItem.hasClass("select"))
                        outMainItem.toggleClass("select");
                } else {
                    tmpList.push(curItem);
                    showTmpList.push(formatBoxItemShow(curItem));
                }
            });
            $(item).attr("data-select", tmpList.join(";"));
            if ($(item).attr("data-oritips") == undefined)
                $(item).attr("data-oritips", $(item).html());

            if (showTmpList.length > 0) {
                var data_s = parseInt($(item).attr("data-s"));
                if (data_s == 0) {
                    $(item).html("<div class='ellipsisBox'>" + showTmpList.join(",") + "</div>")
                    $(item).find(".ellipsisBox").width($(item).width() - 5);
                } else if (data_s == 1) {
                    $(item).html("<div class='center'>已选<nowrap>" + ($(".openItemTable .select").length) + "</nowrap>项</div>");
                }
                $(item).addClass("select");
            } else { //没有选号就用回原来的显示
                $(item).html($(item).attr("data-oritips"));
                $(item).removeClass("select");
            }
            GetAllItems_FromMain();          
            $("#seldialog").CloseZdyDialog();
            RefreshPreMainMatch(matchid);
        });

        //$.dialog({
        //    type: 'confirm',
        //    titleText: oRecord.homeTeam + " VS " + oRecord.guestTeam,
        //    overlayClose: false,
        //    contentHtml: html,
        //    buttonText: {
        //        ok: '确定',
        //        cancel: '取消'
        //    },
        //    onShow: function () {
        //        var tmp1 = ";" + $(item).attr("data-select");
        //        $(".item_tmp").each(function (idx1, item1) {
        //            //绑定上一轮所选
        //            var data_playtype = parseInt($(this).attr("data-playtype"));
        //            var data_idx = parseInt($(this).attr("data-idx"));
        //            var outItem = main_match_item.find(".item[data-idx='" + data_idx + "'][data-playtype='" + data_playtype + "']");	           

        //            //console.log(tmp1+"\r\noutItem:"+outItem.length+"\r\n"+data_playtype+","+data_idx+"\r\n"+tmp1.indexOf(";"+data_playtype+","+data_idx+";"));

        //            if (outItem.length > 0) { //如果外面有选号，则选中
        //                if (outItem.hasClass("select"))
        //                    $(this).toggleClass("select");
        //            } else if (tmp1.indexOf(";" + data_playtype + "," + data_idx + ",") != -1) {
        //                $(this).toggleClass("select");
        //            }
        //            //绑定按钮事件
        //            $(this).click(function () {
        //                $(this).toggleClass("select");
        //            });
        //        });
        //        $(".dialog-content").width("95%");
        //    },
        //    onClickOk: function () {
        //        var tmpList = new Array();
        //        var showTmpList = new Array();
        //        var tmpPreList = new Array(); //预览需要绑定的
        //        //先把外面单独的选号区选号去掉
        //        if (type < 10) //竞彩足球打开的框框包括全部玩法，所以需要清除外面的再选
        //        {
        //            main_match_item.find(".betList .select").toggleClass("select");
        //        }

        //        //把可以非弹出的选项模拟点击，其他就记录起来
        //        $(".openItemTable .select").each(function (idx1, item1) {
        //            var data_playtype = parseInt($(this).attr("data-playtype"));
        //            var data_idx = parseInt($(this).attr("data-idx"));
        //            //1、选号区，则模拟选号区，2、预览区，则模拟预览区
        //            var outMainItem = main_match_item.find(".item[data-idx='" + data_idx + "'][data-playtype='" + data_playtype + "']");
        //            var curItem = data_playtype + "," + data_idx + "," + $(item1).html();
        //            if (outMainItem.length > 0) { //如果外面有选号，则模拟点击
        //                if (!outMainItem.hasClass("select"))
        //                    outMainItem.toggleClass("select");	                   
        //            } else {
        //                tmpList.push(curItem);
        //                showTmpList.push(formatBoxItemShow(curItem));
        //            }
        //        });
        //        $(item).attr("data-select", tmpList.join(";"));
        //        if ($(item).attr("data-oritips") == undefined)
        //            $(item).attr("data-oritips", $(item).html());

        //        if (showTmpList.length > 0) {
        //            var data_s = parseInt($(item).attr("data-s"));
        //            if (data_s == 0) {
        //                $(item).html("<div class='ellipsisBox'>" + showTmpList.join(",") + "</div>")
        //                $(item).find(".ellipsisBox").width($(item).width() - 5);
        //            } else if (data_s == 1) {
        //                $(item).html("<div class='center'>已选<nowrap>" + ($(".openItemTable .select").length) + "</nowrap>项</div>");
        //            }
        //            $(item).addClass("select");
        //        } else { //没有选号就用回原来的显示
        //            $(item).html($(item).attr("data-oritips"));
        //            $(item).removeClass("select");
        //        }
        //        GetAllItems_FromMain();
        //        RefreshPreMainMatch(matchid);
        //    }
        //});
    }

    function RefreshPreMainMatch(matchid) {
        var Pre_betcontent = $(".betcontent[mid=" + matchid + "]");
        if (typeof (postData.contents) != "undefined") {
            var contents = postData.contents;
            var isfound = false;
            for (var i = 0; i < contents.length; i++) {
                var content = contents[i];
                if (content.matchId == matchid) {
                    var record = findRecordByMatchID(matchid);
                    var LtType = postData.lotteryType;
                    var curHtml = "<table>" + GetRowHTML(LtType, content.content, record) + "</table>";
                    $(Pre_betcontent).html(curHtml);
                    isfound = true;
                    return;
                }
            }
            if (isfound == false) {
                var curHtml = "<div class='non-selmatch' >请选择</div>";
                $(Pre_betcontent).html(curHtml);
            }
        } else {
            if ($("#divPage_Preview").css("display") != "none")
                checkgomaim();
        }
    }
    //打开选号弹窗  只要data-v格式统一，打开的方式和方法都一样
    function openItemsBox(item) {
        $(item).click(function () {
            openItemDlg($(this).attr("mid"));
            return;           
        });
    }
    //data_playtype+","+data_idx+","+$(item1).html()
    function formatBoxItemShow(item1) {
        var tmpL = item1.split(',');
        var tmp = tmpL[2].split('<')[0];
        if (groupId == 6 && type != 3) {
            if (tmpL[0] == "1" && tmp.indexOf('让') == -1)
                tmp = "让" + tmp;
            else if (tmpL[0] == "3" && tmp.indexOf('球') == -1)
                tmp = tmp + "球";
        } else if (groupId == 7) {
            if (tmpL[0] == "0" && tmp.indexOf('让分') == -1)
                tmp = "让分" + tmp;
        }
        return tmp;
    }

    /**********第一版页面底部的操作按钮*/
    var contents = new Array(); //选号，格式“[2327001][0,1#0_0,1#1]”，ID放第一位方便排序  ["胜","平","让球胜","让球平"]
    var minStopTime = undefined;
    function GetAllItems_FromMain() { //获取选号区的所有选号
        minStopTime = undefined;
        var tmpList = new Array(); //临时变量，“[2327001][0][1][false]”ID，playtype，选项index，是否支持单关
        $("#divPage_Main .betList .select").each(function (idx, item) {
            var id = $(this).parents("#divPage_Main .match_item").attr("data-id");
            var playType = $(this).attr("data-playtype");
            var keyIndex = $(this).attr("data-idx");
            var canSingle = ($(this).parents(".betList").attr("data-single") == "1");
            tmpList.push([id, playType, keyIndex, canSingle]);
        });
        //弹出窗选择的内容
        $("#divPage_Main .openItemBox[class$='select']").each(function (idx, item) {
            //2,8;2,14;2,16
            var matchItem = $(this).parents("#divPage_Main .match_item");
            var id = matchItem.attr("data-id");
            $.each($(this).attr("data-select").split(';'), function (idx1, item1) {
                var playType = item1.split(',')[0];
                var keyIndex = item1.split(',')[1];
                var canSingle = (type == 1 || type == 12) //(matchItem.find(".item[data-idx='"+keyIndex+"'][data-playtype='"+playType+"']").parents(".betList").attr("data-single") == "1");
                tmpList.push([id, playType, keyIndex, canSingle]);
            });

        });

        //做好排序，从小到大，后面方便取值
        tmpList.sort(function (a, b) {
            if (a[0] == b[0]) {
                if (a[1] == b[1]) {
                    return a[2] - b[2];
                } else
                    return a[1] - b[1];
            } else
                return a[0] - b[0];
        });
        //console.log(tmpList);

        //{"playType":99,"passModes":["P2_1"],"contents":[{"matchId":2327001,"content":"0,1#0_0,1#1"},{"matchId":2327002,"content":"1#0_0,1#1"}],"lotteryType":10011}
        contents = new Array();
        var lastId = 0;
        $.each(tmpList, function (idx, itemList) {
            var id = itemList[0];
            if (lastId != id) {
                var subMatch = new Object();
                subMatch.matchId = id;
                subMatch.content = "";
                subMatch.isSingle = itemList[3];
                subMatch.stopTime = $("#divPage_Main .match_item[data-id='" + id + "']").attr("data-stoptime"); //data-stoptime
                subMatch.dan = ($("#dan_" + id).val() == "1");
                if (minStopTime == undefined || new Date(subMatch.stopTime).getTime() < minStopTime.getTime())
                    minStopTime = new Date(subMatch.stopTime);

                var lastPlayType = itemList[1];
                var tmp = "";
                for (var k = idx; k < tmpList.length; k++) {
                    if (id != tmpList[k][0])
                        break;
                    var curPlayType = tmpList[k][1];
                    if (lastPlayType != curPlayType && tmp != "") {
                        subMatch.content += tmp.replace(/\,$/gi, "") + "#" + lastPlayType + "_";
                        tmp = "";
                    }
                    tmp += tmpList[k][2] + ",";
                    if (!tmpList[k][3])
                        subMatch.isSingle = false;
                    lastPlayType = curPlayType;
                }
                if (tmp != "")
                    subMatch.content += tmp.replace(/\,$/gi, "") + "#" + lastPlayType;
                contents.push(subMatch);
                lastId = id;
            }
        });
        //console.log(JSON.stringify(contents));
        $("#stopTimePre").html("截止时间：" + (minStopTime ? minStopTime.Format("yyyy-MM-dd HH:mm").replace("undefined", "") : ""));

        //如果这场比赛所有赛事都没选，则取消定胆，并且设为不可选
        $(".betZone input[type='hidden']").val("0");
        $(".preItemTable .dan").addClass("disable");
        $(".preItemTable .dan").removeClass("select");
        $.each(contents, function (idx, item) {
            var danItems = $("#divPage_Preview .match_item[data-id='" + item.matchId + "']").find(".dan");
            danItems.removeClass("disable");
            if (item.dan) {
                $("#dan_" + item.matchId).val("1")
                if (!danItems.hasClass("select"))
                    danItems.addClass("select");
            }
        });

        displayPassMode(); //绑定过关方式
    }

    var postData = new Object(); //最后提交到后端的对象
    function formatPostData() { //把contents里的投注内容转化为专门格式
        postData = new Object();
        postData.playType = playType;
        postData.lotteryType = lotteryType;
        postData.bettingCategory = bettingCategory;
        var tmphidPassMode = ($("#hidPassMode").length > 0 ? $("#hidPassMode").val().split(';') : new Array());
        if (tmphidPassMode.length >= 3)
            postData.passModes = tmphidPassMode[1].split(',');
        var tmpTips = "";
        if (contents.length == 0) {
            tmpTips = (typeId == 11 ? "请至少选择3场比赛" : "请至少选择1场单关赛事或2场过关赛事!");
        } else if (contents.length == 1 && groupId != 4 || type == 1 || type == 12) { //判断是否是单关赛事
            if (contents[0].isSingle) {
                //{"contents":[{"content":"0|1,1|1#0","dan":false,"matchId":2329008}],"lotteryType":10011,"passModes":["P1_1"],"playType":99}
                postData.passModes = ["P1_1"];
                //选项|倍数,选项|倍数#玩法     "0,1#0"要转化为"0|1,1|1#0"
                //var defaultTimes = 1;
                /*contents[0].dan = false;
				contents[0].content = contents[0].content.replace(/\,/gi, "|1,").replace(/\#/gi, "|1#");*/
                //重新组合，把复式投注的选项转化为单关的单式（每个选项都有倍数）的格式
                $.each(contents, function (idx, item) {
                    item.dan = false;
                    /*var newContent = new Array();
					$.each(item.content.split('_'),function(idx1,item1){//0,1#0_0,1#1
					var curPlayType = item1.split('#')[1];
					var subContentList = new Array();
					$.each(item1.split('#')[0].split(','),function(idx2,item2){//0,1
					var timeTag = $(".match_single[data-id='"+item.matchId+"']").find(".subSingle[data-idx='"+item2+"'][data-playtype='"+curPlayType+"']").find(".s_times");
					var subTime = (timeTag.length==0?defaultTimes:isNaN(parseInt(timeTag.val())) ? 0 : parseInt(timeTag.val()));
					subContentList.push(item2+"|"+subTime);
					});
					newContent.push(subContentList.join(",")+"#"+curPlayType);
					});
					item.content = newContent.join("_");*/
                    item.content = splitMulToSingleItems(item.content, item.matchId);
                });
                postData.contents = contents;
                postData.OddsType = 1; //单式投注内容
                postData.playType = 99;
                postData.bettingCategory = (groupId == 7 ? 2 : 1);
            } else
                tmpTips = (typeId == 11 ? "请至少选择3场比赛" : "请至少选择1场单关赛事或2场过关赛事!!");
        } else {
            //{"playType":99,"passModes":["P2_1"],"contents":[{"matchId":2327001,"content":"0,1#0_0,1#1"},{"matchId":2327002,"content":"1#0_0,1#1"}],"lotteryType":10011}
            postData.contents = contents;
            postData.OddsType = 2; //复式投注内容
        }

        return tmpTips;
    }
    //把复式投注内容转化为一个个的单式选项（单场比赛）
    function splitMulToSingleItems(item_mulcontent, matchId) {
        var newContent = new Array();
        var defaultTimes = 1;
        $.each(item_mulcontent.split('_'), function (idx1, item1) { //0,1#0_0,1#1
            var curPlayType = item1.split('#')[1];
            var subContentList = new Array();
            $.each(item1.split('#')[0].split(','), function (idx2, item2) { //0,1
                var timeTag = $(".match_single[data-id='" + matchId + "']").find(".subSingle[data-idx='" + item2 + "'][data-playtype='" + curPlayType + "']").find(".s_times");
                var subTime = (timeTag.length == 0 ? defaultTimes : isNaN(parseInt(timeTag.val())) ? 0 : parseInt(timeTag.val()));
                subContentList.push(item2 + "|" + subTime);
            });
            newContent.push(subContentList.join(",") + "#" + curPlayType);
        });
        return newContent.join("_");
    }
    function verifyContents() {
        var tmpTips = "";
        if (contents.length == 0) {
            tmpTips = (typeId == 11 ? "请至少选择3场比赛" : "请至少选择1场单关赛事或2场过关赛事!!!");
        } else if (contents.length == 1 && typeId != 11) { //判断是否是单关赛事
            if (groupId != 4 && !contents[0].isSingle)
                tmpTips = (typeId == 11 ? "请至少选择3场比赛" : "请至少选择1场单关赛事或2场过关赛事!!!!");
        }
        else if (contents.length <= 2 && typeId == 11) { //判断是否是单关赛事
            tmpTips = (typeId == 11 ? "请至少选择3场比赛" : "请至少选择1场单关赛事或2场过关赛事!!!!");
        }
        return tmpTips;
    }

    $("#bt_clear").click(function () { //清空
        $(".betList .select").removeClass("select");
        $(".betList input[type='hidden']").val("0");

        $(".openItemBox").attr("data-select", "");
        $(".openItemBox").each(function (idx, item) {
            if ($(this).hasClass("select")) {
                $(this).html($(this).attr("data-oritips"));
                $(this).removeClass("select");
            }
        });

        GetAllItems_FromMain();
    });

    function checkgomaim() {
        var tmpTips = verifyContents();
        if (tmpTips) {
            tips(tmpTips);
            backtoMain();
        }
    }

    $("#bt_submitChoose").click(function () { //确认  第一步
        //console.log(JSON.stringify(contents));
        //整理一下第一版面的选号，符合条件才跳入预览页
        var tmpTips = verifyContents();
        if (tmpTips != "") {
            tips(tmpTips);
        } else {
            var preHtml = "";
            if (postData.OddsType == 1) { //单关投注的显示（单式）
                //把预览内容Html显示出来
                $.each(contents, function (idx, subMatch) {
                    //此处item还是复式选号的格式{"matchId":2327001,"content":"0,1#0_0,1#1"}
                    var mainMatch = $("#divPage_Main .match_item[data-id='" + subMatch.matchId + "']");
                    if (mainMatch.length > 0) {
                        //1|1,2|1,3|1#3_4|1,5|1,8|1#2
                        preHtml += "<div class='match_single' data-id=\"" + subMatch.matchId + "\" data-stoptime=\"" + subMatch.stopTime + "\">";
                        //tmp console.log(mainMatch.find(".polygoal")[0]);
                        var polyGoal = mainMatch.find(".polygoal");
                        if (polyGoal.length > 0)
                            polyGoal = "<span class='" + polyGoal.attr("class") + "'>" + polyGoal.html() + "</span>";
                        preHtml += "<div class='singleTitle'><span class=\"matchNo\">" + mainMatch.find(".matchNo").html() + "</span>" + mainMatch.find(".analysis home").html() + (polyGoal.length > 0 ? "(" + polyGoal + ")" : "") + " vs " + mainMatch.find(".analysis guest").html() + "</div>";
                        preHtml += "<table cellspacing='0' cellpadding='0'>";
                        $.each(subMatch.content.split('_'), function (idx1, item1) {
                            var curPlayType = item1.split('#')[1]; //竞足 -- 0：胜平负过关；1：让球胜平负；2：比分过关；3：进球数过关；4：半全场胜平负；99：混合过关；//竞篮 -- 0：让分胜负；1：胜负；2：胜分差；3：大小分；99：混合过关；
                            var curTypeName = "";
                            if (groupId == 6)
                                curTypeName = (curPlayType == 0 ? "胜平负" : curPlayType == 1 ? "让球" : curPlayType == 2 ? "比分" : curPlayType == 3 ? "进球数" : curPlayType == 4 ? "半全场" : "竞足");
                            else if (groupId == 7)
                                curTypeName = (curPlayType == 0 ? "让分" : curPlayType == 1 ? "胜负" : curPlayType == 2 ? "胜分差" : curPlayType == 3 ? "大小分" : "竞篮");
                            $.each(item1.split('#')[0].split(','), function (idx2, item2) {
                                var mainItem = mainMatch.find(".item[data-idx='" + item2.split('|')[0] + "'][data-playtype='" + curPlayType + "']");
                                var htmlShow = "";
                                if (mainItem.length > 0)
                                    htmlShow = mainItem.html();
                                else { //查查是不是弹窗显示的，弹窗选号的就其他处理方式
                                    mainItem = mainMatch.find(".openItemBox[class$='select']");
                                    if (mainItem.length > 0) {
                                        $.each(mainItem.attr("data-select").split(';'), function (idx3, item3) {
                                            if (item3.indexOf(curPlayType + "," + item2.split('|')[0] + ",") != -1) {
                                                htmlShow = item3.split(',')[2];
                                                return false;
                                            }
                                        });
                                    }
                                }
                                htmlShow = htmlShow.replace(/\<sp\>/gi, "(<sp>").replace(/\<\/sp\>/gi, "</sp>)");

                                preHtml += "<tr class='subSingle' data-idx='" + item2.split('|')[0] + "' data-playtype='" + curPlayType + "'>"
								 + "<td style='width:12%;'><span class=\"cancelMatch\">×</span></td>"
								 + "<td style='width:18%;'>" + curTypeName + "</td>";
                                preHtml += "<td style='text-align:left;'><span class='s_Item'>" + htmlShow + "</span><br><span class='s_bonus'></span></td>";
                                preHtml += "<td style='width:25%;'><input class=\"s_times\" type=\"text\" value=\"" + item2.split('|')[1] + "\">倍</td>";
                                preHtml += "</tr>";
                            });
                        });
                        preHtml += "</table></div>";

                    }
                });
                $("#preItemList").html(preHtml);
                //取消单式的某场选项
                $("#preItemList .cancelMatch").each(function () {
                    $(this).click(function () {
                        var matchId = $(this).parents(".match_single").attr("data-id");
                        var subSingle = $(this).parents(".subSingle");

                        $(".match_item[data-id='" + matchId + "']").find(".item[data-idx='" + subSingle.attr("data-idx") + "'][data-playtype='" + subSingle.attr("data-playtype") + "']").trigger("click");

                        if ($(this).parents(".match_single").find(".subSingle").length == 1)
                            $(this).parents(".match_single").remove(); //如果最后一个选项则直接把该场比赛删掉
                        else
                            subSingle.remove(); //把当前场次删除

                        var curTips = verifyContents(); //检查删除后的选号是否允许发起方案
                        GetAllItems_FromMain();
                        if (curTips != "") {
                            tips(curTips);
                            backtoMain(); //不符合场次要求就返回主界面
                        }
                    });
                });
                //单关的倍数变化
                $("#preItemList .s_times").each(function () {
                    $(this).change(function () {
                        changeSingleNoteCount($(this));
                    });
                    $(this).keyup(function () {
                        changeSingleNoteCount($(this));
                    });
                    $(this).blur(function () {
                        changeSingleNoteCount($(this));
                    });
                });
                batchSingleCount();

                //过关方式区域
                preHtml = "<div style='text-align: center;padding: 5px 0px 5px 0px;'>每注认购<input id=\"s_all_times\" class=\"times\" style='width:80px;' type=\"text\" value=\"1\">倍</div>";
                $("#bottomLevel2").html(preHtml);
                $("#s_all_times").blur(function () { //批量修改倍数
                    $("#preItemList .s_times").val($(this).val());
                    batchSingleCount();
                });

                //预览区底部按钮
                preHtml = "<table cellspacing='0' cellpadding='0'>"
					 + "<tr>"
					 + "    <td style=\"text-align:left;font-size:12px;line-height:18px;padding-left:10px;\"><div id=\"pre_info\"></div><div id=\"bt_preBonus\"></div></td>"
					 + "    <td style=\"width:30%;display:none;\"><button id=\"bt_submit\" class=\"b_submit dobuy\">提交彩店</button></td>"
					 + "</tr>"
					 + "</table>";
                $("#preBottomArea").html(preHtml);

            }
            else { //普通复式投注的显示
                $.each(contents, function (idx, subMatch) {
                    var record = findRecordByMatchID(subMatch.matchId);
                    var LtType = postData.lotteryType;
                    preHtml += "<div class='PreRecord' mid='" + record.matchId + "'  schid='" + record.scheduleId + "'>    <div class='matchinfo_cf floatrow'  ><div class='selmatchtitlecol1'>" +
 "<span class='matchno_cf'>" + record.matchNo + "</span> <span class='sclass_cf' style='color:" + record.matchColor + "' >" + record.matchName + "</span> <span class='home_cf' >" + record.homeTeam + "</span> <span class='vs_cf'>Vs</span> <span class='guest_cf' >" + record.guestTeam + "</span></div><div class='selmatchtitlecol2'> <span class='dan_new" + (subMatch.dan ? " select" : "") + "' mid='" + record.matchId + "' >胆</span></div>" +
"</div>" +
"<div class='betcontent'  mid='" + record.matchId + "'  schid='" + record.scheduleId + "' >" +
         " <table>" + GetRowHTML(LtType, subMatch.content, record) +
            "</table>" +
 "</div><div class='sline2'></div><div class='delbtn' mid='" + record.matchId + "'  schid='" + record.scheduleId + "' ><div class='pos-center-parent' ><div class='pos-center' >删除</div></div></div></div>";

                });
                preHtml += "<div style='height:100px;' ></div>"
                $("#preItemList").html(preHtml);
                $("#preItemList .betcontent").click(function () {
                    var matchid = $(this).attr("mid");
                    openItemDlg(matchid);
                });
                $("#preItemList .dan_new").click(function () {
                    if ($(this).hasClass("select")) {
                        $(this).removeClass("select");
                        $("#dan_" + $(this).attr("mid")).val(0);
                        GetAllItems_FromMain(); //刷新一下最新的显示。。。。
                    } else {
                        $(this).addClass("select");
                        $("#dan_" + $(this).attr("mid")).val(1);
                        GetAllItems_FromMain(); //刷新一下最新的显示。。。。
                    }
                });
                bindtouch();//绑定滑动
                $("#preItemList .delbtn").click(function () { //删除
                    var matchid = $(this).attr("mid");
                    $("#divPage_Main .match_item[data-id='" + matchid + "'] .betZone .select").removeClass("select");
                    var openItem = $("#divPage_Main .match_item[data-id='" + matchid + "'] .betZone .openItemBox");
                    $(openItem).attr("data-select", "");
                    $(openItem).find(".center").html("展开<br/> 全部");
                    GetAllItems_FromMain(); //刷新一下最新的显示。。。。
                    $(".PreRecord[mid=" + matchid + "]").remove();
                    checkgomaim();
                    //RefreshPreMainMatch(matchid);

                });
                //弹出全部选择框的就模拟选号区，然后写回预览区，页面直接选择的就预览区点击，然后模拟点击选号区
                $("#preItemList .preItemTable .item").each(function (idx, item) {
                    $(this).click(function () { //预览区选号
                        $(this).toggleClass("select");
                        //alert($(this).hasClass("dan"));
                        var curMatchId = $(this).parents("#preItemList .match_item").attr("data-id");
                        if ($(this).hasClass("dan")) {
                            $("#dan_" + curMatchId).val($(this).hasClass("select") ? 1 : 0);
                            //多选过关就取消定胆，定胆就不用多选过关，最小串关不能大于胆数

                            GetAllItems_FromMain();
                        } else {
                            var data_idx = $(this).attr("data-idx");
                            var data_playType = $(this).attr("data-playtype");
                            //找到主界面的选项，并模拟点击
                            $("#divPage_Main .match_item[data-id='" + curMatchId + "']").find(".item[data-idx='" + data_idx + "'][data-playtype='" + data_playType + "']").trigger("click");
                        }

                        //奖金预测、计算注数等
                        //console.log("奖金预测、计算注数等"+new Date());
                    });
                });
                $("#preItemList .openItemBox").each(function (idx, item) {
                    //模拟弹出正式的
                    $(this).click(function () {
                        var matchId = $(this).parents(".match_item").attr("data-id"); //$("#divPage_Main .match_item[data-id='" + subMatch.matchId + "']");
                        $("#divPage_Main .match_item[data-id='" + matchId + "']").find(".openItemBox").trigger("click");
                    });
                });

                $("#preItemList .cancelMatch").each(function () { //取消整场比赛的选号，并在预览区删除整场比赛的显示
                    $(this).click(function () {
                        var match_item = $(this).parents("#preItemList .match_item");
                        match_item.find(".betList .select").each(function (idx, item) { //对该场比赛已选选项模拟点击取消
                            $(this).trigger("click");
                        });
                        //清理弹出窗的data-select，弹出框的取消本场比赛
                        if (match_item.find(".openItemBox").length > 0) {
                            $("#divPage_Main .match_item[data-id='" + match_item.attr("data-id") + "']").find(".openItemBox").each(function (idx, item) { //对该场比赛已选选项模拟点击取消
                                $(this).removeClass("select");
                                $(this).attr("data-select", "");
                                $(this).html($(this).attr("data-oritips"));
                            });
                            GetAllItems_FromMain();
                        }

                        match_item.remove(); //把当前场次删除

                        var curTips = verifyContents(); //检查删除后的选号是否允许发起方案
                        if (curTips != "") {
                            tips(curTips);
                            backtoMain(); //不符合场次要求就返回主界面
                        }
                    });
                });

                //过关方式区域
                preHtml = "<div>" //未展开前
					 + "<div class=\"area1_2 area1\">"
					 + "    <input type=\"hidden\" id=\"hidPassMode\" />"
					 + "    <span id=\"passmodeText\">过关方式很长</span>"
					 + "    <span class=\"bet_arrow_down\"></span>"
					 + "</div>"
					 + "<div class=\"area1_3 timezone\">"
					 + "    <input id=\"times\" class=\"times\" type=\"text\" value=\"1\">倍"
					 + "</div>"
					 + "</div>"
					 + "<div id=\"passmode_detail\" style=\"display:none;\"></div>"; //展开后
                $("#bottomLevel2").html(preHtml);
                $("#bottomLevel2 .area1").click(function () { //是否显示过关方式明细
                    if ($("#passmode_detail").html() == "")
                        tips("没有符合条件的过关方式");
                    else
                        $("#passmode_detail").toggle(100, function () {
                            displayPassMode();
                        });
                });
                $("#times").change(function () {
                    culNoteCount();
                }); //倍数变化时
                $("#times").keyup(function () {
                    culNoteCount();
                }); //倍数变化时
                $("#times").blur(function () {
                    culNoteCount();
                }); //倍数变化时

                //预览区底部按钮
                preHtml = "<table cellspacing='0' cellpadding='0'>"
					 + "<tr>"
					 + "    <td style=\"width:20%;\"><span id=\"bt_optimize\" class=\"b_btn_left\">优化</span></td>"
					 + "    <td style=\"text-align:left;font-size:12px;line-height:18px;\"><div id=\"pre_info\"></div><div id=\"bt_preBonus\"></div></td>"
					 + "    <td style=\"width:30%;display:none;\"><button id=\"bt_submit\" class=\"b_submit dobuy\">提交彩店</button></td>"
					 + "</tr>"
					 + "</table>";
                $("#preBottomArea").html(preHtml);
            }
            $("#bt_optimize").click(function () { //点进打开奖金优化页面
                openOptimize();
            });
            $("#bt_submit").click(function () { //最后一步提交
                gotoBuy();
            });

            GetAllItems_FromMain(); //刷新一下最新的显示。。。。
            $("#divPage_Main").hide();
            $("#divPage_Preview").show();
            resetPreContentHeight();

        }

        //console.log(JSON.stringify(postData));
    });

    /***************第二版预览页的操作*********/
    $("#divPage_Preview #redTips .closeDiv").parent().click(function () {
        $("#divPage_Preview #redTips").hide();
        resetPreContentHeight();
    }); //关闭红色提示语
    function resetPreContentHeight() {
        //console.log($(window).height() +"-"+ $("#preItemList").offset().top +"-"+ $("#bottomLevel2").height()+"-"+ $("#preBottomArea").height());
        $("#preItemList").height($(window).height() - $("#preItemList").offset().top - $("#bottomLevel2").height() - $("#preBottomArea").height());
    }

    //展示最新的可选过关方式
    var singlePassMode = new Array(),
	multiplePassMode = new Array(); //可以单选或者多选的过关方式
    var isDantiao = false;
    //投注方式列表，如matchLength为6，则只能取前六个投注方式
    var passModeArray = new Array(
			new Array(),//"P1_1"
			new Array(),//"P2_1"
			new Array("P3_3", "P3_4"),//"P3_1",
			new Array("P4_4", "P4_5", "P4_6", "P4_11"),//"P4_1",
			new Array("P5_5", "P5_6", "P5_10", "P5_16", "P5_20", "P5_26"),//"P5_1",
			new Array("P6_6", "P6_7", "P6_15", "P6_20", "P6_22", "P6_35", "P6_42", "P6_50", "P6_57"),//"P6_1",
			new Array("P7_7", "P7_8", "P7_21", "P7_35", "P7_120"),//"P7_1",
			new Array("P8_8", "P8_9", "P8_28", "P8_56", "P8_70", "P8_247"));//"P8_1",
    if (groupId == 4)
        passModeArray = new Array(
            new Array(),
            new Array("P2_3"),
            new Array("P3_4", "P3_7"),
            new Array("P4_5", "P4_11", "P4_15"),
            new Array("P5_6", "P5_16", "P5_26", "P5_31"),
            new Array("P6_7", "P6_22", "P6_42", "P6_57", "P6_63"),
            new Array(),
            new Array(),
            new Array(),
            new Array(),
            new Array(),
            new Array(),
            new Array(),
            new Array(),
            new Array()
        );

    function getAllPassmode() {
        multiplePassMode = new Array(); //PM_1...
        var danNum = 0; //胆个数
        if (isDantiao)
            multiplePassMode.push("P1_1");
        else if (contents.length > 0 && OddsType == 2) {
            for (var i = 0; i < contents.length; i++) {
                if (contents[i].dan)
                    danNum++;
            }
            if ((typeId <= 9 || typeId == 11) && contents.length <= 15 || typeId >= 100 && contents.length <= 10) {
                if ((typeId >= 5 && typeId <= 9) && danNum <= 1) {
                    multiplePassMode.push("P1_1");
                }
                for (var i = Math.max((typeId == 11 ? 3 : 2), danNum) ; i <= Math.min(MaxMatch, contents.length) ; i++) {
                    multiplePassMode.push("P" + i + "_1");
                }
                if (contents.length == 1 && contents[0].isSingle)
                    multiplePassMode.push("P1_1");
            }
        } else if (OddsType == 1)
            multiplePassMode.push("P1_1");

        singlePassMode = new Array(); //PM_N
        //不能设胆
        if (typeId != 11 && danNum == 0 && multiplePassMode.length > 0 && contents.length <= MaxMatch && passModeArray.length >= contents.length) {
            singlePassMode = passModeArray[contents.length - 1];
        }
    }
    function displayPassMode() {
        getAllPassmode();
        //console.log(pmList);
        var html = "";
        if (multiplePassMode.length > 0) {
            html += "<div class=\"switch switchSclass\">";
            html += "<div class=\"subTitle\">多选过关</div>";
            $.each(multiplePassMode, function (idx, item) {
                html += "<span data-v-key='" + item + "' name='passMode' class='item checkbox'>" + formatPassMode(item) + "</span>";
            });
            html += "</div>";

            if (singlePassMode.length > 0) {
                html += "<div class=\"switch switchSclass\">";
                html += "<div class=\"subTitle\">普通过关</div>";
                $.each(singlePassMode, function (idx, item) {
                    html += "<span data-v-key='" + item + "' name='passMode' class='item radio'>" + formatPassMode(item) + "</span>";
                });
                html += "</div>";
            }
        }
        else {
            $("#hidPassMode").val("");
        }
        $("#passmode_detail").html(html);

        $("#passmode_detail .checkbox").each(function (i) { //多选过关的点击事件
            $(this).click(function () {
                $(this).toggleClass("pmcheck");
                $("#passmode_detail .radio").removeClass("pmcheck");

                var pmList = new Array();
                $("#passmode_detail .checkbox").each(function () {
                    if ($(this).hasClass("pmcheck"))
                        pmList.push($(this).attr("data-v-key"));
                });
                $("#hidPassMode").val("checkbox;" + pmList + ";self");
                refreshPassmode();
            });
        });
        $("#passmode_detail .radio").each(function (i) { //多选过关的点击事件
            $(this).click(function () {
                $("#passmode_detail .item").removeClass("pmcheck");
                $(this).addClass("pmcheck");

                var pmList = new Array();
                $("#passmode_detail .radio").each(function () {
                    if ($(this).hasClass("pmcheck"))
                        pmList.push($(this).attr("data-v-key"));
                });
                $("#hidPassMode").val("radio;" + pmList + ";self");

                //多选过关就取消定胆，定胆就不用多选过关，最小串关不能大于胆数
                if ($("input[name='hidDanV'][value='1']").length > 0) {
                    $(".match_item .dan").removeClass("select");
                    $("input[name='hidDanV']").val(0);
                    GetAllItems_FromMain();
                }

                refreshPassmode();
            });
        });

        refreshPassmode();
    }
    //把过关选项解析出来，若没有，则给个默认的
    function refreshPassmode() {
        //if($("#hidPassMode").length==0) return;
        //tmp console.log(JSON.stringify(postData));
        //原来选择的过关，如果没有就指定最高的PN_1多选过关给他   checkbox;P2_1,P3_1;default     radio;P2_1;self
        var curPassModeList = ($("#hidPassMode").length > 0 ? $("#hidPassMode").val().split(';') : new Array());
        if (curPassModeList.length >= 3 && curPassModeList[2] != "default") {
            $.each(curPassModeList[1].split(','), function (idx, item) {
                //debugger
                if (curPassModeList[0] == "checkbox" && !multiplePassMode.Contains(item)
					 || curPassModeList[0] == "radio" && !singlePassMode.Contains(item)) {
                    curPassModeList = new Array();
                    return false;
                }
            });
        }

        //console.log("curPassModeList.length:"+curPassModeList.length+"   multiplePassMode.length:"+multiplePassMode.length);
        if ((curPassModeList.length < 3 || curPassModeList[1] == "" || curPassModeList[2] == "default") && multiplePassMode.length > 0)
            curPassModeList = ["checkbox", multiplePassMode[multiplePassMode.length - 1], "default"];

        //绑定过关到显示的地方
        //console.log(multiplePassMode);
        //console.log(curPassModeList);
        if (curPassModeList.length >= 2) {
            $.each(curPassModeList[1].split(','), function (idx, item) {
                $("#passmode_detail ." + curPassModeList[0] + "[data-v-key='" + item + "']").addClass("pmcheck");
            });

        }
        $("#hidPassMode").val(curPassModeList.join(";")); //把最新符合条件的过关方式绑定

        if (!$("#passmode_detail").is(":hidden")) {
            $("#passmodeText").html("收起");
        } else {
            if (curPassModeList.length >= 3) {
                var pmList = curPassModeList[1].split(',');
                if (pmList.length > 2)
                    $("#passmodeText").html(formatPassMode(pmList[0] + "," + pmList[1]) + "...");
                else
                    $("#passmodeText").html(formatPassMode(pmList.join(",")));
            } else {
                $("#passmodeText").html("过关方式");
            }
        }

        bonusForecast();
        culNoteCount();
    }

    var noteCount = 0,
	amount = 0,
	times = 0;
    //计算预览区复式投注的单倍注数
    var lastForcastJson = new Dictionary();
    //转化JSON内容
    function bonusForecastJson() {
        formatPostData();
        return JSON.stringify(postData);
    }
    var isAsyncing_1 = false;
    var needAsync_1 = false;
    var isPending = false;
    //奖金预测
    function bonusForecast() {
        //采用异步方式取数据，取数据频率是前一次取数据完成后才执行后面的取数据。。有最新的选号就放在最后取
        //{"playType":99,"passModes":["P2_1"],"contents":[{"matchId":2332002,"content":"0,1#1","dan":false},{"matchId":2332003,"content":"0#0_0#1","dan":false}],"lotteryType":10011}
        if (isAsyncing_1) {
            if (!isPending) {
                isPending = true;
                setTimeout(1000, function () {
                    bonusForecast();
                });
            }
            return;
        }
        var curJson = bonusForecastJson();
        //tmp console.log(curJson);
        //tmp console.log("noteCount:"+noteCount+"  amount:"+amount);
        if (lastForcastJson.has(curJson)) {
            parseBonusFor(lastForcastJson.get(curJson)); //如果已经查过就不查了
        }
        else {
            isAsyncing_1 = true;
            $.post("Async/BallHandler.ashx", {
                action: "award_forecast",
                msg: curJson
            }, function (result, status) {
                parseBonusFor(result);

                if (needAsync_1)
                    bonusForecast();

                isAsyncing_1 = false;
                isPending = false;
                lastForcastJson.set(curJson, result);
            });
        }
    }
    function parseBonusFor(returnJson) {
        //{"ErrCode":0,"ErrMsg":null,"Data":"{\"resultCode\":100,\"body\":{\"min\":25.91,\"max\":25.91}}","ErrMsgShow":null}
        var json = eval("(" + returnJson + ")");
        var html = "";
        if (json.ErrCode == 0) {
            var minT = 0,
			maxT = 0;
            try {
                json = eval("(" + json.Data + ")");
                if (json.resultCode == 100) {
                    minT = json.body.min;
                    maxT = json.body.max;
                }
            } catch (e) { }
            if (minT == maxT)
                html += "预测：<span class='red' data-min='" + minT + "' data-max='" + maxT + "'>" + maxT + "元</span>";
            else
               html += "预测：<span class='red' data-min='" + minT + "' data-max='" + maxT + "'>" + minT + "~" + maxT + "元</span>";
               
        }
        $("#bt_preBonus").html(html);
        //culNoteCount(); //可能需要启用20180119
    }

    //单关更改倍数
    function changeSingleNoteCount(obj, reCount) {
        if (obj != undefined) {
            var curTimes = parseInt(obj.val());
            curTimes = (isNaN(curTimes) ? 0 : curTimes);
            if (curTimes < 0) {
                tips("倍数不能小于0")
                obj.val("1");
                curTimes = 1;
            }
            obj.parents(".subSingle").find(".s_bonus").html("预计奖金：<span class='red'>" + (curTimes * 2 * parseFloat(obj.parents(".subSingle").find("sp").html())).toFixed(2) + "</span>元");
        }

        if (reCount == undefined || reCount)
            GetAllItems_FromMain();
    }
    //批量统计一次单式的注数等
    function batchSingleCount() {
        $("#preItemList .s_times").each(function () {
            changeSingleNoteCount($(this), false);
        });
        GetAllItems_FromMain();
    }

    //计算注数
    function culNoteCount() {
        noteCount = 0;
        amount = 0;
        times = parseInt($("#times").val());
        if (isNaN(times))
            times = 0;
        if (!postData.passModes || postData.passModes.length == 0) {
            //一注都没有
        }
        else {
            if (postData.OddsType == 1 && $(".subSingle .s_times").length > 0) {
                $(".subSingle .s_times").each(function () {
                    var s_times = parseInt($(this).val());
                    noteCount += (isNaN(s_times) ? 0 : s_times);
                });
                times = 1;
            } else {
                //console.log("postData.passModes:"+postData.passModes);
                $.each(postData.passModes, function (idx, paddMode) {
                    var M = paddMode.split("_")[1];
                    if (M == "1") {
                        noteCount += SinglePassModeCount(paddMode);
                    } else {
                        //P4_4   
                        noteCount += PassModeNMCount(paddMode);
                    }
                });
            }
        }
        if (isDantiao)
            noteCount *= 2;

        amount = (noteCount * times * 2);
        $("#pre_info").html("投注：<span class=\"red\">" + noteCount + "</span>注，<span class=\"red\">" + amount + "</span>元");
        if (postData.OddsType == 2) { //复式投注直接对奖金预测进行倍增
            var min = parseFloat($("#bt_preBonus .red").attr("data-min"));
            var max = parseFloat($("#bt_preBonus .red").attr("data-max"));
            if (min == max) {
                $("#bt_preBonus .red").html((max * times).toFixed(2) + "元");
            } else {
                $("#bt_preBonus .red").html((isNaN(min) ? "-" : (min * times).toFixed(2)) + "~" + (isNaN(max) ? "-" : (max * times).toFixed(2)) + "元");
            }
        }
        //byID("hidAmount").value = amount;
        //byID("preMoney").innerHTML = "金额：(" + chooseArray.length + "场)" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元";
        //byID("preMoney").innerHTML = "￥" + amount + "元";
        //CheckOptimize();//奖金优化显隐藏
    }

    //{"contents":[{"content":"0|1,1|1#0","dan":false,"matchId":2329008}],"lotteryType":10011,"passModes":["P1_1"],"playType":99}
    //{"playType":99,"passModes":["P2_1"],"contents":[{"matchId":2327001,"content":"0,1#0_0,1#1"},{"matchId":2327002,"content":"1#0_0,1#1"}],"lotteryType":10011}
    //一个过关方式的金额计算(从旧版改装过来)
    function SinglePassModeCount(passMode) {
        if (postData.contents == undefined || postData.contents.length == 0) return 0;
        var dan = 0; //胆的个数
        var danTime = 1; //胆所占的注数，比如一场胆比赛选了2个，另外一场胆选了3个，则任何一个胆的复式都起码是6注了
        var N = parseInt(passMode.replace('P', '').split('_')[0]); //N串M的N
        var M = parseInt(passMode.replace('P', '').split('_')[1]); //N串M的M

        var paiList = new Array();
        //console.log(postData);
        $.each(postData.contents, function (idx, item) {
            //if(postData.OddsType == 1){
            if (item.dan != undefined && item.dan) {
                dan++;
                danTime *= item.content.replace(/\_/gi, ",").split(',').length;
            } else {
                paiList.push(item.content.replace(/\_/gi, ",").split(',').length);
            }
        });

        var count = 0;
        if (N - dan > 0) {
            fonL_ = new Array();
            FastGroupNums("", 1, 1, (N - dan), paiList.length);
            //console.log(fonL_);
            for (var m = 0; m < fonL_.length; m++) {
                var changciList = fonL_[m].split(',');
                var usDanList = new Array();
                var one = 1;
                for (var k = 0; k < changciList.length; k++) {
                    one *= paiList[parseInt(changciList[k], 10) - 1];
                }
                count += one;
            }
        }
        if (count == 0 && dan > 0)
            count = 1;

        return count * danTime * M;//如P3_4，就要乘以4
    }

    function PassModeNMCount(passMode) {
        var dan = 0; //胆的个数
        if (postData.contents == undefined || postData.contents.length == 0) return 0;

        var paiList = new Array();
        //console.log(postData);
        $.each(postData.contents, function (idx, item) {
            //if(postData.OddsType == 1){
            if (item.dan != undefined && item.dan) {
                dan++;
                danTime *= item.content.replace(/\_/gi, ",").split(',').length;
            }
        });

        if (dan > 0) {
            alert("普通过关方式不允许设胆");
            return 0;
        }

        var SelContents = new Array();
        for (var i = 0; i < postData.contents.length; i++) {
            SelContents.push(postData.contents[i].content.split("_"));
        }
        var Arrlist = Descartes(SelContents);
        var PsValue = PassModeDic.get(passMode.toUpperCase());
        var PassModeList = PsValue.split(",");
        var count = 0;
        for (var i = 0; i < Arrlist.length; i++) {
            var list1 = Array();
            for (var p = 0; p < Arrlist[i].length; p++) {
                list1.push(Arrlist[i][p].split(",").length);
            }
            for (var j = 0; j < PassModeList.length; j++) {
                var N = parseInt(PassModeList[j].replace('P', '').split('_')[0]);
                var list2 = C_Cal(list1, N);
                for (var n1 = 0; n1 < list2.length; n1++) {
                    var list3 = list2[n1];
                    var subcount = 0;
                    for (var n2 = 0; n2 < list3.length; n2++) {
                        if (n2 == 0)
                            subcount = list3[n2];
                        else
                            subcount = subcount * list3[n2];

                    }
                    count += subcount;
                }
            }
        }

        return count;
    }
    function gotoBuy() {
        if (noteCount <= 0) {
            alert("注数为0,请先选好号码");
            return;
        }
        postData.multiple = (postData.OddsType == 1 ? 1 : times);
        postData.cost = postData.multiple * noteCount * 2;
        var buydataobj = new Object();
        postData.bonusOptimize = undefined;
        buydataobj.schemeContent = postData;
        buydataobj.checkRepeated = false;
        buy(buydataobj);
    }

    /****************奖金优化的页面*****************/
    var optimizeList = new Array(); //拆分成一个个单注
    var bonusOptimize = undefined; //奖金预测的对象
    var showOptimizeList = new Array(); //[optimizeList的item,data-bonus,choiceList.join("<br>"),倍数]
    function openOptimize() { //打开奖金优化的页面
        optimizeList = new Array();
        //检查是否符合奖金优化的条件
        if (postData.OddsType == 1 || noteCount <= 1 || noteCount > 1000 || postData.passModes.length != 1) {
            tips("只支持2串1 ~ 8串1的复式倍投方案，最高支持1000注");
            return;
        }
        var dan = 0; //胆的个数
        var danTime = 1; //单式的注数
        var N = parseInt(postData.passModes[0].replace('P', '').split('_')[0]); //N串M的N
        var M = parseInt(postData.passModes[0].replace('P', '').split('_')[1]); //N串M的M
        if (M > 1) {
            tips("仅支持过关方式为N串1的奖金优化");
            return;
        }

        var paiList = new Array();
        var danIndexList = new Array();
        $.each(postData.contents, function (idx, item) {
            //if(postData.OddsType == 1){
            if (item.dan != undefined && item.dan) {
                dan++;
                danTime *= item.content.split(',').length;
                danIndexList.push(idx);
            } else {
                paiList.push(item.content.replace(/\_/gi, ",").split(',').length);
            }
        });

        var count = 0;
        if (N - dan > 0) { //复式拆分为单式
            fonL_ = new Array(); //["1,2", "1,3", "2,3"]
            FastGroupNums("", 1, 1, (N - dan), paiList.length);

            var sList = new Array();
            var len = 1;
            //把内容一个个拆分出来先
            $.each(postData.contents, function (idx1, subMatch) {
                //0,1#0_0,1#1
                //0|1,1|1#0_1|1#1
                var sList_match = new Array();
                $.each(splitMulToSingleItems(subMatch.content, "no").split('_'), function (idx2, item2) {
                    var tmp = item2.split('#');
                    $.each(tmp[0].replace(/\|1/gi, "#" + tmp[1]).split('_'), function (idx3, item3) {
                        $.each(item3.split(','), function (idx4, item4) {
                            sList_match.push(item4);
                        });
                    });
                    //sList.push(tmp[0].replace(/\|1/gi,"#"+tmp[1]).split('_'));
                });
                sList.push(sList_match);
                len *= sList_match.length;
            });
            /*console.log(sList);
			//tmp console.log("N:"+N+"  dan:"+dan);
			//tmp console.log(fonL_);
			//tmp console.log(danIndexList);*/

            for (var m = 0; m < fonL_.length; m++) {
                var changciList = fonL_[m].split(','); //此处是排除了胆码的场次列表，拆分时需要把胆码也加上去

                var s = new Array();
                var tmpIdx = 0;
                for (var i = 0; i < postData.contents.length; i++) //默认   postData.contents.length是全部，有胆的时候先不理会胆
                {
                    if ($.inArray(i, danIndexList) != -1)
                        s.push(sList[i]); //胆码就固定
                    else {
                        tmpIdx++; //changciList里的index是+1的，所以刚好
                        if ($.inArray("" + tmpIdx, changciList) != -1)
                            s.push(sList[i]);
                        else
                            s.push(["*"]);
                    }
                }
                var tmp = Combin(s); //把复式拆分成单式
                optimizeList = optimizeList.concat(tmp);
            }

            //还要对optimizeList里的内容从奖金最小往最大排序
            showOptimizeList = new Array(); //[optimizeList的item,data-bonus,choiceList.join("<br>")]
            $.each(optimizeList, function (idx, item) {
                var items = item.split(','); //1#0,*,0#1
                var choiceList = new Array(); //周四001 阿贾克斯 [胜]
                var bonus1 = 2;
                $.each(items, function (idx1, item1) {
                    if (item1 == "*")
                        return true;
                    var curMatchId = postData.contents[idx1].matchId;
                    //控件
                    var match_item = $("#divPage_Main .match_item[data-id='" + curMatchId + "']");
                    var chooseItem = match_item.find(".item[data-idx='" + item1.split('#')[0] + "'][data-playtype='" + item1.split('#')[1] + "']");
                    var itemName = "";
                    var spHtml = 0;
                    if (chooseItem.length > 0) {
                        itemName = formatBoxItemShow(item1.split('#')[1] + "," + item1.split('#')[0] + "," + chooseItem.html());
                        spHtml = chooseItem.find("sp").html();
                    } else {
                        chooseItem = match_item.find(".openItemBox");
                        if (chooseItem.length > 0) {
                            var data_select = (";" + chooseItem.attr("data-select") + ";").split(';' + item1.split('#')[1] + "," + item1.split('#')[0] + ",")[1].split(';')[0];
                            itemName = formatBoxItemShow(item1.split('#')[1] + "," + item1.split('#')[0] + "," + data_select);
                            spHtml = data_select.split("<sp>")[1].split("<")[0];
                        }
                    }
                    choiceList.push(match_item.find(".matchNo").html() + " " + match_item.find("home").html() + " <span class='green'>[" + itemName + " <span class='red'>" + spHtml + "</span>]</span>");
                    bonus1 *= parseFloat(spHtml);
                });
                var curItem = new Object();
                curItem.scheme = item;
                curItem.singleBonus = bonus1;
                curItem.choiceHtml = choiceList.join("<br>");
                curItem.times = 1;
                showOptimizeList.push(curItem);
            });
            //做好排序，从小到大，后面方便取值
            showOptimizeList.sort(opSort);

            //console.log(optimizeList.join("\r\n"));

            var preHtml = $("#divPage_Preview .topcontainer").prop("outerHTML").replace("backtoMain()", "backtoPreView()"); //获取这个控件的所有代码
            //console.log(preHtml);
            preHtml += "<div class=\"mainArea\">";
            //填写的购买金额，自动计算
            preHtml += "<div class='topOpAmount'>计划 <input id='optimizeAmount' class=\"times\" type=\"text\" value=\"" + amount + "\"> 元</div>";
            //奖金优化类型
            preHtml += "<div class='topOpType'><div style='margin:0 auto;width:225px'><ul><li data-v='1' class='checked'>平衡型</li><li data-v='2'>保守型</li><li data-v='3'>博冷型</li></ul></div></div>"; //<li data-v='4'>保本型</li>
            //标题
            preHtml += "<div class='topOpTitle'><div class='boxTop' style='color:#999'><div class='boxItem5'>选项内容</div><div class='boxItem3'>注数</div><div class='boxItem2'>预测</div></div></div>";
            //中间主要的单式列表
            preHtml += "<div id='optimizeItemList'>";
            $.each(showOptimizeList, function (idx, item) {
                preHtml += "<div class='optimizeSingle boxTop' data-single='" + item.scheme + "' data-bonus='" + item.singleBonus.toFixed(2) + "'>"
				 + "<div class='boxItem5' style='text-align:left;'>" + item.choiceHtml + "</div>"
				 + "<div class='boxItem3'><input class=\"s_times\" type=\"text\" value=\"" + item.times + "\">倍</div>" //默认先给一注补补底
				 + "<div class='boxItem2 s_bonus'></div>"
				 + "</div>";
            });
            preHtml += "</div></div>";
            //底部显示
            preHtml += "<div class=\"bottomArea\" id=\"optimizeBottomArea\">"
			 + "<table cellspacing='0' cellpadding='0'>"
			 + "<tr>"
			 + "    <td style=\"width:20%;\"><span id=\"bt_clear_optimize\" class=\"b_btn_left\">重置</span></td>"
			 + "    <td style=\"text-align:left;font-size:12px;line-height:18px;\"><div id=\"pre_optimize_info\"></div></td>"
			 + "    <td style=\"width:30%;display:none;\"><button type=\"button\" id=\"bt_submit_optimize\" class=\"b_submit dobuy\">提交彩店</button></input></td>"
			 + "</tr>"
			 + "</table></div>";
            $("#divPage_Optimize").html(preHtml);

            $("#divPage_Main").hide();
            $("#divPage_Preview").hide();
            $("#divPage_Optimize").show();

            //单式的倍数变化
            $("#optimizeItemList .s_times").each(function () {
                $(this).change(function () {
                    optimizeSingleNoteCount($(this));
                    GetOptimizeItems();
                });
                $(this).keyup(function () {
                    optimizeSingleNoteCount($(this));
                    GetOptimizeItems();
                });
                $(this).blur(function () {
                    optimizeSingleNoteCount($(this));
                    GetOptimizeItems();
                });
            });
            //重置
            $("#bt_clear_optimize").click(function () {
                $("#optimizeAmount").val(amount);
                optimizeByType();
            });
            //切换优化类型
            $(".topOpType li").each(function () {
                $(this).click(function () {
                    $(".topOpType .checked").removeClass("checked");
                    $(this).addClass("checked");
                    optimizeByType();
                });
            });
            $("#optimizeAmount").blur(function () {
                optimizeByType();
            });

            optimizeByType(); //一打开优化页面就默认优化一次
            //optimizeBatchCount();//要改成根据金额自动分配

            //提交奖金优化
            $("#bt_submit_optimize").click(function () {
                if (noteCount <= 0) {
                    alert("注数为0,请先选好号码");
                    return;
                }
                postData.multiple = (postData.OddsType == 1 ? 1 : times);
                postData.cost = postData.multiple * noteCount * 2;
                var buydataobj = new Object();
                postData.bonusOptimize = bonusOptimize;
                buydataobj.schemeContent = postData;
                buydataobj.checkRepeated = false;
                buy(buydataobj);
            });

            //选号区滚动
            $("#optimizeItemList").height($(window).height() - $("#optimizeItemList").offset().top - $("#optimizeBottomArea").height());

        }
        function opSort(a, b) {
            return a.singleBonus * a.times - b.singleBonus * b.times;
        }
        //奖金优化更改倍数
        function optimizeSingleNoteCount(obj, reCount) {
            if (obj != undefined) {
                var curTimes = parseInt(obj.val());
                curTimes = (isNaN(curTimes) ? 0 : curTimes);
                if (curTimes < 0) {
                    tips("倍数不能小于0")
                    obj.val("1");
                    curTimes = 1;
                }
                var curBonus = (curTimes * parseFloat(obj.parents(".optimizeSingle").attr("data-bonus")));
                obj.parents(".optimizeSingle").find(".s_bonus").html("<span class='red'>" + curBonus.toFixed(2) + "</span>元");
            }

            if (reCount == undefined || reCount) {
                GetAllItems_FromMain();
                GetOptimizeItems();
            }
        }
        //批量统计一次奖金优化的注数等
        function optimizeBatchCount() {
            $("#optimizeItemList .s_times").each(function () {
                optimizeSingleNoteCount($(this), false);
            });
            GetAllItems_FromMain();
            GetOptimizeItems();
        }
        //组织奖金优化的数据
        function GetOptimizeItems() {
            bonusOptimize = new Object();
            bonusOptimize.type = parseInt($(".topOpType .checked").attr("data-v"));
            bonusOptimize.cost = 0;
            var tmpArray = new Array();
            $("#optimizeItemList .s_times").each(function () {
                var curTimes = parseInt($(this).val());
                curTimes = (isNaN(curTimes) ? 0 : curTimes);
                bonusOptimize.cost += curTimes * 2;
                if (curTimes > 0)
                    tmpArray.push($(this).parents(".optimizeSingle").attr("data-single").replace(/,/gi, "_") + "|" + curTimes);
            });
            bonusOptimize.contents = tmpArray.join(";")
            $("#pre_optimize_info").html("过关:" + formatPassMode(postData.passModes.join(',')) + "<br>投注:<span class='red'>" + (bonusOptimize.cost / 2) + "注" + bonusOptimize.cost + "元" + "</span>");
        }
        //根据优化类型自动优化当前页面的所有单注
        function optimizeByType() {
            var PrizeType = parseInt($(".topOpType .checked").attr("data-v"));
            var NoteCountTmp = Math.floor(parseInt($("#optimizeAmount").val()) / 2.0);
            var remainNote = NoteCountTmp - $(".s_times").length;
            //tmp console.log("remainNote:" + remainNote);
            if (remainNote > 0) {
                //初始化为1注
                $.each(showOptimizeList, function (idx, item) {
                    item.times = 1;
                });
                //做好排序，总奖金从小到大，后面方便取值
                showOptimizeList.sort(opSort);

                /********region 平衡优化 20130702*/
                if (PrizeType == 1) {
                    while (remainNote > 0) {
                        var drOfMin = showOptimizeList[0];
                        var drOfMax = showOptimizeList[showOptimizeList.length - 1];

                        var currentIndex = 0;
                        var currentDr = showOptimizeList[currentIndex];
                        var nextTotalPrizeOfCurrent = (currentDr.singleBonus * currentDr.times) + currentDr.singleBonus;
                        if (nextTotalPrizeOfCurrent > (drOfMax.singleBonus * drOfMax.times) && showOptimizeList.length >= 2) {
                            var newRange = nextTotalPrizeOfCurrent - (showOptimizeList[1].singleBonus * showOptimizeList[1].times);
                            var rawRange = (drOfMax.singleBonus * drOfMax.times) - (drOfMin.singleBonus * drOfMin.times);
                            if (newRange > rawRange) {
                                for (var i = 1; i < showOptimizeList.length; i++) {
                                    var dr = showOptimizeList[i];
                                    var nextTotalPrize = (dr.singleBonus * dr.times) + dr.singleBonus; //(float)dr["TotalPrize"] + (float)dr["Prize"];
                                    if (nextTotalPrize > (drOfMax.singleBonus * drOfMax.times)) {
                                        var range = nextTotalPrize - (drOfMin.singleBonus * drOfMin.times);
                                        if (range >= newRange)
                                            continue;
                                        newRange = range;
                                        currentIndex = i;
                                        currentDr = dr;
                                    } else {
                                        newRange = rawRange;
                                        currentIndex = i;
                                        currentDr = dr;
                                        break;
                                    }
                                }

                                if (remainNote > 1 && currentIndex > 1 && currentIndex < showOptimizeList.length - 1) {
                                    var maxTotalPrize = 0;
                                    var index = 0;
                                    var ok = false;
                                    while (index < currentIndex && index < remainNote) {
                                        var dr = showOptimizeList[index];
                                        var nextTotalPrize = (dr.singleBonus * dr.times) + dr.singleBonus; //(float)dr["TotalPrize"] + (float)dr["Prize"];
                                        if (nextTotalPrize > maxTotalPrize)
                                            maxTotalPrize = nextTotalPrize;
                                        var range = maxTotalPrize - (showOptimizeList[index + 1].singleBonus * showOptimizeList[index + 1].times);
                                        if (range <= newRange) {
                                            ok = true;
                                            break;
                                        }
                                        index++;
                                    }
                                    if (ok) {
                                        for (var i = 0; i < index - 1; i++) {
                                            var dr = showOptimizeList[i];
                                            dr.times += 1;
                                            remainNote -= 1;
                                            //dr["TotalPrize"] = (float)dr["Prize"] * (int)dr["Num"];
                                        }
                                        currentIndex = index;
                                        currentDr = showOptimizeList[currentIndex];
                                    }
                                }
                            }
                        }

                        currentDr.times += 1;
                        remainNote -= 1;
                        //currentDr["TotalPrize"] = (float)currentDr["Prize"] * (int)currentDr["Num"];
                    }

                }
                /********endregion*/

                /********保守优化*/
                if (PrizeType == 2) {
                    var drOfSpecial = showOptimizeList[0];
                    var specialList = new Array();
                    specialList.push(drOfSpecial);
                    for (var i = 1; i < showOptimizeList.length; i++) {
                        var dr = showOptimizeList[i];
                        if (dr.singleBonus > drOfSpecial.singleBonus)
                            break;
                        specialList.push(dr);
                    }

                    // 保本
                    while (remainNote > 0) {
                        //dtDetail.DefaultView.Sort = "TotalPrize asc";
                        showOptimizeList.sort(opSort);
                        var dr = showOptimizeList[0];
                        if ((dr.singleBonus * dr.times) >= NoteCountTmp * 2)
                            break;

                        dr.times += 1;
                        remainNote -= 1;
                        //dr["TotalPrize"] = (float)dr["Prize"] * (int)dr["Num"];
                    }

                    // 将剩余倍数加到概率最高的那几注
                    var avg = remainNote / specialList.length;
                    var remain = remainNote % specialList.length;
                    $.each(specialList, function (idx, dr) {
                        var add = avg;
                        if (remain > 0) {
                            add += 1;
                            remain -= 1;
                        }
                        dr.times += add;
                        remainNote -= add;
                        //dr["TotalPrize"] = (float)dr["Prize"] * (int)dr["Num"];
                    });
                }
                /********endregion*/

                /********博冷优化*/
                if (PrizeType == 3) {
                    var drOfSpecial = showOptimizeList[showOptimizeList.length - 1];
                    var specialList = new Array();
                    specialList.push(drOfSpecial);
                    for (var i = showOptimizeList.length - 2; i >= 0; i--) {
                        var dr = showOptimizeList[i];
                        if (dr.singleBonus < drOfSpecial.singleBonus)
                            break;
                        specialList.push(dr);
                    }

                    // 保本
                    while (remainNote > 0) {
                        showOptimizeList.sort(opSort);
                        var dr = showOptimizeList[0];
                        if ((dr.singleBonus * dr.times) >= NoteCountTmp * 2)
                            break;

                        dr.times += 1;
                        remainNote -= 1;
                        //dr["TotalPrize"] = (float)dr["Prize"] * (int)dr["Num"];
                    }

                    // 将剩余倍数加到概率最高的那几注
                    var avg = remainNote / specialList.length;
                    var remain = remainNote % specialList.length;
                    $.each(specialList, function (idx, dr) {
                        var add = avg;
                        if (remain > 0) {
                            add += 1;
                            remain -= 1;
                        }
                        //dr["Num"] = (int)dr["Num"] + add;
                        dr.times += add;
                        remainNote -= add;
                        //dr["TotalPrize"] = (float)dr["Prize"] * (int)dr["Num"];
                    });
                }
                /********endregion*/

                /********保本优化-20130715添加*/
                /*if (PrizeType == 4)
			{
				//先给第一张票加上一倍，后面的票如果加上倍数后较大，则到下一轮再加倍数，知道把均匀的奖金倍数加到每张票上
				dtDetail.DefaultView.Sort = "prize asc";
				List<string> tmp = new List<string>(baobenList.ToArray());//保本就清除
				dtDetail.DefaultView.RowFilter = "Scheme in ('" + String.Join("','", baobenList.ToArray()) + "')";

				if (showOptimizeList.length > 0)
			{
				// 保本
				while (remainNote > 0 && tmp.Count > 0)
			{
				//dtDetail.DefaultView.Sort = "TotalPrize asc";
				int changeNum = 0;
				for (int i = 0; i < showOptimizeList.length; i++)
			{
				if (remainNote <= 0 || tmp.Count <= 0) break;
				DataRowView dr = dtDetail.DefaultView[i];

				if (tmp.Contains(dr["Scheme"].ToString()))
			{
				//保本，退出
				if ((float)dr["TotalPrize"] >= NoteCount * 2)
			{
				tmp.Remove(dr["Scheme"].ToString());
				continue;
				}
				dr["Num"] = (int)dr["Num"] + 1;
				remainNote -= 1;
				dr["TotalPrize"] = (float)dr["Prize"] * (int)dr["Num"];
				changeNum++;
				//保本，退出
				if ((float)dr["TotalPrize"] >= NoteCount * 2)
			{
				tmp.Remove(dr["Scheme"].ToString());
				}
				}
				}
				if (changeNum == 0) break;//一个都没变，就下一个啦~
				}
				}

				dtDetail.DefaultView.RowFilter = "Scheme not in ('" + String.Join("','", baobenList.ToArray()) + "')";
				if (showOptimizeList.length == 0) dtDetail.DefaultView.RowFilter = "";
				//给不是保本注数的增加注数-----平衡优化
				//先给第一张票加上一倍，后面的票如果加上倍数后较大，则到下一轮再加倍数，知道把均匀的奖金倍数加到每张票上
				dtDetail.DefaultView.Sort = "prize asc";

				while (remainNote > 0)
			{
				float minPrize = -1, firstTotal = -1, curTotalPrize = 0, curSinglePrize = 0;
				foreach (DataRowView dr in dtDetail.DefaultView)
			{
				if (remainNote <= 0) break;
				//if (baobenList.Contains(dr["Scheme"].ToString())) continue;//设置了保本的不参与这里
				//为了各票的奖金趋于平均~下一张票如果加上一注奖金超过第一张票一注的奖金，就不翻倍~
				curTotalPrize = (float)dr["TotalPrize"];//当前单注的当前总奖金
				if (minPrize > 0 && curTotalPrize > firstTotal) continue;//如果没加上一倍时已经大于加上的第一单注，就不往下了
				curSinglePrize = (float)dr["Prize"];//当前单注单倍的奖金
				if (minPrize > 0 && curTotalPrize + curSinglePrize > firstTotal * 1.3) continue;//如果加上一倍后大于已加上一倍的第一个单注的1.4倍，则等待下一个循环

				dr["num"] = (int)dr["num"] + 1;
				remainNote -= 1;
				dr["TotalPrize"] = (float)dr["Prize"] * (int)dr["Num"];
				if (minPrize < 0)
			{
				minPrize = (float)dr["Prize"];
				firstTotal = (float)dr["TotalPrize"];
				}
				}
				}
				}*/
                /********endregion*/

                $.each(showOptimizeList, function (idx, item) {
                    $(".optimizeSingle[data-single='" + item.scheme + "']").find(".s_times").val(item.times);
                });

            }

            optimizeBatchCount();
        }

    }

    var MatchListData = eval("(" + listtext + ")");
    function findRecord(schid) {
        for (var i = 0; i < MatchListData.length; i++) {
            if (MatchListData[i].scheduleId == schid) {
                return MatchListData[i];
            }
        }
        return null;
    }

    function findRecordByMatchID(matchid) {
        for (var i = 0; i < MatchListData.length; i++) {
            if (MatchListData[i].matchId == matchid) {
                return MatchListData[i];
            }
        }
        return null;
    }
    function GetPlayTypeOdds(playtype, record) {
        var RstOdds = new Array();
        for (var i = 0; i < record.oddsList.length; i++) {
            if (record.oddsList[i].playType == playtype) {
                RstOdds = record.oddsList[i].odds;
                break;
            }
        }
        return RstOdds;
    }

    function GetRowHTML(lttype, contents, record) {
        var HTMLArr = new Array();
        if (type != 3) {
            var contentArr = contents.split("_");
            for (var j = 0; j < contentArr.length; j++) {
                content = contentArr[j];
                var playtype = content.split("#")[1];
                var IndexList = content.split("#")[0].split(",");
                var col1txt = "";
                var ItemTextList = new Array();
                var odds = GetPlayTypeOdds(playtype, record);
                var colorClass = "";
                var rftxt = "";
                if (lttype == "10011") //竞足
                {
                    //0：胜平负过关；1：让球胜平负；2：比分过关；3：进球数过关；4：半全场胜平负；99：混合过关；
                    if (playtype == 0) {
                        col1txt = "非让球";
                        colorClass = "pbgcolor" + playtype;
                        ItemTextList = "胜,平,负".split(",");
                    }
                    else if (playtype == 1) {
                        colorClass = "pbgcolor" + (record.rf > 0 ? "1" : "5");
                        col1txt = "让" + "<br/>" + (record.rf > 0 ? "+" : "") + record.rf;
                        ItemTextList = "胜,平,负".split(",");
                    }
                    else if (playtype == 2) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "比分";
                        ItemTextList = "0:0,0:1,0:2,0:3,1:0,1:1,1:2,1:3,2:0,2:1,2:2,2:3,3:0,3:1,3:2,3:3,4:0,4:1,4:2,0:4,1:4,2:4,5:0,5:1,5:2,0:5,1:5,2:5,胜其他,平其他,负其他".split(",");
                    }
                    else if (playtype == 3) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "进球数";
                        ItemTextList = "0,1,2,3,4,5,6,7+".split(",");
                    }
                    else if (playtype == 4) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "半全场";
                        ItemTextList = "胜胜,胜平,胜负,平胜,平平,平负,负胜,负平,负负".split(",");
                    }

                } else if (lttype == "10012") {
                    //0：让分胜负；1：胜负；2：胜分差；3：大小分；99：混合过关；
                    if (playtype == 0) {
                        colorClass = "pbgcolor" + (record.rf > 0 ? "1" : "5");
                        col1txt = "让分"; //+ (record.rf > 0 ? "+" : "") + record.rf;
                        ItemTextList = "主胜,客胜".split(",");
                        rftxt = "(<span class='" + (record.rf > 0 ? "fontred" : "fontgreen") + "'>" + (record.rf > 0 ? "+" : "") + record.rf + "</span>)";
                    }
                    else if (playtype == 1) {
                        colorClass = "pbgcolor0";
                        col1txt = "胜负";
                        ItemTextList = "主胜,客胜".split(",");
                    }
                    else if (playtype == 2) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "胜分差";
                        ItemTextList = "胜1-5分,胜6-10分,胜11-15分,胜16-20分,胜21-25分,胜26分以上,负1-5分,负6-10分,负11-15分,负16-20分,负21-25分,负26分以上".split(",");
                    }
                    else if (playtype == 3) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "大小分";
                        ItemTextList = "大,小".split(",");
                        rftxt = "(<span class='fontblue'>" + record.zf  + "</span>)";
                    }
                } else if (lttype == "20011") {
                    //0：胜平负；1：总进球数；2：上下盘单双数；3：单场比分；4：半全场胜平负；5：胜负过关；
                    if (playtype == 0) {
                        colorClass = "pbgcolor" + (record.rf ==0?"0":record.rf > 0 ? "1" : "5");
                        col1txt = (record.rf == 0 ? "非让球" : record.rf > 0 ? "让<br/>+" + record.rf : "让<br/>" + record.rf);
                        ItemTextList = "胜,平,负".split(",");
                    }
                    else if (playtype == 1) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "进球数";
                        ItemTextList = "0,1,2,3,4,5,6,7+".split(",");
                    }
                    else if (playtype == 2) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "上下单双";
                        ItemTextList = "上单,上双,下单,下双".split(",");
                    }
                    else if (playtype == 3) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "比分";
                        ItemTextList = "0:0,0:1,0:2,0:3,1:0,1:1,1:2,1:3,2:0,2:1,2:2,2:3,3:0,3:1,3:2,3:3,4:0,4:1,4:2,0:4,1:4,2:4,胜其他,平其他,负其他".split(",");
                    }
                    else if (playtype == 4) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "半全场";
                        ItemTextList = "胜胜,胜平,胜负,平胜,平平,平负,负胜,负平,负负".split(",");
                    }
                    else if (playtype == 5) {
                        colorClass = "pbgcolor" + playtype;
                        col1txt = "胜负";
                        ItemTextList = "胜,负".split(",");
                    }
                }
                HTMLArr.push("<tr>");               
                HTMLArr.push("<td class='previewcol1 " + colorClass + "' >" + col1txt + "</td>");
                HTMLArr.push("<td class='previewcol2' ><div class='selmd' mid='" + record.matchId + "'  schid='" + record.scheduleId + "' >");
                for (var i = 0; i < IndexList.length; i++) {
                    HTMLArr.push("<span class='pselbtn'>" + ItemTextList[IndexList[i]] + rftxt + "<br/><span class='sptxt' >" + odds[IndexList[i]].toFixed(2) + "</span></span>")
                }
                HTMLArr.push("</div></td>");
                HTMLArr.push("</tr>");
            }
        } else {
            //二选一

            HTMLArr.push("<tr>");
            HTMLArr.push("<td class='previewcol1 pbgcolor0' >二选一</td>");
            HTMLArr.push("<td class='previewcol2' ><div class='selmd' mid='" + record.matchId + "'  schid='" + record.scheduleId + "' >");
            var contentArr = contents.split("_");
            var BtnHTMLArr = new Array();
            for (var j = 0; j < contentArr.length; j++) {
                content = contentArr[j];
                var playtype = content.split("#")[1];
                var IndexList = content.split("#")[0].split(",");
                var col1txt = "";
                var ItemTextList = new Array();
                var odds = GetPlayTypeOdds(playtype, record);
                if (record.rf < 0) {
                    if (playtype == 0) {
                        ItemTextList = "主胜,,".split(",");
                    }
                    else if (playtype == 1) {
                        ItemTextList = ",,客不败".split(",");
                    }
                } else if (record.rf > 0) {
                    if (playtype == 0) {
                        ItemTextList = ",,客胜".split(",");
                    }
                    else if (playtype == 1) {
                        ItemTextList = "主不败,,".split(",");
                    }
                }
                for (var i = 0; i < IndexList.length; i++) {
                    BtnHTMLArr.push("<span class='pselbtn'>" + ItemTextList[IndexList[i]] + "<br/><span class='sptxt' >" + odds[IndexList[i]].toFixed(2) + "</span></span>");
                }
            }
            if (record.rf > 0)
                BtnHTMLArr.reverse(); //正让分是倒序显示
            HTMLArr.push(BtnHTMLArr.join(""));
            HTMLArr.push("</div></td>");
            HTMLArr.push("</tr>");
        }
        return HTMLArr.join("");
    }

    function bindtouch() {
        $(".PreRecord").each(function () {
            var curobj = $(this)[0];
            var initX; //触摸位置
            var moveX; //滑动时的位置
            var X = 0; //移动距离
            var objX = 0; //目标对象位置
            curobj.addEventListener('touchstart', function (event) {
                var obj = curobj;
                if (obj.className == "PreRecord") {
                    initX = event.targetTouches[0].pageX;
                    objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                }
                if (objX == 0) {
                    curobj.addEventListener('touchmove', function (event) {
                        moveX = event.targetTouches[0].pageX;
                        X = moveX - initX;
                        if (X >= 0) {
                            obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                        } else if (X < 0) {
                            var l = Math.abs(X);
                            obj.style.WebkitTransform = "translateX(" + -l + "px)";
                            if (l > 80) {
                                l = 80;
                                obj.style.WebkitTransform = "translateX(" + -l + "px)";
                            }
                        }
                    });
                } else if (objX < 0) {
                    curobj.addEventListener('touchmove', function (event) {
                        moveX = event.targetTouches[0].pageX;
                        X = moveX - initX;
                        if (X >= 0) {
                            var r = -80 + Math.abs(X);
                            obj.style.WebkitTransform = "translateX(" + r + "px)";
                            if (r > 0) {
                                r = 0;
                                obj.style.WebkitTransform = "translateX(" + r + "px)";
                            }
                        } else { //向左滑动
                            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                        }
                    });
                }

            })
            curobj.addEventListener('touchend', function (event) {
                //event.preventDefault();
                var obj = event.target.parentNode;
                if (obj.className == "PreRecord") {
                    objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                    if (objX > -40) {
                        obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                        objX = 0;
                    } else {
                        obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                        objX = -80;
                    }
                }
            })
        });
    }
});