const Puppeteer = require("puppeteer");
const Logger = require("./Logger");
const Redis = require("redis");
// const fs = require("fs");
// const os = require("os");
// const path = require("path");
const requestSync = require("request");
// const util = require('util');
// const child_process = require('child_process');

function syncRequest(url, params) {
    let options = {
        url: url,
        form: params
    };
    return new Promise(function (resolve, reject) {
        requestSync.get(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}
async function syncBody(url) {
    let body = await syncRequest(url);
    return JSON.parse(body);
}
let inventoryCount = 0;
let proxyIpCount = 0;
let searchItems = [];
const inventoryUrl = "/storeservices/cart/inventory";
const headless = false;
let client = Redis.createClient(6379, "127.0.0.1");
client.on('connect', function () {
    Logger.log('Redis connected.')
});

async function redisHGet(key, filed) {
    let data = await new Promise((resolve) => {
        client.hget(key, filed, function (err, res) {
            return resolve(res);
        });
    });
    return data;
};

async function redisHSet(key, filed, value) {
    let data = await new Promise((resolve) => {
        client.hset(key, filed, value, function (err, res) {
            if (err) {
                Logger.error(err);
                return null;
            } else {
                return resolve(res);
            }
        });
    });
    return data;
};


async function redisGet(key) {
    let data = await new Promise((resolve) => {
        client.get(key, function (err, res) {
            return resolve(res);
        });
    });
    return data;
};

async function redisSet(key, value) {
    let data = await new Promise((resolve) => {
        client.set(key, value, function (err, res) {
            if (err) {
                Logger.error(err);
                return null;
            } else {
                return resolve(res);
            }
        });
    });
    return data;
};

async function findInventory(opn) {
    let quantity = await redisHGet("inventory", opn.orderable_number);
    if (quantity == null || quantity == 0) {
        await redisHSet("inventory", opn.orderable_number, opn.quantity);
    } else {
        searchItems = searchItems.filter(item => item != opn.orderable_number);
    }
}



function sleep(ms) {
    Logger.info("等待" + ms + "ms");
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function checkInventory(page) {
    inventoryCount++;
    Logger.info("第" + inventoryCount + "次批量获取库存");
    await page.click("ti-input", { delay: 30 });
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await page.keyboard.press('Backspace');
    let item = searchItems[Math.floor(Math.random() * searchItems.length)];
    await page.type("ti-input", item, { delay: 80 });
    // child_process.spawn('clip').stdin.end(util.inspect(item));
    // await page.keyboard.down("Control");
    // await page.keyboard.press("KeyV");
    // await page.keyboard.up("Control");
    // await sleep(80);
    await page.click("ti-quick-add-to-cart h2");
    try {
        await page.waitForResponse(response => response.url().indexOf(inventoryUrl) != -1);
    } catch (error) {
        Logger.error("响应超时，重新开始");
        await page.browser().close();
        await start();
    }

}
async function start() {
    if (searchItems.length == 0) {
        Logger.info("初使化商品清单");
        let _searchItems = await redisGet("searchItems");
        if (_searchItems == null || _searchItems.length == 0) {
            var searchItems1 =
                "LMZ31710RVQT LMZ31710RVQR TPS548D22RVFR DP83867IRPAPR LMZ31704RVQT LMZ31704RVQR TPS53355DQPR TPS53353DQPR BQ40Z50RSMR-R1 BQ40Z50RSMT-R1 BQ40Z50RSMT-R2 BQ40Z50RSMR-R2 TPS54560BQDDARQ1 DP83848IVVX/NOPB UCC28950PW UCC28950PWR ISO1050DWR TPS40140RHHR TPS65217CRSLT TPS65217CRSLR BQ76952PFBR BQ7695203PFBR TPS65994ADYBGR TAS5731MPHPR AMC1200BDWVR TPS65910A3A1RSLR TPS65910AA1RSLR BQ28Z610DRZR TPS65218B1RSLR LMZ21701SILR".split(
                    " "
                );
            var searchItems2 =
                "TLV320AIC3106IRGZR TLV320AIC3100IRHBR LMZ20502SILR TPS65251RHAR TLV320AIC3104IRHBR TPS24750RUVR TPS51487XRJER TPS56C215RNNR TPS54340BDDAR TPS7A4501KTTR TPS7A4501DCQR TPS82130SILR TPS54310PWPR TPS61175PWPR BQ24195RGER UCC2803QDRQ1 TPS259827ONRGER TPS61030RSAR TPS63020DSJR ADS7924IRTER TPS2590RSAR TPA3118D2DAPR TPS61089RNRR TPS65261RHBR TPS63806YFFR TPS65131RGER LM25011MY/NOPB TPA3116D2DADR TPS26600PWPR TPS63070RNMR TPS630702RNMR TPS630701RNMR INA193AIDBVR TPS23753APWR DP83822IRHBR OPT3001DNPR TPS54140DGQR OPA333AIDCKR TPS63030DSKR PS62130AQRGTRQ1 TPS63060DSCR TPS63805YFFR TPS54320RHLR TPS54061DRBR TPS63001DRCR INA219AIDCNR TUSB522PRGER TPS54336ADDAR DP83848CVVX/NOPB".split(
                    " "
                );
            var searchItems3 =
                "TPS63700DRCR TPA3112D1PWPR UCC27211DRMR ISO7721DR UCC27211DDAR TPS62085RLTR TPS61170DRVR BQ24295RGER TPS25942LRVCR TPS25940ARVCR TPS25944LRVCR LM317AEMP/NOPB TPS621361RGXR TPS54225PWPR TPS62130ARGTR TPS62130RGTR TPS62150ARGTR TPS62745DSSR TPS62261TDRVRQ1 LP5024RSMR TPS62088YFPR TPS51285BRUKR TPS61099YFFR TPS259240DRCR TPS259271DRCR TPS259241DRCR DRV8835DSSR TPA2013D1RGPR TPS25810RVCR TPS73701DRBR".split(
                    " "
                );
            var searchItems4 =
                "TS3DV642A0RUAR TPS92515HVQDGQRQ1 TPS54428DDAR TPA3136D2PWPR TPS62742DSSR TPS563219ADDFR TPS610981DSER BQ24092DGQR TPS51916RUKR UCC27524DGNR UCC28180DR TPS62237DRYR UCC27524ADR TPS62172DSGR BQ24090DGQR TPS259260DRCR TPS2544RTER TPS2557DRBR TPS73101DBVR TPS2561DRCR TPS2560DRCR".split(
                    " "
                );
            var searchItems5 =
                "TPS560430XFDBVR TPS560430XDBVR TS3USB3031RMGR TS3USB3031RMGR TPS61046YFFR TPS62122DRVR BQ24040DSQR TPS2547RTER TPS564208DDCR UCC27511AQDBVRQ1 TLV62565DBVR UCC27511DBVR TPS25200DRVR TPS563208DDCR TPS2553DRVR TPS51200DRCR TPS259571DSGR TPS259520DSGR TPS259530DSGR TPS27081ADDCR TPS2553DDBVR TPS25221DRVR".split(
                    " "
                );
            searchItems = searchItems1.concat(
                searchItems2,
                searchItems3,
                searchItems4,
                searchItems5
            );
            Logger.info("默认商品清单：共" + searchItems.length + "个");
        } else {
            var array = _searchItems.split(/[,\s]/g);
            array.forEach(ele => {
                if (ele.trim().length != 0) {
                    searchItems.push(ele.trim());
                }
            });
            Logger.info("读取设置商品清单：共" + searchItems.length + "个");
        }
    }
    proxyIpCount++;
    Logger.info("第" + proxyIpCount + "次启动，获取代理IP");
    let proxyIp = await syncBody("http://api.tianqiip.com/getip?secret=bii16nmechl8l9uo&type=json&num=1&time=3&port=3");
    if (proxyIp.code == 1010) {
        //{"code":1010,"msg":"当前IP(1.13.183.154)不在白名单内，请先设置IP白名单或联系客户经理"}
        var myIp = proxyIp.msg.split(/[()]/)[1];
        await syncBody("http://api.tianqiip.com/white/add?key=tianyu1&brand=2&sign=7629d62e3611056b3d0d7894b195b3ea&ip=" + myIp);
        proxyIp = await syncBody("http://api.tianqiip.com/getip?secret=bii16nmechl8l9uo&type=json&num=1&time=3&port=3");
    }
    Logger.info(JSON.stringify(proxyIp));

    await Puppeteer.launch({
        headless: headless,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        defaultViewport: {
            width: 1440,
            height: 900,
        },
        args: [
            //     "--no-sandbox",
            //     "--disable-setuid-sandbox",
            "--incognito",
            "--proxy-server=socks5://" + proxyIp.data[0].ip + ":" + proxyIp.data[0].port,
            "--start-maximized",
        ],
        // ignoreDefaultArgs: ['--enable-automation'],
        ignoreHTTPSErrors: true,
        // devtools: true
    }).then(async (browser) => {
        let pages = await browser.pages();
        let page = pages[0];

        await page.setRequestInterception(true);
        await page.on("request", async (interceptedRequest) => {
            let currentUrl = interceptedRequest.url();
            if (currentUrl.indexOf(".facebook.") != -1) {
                await interceptedRequest.abort();
            } else
                if (currentUrl.endsWith("/storeservices/cart/inventory")) {
                    Logger.info("开始调用库存接口,注入所有商品 " + searchItems.length);
                    // interceptedRequest.continue();
                    await interceptedRequest.continue({ postData: JSON.stringify(searchItems) });
                } else {
                    await interceptedRequest.continue();
                }
        });
        await page.on("response", async (response) => {
            let url = response.url();
            if (url.endsWith("/storeservices/cart/inventory")) {
                let code = response.status();
                if (code != 200) {
                    var txt = await response.text();
                    if (txt.indexOf("Access Denied") != -1) {
                        Logger.info("Access Denied");
                    } else {
                        Logger.info(txt);
                    }
                    await browser.close();
                    await start();
                } else {
                    try {
                        let json = await response.json();
                        Logger.info("库存获取结果返回商品个数：" + json.opn_list.length);
                        if (json.opn_list.length != searchItems.length) {
                            let opns = json.opn_list.map(item => item.orderable_number);
                            let errorItems = searchItems.filter(item => opns.indexOf(item) == -1);
                            Logger.info("错误的商品编号：" + errorItems.join(",") + ",暂时过滤掉先");
                            searchItems = opns;
                        }
                        // {orderable_number: "TPS54428DDAR", quantity: 0, purchase_flag: "Y"}
                        let opn_list = json.opn_list.filter(item => item.quantity > 0 && item.purchase_flag == 'Y');
                        if (opn_list.length > 0) {
                            Logger.info("找到库存了：" + JSON.stringify(opn_list));
                            opn_list.forEach(opn => {
                                findInventory(opn);
                            });
                        } else {
                            Logger.info("商品均无没有库存")
                            await checkInventory(page);
                        }
                    } catch (error) {
                        Logger.error(error);
                        await browser.close();
                        await start();
                    }
                }
            }
        });
        await page.on("Logger", (msg) => Logger.log("PAGE LOG:", msg.text()));
        Logger.info("正在打开浏览器，进入快速加购物车页面");
        await page.exposeFunction("sleep", sleep);
        try {
            await page.goto(
                "https://www.ti.com.cn/zh-cn/ordering-resources/buying-tools/quick-add-to-cart.html"
            );
            await sleep(3000);
            await page.waitForSelector("ti-input");
            await checkInventory(page);
        } catch (error) {
            Logger.error(error);
            await browser.close();
            await start();
        }

    });
}
start();
