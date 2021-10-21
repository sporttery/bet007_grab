//从http://www.okooo.com/soccer/match/610101/history/ 开始获取数据，最小id 为 610101 开始，

function safeHtml(d) {
    return d.replace(/[\r\n]/g, "").replace(/<head.+?<\/head>/g, "").replace(/<script.+?<\/script>/g, "").replace(/<img.+?>/g, "").replace(/<link.+?>/g, "").replace(/<style.+?<\/style>/g, "");
}


//比赛结果
function getResult(scores) {
    return scores[0] == scores[1] ? "平" : scores[0] > scores[1] ? "胜" : "负";
}
//比赛积分
function getGoalscore(scores) {
    return scores[0] > scores[1] ? 3 : scores[0] == scores[1] ? 1 : 0;
}
//比赛强弱
function getStrong(hscore, ascore) {
    return hscore > ascore ? '强' : hscore == ascore ? '平' : '弱';
}

/**
 * [获取URL中的参数名及参数值的集合]
 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
 * @return {[string]}       [参数集合]
 */
function getRequest(urlStr) {
	var url;
    if (typeof urlStr == "undefined") {
        url = decodeURI(location.search); //获取url中"?"符后的字符串
    } else {
        url = "?" + urlStr.split("?")[1];
    }
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function showHistoryCallback(id,hOra){
	return function(data){
		console.log(data);
		g_match["_"+id].matchlist = JSON.parse(data.matchlist);
		showHistory(id,hOra);
	}
}
function showHistory(id,hOra){
	layer.load(2);
	var match = g_match["_"+id];
	var matchlist = match.matchlist;
	if(matchlist){
		layer.closeAll();
		historyArray = matchlist[hOra];
		var html=[];
		for(var i=0;i<historyArray.length;i++){
			var m = historyArray[i];
			html.push('<tr>');
			html.push('<td><a href="https://www.okooo.com/soccer/league/'+m.leagueId+'/" target="_blank">'+m.leagueName+'</a></td>');
			m.playtime=m.playtime+"";
			var playtime = m.playtime.substring(0,4)+"-"+m.playtime.substring(4,6)+"-" + m.playtime.substring(6,8) + " " + m.playtime.substring(8,10)+ ":"+m.playtime.substring(10,12)+":00";
			html.push('<td><a href="https://www.okooo.com/soccer/match/'+m.id+'/history/" target="_blank">'+playtime+'</a></td>');
			html.push('<td><a href="https://www.okooo.com/soccer/team/'+m.homeId+'/" target="_blank">'+m.homeName+'</a></td>');
			html.push('<td><a href="https://www.okooo.com/soccer/team/'+m.awayId+'/" target="_blank">'+m.awayName+'</a></td>');
			html.push('<td><a href="https://www.okooo.com/soccer/match/'+m.id+'/" target="_blank"><font color=red>'+m.fullscore+'</font>('+m.halfscore+')</a></td>');
			html.push('<td>'+m.hgoalscore+'</td>');
			html.push('<td>'+m.hresult+'</td>');
			html.push('</tr>');
		}
		var matchHistoryTip = $("#matchHistoryTip");
		if(matchHistoryTip.length==0){
			matchHistoryTip = $('<div id="matchHistoryTip" style="background-color: purple; text-align: center; color: #fff" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 style="color: #fff;" class="matchTitle">xxx比赛的菠萝数据</h3></div><div class="modal-body"><table class="table table-bordered"><thead><tr><th>赛事</th><th>时间</th><th>主队</th><th>客队</th><th>比分</th><th>积分</th><th>结果</th></tr></thead><tbody></tbody></table></div><div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true" style="color: red;">关闭</button></div></div>');
			matchHistoryTip.appendTo($("body"));
		}
		matchHistoryTip.find("tbody").html(html.join(""));
		matchHistoryTip.find(".matchTitle").text(match.homeName + " VS " + match.awayName + "  "+ match.playtime);
		/* layer.open({
			  title: match.homeName + " VS " + match.awayName + "  "+ match.playtime
			  ,content: $("#matchHistoryTip").html()
		}); */     
		matchHistoryTip.removeClass("hide");
		matchHistoryTip.modal("show");
	}else{
		console.log("异步加载数据.."+id);
		$.get("/api/getHistoryById?id="+id,showHistoryCallback(id,hOra));
	}
}

function setMatchBoloolData(id,data){
	if(g_match["_"+id]){
		g_match["_"+id].matchlist=JSON.parse(data.matchListHistory.matchlist);
		g_match["_"+id].boloolData=data.boloolData;
		g_match["_"+id].match=data.match;
		tr = g_match["_"+id].tr;
		if(!tr){
			tr = $("#m"+id);
			g_match["_"+id].tr = tr;
		}
		tr.find(".season").text(data.match.seasonName + " " + data.match.round);
		if(data.match.fullscore.length>2){
			var teamInfo = tr.find(".teamInfo");
			teamInfo.html(teamInfo.html().replace("VS",'<font color=red>'+data.match.fullscore+"</font>("+data.match.halfscore+")"));
		}
		changeTopN(id);
	}
	trBolool = $("#bolool_"+id);
	if(trBolool.length == 1){
		var hscore = trBolool.find(".hscore");
		var bolool = data.boloolData["top"+topN];
		var bolool3 = getBoloolFromResult(bolool.hresult,bolool.aresult,3);
		trBolool.attr({"data-hsection":bolool.hsection,"data-asection":bolool.asection,"data-hstrong":bolool3.hstrong,"data-astrong":bolool3.astrong,"data-hscore":bolool.hscore,"data-ascore":bolool.ascore});
		hscore.text(bolool.hscore);
		(hscore=hscore.next()).text(bolool.ascore);
		(hscore=hscore.next()).text(bolool.hsection);
		(hscore=hscore.next()).text(bolool.asection);
		(hscore=hscore.next()).text(bolool3.hresult);
		(hscore=hscore.next()).text(bolool3.aresult);
		(hscore=hscore.next()).text(bolool3.hstrong);
		(hscore=hscore.next()).text(bolool3.astrong);
	}
	
	if(ids && id==ids[ids.length-1]){
		if(typeof finishLoad == "function"){
			finishLoad();
		} else{
			layer.closeAll();
		}
	}
}

function matchHistoryCallback(id){
	return function(d){
		d=safeHtml(d);
		var data = getMatchDataFromHistoryHtml(d,id);
		if(data && data.match){
			$.post("/api/saveBolool",{match:JSON.stringify(data.match),matchlist:data.matchListHistory.matchlist,bolool:JSON.stringify(data.boloolData)},function(cc){
				console.log(cc);
			}); 
			setMatchBoloolData(id,data);
		}
	}
}

function getBoloolFromResult(hResult,aResult,topN){
	if(!topN){
		topN=3;
	}
	if(!hResult || !aResult || hResult.length<topN || aResult.length<topN){
		return {hresult:"--",aresult:"--",hscore:"--",ascore:"--",hstrong:"--",astrong:"--"};
	}
	var hresult=hResult.substring(0,topN).replace(/胜/g,"3").replace(/平/g,"1").replace(/负/g,"0");
	var aresult=aResult.substring(0,topN).replace(/胜/g,"3").replace(/平/g,"1").replace(/负/g,"0");
	var hscore=sum(hresult.split(/|/));
	var ascore=sum(aresult.split(/|/));
	var hstrong=getStrong(hscore,ascore);
	var astrong=getStrong(ascore,hscore);
	return {hresult,aresult,hscore,ascore,hstrong,astrong};
}

//获取分区
function getScoreSection(score, count) {
    score = parseInt(score)
    if(isNaN(score)){
    	return -1;
    }
    if (count < 33) {
        return 9 - parseInt(score / 10);
    } else {
        return 10 - parseInt(score / 10);
    }
}
/**
 * 从tr中获取比赛数据
 */
function getMatchFromTr(tr) {
    var id = parseInt($(tr).attr("data-matchid"));
    tds = tr.children;
    var homeName = $(tds[2]).text().replace(/\s/g, "");
    var homeId = parseInt($(tds[2]).attr("attr"));
    var leagueId = parseInt($(tds[0]).find("a").attr("href").split("/")[3]);
    var leagueName = $(tds[0]).find("a").text().replace(/\s/g, "");
    var awayName = $(tds[4]).text().replace(/\s/g, "");
    var awayId = parseInt($(tds[4]).attr("attr"));
    var fullscore = $(tds[3]).text().replace(/\s/g, "");
    var halfscore = $(tds[5]).text().replace(/\s/g, "");
    var leagueType = $(tr).attr("data-lt");
    if (!leagueType) {
        leagueType = "league";
    }
    var time = $(tds[1]).find(".smalltitle").text();
    if (time.length == 16) {
        time = time + ":00";
    } else if (time.length == 8) {
        time = $(tds[1]).find("a").text() + " " + time;
    }
    var playtime = parseInt(time.replace(/[^\d]/g, ""));
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
        leagueType,
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




/**
 * 
 * @param {*} arr 要计算的matchlist(历史对阵)
 * @param {*} topN 前N条数据进行计算
 * @param {*} friend 0 没有友谊赛 1 全部比赛 2 只有友谊赛
 */

function calcBolool(arr, topN, friend) {
    var calcArr = [];
    if (friend == 1) { //全部比赛
        calcArr = arr.slice(0, topN);
    } else if (friend == 0) { //没有友谊赛
        for (var i = 0; i < arr.length; i++) {
            var match = arr[i];
            if (match.leagueType != "friend") {
                calcArr.push(match);
            }
            if (calcArr.length == topN) {
                break;
            }
        }
    } else { // 只有友谊赛 
        for (var i = 0; i < arr.length; i++) {
            var match = arr[i];
            if (match.leagueType == "friend") {
                calcArr.push(match);
            }
            if (calcArr.length == topN) {
                break;
            }
        }
    }

    score = sum(calcArr, "hgoalscore");
    section = getScoreSection(score, topN);
    result = concat(calcArr, "hresult");
    return {
        score,
        section,
        result
    };

}

function getBolool(hbolool, abolool) {
    var bolool = {};
    for (var key in hbolool) {
        bolool["h" + key] = hbolool[key];
    }
    for (var key in abolool) {
        bolool["a" + key] = abolool[key];
    }
    return bolool;
}

function getMatchDataFromHistoryJson(json){
	if(json.matchlist){
		var matchlist = JSON.parse(json.matchlist);
		var match = json;
		var all_h = matchlist.h;
		var all_a = matchlist.a;
		var boloolData = getBoloolData(match,all_h, all_a);
		return boloolData;
	}
	return null;
}

function getMatchDataFromHistoryHtml(d, id) {
    d = $(safeHtml(d));
    var tr = d.find(".jsThisMatch");
    var tds = tr.find("td");
    var ahref = $(tds[0]).find("a").attr("href");
    var leagueUrl = "";
    if(ahref){
    	leagueUrl=ahref.split("/");
    }
    var seasonId = parseInt(leagueUrl[5]) || 0;
    var lunci = d.find("#lunci");
    if (tr.length == 0 || lunci.length == 0) {
        console.log("id=" + id + " 这场比赛没有数据");
        return null;
    }
    var spans = lunci.find("span");
    var seasonName = $(spans[0]).find("a:last").text();
    var round = $(spans[1]).text().trim();
    if (spans.length == 3) {
        round += $(spans[2]).text().trim();
    }
    if (!round) {
        round = "0";
    }

    var match = getMatchFromTr(tr[0]);
    if (isNaN(match.homeId) || isNaN(match.awayId) || isNaN(match.leagueId) || match.homeName == "" || match.awayName == "" || match.leagueName == "") {
        console.log("id=" + id + " 这场比赛没有数据");
        return null;
    }


    match.seasonId = seasonId;
    match.seasonName = seasonName.replace(/\s/g, "");
    match.round = round.replace(/\s/g, "");

    var time = d.find(".time").text();
    if (time.length == 13) {
        time = time.substring(0, 8) + " " + time.substring(8);
    }
    var playtime = "20" + time + ":00";
    match.playtime = parseInt(playtime.replace(/[^\d]/g, ""));

    var now = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; //1周之后

    playtime = playtime.split(/[- :]/);
    playtime[1] = parseInt(playtime[1]) - 1;

    matchtime = new Date(playtime[0], playtime[1], playtime[2], playtime[3], playtime[4], playtime[5]);

    if (now < matchtime.getTime()) {
        console.log(match.playtime + " 日期已经大于今天1周了，暂时不处理这场比赛");
        // console.log(match);
        return null;
    }


    var all_h = [],
        all_a = [];

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

            all_h.push(matchHistory);

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

            all_a.push(matchHistory);

        }
    });

    return getBoloolData(match,all_h,all_a);
}

function getBoloolData(match,all_h,all_a){
	//俱乐部最近33场比赛，要去掉友谊赛
	//国家队比赛保留友谊赛
    var isCountryTeamA = false,
        isCountryTeamH = false;
    if (typeof g_team == "object") {
        var team = g_team[match.awayId];
        var pname;
        if (team) {
            pname = team.parentName;
            isCountryTeamA = pname.indexOf("友谊赛") != -1 || pname.indexOf("国家") != -1 || pname.indexOf("奥运") != -1 || pname.indexOf("欧洲") != -1 || pname.indexOf("亚洲") != -1 ||
                pname.indexOf("亚运") != -1 || pname.indexOf("美洲") != -1 || pname.indexOf("非洲") != -1 || pname.indexOf("世欧预") != -1 || pname.indexOf("世亚预") != -1 || pname.indexOf("世南美预") != -1;
        }
        team = g_team[match.homeId];
        if (team) {
            pname = team.parentName;
            isCountryTeamH = pname.indexOf("友谊赛") != -1 || pname.indexOf("国家") != -1 || pname.indexOf("奥运") != -1 || pname.indexOf("欧洲") != -1 || pname.indexOf("亚洲") != -1 ||
                pname.indexOf("亚运") != -1 || pname.indexOf("美洲") != -1 || pname.indexOf("非洲") != -1 || pname.indexOf("世欧预") != -1 || pname.indexOf("世亚预") != -1 || pname.indexOf("世南美预") != -1;
        }
    } else {
        console.log("并没有找到g_team的定义，不单独处理国家队的友谊赛");
    }


    var boloolData = {};
    var topN = 33;
    var hbolool = calcBolool(all_h, topN, isCountryTeamH ? 1 : 0);
    var abolool = calcBolool(all_a, topN, isCountryTeamA ? 1 : 0);
    hbolool.strong = getStrong(hbolool.score, abolool.score);
    abolool.strong = getStrong(abolool.score, hbolool.score);

    var bolool = getBolool(hbolool, abolool);
    bolool.id = match.id;
    boloolData["top" + topN] = bolool;


    topN = 30;
    hbolool = calcBolool(all_h, topN, 1);
    abolool = calcBolool(all_a, topN, 1);
    hbolool.strong = getStrong(hbolool.score, abolool.score);
    abolool.strong = getStrong(abolool.score, hbolool.score);
    bolool = getBolool(hbolool, abolool);
    bolool.id = match.id;
    boloolData["top" + topN] = bolool;

   


    var matchListHistory = {
        id: match.id,
        matchlist: JSON.stringify({
            "h": all_h,
            "a": all_a
        })
    };
    return {
        match,
        boloolData,
        matchListHistory
    };
}