
//从联赛资料库进入，获取数据

var g_cache;
function safeHtml(d) {
    return d.replace(/[\r\n]/g, "").replace(/<script.+?<\/script>/g, "").replace(/<img.+?>/g, "").replace(/<link.+?>/g, "").replace(/<style.+?<\/style>/g, "");
}

function leagueCallback(league) {
    return function (d) {

    }
}

function getMatchAllCallback(league) {
    return function (d) {
        console.log("获取" + league.title + " 的数据 " + league.url + "完成");
        d = $(safeHtml(d));
        d.find("#team_fight_table").find("tr[matchid]").each((idx,el)=>{

        });
    }
}

function getMatchAll(league) {
    console.log("正在获取" + league.title + " 的数据 " + league.url);
    $.get(league.url, getMatchAllCallback(league));
}

function getMatch(league) {

}

function getMatchUrl(d) {
    var body;
    if (d) {
        body = d;
    } else {
        body = $("body");
    }
    tab = body.find(".zxmaindata .tabWidth");
    if (tab.length > 0) { //杯赛 淘汰制，小组制
        if (tab.length == 1) { //只有一个标签，直接找到最后一个"全部"，获取全部比赛
            a = body.find(".zxmaindata a.OddsLink:last")[0];
            var league = {};
            var lhref = $(a).attr("href");
            var idArr = lhref.split("/");
            league.name = $(a).text();
            league.id = idArr[3];
            league.seasonId = idArr[5];
            league.round = idArr[6];
            league.url = lhref;
            league.title = body.find(".NewLotteryLeftNav").text().replace(/[\r\n\s]/g, "") + ">" + tab.find(".Num3Menu_On").text() + ">" + league.name;
            if(league.name == "全部"){
                getMatchAll(league);
            }else{
                tab.remove();
                getMatchUrl(body);
            }
        } else if (tab.length == 2) {
            //每一个点进去，获取全部小组赛的链接
            $(tab[1]).find("a").each((idx, a) => {
                var league = {};
                var lhref = $(a).attr("href");
                var idArr = lhref.split("/");
                league.name = $(a).text();
                league.id = idArr[3];
                league.seasonId = idArr[5];
                league.round = idArr[6];
                league.url = lhref;
                league.title = body.find(".NewLotteryLeftNav").text().replace(/[\r\n\s]/g, "") + ">" + tab.find(".Num3Menu_On").text() + ">" + league.name;
                console.log("正在获取" + league.title + " 的数据 " + league.url);
                $.get(league.url, function (data) {
                    body = $(safeHtml(data));
                    body.find(".zxmaindata .tabWidth:eq(1)").remove();
                    getMatchUrl(body);
                });
            });
        } else {
            alert("数据不对");
        }
    } else { //联赛
        var aLinks = body.find(".zxmaindata .OddsLink");
        var a = aLinks[aLinks.length - 1];
        if ($(a).text().indexOf("全部") != -1) { //轮制
            var league = {};
            var lhref = $(a).attr("href");
            var idArr = lhref.split("/");
            league.name = $(a).text();
            league.id = idArr[3];
            league.seasonId = idArr[5];
            league.round = idArr[6];
            league.url = lhref;
            league.title = body.find(".NewLotteryLeftNav").text().replace(/[\r\n\s]/g, "") + ">" + league.name;
            getMatchAll(league);
        } else {
            aLinks.each((idx, a) => {
                var league = {};
                var lhref = $(a).attr("href");
                var idArr = lhref.split("/");
                league.name = $(a).text();
                league.id = idArr[3];
                league.seasonId = idArr[5];
                league.round = idArr[6];
                league.url = lhref;
                league.title = body.find(".NewLotteryLeftNav").text().replace(/[\r\n\s]/g, "") + ">" + league.name;
                getMatchAll(league);
                if ($(a).parent().hasClass("linkblock_select")) {
                    return false;
                }
            });
        }
    }
}

function getLeague() {
    var leauges = [];
    $(".LotteryListBrim:eq(2) .LotteryList_Data a").slice(1, 7).each((idx, a) => {
        var league = {};
        var lhref = $(a).attr("href");
        var idArr = lhref.split("/");
        league.name = $(a).text();
        league.id = idArr[3];
        league.seasonId = idArr[5];
        league.url = lhref;
        leauges.push(league);
    })

    for (var i = 0; i < leauges.length; i++) {
        var league = leauges[i];
        $.get(league.url, leagueCallback(league));
    }

}

function doHook() {
    if (typeof jQuery == "undefined" || jQuery.fn.jquery < '2.2.4') {
        if (!document.getElementById("hasJquery")) {
            console.log("开始注入标准库1");
            var sc = document.createElement("script");
            sc.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js';
            sc.id = "hasJquery";
            document.body.append(sc);
        }
        console.log(new Date() + " 标准库1注入未完成，等待中....");
        setTimeout(doHook, 1000);
        return;
    }
    console.log("标准库1已经完成注入");
    if (typeof layer == "undefined") {
        if (!document.getElementById("hasLayer")) {
            console.log("开始注入标准库2");
            jQuery("head").append('<link href="https://cdn.bootcdn.net/ajax/libs/layer/2.3/skin/layer.css" rel="stylesheet"><script src="https://cdn.bootcdn.net/ajax/libs/layer/2.3/layer.js"></script><input type="hidden" id="hasLayer"/>');
        }
        console.log(new Date() + " 标准库2注入未完成，等待中....");
        setTimeout(doHook, 1000);
        return;
    }
    console.log("标准库2已经完成注入");

}
doHook();