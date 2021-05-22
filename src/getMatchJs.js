const Utils = require("./Utils")
const Logger = require("./Logger")
const Config = require("./Config")
const Puppeteer = require('puppeteer');

var g_browser, g_url_idx = 0;

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
        //ignoreDefaultArgs: ["--enable-automation"]
        devtools: true

    }).then(async browser => {
        g_browser = browser;
        let pages = await browser.pages();
        let page = pages[0];

        // await page.setRequestInterception(true);
        // page.on('request', interceptedRequest => {
        //     let currentUrl = interceptedRequest.url();
        //     let fileName = currentUrl.split("/").pop().split("?")[0];
        //     if (fileName.indexOf(";base64") != -1) {
        //         interceptedRequest.continue();//弹出
        //         return;
        //     }
        //     // console.log("准备拦截检查。。。。" );
        //     //判断如果是 图片请求  就直接拦截  
        //     if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.ico') 
        //     || fileName.endsWith('.jpeg') || fileName.endsWith('.gif') || fileName.endsWith('.bmp')) {
        //         // console.log("确认拦截1：" + fileName);
        //         interceptedRequest.abort();   //终止请求
        //     } else if (fileName.endsWith(".css")) {
        //         // console.log("确认拦截2：" + fileName);
        //         interceptedRequest.abort();   //终止请求
        //     } else if (fileName.endsWith(".php")) {
        //         // console.log("确认拦截3：" + fileName);
        //         interceptedRequest.abort();   //终止请求
        //     }           
        //     else {
        //         // console.log("不满足条件，不拦截2" + fileName);
        //         interceptedRequest.continue();//弹出
        //     }
        // });

        await page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        /*await page.on('response', async (response) => {
            let resourceType = response.request().resourceType();
            let url = response.url();
            let text = response.text();
            let json = response.json();
            if (resourceType == "script") {
                console.log(url, text);
            } else if (resourceType == "document") {
                console.log(url, text);
            } else if (resourceType == "xhr") {
                console.log(url, json);
            }
        });
        */

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

        await loadJsDataByUrl(page);
    });
})();
var jsDataReg = /"\/jsData\/.*?"/g;
var jh = {};
//返回html里jsData的脚本src
function getJsDataUrl(d) {
    var startIdx = d.indexOf("var selectSeason");
    var cc = d.substring(startIdx);
    var endIdx = cc.indexOf("</script>");
    cc = cc.substring(0, endIdx);
    eval(cc);
    var src = d.match(jsDataReg);
    if (src && src.length == 4) {
        return src.slice(2);
    }
    console.log("出错了，获取到的数据不对");
    console.log(src);
    exit();
    return [];
}
async function loadJsDataByUrl(page) {
    var urlObj = Config.urls[g_url_idx++];
    if (urlObj) {
        console.log("准备抓取[ " + urlObj.name + " ],地址：" + urlObj.url);
        urlObj.start = new Date();
        var d = await Utils.getFromUrl(page, urlObj.url);
        retry = 1;
        while (d == "-1") {
            console.log(urlObj.url + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
            await page.waitFor(10 * 1000 * retry);
            d = await Utils.getFromUrl(page, urlObj.url);
        }
        if (d != "") {
            var jsDataUrls = getJsDataUrl(d);
            var seajs = jsDataUrls[1].replace(/"/g, "");
            var matchjs = jsDataUrls[0].replace(/"/g, "");
            urlObj.seajs = seajs;
            urlObj.matchjs = matchjs;
        }

        if (urlObj.seajs && urlObj.matchjs) {
            // var seaContent = await Utils.getFile(urlObj.seajs);
            // var matchContent = await Utils.getFile(urlObj.matchjs);
            //头两个文件，每次都抓取最新的
            var seaContent ,matchContent;
            // if (seaContent == "") {
                seaContent = await Utils.getFromUrl(page, urlObj.seajs);
                retry = 1;
                while (seaContent == "-1") {
                    console.log(urlObj.seajs + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
                    await page.waitFor(10 * 1000 * retry);
                    seaContent = await Utils.getFromUrl(page, urlObj.seajs);
                }
                if (seaContent != "") {
                    await Utils.saveFile(urlObj.seajs, seaContent);
                }
            // }
            // if (matchContent == "") {
                matchContent = await Utils.getFromUrl(page, urlObj.matchjs);
                retry = 1;
                while (matchContent == "-1") {
                    console.log(urlObj.matchjs + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
                    await page.waitFor(10 * 1000 * retry);
                    matchContent = await Utils.getFromUrl(page, urlObj.matchjs);
                }
                if (matchContent != "") {
                    await Utils.saveFile(urlObj.matchjs, matchContent);
                }
            // }
            urlObj.seaContent = seaContent;
            urlObj.matchContent = matchContent;
        }
        if (urlObj.seaContent != "" && urlObj.matchContent != "") {
            delete arrSeason;
            delete arrLeague;
            delete arrCup;
            delete arrSubLeague;
            eval(urlObj.seaContent);
            eval(urlObj.matchContent);
            var isCup = typeof arrCup != "undefined";
            var league = Utils.getLeague(isCup ? arrCup : arrLeague, isCup);
            var allJsUrl = {};
            allJsUrl[urlObj.matchjs.split("?")[0]] = urlObj.matchjs;
            var season;
            for (var i = 0; i < arrSeason.length && i <= 6; i++) {
                season = arrSeason[i];
                if(season.split("-")[0]  < Config.maxSeason){
                    continue;
                }
                var seasonMatchUrl;
                if (isCup) {
                    seasonMatchUrl = "/jsData/matchResult/" + season + "/c" + league.id + ".js"
                } else {
                    if (typeof arrSubLeague != "undefined") {
                        for (var j = 0; j < arrSubLeague.length; j++) {
                            var subId = arrSubLeague[j][0];
                            seasonMatchUrl = "/jsData/matchResult/" + season + "/s" + league.id + "_" + subId + ".js"
                            if (!allJsUrl[seasonMatchUrl]) {
                                allJsUrl[seasonMatchUrl] = seasonMatchUrl;
                            }
                        }
                    } else {
                        seasonMatchUrl = "/jsData/matchResult/" + season + "/s" + league.id + ".js"
                    }
                }
                if (!allJsUrl[seasonMatchUrl]) {
                    allJsUrl[seasonMatchUrl] = seasonMatchUrl;
                }
            }
            urlObj.allJsUrl = allJsUrl;
            var arr = Object.keys(urlObj.allJsUrl);
            var arrLen = arr.length;
            for (var j = 0; j < arrLen; j++) {
                var c_url = arr[j];
                var content = await Utils.getFile(c_url);
                if (content == "") {
                    content = await Utils.getFromUrl(page, c_url);
                    retry = 1;
                    while (content == "-1") {
                        console.log(c_url + "返回错误的数据，" + (10 * retry) + "秒后重试第" + retry + "次");
                        await page.waitFor(10 * 1000 * retry);
                        content = await Utils.getFromUrl(page, c_url);
                    }
                    if (content != "" && content.indexOf("DOCTYPE") == -1) {
                        Utils.saveFile(c_url, content);
                    }
                }
                if (content != "" && content.indexOf("DOCTYPE") == -1) {
                    delete arrLeague;
                    delete arrCup;
                    delete arrSubLeague;
                    eval(content);
                    if (!isCup && typeof arrSubLeague != "undefined") {
                        for (var k = 0; k < arrSubLeague.length; k++) {
                            var subId = arrSubLeague[k][0];
                            seasonMatchUrl = "/jsData/matchResult/" + season + "/s" + league.id + "_" + subId + ".js"
                            if (!allJsUrl[seasonMatchUrl]) {
                                allJsUrl[seasonMatchUrl] = seasonMatchUrl;
                                arr.push(seasonMatchUrl);
                                arrLen++;
                            }
                        }
                    }
                }
            }
            urlObj.finish = new Date();
        }


        if (urlObj.finish) {
            var ms = (urlObj.finish.getTime() - urlObj.start.getTime());
            console.log("准备抓取[ " + urlObj.name + " ] 完成，开始于" + urlObj.start + ",结束于" + urlObj.finish + ",共耗时 " + ms + " 毫秒");
            await page.waitFor(500);
            loadJsDataByUrl(page);
        } else {
            g_url_idx--;
            await page.waitFor(1000);
            loadJsDataByUrl(page);
        }
    } else {
        console.log("程序运行完毕");
        exit();
    }
}

async function exit() {
    await g_browser.close();

    Logger.info("程序运行完毕，进入结束");

    await process.exit();
}