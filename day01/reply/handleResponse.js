// 处理用户发送的消息，定义响应的数据

module.exports = (newData) =>{
    let option = {
        toUserName: newData.FromUserName,
        fromUserName: newData.ToUserName,
        createTime: Date.now(),
        type : 'text',
    }
    if (newData.MsgType === 'text'){
        if ( newData.Content === '啦啦啦') {
            option.content = '我是卖报的菲奥娜'
        } else if (newData.Content && newData.Content.indexOf('菲奥娜') !== -1){
            option.content = '我以荣誉之名前来杀你。即使你毫无荣誉可言，也一样得死'
        } else {
            option.content = '警告！警告！阁下语义不明，请重新输入指令'
        }
    }
    else if (newData.MsgType === 'image') {
        //将用户发送的图片，返回回去
        option.mediaId = newData.MediaId;
        和
    }
    else if (newData.MsgType === 'voice') {
        //将用户发送的语音，返回回去
        option.content = newData.Recognition ;
        if ( !option.content) {
            option.content = '不明白你在说什么，会说人话吗，大声点，召唤师' ;
        }
    }
    else if ( newData.MsgType === 'location') {
        option.content = `召唤师，这是你现在在峡谷中的位置:
                        \n地理位置纬度：${newData.Location_X}
                        \n地理位置经度: ${newData.Location_Y}
                        \n地图缩放大小: ${newData.Scale}
                        \n地理位置信息: ${newData.Label}`
    }
    else if (newData.MsgType === 'event'){
        if (newData.Event === 'subscribe'){
            // 用户订阅事件
           option.content = `欢迎来到召唤师峡谷，召唤师${newData.FromUserName}`;
           if ( newData.EventKey) {
               // 扫描带参数的二维码 --> 不是普通二维码  活动中使用
               options.content = '欢迎扫描召唤师峡谷二维码，来到召唤师峡谷';
           }
        } else if (newData.Event === 'unsubscribe'){
            console.log('他不关注你了');
            // 如果不给值， 微信服务器会请求三次
            option.content = '';
        } else if (newData.Event === 'CLICK'){
            // 用户点击菜单
            options.content = '用户点击了菜单~';
        }
    }
    return option;
}