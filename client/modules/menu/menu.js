'use strict';

/**
 * Profile module for user profile and related content.
 */

angular
    .module('wechat.menu', [
      'ngRoute',
      'koan.common',
      'wechat.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/menus', {
            title: '自定义菜单',
            templateUrl: 'modules/menu/menu.html',
            controller: 'MenuCtrl'
          });
    });