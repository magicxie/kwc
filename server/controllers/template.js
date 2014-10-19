/**
 * Created by magic on 2014/9/22.
 */
var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo');

exports.init = function (app) {
    app.use(route.post('/api/users', create));
};

function *create() {

}