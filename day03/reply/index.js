const sha1 = require('sha1');
const {getUserDataAsync , parseXMLData, formatJsData} = require('../utils/tools');
const template = require('./template');
const  handleResponse = require('./handleResponse');
const token = require('../config/index')
module.exports = ( ) =>{
    return async (req,res) =>{
        //微信服务器发送过来的请求参数
        console.log(req.query);
        const { signature, echostr, timestamp, nonce } = req.query;
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
            console.log('666')
            //处理用户发过来的信息，返回响应
            const xmlData =await getUserDataAsync(req);
            // 将xml数据转换为js对象
            const jsData = parseXMLData(xmlData);
            //进一步处理数据
            const newData = formatJsData(jsData);
            //实现自动回复
            const option = handleResponse(newData) ;
            console.log(newData);
            const replyMessage = template(option);
            // console.log(replyMessage);
            //返回响应
            res.send(replyMessage)
        } else {
            res.end('error')
        }
    }
}
