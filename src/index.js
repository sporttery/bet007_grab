const Puppeteer = require('puppeteer-core');
const Logger = require("./Logger");
const Util = require("./Utils");
const matchUtil = require("./matchUtils");


(async () => {
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1960,
            height: 1024
        },
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
            await Util.addCollectionButton(page);
            await page.evaluate(() => {
                layer.closeAll();
                layer.alert("采集完成")
            });
        }
        async function getMatchByTeam(teamId, playtime) {
            return await matchUtil.getMatchByTeam(boloolDetailPage, teamId, playtime);
        } 

        var boloolPage, boloolDetailPage;
        async function boloolDetail(id) {
            Logger.info("打开菠萝指数详情，id=" + id);
            var matchlist = await page.evaluate(() => {
                return JSON.stringify(matchlist);
            });
            matchlist = JSON.parse(matchlist);
            var match = matchlist[id];
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
                await boloolDetailPage.exposeFunction("saveBolool", matchUtil.saveBolool);
            }
            await boloolDetailPage.goto("file://" + __dirname + "/html/boloolDetail.html?id=" + id);
            await boloolDetailPage.evaluate((match) => {
                showBolool(match);
            }, match);
            boloolDetailPage.on('domcontentloaded',()=>{
                boloolDetailPage.evaluate((match)=>{
                    showBolool(match);
                },match);
            });
        }


        

        async function bolool(id) {
            Logger.info("打开菠萝指数");
            if (!boloolPage) {
                boloolPage = await browser.newPage();
                boloolPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
                await boloolPage.exposeFunction("getBoloolById", matchUtil.getBoloolById);
                await boloolPage.exposeFunction("boloolDetail", boloolDetail);
                await boloolPage.exposeFunction("saveBolool",  matchUtil.saveBolool);
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
            await boloolPage.evaluate((matchlist) => {
                g_match = matchlist;
                initTable();
            }, matchlist);

            boloolPage.on('domcontentloaded',()=>{
                boloolPage.evaluate(()=>{
                    initTable();
                });
            })

            if (id) {
                await boloolDetail(id);
                await boloolDetailPage.bringToFront();
            }
        }
        async function setOdds(){
            var matchlist = await page.evaluate(() => {
                return JSON.stringify(matchlist);
            });
            matchlist = JSON.parse(matchlist);
            for (var key in matchlist) {
                var match = matchlist[key];
                var id = match.id;
                if(!match.bet365_yp){
                    var odds = await matchUtil.getOddsById(id);
                    if(odds){
                        match.bet365_yp=[odds.h, matchUtil.ConvertGoal(odds.pan),odds.a];
                        match.bet365_op= [odds.s,odds.p,odds.f];
                    }
                }
            }
            await page.evaluate((_matchlist)=>{
                matchlist=_matchlist;
                for(var key in matchlist){
                    var match = matchlist[key];
                    if(match.bet365_yp && match.bet365_yp[0] != 0  && match.bet365_op && match.bet365_op[0] != 0){
                        var tr = $("#m"+key);
                        tr.find(".td-pei div:eq(0)").html('<span>'+match.bet365_op[0]+'</span><span>'+match.bet365_op[1]+'</span><span>'+match.bet365_op[2]+'</span>');
                        tr.find(".td-pei div:eq(1)").html('<span>'+match.bet365_yp[0]+'</span><span>'+match.bet365_yp[1]+'</span><span>'+match.bet365_yp[2]+'</span>');
                        tr.find(".tdQing").show();
                    }
                }
                layer.closeAll();
            },matchlist);
        }

        browser.on("disconnected", () => {
            process.exit();
        })
        Logger.info("正在打开浏览器，进入球探主页");
        await page.goto("file://" + __dirname + "/index.html");
        await page.exposeFunction("ft2Click", ft2Click);
        await page.exposeFunction("bolool", bolool);
        await page.exposeFunction("setOdds", setOdds);
        page.on("domcontentloaded",async ()=>{
            await Util.addCollectionButton(page);
        });
        await Util.addCollectionButton(page);
    });
})();