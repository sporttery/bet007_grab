const rp = require('request-promise');
const axios = require('axios/index');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { Base64 } = require('js-base64');
const logger = require('./Logger');
const assert = require('assert');
var request = require("request");

/**
  * 异步延迟
  * @param {number} time 延迟的时间,单位毫秒
  */
async function sleep(time = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
};

async function addCollectionButton(page) {
    await page.evaluate(() => {
        let button = document.createElement('button');
        button.setAttribute('id', '_pp_id');
        button.addEventListener('click', () => {
            window.ft2Click();
        });
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
        button.style.color = 'white';
        button.style.background = 'brown';
        button.style.outline = 'none';
        button.innerText = '采集';
        document.body.appendChild(button);
    });

}

async function disableButton(page, disable) {
    if (!disable) {
        await page.evaluate(() => {
            let button = document.getElementById('_pp_id');
            button.innerText = '抓取';
            button.style.color = 'white';
            button.style.background = 'brown';
            button.disabled = false;
        });
    } else {
        await page.evaluate(() => {
            let button = document.getElementById('_pp_id');
            button.innerText = '抓取中';
            button.style.color = '#999';
            button.style.background = '#D5D5D5';
            button.disabled = true;
        });
    }
}


async function downloadList(imgList, dir) {
    await mkdirSync(dir);
    let newArray = [];
    for (const index in imgList) {
        let img = imgList[index];
        const arg = url.parse(img);

        // const fileName = Base64.encode(arg.pathname.split('/').slice(-1)[0]) + ".jpg";
        const fileName = parseInt((parseInt(index) + 1)) + "-" + arg.pathname.split('/').slice(-1)[0];
        const filePath = path.join(dir, fileName);
        newArray[index] = filePath;
        try {
            await downloadFromUrl(img, filePath);
        } catch (e) {
            logger.info(e);
        }
    }

    logger.info('downloadList 下载完成...', newArray);
    return newArray;

}

async function downloadFile(url,filePath){
    if (url.indexOf('//') === 0) {
        url = 'http:' + url;
    }
    logger.info('下载文件:', url);
    await mkdirSync(path.dirname(filePath));
    let stream = fs.createWriteStream(filePath);
    request(url).pipe(stream).on("close", function (err) {
        logger.info("文件[" + filePath + "]下载完毕");
    });
}

async function downloadFromUrl(url, filePath) {
    if (url.indexOf('//') === 0) {
        url = 'http:' + url;
    }
    logger.info('下载文件:', url);
    await mkdirSync(path.dirname(filePath));
    const writer = fs.createWriteStream(filePath);
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    await response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        let time = setTimeout(() => {
            time = null;
            reject('time out');
        }, 3000);
        writer.on('finish', async () => {
            logger.info('保存文件完成:', url, " -> ", filePath);
            clearTimeout(time);
            return await resolve();
        });
        writer.on('error', async () => {
            logger.info('download error');
            clearTimeout(time);
            return await reject();
        });
    });
}

async function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    if (mkdirSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }
    return false;
}


async function getResourceTree(page) {
    const client = await page.target().createCDPSession();
    var resource = await client.send('Page.getResourceTree');
    return resource.frameTree;
}


async function getResourceContent(page, imgUrl) {
    const client = await page.target().createCDPSession();
    const { content, base64Encoded } = await client.send(
        'Page.getResourceContent',
        { frameId: String(page.mainFrame()._id), url: imgUrl },
    );
    assert.equal(base64Encoded, true);
    return content;
};

async function downloadFromCache(page, imgUrl, filePath) {
    logger.info('下载图片:', imgUrl);
    const content = await getResourceContent(page, imgUrl);
    const contentBuffer = Buffer.from(content, 'base64');
    fs.writeFileSync(filePath, contentBuffer, 'base64');
    logger.info('保存图片完成:', imgUrl, " -> ", filePath);
}


async function downloadListCache(page, urlList, dir) {
    await mkdirSync(dir);
    var arr = [];
    for (let i = 0; i < urlList.length; i++) {
        const imgUrl = urlList[i];
        const arg = url.parse(imgUrl);

        // const fileName = Base64.encode(arg.pathname.split('/').slice(-1)[0]) + ".jpg";
        const fileName = parseInt(parseInt(i) + 1) + "-" + arg.pathname.split('/').slice(-1)[0];

        const filePath = path.join(dir, fileName);
        arr.push(filePath);
        try {
            await downloadFromCache(page, imgUrl, filePath);
        } catch (e) {
            logger.info(e);
        }
    }
    logger.info('downloadListCache 下载完成...', arr);

}

async function writeToFile(content, file) {
    logger.info(file, path.dirname(file));
    await mkdirSync(path.dirname(file));
    logger.info("开始写入文件,写入内容：");
    logger.info(content);
    await fs.writeFileSync(file, content);
    logger.info("写入文件完成");
}

function parseNumber(str) {
    str = str + "";
    str = str.replace(/[^\d.]/g, "");
    if (str.length == 0) {
        return 0;
    }
    if (str.indexOf(".") != -1) {
        return parseFloat(str);
    } else {
        return parseInt(str);
    }
}

function formatDate(date,fmt="yyyy-MM-dd hh:mm:ss"){
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = {
    sleep,
    addCollectionButton,
    disableButton,
    mkdirSync,
    downloadList,
    downloadFromUrl,
    downloadListCache,
    parseNumber,
    formatDate,
    downloadFile,
    writeToFile
};

