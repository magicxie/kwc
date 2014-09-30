'use strict';

/**
 * Profile controller gives the user the means to view/edit their public profile info.
 */

angular.module('wechat.menu').controller('MenuCtrl',['$scope', '$http','$wechat', function ($scope, $http, $wechat) {
    // 'common' variable is always added to the root scope and it contains common things like user info, common functions etc.
    $http({method: 'GET', url: '/wechat/menu/get'}).success(function(resp){

        resp.menu.button.map(function(e){
            e.sub_button.map(function(se){
               delete se.sub_button;
               return se;
            });
            return e;
        });
        $scope.menus = resp;
        console.log($scope.menus);
        if( $scope.menus.menu.button.length > 0) {
            $scope.bindForm(0);
        }

    });

    $scope.bindForm = function(level1, level2){

        var menu = $scope.menus.menu.button[level1];

        if(level2 != undefined){
            menu = menu.sub_button[level2];
        }
        $scope.level1 = level1;
        $scope.level2 = level2;

        $scope.currentMenu = menu;
    }

    $scope.addSubButton = function(level1){
        $scope.menus.menu.button[level1].sub_button.push({
            "type":"view","name":"新菜单","url":"","sub_button":[]}
        );

        $scope.currentMenu = $scope.menus.menu.button[level1].sub_button[$scope.menus.menu.button[level1].sub_button.length-1];

    }

    $scope.addButton = function(){
        $scope.menus.menu.button.push({
                "type":"click","name":"新菜单","key":"","sub_button":[]}
        );

        $scope.currentMenu = $scope.menus.menu.button[$scope.menus.menu.button.length-1];

    }

    $scope.remove = function(){

        if($scope.level2 != undefined){
            $scope.menus.menu.button[$scope.level1].sub_button.splice($scope.level2, 1);
        }else{
            $scope.menus.menu.button.splice($scope.level1, 1);
        }
        $scope.bindForm(0);

    }

    $scope.publish = function(){

        $scope.menuMsg = $scope.menuError = '';

        $http({method: 'POST', url: '/wechat/menu/create', data : angular.toJson($scope.menus.menu)})
        .success(function(resp){
            if(resp.errcode > 0) {
                $scope.menuError = $wechat.translateRetCode(resp.errcode, resp.errmsg);
            }else{
                $scope.menuMsg = $wechat.translateRetCode(resp.errcode, resp.errmsg);
            }
        })
        .error(function(resp){
             $scope.menuError = resp;
        });
    }
}]);
