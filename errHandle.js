const errHandle = (res,headers,errTxt)=>{
    res.writeHead(400, headers);
    res.end(JSON.stringify({
        "status": "false",
        "msg": errTxt//輸入錯誤或查無此ID
    }));
}

module.exports = { errHandle };