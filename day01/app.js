const express = require('express');
const app = express();
const reply = require('./reply/index');
/*
    微信要求验证开发者服务器的有效性，同样的开发者也得验证消息是否来自于微信服务器
    1）将token、timestamp、nonce三个参数进行字典序排序
    2）将三个参数字符串拼接成一个字符串进行sha1加密
    3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
*/
app.use(reply());
app.listen(3000, (err) =>{
    if(!err) {
        console.log('服务器已连接');
    } else {
        console.log(err);
    }
});