const Utils = require("./Utils")
const Logger = require("./Logger")
const DBHelper = require("./DBHelper")
const Config = require("./Config")


function loadDataByLeagueId(id){
    console.log(id,jQuery);
}


(async () => {
    let urls = Config.urls;
    // Logger.info(urls);
    Logger.info("程序开始运行");
    const Puppeteer = require('puppeteer');
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 966
        },
        //ignoreDefaultArgs: ["--enable-automation"]
         devtools:true

    }).then(async browser => {

        let pages = await browser.pages();
        let page = pages[0];
        
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            let currentUrl = interceptedRequest.url();
            let fileName = currentUrl.split("/").pop().split("?")[0];
            if (fileName.indexOf(";base64") != -1) {
                interceptedRequest.continue();//弹出
                return;
            }
            // console.log("准备拦截检查。。。。" );
            //判断如果是 图片请求  就直接拦截  
            if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.ico') 
            || fileName.endsWith('.jpeg') || fileName.endsWith('.gif') || fileName.endsWith('.bmp')) {
                // console.log("确认拦截1：" + fileName);
                interceptedRequest.abort();   //终止请求
            } else if (fileName.endsWith(".css")) {
                // console.log("确认拦截2：" + fileName);
                interceptedRequest.abort();   //终止请求
            } else if (fileName.endsWith(".php")) {
                // console.log("确认拦截3：" + fileName);
                interceptedRequest.abort();   //终止请求
            }           
            else {
                // console.log("不满足条件，不拦截2" + fileName);
                interceptedRequest.continue();//弹出
            }
        });
        
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


        await page.exposeFunction("loadDataByLeagueId",loadDataByLeagueId);

        await page.goto("http://zq.win007.com/");


        
        while (i < urls.length) {
            let urlObj = urls[i++];
            Logger.info("准备抓取[ " + urlObj.name + " ],地址：" + urlObj.url);
            await page.evaluate((id)=>{
                loadDataByLeagueId(id);
            },urlObj.id);
        }

      
        await browser.close();

        Logger.info("程序运行完毕，进入结束");

        await DBHelper.closePool();

        await process.exit();

    });
})();
