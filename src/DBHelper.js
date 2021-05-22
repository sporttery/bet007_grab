const mysql = require("mysql")
const Logger = require('./Logger');
// const dbConfig = {
//     host: 'rdst1232w056y4nu19w8o.mysql.rds.aliyuncs.com',
//     port: 3306,
//     user: 'adm_zw',
//     password: '876543219',
//     database: 'bolool'
// };

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '876543219',
    database: 'bolool'
};

const pool = mysql.createPool(dbConfig);

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function (sql, values) {
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}


//这些字段，将放在重复时更新
const updateKey = { "fullscore": true, "halfscore": true, "result": true, "homeRank": true, "awayRank": true };


/**
 * 单个更新入库
 * @param model 
 */
async function saveModel(model, tableName = "t_match") {
    Logger.info("数据入库 " + tableName, model);
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
        sql += "ON DUPLICATE KEY UPDATE " + update.join(",") + ",version=version+1";
    } else {
        sql += "ON DUPLICATE KEY UPDATE version=version+1";
    }
    Logger.info("执行sql:" + sql.substring(0,200));
    Logger.info("参数 ：" + params.substring(0,200));
    let results = await query(sql, params);
    Logger.info("成功插入条数：" + JSON.stringify(results));
}


/**
 * 
 * @param modelArr 
 * 批量更新入库
 */
async function saveModelArr(modelArr, tableName = "t_match") {
    Logger.info("批量插入 " + tableName + ",共 ", modelArr.length);
    let columns = [], values = [], params = [], update = [], updateValue = [];
    var model = modelArr[0];
    for (var key in model) {
        columns.push(key);
        if (updateKey[key]) {
            update.push(key + "=?");
        }
    }
    var valuesArr = [];
    modelArr.forEach(model => {
        values = [];
        for (var key in model) {
            values.push("?");
            params.push(model[key]);
            if (updateKey[key]) {
                updateValue.push(model[key]);
            }
        }
        valuesArr.push("(" + values.join(",") + ")");
    });
    params = params.concat(updateValue);
    let sql = "insert into " + tableName + "(" + columns.join(",") + ") values " + valuesArr.join(",");
    if (update.length > 0) {
        sql += "ON DUPLICATE KEY UPDATE  version=version+1";
    }
    Logger.info("执行sql:" + sql.substring(0,200));
    Logger.info("参数 ：" + params.substring(0,200));
    let results = await query(sql, params);
    Logger.info("成功插入条数：" + JSON.stringify(results));
}

//先查询，再判断是否入库，根据主键查询
async function saveModelData(modelData, tableName, privateKey = "id") {
    var ids = Object.keys(modelData);
    //id 是int 类型
    var isIntId = !isNaN(ids[0]);
    var sql = "select " + privateKey + " from " + tableName + " where " + privateKey + " in ";

    if (isIntId) {
        sql += "(" + ids.join(",") + ")";
    } else {
        sql += "('" + ids.join("','") + "')";
    }

    let vals = await query(sql);
    if (typeof vals == "object") {
        vals.forEach(t => {
            delete modelData[t.id];
        });
        var modelArr = Object.values(modelData);
        if (modelArr.length > 0) {
            await saveModelArr(modelArr, tableName);
        }
    }
}

let closePool=async function(){
    await pool.end();
}

module.exports = {
    query,
    saveModel,
    saveModelArr,
    saveModelData,
    closePool
};