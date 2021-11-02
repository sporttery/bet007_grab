const Utils = require("./Utils");
const Logger = require("./Logger");
const DBHelper = require("./DBHelper");
async function getMatchOdds(page, matchId) {
    var limit = 100;
    while (true) {
        var ids;
        if (matchId) {
            Logger.info("指定了matchId=" + matchId);
            ids = [matchId];
        } else {
            ids = await DBHelper.query("select m.id from t_match m left join t_match_odds o on m.id = o.matchId where o.id is null ORDER BY RAND() limit " + limit);
        }
        var len = ids.length;
        var oddsData = {};
        for (var i = 0; i < len; i++) {
            var id = ids[i]["id"];
            Logger.info("正在获取第" + (i + 1) + "个Id=" + id + "的赔率,还剩 " + (len - i - 1));
            var europeOddsUrl = "http://vip.win007.com/ChangeDetail/Standard_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
            var content = await Utils.getFromUrl(page, europeOddsUrl);
            retry = 1;
            while (content.indexOf("id=\"odds\"") == -1) {
                Logger.info(europeOddsUrl + "返回错误的数据，" + (6 * retry) + "秒后重试第" + retry + "次");
                await page.waitForTimeout(6 * 1000 * retry++);
                content = await Utils.getFromUrl(page, europeOddsUrl);
                if (retry > 10) {
                    break;
                }
            }
            if (content.indexOf("id=\"odds\"") == -1) {
                continue;
            }
            var nH = Utils.safeHtml(content);
            var europeOdds = await page.evaluate((nH) => {
                var tds = $(nH).find("table tr:eq(2)").find("td");
                var company = $(tds[0]).text().trim();
                var h = $(tds[1]).text().trim();
                var d = $(tds[2]).text().trim();
                var a = $(tds[3]).text().trim();
                if (company.indexOf("365") != -1 && h != "" && d != "" && a != "") {
                    return [isNaN(h) ? 0 : parseFloat(h), isNaN(d) ? 0 : parseFloat(d), isNaN(a) ? 0 : parseFloat(a)];
                } else {
                    return [0, 0, 0];
                }
            }, nH);
            await page.waitForTimeout(1000);
            var asiaOddsUrl = "http://vip.win007.com/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
            content = await Utils.getFromUrl(page, asiaOddsUrl);
            retry = 1;
            while (content.indexOf("id=\"odds\"") == -1) {
                Logger.info(asiaOddsUrl + "返回错误的数据，" + (6 * retry) + "秒后重试第" + retry + "次");
                await page.waitForTimeout(6 * 1000 * retry++);
                content = await Utils.getFromUrl(page, asiaOddsUrl);
                if (retry > 10) {
                    break;
                }
            }
            if (content.indexOf("id=\"odds\"") == -1) {
                continue;
            }
            nH = Utils.safeHtml(content);
            var asiaOdds = await page.evaluate((nH) => {
                var tds = $(nH).find("table tr:eq(2)").find("td");
                var company = $(tds[0]).text().trim();
                var h = $(tds[1]).text().trim();
                var pan = $(tds[2]).text().trim();
                var a = $(tds[3]).text().trim();
                if (company.indexOf("365") != -1 && h != "" && a != "") {
                    return [isNaN(h) ? 0 : parseFloat(h), pan, isNaN(a) ? 0 : parseFloat(a)];
                } else {
                    return [0, 0, 0];
                }
            }, nH);
            Logger.info("europeOdds:", europeOdds, "asiaOdds:", asiaOdds);

            if (europeOdds[0] === null) {
                europeOdds = [0, 0, 0];
            }
            if (asiaOdds[0] === null) {
                asiaOdds = [0, '', 0];
            }
            var odds = { id: id + "-Bet365", company: "Bet365", s: europeOdds[0], p: europeOdds[1], f: europeOdds[2], h: asiaOdds[0], pan: asiaOdds[1], a: asiaOdds[2], matchId: id };
            oddsData[id] = odds;
        }
        if (len > 0) {
            retry=10;
            count=1;
            while(count++<retry){
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

}

async function getMatchByTeam(page, teamId) {
    var ids;
    if (teamId) {
        Logger.info("有指定teamId =" + teamId);
        ids = [{ id: teamId }];
    } else {
        ids = await DBHelper.query("select id from t_team ");
    }
    var totalCount = 0;
    var idsLen = ids.length;
    for (var i = 0; i < idsLen; i++) {
        var id = ids[i]["id"];
        Logger.info("正在获取第" + (i + 1) + "个球队ID=" + id + "的历史比赛数据,还剩" + (idsLen - i - 1));
        var dbOldPlaytimeRs = await DBHelper.query("select date_format(max(playtime),'%Y/%m/%d %H:%i') as playtime from t_match where homeId =" + id + " or awayId=" + id);
        var maxPlaytime = "0000/00/00 00:00";
        if (dbOldPlaytimeRs) {
            maxPlaytime = dbOldPlaytimeRs[0]["playtime"];
        }
        var sdUrl = "http://zq.win007.com/cn/team/TeamScheAjax.aspx?TeamID=" + id + "&pageNo=1&flesh=";
        var sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
        retry = 1;
        while (sdContent == "-1") {
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
        var nTimeStr = Utils.formatDate(new Date(), "yyyy/MM/dd hh:mm");
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
            if (playtime < maxPlaytime) {
                break;
            }
            allMatch.push(data);
        }
        totalCount+=allMatch.length;
        for (var pageNo = 2; pageNo <= totalPage; pageNo++) {
            sdUrl = "http://zq.win007.com/cn/team/TeamScheAjax.aspx?TeamID=" + id + "&pageNo=" + pageNo + "&flesh=";
            sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
            retry = 1;
            while (sdContent == "-1") {
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
            //如果第一场的比赛时间小于数据库里最大时间，则不需要抓取了
            if (teamPageData[0][3] < maxPlaytime) {
                break;
            }
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
                if (playtime < maxPlaytime) {
                    break;
                }
                allMatch.push(data);
            }
            //如果最后一场的比赛时间小于数据库里最大时间，则不继续
            if (teamPageData[teamPageData.length - 1][3] < maxPlaytime) {
                break;
            }
            if (allMatch.length > 33) {
                break;
            }
        }
        Logger.info("teamId=" + id + " 共获取比赛 " + allMatch.length + " 场");
        totalCount+=allMatch.length;
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

async function getBoloolById(mid, homeId, awayId, playtime) {
    var sql = "select hscore,ascore,hresult,aresult,hsection,asection from t_bolool30 where id = " + mid;
    var rs = await DBHelper.query(sql);
    if (rs && rs.length > 0) {
        return rs[0];
    }
    Logger.info("从数据库中计算bolool id=" + mid);
    if (!homeId) {
        sql = "SELECT homeId,awayId,playtime from t_match where id=" + mid;
        rs = await DBHelper.query(sql);
    } else {
        rs = [{ homeId, awayId, playtime }];
    }
    if (rs && rs.length > 0) {
        var match = rs[0];
        var homeId = match.homeId;
        var awayId = match.awayId;
        var playtime = match.playtime;
        sql = "select  homeId,awayId,fullscore,goalscore,result from t_match where (homeId=" + homeId + " or awayId=" + homeId + ") and playtime < '" + playtime + "' and result <> '' and result is not null limit 30";
        rs = await DBHelper.query(sql);
        if (rs && rs.length == 30) {
            sql = "select  homeId,awayId,fullscore,goalscore,result from t_match where (homeId=" + awayId + " or awayId=" + awayId + ") and playtime < '" + playtime + "' and result <> '' and result is not null limit 30";
            var rs1 = await DBHelper.query(sql);
            if (rs1 && rs1.length == 30) {
                var homeVs = rs;
                var awayVs = rs1;
                var homeResults = [];
                var hscore = 0;
                for (var i = 0; i < homeVs.length; i++) {
                    match = homeVs[i];
                    if (match.result == "胜") {
                        if (match.homeId == homeId) {
                            homeResults.push("赢");
                            hscore += 3;
                        } else {
                            homeResults.push("输");
                        }
                    } else if (match.result == "平") {
                        homeResults.push("平");
                        hscore += 1;
                    } else {
                        if (match.homeId == homeId) {
                            homeResults.push("输");
                        } else {
                            homeResults.push("赢");
                            hscore += 3;
                        }
                    }
                }
                var awayResults = [];
                var ascore = 0;
                for (var i = 0; i < awayVs.length; i++) {
                    match = awayVs[i];
                    if (match.result == "胜") {
                        if (match.homeId == awayId) {
                            awayResults.push("赢");
                            ascore += 3;
                        } else {
                            awayResults.push("输");
                        }
                    } else if (match.result == "平") {
                        awayResults.push("平");
                        ascore += 1;
                    } else {
                        if (match.homeId == awayId) {
                            awayResults.push("输");
                        } else {
                            awayResults.push("赢");
                            ascore += 3;
                        }
                    }
                }
                var hsection = getScoreSection(hscore);
                var asection = getScoreSection(ascore);
                var hresult = homeResults.join("");
                var aresult = awayResults.join("");
                sql = "insert  into t_bolool30(id,hscore,ascore,hresult,aresult,hsection,asection) values(" + mid + "," + hscore + "," + ascore + ",'" + hresult + "','" + aresult + "'," + hsection + "," + asection + ")";
                DBHelper.query(sql);
                return { hscore, ascore, hresult, aresult, hsection, asection };
            } else {
                Logger.info(mid + " -》 " + awayId + " 客队不满足30场 ，暂时不计算");
            }
        } else {
            Logger.info(mid + " -》 " + homeId + " 主队不满足30场 ，暂时不计算");
        }
    } else {
        Logger.info(mid + " 此比赛未入库，无法从数据库获取");
    }
    return null;

}

async function getBoloolListByOdds(europe,asia){
    var europeOdds = europe.split(" ");
    var asiaOdds = asia.split(" ");
    var sql = "SELECT o.matchId,o.s,o.p,o.f,o.h,o.pan,o.a,m.leagueId,m.leagueName,m.homeId,m.homeName,m.awayId,m.awayName,m.fullscore,m.halfscore, date_format(m.playtime,'%m-%d %H:%i') as playtime,"+
    "b.hscore,ascore,hresult,aresult,hsection,asection from t_match_odds o left join t_match m on o.matchId=m.id left join t_bolool30 b on m.id = b.id where company='BET365'"+
    " and (s="+europeOdds[0]+" and p="+europeOdds[1]+
     " and f="+europeOdds[2]+") or (h="+asiaOdds[0]+"  and a="+asiaOdds[2]+") order by m.playtime desc ";
     console.info(sql);
     return DBHelper.query(sql);
}

module.exports = {
    getMatchByTeam,
    getMatchOdds, getScoreSection, getBoloolById,getBoloolListByOdds
}