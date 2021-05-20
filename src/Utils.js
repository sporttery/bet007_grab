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


function getLeague(arr, isCup) {
    var league = {};
    league.id = arr[0];
    league.fullname_cn = arr[1];
    league.fullname_tr = arr[2];
    league.fullname_en = arr[3];
    league.type = isCup ? '1' : '2';
    if (isCup) {
        league.name_cn = arr[4];
        league.name_tr = arr[5];
        league.name_en = arr[6];
        league.color = arr[9];
        league.logo = arr[8];
        league.remark = arr[10];
    } else {
        league.name_cn = arr[7];
        league.name_tr = arr[8];
        league.name_en = arr[9];
        league.color = arr[5];
        league.logo = arr[6];
        league.remark = arr[10];
    }
    return league;
}


function getFiles(filepath){
    var fileArr=[];
    function findFile(filepath){
        let files = fs.readdirSync(filepath);
        files.forEach(function (item, index) {
            let fPath = path.join(filepath,item);
            let stat = fs.statSync(fPath);
            if(stat.isDirectory() === true && item.split("-")[0]>"2013") {//目录只要2014年之后的
                findFile(fPath);
            }
            if (stat.isFile() === true ) { 
                fileArr.push(fPath);
            }
        });
    }
    findFile(filepath);
    return fileArr;
}


async function saveFile(url, txt) {
    var filename = url.split("?")[0];
    if (filename[0] == '/') {
        filename = filename.substring(1);
    }
    if (mkdirSync(path.dirname(filename))) {
        fs.writeFileSync(filename, txt);
        console.log(filename + ",保存成功");
    }
}

async function getFile(url) {
    var filename = url.split("?")[0];
    if (filename[0] == '/') {
        filename = filename.substring(1);
    }
    if (fs.existsSync(filename)) {
        var content = fs.readFileSync(filename).toString();
        if (content.indexOf("DOCTYPE") != -1) {
            fs.unlinkSync(filename);
            return "";
        }
        console.log(url + ",成功从文件中获取");
        return content;
    } else {
        return "";
    }
}


async function getFromUrl(page, url) {
    var content = await page.evaluate((url) => {
        var content = "";
        $.ajax({
            url: url,
            type: 'get',
            async: false,
            success: function (c) {
                content = c.replace(/\w's/g, "`s");
            }, error: function (err) {
                console.log(JSON.stringify(err));
                content = "-1";
            }
        });
        return content;
    }, url);
    if (content != "") {
        console.log(url + ",成功从网络中获取");
        return content;
    }
    return "";
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
    writeToFile,
    getLeague,
    getFiles,
    getFile,
    getFromUrl,
    saveFile
};

