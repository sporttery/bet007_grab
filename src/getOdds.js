const Utils = require("./Utils")
const Logger = require("./Logger")
const fs = require("fs")
const DBHelper = require("./DBHelper")

var seasonReg = /\d{4}(-\d{4})?/g;
var leagueIdReg = /\d+(_\d+)?.js$/g;
var cupReg = /c\d+.js$/g
var jh = {};


async function saveOdds(content){
    var oddsData={};
    eval(content);
    var matchOddsData={};
    for(var key in oddsData){
        var type = key.substring(0,1);
        var id = key.substring(2);
        var oddsArr = oddsData[key];
        oddsArr.forEach(o=>{
            var companyId = o[0];
            var odds = matchOddsData[id+"_"+companyId];
            if(!odds){
                odds = {matchId:id,companyId:o[0],s:0,p:0,f:0,h:0,a:0,pan:'',da:0,xiao:0,dxpan:''};
                matchOddsData[id+"_"+companyId] = odds;
            }
            if(type== 'O'){
                odds.s = o[1];
                odds.p = o[2];
                odds.f = o[3];
            }else if(type == "L"){
                odds.h = o[1];
                odds.pan = o[2];
                odds.a = o[3];
            }else if(type == "T"){
                odds.da = o[1];
                odds.dxpan = o[2];
                odds.xiao = o[3];
            }
        });
        
    }
}

(async function () {
    Logger.info("程序开始运行");
    const Puppeteer = require('puppeteer');
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 966
        },
        //ignoreDefaultArgs: ["--enable-automation"]
        devtools: true

    }).then(async browser => {
        g_browser = browser;
        let pages = await browser.pages();
        let page = pages[0];
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
            if (fs.existsSync(file + ".odds")) {
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
            var content = await Utils.getFile(file);
            eval(content);
            var nowTime = new Date();
            var sixDays = 1000 * 60 * 60 * 24 * 6;
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
                    isFinish = tmpArr[7] == tmpArr[8];
                }
            } else {
                var n = false;
                for (var key in jh) {
                    if (key[0] == "G") {
                        var matchArr = jh[key];
                        var nTimeArr = matchArr[3].split(/[-: ]/);
                        var playtime = new Date(nTimeArr[0], parseInt(nTimeArr[1]) - 1, nTimeArr[2], nTimeArr[3], nTimeArr[4], 0);
                        if (playtime.getTime() - nowTime.getTime() > sixDays) {
                            n = true;
                            break;
                        }
                    }
                }
                if (!n) {
                    isFinish = true;
                }
            }

            while (round <= maxRound) {
                var url = "/League/LeagueOddsAjax?sclassId=" + leagueId + "&subSclassId=" + subId + "&matchSeason=" + season + "&round=" + round;
                var oddsFile = "odds/" + season + "/" + leagueId + "_" + subId + "_" + round + ".js";
                if (fs.existsSync(oddsFile)) {
                    continue;
                }
                var content = await Utils.getFromUrl(page, url);
                retry = 1;
                while (content == "-1") {
                    console.log(url + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
                    await page.waitForTimeout(10 * 1000 * retry);
                    content = await Utils.getFromUrl(page, url);
                }
                if (content != "" && content.indexOf("DOCTYPE") == -1) {
                    await saveOdds(content);
                    await Utils.writeToFile(content, oddsFile);
                }

                round++;
            }

            console.log(file + " 获取赔率完成 ");
            if (isFinish) {
                fs.writeFileSync(file + ".odds", Utils.formatDate(new Date()));
            }
        }
    });
})();