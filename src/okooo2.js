const Logger = require("./Logger");


async function inject(browser, page) {
    await page.waitForSelector("#touzhulan");
    await page.evaluate(() => {
        $('head').append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/2.3/skin/layer.css"><script src="https://cdn.bootcdn.net/ajax/libs/layer/2.3/layer.js"></script>');
    });
    await page.waitFor(3000);
    await page.evaluate(hook);
}
(async () => {
    const Puppeteer = require('puppeteer');
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 966
        }
    }).then(async browser => {
        let pages = await browser.pages();
        let page = pages[0];
        await page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await page.goto("http://www.okooo.com/soccer/");
        await inject(browser, page);
        Logger.info("程序运行完毕，进入结束");
    });
})();