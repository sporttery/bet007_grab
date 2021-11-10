const Puppeteer = require('puppeteer-core');
const Logger = require("./Logger");
const Util = require("./Utils");
const matchUtil = require("./matchUtils");


(async () => {
    await Puppeteer.launch({
        headless: false,
        defaultViewport:null,
        args: ["--no-sandbox", "--disable-setuid-sandbox", '--disable-web-security', "--start-maximized"],
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        // ignoreDefaultArgs:['--enable-automation'],
        ignoreHTTPSErrors: true,
        // devtools: true
    }).then(async browser => {
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
            // Object.defineProperty(navigator, "webdriver", {
            //     get: () => false,
            // });
            Object.defineProperty(navigator, "platform", {
                get: () => "Win32",
            });
        });

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        async function ft2Click() {
            await Util.disableButton(page, true);
            var teamIds = await page.evaluate(() => {
                layer.load(1);
                var temaId = {};
                for (var key in matchlist) {
                    var match = matchlist[key];
                    var homeId = match.homeId;
                    var awayId = match.homeId;
                    var id = match.id;
                    if (!temaId[homeId + ""]) {
                        temaId[homeId + ""] = id;
                    }
                    if (!temaId[awayId + ""]) {
                        temaId[awayId + ""] = id;
                    }
                }
                return JSON.stringify(temaId);
            });
            var allTeamIds = JSON.parse(teamIds);
            for (var teamId in allTeamIds) {
                await matchUtil.getMatchByTeam(page, teamId);
            }
            // var matchlist = await page.evaluate(()=>{
            //     return JSON.stringify(matchlist);
            // });
            // matchlist = JSON.parse(matchlist);
            // for(var key in matchlist){
            //     var match = matchlist[key];
            //     if(!match.bolool){
            //         var bolool = await matchUtil.getBoloolById(match.id);
            //         match.bolool = bolool;
            //     }
            //     if(!match.bet365_op){
            //         var id = match.id;
            //         var odds = await matchUtil.getOddsById(id);
            //         if(odds){
            //             match.bet365_yp=[odds.h,matchUtil.ConvertGoal(odds.pan),odds.a];
            //             match.bet365_op= [odds.s,odds.p,odds.f];
            //         }
            //     }
            // }
            // await page.evaluate((_matchlist) => {
            //     matchlist = _matchlist;
            // }, matchlist);
            await Util.addCollectionButton(page);
            await page.evaluate(() => {
                layer.closeAll();
                layer.alert("采集完成")
            });
        }
        async function getMatchByTeam(teamId, playtime) {
            return await matchUtil.getMatchByTeam(boloolDetailPage, teamId, playtime);
        }

        async function saveBolool(bolool = { hscore, ascore, hresult, aresult, hsection, asection, id }){
            await matchUtil.saveBolool(bolool);
            await page.evaluate(bolool=>{
                for(var i=0;i<matchlist.length;i++){
                    if(matchlist[i].id==bolool.id){
                        matchlist[i].bolool=bolool;
                    }
                }
            },bolool);
        }

        var boloolPage, boloolDetailPage;
        async function boloolDetail(id) {
            Logger.info("打开菠萝指数详情，id=" + id);
            var matchlist = await page.evaluate(() => {
                return JSON.stringify(matchlist);
            });
            matchlist = JSON.parse(matchlist);
            var match;
            for (var i = 0; i < matchlist.length; i++) {
                if (id == matchlist[i].id) {
                    match = matchlist[i];
                    break;
                }
            }
            if (!match) {
                Logger.error("找不到对应的比赛ID=" + id);
                await boloolPage.evaluate((id) => {
                    layer.alert("找不到对应的比赛ID=" + id);
                }, id);
                return;
            }
            if (!boloolDetailPage) {
                boloolDetailPage = await browser.newPage();
                boloolDetailPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
                boloolDetailPage.on("close", () => {
                    boloolDetailPage = null;
                });
                await boloolDetailPage.exposeFunction("getBoloolListByOdds", matchUtil.getBoloolListByOdds);
                await boloolDetailPage.exposeFunction("getBoloolById", matchUtil.getBoloolById);
                await boloolDetailPage.exposeFunction("getMatchByTeam", getMatchByTeam);
                await boloolDetailPage.exposeFunction("saveBolool", saveBolool);
                await boloolDetailPage.exposeFunction("getEuropeOdds", matchUtil.getEuropeOdds);
                await boloolDetailPage.exposeFunction("getAsiaOdds", matchUtil.getAsiaOdds);
                await boloolDetailPage.exposeFunction("deleteOddsById", matchUtil.deleteOddsById);
            }
            await boloolDetailPage.goto("file://" + __dirname + "/html/boloolDetail.html?id=" + id);
            await boloolDetailPage.evaluate((match) => {
                showBolool(match);
            }, match);
            boloolDetailPage.on('domcontentloaded', () => {
                boloolDetailPage.evaluate((match) => {
                    showBolool(match);
                }, match);
            });
        }




        async function bolool(id) {
            Logger.info("打开菠萝指数");
            if (!boloolPage) {
                boloolPage = await browser.newPage();
                boloolPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
                await boloolPage.exposeFunction("getBoloolById", matchUtil.getBoloolById);
                await boloolPage.exposeFunction("boloolDetail", boloolDetail);
                await boloolPage.exposeFunction("saveBolool", saveBolool);
                await boloolPage.exposeFunction("deleteOddsById", matchUtil.deleteOddsById);
                await boloolPage.exposeFunction("getEuropeOdds", matchUtil.getEuropeOdds);
                await boloolPage.exposeFunction("getAsiaOdds", matchUtil.getAsiaOdds);
                boloolPage.on("close", () => {
                    boloolPage = null;
                })
            }
            await boloolPage.bringToFront();
            var matchlist = await page.evaluate(() => {
                return JSON.stringify(matchlist);
            });
            matchlist = JSON.parse(matchlist);
            await boloolPage.goto("file://" + __dirname + "/html/bolool.html");
            for (var key in matchlist) {
                var match = matchlist[key];
                if (!match.bolool) {
                    var bolool = await matchUtil.getBoloolById(match.id);
                    match.bolool = bolool;
                }
            }
            await page.evaluate((_matchlist) => {
                matchlist = _matchlist;
            }, matchlist);
            await boloolPage.evaluate((_matchlist) => {
                g_match = {};
                matchlist = _matchlist;
                for (var i = 0; i < matchlist.length; i++) {
                    g_match[matchlist[i].id] = matchlist[i];
                }
                initTable(matchlist);
            }, matchlist);

            boloolPage.on('domcontentloaded', () => {
                boloolPage.evaluate(() => {
                    initTable(matchlist);
                });
            })

            if (id) {
                await boloolDetail(id);
                await boloolDetailPage.bringToFront();
            }
        }
        async function setOdds(id) {
            if (id) {
                // await matchUtil.deleteOddsById(id);
                var odds = await matchUtil.getOddsById(id);
                if (odds) {
                    odds.pan = matchUtil.ConvertGoal(odds.pan);
                    await page.evaluate((odds, id) => {
                        var match;

                        for (var i = 0; i < matchlist.length; i++) {
                            if (id == matchlist[i].id) {
                                match = matchlist[i];
                                break;
                            }
                        }

                        var tr = $("#m" + match.id);
                        if (match) {
                            match.bet365_yp = [odds.h, odds.pan, odds.a];
                            match.bet365_op = [odds.s, odds.p, odds.f];

                            tr.find(".td-pei div:eq(0)").html('<span>' + match.bet365_op[0] + '</span><span>' + match.bet365_op[1] + '</span><span>' + match.bet365_op[2] + '</span>');
                            tr.find(".td-pei div:eq(1)").html('<span>' + match.bet365_yp[0] + '</span><span>' + match.bet365_yp[1] + '</span><span>' + match.bet365_yp[2] + '</span>');
                            tr.find(".tdQing").show();

                        } else {

                            tr.find(".td-pei div:eq(0)").html('<span><a href="javascript:setOdds(' + match.id + ')">获取赔率</a></span>');

                        }
                        layer.closeAll();
                    }, odds, id);
                } else {
                    await page.evaluate((id) => {
                        var tr = $("#m" + id);

                        layer.tips("没有获取到数据", tr.find(".td-pei div")[0]);

                        setTimeout(() => { layer.closeAll() }, 1000);
                    }, id);
                }
            } else {
                var matchlist = await page.evaluate(() => {
                    return JSON.stringify(matchlist);
                });
                matchlist = JSON.parse(matchlist);
                var ids = [];
                for (var key in matchlist) {
                    var match = matchlist[key];
                    var id = match.id;
                    ids.push(id);
                }

                var oddsArr = await matchUtil.getOddsByIdArr(ids);
                var oddsMap = {};
                oddsArr.forEach(odds => {
                    oddsMap[odds.matchId] = odds;
                });
                for (var key in matchlist) {
                    var match = matchlist[key];
                    var id = match.id;
                    var odds = oddsMap[id];
                    if (!odds || (odds.s == 0 && odds.h == 0)) {
                        odds = await matchUtil.getOddsById(id);
                    }
                    if (odds) {
                        match.bet365_yp = [odds.h, matchUtil.ConvertGoal(odds.pan), odds.a];
                        match.bet365_op = [odds.s, odds.p, odds.f];
                    }
                }


                await page.evaluate((_matchlist) => {
                    matchlist = _matchlist;
                    for (var key in matchlist) {
                        var match = matchlist[key];
                        var tr = $("#m" + match.id);
                        if (match.bet365_yp && match.bet365_yp[0] != 0 && match.bet365_op && match.bet365_op[0] != 0) {
                            tr.find(".td-pei div:eq(0)").html('<span>' + match.bet365_op[0] + '</span><span>' + match.bet365_op[1] + '</span><span>' + match.bet365_op[2] + '</span>');
                            tr.find(".td-pei div:eq(1)").html('<span>' + match.bet365_yp[0] + '</span><span>' + match.bet365_yp[1] + '</span><span>' + match.bet365_yp[2] + '</span>');
                            tr.find(".tdQing").show();
                        } else {
                            tr.find(".td-pei div:eq(0)").html('<span><a href="javascript:setOdds(' + match.id + ')">获取赔率</a></span>');
                        }
                    }
                    layer.closeAll();
                }, matchlist);
            }
        }

        async function refreshOdds() {
            var matchlist = await page.evaluate(() => {
                layer.load();
                for (var key in matchlist) {
                    var match = matchlist[key];
                    match.bet365_yp = null;
                    match.bet365_op = null;
                }
                return JSON.stringify(matchlist);
            });
            matchlist = JSON.parse(matchlist);
            var ids = [];
            for (var key in matchlist) {
                var match = matchlist[key];
                var id = match.id;
                ids.push(id);
            }
            await matchUtil.deleteOddsById(ids.join(","));
            await setOdds();
        }

        browser.on("disconnected", () => {
            process.exit();
        })
        Logger.info("正在打开浏览器，进入球探主页");
        await page.goto("file://" + __dirname + "/index.html");
        await page.exposeFunction("ft2Click", ft2Click);
        await page.exposeFunction("bolool", bolool);
        await page.exposeFunction("setOdds", setOdds);
        await page.exposeFunction("refreshOdds", refreshOdds);
        page.on("domcontentloaded", async () => {
            await Util.addCollectionButton(page);
        });
        await Util.addCollectionButton(page);
    });
})();