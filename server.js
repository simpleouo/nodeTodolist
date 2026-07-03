const http = require("http");
const { v4: uuidv4 } = require('uuid');
const { errHandle } =require('./errHandle');

const todos=[];

const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Headers':'Content-Type, Authorization, Content-Length, x-requested-with',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PATCH, DELETE',
        'Content-Type': 'application/json'
    }

    let body = "";
    req.on('data',chunk=>body+=chunk);

    if (req.url == "/" && req.method == "GET") {
        res.writeHead(200, headers);
        res.end(JSON.stringify({
            "status": "false",
            "data": todos
        }))
    }else if(req.url == "/" && req.method == "POST"){
        req.on('end',()=>{
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined && title !== ""){
                    todos.push({
                        "id": uuidv4(),
                        title
                    });
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({
                        "status": "success",
                        "msg": "新增成功"
                    }));
                }else{
                    errHandle(res,headers,"欄位輸入錯誤");
                }
            }catch(err){
                errHandle(res,headers,"參數欄位輸入錯誤");
            }
        });
    }else if(req.url.startsWith("/todos/") && req.method == "PATCH"){
         req.on('end',()=>{
            try{
                const title = JSON.parse(body).title;
                const id = req.url.split("/").pop();
                const ind = todos.findIndex(item=>item.id == id);
                if(title !== undefined && title !== "" && ind!== -1){
                    todos[ind].title = title;
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({
                        "status": "success",
                        "msg": "編輯成功"
                    }));
                }else{
                    errHandle(res,headers,"輸入錯誤或查無此ID");
                }
            }catch(err){
                errHandle(res,headers,"參數輸入錯誤");
            }
         })
    }else if(req.url=="/" && req.method == "DELETE"){
        todos.length = 0;
        res.writeHead(200, headers);
        res.end(JSON.stringify({
            "status": "success",
            "msg": "已清除所有代辦清單"
        }));
    }else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
        const id = req.url.split("/").pop();
        const ind = todos.findIndex(item=>item.id == id);
        if(ind !== -1){
            todos.splice(ind,1);
            res.writeHead(200, headers);
            res.end(JSON.stringify({
                "status": "success",
                "msg": "刪除成功"
            }));
        }else{
            errHandle(res,headers,"查無此ID");
        }
    }else if(req.method == "OPTIONS"){
        res.writeHead(200, headers);
        res.end();
    }else{
        res.writeHead(404, headers);
        res.end(JSON.stringify({
            "status": "false",
            "msg": "OOPS！跑錯地方了！"
        }))
    }
});

server.listen(process.env.PORT || 3000);