
function hidemaskd() {
    $(".randompanel").hide();
    $(".rmaskd").hide();
}

function openbuyfilter() {
    var selBalls = GetSelballs();
    if (selBalls.BlueBallDans.length > 0 || selBalls.RebBallDans.length > 0) {
        alert("过滤不可以设胆");
        return;
    }
    if (selBalls.RebBalls.length < 6) {
        alert("过滤投注前区个数不能少于6个");
        return;
    }
    if (selBalls.BlueBalls.length < 2) {
        alert("过滤投注后区个数不能少于2个");
        return;
    }
    $("#filter_rbtext").html(selBalls.RebBalls.join(","));
    $("#filter_bbtext").html(selBalls.BlueBalls.join(","));
    var noteCount = CaldltNoteCount(selBalls);
    $("#filter_notetext").html(noteCount + "注，" + (noteCount * 2) + "元");
    $("#filtedatasource").attr("filterdata", ChangedltTzObj(selBalls).TzText);
    var FilterList = new Array();
    FilterList.push({ name: "中5保4", filterType: "5_4", zhongLen: 5, daoLen: 4 });
    FilterList.push({ name: "中5保3", filterType: "5_3", zhongLen: 5, daoLen: 3 });
    FilterList.push({ name: "中4保4", filterType: "4_4", zhongLen: 4, daoLen: 4 });
    // var rbfiltercount =  CountShrinkNoteCount(20,selBalls.RebBalls.length,)
    $("#filterlist").html("");
    for (var i = 0; i < FilterList.length; i++) {
        var rbfiltercount = CountShrinkNoteCount(20, selBalls.RebBalls.length, FilterList[i].zhongLen, FilterList[i].daoLen);
        if (rbfiltercount > 0) {
            var filternotecount = rbfiltercount * CalBallCount(selBalls.BlueBalls.length, selBalls.BlueBallDans.length, 2);
            var filtercost = filternotecount * 2;
            var itemHtml = "<li class='filterli'>"
   + "<div class='floatrow' >"
             + "<div class='filter-check-col'><input class='radfilter' type='radio'  name='filtertype' value='" + FilterList[i].filterType + "'  filternotecount='" + filternotecount + "' onclick='countfiltermoney()' /></div>"
             + "<div class='filter-info-item'>" + FilterList[i].name + "。过滤后：共<span class='sred'>" + filternotecount + "</span>注<span class='sred'>" + filtercost + "</span>元<span class='span-floatright'><em class='arrow-right'></em></span></div>"
         + "</div>"
     + "</li>";
            $("#filterlist").append(itemHtml);
        }
    };
    $($(".filterli .radfilter")[0]).prop("checked", true);
    pagePanel.open("filtercontent");

    $(".filter-info-item").click(function () {
        $("#filterdatalist").attr("filterdata", $("#filtedatasource").attr("filterdata"));
        $("#filterdatalist").attr("filtertype", $(this).parent().parent().find(".radfilter").val());
        $("#filterdatalist").attr("pageIndex", 1);
        $("#filterdatalist").attr("hasNext","true")
        $("#filterdatalist").html("<div class='floatrow filter-title' ><div class='filter-index-col'>序号</div><div class='filter-data-item'>单注内容</div></div>");
        pagePanel.open("filterlistpanel");
        function loadfilerdata() {
            if ($("#filterdatalist").attr("hasNext") == "true") {
                var RequestObj = new Object();
                RequestObj.pageIndex = parseInt($("#filterdatalist").attr("pageIndex"));
                RequestObj.params = new Object();
                var tzcontent = tzTextToSzcContent($("#filterdatalist").attr("filterdata"));
                RequestObj.params.content = tzcontent.content;
                RequestObj.params.filterType = $("#filterdatalist").attr("filtertype");
                RequestObj.params.lotteryType = LotteryType;
                $.ajax({
                    type: "post",
                    data: { action: "filterlist", filterdata: JSON.stringify(RequestObj) },
                    url: window.location.href,
                    success: function (data) {
                        var ResultObj = eval("(" + data + ")");
                        if (ResultObj.resultCode == 100) {
                            console.log(ResultObj);
                            $("#filterdatalist").attr("pageIndex", parseInt($("#filterdatalist").attr("pageIndex")) + 1);
                            $("#filterdatalist").attr("hasNext", ResultObj.body.hasNext);
                            var HTML_Arr = new Array();
                            var records = ResultObj.body.records;
                            for (var i = 0; i < records.length; i++) {
                                HTML_Arr.push("<div class='floatrow' ><div class='filter-index-col'>" + records[i].index + "</div><div class='filter-data-item'><span class='sred'>" + records[i].details.split("+")[0] + "</span> + <span class='sblue'>" + records[i].details.split("+")[1] + "</span></div></div>");
                            }
                            $("#filterdatalist").append(HTML_Arr.join(""));

                        }
                        else {
                            alert(ResultObj.message)
                        }
                    },
                    error: function (data) {
                        console.info("error: " + data.responseText);
                    }
                });
            }
        }
        loadfilerdata();
        ScrollDo.init(document.body, null, loadfilerdata, null, null);
    });

    countfiltermoney();
}

function countfiltermoney() {
    var filternotecount = parseInt($('.radfilter:checked').attr("filternotecount"));
    if (isNaN(filternotecount)) filternotecount = 0;
    var filtertimes = parseInt($("#filtertimes").val());
    $("#filter_notecount_total").html(filternotecount);
    var isAppend = false;
    if ($("#filterisAppend").prop("checked")) isAppend = true;
    var filter_amount_total = filternotecount * (isAppend ? 3 : 2) * filtertimes;
    $("#filter_amount_total").html(filter_amount_total);

}

//倍投时计算金额
function countfilterTimes(obj) {
    LimitTimes(obj);
    countfiltermoney();
}


function zhuihao1() {
    var buydatalist = new Array();
    var buyliArr = $("#buylist .buyitem");
    if (buyliArr.length == 0)
    {
        alert("未有投注内容");
        return;
    }
    var notecountTotal = 0;
    for (var i = 0; i < buyliArr.length; i++) {
        var buydata = $(buyliArr[i]).attr("buydata");
        buydatalist.push(buydata);
        notecountTotal = notecountTotal + parseInt(buydata.match(/(\d*)注/)[1]);
    }
    var zhuihaodata = buydatalist.join(";");
    createzhuihao(10, zhuihaodata, notecountTotal, "");
}
function zhuihao2() {
    var zhuihaodata = $("#filtedatasource").attr("filterdata");
    var zhuihaodataNoteCount = parseInt($('.radfilter:checked').attr("filternotecount"));
    var filterType = $('.radfilter:checked').val();
    createzhuihao(10, zhuihaodata, zhuihaodataNoteCount, filterType);
}

function createzhuihao(zhiuhaoCount, zhuihaodata, zhuihaodataNoteCount, filterType) {
    $("#zhuihaocontent").attr("zhuihaodata", zhuihaodata);
    $("#zhuihaocontent").attr("filterType", filterType);
    $("#zhuihaocontent").attr("zhuihaodataNoteCount", zhuihaodataNoteCount);
    openzhuihao(zhiuhaoCount);
}

function openzhuihao(zhiuhaoCount) {
    pagePanel.open("zhuihaocontent");
    $(".zhuihaoul").find(".zhuihaoitem").remove(); //清空旧数据
    $(".zhuihaoul").append(GetZhuiHaoItemHtml(saledata.currentIssue)); //添加当前期
    for (var i = 0; i < saledata.presaleIssues.length; i++) {
        $(".zhuihaoul").append(GetZhuiHaoItemHtml(saledata.presaleIssues[i])); //添加其他期
    }
    var zhuihaoArr = $(".zhuihaoitem");
    for (var i = 0; i < zhuihaoArr.length && i < zhiuhaoCount ; i++) {
        $(zhuihaoArr[i]).find(".chkissue").prop("checked", true);
    };
    countzhuihaomoney();
}

function setzhuihaocount(zhiuhaoCount) {
    $(".zhuihaoitem .chkissue").prop("checked", false);
    var zhuihaoArr = $(".zhuihaoitem");
    for (var i = 0; i < zhuihaoArr.length && i < zhiuhaoCount ; i++) {
        $(zhuihaoArr[i]).find(".chkissue").prop("checked", true);
    };
    countzhuihaomoney();
}

function ChangeZhuihaoCount(obj) {
    var iCount = parseInt(obj.value);
    if (isNaN(iCount)) {
        iCount = 1;
        obj.value = 1;
        setzhuihaocount(iCount);
        obj.focus();
        obj.select();
    } else {
        obj.value = iCount;
        setzhuihaocount(iCount);
    }

}

///转换大乐透投注信息
function ChangedltTzObj(SelBallsObj) {
    var rst = new Object();
    rst.SelBallsObj = SelBallsObj;
    var buyscheme = SelBallsObj.RebBallDans.length > 0 ? "(" + SelBallsObj.RebBallDans.join(",") + ")" : "";
    buyscheme += SelBallsObj.RebBalls.join(",");
    buyscheme += "+";
    buyscheme += SelBallsObj.BlueBallDans.length > 0 ? "(" + SelBallsObj.BlueBallDans.join(",") + ")" : "";
    buyscheme += SelBallsObj.BlueBalls.join(",");
    var NoteCount = CaldltNoteCount(SelBallsObj);
    var Notetext = "[" + NoteCount + "注," + NoteCount * 2 + "元]";
    rst.NoteCount = NoteCount;
    rst.rbText = buyscheme.split("+")[0]; //红球显示格式
    rst.bbText = buyscheme.split("+")[1]; //篮球显示格式
    rst.TzText = buyscheme + Notetext; //投注显示格式
    return rst;
}

function GetZhuiHaoItemHtml(IssueObj) {
    var liHtml = "<li id='zhliitem" + IssueObj.id + "' class='zhuihaoitem' issueid='" + IssueObj.id + "' >"
         + "<div class='zhitemd' >"
              + "<div class='zhitemcol zh-data-col1'><input id='issue_chk_" + IssueObj.id + "' class='chk_1 chkissue' type='checkbox' onclick='countzhuihaomoney()' /><label for='issue_chk_" + IssueObj.id + "'><span class='chk_css_ico'></span>" + IssueObj.shortName + "</label></div>"
              + "<div class='zhitemcol zh-data-col2'><span class='addbtn' onclick='addzhuihaotimes(-1," + IssueObj.id + ")' >-</span><input class='zhtimes'  onkeyup='countzhuihaotime(this)'  type='text' value='1' /><span class='addbtn' onclick='addzhuihaotimes(1," + IssueObj.id + ")'>+</span></div>"
              + "<div class='zhitemcol zh-data-col3'><span class='zhcost'>0</span></div>"
              + "<div class='zhitemcol zh-data-col4'><span class='zhcostsum'>0</span></div>"
          + "</div>"
      + "</li>";
    return liHtml;
}

function countzhuihaomoney() {
    var zhuihaoArr = $(".zhuihaoitem");
    var isAppend = false;
    if ($("#huihaoisAppend").prop("checked")) isAppend = true;
    var zhuihaodataNoteCount = parseInt($("#zhuihaocontent").attr("zhuihaodataNoteCount"));
    var zhcostnum = 0;
    var zhuihaoIssueCount = 0;
    var zhuihao_amount_total = 0;
    for (var i = 0; i < zhuihaoArr.length; i++) {
        var zhtimes = parseInt($(zhuihaoArr[i]).find(".zhtimes").val());
        var zhcost = zhuihaodataNoteCount * (isAppend ? 3 : 2) * zhtimes;
        $(zhuihaoArr[i]).find(".zhcost").html(zhcost);
        zhcostnum = zhcostnum + zhcost;
        $(zhuihaoArr[i]).find(".zhcostsum").html(zhcostnum);
        if ($(zhuihaoArr[i]).find(".chkissue").prop("checked")) {
            zhuihaoIssueCount++;
            zhuihao_amount_total = zhuihao_amount_total + zhcost;
        }
    };
    $("#zhuihaocountinp").val(zhuihaoIssueCount);
    $("#zhuihaoIssueCount").html(zhuihaoIssueCount);
    $("#zhuihao_amount_total").html((isNaN(zhuihao_amount_total) ? 0 : zhuihao_amount_total));
}

function addzhuihaotimes(addnum, issueid) {
    var zhuihaoli = $("#zhliitem" + issueid)
    var zhtimes_el = $(zhuihaoli).find(".zhtimes");
    var times = parseInt($(zhtimes_el).val()) + addnum;
    if (times < 1) times = 1;
    if (times > 99) times = 99;
    $(zhtimes_el).val(times);
    var amount_total = parseInt($("#amount_total").val());
    countzhuihaomoney();
}

function countzhuihaotime(obj) {
    LimitTimes(obj);
    countzhuihaomoney();
}

function LimitTimes(obj) {
    var maxTimes = 99;
    if (obj.value != "") {
        var iCount = parseInt(obj.value);
        if (isNaN(iCount)) {
            iCount = 1;
            obj.value = 1;
            obj.select();
        } else {
            if (iCount > maxTimes) iCount = maxTimes;
            obj.value = iCount;
        }
    }
}

//倍投时计算金额
function countTimes(obj) {
    LimitTimes(obj);
    countMoney();
}

function countMoney() {
    var cost = 0;
    var noteCount_total = 0;
    var tz_count = 0;
    $("#buylist .buyitem").each(function () {
        var buydata = $(this).attr("buydata");
        noteCount_total = noteCount_total + parseInt(buydata.match(/(\d*)注/)[1]);
        tz_count = tz_count + 1;
    });
    if (tz_count > 0) {
        $(".listcount .tz-count").remove();
        $(".listcount").append("<span class='tz-count'>" + tz_count + "</span>");
    } else {
        $(".listcount .tz-count").remove();
    }
    var isAppend = false;
    if ($("#isAppend").prop("checked")) isAppend = true;
    cost = noteCount_total * (isAppend ? 3 : 2) * parseInt($("#times").val());
    $("#notecount_total").html((isNaN(noteCount_total) ? 0 : noteCount_total));
    $("#amount_total").html((isNaN(cost) ? 0 : cost));
}

function tzTextToSzcContent(tztext) {
    var buydata = tztext;
    var dltcontent = new DigContents();
    dltcontent.playType = 0;
    dltcontent.units = parseInt(buydata.match(/(\d*)注/)[1]);
    dltcontent.content = null;
    var dig = new DigContent();
    var tztext = buydata.split("[")[0];
    //红球--------------------------------
    var rbtext = tztext.split("+")[0]; //红球
    var rbArr = rbtext.split(")");
    if (rbArr.length == 2) {
        rbtext = rbArr[1];
        //处理胆
        var Part0_requiredArray = rbArr[0].replace(/\(/, "").split(",");
        for (var i = 0; i < Part0_requiredArray.length; i++) {
            var part0_r_item = new OptionalArray();
            part0_r_item.index = parseInt(Part0_requiredArray[i]) - 1;
            part0_r_item.part = 0;
            dig.requiredArray.push(part0_r_item);
        }
    }
    //正常投注码
    var Part0_optionalArray = rbtext.split(",");
    for (var i = 0; i < Part0_optionalArray.length; i++) {
        var part0_r_item = new OptionalArray();
        part0_r_item.index = parseInt(Part0_optionalArray[i]) - 1;
        part0_r_item.part = 0;
        dig.optionalArray.push(part0_r_item);
    }

    //蓝球-----------------------------------------------
    var bbtext = tztext.split("+")[1]; //篮球       
    var bbArr = bbtext.split(")");
    if (bbArr.length == 2) {
        bbtext = bbArr[1]; //
        //处理胆
        var Part1_requiredArray = bbArr[0].replace(/\(/, "").split(",");
        for (var i = 0; i < Part1_requiredArray.length; i++) {
            var part1_b_item = new OptionalArray();
            part1_b_item.index = parseInt(Part1_requiredArray[i]) - 1;
            part1_b_item.part = 1;
            dig.requiredArray.push(part1_b_item);
        }
    }
    //正常投注码
    var Part1_optionalArray = bbtext.split(",");
    for (var i = 0; i < Part1_optionalArray.length; i++) {
        var part1_b_item = new OptionalArray();
        part1_b_item.index = parseInt(Part1_optionalArray[i]) - 1;
        part1_b_item.part = 1;
        dig.optionalArray.push(part1_b_item);
    }
    dltcontent.content = dig;
    return dltcontent;
}

function GetdltBuyObject(buytype) {
    //buytype = 1 为普通投注
    //buytype = 2 为追号投注
    //buytype = 3 为过滤投注
    var buyinfo = new LotteryBuyInfo();
    buyinfo.schemeContent = new DigSchemeContent();
    buyinfo.schemeContent.lotteryType = 10051;
    buyinfo.schemeContent.contents = new Array();
    var cost = 0;
    if (buytype == 3) {
        var szcContent = tzTextToSzcContent($("#filtedatasource").attr("filterdata"));
        buyinfo.schemeContent.contents.push(szcContent);
    } else if (buytype == 2) {
        var zhuihaodata = $("#zhuihaocontent").attr("zhuihaodata");
        var buydatalist = zhuihaodata.split(";");
        for (var i = 0; i < buydatalist.length; i++) {
            var szcContent = tzTextToSzcContent(buydatalist[i]);
            buyinfo.schemeContent.contents.push(szcContent);
        }
    } else {
        $("#buylist .buyitem").each(function () {
            var szcContent = tzTextToSzcContent($(this).attr("buydata"));
            buyinfo.schemeContent.contents.push(szcContent);
        });
    }

    return buyinfo;
}

function szcbuy(buytype) {
    //buytype = 1 为普通投注
    //buytype = 2 为追号投注
    //buytype = 3 为过滤投注
    if (isNaN(buytype)) buytype = 1;
    var dltdata = GetdltBuyObject(buytype);
    if (dltdata.schemeContent.contents.length <= 0)
    {
        alert("未选择投注选项");
        return;
    }
    if (buytype == 1) {        
        //-----------普通投注----------------
        if ($("#isAppend").prop("checked")) dltdata.schemeContent.append = true;
        // -----添加购买的期号-------------
        var CurIssue = new DigIssues();
        CurIssue.issueId = saledata.currentIssue.id; //当前期期号
        CurIssue.multiple = parseInt($("#times").val());
        dltdata.schemeContent.issues.push(CurIssue);
        dltdata.schemeContent.cost = parseInt($("#amount_total").html());
    } else if (buytype == 2) {
        var filterType = $("#zhuihaocontent").attr("filtertype");
        if (filterType) dltdata.schemeContent.filterType = filterType;
        //---------追号投注-----------------------------
        if ($("#huihaoisAppend").prop("checked")) dltdata.schemeContent.append = true;
        if ($("#iswonstop").prop("checked")) dltdata.schemeContent.wonStop = true;
        // -----添加购买的期号-------------
        var zhuihaoArr = $(".zhuihaoitem");
        for (var i = 0; i < zhuihaoArr.length; i++) {
            if ($(zhuihaoArr[i]).find(".chkissue").prop("checked")) {
                var zhtimes = parseInt($(zhuihaoArr[i]).find(".zhtimes").val());
                var oIssue = new DigIssues();
                oIssue.issueId = $(zhuihaoArr[i]).attr("issueid");
                oIssue.multiple = zhtimes;
                dltdata.schemeContent.issues.push(oIssue);  //添加
            }
        };
        dltdata.schemeContent.cost = parseInt($("#zhuihao_amount_total").html());
    } else if (buytype == 3) {
        if ($('.radfilter:checked').length == 0) {
            alert("未选择过滤条件");
            return;
        }
        //-------过滤投注------------
        if ($("#filterisAppend").prop("checked")) dltdata.schemeContent.append = true;
        // -----添加购买的期号-------------
        var CurIssue = new DigIssues();
        CurIssue.issueId = saledata.currentIssue.id; //当前期期号
        CurIssue.multiple = parseInt($("#filtertimes").val());
        dltdata.schemeContent.issues.push(CurIssue);
        dltdata.schemeContent.cost = parseInt($("#filter_amount_total").html());

        dltdata.schemeContent.filterType = $('.radfilter:checked').val();
    }
    buy(dltdata);
}



function gobackpaly() {
    pagePanel.goback();
}
function showbuycontent() {
    var updatedata = $("#addbuy").attr("update-data")
    if (updatedata) {        
        $("#addbuy").removeAttr("update-data");
    }
    $("#addbuy .addbuytext").html("确定");
    pagePanel.open("buycontent");
}

$("#addbuy").click(function () {
    var SelBallsObj = GetSelballs();
    if (SelBallsObj.RebBalls.length + SelBallsObj.RebBallDans.length < 5) {
        alert("前区至少5个号码");
        return;
    }
    if (SelBallsObj.BlueBalls.length + SelBallsObj.BlueBallDans.length < 2) {
        alert("后区至少2个号码");
        return;
    }
    var updatedata = $("#addbuy").attr("update-data")
    if (updatedata) {
        if (ChangedltTzObj(SelBallsObj).TzText != updatedata) {
            //新的投注内容与旧的投注内容不同则更新
            $("#buylist .buyitem[buydata='" + updatedata + "']").before(GetDltBuyItemHtml(SelBallsObj)); //在旧的前面插入新的
            $("#buylist .buyitem[buydata='" + updatedata + "']").remove();//删除旧的
        }
    } else {
        $("#buylist").append(GetDltBuyItemHtml(SelBallsObj));
    }
    countMoney();
    binditemclick();
    clearselball();
    showbuycontent();

});

function RamdomballsByBuyList() {
    $("#buylist").append(GetDltBuyItemHtml(GetRamdomballs()));
    countMoney();
    binditemclick();
}

function binditemclick() {
    $("#buylist .buy_content").unbind("click");
    $("#buylist .buy_content").click(function () {
        var redball = $(this).find(".rebballtext").html();
        var blueball = $(this).find(".blueballtext").html();
        var buydata = $(this).attr("buydata");
        var RList = redball.split(",");
        var BList = blueball.split(",");
        $(".rebballs .spanball").removeClass("sel").removeClass("dan");
        for (var i = 0; i < RList.length; i++) {
            $(".rebballs .spanball[num=" + RList[i] + "]").addClass("sel");
        }
        $(".blueballs .spanball").removeClass("sel").removeClass("dan");
        for (var i = 0; i < BList.length; i++) {
            $(".blueballs .spanball[num=" + BList[i] + "]").addClass("sel");
        }
        RefreshNoteCountData();
        pagePanel.gofirst();
        $("#addbuy").attr("update-data", buydata);
        $("#addbuy .addbuytext").html("修改");
    });
}

function removebuyitem(obj) {
    $(obj).parent().parent().remove();
    countMoney();
}

function GetDltBuyItemHtml(SelBallsObj) {
    var dltTzObj = ChangedltTzObj(SelBallsObj);
    var itemhtml = "<li  class='buyitem' buydata='" + dltTzObj.TzText + "' >"
             + "<div class='floatrow dlt-item-row'>"
             + "<div class='buy_remove' onclick='removebuyitem(this);'  ><span class='item-close'>x</span></div>"
             + "<div class='buy_content' buydata='" + dltTzObj.TzText + "' >"
                   + "<span class='rebballtext' >" + dltTzObj.rbText + "</span><br />"
                   + "<span class='blueballtext'>" + dltTzObj.bbText + "</span><br />"
                   + "<span class='noteinfo' >" + dltTzObj.NoteCount + "注，" + (dltTzObj.NoteCount * 2) + "元</span>"
               + "</div>"
               + "<div class='buy_right' ><em class='arrow-right'></em></div>"
           + "</div>"
       + "</li>"
    return itemhtml;
}

//随机投注的内容
function GetRamdomballs() {
    var Rst = CreateBallsObject();
    var r_numList = GetNumList(1, 35);
    Rst.RebBalls = GetRanDomArr(r_numList, 5, false);
    Rst.RebBalls.sort();
    var b_numList = GetNumList(1, 12);
    Rst.BlueBalls = GetRanDomArr(b_numList, 2, false);
    Rst.BlueBalls.sort();
    return Rst;
}

function CreateBallsObject() {
    var Rst = new Object();
    Rst.RebBalls = new Array();
    Rst.RebBallDans = new Array();
    Rst.BlueBalls = new Array();
    Rst.BlueBallDans = new Array();
    return Rst;
}

//选中的内容
function GetSelballs() {
    var Rst = CreateBallsObject();
    var AllRebBalls = $(".rebballs .spanball");
    var AllBlueBalls = $(".blueballs .spanball");
    for (var i = 0; i < AllRebBalls.length; i++) {
        var el_ball = AllRebBalls[i];
        if ($(el_ball).hasClass("sel")) Rst.RebBalls.push($(el_ball).attr("num"));
        if ($(el_ball).hasClass("dan")) Rst.RebBallDans.push($(el_ball).attr("num"));
    }
    for (var i = 0; i < AllBlueBalls.length; i++) {
        var el_ball = AllBlueBalls[i];
        if ($(el_ball).hasClass("sel")) Rst.BlueBalls.push($(el_ball).attr("num"));
        if ($(el_ball).hasClass("dan")) Rst.BlueBallDans.push($(el_ball).attr("num"));
    }
    return Rst;
}
$(".spanball").click(function () {
    if ($(this).hasClass("dan")) {
        $(this).removeClass("dan");
        $(this).text($(this).attr("num"));
    } else if ($(this).hasClass("sel")) {
        $(this).removeClass("sel");
        var SelBallsObj = GetSelballs();
        var color = $(this).attr("colordata");
        if (color == "red" && SelBallsObj.RebBallDans.length < 4) {
            $(this).addClass("dan");
            $(this).text("胆");
        } else if (color == "blue" && SelBallsObj.BlueBallDans.length < 1) {
            $(this).addClass("dan");
            $(this).text("胆");
        }
    } else {
        $(this).addClass("sel");
    }
    RefreshNoteCountData();
});
function showredrd() {
    if ($("#redrd").css("display") == "none") {
        $("#redrd").show();
        $(".rmaskd").show();
    } else {
        $("#redrd").hide();
        $(".rmaskd").hide();
    }
}
$(".redrandomlist .randombtn").click(function () {

    var RCount = parseInt($(this).attr("num"));
    $("#redrnum").html(RCount);
    GetRedRanDom();
    showredrd();
    RefreshNoteCountData();
});

function GetRedRanDom() {
    var RCount = parseInt($("#redrnum").html());
    var numList = GetNumList(1, 35);
    var RList = GetRanDomArr(numList, RCount, false);
    $(".rebballs .spanball").each(function () { $(this).html($(this).attr("num")) });
    $(".rebballs .spanball").removeClass("sel").removeClass("dan");
    for (var i = 0; i < RList.length; i++) {
        $(".rebballs .spanball[num=" + RList[i] + "]").addClass("sel");
    }
}

function showbluerd() {
    if ($("#bluerd").css("display") == "none") {
        $("#bluerd").show();
        $(".rmaskd").show();
    } else {
        $("#bluerd").hide();
        $(".rmaskd").hide();
    }
}
$(".bluerandomlist .randombtn").click(function () {
    var RCount = parseInt($(this).attr("num"));
    $("#bluernum").html(RCount);
    GetBlueRanDom();
    showbluerd();   
});

function GetBlueRanDom() { 
    var RCount = parseInt($("#bluernum").html());
    var numList = GetNumList(1, 12);
    var RList = GetRanDomArr(numList, RCount, false);
    $(".blueballs .spanball").each(function () { $(this).html($(this).attr("num")) });
    $(".blueballs .spanball").removeClass("sel").removeClass("dan");
    for (var i = 0; i < RList.length; i++) {
        $(".blueballs .spanball[num=" + RList[i] + "]").addClass("sel");
    }
    RefreshNoteCountData();
}

function RefreshNoteCountData() {
    var NoteCount = CalNoteCount();
    $("#note").html(NoteCount);
    $("#mount").html(NoteCount * 2);
}

function CalNoteCount() {
    var SelBallsObj = GetSelballs();
    return CaldltNoteCount(SelBallsObj);
}

function CaldltNoteCount(SelBallsObj) {
    if (SelBallsObj.RebBallDans.length > 4) {
        alert("红球胆个数不能超过4个");
        return 0;
    }
    if (SelBallsObj.BlueBallDans.length > 1) {
        alert("蓝球胆个数不能超过1个");
        return 0;
    }
    return CalBallCount(SelBallsObj.RebBalls.length, SelBallsObj.RebBallDans.length, 5) * CalBallCount(SelBallsObj.BlueBalls.length, SelBallsObj.BlueBallDans.length, 2);
}

function ClearAll() {
    $("#buylist").html("");
    countMoney();
}

function clearselball() {
    $(".spanball").each(function () {
        $(this).removeClass("sel").removeClass("dan");
        $(this).html($(this).attr("num"));
    });
    RefreshNoteCountData();
}

function RandromBalls() {
    if ($("#mainplay").css("display") != "none") {
        $(".spanball").each(function () { $(this).html($(this).attr("num")) });
        var Rst = GetRamdomballs();
        $(".rebballs .spanball").removeClass("sel").removeClass("dan");
        for (var i = 0; i < Rst.RebBalls.length; i++) {
            $(".rebballs .spanball[num=" + Rst.RebBalls[i] + "]").addClass("sel");
        }
        $(".blueballs .spanball").removeClass("sel").removeClass("dan");
        for (var i = 0; i < Rst.BlueBalls.length; i++) {
            $(".blueballs .spanball[num=" + Rst.BlueBalls[i] + "]").addClass("sel");
        }
        RefreshNoteCountData();
    }
};
YaoYiYao(RandromBalls);
