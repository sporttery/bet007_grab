//从http://www.okooo.com/soccer/match/610101/history/ 开始获取数据，最小id 为 610101 开始，


var g_cache;

function safeHtml(d) {
    return d.replace(/[\r\n]/g, "").replace(/<head.+?<\/head>/g, "").replace(/<script.+?<\/script>/g, "").replace(/<img.+?>/g, "").replace(/<link.+?>/g, "").replace(/<style.+?<\/style>/g, "");
}

/*
获取所有的球队
var g_team = [];

function teamCallback(teamId) {
    return function (d) {
        d = $(safeHtml(d));
        var parentName = d.find(".qdtxt span:eq(0)").text();
        var name = d.find(".team-title").text();
        var team = {
            teamId,
            name,
            parentName
        };
        g_team.push(team);
        if (teamId < 2833) {
            setTimeout(getTeam, (teamId % 10) * 100, teamId + 1);
        }
    }
}

function getTeam(teamId) {
    // $.get("/soccer/team/" + teamId + "/", teamCallback(teamId));
    $.ajax({
        type: "get",
        url: "/soccer/team/" + teamId + "/",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=gb2312");
        },
        success: teamCallback(teamId)
    })
}
getTeam(1);
*/


//比赛结果
function getResult(scores) {
    return scores[0] == scores[1] ? "平" : scores[0] > scores[1] ? "胜" : "负";
}
//比赛积分
function getGoalscore(scores) {
    return scores[0] > scores[1] ? 3 : scores[0] == scores[1] ? 1 : 0;
}

//获取分区
function getScoreSection(score, hookFlag) {
    score = parseInt(score)
    if (hookFlag == 33) {
        return 10 - parseInt(score / 10);
    } else if (hookFlag == 30) {
        return 9 - parseInt(score / 10);
    }
}
/**
 * 从tr中获取比赛数据
 */
function getMatchFromTr(tr) {
    var id = $(tr).attr("data-matchid");
    tds = tr.children;
    var homeName = $(tds[2]).text();
    var homeId = $(tds[2]).attr("attr");
    var leagueId = $(tds[0]).find("a").attr("href").split("/")[3];
    var leagueName = $(tds[0]).find("a").text();
    var awayName = $(tds[4]).text();
    var awayId = $(tds[4]).attr("attr");
    var fullscore = $(tds[3]).text();
    var halfscore = $(tds[5]).text();
    var time = $(tds[1]).find(".smalltitle").text();
    if (time.length == 16) {
        time = time + ":00";
    } else if (time.length == 8) {
        time = $(tds[1]).find("a").text() + " " + time;
    }
    var playtime = time;
    var scores = fullscore.split("-");
    var result = "未开",
        goalscore = 0;
    if (scores.length == 2) {
        result = getResult(scores);
        goalscore = getGoalscore(scores);
    }
    return {
        id,
        leagueId,
        leagueName,
        homeId,
        homeName,
        awayId,
        awayName,
        fullscore,
        halfscore,
        playtime,
        result,
        goalscore
    };
}

function sum(arr, key) {
    var s = 0;
    if (key) {
        for (var i = 0; i < arr.length; i++) {
            s += parseInt(arr[i][key]);
        }
    } else {
        for (var i = 0; i < arr.length; i++) {
            s += parseInt(arr[i]);
        }
    }
    return s;
}

function concat(arr, key, split) {
    var s = [];
    if (key) {
        for (var i = 0; i < arr.length; i++) {
            s.push(arr[i][key]);
        }
    } else {
        for (var i = 0; i < arr.length; i++) {
            s.push(arr[i]);
        }
    }
    if (!split) {
        split = "";
    }
    return s.join(split);
}


function calcBolool(data) {
    var match = data.match;
    var all30_h = data.all30_h;
    var all30_a = data.all30_a;
    var notFriendly_h = data.notFriendly_h;
    var notFriendly_a = data.notFriendly_a;

    match.matchList30 = JSON.stringify({
        "h": all30_h,
        "a": all30_a
    });
    match.matchList33 = JSON.stringify({
        "h": notFriendly_h,
        "a": notFriendly_a
    });
    match.hscore30 = sum(all30_h, "hgoalscore");
    match.ascore30 = sum(all30_a, "hgoalscore");
    match.hsection30 = getScoreSection(match.hscore30, 30);
    match.asection30 = getScoreSection(match.ascore30, 30);
    match.hscore33 = sum(notFriendly_h, "hgoalscore");
    match.ascore33 = sum(notFriendly_a, "hgoalscore");
    match.hsection33 = getScoreSection(match.hscore33, 30);
    match.asection33 = getScoreSection(match.ascore33, 30);

    match.hresult30 = concat(all30_h, "hresult");
    match.aresult30 = concat(all30_a, "hresult");
    match.hresult33 = concat(notFriendly_h, "hresult");
    match.aresult33 = concat(notFriendly_a, "hresult");

    var hnear3 = notFriendly_h.slice(0, 3);
    var anear3 = notFriendly_a.slice(0, 3);
    var hnear6 = notFriendly_h.slice(0, 6);
    var anear6 = notFriendly_a.slice(0, 6);

    match.hscore3 = sum(hnear3, "hgoalscore");
    match.ascore3 = sum(anear3, "hgoalscore");
    if (match.hscore3 > match.ascore3) {
        match.hstrong3 = "强";
        match.astrong3 = "弱";
    } else if (match.hscore3 < match.ascore3) {
        match.hstrong3 = "弱";
        match.astrong3 = "强";
    } else {
        match.hstrong3 = "平";
        match.astrong3 = "平";
    }
    match.hscore6 = sum(hnear6, "hgoalscore");
    match.ascore6 = sum(anear6, "hgoalscore");
    if (match.hscore6 > match.ascore6) {
        match.hstrong6 = "强";
        match.astrong6 = "弱";
    } else if (match.hscore6 < match.ascore6) {
        match.hstrong6 = "弱";
        match.astrong6 = "强";
    } else {
        match.hstrong6 = "平";
        match.astrong6 = "平";
    }

    match.hresult3 = concat(hnear3, "hresult");
    match.aresult3 = concat(anear3, "hresult");
    match.hresult6 = concat(hnear6, "hresult");
    match.aresult6 = concat(anear6, "hresult");


}

function getMatchCallback(id, maxId) {
    return function (d) {
        d = $(safeHtml(d));
        var tr = d.find(".jsThisMatch");
        var tds = tr.find("td");
        var leagueUrl = $(tds[0]).find("a").attr("href").split("/");
        var seasonId = leagueUrl[5];
        var lunci = d.find("#lunci");
        var spans = lunci.find("span");
        var seasonName = $(spans[0]).find("a:last").text();
        var round = $(spans[1]).text().trim();
        if (spans.length == 3) {
            round += $(spans[2]).text().trim();
        }
        if (round == "") {
            round = "0";
        }

        var match = getMatchFromTr(tr[0]);
        match.seasonId = seasonId;
        match.seasonName = seasonName;
        match.round = round;

        var time = d.find(".time").text();
        if (time.length == 13) {
            time = time.substring(0, 8) + " " + time.substring(8);
        }
        var playtime = "20" + time + ":00";
        match.playtime = playtime;

        var now = new Date().getTime();

        playtime = playtime.split(/[- :]/);
        playtime[1] = parseInt(playtime[1]) - 1;

        matchtime = new Date(playtime[0], playtime[1], playtime[2], playtime[3], playtime[4], playtime[5]);

        if (now < matchtime.getTime()) {
            console.log("日期已经大于今天了，结束程序");
            $('#clickme').show();
            return;
        }


        //最近的30场比赛
        var all30_h = [],
            all30_a = [];
        //俱乐部最近33场比赛，要去掉友谊赛
        //国家队比赛保留友谊赛
        var notFriendly_h = [],
            notFriendly_a = [];
        d.find(".homecomp").find("tr:gt(2)").each((idx, el) => {
            var matchHistory = getMatchFromTr(el);
            if (matchHistory.id == match.id) {
                return true;
            }
            var scores = matchHistory.fullscore.split("-");

            if (scores.length == 2) {
                if (matchHistory.homeId != match.homeId) { //如果这场比赛的客队是查询比赛的主队，则将比分替换下获取比赛结果和积分
                    tmp = scores[0];
                    scores[0] = scores[1];
                    scores[1] = tmp;
                }
                var result = getResult(scores);
                var goalscore = getGoalscore(scores);
                matchHistory.hresult = result;
                matchHistory.hgoalscore = goalscore;
            } else {
                return true;
            }
            if (notFriendly_h.length != 33 && $(el).attr("data-lt") != "friend") {
                notFriendly_h.push(matchHistory);
            }
            if (all30_h.length != 30) {
                all30_h.push(matchHistory);
            }
            if (notFriendly_h.length == 33 && all30_h.length == 30) {
                return false;
            }
        });

        d.find(".awaycomp").find("tr:gt(2)").each((idx, el) => {
            var matchHistory = getMatchFromTr(el);
            if (matchHistory.id == match.id) {
                return true;
            }
            var scores = matchHistory.fullscore.split("-");

            if (scores.length == 2) {
                if (matchHistory.homeId != match.awayId) { //如果这场比赛的客队是查询比赛的主队，则将比分替换下获取比赛结果和积分
                    tmp = scores[0];
                    scores[0] = scores[1];
                    scores[1] = tmp;
                }
                var result = getResult(scores);
                var goalscore = getGoalscore(scores);
                matchHistory.hresult = result;
                matchHistory.hgoalscore = goalscore;
            } else {
                return true;
            }
            if (notFriendly_a.length != 33 && $(el).attr("data-lt") != "friend") {
                notFriendly_a.push(matchHistory);
            }
            if (all30_a.length != 30) {
                all30_a.push(matchHistory);
            }
            if (notFriendly_a.length == 33 && all30_a.length == 30) {
                return false;
            }
        });

        calcBolool({
            match,
            all30_h,
            all30_a,
            notFriendly_h,
            notFriendly_a
        });
        if (g_cache) {
            g_cache.value += "," + JSON.stringify(match);
        } else {
            console.log(match);
        }

        if (id < maxId) {
            console.log("id=" + id + "已经获取完成，即将获取下一个");
            setTimeout(getMatch, (id % 10) * 100, id + 1, maxId);
        } else {
            console.log("当前id=" + id + ",已经到了最大id=" + maxId + "，结束程序");
            $('#clickme').show();
        }
    }
}

function getMatch(id, maxId) {
    console.log("正在获取id " + id + ",最大id是 " + maxId);
    $.ajax({
        type: "get",
        url: "/soccer/match/" + id + "/history/",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=gb2312");
        },
        success: getMatchCallback(id, maxId)
    })
}

function doit() {
    var arr = $("#value").val().split(/[^\d]+/g);
    if (arr.length == 2) {
        $('#clickme').hide();
        getMatch(parseInt(arr[0]), parseInt(arr[1]));
    } else {
        alert("格式错误，请参照 1-1000");
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
    document.writeln("<h1>请输入开始的id和结束的id，用\"-\"减号分开，比如 1000-1001: <input id='value' value='' /></h1><h1><a href='javascript:doit()' id='clickme' style='color:red'>点我开始</a></h1><textarea id='g_cache' rows=50 cols=250></textarea>");
    g_cache = document.getElementById("g_cache");
}
doHook();