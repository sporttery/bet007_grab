//随机返回整数，MaxNum为最大值
function RandomNum(MaxNum) {
    var k = MaxNum;
    var mnum = 1;
    while (k > 1) {
        k = k / 10;
        mnum = mnum * 10
    }
    var MaxNum = MaxNum + 1;
    return Math.floor(Math.random() * mnum) % MaxNum
}


/*
  *获取数组
  */
function GetNumList(startnum, endnum) {
    var NumList = new Array();
    for (var i = startnum; i <= endnum; i++) {
        if (i < 10)
            NumList.push("0" + i.toString());
        else
            NumList.push(i.toString());
    }
    return NumList;
}

/*
*从DataArr数组中随机的返回Rcount个数。isCanRepeat是否可以重复标识
*/
function GetRanDomArr(DataArr, RCount, isCanRepeat) {
    var CopyArr = new Array();
    for (var i = 0; i < DataArr.length; i++) CopyArr.push(DataArr[i]);
    if (typeof (isCanRepeat) == "undefined") isCanRepeat = false;
    var rst = new Array();
    if (isCanRepeat == true) {
        for (var i = 0; i < RCount; i++) {
            var rnum = RandomNum(CopyArr.length - 1);
            rst.push(CopyArrr[rnum]);
        }
    } else {
        for (var i = 0; i < RCount; i++) {
            var rnum = RandomNum(CopyArr.length - 1);
            rst.push(CopyArr[rnum]);
            CopyArr.splice(rnum, 1); //删除元素
        }
    }
    return rst;
}

/*
* 递归做阶乘
*/
function multiplyN(N) {
    if (typeof (N) == "undefined") return 0;
    if (isNaN(N)) return 0;
    if (N == 0) {
        return 1;
    }else  if (N == 1) {
        return 1;
    } else {
        return N * multiplyN(N - 1)
    }
}

/*
*组合，结果返回数组
*
*/
function C_Cal(arr, num) {
    var r = [];
    (function f(t, a, n) {
        if (n == 0) {
            return r.push(t);
        }
        for (var i = 0, l = a.length; i <= l - n; i++) {
            f(t.concat(a[i]), a.slice(i + 1), n - 1);
        }
    })([], arr, num);
    return r;
}

/*
*组合，返回计算结果
*/
function C_CalNum(M, N) {
    if (M == N) {
        return 1;
    } else {
        return multiplyN(M) / (multiplyN(M - N) * multiplyN(N));
    };
}

/*
*排列，结果返回数组
*
*/
function P_Cal(arr, num) {
    var r = [];
    (function f(t, a, n) {
        if (n == 0) {
            return r.push(t);
        }
        for (var i = 0, l = a.length; i < l; i++) {
            f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
        }
    })([], arr, num);
    return r;
}

function P_CalNum(M, N) {
        return multiplyN(M) / multiplyN(M - N);    
}

/*
*笛卡尔积，结果返回数组
*/
function Descartes(list) {
    //var aa = [1, 2, 3], bb = [1, 2, 3], cc = [1, 2, 3], dd = [1, 2, 3];
    //var list = [aa, bb, cc, dd];//此处数组个数任意
    var result = new Array();//结果保存到这个数组
    function toResult(arrIndex, aresult) {
        if (arrIndex >= list.length) { result.push(aresult); return; };
        var aArr = list[arrIndex];
        if (!aresult) aresult = new Array();
        for (var i = 0; i < aArr.length; i++) {
            var theResult = aresult.slice(0, aresult.length);
            theResult.push(aArr[i]);
            toResult(arrIndex + 1, theResult);
        }
    }
    toResult(0);//函数执行后result数组
    return result;
}

/*
*计算取M个数组（包含胆）的注数
* BallCount：选中的个数，不包括胆的数量在内。
* DanCount：选中的胆个数。
* M:在其中选M个数组合
*/
function CalBallCount(BallCount, DanCount, M) {
    if (DanCount > M) {
        return 0;
    }
    if (DanCount == M) return 1;
    var N = M - DanCount;
    if (BallCount < N) return 0;
    return C_CalNum(BallCount, N);
}

/*
*/
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i-- && i>=0) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

/****滑动到上、下、左、you最边缘处触发时间***/
var ScrollDo = {
    Start_X: 0,
    Start_Y: 0,
    End_X: 0,
    End_Y: 0,
    Move_X: 0,
    Move_Y: 0,
    elArr: [],
    IsInit: false,
    IsStartExe: false, //开始处理
    TimeoutExeCallBack: function () {
        if (ScrollDo.IsStartExe) {
            if (ScrollDo.RepeatCount < 20) {
                ScrollDo.RepeatCount++;
                setTimeout(ScrollDo.ExeCallBack, 100);
            } else {
                ScrollDo.RepeatCount = 0;
                ScrollDo.IsStartExe = false;
            }
        } else {
            ScrollDo.RepeatCount = 0;
        }
    },
    RepeatCount: 0,
    IsExeBottomCallBack: false,
    ExeCallBack: function () {
        for (i = 0; i < ScrollDo.elArr.length; i++) {
            var elObj = ScrollDo.elArr[i];
            if (typeof (elObj.BottomCallBack) == "function") {
                //滑动到底部执行
                if (elObj.IsExeBottomCallBack == false && (ScrollDo.getScrollHeight() <= ScrollDo.getScrollTop() + ScrollDo.getClientHeight() + 80)) {
                    elObj.IsExeBottomCallBack = true
                    ScrollDo.RepeatCount = 0;
                    elObj.BottomCallBack();
                    ScrollDo.IsStartExe = false;
                }
            }
        }
        ScrollDo.TimeoutExeCallBack();
    },
    init: function (el, TopCallBack, BottomCallBack, LeftCallBack, RightCallBack) {
        if (!ScrollDo.IsInit) {
            document.addEventListener('touchstart', ScrollDo.ListenTouch, false);
            document.addEventListener('touchend', ScrollDo.ListenTouch, false);
            ScrollDo.IsInit = true;
        }
        if (el) {
            var elObj = new Object();
            elObj.el = el;
            elObj.IsExeBottomCallBack = false;
            elObj.IsExeTopCallBack = false;
            elObj.IsExeLeftCallBack = false;
            elObj.IsExeRightCallBack = false;
            elObj.BottomCallBack = BottomCallBack;
            elObj.TopCallBack = TopCallBack;
            elObj.LeftCallBack = LeftCallBack;
            elObj.RightCallBack = RightCallBack;
            ScrollDo.elArr.push(elObj);
        }
    },
    getScrollTop: function () {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    },
    getScrollHeight: function () {
        return document.documentElement.scrollHeight;
    },
    getClientHeight: function () {
        return $(window).height();
    },
    StartCallBack: function () {
        if (ScrollDo.IsStartExe == false) {
            ScrollDo.IsStartExe = true; //开始执行
            ScrollDo.RepeatCount = 0;
            ScrollDo.ExeCallBack();
        }
    },
    ListenTouch: function (event) {
        var event = event || window.event;
        switch (event.type) {
            case "touchstart":
                ScrollDo.Start_X = event.touches[0].clientX;
                ScrollDo.Start_Y = event.touches[0].clientY;
                break;
            case "touchend":
                ScrollDo.End_X = event.changedTouches[0].clientX;
                ScrollDo.End_Y = event.changedTouches[0].clientY;
                ScrollDo.ExeTouch();
                break;
            case "touchmove":
                ScrollDo.Move_X = event.touches[0].clientX;
                ScrollDo.Move_Y = event.touches[0].clientY;
                break;
        }
    },
    ExeTouch: function () {
        if (ScrollDo.Start_Y - ScrollDo.End_Y > 50) {
            for (i = 0; i < ScrollDo.elArr.length; i++) {
                var elObj = ScrollDo.elArr[i];
                elObj.IsExeBottomCallBack = false;
            }
            ScrollDo.StartCallBack();
            //  alert("上划");
        }
        if (ScrollDo.End_Y - ScrollDo.Start_Y > 50) {
            // alert("下拉");
        }
        if (ScrollDo.Start_X - ScrollDo.End_X > 50) {
            // alert("向左划");
        }
        if (ScrollDo.End_X - ScrollDo.Start_X > 50) {
            // alert("向右划");
        }
    }

}
