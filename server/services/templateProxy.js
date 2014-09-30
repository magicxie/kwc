/**
 * Created by magic on 2014/9/22.
 */

var mongo = require('../config/mongo');

function *template(){

    var template = {filter : 'function(){retrun true;}', tmpl : 'hi,${openid}'};
    var results = yield mongo.template.insert(template);

}
