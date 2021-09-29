const Puppeteer = require('puppeteer');
const Logger = require("./Logger");
const fs = require("fs");
const os = require('os');
const path = require('path');
const exeDir = __dirname;
const exeFile = process.argv[1];
(async () => {
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1440,
            height: 900
        },
        args: ["--no-sandbox", "--disable-setuid-sandbox","--incognito","--start-maximized"],
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

        await page.setRequestInterception(true);
        await page.on('request', interceptedRequest => {
            let currentUrl = interceptedRequest.url();
            if (currentUrl.endsWith("/storeservices/cart/inventory")) {
                console.info("开始调用库存接口");
                interceptedRequest.continue();
                // interceptedRequest.continue({postData:JSON.stringify(searchItems)});
            } else {
                interceptedRequest.continue();
            }
        });
        await page.on('response', async (response) => {
            let url = response.url();
            if (url.endsWith("/storeservices/cart/inventory")) {
                let code = response.status();
                if (code != 200) {
                    await page.evaluate(()=>{
                        window.Forbidden=true;
                    });
                    console.info(await response.text());
                }else{
                    console.info("库存结果返回");
                    let json = await response.json();
                }
            }

        });
        await page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        Logger.info("正在打开浏览器，进入快速加购物车页面");
        await page.goto("https://www.ti.com.cn/zh-cn/ordering-resources/buying-tools/quick-add-to-cart.html");


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
        var searchItems = searchItems1.concat(
            searchItems2,
            searchItems3,
            searchItems4,
            searchItems5
        );



        function sleep(ms) {
            console.info("等待" + ms + "ms");
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        async function clickXy(x, y) {
            await page.mouse.move(x,y);
            await page.mouse.click(x, y);
            await sleep(100);
        }

        await page.exposeFunction("clickXy", clickXy);
        await page.exposeFunction("sleep", sleep);
        await page.waitForSelector("ti-drag-and-drop");
        await page.evaluate((searchItems) => {

            function randomRectEle(ele) {
                if (ele) {
                    var rect = ele.getBoundingClientRect();
                    if (rect.top < 0 || rect.top > document.documentElement.clientHeight) {
                        document.documentElement.scrollTop += (rect.top - rect.height);
                        rect = ele.getBoundingClientRect();
                    } 
                    var y = rect.y + rect.height / 2;
                    var x = rect.x + rect.width / 2;
                    return { x, y }
                }
                return { x: 0, y: 0 }
            }

            async function eleClick(ele) {
                if (ele.disabled) {
                    ele.disabled = false;
                }
                var removeList = [];
                for (var i = 0; i < ele.classList.length; i++) {
                    if (ele.classList[i].indexOf("disabled") != -1) {
                        removeList.push(ele.classList[i]);
                    }
                }
                if (ele.tagName == "A" && ele.target && ele.target != "_blank") {
                    ele.target = "_blank";
                }
                for (var i = 0; i < removeList.length; i++) {
                    ele.classList.remove(removeList[i]);
                }
                var rect = randomRectEle(ele);
                await clickXy(rect.x, rect.y);
            }
            async function changeTiSelect() {
                var tiSelects = document.querySelectorAll("ti-select");
                if (tiSelects && tiSelects.length == 3) {
                    for (var i = 0; i < tiSelects.length; i++) {
                        // tiSelects[i].click();
                        await eleClick(tiSelects[i]);
                        await sleep(300);
                        var select = tiSelects[i].shadowRoot.querySelector("select");
                        while (!select) {
                            console.info("no Select");
                            select = tiSelects[i].shadowRoot.querySelector("select");
                            await sleep(300);
                        }
                        select.selectedIndex = i + 1;
                        var tiChange = new InputEvent("tiChange");
                        tiChange.initEvent("change");
                        select.dispatchEvent(tiChange);
                        await sleep(100);
                    }
                }
            }

            var searchItemIdx = 0;
            var inventoryCount = 0;
            async function quickAddToCartByFile() {
                if (typeof searchItems == "undefined") {
                    console.info("没有设置商品");
                    return;
                }
                var fileContent = [];
                while (fileContent.length < 30) {
                    if (searchItemIdx == searchItems.length) {
                        searchItemIdx = 0;
                    }
                    var item = searchItems[searchItemIdx++];
                    fileContent[fileContent.length] = item + "," + item + "," + Math.floor(Math.random() * 100);
                }

                var removeRowButton = document.querySelector(".ti-quick-add-to-cart-worksheet-remove-bom ti-button");
                if (removeRowButton) { //删除原来的文件
                    await eleClick(removeRowButton);
                    await sleep(800);
                    if (document.querySelector(".ti-dialog-visible") && document.querySelector(".ti-dialog-visible").querySelector("ti-button")) {
                        await eleClick(document.querySelector(".ti-dialog-visible").querySelector("ti-button"));
                    }
                    await sleep(800);
                }
                if (!document.querySelector("ti-drag-and-drop")) {
                    console.info("ti-drag-and-drop is null");
                    setTimeout(quickAddToCartByFile, 800);
                    return;
                }
                inventoryCount++;
                console.info("第" + inventoryCount + "次批量获取库存");
                document.querySelector("ti-drag-and-drop").dispatchEvent(new CustomEvent("tiFileUploaded", {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: new File([fileContent.join("\n")], "Quick add to cart template.csv", { type: "application/vnd.ms-excel" })
                }));
                await sleep(800);

                await changeTiSelect();
                var actionButton = document.querySelector(".ti-quick-add-to-cart-worksheet-actions ti-button");
                await sleep(500);
                while (!actionButton || actionButton.classList.contains("ti-button-disabled")) {
                    console.info("no actionButton or actionButton disabled");
                    await changeTiSelect();
                    await sleep(500);
                    actionButton = document.querySelector(".ti-quick-add-to-cart-worksheet-actions ti-button");
                }
                await eleClick(actionButton);

                await sleep(1500);
                while (true) {
                    var tr = document.querySelector(".ti-quick-add-to-cart-worksheet-table tbody tr");
                    if (tr && tr.querySelectorAll("td").length > 4) {
                        break;
                    }
                    console.info("td length < 4 ");
                    if(window.Forbidden){
                        return;
                    }
                    
                    await sleep(1000);
                }

                if (document.querySelector(".ti-quick-add-to-cart-worksheet-actions ti-button").classList.contains('ti-button-disabled')) {
                    if (document.querySelectorAll(".ti-quick-add-to-cart-error").length == 30) {
                        console.info("均无库存1");
                        setTimeout(quickAddToCartByFile, 1000);
                        return;
                    }

                    var errBtn = document.querySelectorAll(".ti-quick-add-to-cart-worksheet-start-row ti-button")[1];
                    // errBtn.click();//清除报错的内容
                    await eleClick(errBtn);
                    await sleep(1000);
                    trs = document.querySelectorAll(".ti-quick-add-to-cart-worksheet-table tbody tr");
                    var items = [];
                    for (var i = 0; i < trs.length; i++) {
                        var tds = trs[i].querySelectorAll("td");
                        var orderable_number = tds[1].textContent;
                        var quantity = tds[4].textContent;
                        if (orderable_number == '' || quantity == '') {
                            break;
                        }
                        items.push({ orderable_number, quantity });
                    }
                    if (items.length == 0) {
                        console.info("均无库存2");
                        setTimeout(quickAddToCartByFile, 1000);
                        return;
                    }
                    // console.info(items);

                    var gpnResult = items[0];
                    gpnResult.inventory = gpnResult.quantity;
                    gpnResult.opn = gpnResult.orderable_number;
                    if (typeof orderByGpn != "undefined") {
                        orderByGpn(JSON.stringify(gpnResult));
                    } else {
                        document.write("查到库存1，" + JSON.stringify(items));
                    }

                } else {
                    trs = document.querySelectorAll(".ti-quick-add-to-cart-worksheet-table tbody tr");
                    var items = [];
                    for (var i = 0; i < trs.length; i++) {
                        var tds = trs[i].querySelectorAll("td");
                        var orderable_number = tds[1].textContent;
                        var quantity = tds[4].textContent;
                        if (orderable_number == '' || quantity == '') {
                            break;
                        }
                        items.push({ orderable_number, quantity });
                    }
                    if (items.length == 0) {
                        console.info("均无库存3");
                        setTimeout(quickAddToCartByFile, 1000);
                        return;
                    }
                    // console.info(items);
                    var gpnResult = items[0];
                    gpnResult.inventory = gpnResult.quantity;
                    gpnResult.opn = gpnResult.orderable_number;
                    if (typeof orderByGpn != "undefined") {
                        orderByGpn(JSON.stringify(gpnResult));
                    } else {
                        document.write("查到库存2，" + JSON.stringify(items));
                    }
                }
            }
            quickAddToCartByFile();
        }, searchItems);
    });
})();