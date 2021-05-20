

const fs = require("fs");
const path = require("path");

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function saveFile(url, txt) {
    var filename = url.split("?")[0];
    if (filename[0] == '/') {
        filename = filename.substring(1);
    }
    if(mkdirsSync(path.dirname(filename))){
        fs.writeFileSync(filename, txt);
    }
}


saveFile("/jsData/abc/def/123.js","test");