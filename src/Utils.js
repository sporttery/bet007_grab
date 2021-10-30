const rp = require('request-promise');
const axios = require('axios/index');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { Base64 } = require('js-base64');
const logger = require('./Logger');
const assert = require('assert');
var request = require("request");
const Config = require('./Config');
var child_process = require("child_process");

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

async function downloadFile(url, filePath) {
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
        writer.on('finish', () => {
            logger.info('保存文件完成:', url, " -> ", filePath);
            clearTimeout(time);
            return resolve();
        });
        writer.on('error', () => {
            logger.info('download error');
            clearTimeout(time);
            return reject();
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

function formatDate(date, fmt = "yyyy-MM-dd hh:mm:ss") {
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

function safeHtml(d) {
    return d.replace(/[\r\n]/g, "").replace(/<head.+?<\/head>/g, "").replace(/<script.+?<\/script>/g, "").replace(/<img.+?>/g, "").replace(/<link.+?>/g, "").replace(/<style.+?<\/style>/g, "");
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
    } else {
        if (arr.length == 13) {
            league.name_cn = arr[9];
            league.name_tr = arr[10];
            league.name_en = arr[11];
        } else {
            league.name_cn = arr[7];
            league.name_tr = arr[8];
            league.name_en = arr[9];
        }
        league.color = arr[5];
        league.logo = arr[6];
    }
    league.remark = arr[arr.length - 1];
    return league;
}

function getMatchData(jh, selectSeason, isCup, g_roundNameMap, g_teamNameMap, g_leagueNameMap) {
    var matchData = {};
    for (var key in jh) {
        if (key[0] != "G" && key[0] != "R") {
            continue;
        }
        var matchArr = jh[key];
        var league_type = 2;
        var round = 0;
        if (!isCup) {
            league_type = 1;
            round = key.split("_")[1];
        } else {
            round = g_roundNameMap[key];
            var nArr = [];
            matchArr.forEach(m => {
                if (typeof m[4] == "object") {
                    nArr.push(m[4]);
                    nArr.push(m[5]);
                } else {
                    nArr.push(m);
                }
            });
            matchArr = nArr;
        }

        matchArr.forEach(m => {
            var match = {};
            if (typeof m == "object" && m.length && m.length > 8) {
                match.id = m[0];
                match.playtime = m[3];
                match.homeId = m[4];
                match.awayId = m[5];
                match.homeName = g_teamNameMap["_" + match.homeId] || "";
                match.awayName = g_teamNameMap["_" + match.awayId] || "";
                match.fullscore = m[6] || "";
                match.halfscore = m[7] || "";
                match.homeRank = m[8];
                match.awayRank = m[9];
                match.status = m[2];// -1 比赛结束 0 比赛未开始 -10 比赛取消 -14 比赛推迟
                match.leagueId = m[1];
                match.leagueName = g_leagueNameMap["_" + match.leagueId];
                match.leagueType = league_type;
                match.season = selectSeason;
                match.round = round;
                // console.log(match);
                if (isNaN(match.playtime)) {
                    let scores = match.fullscore.split(/[:-]/g);
                    if (scores.length == 2) {
                        h_score = scores[0];
                        a_score = scores[1];
                        if (h_score > a_score) {
                            match.result = "胜";
                        } else if (h_score < a_score) {
                            match.result = '负';
                        } else {
                            match.result = "平";
                        }
                    } else {
                        if (match.fullscore.indexOf("取消") != -1) {
                            match.result = "取消";
                            match.halfscore = "取消";
                            match.fullscore = "取消";
                        } else if (match.fullscore.indexOf("推迟") != -1) {
                            match.result = "推迟";
                            match.halfscore = "推迟";
                            match.fullscore = "推迟";
                        } else {
                            match.result = "";
                        }
                    }
                    matchData[match.id] = match;
                }
            }
        });
    }
    return matchData;
}

function getFiles(filepath) {
    var fileArr = [];
    function findFile(filepath) {
        let files = fs.readdirSync(filepath);
        files.forEach(function (item, index) {
            let fPath = path.join(filepath, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory() === true && item.split("-")[0] >= Config.maxSeason) {//目录只要2018年之后的
                findFile(fPath);
            }
            if (stat.isFile() === true && item.indexOf(".finished") == -1) {
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

async function getByCurl(curl, chk, retry) {
    if (chk) {
        if (!retry) {
            retry = 5;
        }
        var count = 1;
        do {
            var body = child_process.execSync(curl).toString("utf-8");
            if (chk(body)) {
                return body;
            }
            if(count<retry){
                var sleepMs = count * 1200;
                console.info("第" + count + "次获取数据失败，暂停" + (sleepMs) + "ms后再次尝试");
                await sleep(sleepMs);
            }
        } while (count++ < retry);
        return null;
    } else {
        return child_process.execSync(curl).toString("utf-8");
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

const myProxyConfig = [{ ip: "175.27.160.71", port: 3389 },
{ ip: "1.13.179.183", port: 3389 },
{ ip: "1.13.20.33", port: 3389 },
{ ip: "1.13.188.135", port: 3389 },
{ ip: "1.13.172.37", port: 3389 },
{ ip: "1.13.180.73", port: 3389 }];
var myProxyIdx = 0;
var proxyFromApi = true;
const tianqiApi="http://api.tianqiip.com/getip?secret=xwtey386lnwk3ovi&type=json&num=1&time=3&port=3";
async function getProxy(num) {
    if (!num) {
        num = 1;
    }
    let proxyIp;
    if (proxyFromApi) {
        var curl = "curl -s \""+tianqiApi+"\"";
        proxyIp = JSON.parse(await getByCurl(curl));
        if (proxyIp.code != 1000) {
            if (proxyIp.code == 1010) {
                //{"code":1010,"msg":"当前IP(1.13.183.154)不在白名单内，请先设置IP白名单或联系客户经理"}
                var myIp = proxyIp.msg.split(/[()]/)[1];
                await getByCurl("curl -s \"http://api.tianqiip.com/white/add?key=Lewis&brand=2&sign=4262ed4718940d6481af115b480bc8fe&ip=" + myIp+"\"");
                proxyIp = JSON.parse(await getByCurl(curl));
            } else {
                console.error(proxyIp.msg)
                proxyFromApi = false;
                return getProxy(num);
            }
        }
    } else {
        proxyIp = { code: 1000, data: [] };
        while (proxyIp.data.length < num) {
            proxyIp.data.push(myProxyConfig[myProxyIdx++]);
            if (myProxyIdx >= myProxyConfig.length) {
                myProxyIdx = 0;
            }
        }
    }
    return proxyIp;
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
    safeHtml,
    getLeague,
    getMatchData,
    getFiles,
    getFile,
    getFromUrl,
    saveFile,
    getByCurl,
    getProxy
};

