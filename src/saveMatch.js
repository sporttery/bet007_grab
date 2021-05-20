const Utils = require("./Utils")
const Logger = require("./Logger")
const DBHelper = require("./DBHelper")
const fs = require('fs');
//这些字段，将放在重复时更新
const updateKey = { "fullscore": true, "halfscore": true, "result": true, "homeRank": true, "awayRank": true };


/**
 * 单个更新入库
 * @param model 
 */
async function saveModel(model, tableName = "t_match") {
    Logger.info("数据入库 " + tableName, model);
    let columns = [], values = [], params = [], update = [], updateValue = [];
    for (var key in model) {
        columns.push(key);
        values.push("?");
        params.push(model[key]);
        if (updateKey[key]) {
            update.push(key + "=?");
            updateValue.push(model[key]);
        }
    }
    params = params.concat(updateValue);
    let sql = "insert into " + tableName + "(" + columns.join(",") + ") values (" + values.join(",") + ") ";
    if (update.length > 0) {
        sql += "ON DUPLICATE KEY UPDATE " + update.join(",") + ",version=version+1";
    } else {
        sql += "ON DUPLICATE KEY UPDATE version=version+1";
    }
    Logger.info("执行sql:" + sql);
    Logger.info("参数 ：" + params);
    let results = await DBHelper.query(sql, params);
    Logger.info("成功插入条数：" + JSON.stringify(results));
}


/**
 * 
 * @param modelArr 
 * 批量更新入库
 */
async function saveModelArr(modelArr, tableName = "t_match") {
    Logger.info("批量插入 " + tableName + ",共 ", modelArr.length);
    let columns = [], values = [], params = [], update = [], updateValue = [];
    var model = modelArr[0];
    for (var key in model) {
        columns.push(key);
        if (updateKey[key]) {
            update.push(key + "=?");
        }
    }
    var valuesArr = [];
    modelArr.forEach(model => {
        values = [];
        for (var key in model) {
            values.push("?");
            params.push(model[key]);
            if (updateKey[key]) {
                updateValue.push(model[key]);
            }
        }
        valuesArr.push("(" + values.join(",") + ")");
    });
    params = params.concat(updateValue);
    let sql = "insert into " + tableName + "(" + columns.join(",") + ") values " + valuesArr.join(",");
    if (update.length > 0) {
        sql += "ON DUPLICATE KEY UPDATE  version=version+1";
    }
    Logger.info("执行sql:" + sql);
    Logger.info("参数 ：" + params);
    let results = await DBHelper.query(sql, params);
    Logger.info("成功插入条数：" + JSON.stringify(results));
}

//先查询，再判断是否入库，根据主键查询
async function saveModelData(modelData, tableName, privateKey = "id") {
    var ids = Object.keys(modelData);
    //id 是int 类型
    var isIntId = !isNaN(ids[0]);
    var sql = "select " + privateKey + " from " + tableName + " where " + privateKey + " in ";

    if (isIntId) {
        sql += "(" + ids.join(",") + ")";
    } else {
        sql += "('" + ids.join("','") + "')";
    }

    let vals = await DBHelper.query(sql);
    if (typeof vals == "object") {
        vals.forEach(t => {
            delete modelData[t.id];
        });
        var modelArr = Object.values(modelData);
        if (modelArr.length > 0) {
            await saveModelArr(modelArr, tableName);
        }
    }
}
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
        await saveModelData(teamData, "t_team");
    }
}

//[id，联赛名，繁体，英文名，当前赛季，颜色，图标，简称中，简称繁，简称英文，简介说明]
async function saveLeague(league) {
    g_leagueNameMap["_" + league.id] = league.name_cn;
    await saveModel(league, "t_league");
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
        await saveModelData(subLeaugeData, "t_league_sub");
    }
}

//[id,联赛id,状态（-1 已经结束 0 未开始），比赛时间，主队id，客队id，全场比分，半场比分，主队排名，客队排名，,,,,,,,,主队红牌(下标 18)，客队红牌(下标 19),场上说明(下标 20),,,]
async function saveMatch(jh, selectSeason, isCup) {
    for (var key in jh) {
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
        await saveModelData(matchData, "t_match");
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
        var season = file.match(/[\d-]+/)[0];
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

