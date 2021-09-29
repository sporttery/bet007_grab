var ClockNowTime; //服务器时间
var ClockDiff; //服务器和客户机时差
var stateShow = ",未开赛=0,上半场=1,中场=2,下半场=3,待定=-11,腰斩=-12,中断=-13,推迟=-14,取消=-99,完场=-1,";
function NowTime(nowtime) {
    ClockNowTime = new Date(nowtime);
    ClockDiff = new Date() - ClockNowTime;
}
//加载直播内容
function LoadChange(xmlTag) {
    $.ajax({
        url: "../data/change"+xmlTag+".xml?rnum=" + Math.random(),
        type: "get",
        dataType: "xml",
        timeout: 1000,
        //error: function(xml){ showTips('加载XML时发生异常：'+xml); },
        success: function(xml) {
            var msgList = new Array();
            $(xml).find("h").each(function(i) {
                var txt = $(this).text().split('^');
                if ($("#" + txt[0]).length > 0) {
                    var t = new Date(new Date() - ClockDiff);
                    var lastList = $("#" + txt[0]).attr("list").split('^');

                    var e = $("#" + txt[0]).attr("else").split('^'); //苏丹^布基纳法索^#567576^非洲杯^平手
                    var msg = "";
                    var hasChange = false;
                    for (var i = 0; i <= 7; i++) {
                        if (txt[i] != lastList[i]) {
                            if (i == 2 && parseInt(txt[2]) > 0) msg += e[0] + "(进球) <span style='color:red'>" + txt[2] + "</span><br>" + e[1] + " <span style='color:red'>" + txt[3] + "</span><br>";
                            else if (i == 3 && parseInt(txt[3]) > 0) msg += e[0] + " <span style='color:red'>" + txt[2] + "</span><br>" + e[1] + "(进球) <span style='color:red'>" + txt[3] + "</span><br>";
                            else if (i == 1 && (txt[1] == "2" || parseInt(txt[1]) < 0)) msg += e[0] + " <span style='color:red'>" + txt[2] + "</span><br>" + e[1] + "<span style='color:red'>" + txt[3] + "</span><br><span style='color:red'>" + stateShow.replace(new RegExp("^.*,([^,]+)\=" + txt[1] + ",.*$", "gm"), "$1") + "</span><br>";
                            else if (i == 6) msg += "<span class='red'>" + txt[6] + "</span>" + e[0] + "(红牌) <span style='color:red'>" + txt[2] + "</span><br>" + e[1] + " <span style='color:red'>" + txt[3] + "</span><br>";
                            else if (i == 7) msg += e[0] + " <span style='color:red'>" + txt[2] + "</span><br>" + e[1] + "(红牌) <span style='color:red'>" + txt[3] + "</span><span class='red'>" + txt[7] + "</span><br>";
                            hasChange = true;
                        }
                    }
                    if (hasChange) {
                        if ((txt[1] == "-1" || txt[1] == "3") && txt[4] != "" && txt[5] != "") msg += "半:" + txt[4] + ":" + txt[5] + "<br>";
                        if (!$("#" + txt[0]).is(':hidden')) msgList.push(msg);
                        $("#" + txt[0]).attr("state", txt[1]);
                        $("#" + txt[0]).removeClass("list").addClass("listG");
                        setTimeout(function() { $("#" + txt[0]).removeClass("listG").addClass("list"); }, (3 * 1000));
                    }
                    $("#" + txt[0]).attr("list", $(this).text());
                    show(txt[0]);
                }
            });
            if (msgList.length != 0) {
                showTips(msgList.join("<hr style='color:#CCC;' />"));
				if(msgList.join(",").indexOf("进球")!=-1) PlaySound();
            }
        },
		complete: function (XHR, TS) { XHR = null; }
    });
	IntervalMi();
}
//更新比赛时间
function IntervalMi(){
	$(".list").each(function(index){
		if($(this).attr("state")=="1" || $(this).attr("state")=="3"){
			show($(this).attr("id"));
		}
	});
}

function show(id) {
    if ($("#" + id).length > 0) {
        var e = $("#" + id).attr("else").split('^'); //苏丹^布基纳法索^#567576^非洲杯^平手
        var list = $("#" + id).attr("list").split('^'); //654224^-1^2^0^1^0^0^0^02:00^2012-01-31 02:00
		var PolyGoal = $("#" + id).attr("PolyGoal");
		$("#show" + id).html("<a href='/Trade/Info/MatchAnalysis.aspx?sportType=1&scheduleId=" + id + "' onclick=\"location.href='/Trade/Info/MatchAnalysis.aspx?sportType=1&scheduleId=" + id + "';return false;\">"
			+ "<table style=\"width:100%\" border=\"0\" cellSpacing=\"0\" cellPadding=\"0\">"
			+ "<tr><td class=\"time\"><span style='color:" + e[2] + "'>" + e[3] + "</span> " + list[8] + "</td>"
			+ "<td style='color:" + (list[1] == "0" ? "#6A6A6A" : "red") + ";' class=\"middle\">"
			//list.length > 10 && parseInt(list[1]) > 0
			+ (parseInt(list[1])==2?"中场":list.length >= 10 &&parseInt(list[1]) > 0 ? showMi(list[1], list[9],true) : stateShow.replace(new RegExp("^.*,([^,]+)\=" + list[1] + ",.*$", "gm"), "$1").replace(/(场)|(半)|(开赛)/gi, ""))
			+ "</td>"
			+ "<td class=\"rq\">" + e[4] + (list[4] != "" && list[5] != "" ? "(" + list[4] + ":" + list[5] + ")" : "") + "</td>"
			+ "<td rowspan=2 class=\"arrow\"><em class='arrow-right'></em></td>"
			+ "</tr>"
			+ "<tr>"
			+ "<td class=\"ML\">" + (list[6] != "" && list[6] != "0" ? "<span class='red'>" + list[6] + "</span>" : "") + e[0] +(PolyGoal=="" || PolyGoal == "0"?"":PolyGoal.indexOf("-")==-1?"<span style='color:red'>("+PolyGoal+")</span>":"<span style='color:green'>("+PolyGoal+")</span>")+ "</td>"
			+ "<td class=\"middle\">" + (list[2] != "" && list[3] != "" ? list[2] + ":" + list[3] : "") + "</td>"
			+ "<td class=\"MR\">" + e[1] + (list[7] != "" && list[7] != "0" ? "<span class='red'>" + list[7] + "</span>" : "") + "</td>"
			+ "</tr>"
			+ "</table></>");
    }
}
function showMi(state, oriTime,isChange) {
    var t = oriTime.split(',');
    var t2 = new Date(t[0], parseInt(t[1]) - 1, t[2], t[3], t[4], t[5]);
    var mi = Math.floor((new Date() - t2 - ClockDiff) / 60000);
	if(mi>1000){
		t2 = new Date(t[0], parseInt(t[1]), t[2], t[3], t[4], t[5]);
		mi = Math.floor((new Date() - t2 - ClockDiff) / 60000);
	}
    if (state == "3") {
        mi += 46;
		//else mi -= 15;
        if (mi > 90) mi = "90+";
        if (mi < 46) mi = "46";
    }
    return mi + "'";
}

function filter(type) {
    $(".list").each(function(index) {
        var sid = $(this).attr("id");
        /*//全部
        if (type == 0) {
            $(this).show();
        }
        //未开赛
        else if (type == 1) {
            if ($(this).attr("state") == "0") $(this).show();
            else $(this).hide();
        }
        //进行中
        else if (type == 2) {
            if (parseInt($(this).attr("state")) > 0) $(this).show();
            else $(this).hide();
        }*/
		//2018-01改成即时
		if(type == 0){
			if (parseInt($(this).attr("state")) >= 0) $(this).show();
            else $(this).hide();
		}
        //已完场
        else if (type == 3) {
            if ($(this).attr("state") == "-1") $(this).show();
            else $(this).hide();
        }
        //我的关注
        else if (type == 4) {
            var liveFocus = Storage.Get("liveFocus_" + typeID + "_" + Issue);
            if (liveFocus != null && liveFocus.indexOf("," + sid + ",") != -1) $(this).show();
            else $(this).hide();
        }
    });
    if (type == 0) $("#fixheader .hmIssue").hide();
    else $("#fixheader .hmIssue").show();
}

function switchissue(obj) {
	if(obj.value == "return") location.href = "List.aspx";
    else location.href = "Football.aspx?typeid=" + typeID + "&issue=" + obj.value;
}

$(document).ready(function() {
    $("#liveUL td").click(function() {
        var type = parseInt($(this).attr("value"));
        filter(type);
        if($(".list:visible").length<=0)
            $("#noGame").show();
        else
             $("#noGame").hide();
        $("#liveUL td").each(function(index) {
            $(this).removeClass("on");
            if (type == $(this).attr("value")) $(this).addClass("on");
        });
    });
	$("#liveUL .on").trigger("click");
    $(".list th").click(function() {
        var sid = $(this).parents("table").attr("id");
        var c = $(this).attr("class");
        var liveFocus = Storage.Get("liveFocus_" + typeID + "_" + Issue);
        if (liveFocus == null) liveFocus = ",";
        if (c == "focus2") {
            liveFocus = liveFocus.replace("," + sid + ",", ",");
            $(this).removeClass("focus2").addClass("focus1");
            showTips("取消关注！");
        }
        else {
            liveFocus += sid + ",";
            $(this).removeClass("focus1").addClass("focus2");
            showTips("关注成功！");
        }
        Storage.Set("liveFocus_" + typeID + "_" + Issue, liveFocus);
    });
    $(".list table").click(function() {
        var sid = $(this).parents("table").attr("id");
        location.href = "Detail.aspx?sid=" + sid;
    });
    if (Storage.Get("liveFocus_" + typeID + "_" + Issue) != null) {
        var liveFocus = Storage.Get("liveFocus_" + typeID + "_" + Issue);
        var newFocus = ",";
        $(".list").each(function(index) {
            var sid = $(this).attr("id");
            if (liveFocus != null && liveFocus.indexOf("," + sid + ",") != -1) {
                $(this).find(".focus1").removeClass("focus1").addClass("focus2");
                newFocus += sid + ",";
            }
        });
        Storage.Set("liveFocus_" + typeID + "_" + Issue, newFocus);
    }
    $(".list").each(function(index) {
        show($(this).attr("id"));
    });
    if (isCurrentIssue == 1) {
		LoadChange('2');
        setInterval("LoadChange('')", 10 * 1000);
        setInterval(function() {
            $(".list").each(function(index) {
                var sid = $(this).attr("id");
                if (parseInt($(this).attr("state")) > 0) show(sid);
            });
        }, 5000);
    }
});
//播放音效
function PlaySound(){
	try{
		$("#divSound").html("<audio src='/images/goals_sound.wav' autoplay='true'></audio>");
		$("#divSound").html("");
	}catch(e){}
}
