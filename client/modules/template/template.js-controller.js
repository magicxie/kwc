'use strict';

/**
 * Profile controller gives the user the means to view/edit their public profile info.
 */

angular.module('wechat.template').controller('TemplateCtrl',['$scope', '$http','$wechat', function ($scope, $http, $wechat) {
    // 'common' variable is always added to the root scope and it contains common things like user info, common functions etc.
    $http({method: 'GET', url: '/wechat/template/get'}).success(function(resp){

         console.log(resp);
    });


}]);
