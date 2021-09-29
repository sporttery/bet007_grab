//window.console = window.console || {};
//console.log || (console.log = opera.postError);
$(document).ready(function () {
    //$("#dv_nb_jc").on("click", function () { commonObj.alertTips("频道即将上线，敬请期待"); }).css({"cursor":"pointer"});
    //$("#dv_nb_tj").on("click", function () { commonObj.alertTips("频道即将上线，敬请期待"); }).css({ "cursor": "pointer" });
    $("#lnk_tj_tips").on("click", function () { commonObj.alertTips("频道即将上线，敬请期待"); }).css({ "cursor": "pointer" });
});
var commonObj = {
    getUrlParas: function (reqUrl, paraName) {
        var vars = [], hash;
        var hashes = reqUrl.slice(reqUrl.indexOf('?') + 1).split('&');
        try {
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars[paraName];
        } catch (e) {
            return "";
        }
    },
    showtime: function () {
        if (timer > 0) {
            $(".rg_vc_btn").text("再等" + timer + "秒");
            $(".rg_vc_btn").attr("disabled", true);
            $(".rg_vc_btn").css("pointer-events", "none");
            $(".rg_vc_btn").attr("class", "rg_vc_btn brbg");
            timer = timer - 1;
            timerID = setTimeout("commonObj.showtime()", 1000);
        }
        else {
            clearTimeout(timerID);
            $('.rg_vc_btn').removeAttr("disabled");
            $('.rg_vc_btn').attr("class", "rg_vc_btn yelbg");
            $(".rg_vc_btn").css("pointer-events", "");
            $(".rg_vc_btn").text("获取验证码");
        }
    },
    showtime2: function () {
    if (timer2 > 0) {
        $(".rg_vc_btn2").text("再等" + timer2 + "秒");
        $(".rg_vc_btn2").attr("disabled", true);
        $(".rg_vc_btn2").css("pointer-events", "none");
        $(".rg_vc_btn2").attr("class", "rg_vc_btn2 brbg");
        timer2 = timer2 - 1;
        timer2ID = setTimeout("commonObj.showtime2()", 1000);
    }
    else {
        clearTimeout(timer2ID);
        $('.rg_vc_btn2').removeAttr("disabled");
        $('.rg_vc_btn2').attr("class", "rg_vc_btn2 yelbg");
        $(".rg_vc_btn2").css("pointer-events", "");
        $(".rg_vc_btn2").text("获取验证码");
    }
    },
    alertTips: function (content,jumpUrl)
    {
        $.dialog({
            type: "tips",
            showTitle: false,
            contentHtml: content
        });
        setTimeout(function () { $.dialog.close(); if (typeof (jumpUrl) != "undefined" && jumpUrl != "") location.href = jumpUrl; }, 3000);
    }

}

var bankObj = {
    init: function () {
        banks = new Array("");
        banks.push("中国工商银行");
        banks.push("中国建设银行");
        banks.push("中国农业银行");
        banks.push("招商银行");
        banks.push("中国银行");
        banks.push("交通银行");
        banks.push("广发银行");
        banks.push("中信银行");
        banks.push("中国光大银行");
        banks.push("中国民生银行");
        banks.push("平安银行");
        banks.push("华夏银行");
        banks.push("兴业银行");
        banks.push("农村信用合作社");
        banks.push("上海浦东发展银行");
        banks.push("中国邮政储蓄银行");
        banks.push("东亚银行");
        var str = "<div id='dv_add_banks' style='width:100%;overflow:hidden;'><ul class='k_menu_f'>";
        for (var i = 1; i < banks.length; i++) {
            str += "<li class='b" + i + "'><a href='javascript:' onclick=\"bankObj.putBank('" + banks[i] + "');\"><span class='icon'></span><div class='text'>" + banks[i] + (i <= 4 ? "<span class='sp_tj'></span>" : "") + "</div><span class='arrow'></span></a></li>"
        }
        str += "</ul></div>";
        if ($("#add_banks").find("div[id='dv_add_banks']").length == 0) {
            $("#add_banks").append(str);
        }
        $("#b1_close").on("click", function () {
            $("#dv_center").css("display", "block");
            $("#dv_center").animate({ left: '0px' }, 300);
            $("#add_banks").animate({ left: '100%' }, 300, function () {
                $(this).hide();
            });
        });
    },
    putBank: function (v) {
        $("#bank").val(v);
        //if (v == "中国银行" || v == "平安银行" || v == "华夏银行" || v == "兴业银行" || v == "农村信用合作社" || v == "上海浦东发展银行" || v == "中国邮政储蓄银行" || v == "东亚银行") {
            $("#b_branch_0").show();
            $("#b_branch_1").show();
            $("#b_branch_2").show();
            $("#b_branch_3").show();
        /*}
        else {
            $("#b_branch_0").hide();
            $("#b_branch_1").hide();
            $("#b_branch_2").hide();
            $("#b_branch_3").hide();
            $("#region").val("");
            $("#bankaddr").val("");

        }*/
        $("#dv_center").css("display", "block");
        $("#dv_center").animate({ left: '0px' }, 300);
        $("#add_banks").animate({ left: '100%' }, 300, function () {
            $(this).hide();
        });
    }
}

var branch = {
    init: function () {
        regions.push({ province: "北京市", citys: "东城区|西城区|崇文区|宣武区|朝阳区|丰台区|石景山|海淀区|门头沟|房山区|通州区|顺义区|昌平区|大兴区|平谷区|怀柔区|密云区|延庆" });
        regions.push({ province: "上海市", citys: "黄浦区|卢湾区|徐汇区|长宁区|静安区|普陀区|闸北区|虹口区|杨浦区|闵行区|宝山区|嘉定区|浦东区|金山区|松江区|青浦区|南汇区|奉贤区|崇明" });
        regions.push({ province: "天津市", citys: "和平区|东丽区|河东区|西青区|河西区|津南区|南开区|北辰区|河北区|武清区|红挢区|塘沽区|汉沽区|大港区|宁河区|静海区|宝坻区|蓟县|滨海新区" });
        regions.push({ province: "重庆市", citys: "万州区|涪陵区|渝中区|大渡口区|江北区|沙坪坝区|九龙坡区|南岸区|北碚区|万盛区|双挢区|渝北区|巴南区|黔江区|长寿区|綦江县|潼南区县|铜梁县|大足县|荣昌县|壁山县|梁平县|城口县|丰都县|垫江县|武隆县|忠县县|开县县|云阳县|奉节县|巫山县|巫溪县|石柱县|秀山县|酉阳县|彭水县|江津县|合川县|永川县|南川县" });
        regions.push({ province: "河北省", citys: "石家庄市|邯郸市|邢台市|保定市|张家口|承德市|廊坊市|唐山市|秦皇岛|沧州市|衡水市" });
        regions.push({ province: "山西省", citys: "太原市|大同市|阳泉市|长治市|晋城市|朔州市|吕梁市|忻州市|晋中市|临汾市|运城市" });
        regions.push({ province: "内蒙古", citys: "呼和浩特市|包头市|乌海市|赤峰市|通辽市|呼伦贝尔市|阿拉善盟|哲里木盟|兴安盟市|乌兰察布市|锡林郭勒盟|巴彦淖尔市|伊克昭盟|鄂尔多斯市" });
        regions.push({ province: "辽宁省", citys: "沈阳市|大连市|鞍山市|抚顺市|本溪市|丹东市|锦州市|营口市|阜新市|辽阳市|盘锦市|铁岭市|朝阳市|葫芦岛" });
        regions.push({ province: "吉林省", citys: "长春市|吉林市|四平市|辽源市|通化市|白山市|松原市|白城市|延边市" });
        regions.push({ province: "黑龙江", citys: "哈尔滨市|齐齐哈尔市|牡丹江市|佳木斯市|大庆市|绥化市|鹤岗市|鸡西市|黑河市|双鸭山市|伊春市|七台河市|大兴安岭市" });
        regions.push({ province: "江苏省", citys: "南京市|镇江市|苏州市|南通市|扬州市|盐城市|徐州市|连云港|常州市|无锡市|宿迁市|泰州市|淮安市" });
        regions.push({ province: "浙江省", citys: "杭州市|宁波市|温州市|嘉兴市|湖州市|绍兴市|金华市|衢州市|舟山市|台州市|丽水市" });
        regions.push({ province: "安徽省", citys: "合肥市|芜湖市|蚌埠市|马鞍山|淮北市|铜陵市|安庆市|黄山市|滁州市|宿州市|池州市|淮南市|巢湖市|阜阳市|六安市|宣城市|亳州市" });
        regions.push({ province: "福建省", citys: "福州市|厦门市|莆田市|三明市|泉州市|漳州市|南平市|龙岩市|宁德市" });
        regions.push({ province: "江西省", citys: "南昌市|景德镇|九江市|鹰潭市|萍乡市|新余市|赣州市|吉安市|宜春市|抚州市|上饶市" });
        regions.push({ province: "山东省", citys: "济南市|青岛市|淄博市|枣庄市|东营市|烟台市|潍坊市|济宁市|泰安市|威海市|日照市|莱芜市|临沂市|德州市|聊城市|滨州市|菏泽市" });
        regions.push({ province: "河南省", citys: "郑州市|开封市|洛阳市|平顶山市|安阳市|鹤壁市|新乡市|焦作市|濮阳市|许昌市|漯河市|三门峡|南阳市|商丘市|信阳市|周口市|驻马店市|济源市" });
        regions.push({ province: "湖北省", citys: "武汉市|宜昌市|荆州市|襄樊市|黄石市|荆门市|黄冈市|十堰市|恩施市|潜江市|天门市|仙桃市|随州市|咸宁市|孝感市|鄂州市" });
        regions.push({ province: "湖南省", citys: "长沙市|常德市|株洲市|湘潭市|衡阳市|岳阳市|邵阳市|益阳市|娄底市|怀化市|郴州市|永州市|湘西市|张家界市" });
        regions.push({ province: "广东省", citys: "广州市|深圳市|珠海市|汕头市|东莞市|中山市|佛山市|韶关市|江门市|湛江市|茂名市|肇庆市|惠州市|梅州市|汕尾市|河源市|阳江市|清远市|潮州市|揭阳市|云浮市" });
        regions.push({ province: "广西", citys: "南宁市|柳州市|桂林市|梧州市|北海市|防城港市|钦州市|贵港市|玉林市|南宁地区|柳州地区|贺州市|百色市|河池市|来宾市|崇左市" });
        regions.push({ province: "海南省", citys: "海口市|三亚市|儋州市|五指山市|文昌市|琼海市|万宁市|东方市|定安县|屯昌县|澄迈县|临高县|琼中县|保亭自治县|白沙县|昌江县|乐东县|陵水县" });
        regions.push({ province: "四川省", citys: "成都市|绵阳市|德阳市|自贡市|攀枝花市|广元市|内江市|乐山市|南充市|宜宾市|广安市|达州市|雅安市|眉山市|甘孜州|凉山州|泸州市|阿坝州|资阳市|巴中市|遂宁市" });
        regions.push({ province: "贵州省", citys: "贵阳市|六盘水|遵义市|安顺市|铜仁市|黔西南|毕节市|黔东南|黔南" });
        regions.push({ province: "云南省", citys: "昆明市|大理市|曲靖市|玉溪市|昭通市|楚雄市|红河市|文山市|普洱市|西双版纳|保山市|德宏市|丽江市|怒江市|迪庆市|临沧市" });
        regions.push({ province: "西藏", citys: "拉萨市|日喀则地区|山南地区|林芝地区|昌都市|阿里市|那曲市" });
        regions.push({ province: "陕西省", citys: "西安市|宝鸡市|咸阳市|铜川市|渭南市|延安市|榆林市|汉中市|安康市|商洛" });
        regions.push({ province: "甘肃省", citys: "兰州市|嘉峪关市|金昌市|白银市|天水市|酒泉市|张掖市|武威市|定西市|陇南市|平凉市|庆阳市|临夏市|甘南市" });
        regions.push({ province: "宁夏", citys: "银川市|石嘴山市|吴忠市|固原市|中卫市" });
        regions.push({ province: "青海省", citys: "西宁市|海东地区|海南藏族自治州|海北藏族自治州|黄南藏族自治州|玉树藏族自治州|果洛藏族自治州|海西蒙古族藏族自治州" });
        regions.push({ province: "新疆", citys: "乌鲁木齐市|石河子市|克拉玛依市|伊犁哈萨克自治州|巴音郭勒市|昌吉回族自治州|克孜勒苏柯尔克孜自治州|博尔塔拉蒙古自治州|吐鲁番地区|哈密地区|喀什地区|和田地区|阿克苏地区" });
        regions.push({ province: "香港", citys: "香港特别行政区" });
        regions.push({ province: "澳门", citys: "澳门特别行政区" });
        regions.push({ province: "台湾省", citys: "台北市|高雄市|台中市|台南市|屏东市|南投市|云林市|新竹市|彰化县|苗栗县|嘉义县|花莲县|桃园县|宜兰县|基隆市|台东县|金门县|马祖县|澎湖县" });
        if ($("#add_branch").find("div[class='cs_region']").length == 0) {
            $.each(regions, function (i, r) {
                var str = "<div class='cs_region'> <a href='javascript:' class='cs_region_title'><div>" + r.province + "</div></a>"
                + "<div class='cs_region_cont'><ul>";
                var item = "";
                $.each(r.citys.split("|"), function (j, c) {
                    item += "<li><div><a href='javascript:' v='" + r.province + "'>" + c + "</a></div></li>";
                });
                str += item;
                str + "<ul>";
                str + "</div>";
                str + "</div>";
                $("#add_branch").append(str);
            });
        }
        $(".cs_region_title").unbind("click").bind("click", function () {
            $(".cs_region_cont").slideUp("fast");
            $(this).next().show();
        });
        $(".cs_region_cont ul li div a").unbind("click").bind("click", function () {
            $("#region").val($(this).attr("v") + $(this).text());
            $("#province").val($(this).attr("v"));
            $("#city").val($(this).text());
            $("#dv_center").css("display", "block");
            $("#dv_center").animate({ left: '0px' }, 300);
            $("#add_branch").animate({ left: '100%' }, 300, function () {
                $(this).hide();
            });
        });
        $("#b2_close").on("click", function () {
            $("#dv_center").css("display", "block");
            $("#dv_center").animate({ left: '0px' }, "slow");
            $("#add_branch").animate({ left: '100%' }, 300 , function () {
                $(this).hide();
            });
        });
        $("#province").val("");
        $("#city").val("");
    }
}

var PersonalDlg = {
    show: function (otions) {
        if ($(".perDlg").length > 0) {
            $(".perDlg").remove();
            $("#peroverlay").remove();
        }
        var DlgHTML = "";
        var actName = "";
        if (typeof (otions) != "undefined" && otions != "") {
            var ppDlg = eval(otions);
            if (typeof (ppDlg) != "undefined") {
                actName = ppDlg.name;
                //if (typeof (ppDlg.title) != "undefined" && ppDlg.title != "")
                //    DlgHTML = DlgHTML.replace("验证支付密码", ppDlg.title);
                if (typeof (ppDlg.hcontent) != "undefined" && ppDlg.hcontent != "")
                    DlgHTML = ppDlg.hcontent;
            }
        }

        $("body").append(DlgHTML);
        $(".perDlg").slideDown(300);
        $("#percancel").click(function () { PersonalDlg.close(); });
        $("#perok").click(function () {
            var nn = Math.random();
            if (actName == "hideusername")//隐藏用户名
            {
                var hidelength = escape($("#hidelength").val());
                $.post("ImportantHandler.ashx?n=" + nn,
               {
                   action: actName,
                   hidelength: escape(hidelength),
               },
               function (resultObj, status) {
                   if (resultObj.ErrCode == 0) {
                       var retObj = eval(resultObj.Data);
                       commonObj.alertTips(retObj.msg, (typeof (retObj.jumpUrl) != "undefined" && retObj.jumpUrl != null && retObj.jumpUrl != "" ? retObj.jumpUrl : ""));
                       setTimeout(PersonalDlg.close(),200);
                   }
                   else
                       alert(resultObj.ErrMsg);
               },
               "json"
               );
                return false;
            }
            else {
               var txtcontent = escape($("#txtcontent").val());
                $.post("UserHandler.ashx?n=" + nn,
               {
                   action: actName,
                   txtcontent: txtcontent,
               },
               function (resultObj, status) {
                   if (resultObj.ErrCode == 0) {
                       var retObj = eval(resultObj.Data);
                       commonObj.alertTips(retObj.msg, (typeof (retObj.jumpUrl) != "undefined"  && retObj.jumpUrl != null && retObj.jumpUrl != "" ? retObj.jumpUrl : ""));
                   }
                   else
                       alert(resultObj.ErrMsg);
               },
               "json"
               );
                return false;
            }
        });
        $("#peroverlay").click(function () { PersonalDlg.close(); });
        $("#txtcontent").keyup(function () {
            PersonalDlg.checkinp();
        });
        PersonalDlg.checkinp();
    },
    close: function () {
        $(".perDlg").slideUp(300, function () {
            $("#peroverlay").remove();
            $(".perDlg").remove();
        });
        PersonalDlg.SuccessCallBack = function () { }; //清空
    },
    checkinp: function () {
        if ($("#txtcontent").val() != "") {
            $("#perok").removeAttr("disabled");
            $("#perok").removeClass("perok").addClass("perorg");
        } else {
            $("#perok").attr("disabled", "disabled");
            $("#perok").removeClass("perorg").addClass("perok");
        }
    },
    SuccessCallBack: function () {
    },
    resetPosition: function () {
        $(".perDlg").css("bottom",(document.body.clientHeight - $(".payDlg").height()) /2 + "px");
    }
}
