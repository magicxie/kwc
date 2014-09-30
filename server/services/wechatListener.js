/**
 * 消息和事件响应处理
 * Created by magic on 2014/9/14.
 */

var mongo = require('../config/mongo');
/**
 * 文本消息
 *

 参数	描述
 ToUserName	开发者微信号
 FromUserName	 发送方帐号（一个OpenID）
 CreateTime	 消息创建时间 （整型）
 MsgType	 text
 Content	 文本消息内容
 MsgId	 消息id，64位整型

 <xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName>
 <CreateTime>1348831860</CreateTime>
 <MsgType><![CDATA[text]]></MsgType>
 <Content><![CDATA[this is a test]]></Content>
 <MsgId>1234567890123456</MsgId>
 </xml>

 * @type {text}
 */
exports.text = function *text(message){
  console.log('Content is', message.Content);

}

/**
 * 图片消息
 * 参数	描述
 ToUserName	开发者微信号
 FromUserName	 发送方帐号（一个OpenID）
 CreateTime	 消息创建时间 （整型）
 MsgType	 image
 PicUrl	 图片链接
 MediaId	 图片消息媒体id，可以调用多媒体文件下载接口拉取数据。
 MsgId	 消息id，64位整型
 *
 <xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName>
 <CreateTime>1348831860</CreateTime>
 <MsgType><![CDATA[image]]></MsgType>
 <PicUrl><![CDATA[this is a url]]></PicUrl>
 <MediaId><![CDATA[media_id]]></MediaId>
 <MsgId>1234567890123456</MsgId>
 </xml>
 *
 * @param message
 */
exports.image = function *image(message){
    console.log('PicUrl is', message.PicUrl);
}

/**
 *语音消息
 *
 参数	描述
 ToUserName	开发者微信号
 FromUserName	 发送方帐号（一个OpenID）
 CreateTime	 消息创建时间 （整型）
 MsgType	 语音为voice
 MediaId	 语音消息媒体id，可以调用多媒体文件下载接口拉取数据。
 Format	 语音格式，如amr，speex等
 MsgID	 消息id，64位整型
 *
 <xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName>
 <CreateTime>1357290913</CreateTime>
 <MsgType><![CDATA[voice]]></MsgType>
 <MediaId><![CDATA[media_id]]></MediaId>
 <Format><![CDATA[Format]]></Format>
 <MsgId>1234567890123456</MsgId>
 </xml>
 *
 * @param message
 */
exports.voice = function *voice(message){
    console.log('MediaId is', message.MediaId);
}

exports.video = function *video(message){
    console.log('MediaId is', message.MediaId);
}

exports.location = function *location(message){
    console.log('Label is', message.Label);
}

exports.link = function *link(message){
    console.log('Url is', message.Url);
}

exports.event = function *event(message){
    console.log('Event is', message.Event);
}

exports.onMessage = function *dispatch(message){

    var msgType = message.MsgType;

    yield mongo.messages.insert(message);

    console.log(msgType);

    var messageHandler = exports[msgType];

    if(messageHandler){
        yield messageHandler(message);
    }
}