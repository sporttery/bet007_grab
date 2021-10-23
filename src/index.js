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
        await page.goto("http://www.310win.com/Users/Register.aspx");
        var matchlist = await page.evaluate(() => {
            loadCNZZ = function () {

            }
            function safeHtml(d) {
                return d.replace(/[\r\n]/g, "").replace(/<head.+?<\/head>/g, "").replace(/<script.+?<\/script>/g, "").replace(/<img.+?>/g, "").replace(/<link.+?>/g, "").replace(/<style.+?<\/style>/g, "");
            }
            var GoalCn = "平手,平/半,半球,半/一,一球,一/球半,球半,球半/两,两球,两/两球半,两球半,两球半/三,三球,三/三球半,三球半,三球半/四球,四球,四/四球半,四球半,四球半/五,五球,五/五球半,五球半,五球半/六,六球,六/六球半,六球半,六球半/七,七球,七/七球半,七球半,七球半/八,八球,八/八球半,八球半,八球半/九,九球,九/九球半,九球半,九球半/十,十球".split(",");
            var GoalCn2 = ["0", "0/0.5", "0.5", "0.5/1", "1", "1/1.5", "1.5", "1.5/2", "2", "2/2.5", "2.5", "2.5/3", "3", "3/3.5", "3.5", "3.5/4", "4", "4/4.5", "4.5", "4.5/5", "5", "5/5.5", "5.5", "5.5/6", "6", "6/6.5", "6.5", "6.5/7", "7", "7/7.5", "7.5", "7.5/8", "8", "8/8.5", "8.5", "8.5/9", "9", "9/9.5", "9.5", "9.5/10", "10", "10/10.5", "10.5", "10.5/11", "11", "11/11.5", "11.5", "11.5/12", "12", "12/12.5", "12.5", "12.5/13", "13", "13/13.5", "13.5", "13.5/14", "14"];
            function Goal2GoalCn(goal) { //数字盘口转汉汉字	
                if (goal == null || goal + "" == "")
                    return "";
                else {
                    if (goal > 10 || goal < -10) return goal + "球";
                    if (goal >= 0) return GoalCn[parseInt(goal * 4)];
                    else return "受" + GoalCn[Math.abs(parseInt(goal * 4))];
                }
            }
            function Goal2GoalCn2(goal) {
                if (goal == "")
                    return "";
                else {
                    if (goal > 14) return goal + "球";
                    return GoalCn2[parseInt(goal * 4)];
                }
            }
            var op101 = {};
            $.ajax({
                url: "/data/op101.xml?" + (+new Date),
                async: false, type: "get", success: function (xml) {
                    $(xml).find("i").each((idx, i) => {
                        var item = $(i).text().split(",");
                        var id = item[1];
                        var cid = item[0];
                        if (cid == 8) {
                            op101[id] = [item[3], item[4], item[5]];
                        }
                    });
                }
            });
            var yp101 = {};
            $.ajax({
                url: "/data/yp101.xml?" + (+new Date),
                async: false, type: "get", success: function (xml) {
                    $(xml).find("i").each((idx, i) => {
                        var item = $(i).text().split(",");
                        var id = item[1];
                        var cid = item[0];
                        if (cid == 8) {
                            yp101[id] = [item[3], Goal2GoalCn(item[4]), item[5]];
                        }
                    });
                }
            });
            var matchlist = {};
            $.ajax({
                url: "/buy/jingcai.aspx?typeID=105&oddstype=2", async: false, type: "get", success: function (d) {
                    d = safeHtml(d);
                    $(d).find("#MatchTable").find("tr[id^=row]").each((idx, tr) => {
                        var trj = $(tr);
                        var leagueName = trj.attr("gamename");
                        var jcmatchId = trj.attr("matchid");
                        var week = trj.attr("name");
                        var tds = trj.children();
                        var num = $(tds[0]).text();
                        var leagueColor = $(tds[1]).css("background-color");
                        var href = $(tds[1]).find("a")[0].href;
                        var leagueId;
                        if (href.indexOf("SclassID=") != -1) {
                            leagueId = href.split("SclassID=")[1].split("&")[0];
                        } else {
                            leagueId = href.match(/\d+.html/g)[0].split(".")[0];
                        }
                        var playtime = $(tds[2]).attr("title").replace("开赛时间：", "");
                        var homeName = $(tds[4]).text().trim();
                        var score = $(tds[6]).text();
                        var awayName = $(tds[7]).text().trim();
                        var ids = $(tds[4]).find("div").attr("id").split("_");
                        var id = ids[1];
                        var homeId = ids[2];
                        ids = $(tds[7]).find("div").attr("id").split("_");
                        var awayId = ids[2];
                        var table = $(tds[12]).find("table");
                        var spf = table.find("tr:eq(0)").find("td");
                        var h = $(spf[1]).text();
                        var d = $(spf[2]).text();
                        var a = $(spf[3]).text();
                        var rqspf = table.find("tr:eq(1)").find("td");
                        var rq = $(rqspf[0]).text();
                        var h1 = $(rqspf[1]).text();
                        var d1 = $(rqspf[2]).text();
                        var a1 = $(rqspf[3]).text();
                        var bet365_op = op101[jcmatchId];
                        if (!bet365_op) {
                            bet365_op = ['-', '-', '-'];
                        }
                        var bet365_yp = yp101[jcmatchId];
                        if (!bet365_yp) {
                            bet365_yp = ['-', '-', '-'];
                        }
                        var match = { bet365_op, bet365_yp, leagueId, leagueName, leagueColor, jcmatchId, week, num, playtime, homeName, homeId, awayName, awayId, h, d, a, rq, h1, d1, a1, id, score };
                        matchlist[id] = match;
                    });
                }
            })
            return matchlist;
        });
        var html = fs.readFileSync(path.resolve(path.dirname(exeFile), "index.html")).toString();
        await page.setContent(html);
        await page.evaluate((matchlist) => {
            // console.log(matchlist);
            var html = [];
            for (var key in matchlist) {
                var match = matchlist[key];
                html.push('<tr class="bet-tb-tr" id="m' + key + '">');
                html.push('<td class="td td-no"><a href="javascript:;" class="bet-evt-hide" >' + match.week + match.num + '</a></td>');
                html.push('<td class="td td-evt"><a href="http://info.310win.com/cn/League/' + match.leagueId + '.html" target="_blank" style="background:' + match.leagueColor + ';" >' + match.leagueName + '</a></td>');
                html.push('<td class="td td-endtime" title="' + match.playtime + '截止">' + match.playtime.substring(5) + '</td>');
                html.push('<td class="td td-team">');
                html.push('<div class="team">');
                html.push('<span class="team-l"><a href="http://zq.win007.com/cn/team/TeamSche/' + match.homeId + '.html" target="_blank" class="team-l">' + match.homeName + '</a></span>');
                html.push('<i class="team-vs">VS</i>');
                html.push('<span class="team-r"><a href="http://zq.win007.com/cn/team/TeamSche/' + match.awayId + '.html" target="_blank" class="team-r" >' + match.awayName + '</a></span>');
                html.push('</div>');
                html.push('</td>');
                html.push('<td class="td td-rang"><p class="itm-rangA1" title="不让球">0</p><p class="green  itm-rangA2"> ' + match.rq + '</p></td>');
                html.push('<td class="td td-betbtn">');
                html.push('<div class="betbtn-row itm-rangB1">');
                html.push('<p class="betbtn" data-type="nspf" data-value="3"><span>' + match.h + '</span></p>');
                html.push('<p class="betbtn" data-type="nspf" data-value="1"><span>' + match.d + '</span></p>');
                html.push('<p class="betbtn" data-type="nspf" data-value="0"><span>' + match.a + '</span></p>');
                html.push('</div>');
                html.push('<div class="betbtn-row itm-rangB2">');
                html.push('<p class="betbtn" data-type="spf" data-value="3"><span>' + match.h1 + '</span></p>');
                html.push('<p class="betbtn" data-type="spf" data-value="1"><span>' + match.d1 + '</span></p>');
                html.push('<p class="betbtn" data-type="spf" data-value="0"><span>' + match.a1 + '</span></p>');
                html.push('</div></td>');

                html.push('<td class="td td-data">');
                html.push('<a href="http://www.310win.com/handicap/' + match.id + '.html" target="_blank">析</a>');
                html.push('<a href="http://www.310win.com/1x2/' + match.id + '.html" target="_blank">亚</a>');
                html.push('<a href="http://www.310win.com/analysis/' + match.id + '.html" target="_blank">欧</a>');
                html.push('<a class="tdQing" href="javascript:void(0);" onclick="bolool(this)" style="color:red" target="_blank">情</a></td>');
                var op = match.bet365_op;
                var yp = match.bet365_yp;
                html.push('<td class="td td-pei">');
                html.push('<div class="betbtn-row itm-rangB1">');
                html.push('<span>' + op[0] + '</span><span>' + op[1] + '</span><span>' + op[2] + '</span></div>');
                html.push('<div class="betbtn-row itm-rangB2">');
                html.push('<span>' + yp[0] + '</span><span>' + yp[1] + '</span><span>' + yp[2] + '</span></div>');
                html.push('</td>');
                html.push('</tr>');
            }
            $("#matchlist").html(html.join(''));


            function bolool(obj) {

            }
        }, matchlist);

        async function addJquery(pageIdx) {
            var allPage = await browser.pages();
            var npage;
            if (!pageIdx) {
                npage = allPage[allPage.length - 1];
            } else {
                npage = allPage[pageIdx];
            }
            let jQueryPath = path.join(__dirname, "res", "jquery.min.js");
            if (fs.existsSync(jQueryPath)) {
                let jQuery = fs.readFileSync(jQueryPath, { encoding: "utf-8" }).toString();
                await npage.addScriptTag({
                    content: jQuery
                });
                console.log("addJquery完了");
            }
        }


        async function saveTable(matchtable, startDateStr) {
            console.info("保存数据库 日期=" + startDateStr + " , ids=" + matchtable);
            var ids = matchtable.split(",");
            var values = [], params = [];
            for (var i = 0; i < ids.length; i++) {
                values.push("(?,?)");
                params.push(ids[i]);
                params.push(startDateStr);
            }
            await DBHelper.query("insert into t_match_date(id,datestr)values " + values.join(",") + " ON DUPLICATE KEY UPDATE datestr=VALUES(datestr)", params);

        }
        async function saveMatch(id, json) {
            console.info("保存数据库 id=" + id);
            await DBHelper.query("insert into t_match_data(id,json)values(?,?) ON DUPLICATE KEY UPDATE json=VALUES(json)", [id, json]);
        }
        async function getById(id) {
            let retry = await page.evaluate(async id => {
                if (btnCollect) {
                    btnCollect.innerText = id;
                }
                var retry = 0;
                do {
                    if (retry > 0) {
                        console.info("获取ID " + id + " 第" + retry + "次尝试");
                    }
                    var matchinfo = null;
                    $.get("//zq.win007.com/analysis/" + id + "cn.htm", (analysis) => {
                        var start = analysis.indexOf("var lang");
                        if (start != -1) {
                            analysis = analysis.substring(start);
                            var end = analysis.indexOf("</script>");
                            var sc = analysis.substring(0, end);
                            eval(sc);
                            matchinfo = {
                                matchState, scheduleID, h2h_home, h2h_away,
                                hometeam, guestteam, h_data, a_data, Vs_hOdds, Vs_eOdds
                            };
                        }
                    })
                    if(matchinfo){
                        await saveMatch(id, JSON.stringify(matchinfo));
                        retry=0;
                        break;
                    }
                } while (retry++ < 2);
                return retry;
            }, id);
            if (retry > 0 ) {
                let nPage = await page.browser().newPage();
                let url = "http://zq.win007.com/analysis/" + id + "cn.htm";
                await nPage.goto(url);
                let analysis = await nPage.content();
                var start = analysis.indexOf("var lang");
                if (start != -1) {
                    analysis = analysis.substring(start);
                    var end = analysis.indexOf("</script>");
                    var sc = analysis.substring(0, end);
                    eval(sc);
                    var matchinfo = {
                        matchState, scheduleID, h2h_home, h2h_away,
                        hometeam, guestteam, h_data, a_data, Vs_hOdds, Vs_eOdds
                    };
                    await saveMatch(id, JSON.stringify(matchinfo));
                }
                await nPage.close();
            }
        }
        async function ft2Click() {
            var datestr = "20180101";
            var dateResult = await DBHelper.query("select max(datestr) datestr from t_match_date");
            if (dateResult && dateResult.length == 1) {
                datestr = dateResult[0]["datestr"];
            }
            console.info("select max(datestr) from t_match_date => " + datestr);
            var noDataResult = await DBHelper.query("select de.id from t_match_date de left join t_match_data da on de.id = da.id where da.id is null");
            // console.info(noDataResult);
            var noDataIds = [];
            noDataResult.forEach(RowDataPacket => {
                noDataIds.push(RowDataPacket.id);
            });
            if (datestr == null) {
                datestr = "20180101";
            }
            var startDate = new Date(parseInt(datestr.substring(0, 4)), parseInt(datestr.substring(4, 6)) - 1, parseInt(datestr.substring(6)));
            var noJquery = await page.evaluate(() => {
                if (typeof jQuery === "undefined") {
                    return 1;
                }
                return 0;
            });
            if (noJquery) {
                await addJquery();
            }



            await page.evaluate((ids, startDate, noDataIds) => {
                jQuery.ajaxSetup({ async: false });

                Date.prototype.Format = function (fmt) { //author: meizz   
                    var o = {
                        "M+": this.getMonth() + 1,                 //月份   
                        "d+": this.getDate(),                    //日   
                        "h+": this.getHours(),                   //小时   
                        "m+": this.getMinutes(),                 //分   
                        "s+": this.getSeconds(),                 //秒   
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
                        "S": this.getMilliseconds()             //毫秒   
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }

                window.getByDate = async function (date) {
                    var datestr = date.Format("yyyyMMdd");
                    if (btnCollect.style.color != "green") {
                        btnCollect.style.color = 'green';
                        btnCollect.style.background = '#eee';
                    }
                    btnCollect.innerText = datestr;
                    // msg.value += ("开始获取日期 /football/Over_" + datestr + ".htm 的数据\n");
                    var analysisIds = [];
                    $.get("//bf.win007.com/football/Over_" + datestr + ".htm",html => {
                        var table_live = $(html).find("#table_live");
                        // var html = table_live[0].outerHTML;
                        // console.info(html);
                        var trs = table_live.find("tr");
                        // console.info("比赛场次数：" + trs.length);
                        for (var i = 0; i < trs.length; i++) {
                            var name = $(trs[i]).attr("name");
                            if (name) {
                                var leagueId = name.split(",")[0];
                                if (ids[parseInt(leagueId)]) {
                                    var onclick = $(trs[i]).find("td:eq(4)").attr("onclick");
                                    if (onclick) {
                                        var id = onclick.replace(/\D/g, "");
                                        analysisIds.push(id);
                                    }
                                }
                            }
                        }
                    });
                    if (analysisIds.length > 0) {
                        for(var i=0;i<analysisIds.length;i++){
                            await getById(analysisIds[i]);
                        }
                        await saveTable(analysisIds.join(","), datestr);
                    }
                }
                window.startDate = startDate;
                window.ids = ids;
                (async()=>{
                    let date = new Date(startDate);
                    do{
                        await getByDate(date);
                        date = new Date(date.getTime() + 1000 * 86400);
                    }while(date.getTime() < new Date().getTime() && window.running);
                    for(var i=0;i<noDataIds.length;i++){
                        await getById(noDataIds[i]);
                    }
                    window.running = false;
                    btnCollect.style.color = 'white';
                    btnCollect.style.background = 'red';
                    btnCollect.innerText = '采集';
                })();;
            }, config.ids, startDate.getTime(), noDataIds);

        }
        await page.exposeFunction("ft2Click", ft2Click);
        await page.exposeFunction("saveTable", saveTable);
        await page.exposeFunction("saveMatch", saveMatch);
        await page.exposeFunction("addJquery", addJquery);
        await page.exposeFunction("getById", getById);

        await addCollectionButton(page);
    });
})();