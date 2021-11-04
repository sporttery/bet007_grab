const DBHelper = require("./DBHelper")
const Utils = require("./Utils")
var child_process = require("child_process");
const cheerio = require('cheerio');
const limit = 100;
const companyIdMap = { "Bet365": { e: 8, a: 8 } };
const sync = true;
var proxy = { data: null };
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
async function main() {
    var ids = await DBHelper.query("select m.id from t_match m left join t_match_odds o on m.id = o.matchId where o.id is null ORDER BY RAND() limit " + limit);
    var len = ids.length;
    if (sync) {
        oddsArr = [];
    }
    oddsData = {};
    for (var i = 0; i < len; i++) {
        var id = ids[i].id;
        console.info("开始处理ID=" + id + ",还剩下 " + (len - i - 1) + " 个");
        for (var companyName in companyIdMap) {
            var companyIdData = companyIdMap[companyName];
            if (!sync) {

                //异步处理
                var europeUrl = "http://vip.win007.com/ChangeDetail/Standard_all.aspx?ID=" + id + "&companyid=" + companyIdData.e + "&company=" + companyName;
                var curl = 'curl ' + (proxy.data ? " -x socks5://" + proxy.data[0].ip + ":" + proxy.data[0].port : "") + '  -m 30 "' + europeUrl + '" -s | iconv -f gbk -t utf-8'
                console.log("开始获取：" + curl);
                var data = { id, url: europeUrl, oddsType: 1, company: companyName, len };
                child_process.exec(curl, nResult(data));
                var asiaUrl = "http://vip.win007.com/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=" + companyIdData.a + "&company=" + companyName;
                curl = 'curl ' + (proxy.data ? " -x socks5://" + proxy.data[0].ip + ":" + proxy.data[0].port : "") + '  -m 30 "' + asiaUrl + '" -s | iconv -f gbk -t utf-8'
                console.log("开始获取：" + curl);
                data.url = asiaUrl;
                data.oddsType = 2;
                child_process.exec(curl, nResult(data));
                await Utils.sleep(10);
            } else {

                var proxyIp = (proxy.data ? " -x socks5://" + proxy.data[0].ip + ":" + proxy.data[0].port : "");
                //同步处理
                var europeUrl = "http://vip.win007.com/ChangeDetail/Standard_all.aspx?ID=" + id + "&companyid=" + companyIdData.e + "&company=" + companyName;
                var curl = 'curl ' + proxyIp + '  -m 30 "' + europeUrl + '" -s | iconv -f gbk -t utf-8'
                var odata = { id, europeOdds: null, asiaOdds: false, company: companyName, len: 99999999 };
                var response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="odds"') != -1 }, 3);
                // var response = await Utils.getByCurl(curl);
                if (response) {
                    console.info(europeUrl + " 获取完成");
                    odds = getOdds(response);
                    // console.info(odds);
                    odata.europeOdds = odds;
                    var asiaUrl = "http://vip.win007.com/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=" + companyIdData.a + "&company=" + companyName;
                    curl = 'curl ' + proxyIp + '  -m 30 "' + asiaUrl + '" -s | iconv -f gbk -t utf-8'
                    response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="odds"') != -1 }, 3);
                    // response = await Utils.getByCurl(curl);
                    if (response) {
                        console.info(asiaUrl + " 获取完成");
                        odds = getOdds(response);
                        // console.info(odds);
                        odata.asiaOdds = odds;
                        oddsArr.push(getOddsData(odata));
                    } else {
                        proxy = await Utils.getProxy();
                        console.error("获取新的代理IP" + JSON.stringify(proxy));
                    }
                } else {
                    proxy = await Utils.getProxy();
                    console.error("获取新的代理IP" + JSON.stringify(proxy));
                }
            }

        }
    }
    if (sync) {
        if (oddsArr.length > 0) {
            await DBHelper.saveModelArr(oddsArr, "t_match_odds", true);
        }
        if (len < limit) {
            console.info("处理完所有数据，结束程序");
            process.exit();
        } else {
            main();
        }
    }
}




async function main1() {
    var ids = await DBHelper.query("select m.id from t_match m left join t_match_odds o on m.id = o.matchId where o.id is null or (s=0 and h=0) ORDER BY RAND() limit " + limit);
    var len = ids.length;
    if (sync) {
        oddsArr = [];
    }
    oddsData = {};
    for (var i = 0; i < len; i++) {
        var id = ids[i].id;
        console.info("开始处理ID=" + id + ",还剩下 " + (len - i - 1) + " 个");
        for (var companyName in companyIdMap) {
            var proxyIp = (proxy.data ? " -x socks5://" + proxy.data[0].ip + ":" + proxy.data[0].port : "");
            //同步处理
            var europeUrl = "http://1x2d.win007.com/" + id + ".js?" + new Date().getTime();
            console.info(europeUrl + " 开始获取");
            var curl = 'curl  ' + proxyIp + '  -m 30 "' + europeUrl + '" -s'
            var odata = { id, europeOdds: null, asiaOdds: false, company: companyName, len: 99999999 };
            // var response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="game"') != -1 }, 2);
            var response = await Utils.getByCurl(curl);
            if (response) {
                console.info(europeUrl + " 获取完成");
                if (response.indexOf("game") == -1) {
                    console.info("没有找到数据");
                    odata.europeOdds = [0, 0, 0];
                } else {
                    eval(response);
                    if (game && game[0]) {
                        odds = game[0].split("|");
                        if (odds.length < 5) {
                            odds = [0, 0, 0];
                        }
                    } else {
                        odds = [0, 0, 0];
                    }
                    odata.europeOdds = [odds[3] || 0, odds[4] || 0, odds[5] || 0];
                }
                console.info(odata.europeOdds);
                var asiaUrl = "http://vip.win007.com/AsianOdds_n.aspx?id=" + id + "&l=0";
                // var asiaUrl = "http://www.310win.com/handicap/"+id+".html";
                console.info(asiaUrl + " 开始获取");
                curl = 'curl  ' + proxyIp + ' -m 30 "' + asiaUrl + '" -s'
                // response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="odds"') != -1 }, 2);
                response = await Utils.getByCurl(curl);
                if (response) {
                    console.info(asiaUrl + " 获取完成");
                    odds = getAsiaOdds(response);
                    console.info(odds);
                    odata.asiaOdds = odds;
                    // oddsArr.push(getOddsData(odata));
                    await DBHelper.saveModel(getOddsData(odata), "t_match_odds");
                } else {
                    proxy = await Utils.getProxy();
                    console.error("获取新的代理IP" + JSON.stringify(proxy));
                }
            } else {
                proxy = await Utils.getProxy();
                console.error("获取新的代理IP" + JSON.stringify(proxy));
            }
        }
    }
    // if (oddsArr.length > 0) {
    //     await DBHelper.saveModelArr(oddsArr, "t_match_odds", true);
    // }
    if (len < limit) {
        console.info("处理完所有数据，结束程序");
        process.exit();
    } else {
        main1();
    }
}




function nResult(data) {
    return async (stdin, stdout, stderr) => {
        if (stderr) {
            console.info(data.url + " 获取内容出错：" + stderr);
            data.hasContent = false;
        } else {
            if (stdout.indexOf('id="odds"') != -1) {
                console.info(data.url + " 获取完成");
                odds = getOdds(stdout);
                console.info(odds);
                if (data.oddsType == 1) {
                    data.europeOdds = odds;
                    await saveOdds(data);
                } else if (data.oddsType == 2) {
                    data.asiaOdds = odds;
                    await saveOdds(data);
                }
                data.hasContent = true;
            } else {
                console.info(data.url + " 获取内容不包含odds");
                data.hasContent = false;
            }
        }
        if (!data.hasContent) {
            proxy = await Utils.getProxy();
        }
    }
}

function getAsiaOdds(stdout) {
    var nH = Utils.safeHtml(stdout);
    const $ = cheerio.load(nH, { decodeEntities: false }, false);
    var trs = $("#odds").find("tr");
    console.info("trs.length=" + trs.length);
    if (trs.length == 0) {
        console.info(nH);
    }
    for (var i = 0; i < trs.length; i++) {
        var tds = $(trs[i]).find("td");
        var company = $(tds[0]).text().trim();
        var h, pan, a;
        if (tds.length > 8) {
            h = $(tds[2]).text().trim();
            pan = $(tds[3]).text().trim();
            a = $(tds[4]).text().trim();
        } else {
            h = $(tds[1]).text().trim();
            pan = $(tds[2]).text().trim();
            a = $(tds[3]).text().trim();
        }
        console.info({ company, h, pan, a });
        if (company.toLowerCase().indexOf("365") != -1 && h != "" && pan != "" && a != "") {
            return [isNaN(h) ? 0 : parseFloat(h), isNaN(pan) ? pan : parseFloat(pan), isNaN(a) ? 0 : parseFloat(a)];
        } else {
            console.info({ company, h, pan, a });
        }
    }
    return [0, 0, 0];
}

function getOdds(stdout) {
    var nH = Utils.safeHtml(stdout);
    const $ = cheerio.load(nH, { decodeEntities: false }, false);
    var tds = $("table tr:eq(2)").find("td");
    var company = $(tds[0]).text().trim();
    var h = $(tds[1]).text().trim();
    var d = $(tds[2]).text().trim();
    var a = $(tds[3]).text().trim();
    console.info({ company, h, d, a });
    if (company.indexOf("365") != -1 && h != "" && d != "" && a != "") {
        return [isNaN(h) ? 0 : parseFloat(h), isNaN(d) ? d : parseFloat(d), isNaN(a) ? 0 : parseFloat(a)];
    } else {
        return [0, 0, 0];
    }
}
var oddsData = {};
var oddsArr = [];
var odds = { id: "id" + "-Bet365", company: "Bet365", s: "europeOdds[0]", p: "europeOdds[1]", f: "europeOdds[2]", h: "asiaOdds[0]", pan: "asiaOdds[1]", a: "asiaOdds[2]", matchId: "id" };
function getOddsData(data) {
    var odds = { id: data.id + "-" + data.company, company: data.company, matchId: data.id, s: data.europeOdds[0], p: data.europeOdds[1], f: data.europeOdds[2], h: data.asiaOdds[0], pan: data.asiaOdds[1], a: data.asiaOdds[2] };
    // console.info(odds);
    return odds;
}

async function saveOdds(data) {
    var odds = oddsData[data.id];
    if (!odds) {
        odds = { id: data.id + "-" + data.company, company: data.company, matchId: data.id };
        oddsData[data.id] = odds;
    }
    if (data.europeOdds) {
        odds.s = data.europeOdds[0];
        odds.p = data.europeOdds[1];
        odds.f = data.europeOdds[2];

    }
    if (data.asiaOdds) {
        odds.h = data.asiaOdds[0];
        odds.pan = ConvertGoal(data.asiaOdds[1]);
        odds.a = data.asiaOdds[2];
    }
    if (odds.hasOwnProperty("s") && odds.hasOwnProperty("pan")) {
        oddsArr.push(odds);
        if (oddsArr.length >= data.len) {
            let topN = oddsArr.splice(0, data.len);
            await DBHelper.saveModelArr(topN, "t_match_odds", true);
            topN.forEach(o => {
                delete oddsData[o.matchId];
            })
            if (data.len < limit) {
                console.info("程序处理完成");
                process.exit();
            } else {
                console.info("处理完一波" + limit + ",再一次循环");
                main();
            }
        } else {
            console.info("当前缓存条数：" + oddsArr.length + " , 最大缓存：" + data.len);
        }
    }
}

async function convertOdds() {
    while (true) {
        var rs = await DBHelper.query("select distinct pan from t_match_odds where pan<>'平手' and LOCATE('球', pan)=0 and h <> 0 limit 100");
        if (rs && rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
                var odds = rs[i];
                var pan = ConvertGoal(odds.pan);
                var sql = "update t_match_odds set pan='" + pan + "' where pan = '" + odds.pan + "' and h <> 0";
                console.info(sql);
                var nrs = await DBHelper.query(sql);
                console.info(nrs);
            }
        }
        if (rs.length < 100) {
            console.info("最后一组处理完成，程序退出");
            break;
        }
    }
    console.info("程序退出");
    process.exit();
}

if (process.argv[2] == "convert") {
    convertOdds();
} else if (process.argv[2] == "main1") {
    main1();
} else {
    main();
}
