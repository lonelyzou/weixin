/*自定义菜单*/
const accessToken = require('./accessToken');
const rp = require('request-promise-native');
const menu = {
    "button":[
        {
            "type":"click",  // 单击菜单
            "name":"首页🏃",
            "key":"home"
        },
        {
            "name":"菜单⚓",
            "sub_button":[
                {
                    "type":"view",  // 跳转到指定网址
                    "name":"官网✈",
                    "url":"https://lonelyzou.github.io/GoblinWarehouse/index.html"
                },
                {
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示🙎",
                    "key": "扫码带提示"
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件😏",
                    "key": "扫码推事件"
                },
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图📷",
                    "key": "rselfmenu_1_0"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图🔞",
                    "key": "rselfmenu_1_1"
                },
            ]
        },
        {
            "name":"菜单二🐼",
            "sub_button":[
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图💘",
                    "key": "rselfmenu_1_2"
                },
                {
                    "name": "发送位置🍭",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }
            ]
        },
    ]
}
// 微信创建新菜单前要把旧的删掉

/*创建菜单*/
async function createMenu() {
    //获取access_token
    const {access_token} =await accessToken();
    //定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
    //发送请求
    const result = await rp({method: 'POST', url, json: true, body: menu});
    return result;
}
/*删除菜单*/
async function deleteMenu() {
    //获取access_token
    const {access_token} =await accessToken();
    //定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`;
    //发送请求
    const result = await rp({method: 'GET', url, json: true});
    // console.log(result);
    return result;
}

/*创建用户标签*/
async function createTag(name) {
    const {access_token} =await accessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/tags/create?access_token=${access_token}`;
    const result = await rp({method: 'POST',url, json: true,body: {  tag: { name: name }}})
    return result;
}
/*用户备注，remark：备注名*/
async function userName(openid,remark) {
    const {access_token} =await accessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/user/info/updateremark?access_token=${access_token}`;
    const result = await rp({method: 'POST',url, json: true,body: {
            openid: openid,
            remark:remark
        }})
    return result
}
/*获取用户信息*/
async function userMassage(openid) {
    const {access_token} =await accessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    const result = await rp({method: 'GET',url, json: true })
    return result
}
/*获取多个用户信息*/
async function allUserMassage(openid1,openid2) {
    const {access_token} =await accessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=${access_token}`;
    const result = await rp({method: 'POST',url, json: true,body: {
            "user_list": [
                {
                    openid: openid1,
                    lang: "zh_CN"
                },
                {
                    openid: openid2,
                    "lang": "zh_CN"
                }
            ]
        } })
    return result
}
/*获取用户列表*/
async function userList(openid,nextopenid = '') {
    const {access_token} =await accessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}&next_openid=${nextopenid}`;
    const result = await rp({method: 'GET',url, json: true})
    return result
}
/*获取黑名单用户列表*/
async function getblacklist(beginopenid) {
    const {access_token} =await accessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/tags/members/getblacklist?access_token=${access_token}`;
    const result = await rp({method: 'POST',url, json: true,body: {"begin_openid":beginopenid}})
    return result
}

(async () => {
    // let result = await deleteMenu();
    // result = await createMenu();
    let result1 = await createTag('究极VIP用户');
    console.log(result1);
    let result2 = await userName(
        "obgK81eg7hqjNuHYOHu58vfAG0eI" ,"管理员的小跟班" );
    console.log(result2);
    let result3 = await userMassage("obgK81eg7hqjNuHYOHu58vfAG0eI");
    console.log(result3);
})()