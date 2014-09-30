"use strict"
/**
 * Created by magic on 2014/9/14.
 */

var request = require('co-request'),
    config = require('../config/config'),
    mongo = require('../config/mongo');

const WECHAT_URI = 'https://api.weixin.qq.com/cgi-bin';

function *saveAccessToken(resp) {
    var now = new Date();
    var expiryDate = new Date(now.getTime() + resp.expires_in * 1000);

    yield mongo.configs.save({_id: 'accessToken', accessToken: resp.access_token, expiryDate: expiryDate});
}
function *renewAccessToken() {
    var url = WECHAT_URI + '/token?grant_type=client_credential&appid=' +
        config.wechat.appID + '&secret=' + config.wechat.appsecret;

    var responseText = yield request.get(url);
    var resp = JSON.parse(responseText.body);

    console.log(resp);
    return resp;
}
function isAccessTokenStillAliveBy(expiryDate) {
    return expiryDate.getTime() - new Date().getTime() > 60000;
}
function *getAccessToken(){

    var accessToken = yield mongo.configs.findOne({_id: 'accessToken' });

    if (accessToken) {
        //1 minute
       if(isAccessTokenStillAliveBy(accessToken.expiryDate)) {
           return accessToken.accessToken;
       }
    }
    var resp = yield renewAccessToken();

    if(resp.errcode){
        throw new Error('get access token failed', resp.errcode, resp.errmsg);
    }else{
        yield saveAccessToken(resp);
        return resp.access_token;
    }
}

exports.getAccessToken = getAccessToken;

exports.apiProxy = function *apiProxy(req){

    console.log(req);

    var accessToken = yield getAccessToken();
    req['qs']['access_token'] = accessToken;

    return yield request[req.method]({
        url : WECHAT_URI + req.path ,
        body : JSON.stringify(req.body),
        qs : req.qs,
        headers: {
            'Content-type': 'application/json'
        }});

}