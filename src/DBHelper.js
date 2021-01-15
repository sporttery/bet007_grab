const mysql = require("mysql")
const dbConfig = {
    host: 'rdst1232w056y4nu19w8o.mysql.rds.aliyuncs.com',
    port: 3306,
    user: 'adm_zw',
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

let closePool=async function(){
    await pool.end();
}

module.exports = {
    query,
    closePool
};