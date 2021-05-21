const Utils = require("./Utils")
const Logger = require("./Logger")
const DBHelper = require("./DBHelper")
const fs = require('fs');

var g_teamNameMap = {}, g_leagueNameMap = {}, g_roundNameMap = {};
function clearNameCache() {
    g_teamNameMap = {};
    g_leagueNameMap = {};
    g_roundNameMap = {};
}

//[[202,'朗斯','朗斯','Lens','朗斯','images/201327161938.jpg',0],...]
async function saveTeam(arrTeam) {
    var teamData = {};
    if (typeof arrTeam == "object" && arrTeam.length > 0) {
        arrTeam.forEach(arr => {
            var team = {};
            team.id = arr[0];
            team.name_cn = arr[1];
            team.name_tr = arr[2];
            team.name_en = arr[3];
            if (arr.length > 5) {
                team.logo = arr[5];
            }
            teamData[team.id] = team;
            g_teamNameMap["_" + team.id] = team.name_cn;
        });
        await DBHelper.saveModelData(teamData, "t_team");
    }
}

//[id，联赛名，繁体，英文名，当前赛季，颜色，图标，简称中，简称繁，简称英文，简介说明]
async function saveLeague(league) {
    g_leagueNameMap["_" + league.id] = league.name_cn;
    await DBHelper.saveModel(league, "t_league");
}

// 联赛9 [[1778,'联赛','聯賽','League',1,38,38,0,1],..]
// 杯赛8 [[19806, 0, '第七圈', '第七圈', 'Round 7', 0, 0, 0],...]
async function saveSubLeague(arrSubLeague, leagueId) {
    var subLeaugeData = {};
    if (typeof arrSubLeague != "object") {
        return;
    }
    arrSubLeague.forEach(subLeague => {
        var model = {};
        model.id = subLeague[0] + "-" + leagueId;
        model.subLeague_id = subLeague[0];
        model.league_id = leagueId;
        if (subLeague.length == 9) {
            model.name_cn = subLeague[1];
            model.name_tr = subLeague[2];
            model.name_en = subLeague[3];
            model.total_round = subLeague[5];
            model.current_round = subLeague[6];
            model.league_type = 1;
        } else {
            model.name_cn = subLeague[2];
            model.name_tr = subLeague[3];
            model.name_en = subLeague[4];
            model.league_type = 2;
        }
        subLeaugeData[model.id] = model;
        g_roundNameMap["G" + model.id] = model.name_cn;
    });
    if (arrSubLeague.length > 0) {
        await DBHelper.saveModelData(subLeaugeData, "t_league_sub");
    }
}

//[id,联赛id,状态（-1 已经结束 0 未开始），比赛时间，主队id，客队id，全场比分，半场比分，主队排名，客队排名，,,,,,,,,主队红牌(下标 18)，客队红牌(下标 19),场上说明(下标 20),,,]
async function saveMatch(jh, selectSeason, isCup) {
    for (var key in jh) {
        if (key[0] != "G" && key[0] != "R") {
            continue;
        }
        var matchArr = jh[key];
        var league_type = 2;
        var round = 0;
        if (!isCup) {
            league_type = 1;
            round = key.split("_")[1];
        } else {
            round = g_roundNameMap[key];
            var nArr = [];
            matchArr.forEach(m => {
                if (typeof m[4] == "object") {
                    nArr.push(m[4]);
                    nArr.push(m[5]);
                } else {
                    nArr.push(m);
                }
            });
            matchArr = nArr;
        }

        matchData = {};
        matchArr.forEach(m => {
            var match = {};
            if (typeof m == "object" && m.length && m.length > 8) {
                match.id = m[0];
                match.playtime = m[3];
                match.homeId = m[4];
                match.awayId = m[5];
                match.homeName = g_teamNameMap["_" + match.homeId] || "";
                match.awayName = g_teamNameMap["_" + match.awayId] || "";
                match.fullscore = m[6] || "";
                match.halfscore = m[7] || "";
                match.homeRank = m[8];
                match.awayRank = m[9];
                match.status = m[2];// -1 比赛结束 0 比赛未开始 -10 比赛取消 -14 比赛推迟
                match.leagueId = m[1];
                match.leagueName = g_leagueNameMap["_" + match.leagueId];
                match.leagueType = league_type;
                match.season = selectSeason;
                match.round = round;
                // console.log(match);
                if (match.homeName && match.awayName && match.leagueName && isNaN(match.playtime)) {
                    let scores = match.fullscore.split(/[:-]/g);
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
                    } else {
                        if (match.fullscore.indexOf("取消") != -1) {
                            match.result = "取消";
                            match.halfscore = "取消";
                            match.fullscore = "取消";
                        } else if (match.fullscore.indexOf("推迟") != -1) {
                            match.result = "推迟";
                            match.halfscore = "推迟";
                            match.fullscore = "推迟";
                        } else {
                            match.result = "";
                        }
                    }
                    matchData[match.id] = match;
                }
            }
        });
        await DBHelper.saveModelData(matchData, "t_match");
    }
}
var jh = {};
function cleanCache() {
    delete arrLeague;
    delete arrSubLeague;
    delete arrTeam;
    delete arrCup;
    delete arrCupKind;
    jh = {};
}

var seasonReg=/\d{4}(-\d{4})?/g;

(async function () {
    // var pathName = path.resolve(__dirname,"jsData/matchResult");
    var pathName = "jsData/matchResult";
    var files = Utils.getFiles(pathName);
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (fs.existsSync(file + ".finished")) {
            continue;
        }
        console.log("正在解析 " + file);
        cleanCache();
        var content = await Utils.getFile(file);
        eval(content);
        var isCup = typeof arrCup != "undefined";
        var league;
        if (isCup) {
            league = Utils.getLeague(arrCup, isCup);
        } else {
            league = Utils.getLeague(arrLeague, isCup);
        }
        await saveLeague(league);
        var season = file.match(seasonReg)[0];
        await saveTeam(arrTeam);
        if (isCup) {
            await saveSubLeague(arrCupKind, league.id);
        } else {
            await saveSubLeague(arrSubLeague, league.id);
        }
        await saveMatch(jh, season, isCup);
        console.log(file + " 解析完成 ");
        fs.writeFileSync(file + ".finished", Utils.formatDate(new Date()));
    };
})();

