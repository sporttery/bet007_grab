const DBHelper = require("./DBHelper")

DBHelper.query("select distinct issue from t_danchang_match order by playtime asc").then(res => {
    console.info(res);
    DBHelper.closePool().then(console.info("finish...")).catch(e => {
        console.error("error:", e);
    });
})

