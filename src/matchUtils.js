const Utils = require("./Utils");
const Logger = require("./Logger");
const DBHelper = require("./DBHelper");
const cheerio = require('cheerio');

var GoalCn = "平手,平手/半球,半球,半球/一球,一球,一球/球半,球半,球半/两球,两球,两球/两球半,两球半,两球半/三球,三球,三球/三球半,三球半,三球半/四球,四球,四球/四球半,四球半,四球半/五球,五球,五/五球半,五球半,五球半/六,六球,六球/六球半,六球半,六球半/七球,七球,七球/七球半,七球半,七球半/八球,八球,八球/八球半,八球半,八球半/九球,九球,九球/九球半,九球半,九球半/十球,十球".split(",");
function ConvertGoal(goal) { //数字盘口转汉汉字	
    if (goal == null || goal + "" == "")
        return "";
    else if (isNaN(goal)) {
        return goal;
    }
    else {
        if (goal > 10 || goal < -10) return goal + "球";
        if (goal >= 0) return GoalCn[parseInt(goal * 4)];
        else return "受" + GoalCn[Math.abs(parseInt(goal * 4))];
    }
}

async function getMatchOdds(page, matchId,flag = 'all'/*||'europe'||'asia'*/) {
    var limit = 100;
    var oddsData = {};
    while (true) {
        oddsData={};
        var ids;
        if (matchId) {
            Logger.info("指定了matchId=" + matchId);
            ids = [matchId];
        } else {
            ids = await DBHelper.query("select m.id from t_match m left join t_match_odds o on m.id = o.matchId where o.id is null ORDER BY RAND() limit " + limit);
        }
        var len = ids.length;
        for (var i = 0; i < len; i++) {
            var id = ids[i]["id"];
            Logger.info("正在获取第" + (i + 1) + "个Id=" + id + "的赔率,还剩 " + (len - i - 1));

            var    europeOdds = await getEuropeOdds(id,page);
            var    asiaOdds = await getAsiaOdds(id,page);
            Logger.info("europeOdds:", europeOdds, "asiaOdds:", asiaOdds);

            var odds = { id: id + "-Bet365", company: "Bet365", s: europeOdds.s, p: europeOdds.p, f: europeOdds.f, h: asiaOdds.h, pan: asiaOdds.pan, a: asiaOdds.a, matchId: id };
            oddsData[id] = odds;
        }
        if (len > 0) {
            retry = 10;
            count = 1;
            while (count++ < retry) {
                try {
                    await DBHelper.saveModelData(oddsData, "t_match_odds");
                    break;
                } catch (error) {
                    console.error(error);
                    await Utils.sleep(1000);
                }
            }
        }
        if (len < limit) {
            break;
        }
    }

    if(matchId){
        return oddsData[matchId];
    }

}

async function getMatchByTeam(page, teamId, nTimeStr) {
    var ids;
    if (teamId) {
        Logger.info("有指定teamId =" + teamId);
        ids = [{ id: teamId }];
    } else {
        ids = await DBHelper.query("select id from t_team ");
    }
    var totalCount = 0;
    var idsLen = ids.length;
    if (!nTimeStr) {
        nTimeStr = Utils.formatDate(new Date(), "yyyy/MM/dd hh:mm");
    }
    for (var i = 0; i < idsLen; i++) {
        var id = ids[i]["id"];
        Logger.info("正在获取第" + (i + 1) + "个球队ID=" + id + "的历史比赛数据,还剩" + (idsLen - i - 1));

        var sdUrl = "http://zq.win007.com/cn/team/TeamScheAjax.aspx?TeamID=" + id + "&pageNo=1&flesh=";
        var sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
        retry = 1;
        while (sdContent == "-1" && sdContent.indexOf("System.Web.Mvc.Controller") == -1) {
            Logger.info(sdUrl + "返回错误的数据，" + (6 * retry) + "秒后重试第" + retry + "次");
            await Utils.sleep(6 * 1000 * retry++);
            sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
            if (retry > 10) {
                break;
            }
        }
        if (sdContent == "-1") {
            continue;
        }
        delete teamPageInfo;
        delete teamPageData;
        eval(sdContent);
        // var pageLen = teamPageData.length;
        var totalPage = teamPageInfo[0];
        var allMatch = [];

        for (var j = 0; j < teamPageData.length; j++) {
            var data = teamPageData[j];
            var playtime = data[3];
            if (playtime > nTimeStr) {//未开始的比赛，直接过滤掉
                // console.info("比赛未开始，过滤掉了 playtime=" + playtime);
                continue;
            }
            if (data[6].split(/[-:]/).length != 2) { //没有比分的比赛，直接过滤掉
                // console.info("比赛没有比分，过滤掉了 fullscore=" + match.fullscore);
                continue;
            }

            allMatch.push(data);
        }
        totalCount += allMatch.length;
        for (var pageNo = 2; pageNo <= totalPage; pageNo++) {
            sdUrl = "http://zq.win007.com/cn/team/TeamScheAjax.aspx?TeamID=" + id + "&pageNo=" + pageNo + "&flesh=";
            sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
            retry = 1;
            while (sdContent == "-1" && sdContent.indexOf("System.Web.Mvc.Controller") == -1) {
                Logger.info(sdUrl + "返回错误的数据，" + (6 * retry) + "秒后重试第" + retry + "次");
                await Utils.sleep(6 * 1000 * retry++);
                sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
                if (retry > 10) {
                    break;
                }
            }
            if (sdContent == "-1") {
                continue;
            }
            delete teamPageInfo
            delete teamPageData;
            eval(sdContent);

            for (var j = 0; j < teamPageData.length; j++) {
                var data = teamPageData[j];
                var playtime = data[3];
                if (playtime > nTimeStr) {//未开始的比赛，直接过滤掉
                    // console.info("比赛未开始，过滤掉了 playtime=" + playtime);
                    continue;
                }
                if (data[6].split(/[-:]/).length != 2) { //没有比分的比赛，直接过滤掉
                    // console.info("比赛没有比分，过滤掉了 fullscore=" + match.fullscore);
                    continue;
                }

                allMatch.push(data);
            }

            if (allMatch.length > 33) {
                break;
            }
        }
        Logger.info("teamId=" + id + " 共获取比赛 " + allMatch.length + " 场");
        totalCount += allMatch.length;
        var matchData = {}, matchCount = 0;
        for (var idx = 0; idx < allMatch.length; idx++) {
            var data = allMatch[idx];
            var playtime = data[3];

            var match = {};
            match.id = data[0];
            match.leagueId = data[1];
            match.leagueColor = data[2];
            match.playtime = playtime;
            match.leagueName = data[8];
            match.homeName = data[11];
            match.homeId = data[4];
            match.awayName = data[14];
            match.awayId = data[5];
            match.fullscore = data[6];
            match.halfscore = data[7];
            // if (playtime > nTimeStr) {//未开始的比赛，直接过滤掉
            //     console.info("比赛未开始，过滤掉了 playtime=" + playtime);
            //     continue;
            // }
            let scores = match.fullscore.split(/[:-]/g);
            // if (scores.length != 2) { //没有比分的比赛，直接过滤掉
            //     console.info("比赛没有比分，过滤掉了 fullscore=" + match.fullscore);
            //     continue;
            // }
            if (scores.length == 2) {
                h_score = scores[0];
                a_score = scores[1];
                if (h_score > a_score) {
                    match.result = "胜";
                } else if (h_score < a_score) {
                    match.result = '负';
                } else {
                    match.result = "平";
                }
            }
            matchData[match.id] = match;
            matchCount++;
        }
        if (matchCount > 0) {
            var res = await DBHelper.saveModelData(matchData, "t_match");
            Logger.info("teamId=" + id + " 比赛入库的结果", res);
        }
        await DBHelper.query("update t_team set totalPage=" + totalPage + ",match_count = (select count(1) from t_match where homeId=" + id + " or awayId=" + id + ") where id=" + id);
        Logger.info("更新t_team 比赛场次数结束");
    }
    return totalCount;
}

function getScoreSection(score, count) {
    if (!count) {
        count = 30;
    }
    score = parseInt(score)
    if (isNaN(score)) {
        return -1;
    }
    if (count < 33) {
        return 9 - parseInt(score / 10);
    } else {
        return 10 - parseInt(score / 10);
    }
}

async function getBoloolById(id) {
    var sql = "select hscore,ascore,hresult,aresult,hsection,asection from t_bolool30 where id = " + id;
    var rs = await DBHelper.query(sql);
    if (rs && rs.length > 0) {
        return rs[0];
    }
    return null;
}

async function getBoloolListByOdds(europe, asia) {
    var europeOdds = europe.split(" ");
    var asiaOdds = asia.split(" ");
    var pan = asiaOdds[1];
    var sql = "SELECT o.matchId,o.s,o.p,o.f,o.h,o.pan,o.a,m.leagueId,m.leagueName,m.homeId,m.homeName,m.awayId,m.awayName,m.fullscore,m.halfscore, date_format(m.playtime,'%m-%d %H:%i') as playtime," +
        "b.hscore,ascore,hresult,aresult,hsection,asection from t_match_odds o inner join t_match m on o.matchId=m.id left join t_bolool30 b on m.id = b.id where company='BET365'" +
        " and (s=" + europeOdds[0] + " and p=" + europeOdds[1] +
        " and f=" + europeOdds[2] + ") or (h=" + asiaOdds[0] + "  and a=" + asiaOdds[2] + " and pan='" + pan + "') order by m.playtime desc ";
    console.info(sql);
    return DBHelper.query(sql);
}

async function saveBolool(bolool) {
    return await DBHelper.saveModel(bolool, "t_bolool30",true);
}
var proxy = { data: false };
async function getOddsById(id,page) {
    sql = "select o.matchId,o.s,o.p,o.f,o.h,o.pan,o.a from t_match_odds o where id = '" + id + "-Bet365'";
    var rs = await DBHelper.query(sql);
    if (rs && rs.length > 0 && (rs[0].s != 0 || rs[0].h != 0)) {
        return rs[0];
    }
    var asiaOdds,europeOdds;
    if(rs.length>0 && rs[0].s != 0 ){
        europeOdds = {s:rs[0].s,p:rs[0].p,f:rs[0].f};
    }else{
        europeOdds = await getEuropeOdds(id,page);
        if(!europeOdds){
            europeOdds={s:0,p:0,f:0};
        }
    }
    if(rs.length>0 && rs[0].h != 0 ){
        asiaOdds = {h:rs[0].h,pan:rs[0].pan,a:rs[0].a};
    }else{
        asiaOdds = await getAsiaOdds(id,page);
        if(!asiaOdds){
            asiaOdds={h:0,pan:'-',a:0};
        }
    }
    var odds = {matchId:id,h:asiaOdds.h,pan:asiaOdds.pan,a:asiaOdds.a,s:europeOdds.s,p:europeOdds.p,f:europeOdds.f,company:'Bet365',id:id+'-Bet365'};
    return odds;
}

async function getAsiaOdds(id,page) {
    sql = "select o.matchId,o.h,o.pan,o.a from t_match_odds o where id = '" + id + "-Bet365'";
    var rs = await DBHelper.query(sql);
    if (rs && rs.length > 0 &&   rs[0].h != 0&& rs[0].h!= null ) {
        return rs[0];
    }
    if(page){
        var asiaOddsUrl = "http://vip.win007.com/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
        var response = await Utils.getFromUrl(page, asiaOddsUrl,(r) => { return r.indexOf('id="odds"') != -1},3);
        if (response && response.indexOf('id="odds"')!=-1) {
            console.info(asiaOddsUrl + " 获取完成");
            odds = getOdds(response);
            console.info(odds);
            if(odds[0]!=0 && !isNaN(odds[0])){
                sql = "insert into t_match_odds(id,matchId,h,pan,a,company) values('"+id+"-Bet365',"+id+","+odds[0]+",'"+odds[1]+"',"+odds[2]+",'Bet365') ON DUPLICATE KEY UPDATE h=values(h),pan=values(pan),a=values(a) ";
                var rs = await DBHelper.query(sql);
                console.info(rs);
                return {matchId:id,h:odds[0],pan:odds[1],a:odds[2]};
            }else{
                return null;
            }
        }
    }
    retry = 2;
    count = 1;
    do {
        var proxyIp = (proxy.data ? " -x socks5://" + proxy.data[0].ip + ":" + proxy.data[0].port : "");
        //同步处理
        var asiaUrl = "http://vip.win007.com/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
        var curl = 'curl ' + proxyIp + ' "' + asiaUrl + '" -s | iconv -f gbk -t utf-8'
        console.info(curl);
        response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="odds"') != -1 }, 5);
        // response = await Utils.getByCurl(curl);
        if (response) {
            console.info(asiaUrl + " 获取完成");
            odds = getOdds(response);
            console.info(odds);
            if(odds[0]!=0 && !isNaN(odds[0])){
                sql = "insert into t_match_odds(id,matchId,h,pan,a,company) values('"+id+"-Bet365',"+id+","+odds[0]+",'"+odds[1]+"',"+odds[2]+",'Bet365') ON DUPLICATE KEY UPDATE h=values(h),pan=values(pan),a=values(a) ";
                var rs = await DBHelper.query(sql);
                console.info(rs);
                return {matchId:id,h:odds[0],pan:odds[1],a:odds[2]};
            }else{
                return null;
            }
        } else {
            proxy = await Utils.getProxy();
            console.error("获取新的代理IP" + JSON.stringify(proxy));
        }
        console.info("第" + count + "次重试");
    } while (count++ < retry);
    return null;
}


async function getEuropeOdds(id,page) {
    sql = "select o.matchId,o.s,o.p,o.f from t_match_odds o where id = '" + id + "-Bet365'";
    var rs = await DBHelper.query(sql);
    if (rs && rs.length > 0 &&  rs[0].s != 0 && rs[0].s != null ) {
        return rs[0];
    }
    if(page){
        var europeUrl = "http://vip.win007.com/ChangeDetail/Standard_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
        var response = await Utils.getFromUrl(page, europeUrl,(r) => { return r.indexOf('id="odds"') != -1 },3);
        if (response && response.indexOf('id="odds"')!=-1) {
            console.info(europeUrl + " 获取完成");
            odds = getOdds(response);
            console.info(odds);
            if(odds[0]!=0 && !isNaN(odds[0])){
                sql = "insert into t_match_odds(id,matchId,s,p,f,company) values('"+id+"-Bet365',"+id+","+odds[0]+",'"+odds[1]+"',"+odds[2]+",'Bet365') ON DUPLICATE KEY UPDATE s=values(s),p=values(p),f=values(f) ";
                var rs = await DBHelper.query(sql);
                console.info(rs);
                return {matchId:id,s:odds[0],p:odds[1],f:odds[2]};;
            }else{
                return null;
            }
        }
    }
    retry = 2;
    count = 1;
    do {
        var proxyIp = (proxy.data ? " -x socks5://" + proxy.data[0].ip + ":" + proxy.data[0].port : "");
        //同步处理
        var europeUrl = "http://vip.win007.com/ChangeDetail/Standard_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
        var curl = 'curl ' + proxyIp + ' "' + europeUrl + '" -s | iconv -f gbk -t utf-8'
        // var response = await Utils.getByCurl(curl);
        var response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="odds"') != -1 }, 3);
        if(response){
            console.info(europeUrl + " 获取完成");
            odds = getOdds(response);
            console.info(odds);
            if(odds[0]!=0 && !isNaN(odds[0])){
                sql = "insert into t_match_odds(id,matchId,s,p,f,company) values('"+id+"-Bet365',"+id+","+odds[0]+",'"+odds[1]+"',"+odds[2]+",'Bet365') ON DUPLICATE KEY UPDATE s=values(s),p=values(p),f=values(f) ";
                var rs = await DBHelper.query(sql);
                console.info(rs);
                return {matchId:id,s:odds[0],p:odds[1],f:odds[2]};;
            }else{
                return null;
            }
        } else {
            proxy = await Utils.getProxy();
            console.error("获取新的代理IP" + JSON.stringify(proxy));
        }
        console.info("第" + count + "次重试");
    } while (count++ < retry);
    return null;
}

function getOdds(stdout) {
    var nH = Utils.safeHtml(stdout);
    const $ = cheerio.load(nH, { decodeEntities: false }, false);
    var tds = $("table tr:eq(2)").find("td");
    var company = $(tds[0]).text().trim();
    var h = $(tds[1]).text().trim();
    var d = $(tds[2]).text().trim();
    var a = $(tds[3]).text().trim();
    if (company.indexOf("365") != -1 && h != "" && d != "" && a != "") {
        return [isNaN(h) ? 0 : parseFloat(h), d, isNaN(a) ? 0 : parseFloat(a)];
    } else {
        return [0, 0, 0];
    }
}

function getOddsData(data) {
    var odds = { id: data.id + "-" + data.company, company: data.company, matchId: data.id, s: data.europeOdds[0], p: data.europeOdds[1], f: data.europeOdds[2], h: data.asiaOdds[0], pan: data.asiaOdds[1], a: data.asiaOdds[2] };
    return odds;
}

async function saveOdds(odds) {
    sql = "insert into t_match_odds(id,matchId," + (odds.s ? "s,p,f," : "") + "" + (odds.h ? "h,pan,a," : "") + "company) values('" + odds.id + "'," + odds.matchId + ","
        + (odds.s ? "" + odds.s + "," + odds.p + "," + odds.f + "," : "") + "" + (odds.h ? "" + odds.h + ",'" + odds.pan + "'," + odds.a + "," : "") + "'" + odds.company + "') ON DUPLICATE KEY UPDATE "
        + (odds.s ? "s=VALUES(s),p=VALUES(p),f=VALUES(f)," : "") + "" + (odds.h ? "h=VALUES(h),pan=VALUES(pan),a=VALUES(a)," : "") + " version=version+1";
    // console.info(odds);
    // console.info(sql);
    return await DBHelper.query(sql);
}


// async function odds(){
//     sql = "select m.id from t_match m left t_match_odds b on m.id = b.id where b.id is null limit 100";
//     while(true){
//         rs = await DBHelper.query(sql);
//         if(rs && rs.length>0){
//             for(var i=0;i<rs.length;i++){
//                 await getOddsById(rs[i].id);
//             }
//         }
//         if(!rs || rs.length<100){
//             break;
//         }
//     }
// }


async function deleteOddsById(id){
    var idArr = (id+"").split(",");
    var values = [];
    for(var i=0;i<idArr.length;i++){
        values.push("'"+idArr[i]+"-Bet365'");
    }
    var sql = "delete from t_match_odds where id in ("+values.join(",")+")";
    console.info(sql);
    var rs = await DBHelper.query(sql);
    console.info(rs);
}

async function getOddsByIdArr(idArr){
    var values = [];
    for(var i=0;i<idArr.length;i++){
        values.push("'"+idArr[i]+"-Bet365'");
    }
    var sql = "select o.matchId,o.s,o.p,o.f,o.h,o.pan,o.a from t_match_odds o where id in ("+values.join(",")+")";
    var rs = await DBHelper.query(sql);
    return rs;
}

async function getMatchByDate(date){
    var sql = "select m.id,homeId,homeName,leagueId,leagueName,awayId,awayName,fullscore,halfscore,date_format(m.playtime,'%Y-%m-%d %H:%i') as playtime,"
    +"o.s,o.p,o.f,o.h,o.pan,o.a,hscore,ascore,hresult,aresult,hsection,asection from t_match m left join t_match_odds o on m.id = o.matchId left join t_bolool30 b on m.id = b.id where m.playtime between '"+date+" 00:00:00' and '"+date+" 23:59:59'  order by playtime asc";
    console.info(sql);
    return await DBHelper.query(sql);
}

module.exports = {
    getMatchByTeam,
    getMatchOdds, getScoreSection, getBoloolById, getBoloolListByOdds, saveBolool, getOddsById, saveOdds, ConvertGoal,
    deleteOddsById,getOddsByIdArr,getEuropeOdds,getAsiaOdds,getMatchByDate
}