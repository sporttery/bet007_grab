var http = require('http');
var fs = require('fs');
const DBHelper = require("./DBHelper")
var mobileData = {
    acceptmobile: "17740651711",
    citycode: "0127",
    lowconsumption: "0.0",
    numbergrade: "L0",
    numdeposit: "0.0",
    numstatus: "F",
    poolcode: "G0000001",
    poolname: "集团号池"
};
var result;
var server = http.createServer(function (req, res) {
    let data = [];
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*"
    });
    req.on('data', chunk => {
        if (chunk)
            data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', async () => {
        if (data.length > 0) {
            if (data.join("").trim()[0] == '{') {
                // console.log(data.join("").toString());
                var cdata = JSON.parse(data.join("").trim()) // 数据传输完，打印数据的内容
                if (cdata) {
                    if (cdata.code == "1" && cdata.data.list) {
                        var values = [];
                        for (var i = 0; i < cdata.data.list.length; i++) {
                            mobileData = cdata.data.list[i];
                            var value = [mobileData.acceptmobile, mobileData.citycode, mobileData.lowconsumption, mobileData.numbergrade, mobileData.numdeposit, mobileData.numstatus, mobileData.poolcode, mobileData.poolname];
                            values.push("('" + value.join("','") + "')");
                        }
                        result = await DBHelper.query("insert into t_phone_number(id,citycode,lowconsumption,numbergrade,numdeposit,numstatus,poolcode,poolname) values " + values.join(",") + " on duplicate key update num = num + 1;");
                        res.end("结果：" + JSON.stringify(result));
                    } else {
                        res.end("success:" + data.join(""));
                    }
                } else {
                    res.end("success:" + data.join(""));
                }

            } else {
                res.end("success:" + data.join(""));
                return;
            }
        } else {
            res.end("no data");
            return;
        }
        data = [];
    })

}).listen(8888);
console.log('Server running at http://127.0.0.1:8888/');

//http://wap.hb.189.cn/o2oNum/index.html
//界面脚本
var retry = 0;
function loadNums() {
    $.ajax({
        type: 'GET',
        url: api_url_perfix + '/o2onum/list.action',
        data: $("#myform").serializeArray(),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.code == "1") {
                $.post("http://127.0.0.1:8888/abc.jsp", JSON.stringify(data), (rc) => {
                    console.info(rc);
                    var ncIdx = rc.indexOf('{');
                    if (ncIdx != -1) {
                        nc = JSON.parse(rc.substring(ncIdx));
                       
                        if (nc.affectedRows && nc.affectedRows != nc.changedRows * 2) {
                            retry = 0;
                            loadNums()
                        } else if (retry++ < 4) {
                            console.log(retry);
                            loadNums();
                        } else {
                            retry = 0;
                            var searchnum = $("#searchnum").val();
                            searchnum = parseInt(searchnum) + 11;
                            if (!isNaN(searchnum) && searchnum < 10000) {
                                $("#searchnum").trigger("click").val(searchnum).trigger("change");
                                console.log($("#searchnum").val())
                                loadNums();
                            } else {
                                console.log("game over")
                            }

                        }
                    }
                })
            }
        },
        error: function () {
            $("#phlist").html("暂无号码");
        }
    });
}
//loadNums()