const Utils = require("./Utils")
const Logger = require("./Logger")
const Config = require("./Config")
const DBHelper = require("./DBHelper")
const Puppeteer = require('puppeteer');
const program = require('commander');

program
    .version('0.1.0')
    .option('-l, --league-id [id]', '抓取指定球探网的联赛ID', 0)
    .option('-t, --team-id [id]', '抓取指定球队的历史对阵', 0)
    .option('-m, --match-id [id]', '抓取指定比赛的赔率', 0)
    .option('-a, --all-team ', '强制刷新球队数据')
    .option('-e, --exec [type]', '只执行指定的方法 [odds]', 'odds')
    .parse(process.argv);
var args = process.argv.slice(2);
if (!program.exec && args.indexOf("odds") != -1) {
    program.exec = "odds";
}
if (!program.teamId && args.indexOf("-t") != -1) {
    program.teamId = args[args.indexOf("-t") + 1];
}
if (!program.matchId && args.indexOf("-m") != -1) {
    program.matchId = args[args.indexOf("-m") + 1];
}
if (!program.allTeam && args.indexOf("-a") != -1) {
    program.allTeam = true;
}
if (!program.leagueId && args.indexOf("-l") != -1) {
    program.leagueId = args[args.indexOf("-l") + 1];
}

var g_browser, g_url_idx = 0, vipPage, zqPage;

(async () => {
    let urls = Config.urls;
    // Logger.info(urls);
    Logger.info("程序开始运行");

    await Puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 1920,
            height: 966
        },
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
        //ignoreDefaultArgs: ["--enable-automation"]
        // devtools: true

    }).then(async browser => {
        g_browser = browser;
        await browser.newPage();
        let pages = await browser.pages();
        zqPage = pages[0];
        vipPage = pages[1];
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];

            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
            );
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, "plugins", {
                    get: () => [
                        {
                            0: {
                                type: "application/x-google-chrome-pdf",
                                suffixes: "pdf",
                                description: "Portable Document Format",
                                enabledPlugin: Plugin,
                            },
                            description: "Portable Document Format",
                            filename: "internal-pdf-viewer",
                            length: 1,
                            name: "Chrome PDF Plugin",
                        },
                        {
                            0: {
                                type: "application/pdf",
                                suffixes: "pdf",
                                description: "",
                                enabledPlugin: Plugin,
                            },
                            description: "",
                            filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                            length: 1,
                            name: "Chrome PDF Viewer",
                        },
                        {
                            0: {
                                type: "application/x-nacl",
                                suffixes: "",
                                description: "Native Client Executable",
                                enabledPlugin: Plugin,
                            },
                            1: {
                                type: "application/x-pnacl",
                                suffixes: "",
                                description: "Portable Native Client Executable",
                                enabledPlugin: Plugin,
                            },
                            description: "",
                            filename: "internal-nacl-plugin",
                            length: 2,
                            name: "Native Client",
                        },
                    ],
                });

                window.chrome = {
                    runtime: {},
                    loadTimes: function () { },
                    csi: function () { },
                    app: {},
                };
                Object.defineProperty(navigator, "webdriver", {
                    get: () => false,
                });
                Object.defineProperty(navigator, "platform", {
                    get: () => "Win32",
                });
            });
            await page.on('console', msg => console.log('PAGE' + i + ' LOG:', msg.text()));
        }

        Logger.info("正在打开浏览器，进入球探主页");
        await zqPage.goto("http://zq.win007.com/");
        await vipPage.goto("http://vip.win007.com");
        await zqPage
            .addScriptTag({
                url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
            });
        await vipPage
            .addScriptTag({
                url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
            });
        var title = await zqPage.evaluate(() => {
            var jh = {};
            return document.title;
        })
        Logger.info("球探主页[" + title + "]进入完毕,开始装载模块");
        // await page.exposeFunction("exit", exit);

        await zqPage.waitForFunction(() => {
            return typeof jQuery != "undefined";
        })
        await vipPage.waitForFunction(() => {
            return typeof jQuery != "undefined";
        })
        await zqPage.evaluate(() => {
            console.log(jQuery.fn.jquery);
            window.$ = jQuery;
        });

        await vipPage.evaluate(() => {
            console.log(jQuery.fn.jquery);
            window.$ = jQuery;
        });

        if (program.exec == "odds") {
            await getMatchOdds();
        } else {
            await getTeam(zqPage);
        }
    });
})();
var yearStr = new Date().getFullYear() + ""
async function getTeam(page) {
    var teamCount = 0;
    //如果指定联赛id，则强制更新球队数据
    if (program.leagueId) {
        program.allTeam = true;
    }
    //如果指定了强制更新球队数据，由不需要查数据库
    if (!program.allTeam) {
        var rs = await DBHelper.query("select count(1) as c from t_team");
        if (rs.length == 1) {
            teamCount = rs[0]["c"];
        }
    }
    if (teamCount > 0) {
        console.log("球队已经采集过了，不用重新采集");
        console.log("开始采集球队的历史比赛");
        await getMatchByTeam(page);
        await getMatchOdds();
        return;
    }
    var urlObj = Config.urls[g_url_idx++];
    if (urlObj) {
        //如果指定联赛id，则判断是否为指定联赛id
        if (program.leagueId && urlObj.id != program.leagueId) {
            getTeam(page);
            return;
        }
        console.log("准备抓取[ " + urlObj.name + " ],地址：" + urlObj.url);
        urlObj.start = new Date();
        var seaUrl = "/jsData/LeagueSeason/sea" + urlObj.id + ".js";
        var seaContent = await Utils.getFile(seaUrl);
        if (seaContent.indexOf(yearStr) == -1) {//不包含本年的赛季，获取新的数据
            seaContent = await Utils.getFromUrl(page, seaUrl);
            retry = 1;
            while (seaContent == "-1") {
                console.log(seaUrl + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
                await page.waitForTimeout(10 * 1000 * retry);
                seaContent = await Utils.getFromUrl(page, seaUrl);
            }
        }
        if (seaContent != "" && seaContent.indexOf("DOCTYPE") == -1) {
            await Utils.saveFile(seaUrl, seaContent);
            delete arrSeason;
            eval(seaContent);
            var season;
            for (var i = 0; i < arrSeason.length; i++) {
                season = arrSeason[i];
                if (season.split("-")[0] < Config.maxSeason) {
                    break;
                }
                var sdUrl = "/jsData/SinDou/" + season + "/sd" + urlObj.id + ".js";
                var sdContent = await Utils.getFile(sdUrl);
                if (sdContent == "") {//获取新的数据
                    sdContent = await Utils.getFromUrl(page, sdUrl);
                    retry = 1;
                    while (sdContent == "-1") {
                        console.log(sdUrl + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
                        await page.waitForTimeout(10 * 1000 * retry);
                        sdContent = await Utils.getFromUrl(page, sdUrl);
                    }
                }
                if (sdContent != "" && sdContent.indexOf("DOCTYPE") == -1) {
                    await Utils.saveFile(sdUrl, sdContent);
                    delete arrTeam;
                    eval(sdContent);
                    var teamData = {};
                    for (var j = 0; j < arrTeam.length; j++) {
                        //[630, '爱尔兰', '愛爾蘭', 'Ireland', '愛爾蘭', 'images/20140524122451.jpg', 0]
                        var teamArr = arrTeam[j];
                        var id = teamArr[0];
                        var name_cn = teamArr[1];
                        var name_tr = teamArr[2];
                        var name_en = teamArr[3];
                        var logo = teamArr[5];
                        teamData[id] = { id, name_cn, name_en, name_tr, logo };
                    }
                    await DBHelper.saveModelData(teamData, "t_team");
                }
            }
            urlObj.finish = new Date();
        }
        if (urlObj.finish) {
            var ms = (urlObj.finish.getTime() - urlObj.start.getTime());
            console.log("准备抓取[ " + urlObj.name + " ] 完成，开始于" + urlObj.start + ",结束于" + urlObj.finish + ",共耗时 " + ms + " 毫秒");
            await page.waitForTimeout(500);
            getTeam(page);
        } else {
            g_url_idx--;
            await page.waitForTimeout(1000);
            getTeam(page);
        }
    } else {
        console.log("球队采集完毕");
        console.log("开始采集球队的历史比赛");
        await getMatchByTeam(page);
        await getMatchOdds();
    }
}

async function getMatchOdds() {
    page = vipPage;
    var limit = 100;
    while (true) {
        var ids;
        if (program.matchId) {
            console.log("指定了matchId=" + program.matchId);
            ids = [program.matchId];
        } else {
            ids = await DBHelper.query("select m.id from t_match m left join t_match_odds o on m.id = o.matchId where o.id is null limit " + limit);
        }
        var len = ids.length;
        var oddsData = {};
        for (var i = 0; i < len; i++) {
            var id = ids[i]["id"];
            console.log("正在获取第" + (i + 1) + "个Id=" + id + "的赔率,还剩 " + (len - i - 1));
            var europeOddsUrl = "/ChangeDetail/Standard_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
            var content = await Utils.getFromUrl(page, europeOddsUrl);
            retry = 1;
            while (content.indexOf("id=\"odds\"") == -1) {
                console.log(europeOddsUrl + "返回错误的数据，" + (6 * retry) + "秒后重试第" + retry + "次");
                await page.waitForTimeout(6 * 1000 * retry);
                content = await Utils.getFromUrl(page, europeOddsUrl);
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
            var asiaOddsUrl = "/ChangeDetail/Asian_all.aspx?ID=" + id + "&companyid=8&company=Bet365";
            content = await Utils.getFromUrl(page, asiaOddsUrl);
            retry = 1;
            while (content.indexOf("id=\"odds\"") == -1) {
                console.log(asiaOddsUrl + "返回错误的数据，" + (6 * retry) + "秒后重试第" + retry + "次");
                await page.waitForTimeout(6 * 1000 * retry);
                content = await Utils.getFromUrl(page, asiaOddsUrl);
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
            console.log("europeOdds:", europeOdds, "asiaOdds:", asiaOdds);

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
            await DBHelper.saveModelData(oddsData, "t_match_odds");
        }
        if (len < limit) {
            break;
        }
    }
    exit();
}

async function getMatchByTeam(page) {
    var ids;
    if (program.teamId) {
        console.log("有指定teamId =" + program.teamId);
        ids = [program.teamId];
    } else {
        ids = await DBHelper.query("select id from t_team where match_count < 33 and totalPage > 2");
    }
    var idsLen = ids.length;
    for (var i = 0; i < idsLen; i++) {
        var id = ids[i]["id"];
        console.log("正在获取第" + (i + 1) + "个球队ID=" + id + "的历史比赛数据,还剩" + (idsLen - i - 1));
        var sdUrl = "/cn/team/TeamScheAjax.aspx?TeamID=" + id + "&pageNo=1&flesh=";
        var sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
        retry = 1;
        while (sdContent == "-1") {
            console.log(sdUrl + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
            await page.waitForTimeout(10 * 1000 * retry);
            sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
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
                // console.log("比赛未开始，过滤掉了 playtime=" + playtime);
                continue;
            }
            if (data[6].split(/[-:]/).length != 2) { //没有比分的比赛，直接过滤掉
                // console.log("比赛没有比分，过滤掉了 fullscore=" + match.fullscore);
                continue;
            }
            allMatch.push(data);
        }
        for (var pageNo = 2; pageNo <= totalPage; pageNo++) {
            sdUrl = "/cn/team/TeamScheAjax.aspx?TeamID=" + id + "&pageNo=" + pageNo + "&flesh=";
            sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
            retry = 1;
            while (sdContent == "-1") {
                console.log(sdUrl + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
                await page.waitForTimeout(10 * 1000 * retry);
                sdContent = await Utils.getFromUrl(page, sdUrl + Math.random());
            }
            delete teamPageInfo
            delete teamPageData;
            eval(sdContent);
            for (var j = 0; j < teamPageData.length; j++) {
                var data = teamPageData[j];
                var playtime = data[3];
                if (playtime > nTimeStr) {//未开始的比赛，直接过滤掉
                    // console.log("比赛未开始，过滤掉了 playtime=" + playtime);
                    continue;
                }
                if (data[6].split(/[-:]/).length != 2) { //没有比分的比赛，直接过滤掉
                    // console.log("比赛没有比分，过滤掉了 fullscore=" + match.fullscore);
                    continue;
                }
                allMatch.push(data);
            }
            if (allMatch.length > 33) {
                break;
            }
        }
        console.log("teamId=" + id + " 共获取比赛 " + allMatch.length + " 场");

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
            //     console.log("比赛未开始，过滤掉了 playtime=" + playtime);
            //     continue;
            // }
            let scores = match.fullscore.split(/[:-]/g);
            // if (scores.length != 2) { //没有比分的比赛，直接过滤掉
            //     console.log("比赛没有比分，过滤掉了 fullscore=" + match.fullscore);
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
            console.log("teamId=" + id + " 比赛入库的结果", res);
        }
        await DBHelper.query("update t_team set totalPage=" + totalPage + ",match_count = (select count(1) from t_match where homeId=" + id + " or awayId=" + id + ") where id=" + id);
        console.log("更新t_team 比赛场次数结束");
    }
}

async function exit() {
    await g_browser.close();

    await DBHelper.closePool();

    Logger.info("程序运行完毕，进入结束");

    await process.exit();
}