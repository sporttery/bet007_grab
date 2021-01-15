// const Utils = require("../src/Utils");
const Logger = require("../src/Logger");
// const Config = require("../src/Config");
const Request = require('request');
const Puppeteer = require('puppeteer');

const exec = process.argv.slice(0, 2);
let args = process.argv.splice(2);
let request = Request.defaults({ jar: true });
let checkCode = "246813579";
let headless = false;
if (args.length > 0 && args[0] == "headless") {
    headless = true;
    args = args.slice(1);
}


console.log("启动命令：" + exec.join(" "));

(async () => {

    // console.log(checkCode);

    await Puppeteer.launch({
        headless: headless,
        defaultViewport: {
            width: 1920,
            height: 966
        },
        //ignoreDefaultArgs: ["--enable-automation"]
        //  devtools:true

    }).then(async browser => {

        let pages = await browser.pages();
        let page = pages[0];
       
        await page.on('console', (msg) => {
            if (msg.text().charAt(0) == '~') {
                Logger.info(msg.text());
            } else {
                console.log('PAGE LOG:', msg.text());
            }
        });
        await page.goto("http://www.baidu.com");
        

        /*
        await browser.close();

        Logger.info("程序运行完毕，进入结束");

        await DBHelper.closePool();

        await process.exit();
        */

    });
})();