const DBHelper = require("./DBHelper")
const Utils = require("./Utils")
var child_process = require("child_process");
const cheerio = require('cheerio')
const limit = 100;
const companyIdMap = { "Bet365": { e: 8, a: 8 } };
const sync = true;
var proxy = {};
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
                var curl = 'curl '+(proxy.data ?" -x socks5://"+proxy.data[0].ip+":"+proxy.data[0].port:"")+' "' + europeUrl + '" -s | iconv -f gbk -t utf-8'
                console.log("开始获取：" + curl);
                var data = { id, url: europeUrl, oddsType: 1, company: companyName, len };
                child_process.exec(curl, nResult(data));
                var asiaUrl = "http://vip.win007.com/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=" + companyIdData.a + "&company=" + companyName;
                curl = 'curl '+(proxy.data ?" -x socks5://"+proxy.data[0].ip+":"+proxy.data[0].port:"")+' "' + asiaUrl + '" -s | iconv -f gbk -t utf-8'
                console.log("开始获取：" + curl);
                data.url = asiaUrl;
                data.oddsType = 2;
                child_process.exec(curl, nResult(data));
                await Utils.sleep(10);
            } else {
                
                var proxyIp  = (proxy.data ?" -x socks5://"+proxy.data[0].ip+":"+proxy.data[0].port:"");
                //同步处理
                var europeUrl = "http://vip.win007.com/ChangeDetail/Standard_all.aspx?ID=" + id + "&companyid=" + companyIdData.e + "&company=" + companyName;
                var curl = 'curl '+proxyIp+' "' + europeUrl + '" -s | iconv -f gbk -t utf-8'
                var odata = { id, europeOdds: null, asiaOdds: false, company: companyName, len: 99999999 };
                // var response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="odds"') != -1 }, 1);
                var response = await Utils.getByCurl(curl);
                if (response) {
                    console.info(europeUrl + " 获取完成");
                    odds = getOdds(response);
                    // console.info(odds);
                    odata.europeOdds = odds;
                    var asiaUrl = "http://vip.win007.com/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=" + companyIdData.a + "&company=" + companyName;
                    curl = 'curl '+proxyIp+' "' + asiaUrl + '" -s | iconv -f gbk -t utf-8'
                    // response = await Utils.getByCurl(curl, (r) => { return r.indexOf('id="odds"') != -1 }, 1);
                    response = await Utils.getByCurl(curl);
                    if (response) {
                        console.info(asiaUrl + " 获取完成");
                        odds = getOdds(response);
                        // console.info(odds);
                        odata.asiaOdds = odds;
                        oddsArr.push(getOddsData(odata));
                    }else{
                        proxy = await Utils.getProxy();
                        console.error("获取新的代理IP" + JSON.stringify(proxy));
                    }
                }else{
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
        if(!data.hasContent){
            proxy = await Utils.getProxy();
        }
    }
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
        return [isNaN(h) ? 0 : parseFloat(h), isNaN(d) ? 0 : parseFloat(d), isNaN(a) ? 0 : parseFloat(a)];
    } else {
        return [0, 0, 0];
    }
}
var oddsData = {};
var oddsArr = [];
var odds = { id: "id" + "-Bet365", company: "Bet365", s: "europeOdds[0]", p: "europeOdds[1]", f: "europeOdds[2]", h: "asiaOdds[0]", pan: "asiaOdds[1]", a: "asiaOdds[2]", matchId: "id" };
function getOddsData(data) {
    var odds = { id: data.id + "-" + data.company, company: data.company, matchId: data.id, s: data.europeOdds[0], p: data.europeOdds[1], f: data.europeOdds[2], h: data.asiaOdds[0], pan: data.asiaOdds[1], a: data.asiaOdds[2] };
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
        odds.pan = data.asiaOdds[1];
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

main();