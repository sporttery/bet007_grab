const Logger = require("./Logger");


function hook() {

    window["g_data"] = {};
    window["n_data"] = {};
    function getXMLHttpRequest() {
        var xhrc = null;
        try {
            // Firefox, Opera 8.0+, Safari，IE7+
            xhrc = new XMLHttpRequest();
        }
        catch (e) {
            // Internet Explorer
            try {
                xhrc = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    xhrc = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                    xhrc = null;
                }
            }
        }
        return xhrc;
    }
    var loadIdx = null;
    function myGet(url, fun, async) {
        if (!loadIdx && typeof layer != "undefined") {
            loadIdx = layer.load(1);
        }
        xmlhttp = getXMLHttpRequest();
        xmlhttp.open("GET", url, async);//false 同步 true 异步
        xmlhttp.overrideMimeType("text/html;charset=gb2312");//设定以gb2312编码识别数据
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4)
                if (xmlhttp.status == 200) {
                    window["n_data"][url] = xmlhttp.responseText;
                    fun(xmlhttp.responseText);
                }
        };
        xmlhttp.send(null);
    }
    function getMatch(el) {
        tds = el.children;
        id = $(el).attr("data-matchid");

        var a = $(tds[0]).find("a");
        href_part = a.attr("href").split("/");
        lid = href_part[3];
        sid = href_part[5];
        lname = a.text();
        round = $(tds[0]).find("span").text();
        if (round == "") {
            round = "0"
        }
        ltype = $(el).attr("data-lt");
        playtime = $(tds[1]).find(".smalltitle").text() + ":00";
        hname = $(tds[2]).text();
        var scoreAttr = [];
        if ($(el).attr("attr")) {
            scoreAttr = $(el).attr("attr").split(",");
        } else {
            scoreAttr = [$(tds[2]).attr("attr"), "-", $(tds[4]).attr("attr")];
        }
        homeId = scoreAttr[0];
        fullscore = scoreAttr[1];
        awayId = scoreAttr[2];
        aname = $(tds[4]).text();
        halfscore = $(tds[5]).text();
        match = { id, lid, sid, lname, round, playtime, homeId, hname, fullscore, awayId, aname, halfscore, ltype }
        return match;
    }
    window["showMatchList"]=function(mId,hookFlag,hOrA) {
        var data = window["g_data"]["m_" + mId];
        var match = data.match;
        var matchList =data[hOrA+"score" + hookFlag + "List"];
        if (typeof layer != "undefined") {
            var html = ['<table border="1"><tr><th>联赛</th><th>主队</th><th>客队</th><th>时间</th><th>全场</th><th>半场</th><th>果</th><th>析</th></tr>'];
            var keys = ["lname", "hname", "aname", "playtime", "fullscore", "halfscore", "result"]
            for (var i = 0; i < matchList.length; i++) {
                var match = matchList[i];
                html.push('<tr>');
                for (var j = 0; j < keys.length; j++) {
                    html.push('<td>' + match[keys[j]] + '</td>');
                }
                html.push('<td><a href="http://www.okooo.com/soccer/match/' + match.id + '/history/" target="_blank">析</a></td>')
                html.push('<tr>');
            }
            html.push('</table>')
            // layer.alert(html.join(''));
            layer.open({
                title: match.hname + ' ' + match.aname,
                content: html.join(''),
                area :['500px','300px']
              });
        } else {
            console.log(matchList);
            alert('需要加载layer才能显示');
        }
    }
    function nData(d) {
        homecompIdx = d.indexOf("homecomp");
        awaycompIdx = d.indexOf("awaycomp");
        if (homecompIdx > 0 && awaycompIdx > homecompIdx) {
            homecomp = d.substring(homecompIdx, awaycompIdx);
            trIdx = homecomp.indexOf("<tr");
            tableIdx = homecomp.indexOf("</table>");
            homecomp = $('<table>' + homecomp.substring(trIdx, tableIdx) + '</table>');
            // console.log($(homecomp));
            awaycomp = d.substring(awaycompIdx);
            trIdx = awaycomp.indexOf("<tr");
            tableIdx = awaycomp.indexOf("</table>");
            awaycomp = $('<table>' + awaycomp.substring(trIdx, tableIdx) + '</table>');
            // console.log($(awaycomp));
            trs = homecomp.find("tr[data-matchid]");
            var mId = $(trs[0]).attr("data-matchid");
            var data = window["g_data"]["m_" + mId];
            if (!data.match) {
                data.match = getMatch(trs[0]);
            }
            for (var i = 1; i < trs.length; i++) {
                var match = getMatch(trs[i]);
                data.homeHistoryList.push(match);
            }
            trs = awaycomp.find("tr[data-matchid]");
            for (var i = 1; i < trs.length; i++) {
                var match = getMatch(trs[i]);
                data.awayHistoryList.push(match);
            }
            calcBolool(data);
            var hookFlagArr = [33, 30];
            for (var i = 0; i < hookFlagArr.length; i++) {
                var hookFlag = hookFlagArr[i];
                var tds = $("#m" + mId + "_" + hookFlag).find("td");
                if (tds.length > 22) {
                    tds[15].innerText = data["hscore" + hookFlag];
                    tds[15].title = data["hresult" + hookFlag];
                    tds[16].innerText = data["ascore" + hookFlag];
                    tds[16].title = data["aresult" + hookFlag];
                    tds[17].innerText = getScoreSection(data["hscore" + hookFlag], hookFlag);
                    tds[18].innerText = getScoreSection(data["ascore" + hookFlag], hookFlag);
                    tds[19].innerText = data["hresult" + hookFlag + "_3"];
                    tds[20].innerText = data["aresult" + hookFlag + "_3"];
                    var hQiang = "平", aQiang = "平";
                    if (data["hscore" + hookFlag + "_3"] > data["ascore" + hookFlag + "_3"]) {
                        hQiang = "强";
                        aQiang = "弱";
                    } else if (data["hscore" + hookFlag + "_3"] < data["ascore" + hookFlag + "_3"]) {
                        hQiang = "弱";
                        aQiang = "强";
                    }

                    tds[21].innerText = hQiang;
                    tds[22].innerText = aQiang;
                }
            }
        }
    }
    var match_result = ['输', '平', '平平', '嬴'];
    function getScoreSection(score, hookFlag) {
        score = parseInt(score)
        if (hookFlag == 33) {
            return 10 - parseInt(score / 10);
        } else if (hookFlag == 30) {
            return 9 - parseInt(score / 10);
        }
    }
    function sum(arr) {
        var i = 0;
        arr.forEach((t) => {
            i += parseInt(t);
        })
        return i;
    }
    function calcMatchScore(data, size, notFriendly, hOrA/*传入 h 或者  a*/) {
        var match = data.match;
        var arr = hOrA == 'h' ? data.homeHistoryList : data.awayHistoryList;
        var scoreKey = hOrA + 'score' + size;
        var resultKey = hOrA + 'result' + size;
        var teamname = match[hOrA + "name"];
        var matchlist = [];
        var jfarr = [], resultarr = [];
        for (var i = 0, j = 0; i < arr.length && j < size; i++) {
            var matchHistory = arr[i];
            if (!notFriendly && matchHistory.ltype == "friend") {
                continue;
            }
            var fullscore = matchHistory.fullscore;
            var score = fullscore.split("-");
            if (score.length == 2) {
                if (!matchHistory['result']) {
                    if (matchHistory.hname != teamname) {
                        matchHistory['score'] = score[0] > score[1] ? 0 : score[0] == score[1] ? 1 : 3;
                    } else {
                        matchHistory['score'] = score[0] > score[1] ? 3 : score[0] == score[1] ? 1 : 0;
                    }
                    matchHistory['result'] = match_result[matchHistory['score']];
                }
                j++;
                matchlist.push(matchHistory);
                jfarr.push(matchHistory['score']);
                resultarr.push(matchHistory['result']);
            }
        }
        data[scoreKey + "List"] = matchlist;
        data[scoreKey] = sum(jfarr);
        data[resultKey] = resultarr.join("");
        data[scoreKey + "_3"] = sum(jfarr.slice(0, 3));
        data[resultKey + "_3"] = resultarr.slice(0, 3).join("");
    }

    function calcBolool(data) {
        if (!match_result) {
            match_result = ['输', '平', '平平', '嬴'];
        }
        var match = data.match;
        console.log(match.hname, match.aname, match.id, "正在计算bolool指数");
        //33场 排除友谊赛 30场 包括友谊赛
        calcMatchScore(data, 33, false, 'h');
        calcMatchScore(data, 30, true, 'h');
        calcMatchScore(data, 33, false, 'a');
        calcMatchScore(data, 30, true, 'a');

    }
    var allMatch = $(".touzhu_1:visible");
    allMatch.each((idx, el) => {
        var id = el.id.split("_")[1];
        var url = "/soccer/match/" + id + "/history/";
        var d = window["n_data"][url];
        lname = $(el).find(".liansai a").text();
        lid = $(el).attr("filterdata").split(",")[1];
        ordercn = $(el).attr("data-ordercn");
        hname = $(el).attr("data-hname");
        aname = $(el).attr("data-aname");
        rq = $(el).attr("data-rq");
        playtime = $(el).find(".shijian").attr("title").replace("比赛时间:", "");
        h = $(el).find(".shenpf .zhu").attr("data-sp");
        d = $(el).find(".shenpf .ping").attr("data-sp");
        a = $(el).find(".shenpf .fu").attr("data-sp");
        h1 = $(el).find(".rangqiuspf .zhu").attr("data-sp");
        d1 = $(el).find(".rangqiuspf .ping").attr("data-sp");
        a1 = $(el).find(".rangqiuspf .fu").attr("data-sp");
        var match = { id, lname, lid, ordercn, hname, aname, rq, playtime, h, d, a, h1, d1, a1 };
        window["g_data"]["m_" + id] = { "homeHistoryList": [], "awayHistoryList": [], match };
        if (d) {
            nData(d);
        } else {
            myGet(url, nData, false);//false 同步 true 异步
        }
    });
    var allIds = [];
    function loadMatchData(mId) {
        var g_data = window["g_data"];
        var ids;
        if (mId) {
            ids = [mId];
        } else {
            mId = Object.keys(g_data)[0].substring(2);
            ids = allIds;
        }
        var matchIds = allIds.join(",");
        var data = { "bettingTypeId": 1, "providerId": 27, matchIds };
        var matchData = g_data["m_" + mId];
        var hookFlagArr = [33, 30];
        if (!matchData.europe) {
            $.ajax({
                url: "/ajax/?method=data.match.odds",
                dataType: "json",
                data: data,
                type: "POST",
                success: function (msg) {
                    for (var key in msg) {
                        g_data["m_" + key].europe = msg[key];
                        for (var i = 0; i < hookFlagArr.length; i++) {
                            var hookFlag = hookFlagArr[i];
                            var tds = $("#m" + key + "_" + hookFlag).find("td");
                            tds[9].innerText = msg[key][0];
                            tds[10].innerText = msg[key][1];
                            tds[11].innerText = msg[key][2];
                        }
                    }
                }
            });
        }
        if (!matchData.asia) {
            data.bettingTypeId = 2;
            $.ajax({
                url: "/ajax/?method=data.match.odds",
                dataType: "json",
                data: data,
                type: "POST",
                success: function (msg) {
                    for (var key in msg) {
                        g_data["m_" + key].asia = msg[key];
                        for (var i = 0; i < hookFlagArr.length; i++) {
                            var hookFlag = hookFlagArr[i];
                            var tds = $("#m" + key + "_" + hookFlag).find("td");
                            tds[12].innerText = msg[key][0];
                            tds[13].innerText = msg[key][1];
                            tds[14].innerText = msg[key][2];
                        }
                    }
                }
            });
        }
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var url = "/soccer/match/" + id + "/history/";
            var d = window["n_data"][url];
            if (d) {
                nData(d);
            } else {
                myGet(url, nData, false);//false 同步 true 异步
            }
        }
    }
    /* */
    function fillData() {
        $("body").html('<table style="width:100%"border=1><thead><tr><th rowspan="2">编号</th><th rowspan="2">联赛</th><th rowspan="2">时间</th><th rowspan="2">主队</th><th rowspan="2">比分</th><th rowspan="2">客队</th><th colspan="3">赔率</th><th colspan="3">欧盘</th><th colspan="3">亚盘</th><th colspan="2">积分</th><th colspan="2">分区</th><th colspan="2">近3场</th><th colspan="2">输羸</th><th rowspan="2">操作</th></tr><tr><th rowspan="2">胜</th><th rowspan="2">平</th><th rowspan="2">负</th><th rowspan="2">胜</th><th rowspan="2">平</th><th rowspan="2">负</th><th rowspan="2">主</th><th rowspan="2">盘</th><th rowspan="2">客</th><th rowspan="2">主</th><th rowspan="2">客</th><th rowspan="2">主</th><th rowspan="2">客</th><th rowspan="2">主</th><th rowspan="2">客</th><th rowspan="2">主</th><th rowspan="2">客</th></tr></thead><tbody id="matchlist33"></tbody><tbody id="matchlist30" style="display:none"></tbody></table>');
        var data = window["g_data"];
        var hookFlagArr = ["33", "30"];
        for (var i = 0; i < hookFlagArr.length; i++) {
            var hookFlag = hookFlagArr[i];
            var html = [];
            for (var key in data) {
                var match = data[key].match;
                html.push('<tr id="m' + match.id + '_' + hookFlag + '">');
                html.push('<td rowspan="2"><a href="http://www.okooo.com/soccer/match/' + match.id + '/history/" target="_blank">' + match.ordercn + '</a></td>');
                html.push('<td rowspan="2"><a href="http://www.okooo.com/soccer/league/' + match.lid + '/" target="_blank">' + match.lname + '</a></td>');
                html.push('<td rowspan="2">' + match.playtime + '</td>');
                html.push('<td rowspan="2">' + match.hname + (match.rq ? '(' + match.rq + ')' : '') + '</td>');
                html.push('<td rowspan="2">' + (match.fullscore ? match.fullscore + '</br>' + match.halfscore : ' VS ') + '</td>');
                html.push('<td rowspan="2">' + match.aname + '</td>');
                html.push('<td>' + (match.h ? match.h : "--") + '</td>');
                html.push('<td>' + (match.d ? match.d : "--") + '</td>');
                html.push('<td>' + (match.a ? match.a : "--") + '</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2" onclick="showMatchList('+match.id+','+hookFlag+',\'h\')">--</td>');
                html.push('<td rowspan="2" onclick="showMatchList('+match.id+','+hookFlag+',\'a\')">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2">--</td>');
                html.push('<td rowspan="2"><a href="javascript:alert(\'未开发好，等着吧\')">查数据</a></td>');
                html.push('</tr>');
                html.push('<tr>')
                html.push('<td>' + (match.h1 ? match.h1 : "") + '</td>');
                html.push('<td>' + (match.d1 ? match.d1 : "") + '</td>');
                html.push('<td>' + (match.a1 ? match.a1 : "") + '</td>');
                html.push('</tr>')
                if(hookFlag == 33){
                    allIds.push(match.id);
                }
            }
            $("#matchlist" + hookFlag).html(html.join(""));
        }
        $('<input type=button value="近33场" style="margin:5px 0 10px 0;cursor:pointer;width:100px;height:40px" onclick="$(\'#matchlist30\').hide();$(\'#matchlist33\').show(\'slow\');"/>&nbsp;<input type=button value="近30场" style="margin:5px 0 10px 0;cursor:pointer;width:100px;height:40px" onclick="$(\'#matchlist33\').hide();$(\'#matchlist30\').show(\'slow\');"/>').appendTo("body");
        loadMatchData();
    }
    fillData();
    if (typeof layer != "undefined") {
        layer.close(loadIdx);
    }
    // console.log(window["g_data"]);
}

async function inject(browser, page) {
    await page.waitForSelector("#touzhulan");
    await page.evaluate(() => {
        $('head').append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/2.3/skin/layer.css"><script src="https://cdn.bootcdn.net/ajax/libs/layer/2.3/layer.js"></script>');
    });
    await page.waitFor(3000);
    await page.evaluate(hook);
}
(async () => {
    const Puppeteer = require('puppeteer');
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 966
        }
    }).then(async browser => {
        let pages = await browser.pages();
        let page = pages[0];
        await page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await page.goto("http://www.okooo.com/jingcai/");
        await inject(browser, page);
        Logger.info("程序运行完毕，进入结束");
    });
})();