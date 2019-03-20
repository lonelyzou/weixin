/*定义获取access_token的模块*/

// 引入第三方模块 来发送GET请求
const rp = require('request-promise-native');
// 通过fs模块 来保存和读取accessToken的值
const {writeFile,readFile} = require('fs');

// 发送请求、获取access_token，保存起来，设置过期时间
async function getAccessToken() {
    const appId = 'wxc1cbaf78c6ed19b2';
    const appSecret = '5a25802b5153be6c2299fc90637f4c96';
    //定义请求
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    //发送请求 下载 request request-promise-native包
    //异步任务 获取accessToken 不可能一瞬间获取完 所以需要用async
   const accessToken =await rp({method: 'GET', url, json: true});
    // 设置过期时间 2小时更新，提前5分钟刷新
    accessToken.expires_in = Date.now() + 7200000 -300000;
    // console.log(accessToken);
    //保存为一个文件 ---> 只能保存字符串数据，JSON.stringify()将js对象转换为json字符串
    writeFile('./accessToken.txt', JSON.stringify(accessToken), (err) => {
        if (!err) {
            console.log('文件保存成功');
        } else {
            console.log(err);
        }
    });
   return accessToken;
}
// 读取access_token
module.exports =
function readAccessToken() {
    return new Promise((resolve,reject) =>{
        readFile('./accessToken.txt',(err, data) => {
            if (!err){
                //data 返回的数据（Buffer）,toString()将data转成json,JSON.parse将字符串转成json对象,
               resolve(JSON.parse(data.toString())); //将data传给.then处理
            } else {
               reject(err);//将err传给.catch处理
            }
        })
    })
        .then(res =>{
            if (res.expires_in < Date.now()){
                console.log(res);
                //超过有效期
               return getAccessToken()
            } else {
                //没超过，继续使用原AccessToken

                return res;

            }
        })
        .catch(err =>{
            return getAccessToken()
        })
}
// (async () => {
//   const result = await readAccessToken();
//   console.log(result);
// })()
//http://www.wxeditor.com/emoji