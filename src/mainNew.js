const Utils = require("./Utils")
const Logger = require("./Logger")
const Config = require("./Config")
const DBHelper = require("./DBHelper")
const Puppeteer = require('puppeteer');
const program = require('commander');
const matchUtil = require("./matchUtils");

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
    Logger.info("执行ODDs操作");
}
if (!program.teamId && args.indexOf("-t") != -1) {
    program.teamId = args[args.indexOf("-t") + 1];
    Logger.info("指定球队ID=" + program.teamId);
}
if (!program.matchId && args.indexOf("-m") != -1) {
    program.matchId = args[args.indexOf("-m") + 1];
    Logger.info("指定比赛ID=" + program.matchId);
}
if (!program.allTeam && args.indexOf("-a") != -1) {
    Logger.info("强制刷新球队数据");
    program.allTeam = true;
}
if (!program.leagueId && args.indexOf("-l") != -1) {
    program.leagueId = args[args.indexOf("-l") + 1];
    Logger.info("指定联赛ID=" + program.leagueId);
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
            page.on('console', msg => Logger.log('PAGE' + i + ' LOG:', msg.text()));
        }
        browser.on("disconnected", () => {
            process.exit();
        })

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
            Logger.log(jQuery.fn.jquery);
            window.$ = jQuery;
        });

        await vipPage.evaluate(() => {
            Logger.log(jQuery.fn.jquery);
            window.$ = jQuery;
        });

        if (program.exec == "odds") {
            await getMatchOdds(vipPage,program.matchId);
            exit();
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
        Logger.log("球队已经采集过了，不用重新采集");
        Logger.log("开始采集球队的历史比赛");
        await matchUtil.getMatchByTeam(page,program.teamId);
        await matchUtil.getMatchOdds(vipPage,program.matchId);
        exit();
        return;
    }
    var urlObj = Config.urls[g_url_idx++];
    if (urlObj) {
        //如果指定联赛id，则判断是否为指定联赛id
        if (program.leagueId && urlObj.id != program.leagueId) {
            //不处理当前ID，直接下一个
            getTeam(page);
            return;
        }
        Logger.log("准备抓取[ " + urlObj.name + " ],地址：" + urlObj.url);
        urlObj.start = new Date();
        var seaUrl = "/jsData/LeagueSeason/sea" + urlObj.id + ".js";
        var seaContent = await Utils.getFile(seaUrl);
        if (seaContent.indexOf(yearStr) == -1) {//不包含本年的赛季，获取新的数据
            seaContent = await Utils.getFromUrl(page, seaUrl);
            retry = 1;
            while (seaContent == "-1") {
                Logger.log(seaUrl + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
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
                        Logger.log(sdUrl + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
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
            Logger.log("准备抓取[ " + urlObj.name + " ] 完成，开始于" + urlObj.start + ",结束于" + urlObj.finish + ",共耗时 " + ms + " 毫秒");
            await page.waitForTimeout(500);
            getTeam(page);
        } else {
            g_url_idx--;
            await page.waitForTimeout(1000);
            getTeam(page);
        }
    } else {
        Logger.log("球队采集完毕");
        Logger.log("开始采集球队的历史比赛");
        await matchUtil.getMatchByTeam(page,program.teamId);
        await matchUtil.getMatchOdds(vipPage,program.matchId);
        exit();
    }
}

async function exit() {
    await g_browser.close();

    await DBHelper.closePool();

    Logger.info("程序运行完毕，进入结束");

}