const Utils = require("./Utils");
const Logger = require("./Logger");

var g_page30 = null, g_page33 = null;



async function fillData(page, data, hookFlag) {
    if (typeof (data) == "string") {
        data = JSON.parse(data);
    }
    // var url = await page.url();
    await page.evaluate((data, hookFlag) => {
        if (!window["data"]) {
            window["data"] = {};
        }
        console.log(data);
        var id = data.id;
        window["data"]["m" + id] = data;
        function sum(arr) {
            var i = 0;
            arr.forEach((t) => {
                i += parseInt(t);
            })
            return i;
        }

        function getScoreSection(score, hookFlag) {
            score = parseInt(score)
            if (hookFlag == 33) {
                return 10 - parseInt(score / 10);
            } else if (hookFlag == 30) {
                return 9 - parseInt(score / 10);
            }
        }
        goalscore33 = {}, goalscore6 = {}, result6 = {}, goalscore3 = {}, result3 = {};
        ["home", "away"].forEach((t) => {
            key = t + "score";
            console.log(data[key]);
            //8胜11平14负，其中客场2胜6平9负
            spf = data[key].split(/[胜平负]/);
            // toal = sum([spf[0],spf[1],spf[2]]);

            //近33场比赛积分
            goalscore33[t] = parseInt(spf[0]) * 3 + parseInt(spf[1]);
            key = t + "comp";
            arr = data[key];
            //最近6场
            nearSixArr = arr.slice(0, 6);
            goalscore6Arr = [], result6Arr = [];
            nearSixArr.forEach((t1) => {
                goalscore6Arr.push(t1.goalscore);
                result6Arr.push(t1.result);
            })
            goalscore6[t] = goalscore6Arr;
            result6[t] = result6Arr.join(",");

            //最近3场
            nearThreeArr = arr.slice(0, 3);
            goalscore3Arr = [], result3Arr = [];
            nearThreeArr.forEach((t1) => {
                goalscore3Arr.push(t1.goalscore);
                result3Arr.push(t1.result);
            })
            goalscore3[t] = goalscore3Arr;
            result3[t] = result3Arr.join(",");

        });
        // var arr = url.match(/\/(\d+)\//);
        // if (arr.length == 2) {
        //     var id = arr[1];

        console.log({ id, goalscore33, goalscore6, result6, goalscore3, result3 });
        ["home","away"].forEach((t)=>{
            var table = $("."+t+"comp");
            var tr = table.find("#m_" + id);
            tr.find(".loadDataA").removeClass("loadDataA");
            tr.find(".scoreHome").text(goalscore33["home"]);
            tr.find(".scoreAway").text(goalscore33["away"]);
            tr.find(".sectionHome").text(getScoreSection(goalscore33["home"], hookFlag));
            tr.find(".sectionAway").text(getScoreSection(goalscore33["away"], hookFlag));
            tr.find(".scoreHome3").text(goalscore3["home"].join(""))
            tr.find(".scoreAway3").text(goalscore3["away"].join(""))
            var homescore3 = sum(goalscore3["home"]);
            var awayscore3 = sum(goalscore3["away"]);
            var qiangruo = {};
            if (homescore3 > awayscore3) {
                qiangruo["home"] = '强';
                qiangruo["away"] = '弱';
            } else if (homescore3 < awayscore3) {
                qiangruo["away"] = '强';
                qiangruo["home"] = '弱';
            } else {
                qiangruo["away"] = '平';
                qiangruo["home"] = '平';
            }
            tr.find(".typeHome").text(qiangruo["home"])
            tr.find(".typeAway").text(qiangruo["away"])
        })

        // }
    }, data, hookFlag);
}

async function addEvent(page, url) {
    if (url.match(/\/soccer\/match\/\d+\/history/)) {
        if (url.indexOf("hook=") != -1) {
            var mId = 0;
            var ncs = url.match(/\/(\d+)\//);
            if (ncs.length == 2) {
                mId = ncs[1];
            }
            var hookFlag = url.split("hook=")[1];
            var noHook = hookFlag != 33 && hookFlag != 30;
            if (noHook) {
                return;
            }
            // console.log("start hook");
            var isHistory = url.split("isHistory=")[1];
            if (!isHistory) {
                if (hookFlag == 30) {
                    g_page30 = page;
                } else {
                    g_page33 = page;
                }
            }
            await page.waitForSelector(".lsdata");
            // await page.waitForSelector(".vscomp");
            await page.waitForSelector(".new-footer");
            let data = await page.evaluate((hookFlag, isHistory, mId) => {
                function doHook(hookFlag, isHistory, mId) {
                    // var url = location.href;
                    // var hookFlag = url.split("hook=")[1];
                    // var noHook = hookFlag != 33 && hookFlag != 30;
                    // if (noHook) {
                    //     return;
                    // }
                    // console.log("start hook");
                    // var isHistory = url.split("isHistory=")[1];
                    var arr1 = ["Home", "Away"];
                    var arr2 = ["home", "away"];
                    var data = { "id": mId };
                    arr1.forEach((t) => {
                        $("#" + t + "Count").html("<option value='"+hookFlag+"' selected>"+hookFlag+"场</option>").change();
                        if (hookFlag == 33) {
                            $("#" + t + "LeagueFilter").html("<option value='notFriendly' selected>非友谊赛</option>").change();
                        } else if (hookFlag == 30) {
                            $("#" + t + "LeagueFilter").html("<option value='all' selected>全赛事</option>").change();
                        }
                        $("#" + t + "Filter").parent().hide();
                    });

                    if (!isHistory) {
                        arr2.forEach((t) => {
                            $("#" + t + "qhplObj").val("1_27_c").change();
                            $("#" + t + "qhpkObj").val("2_27_c").change();
                        });
                        thisMatchShow = $("#jsSetVisible")[0];
                        thisMatchShow.click();
                        if (!thisMatchShow.checked) {
                            thisMatchShow.click();
                        }
                    }
                    //比赛结果
                    function getResult(scores) {
                        return scores[0] == scores[1] ? "<span class=\"huiB\">平</span>" : scores[0] > scores[1] ? "<span class=\"redB\">胜</span>" : "<span class=\"blueB\">负</span>";
                    }
                    //比赛积分
                    function getGoalscore(scores) {
                        return scores[0] > scores[1] ? 3 : scores[0] == scores[1] ? 1 : 0;
                    }
                    if (!isHistory) {
                        var jsdata = $(".lsdata");
                        jsdata.prev().remove();
                        jsdata.css("width", "100%");
                        $(".homefuture").remove().appendTo(jsdata);
                        $(".awayfuture").remove().appendTo(jsdata);
                        $(".okooo-master-panel").remove();
                        $("#ok_xms_service").remove();
                        $(".matchboxbg .card").css("width", "100%");
                        setTimeout(() => {
                            $("div[class^=baidu]").html('');
                            $(".adv_ok").remove();
                        }, 1000);
                        window["showSameOdds"] = function (scope, oddsType, obj) {
                            if (!obj) {
                                if (oddsType == 0) {
                                    obj = $("#sameOdds" + scope)[0]
                                } else {
                                    obj = $("#sameAsiaOdds" + scope)[0]
                                }
                            }

                            //0 欧盘 3 亚盘
                            var table = $("." + scope + "comp");
                            if (!obj.checked) {
                                table.find(".bolool:hidden").show();
                            } else {
                                var odds = null;
                                table.find(".bolool").each((idx, el) => {
                                    var tds = el.children;
                                    if (idx == 0) {
                                        odds = tds[6 + oddsType].innerText + "," + tds[7 + oddsType].innerText + "," + tds[8 + oddsType].innerText;
                                    } else {
                                        var nOdds = tds[6 + oddsType].innerText + "," + tds[7 + oddsType].innerText + "," + tds[8 + oddsType].innerText;
                                        console.log(nOdds, odds);
                                        if (nOdds == odds) {
                                            $(el).show();
                                        } else {
                                            $(el).hide();
                                        }
                                    }
                                });
                            }
                        }
                        function sum(arr) {
                            var i = 0;
                            arr.forEach((t) => {
                                i += parseInt(t);
                            })
                            return i;
                        }

                        function getScoreSection(score) {
                            score = parseInt(score)
                            if (hookFlag == 33) {
                                return 10 - parseInt(score / 10);
                            } else if (hookFlag == 30) {
                                return 9 - parseInt(score / 10);
                            }
                        }
                        window["loadData"] = function (scope) {
                            var table = $("." + scope + "comp");
                            table.find(".loadDataA").each((idx, el) => {
                                el.click();
                            });
                        }
                        var homeText = $(".homescore").text();
                        spf = homeText.split(/[胜平负]/);
                        homejf = parseInt(spf[0]) * 3 + parseInt(spf[1]);
                        var awayText = $(".awayscore").text();
                        spf = awayText.split(/[胜平负]/);
                        awayjf = parseInt(spf[0]) * 3 + parseInt(spf[1]);
                        homeSection = getScoreSection(homejf);
                        awaySection = getScoreSection(awayjf);
                        trs = $(".homecomp").find("tr:visible").slice(3, 6);
                        homejf3 = [];
                        homeId = $(".homecomp").find(".jsThisMatch").find("td:eq(2)").attr("attr");
                        awayId = $(".homecomp").find(".jsThisMatch").find("td:eq(4)").attr("attr");
                        trs.each((idx, el) => {
                            tds = el.children;
                            var fullscore = $(tds[3]).attr("attr");
                            var scores = fullscore.split("-");
                            if ($(tds[2]).attr("attr") == homeId) {
                                tmp = scores[0];
                                scores[0] = scores[1];
                                scores[1] = tmp;
                            }
                            homejf3.push(getGoalscore(scores));
                        });
                        trs = $(".awaycomp").find("tr:visible").slice(3, 6);
                        awayjf3 = [];
                        trs.each((idx, el) => {
                            tds = el.children;
                            var fullscore = $(tds[3]).attr("attr");
                            var scores = fullscore.split("-");
                            if ($(tds[2]).attr("attr") == awayId) {
                                tmp = scores[0];
                                scores[0] = scores[1];
                                scores[1] = tmp;
                            }
                            awayjf3.push(getGoalscore(scores));
                        });

                        homejf3I = sum(homejf3);
                        awayjf3I = sum(awayjf3);
                        qiangruoHome = '平';
                        qiangruoAway = '平';
                        if (homejf3I > awayjf3I) {
                            qiangruoAway = '弱';
                            qiangruoHome = '强';
                        } else if (homejf3I < awayjf3I) {
                            qiangruoHome = '弱';
                            qiangruoAway = '强';
                        }
                        arr2.forEach((t) => {
                            var table = $("." + t + "comp");
                            var teamId;
                            table.find("tr:visible").each((idx, el) => {
                                $(el).find("td").removeAttr("width");
                                if (idx == 0) {
                                    var lstitle = $(el).find(".lstitle");
                                    lstitle.attr("colspan", "24");
                                    lstitle.find("label").remove();
                                    var span = lstitle.find("."+t+"score");
                                    span[0].innerHTML = span[0].innerHTML + '<a href="javascript:loadData(\'' + t + '\')" style="color:red"> &nbsp;&nbsp;&nbsp;获取数据</a>';
                                } else if (idx == 1) {
                                    tds = el.children;
                                    tds[tds.length - 1].innerHTML = '果';
                                    tds[6].innerHTML = '<label for="sameOdds' + t + '"><input type="checkbox" id="sameOdds' + t + '" onchange="showSameOdds(\'' + t + '\',0,this)"/>只看同赔</lable>';
                                    tds[7].innerHTML = '<label for="sameAsiaOdds' + t + '"><input type="checkbox" id="sameAsiaOdds' + t + '" onchange="showSameOdds(\'' + t + '\',3,this)"/>只看同赔</label>'
                                    el.innerHTML = el.innerHTML + '<td>主' + hookFlag + '</td><td>客' + hookFlag + '</td><td>主分区</td><td>客分区</td><td>主近3</td><td>客近3</td><td>强弱</td><td>强弱</td>';
                                } else {
                                    var matchid = $(el).attr("data-matchid");
                                    el.id = "m_" + matchid;
                                    el.className = el.className + " bolool";
                                    tds = el.children;
                                    var fullscore = $(tds[3]).attr("attr");
                                    var scores = fullscore.split("-");
                                    if (scores.length == 2) {
                                        if ($(tds[2]).attr("attr") != teamId) {
                                            tmp = scores[0];
                                            scores[0] = scores[1];
                                            scores[1] = tmp;
                                        }
                                        var result=getResult(scores);
                                        setTimeout((el)=>{
                                            $(el).find(".lsPanlu").html(result);
                                        },2000,el,result);
                                    }
                                    if (idx == 2) {
                                        if (t == "home") {
                                            teamId = $(tds[2]).attr("attr");
                                        } else {
                                            teamId = $(tds[4]).attr("attr");
                                        }
                                        el.innerHTML = el.innerHTML + '<td class="scoreHome bright borderLeft" title="'+homeText+'">' + homejf + '</td><td class="scoreAway bright borderLeft" title="'+awayText+'">' + awayjf + '</td><td class="sectionHome bright borderLeft">' + homeSection + '</td><td class="sectionHome bright borderLeft">' + awaySection + '</td><td class="scoreHome3 bright borderLeft">' + homejf3.join("") + '</td><td class="scoreAway3 bright borderLeft">' + awayjf3.join("") + '</td><td class="typeHome bright borderLeft">' + qiangruoHome + '</td><td class="typeAway bright borderLeft">' + qiangruoAway + '</td>';
                                    } else {
                                        el.innerHTML = el.innerHTML + '<td class="scoreHome bright borderLeft">--</td><td class="scoreAway bright borderLeft">--</td><td class="sectionHome bright borderLeft">--</td><td class="sectionHome bright borderLeft">--</td><td class="scoreHome3 bright borderLeft">--</td><td class="scoreAway3 bright borderLeft">--</td><td class="typeHome bright borderLeft">--</td><td class="typeAway bright borderLeft">--</td>';
                                    }
                                    var historyA = $(tds[1]).find("a");
                                    historyA[0].href = historyA[0].href + "?isHistory=1&hook=" + hookFlag;
                                    historyA[0].className = historyA[0].className + " loadDataA";
                                    // historyA[0].click();
                                }
                            });
                        })
                    } else {
                        arr2.forEach((t) => {
                            key = t + "score";
                            data[key] = $("." + key).text();
                            key = t + "comp";
                            var table = $("." + key);
                            data[key] = [];
                            var teamId = null;
                            if (t == "home") {
                                teamId = table.find(".jsThisMatch").find("td:eq(2)").attr("attr");
                            } else {
                                teamId = table.find(".jsThisMatch").find("td:eq(4)").attr("attr");
                            }
                            table.find("tr:visible").each((idx, el) => {
                                if (idx > 1) {
                                    var matchid = $(el).attr("data-matchid");
                                    tds = el.children;
                                    var fullscore = $(tds[3]).attr("attr");
                                    var scores = fullscore.split("-");
                                    goalscore = 0;
                                    result = "-";
                                    if (scores.length == 2) {
                                        if ($(tds[2]).attr("attr") != teamId) {
                                            tmp = scores[0];
                                            scores[0] = scores[1];
                                            scores[1] = tmp;
                                        }
                                        goalscore = getGoalscore(scores);
                                        result = getResult(scores);
                                    }
                                    data[key].push({ "id": matchid, "score": fullscore, "goalscore": goalscore, "result": result });
                                }
                            });
                        });
                        // var ncs = url.match(/\/(\d+)\//);
                        // if (ncs.length == 2) {
                        // console.log(data);
                        //     mId = ncs[1];
                        //     data.mId= mId;
                        sessionStorage.setItem("data" + mId, JSON.stringify(data));
                        // }
                    }
                };
                $(() => {
                    setTimeout(doHook, 1000, hookFlag, isHistory, mId);
                })
            }, hookFlag, isHistory, mId);
            if (isHistory) {
                // var hookPage = g_page33;
                // if (hookFlag == 30) {
                //     hookPage = g_page30;
                // }
                // await hookPage.bringToFront();
                async function getData(mId, hookFlag) {
                    var data = await page.evaluate((mId) => {
                        return sessionStorage.getItem("data" + mId);
                    }, mId);
                    if (data) {
                        var hookPage = g_page33;
                        if (hookFlag == 30) {
                            hookPage = g_page30;
                        }
                        await page.close();
                        await fillData(hookPage, data, hookFlag);
                        return;
                    }
                    setTimeout(getData, 1000, mId, hookFlag);
                }

                setTimeout(getData, 1000, mId, hookFlag);
            }
        }
    }
    page.on('error', () => {
        page.close();
    });
    page.on('close', () => {
    });
}


async function inject(browser, page) {

    await page.waitForSelector(".Clear");
    // await page.addStyleTag({ content: '.odds{width: 30px;height: 41px;line-height: 41px;float: left;overflow: hidden;color: #333;} .asiaPan{width: 60px;} .asiaShan{margin-left:8px;}' })
    let matchData = await page.evaluate(() => {
        $(".fengxin1").each(function (idx, el) {
            var aArr = $(el).find("a");
            aArr[0].href = aArr[1].href + "?hook=30";
            aArr[2].href = aArr[1].href + "?hook=33";
            aArr[0].innerHTML = '<b color="red">30</b>'
            aArr[2].innerHTML = '<b color="red">33</b>'
        });
        /*
        var matchData = {};
        $(".more_weik:hidden").remove();
        let matchlist = $(".touzhu_1:visible");
        let oddsCount = 0;
        let asiaOddsCount = 0;
        for (var i = 0; i < matchlist.length; i++) {
            var divMatch = matchlist[i];
            var mId = divMatch.id;
            var id = mId.split("_")[1];
            //bet365 欧盘
            $.ajax({
                url: "/I/?method=ok.soccer.odds.GetProcess", data: {
                    "match_id": id,
                    "betting_type_id": 1,
                    "provider_id": 27
                }, method: 'POST', dataType: 'json', async: false, success: function (d) {
                    // console.log(d);
                    oddsCount++;
                    if (d.code) {
                        if (d.data && d.data.length > 0) {
                            var odds = d.data[d.data.length - 1].o;
                            if (!matchData[mId]) {
                                matchData[mId] = {};
                            }
                            matchData[mId]["divMatch"] = divMatch;
                            matchData[mId]["odds"] = odds;
                        } else {
                            console.log("--", d.data);
                        }
                    } else {
                        console.log("++", d);
                    }
                }
            });
            //bet365 亚盘
            $.ajax({
                url: "/I/?method=ok.soccer.odds.GetProcess", data: {
                    "match_id": id,
                    "betting_type_id": 2,
                    "provider_id": 27
                }, method: 'POST', dataType: 'json', async: false, success: function (d) {
                    // console.log(d);
                    asiaOddsCount++;
                    if (d.code) {
                        if (d.data && d.data.length > 0) {
                            var asiaOdds = d.data[d.data.length - 1].o;
                            asiaOdds.b = d.data[d.data.length - 1].b;
                            if (!matchData[mId]) {
                                matchData[mId] = {};
                            }
                            matchData[mId]["asiaOdds"] = asiaOdds;
                        } else {
                            console.log("--", d.data);
                        }
                    } else {
                        console.log("++", d);
                    }
                }
            });
        }
        
        function setData() {
            // console.log({asiaOddsCount,oddsCount,matchlist});
            if (asiaOddsCount == oddsCount && oddsCount == matchlist.length) {
                // console.log(matchData);
                for (var key in matchData) {
                    var divMatch = matchData[key].divMatch;
                    var odds = matchData[key].odds;
                    var asiaOdds = matchData[key].asiaOdds;
                    var html = [];
                    html.push('<div class="odds">' + odds.h + '</div>');
                    html.push('<div class="odds">' + odds.d + '</div>');
                    html.push('<div class="odds">' + odds.a + '</div>');
                    html.push('<div class="odds asiaShan">' + asiaOdds.h + '</div>');
                    html.push('<div class="odds asiaPan">' + asiaOdds.b + '</div>');
                    html.push('<div class="odds">' + asiaOdds.a + '</div>');
                    $(divMatch).find(".zhishu").html(html.join(""));
                }
            } else {
                console.log("数据没有加载完……");
                setTimeout(setData, 1000);
            }
        }
        setTimeout(setData, 1000);
        return matchData;*/
    });
    browser.on('targetcreated', async (target) => {
        console.log("browser targetcreated");
        let page = await target.page();
        let url = await target.url();
        // if (url.indexOf("isHistory=") != -1) {
        //     await page.setRequestInterception(true);
        //     await page.on('request', interceptedRequest => {
        //         let currentUrl = interceptedRequest.url();
        //         if (currentUrl.indexOf("baidu.com") != -1 || currentUrl.indexOf("www.google") != -1 || currentUrl.indexOf("baidustatic.com") != -1) {
        //             interceptedRequest.abort();   //终止请求
        //             return;
        //         }
        //         let fileName = currentUrl.split("/").pop().split("?")[0];
        //         if (fileName.indexOf(";abort") != -1) {
        //             interceptedRequest.continue();//弹出
        //             return;
        //         }
        //         // console.log("准备拦截检查。。。。" );
        //         //判断如果是 图片请求  就直接拦截  
        //         if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.ico') || fileName.endsWith('.jpeg') || fileName.endsWith('.gif') || fileName.endsWith('.bmp')) {
        //             // console.log("确认拦截1：" + fileName);
        //             interceptedRequest.abort();   //终止请求
        //         } else if (fileName.endsWith(".css")) {
        //             // console.log("确认拦截2：" + fileName);
        //             interceptedRequest.abort();   //终止请求
        //         } else if (fileName.endsWith(".php")) {
        //             // console.log("确认拦截3：" + fileName);
        //             interceptedRequest.abort();   //终止请求
        //         } else if (fileName.endsWith(".woff2")) {
        //             // console.log("确认拦截3：" + fileName);
        //             interceptedRequest.abort();   //终止请求
        //         }
        //         else {
        //             // console.log("不满足条件，不拦截2" + fileName);
        //             interceptedRequest.continue();//弹出
        //         }
        //     });
        // }
        await addEvent(page, url).catch((e) => {
            if (e.message.indexOf('on\' of null') == -1) {
                Logger.error(e)
            }
        });

    });
    browser.on('targetchanged', async (target) => {
        console.log("browser targetchanged");
        let page = await target.page();
        let url = await target.url();
        let data = await addEvent(page, url).catch((e) => {
            if (e.message.indexOf('on\' of null') == -1) {
                Logger.error(e)
            }
        });

    });
}

(async () => {

    const Puppeteer = require('puppeteer');
    await Puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 966
        },
        //ignoreDefaultArgs: ["--enable-automation"]
        // devtools: true

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

        await page.goto("http://www.okooo.com/jingcai/");

        await inject(browser, page);

        //await browser.close();

        Logger.info("程序运行完毕，进入结束");


        //await process.exit();

    });
})();