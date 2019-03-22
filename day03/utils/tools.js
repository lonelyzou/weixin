//工具函数模块
const { parseString } =  require('xml2js');
const {writeFile,readFile} = require('fs');
const { resolve } = require('path');
module.exports = {
    //获取用户发送的消息
    getUserDataAsync( req){
        return new Promise((resolve,reject) =>{
            let xmlData = '';
            req.on('data', data =>{
                xmlData +=data.toString();
            })
                .on('end', () =>{
                    //数据接收完成，将xmlData传出去
                    resolve(xmlData)
                })
        })
    },
    //将xml数据转换为js对象
    parseXMLData (xmlData){
        let jsData = null;
        parseString(xmlData, {trim: true}, (err, result) =>{
            if (!err) {
                jsData = result;
            } else {
                jsData = {}
            }
        })
        return jsData;
    },
    //进一步处理数据,将数据处理为友好的js对象
    formatJsData (jsData){
        const {xml} = jsData;
        let newData = { };
        for (let key in xml){
            const value = xml[ key];
            newData[key] = value[0];
        }
        return newData;
    },
    //写入文件方法
    writeFileAsync (path,data){
        path = resolve(__dirname,'../wechat',path);
        return new Promise((resolve,reject) =>{
            writeFile(path, JSON.stringify(data), (err) => {
                if (!err) resolve();
                else reject(err);
            });
        })
    },
    //读取文件方法
    readFileAsync (path){
        path = resolve(__dirname,'../wechat',path);
       return new Promise((resolve,reject) =>{
           readFile(path, (err, data) => {
               if (!err)  resolve(JSON.parse(data.toString()));
               else  reject(err);
           })
        })
    }
}