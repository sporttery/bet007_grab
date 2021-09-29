$.get("/analysis/1316918sb.htm", function (d) {
    var titleIdx = d.indexOf("</title>");
    var title = d.substring(0, titleIdx);
    var season = title.match(/[(].*[)]/);
    var leagueName = "";
    if (!season) {
        var seasonIdxStart = d.indexOf("<div class=\"header\">");
        if (seasonIdxStart == -1) {
            seasonIdxStart = d.indexOf("<div class=\"t1p1\">");
        }
        var seasonIdxEnd = d.indexOf("<div id=\"porletP_Group\">");
        if (seasonIdxStart != -1 && seasonIdxEnd > seasonIdxStart) {
            var seasonHtml = d.substring(seasonIdxStart, seasonIdxEnd);
            var aArr = $(seasonHtml).find("a");
            var season = $(seasonHtml).find(".LName").text();
            for (var i = 0; i < aArr.length; i++) {
                var txt = $(aArr[i]).text();
                if (txt.indexOf("资料库") != -1) {
                    cc = aArr[i].href.match(/\d{4}(-\d{4})?/);
                    if (!season || season == "") {
                        season = txt.replace("资料库", "").trim();
                    }
                    if (cc) {
                        leagueName = season + "(" + cc[0] + ")";
                    }
                    break;
                }
            }
        }
    }else{
        leagueName = season[0];
    }
    var start = d.indexOf('var lang');
    var end = d.indexOf('var h2_data');
    d = d.substring(start, end);
    eval(d);
    hRace = com_init_vs_data_new('h', 30);
    aRace = com_init_vs_data_new('a', 30);
    hTop3 = h_data.slice(0, 3);
    aTop3 = a_data.slice(0, 3);
    $.get("/analysis/odds/1316918.htm?"+(+new Date),function(d){
       var oddsText = $(d).find("#iframeAOdds").val();
       var oddsArr = oddsText.split("^");
       
    })
})

function com_init_vs_data_new(id, count) {
    var data = [];
    if (id == "h")
        data = h_data;
    else
        data = a_data;

    var allGoal = 0, allLossGoal = 0, winNum = 0, drawNum = 0, lossNum = 0, hgCount = 0, hgGoal = 0, hgLossGoal = 0, hgWin = 0, hgDraw = 0, hgLoss = 0;
    for (var a = 0; a < count; a++) {
        if ((id == "h" && h2h_home == data[a][4]) || (id == "a" && h2h_away == data[a][4])) {
            allGoal += parseInt(data[a][8]);
            allLossGoal += parseInt(data[a][9]);
            if (parseInt(data[a][8]) > parseInt(data[a][9])) {
                winNum += 1;
                if (id == "h")
                    hgWin += 1;
            }
            else if (parseInt(data[a][8]) == parseInt(data[a][9])) {
                drawNum += 1;
                if (id == "h")
                    hgDraw += 1;
            }
            else {
                lossNum += 1;
                if (id == "h")
                    hgLoss += 1;
            }
            if (id == "h") {
                hgCount += 1;
                hgGoal += parseInt(data[a][8]);
                hgLossGoal += parseInt(data[a][9]);
            }
        }
        else if ((id == "h" && h2h_home == data[a][6]) || (id == "a" && h2h_away == data[a][6])) {
            allGoal += parseInt(data[a][9]);
            allLossGoal += parseInt(data[a][8]);
            if (parseInt(data[a][9]) > parseInt(data[a][8])) {
                winNum += 1;
                if (id == "a")
                    hgWin += 1;
            }
            else if (parseInt(data[a][8]) == parseInt(data[a][9])) {
                drawNum += 1;
                if (id == "a")
                    hgDraw += 1;
            }
            else {
                lossNum += 1;
                if (id == "a")
                    hgLoss += 1;
            }
            if (id == "a") {
                hgCount += 1;
                hgGoal += parseInt(data[a][9]);
                hgLossGoal += parseInt(data[a][8]);
            }
        }
    }
    winRace = count > 0 ? Math.floor(winNum / count * 1000) / 10 + "%" : "";
    drawRace = count > 0 ? Math.floor(drawNum / count * 1000) / 10 + "%" : "";
    return { winRace, drawRace }
}
