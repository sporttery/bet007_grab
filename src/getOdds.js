const Utils = require("./Utils")
const Logger = require("./Logger")
const fs = require("fs")
const DBHelper = require("./DBHelper")

var seasonReg = /\d{4}(-\d{4})?/g;
var leagueIdReg = /\d+(_\d+)?.js$/g;
var cupReg = /c\d+.js$/g
var jh = {};
var companyName = {
    "8": "Bet365", "281": "Bet365",
    "3": "Crown", "545": "Crown",
    "31": "利记", "474": "利记",
    "17": "明陞", "517": "明陞",
    "12": "易胜博", "90": "易胜博",
    "1": "澳门", "80": "澳门",
    "35": "盈禾", "659": "盈禾",
    "4": "立博", "82": "立博",
    "14": "韦德", "81": "韦德",
    "23": "金宝博"
};

var companyNameId = {
    "Bet365": 8,
    "Crown": 3,
    "利记": 31,
    "明陞": 17,
    "易胜博": 12,
    "澳门": 1,
    "盈禾": 35,
    "立博": 4,
    "韦德": 14,
    "金宝博": 23
};
async function saveOdds(content) {
    var oddsData = {};
    eval(content);
    var matchOddsData = {};

    for (var key in oddsData) {
        var type = key.substring(0, 1);
        var id = key.substring(2);
        var oddsArr = oddsData[key];
        for (var j = 0; j < oddsArr.length; j++) {
            var o = oddsArr[j];
            var company = companyName[o[0]];
            if (!company) {
                continue;
            }
            var idkey = id + "_" + companyNameId[company];
            var odds = matchOddsData[idkey];
            if (!odds) {
                odds = { id: idkey, matchId: id, company: company, s: 0, p: 0, f: 0, h: 0, a: 0, pan: '', da: 0, xiao: 0, dxpan: '' };
                matchOddsData[idkey] = odds;
            }
            if (type == 'O') {
                odds.s = o[1];
                odds.p = o[2];
                odds.f = o[3];
            } else if (type == "L") {
                odds.h = o[1];
                odds.pan = o[2];
                odds.a = o[3];
            } else if (type == "T") {
                odds.da = o[1];
                odds.dxpan = o[2];
                odds.xiao = o[3];
            }
        };
    }
    await DBHelper.saveModelData(matchOddsData, "t_match_odds");
}
var g_browser;
(async function () {
    Logger.info("程序开始运行");
    const Puppeteer = require('puppeteer-core');
    await Puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 1920,
            height: 966
        },
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        ignoreHTTPSErrors: true,
        //ignoreDefaultArgs: ["--enable-automation"]
        // devtools: true

    }).then(async browser => {
        g_browser = browser;
        let pages = await browser.pages();
        let page = pages[0];
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

        await page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        Logger.info("正在打开浏览器，进入球探主页");
        await page.goto("http://zq.win007.com/");
        await page
            .addScriptTag({
                url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
            });
        var title = await page.evaluate(() => {
            var jh = {};
            return document.title;
        })
        Logger.info("球探主页[" + title + "]进入完毕,开始装载模块");
        // await page.exposeFunction("exit", exit);

        await page.waitForFunction(() => {
            return typeof jQuery != "undefined";
        })

        await page.evaluate(() => {
            console.log(jQuery.fn.jquery);
            window.$ = jQuery;
        });

        var pathName = "jsData/matchResult";
        var files = Utils.getFiles(pathName);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (fs.existsSync(file + ".odds.finished")) {
                continue;
            }
            console.log("正在获取赔率 " + file);
            var season = file.match(seasonReg)[0];
            var arr = file.match(leagueIdReg)[0].split(/[_.]/);
            var leagueId, subId = "";
            if (arr.length == 2) {
                leagueId = arr[0];
            } else if (arr.length == 3) {
                leagueId = arr[0];
                subId = arr[1];
            } else {
                console.log("解析出错");
                process.exit();
            }
            var isCup = file.match(cupReg);
            var round = 1, maxRound = 1;
            var isFinish = false;
            jh = {};
            var content = await Utils.getFile(file);
            console.log(content.length);
            eval(content);

            var nowTime = new Date();
            var sixDays = 1000 * 60 * 60 * 24 * 6;
            //如果比赛都在一周之后，就不要获取赔率了。未来比赛，未来再获取

            if (!isCup) {
                if (typeof arrSubLeague != "undefined") {
                    for (var j = 0; j < arrSubLeague.length; j++) {
                        var tmpArr = arrSubLeague[j];
                        if (tmpArr[0] == subId) {
                            maxRound = tmpArr[6];
                            isFinish = tmpArr[5] == tmpArr[6];
                        }
                    }
                } else {
                    maxRound = arrLeague[8];
                    isFinish = arrLeague[7] == arrLeague[8];
                }
            } else {
                var n = false;
                var matchData = Utils.getMatchData(jh, season, isCup, {}, {}, {});
                for (var key in matchData) {
                    var match = matchData[key];
                    var nTimeArr = match.playtime.split(/[-: ]/);
                    var playtime = new Date(nTimeArr[0], parseInt(nTimeArr[1]) - 1, nTimeArr[2], nTimeArr[3], nTimeArr[4], 0);
                    if (playtime.getTime() - nowTime.getTime() > sixDays) {
                        n = true;
                        break;
                    }
                }

                if (!n) {
                    isFinish = true;
                }
            }

            while (round <= maxRound) {
                var url = "/League/LeagueOddsAjax?sclassId=" + leagueId + "&subSclassId=" + subId + "&matchSeason=" + season + "&round=" + round;
                var oddsFile = "odds/" + season + "/" + (isCup ? "c" : "s") + leagueId + "_" + subId + "_" + round + ".js";
                if (fs.existsSync(oddsFile)) {
                    round++;
                    continue;
                }
                var content = await Utils.getFromUrl(page, url);
                retry = 1;
                while (content == "-1") {
                    console.log(url + "返回错误的数据，" + (6 * retry) + "秒后重试第" + retry + "次");
                    await page.waitForTimeout(6 * 1000 * retry++);
                    content = await Utils.getFromUrl(page, url);
                }
                if (content != "" && content.indexOf("DOCTYPE") == -1) {
                    await saveOdds(content);
                    if (!isCup) {
                        await Utils.writeToFile(content, oddsFile);
                    }
                }

                round++;
            }

            console.log(file + " 获取赔率完成 ");
            if (isFinish) {
                fs.writeFileSync(file + ".odds.finished", Utils.formatDate(new Date()));
            }
        }
        await exit(); 
    });
})();

async function exit() {
    await g_browser.close();
    await DBHelper.closePool();
    Logger.info("程序运行完毕，进入结束");

    await process.exit();
}