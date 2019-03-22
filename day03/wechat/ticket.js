/*定义获取ticket的模块*/

// 引入第三方模块 来发送GET请求
const rp = require('request-promise-native');
// 通过fs模块 来保存和读取accessToken的值
const {writeFileAsync,readFileAsync} = require('../utils/tools');

const readAccessToken = require('./accessToken');

// 发送请求、获取access_token，保存起来，设置过期时间
async function getTicket() {
    const {access_token} = await readAccessToken()
    //定义请求
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    //发送请求 下载 request request-promise-native包
    //异步任务 获取accessToken 不可能一瞬间获取完 所以需要用async
    const result = await rp({method: 'GET', url, json: true});
    // 设置过期时间 2小时更新，提前5分钟刷新
    result.expires_in = Date.now() + 7200000 - 300000;
    const ticket = {
        ticket: result.ticket,
        expires_in: result.expires_in
    }
    // console.log(result);
    //保存为一个文件 ---> 只能保存字符串数据，JS
// 读取TicketON.stringify()将js对象转换为json字符串
    await writeFileAsync('./ticket.txt', ticket);
   return ticket;
}

function readTicket() {
    return readFileAsync('./ticket.txt')
        .then(res =>{
            if (res.expires_in < Date.now()){
               return getTicket()
            } else {
                return res;
            }
        })
        .catch(err =>{
            return getTicket()
        })
}

// (async () => {
//     const result = await getTicket();
//     console.log(result);
// })()
module.exports = readTicket ;
//http://www.wxeditor.com/emoji