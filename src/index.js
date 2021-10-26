const Puppeteer = require('puppeteer');
const Logger = require("./Logger");
const DBHelper = require("./DBHelper")
const fs = require("fs");
const os = require('os');
const path = require('path');
const config = require("./Config");
const exeDir = __dirname;
const exeFile = process.argv[1];


async function addCollectionButton(page, options) {
    if (!options) {
        options = {};
    }

    let first = await page.evaluate(options => {
        let first = 0;
        let button = document.getElementById('_pp_id');
        if (button == null) {
            first = 1;
            button = document.createElement('button');
            button.setAttribute('id', '_pp_id');
            button.addEventListener('click', () => {
                if (btnCollect.style.color == "red") {
                    window.running = false;
                } else {
                    window.ft2Click();
                    window.running = true;
                }
            });
            document.body.appendChild(button);
            button.style.position = 'fixed';
            button.style.left = '30px';
            button.style.top = '100px';
            button.style.zIndex = '100000000';
            button.style.borderRadius = '50%';
            button.style.border = 'none';
            button.style.height = '80px';
            button.style.width = '80px';
            button.style.cursor = 'pointer';
            button.style.lineHeight = '80px';
            button.style.outline = 'none';
            button.style.fontWeight = 'bold';
            button.style.fontSize = '21px';
            window.btnCollect = button;
        }

        button.style.color = options.color || 'white';
        button.style.background = options.background || 'red';
        button.innerText = options.text || '采集';
        return first;
    }, options);
    if (first == 1) {
        // await addTaobaoLogo(page);
    }
}



(async () => {
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1440,
            height: 900
        },
        args: ["--no-sandbox", "--disable-setuid-sandbox", '--disable-web-security'],
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

        await page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        Logger.info("正在打开浏览器，进入球探主页");
        await page.goto("file://"+__dirname+"/index.html");
        
        browser.on("disconnected",()=>{
            process.exit();
        })
    });
})();