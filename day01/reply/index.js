const sha1 = require('sha1');
const {getUserDataAsync , parseXMLData, formatJsData} = require('../utils/tools');
const template = require('./template');
module.exports = ( ) =>{
    return async (req,res) =>{
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
            const xmlData =await getUserDataAsync(req);
            // 将xml数据转换为js对象
            console.log(xmlData)
            const jsData = parseXMLData(xmlData);
            //进一步处理数据
            const newData = formatJsData(jsData);
            //实现自动回复
            let option = {
                 toUserName: newData.FromUserName,
                 fromUserName: newData.ToUserName,
                 createTime: Date.now(),
                type : 'text',
                content: '警告！警告！阁下语义不明，请重新输入指令'
            }
            if ( newData.Content === '啦啦啦') {
                option.content = '我是卖报的小学生'
            } else if (newData.Content && newData.Content.indexOf('珂朵莉') !== -1){
                option.content = '世界上最幸福的女孩 \n is my'
            }
            if (newData.MsgType === 'image') {
                //将用户发送的图片，返回回去
                option.mediaId = newData.MediaId;
                option.type = 'image';
            }
            if (newData.MsgType === 'vice') {
                //将用户发送的语音，返回回去
                option.mediaId = newData.MediaId;
                option.type = 'vice';
            }
            const replyMessage = template(option);
            // console.log(replyMessage);
            //返回响应
            res.send(replyMessage)
        } else {
            res.end('error')
        }
    }
}
