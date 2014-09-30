'use strict';

/**
 * Created with JetBrains WebStorm.
 * User: magic
 * Date: 14-8-10
 * Time: 下午10:36
 * To change this template use File | Settings | File Templates.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    xlmParser = require('../lib/xml'),
    request = require('co-request'),
    config = require('../config/config'),
    mongo = require('../config/mongo'),
    verifier = require('../services/verifier'),
    infrustaction = require('../services/infrustaction'),
    listener = require('../services/wechatListener'),
    debug = require('debug')('wechat-api');

// register koa routes
exports.init = function (app) {
    app.use(route.all('/wechat', verify));
    app.use(route.get('/wechat', echostr));
    app.use(route.post('/wechat', dispatchXml));
    app.use(route.all('/wechat/*', apiProxy));
    //app.use(route.get('/accessToken', getAccessToken));
};
function *verify(next) {

    var query = this.query;

    var isValidRequest = verifier.verify(query.signature, query.timestamp,query.nonce,config.wechat.token);
    debug('Is valid request? %s',isValidRequest);

    if(isValidRequest){
        yield next;
    }else{
        this.status = 400;
        this.body = 'Bad request';
    }
}

function *echostr(next) {
    debug('echostr is %s', this.query.echostr);
    this.body = this.query.echostr;
}

function *dispatchXml(next) {

    var body = yield xlmParser(this);
    debug('xml is ', body.xml);

    yield listener.onMessage(body.xml);

    this.body = body;
}

function *getAccessToken(){
    this.body = yield infrustaction.getAccessToken();
}

function *extractRequest() {

    var request = {
        method: this.method.toLowerCase(),
        path: this.url.replace('/wechat', ''),
        qs : this.query
    };
    if(this.method == 'POST') {
        let body = yield parse(this);
        debug('body is ', JSON.stringify(body));
        request['body'] =body;
    }
    return request;
}
function *apiProxy(){

    var req = yield extractRequest.call(this);

    debug('req is ', req);

    let response = yield infrustaction.apiProxy(req);

    debug('response is ', response.body);

    this.body = JSON.parse(response.body);

}