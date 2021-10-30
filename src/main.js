const Utils = require("./Utils")
const Logger = require("./Logger")
const DBHelper = require("./DBHelper")
const Config = require("./Config")

//http://zq.win007.com/default/getScheduleInfo?sid=1721768&t=
//找到某场比赛的结果，返回数组var arrLeague=[0,0,0,0,0];
//[isFinish,h_score,a_score,h_half_score,a_half_score]
//获得某场比赛的赔率
//http://vip.win007.com/changeDetail/1x2.aspx?id=1720887&companyid=8&l=0
//companyid={"bet365":8,"立博":4,"皇冠":3"} 
//

const GroupL = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];

const args = process.argv.splice(2);
/**
 * 只允许c128.js 或者 sea9.js 或者 s9_481.js
 */
const allowJs = /[sc](ea)?\d+(_\d+)?\.js/g;


const updateKey = { "h_score": true, "a_score": true, "full_score": true, "half_score": true, "h_rank": true, "a_rank": true, "had_result": true };

const urlCache = {};

DBHelper.query("select count(*) as count from t_fb_match_bet007", (qerr, vals, fields) => {
    if (qerr) {
        console.log(qerr);
    } else {
        console.log(vals[0]["count"]);
    }
});

/**
 * 
 * @param model 
 */
async function saveModel(model, tableName = "t_fb_match_bet007") {
    Logger.info(model);
    let columns = [], values = [], params = [], update = [], updateValue = [];
    for (var key in model) {
        columns.push(key);
        values.push("?");
        params.push(model[key]);
        if (updateKey[key]) {
            update.push(key + "=?");
            updateValue.push(model[key]);
        }
    }
    params = params.concat(updateValue);
    let sql = "insert into " + tableName + "(" + columns.join(",") + ") values (" + values.join(",") + ") ";
    if (update.length > 0) {
        sql += "ON DUPLICATE KEY UPDATE " + update.join(",") + ",update_time='" + Utils.formatDate(new Date()) + "'";
    }
    Logger.info("执行sql:" + sql);
    Logger.info("参数 ：" + params);
    let results = DBHelper.query(sql, params);
    Logger.info("成功插入条数：" + results);
}

async function getData(page, urlData, otherSeason = false) {

    let name = urlData.name;
    let url = urlData.url;
    if (urlCache[url]) {
        Logger.info("****************************");
        Logger.info("****************************");
        Logger.info("已经抓取过的地址：" + url);
        Logger.info("****************************");
        Logger.info("****************************");
        await page.waitFor(500);
        return;
    }

    let urlDb = await DBHelper.query("select * from t_fb_match_bet007_url where url = ?", url);
    if (urlDb != null && urlDb.length > 0) {
        Logger.info("****************************");
        Logger.info("****************************");
        Logger.info("已经抓取过的地址：" + url, "抓取时间：" + urlDb[0]["insert_time"]);
        Logger.info("****************************");
        Logger.info("****************************");
        await page.waitFor(500);
        return;
    }
    urlCache[url] = true;

    Logger.info("开始抓取[ " + name + " ],地址：" + url);
    await page.goto(url);
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector("#spnLoading");
    await page.waitFor(1000);
    try {
        await page.waitForFunction('Array.isArray(window.arrLeague || window.arrCup)');
    } catch (error) {
        console.log(error);
        urlCache[url] = false;
        delete urlCache[url];
        Logger.info("页面应该是报错了，重新获取一次" + url);
        await page.waitFor(1000);
        return await getData(page, urlData, otherSeason);
    }
    /**
     * 将数据文件保存到本地
     */
    /*
    let dataJs = await page.evaluate((allowJs)=> {
        let dataJs = [];
        var scripts = document.querySelectorAll("script");
        for(var i=0;i<scripts.length;i++){
            let s = scripts[i];
            let jsUrl = s.src;
            console.log(jsUrl);
            if (jsUrl!=null && jsUrl!="") {
                let jsName = jsUrl.split("/").pop().split("?")[0];
                if (jsName.match(allowJs) != null) {
                    dataJs.push({ jsName, jsUrl });
                }
            } else {
                let scriptText = s.innerText;
                if (scriptText.indexOf("var jh = new Object()") != -1) {
                    dataJs.push({scriptText});
                }
            }
        }
        return dataJs;
    },allowJs);
    if (dataJs.length > 0) {
        for (let i = 0; i < dataJs.length; i++) {
            if(dataJs[i].scriptText){
                await Utils.writeToFile(dataJs[i].scriptText, "../data/" + name + "/script.js");
            }else{
                await Utils.downloadFile(dataJs[i].jsUrl, "../data/" + name + "/" + dataJs[i].jsName);
            }
        }
    }*/

    /**
     * 获取数据
     */
    let data = await page.evaluate(() => {
        //SclassID 是 联赛ID
        //SubSclassID 是 升降级 ID
        //如果 SubSclassID ==0 时， arrSubLeague 没有值，此时联赛的总轮次和当前轮次信息从arrLeague 数组里获取，arrLeague[7] 是总轮次，arrLeague[8] 是当前轮次
        //如果 SubSclassID > 0 时， arrSubLeague 数组，找到对应的赛事信息，数组第一个值是id,与 SubSclassID 相同即是当前赛事信息。 arrSubLeague[n][5] 是总轮次， arrSubLeague[n][6] 是当前轮次 
        //jh 是 比赛对阵信息，key 为轮次（联赛）或者分组（杯赛） ,value 是当前轮（联赛）或者分组（杯赛）的所有比赛 [id,l_id,isFinish,playtime,h_id,a_id,full_score,half_score,h_rank,a_rank,....]
        //arrLeague 是当前联赛的信息，如果不是顶级联赛，arrSubLeague 是当前联赛的升降级或降级的比赛
        //arrCup 是当前杯赛的信息

        console.log("开始封闭数据");
        try {

            if (typeof arrSeason == "undefined" || typeof jh == "undefined" || typeof arrTeam == "undefined") {
                console.log(document.head.innerHTML);
                return false;
            }
            if (!Array.isArray(arrTeam) || !Array.isArray(arrSeason)) {
                console.log(document.head.innerHTML);
                return false;
            }

            if (Object.keys(jh).length == 0) {
                console.log(document.head.innerHTML);
                return false;
            }
            if (typeof arrCup != 'undefined' && arrCup.length > 0) {
                return { arrCup, arrCupKind, arrTeam, lastUpdateTime, jh, arrSeason, selectSeason, SclassID };
            }
            if (typeof arrSubLeague != 'undefined' && arrSubLeague.length > 1) {
                return { arrLeague, arrTeam, lastUpdateTime, jh, arrSeason, selectSeason, arrSubLeague, SclassID, SubSclassID };
            }
        } catch{
            // document.head.innerHTML
            console.log(document.head.innerHTML);
            // console.log(document.body.innerHTML);
        }
        return false;
    });

    console.log("data 封装完成");

    if (data === false) {
        urlCache[url] = false;
        delete urlCache[url];
        Logger.info("页面应该是报错了，重新获取一次" + url);
        await page.waitFor(1000);
        return await getData(page, urlData, otherSeason);
    }

    data.teamMap = {};
    for (let i = 0; i < data.arrTeam.length; i++) {
        let team = data.arrTeam[i];
        data.teamMap["_" + team[0]] = team[1];
    }
    data.roundMap = {};
    if (typeof data.arrCupKind != 'undefined' && data.arrCupKind.length > 0) {
        for (let i = 0; i < data.arrCupKind.length; i++) {
            let cupKind = data.arrCupKind[i];
            if (cupKind[1] == 0) {
                data.roundMap["G" + cupKind[0]] = cupKind[2];
            } else {
                let count = parseInt(cupKind[5]);
                for (let j = 0; j < count; j++) {
                    data.roundMap["G" + cupKind[0] + GroupL[j]] = cupKind[2] + GroupL[j];
                }
            }
        }
    }

    //解析数据

    urlDb = {};
    let match = {};
    if (typeof data.arrLeague != 'undefined' && data.hasOwnProperty("arrLeague")) {
        match.l_name = data.arrLeague[data.arrLeague.length - 4];
        match.l_id = data.arrLeague[0];
    } else {
        match.l_name = data.arrCup[4];
        match.l_id = data.arrCup[0];
    }
    match.season = data.selectSeason;
    match.sub_league = data.SubSclassID || 0;
    match.insert_time = Utils.formatDate(new Date());
    let h12 = Utils.formatDate(new Date(new Date().getTime() + 12 * 1000 * 60 * 60), "yyyy-MM-dd hh:mm");
    urlDb["l_id"] = match.l_id;
    urlDb["sub_league"] = match.sub_league;
    urlDb["url"] = url;
    urlDb["insert_time"] = match.insert_time;
    let finish_grab = 1;
    for (var key in data.jh) {
        let round = data.roundMap[key];
        if (round != null && typeof round != 'undefined') {
            match.round = round;
        } else {
            match.round = key.replace("R_", "");
        }
        let mArr = data.jh[key];
        if (mArr[0].length < 23 && Array.isArray(mArr[0][4])) {
            mArr = mArr.slice(4);
        }
        for (var i = 0; i < mArr.length; i++) {
            let m = mArr[i];
            match.id = m[0];
            match.playtime = m[3];
            match.h_id = m[4];
            match.a_id = m[5];
            match.h_name = data.teamMap["_" + match.h_id] || "";
            match.a_name = data.teamMap["_" + match.a_id] || "";
            match.full_score = m[6] || "";
            match.half_score = m[7] || "";
            match.h_rank = m[8];
            match.a_rank = m[9];
            match.status = m[2];// -1 比赛结束 0 比赛未开始 -10 比赛取消 -14 比赛推迟

            if (match.status == 0 || match.status == -14) {
                finish_grab = 0;
            }
            // console.log(match);
            let scores = match.full_score.split(/[:-]/g);
            if (scores.length == 2) {
                match.h_score = scores[0];
                match.a_score = scores[1];
                if (match.h_score > match.a_score) {
                    match.had_result = "胜";
                } else if (match.h_score < match.a_score) {
                    match.had_result = '负';
                } else {
                    match.had_result = "平";
                }
            } else {
                if (match.full_score.indexOf("取消") != -1) {
                    match.h_score = "";
                    match.a_score = "";
                    match.had_result = "取消";
                    match.half_score = "取消";
                    match.full_score = "取消";
                } else if (match.full_score.indexOf("推迟") != -1) {
                    match.h_score = "";
                    match.a_score = "";
                    match.had_result = "推迟";
                    match.half_score = "推迟";
                    match.full_score = "推迟";
                } else {
                    match.h_score = "";
                    match.a_score = "";
                    match.had_result = "";
                }
            }

            if ((match.status == 0 && match.playtime < h24) || match.status != 0) {
                try {
                    await saveModel(match);
                } catch (error) {
                    Logger.error(error);
                    break;
                }
            }
        }
        // break;

    }

    if (finish_grab == 1) {//只有全部结束了，才入库
        try {
            await saveModel(urlDb, "t_fb_match_bet007_url");
        } catch (error) {
            Logger.error(error);
            return;
        }
    }

    let subLeaguePage = [];
    if (typeof data.arrSubLeague != 'undefined' && data.arrSubLeague.length > 1) {
        for (let i = 0; i < data.arrSubLeague.length; i++) {
            let filename = url.split("/").pop().split(".")[0];
            let subLeague = data.arrSubLeague[i][0];
            let subLeagueName = data.arrSubLeague[i][1];
            if (subLeague != data.SubSclassID) {
                subLeaguePage.push({ "name": subLeagueName, "url": url.replace("/" + filename + ".", "/" + data.SclassID + "_" + subLeague + ".") });
            }
        }
    }

    if (subLeaguePage.length > 0) {
        for (var i = 0; i < subLeaguePage.length; i++) {
            var subData = subLeaguePage[i];
            await getData(page, subData, false);
        }
    }


    if (otherSeason) {
        for (let i = 0; i < data.arrSeason.length; i++) {
            let season = data.arrSeason[i];
            let seasonName = name + "-" + season;
            let lastName = url.split("/").pop();
            let seasonurl = url.replace(lastName, season + "/" + lastName);
            await getData(page, { name: seasonName, url: seasonurl }, false);
        }
    }


}


//http://vip.win007.com/changeDetail/1x2.aspx?id=1714900&companyid=8&l=0
//companyid={"bet365":8,"立博":4}
async function doGetOdds(page, id) {
    if (id > 0) {
        const insert_time = Utils.formatDate(new Date());
        const company = 8;
        const mid = id;
        let url = "http://vip.win007.com/changeDetail/1x2.aspx?id=" + mid + "&companyid=" + company + "&l=0";
        let odds = { mid, company, insert_time };

        if (urlCache[url]) {
            Logger.info("****************************");
            Logger.info("****************************");
            Logger.info("已经抓取过的地址：" + url);
            Logger.info("****************************");
            Logger.info("****************************");
            await page.waitFor(500);
            return;
        }

        let urlDb = await DBHelper.query("select * from t_fb_match_bet007_url where url = ?", url);
        if (urlDb != null && urlDb.length > 0) {
            Logger.info("****************************");
            Logger.info("****************************");
            Logger.info("已经抓取过的地址：" + url, "抓取时间：" + urlDb[0]["insert_time"]);
            Logger.info("****************************");
            Logger.info("****************************");
            await page.waitFor(500);
            return;
        }

        urlCache[url] = true;
        Logger.info("正在抓取赔率：id= " + id + " ,地址：" + url);
        await page.goto(url);
        await page.waitForSelector("#out");
        await page.waitFor(1000);
        const trs = await page.evaluate(() => {
            var odd = [];
            var trs = document.querySelectorAll("#out tr");
            for (var i = 1; i < trs.length; i++) {
                var tempOdds = {};
                const tr = trs[i];
                const tds = tr.children;
                tempOdds.h_odds = tds[0].innerText;
                tempOdds.d_odds = tds[1].innerText;
                tempOdds.a_odds = tds[2].innerText;
                tempOdds.odds_time = tds[3].innerText;
                if (i == trs.length - 1) {
                    tempOdds.first = 1;
                } else {
                    tempOdds.first = 0;
                }
                odd.push(tempOdds);
            }
            return odd;
        });
        console.log(trs);
        if (trs.length == 0) {
            trs.push({ h_odds: 0, a_odds: 0, d_odds: 0, first: 1, odds_time: 0 });
        }
        let saveCount = 0;

        for (var i in trs) {
            var tempOdds = trs[i];
            odds.h_odds = tempOdds.h_odds;
            odds.d_odds = tempOdds.d_odds;
            odds.a_odds = tempOdds.a_odds;
            odds.odds_time = tempOdds.odds_time;
            odds.first = tempOdds.first;
            odds.id = id + "_" + i;
            try {
                await saveModel(odds, "t_fb_match_bet007_odds");
                saveCount++;
            } catch (error) {
                Logger.error(error);
                break;
            }
        }

        if (saveCount > 0) {
            let urlDb = {};
            urlDb["l_id"] = mid;
            urlDb["sub_league"] = company;
            urlDb["url"] = url;
            urlDb["insert_time"] = insert_time;
            try {
                await saveModel(urlDb, "t_fb_match_bet007_url");
            } catch (error) {
                Logger.error(error);
                return;
            }
        }
    } else {
        console.log("没有id，不知道怎么弄");
    }

}

async function getOdds(page) {
    Logger.info("要抓取赔率了。。。");
    var now = new Date().getTime();
    now += 1000 * 60 * 60 * 24 * 3;//三天
    let maxCount = await DBHelper.query("SELECT count(m.id) as count FROM `t_fb_match_bet007` m left join `t_fb_match_bet007_odds` mo on m.id = mo.mid where m.playtime < ? and mo.mid is null ", Utils.formatDate(new Date(now)));
    console.log(maxCount);
    let mc = parseInt(maxCount[0]["count"]);
    let c = 0;
    while (true && c++ < mc) {
        let nextIds = await DBHelper.query("SELECT m.id FROM `t_fb_match_bet007` m left join `t_fb_match_bet007_odds` mo on m.id = mo.mid where m.playtime < ? and mo.mid is null order by m.id asc limit 100  ", Utils.formatDate(new Date(now)));
        if (nextIds.length > 0) {
            for (i = 0; i < nextIds.length; i++) {
                var nextId = nextIds[i]["id"];
                await doGetOdds(page, nextId);
            }
        } else {
            break;
        }
    }
}

(async () => {


    let urls = [];
    let oddsFlag = false;
    if (args[0] == "config") {
        urls = Config.urls;
    } else if (args[0] == "odds") {
        oddsFlag = true;
    } else {
        let temp = {};
        for (var i = 0; i < Config.urls.length; i++) {
            let data = Config.urls[i];
            let id = data.url.split("/").pop().split(".")[0];
            temp[data.name] = data;
            temp["_" + id] = data;
        }
        for (var i = 0; i < args.length; i++) {
            let dataUrl = temp[args[i]] || temp["_" + args[i]];
            if (dataUrl) {
                urls.push(dataUrl);
            }
        }
    }
    if (urls.length == 0 && !oddsFlag) {
        console.log("没什么可以做的，直接退出了");
        return;
    }
    Logger.info(urls);
    const Puppeteer = require('puppeteer-core');
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 966
        },
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        //ignoreDefaultArgs: ["--enable-automation"]
        //  devtools:true

    }).then(async browser => {

        let pages = await browser.pages();
        let page = pages[0];
        /*
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
                    if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.ico') || fileName.endsWith('.jpeg') || fileName.endsWith('.gif') || fileName.endsWith('.bmp')) {
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
        */
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


        let i = 0;
        if (oddsFlag) {
            await getOdds(page);
        } else {
            while (i < urls.length) {
                let urlObj = urls[i++];
                Logger.info("准备抓取[ " + urlObj.name + " ],地址：" + urlObj.url);
                await getData(page, urlObj, true);
            }

            await getOdds(page);
        }

        await browser.close();

        Logger.info("程序运行完毕，进入结束");

        await DBHelper.closePool();

        await process.exit();

    });
})();