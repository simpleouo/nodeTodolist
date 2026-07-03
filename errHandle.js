const errHandle = (res,headers)=>{
    res.writeHead(400, headers);
    res.end(JSON.stringify({
        "status": "false",
        "msg": "輸入錯誤或查無此ID"
    }));
}

module.exports = { errHandle };