const express = require('express');
const sha1 = require('sha1');
const { parseString } =  require('xml2js');
const app = express();
/*
    1. 验证服务器的有效性：
        - url 开发者服务器地址
    通过ngrok工具将本地地址转化外网能访问的地址（内网穿透）
          指令： ngrok http 3000
    - token 尽量复杂一些就行

    微信要求验证开发者服务器的有效性，同样的开发者也得验证消息是否来自于微信服务器
    1）将token、timestamp、nonce三个参数进行字典序排序
    2）将三个参数字符串拼接成一个字符串进行sha1加密
    3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
*/
app.use(async (req,res) =>{
  //微信服务器发送过来的请求参数
    console.log(req.query);
    const { signature, echostr, timestamp, nonce } = req.query;
    const token = 'ChthollyInAvalon';
    // 1）将token、timestamp、nonce三个参数进行字典序排序
    const sortedArr = [token, timestamp, nonce].sort();
    // 2）将三个参数字符串拼接成一个字符串进行sha1加密
    const sha1Str = sha1(sortedArr.join('')) ;
    //判断请求是get(判断服务器) or post(响应用户信息)
    if (req.method === 'GET'){
        //开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (sha1Str === signature ){
            res.end(echostr);
        } else {
            res.end('error');
        }
    } else if (req.method === "POST") {
        //过滤掉不是微信服务器发过来的信息
        if ( sha1Str !== signature ){
            res.end('error');
            return;
        }
        //处理用户发过来的信息，返回响应

        const xmlData = await new Promise((resolve,reject) =>{
            let xmlData = '';
            req.on('data', data =>{
                // console.log(data.toString());
                xmlData +=data.toString();
                // console.log(xmlData);
            })
                .on('end', () =>{
                    //数据接收完成，将xmlData传出去
                    resolve(xmlData)
                })
        })
        // 将xml数据转换为js对象
        let jsData = null;
        //使用parseString包
        parseString(xmlData, {trim: true}, (err, result) =>{
            if (!err) {
                jsData = result;
            } else {
                jsData = {}
            }
        })
        //进一步处理数据
        const {xml} = jsData;
        let newData = { };
        for (let key in xml){
            const value = xml[ key];
            newData[key] = value[0];
        }
        // console.log(newData);
        //实现自动回复
       let content = '警告！警告！阁下语义不明，请重新输入指令' ;
       if ( newData.Content === '啦啦啦') {
           content = '我是卖报的小学生'
       } else if (newData.Content.indexOf('珂朵莉') !== -1){
           content = '世界上最幸福的女孩'
       }
       let replyMessage = `<xml>
      <ToUserName><![CDATA[${newData.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${newData.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>`
      //返回响应
        res.send(replyMessage)
    }
})
app.listen(3000, (err) =>{
    if(!err) {
        console.log('服务器已连接');
    } else {
        console.log(err);
    }
})