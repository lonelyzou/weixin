//回复用户消息模板模块

module.exports = (option) =>{
    let replyMassage =`<xml>
                       <ToUserName><![CDATA[${option.toUserName}]]></ToUserName>
                       <FromUserName><![CDATA[${option.fromUserName}]]></FromUserName>
                       <CreateTime>${option.createTime}</CreateTime>
                       <MsgType><![CDATA[${option.type}]]></MsgType>`;

    if (option.type === 'text'){
        replyMassage +=`<Content><![CDATA[${option.content}]]></Content>`
    } else if (option.type === 'image') {
        replyMassage +=`  <Image><MediaId><![CDATA[${option.mediaId}]]></MediaId></Image>`
    } else if (option.type === 'voice'){
        replyMassage +=` <Voice><MediaId><![CDATA[${option.mediaId}]]></MediaId></Voice>`
    } else if (option.type === 'video'){
        replyMassage +=` <Video><MediaId><![CDATA[${option.mediaId}]]></MediaId>
                         <Title><![CDATA[${option.title}]]></Title>
                         <Description><![CDATA[${option.description}]]></Description></Video>`
    } else if (option.type === 'music'){
        replyMassage +=`  <Music><Title><![CDATA[${option.title}]]></Title>
                           <Description><![CDATA[${option.description}]]></Description>
                           <MusicUrl><![CDATA[${option.musicUrl}]]></MusicUrl>
                           <HQMusicUrl><![CDATA[${option.HQMusicUrl}]]></HQMusicUrl>
                           <ThumbMediaId><![CDATA[&{option.ThumbMediaId}]]></ThumbMediaId></Music>`
    } else if (option.type === 'news'){
      replyMassage +=`<ArticleCount>${option.content.length}</ArticleCount><Articles>`;
      replyMassage += option.content.reduce((prev,curr) =>{
          return prev + ` <item><Title><![CDATA[${curr.title}]]></Title>
                                  <Description><![CDATA[${curr.description}]]></Description>
                                  <PicUrl><![CDATA[${curr.picUrl}]]></PicUrl>
                                  <Url><![CDATA[${curr.url}]]></Url>
                           </item>`;
      })
        replyMassage +=`</Articles>`;
    }
    replyMassage +=`</xml>`
    return replyMassage;
}
